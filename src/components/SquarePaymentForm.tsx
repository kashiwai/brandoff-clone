'use client'

import { useState } from 'react'
import {
  PaymentForm,
  CreditCard,
  GooglePay,
  ApplePay,
} from 'react-square-web-payments-sdk'
import toast from 'react-hot-toast'

interface SquarePaymentFormProps {
  amount: number
  onPaymentSuccess: (paymentResult: any) => void
  onPaymentError: (error: any) => void
  customerInfo?: {
    email?: string
    phone?: string
    billingAddress?: any
    shippingAddress?: any
  }
  items?: any[]
}

export default function SquarePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  customerInfo,
  items,
}: SquarePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaymentSubmit = async (token: any) => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/payment/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: token.token,
          amount,
          items,
          customerInfo,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onPaymentSuccess(data.payment)
        toast.success('お支払いが完了しました！')
      } else {
        throw new Error(data.error || 'Payment failed')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      onPaymentError(error)
      toast.error('お支払いに失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  // Square application IDとlocation IDがない場合の開発環境用UI
  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || !process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Square決済の設定が必要です</h3>
        <div className="text-sm text-gray-600 space-y-2 mb-4">
          <p>Square決済を利用するには、以下の設定が必要です：</p>
          <ol className="text-left max-w-md mx-auto mt-3 space-y-1">
            <li>1. Squareアカウントを作成</li>
            <li>2. アプリケーションIDとロケーションIDを取得</li>
            <li>3. .env.localファイルに設定を追加</li>
          </ol>
        </div>
        <div className="bg-white rounded-lg p-4 mt-4 text-xs text-gray-500 font-mono text-left">
          <p># .env.local に追加</p>
          <p>NEXT_PUBLIC_SQUARE_APPLICATION_ID="sandbox-..."</p>
          <p>NEXT_PUBLIC_SQUARE_LOCATION_ID="..."</p>
          <p>SQUARE_ACCESS_TOKEN="..."</p>
        </div>
        <button
          onClick={() => onPaymentSuccess({ id: 'demo-payment', status: 'COMPLETED' })}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          デモ決済（開発用）
        </button>
      </div>
    )
  }

  return (
    <div className="square-payment-form">
      <PaymentForm
        applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID}
        locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID}
        cardTokenizeResponseReceived={handlePaymentSubmit}
        createPaymentRequest={() => ({
          countryCode: 'JP',
          currencyCode: 'JPY',
          total: {
            amount: String(amount * 100), // Square expects amount in smallest currency unit
            label: 'お支払い金額',
          },
        })}
      >
        <div className="space-y-4">
          {/* Apple Pay */}
          <ApplePay />

          {/* Google Pay */}
          <GooglePay />

          {/* クレジットカード */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              クレジットカード
            </h3>
            <CreditCard>
              {isProcessing ? '処理中...' : `¥${amount.toLocaleString()}を支払う`}
            </CreditCard>
          </div>
        </div>
      </PaymentForm>

      <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>安全な決済 by Square</span>
      </div>
    </div>
  )
}