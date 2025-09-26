'use client'

import { useState, useEffect } from 'react'
import { initFincode } from '@fincode/js'
import toast from 'react-hot-toast'

interface FincodePaymentFormProps {
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

export default function FincodePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  customerInfo,
  items,
}: FincodePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [fincode, setFincode] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // fincodeの初期化
    const setupFincode = async () => {
      try {
        // テスト環境のパブリックキーを使用
        const publicKey = process.env.NEXT_PUBLIC_FINCODE_PUBLIC_KEY || 'test_public_key'

        // fincodeインスタンスの作成
        const fc = await initFincode({
          publicKey: publicKey,
          isLiveMode: process.env.NODE_ENV === 'production'
        })

        setFincode(fc)
      } catch (error) {
        console.error('fincode initialization error:', error)
      }
    }

    if (typeof window !== 'undefined') {
      setupFincode()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isProcessing || !fincode) return

    setIsProcessing(true)

    try {
      // まずバックエンドで決済を作成
      const paymentResponse = await fetch('/api/payment/fincode/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          items,
          customerInfo,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || '決済の作成に失敗しました')
      }

      // カード情報のトークン化と決済実行
      const result = await fincode.payments.payByCard({
        id: paymentData.paymentId,
        pay_type: 'Card',
        access_id: paymentData.accessId,
        card_no: '', // UIコンポーネントから取得
        expire: '', // UIコンポーネントから取得
        security_code: '', // UIコンポーネントから取得
        holder_name: customerInfo?.billingAddress?.firstName + ' ' + customerInfo?.billingAddress?.lastName,
      })

      if (result.status === 'SUCCESS') {
        onPaymentSuccess({
          id: paymentData.paymentId,
          status: 'COMPLETED',
          ...result
        })
        toast.success('お支払いが完了しました！')
      } else {
        throw new Error(result.message || '決済に失敗しました')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      onPaymentError(error)
      toast.error(error.message || 'お支払いに失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  // fincode APIキーが設定されていない場合のテストモードUI
  if (!process.env.NEXT_PUBLIC_FINCODE_PUBLIC_KEY) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">fincode決済（テストモード）</h3>
        <div className="text-sm text-gray-600 space-y-2 mb-4">
          <p>fincode決済を利用するには、以下の設定が必要です：</p>
          <ol className="text-left max-w-md mx-auto mt-3 space-y-1">
            <li>1. fincodeアカウントにログイン</li>
            <li>2. 新しいドメインを追加登録</li>
            <li>3. APIキーを取得して環境変数に設定</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg p-4 mt-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">テスト用カード番号</h4>
          <div className="text-xs text-gray-600 space-y-1 font-mono">
            <p>4111 1111 1111 1111 (VISA)</p>
            <p>5555 5555 5555 4444 (MasterCard)</p>
            <p>有効期限: 任意の将来日付</p>
            <p>セキュリティコード: 123</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mt-4 text-xs text-gray-500 font-mono text-left">
          <p># .env.local に追加</p>
          <p>NEXT_PUBLIC_FINCODE_PUBLIC_KEY="p_test_..."</p>
          <p>FINCODE_SECRET_KEY="s_test_..."</p>
          <p>FINCODE_SHOP_ID="shop_..."</p>
        </div>

        <button
          onClick={() => onPaymentSuccess({
            id: 'test-payment-' + Date.now(),
            status: 'COMPLETED',
            testMode: true
          })}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          テスト決済を実行（開発用）
        </button>
      </div>
    )
  }

  // クライアントサイドでのみレンダリング
  if (!mounted) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 animate-pulse">
        <div className="h-12 bg-gray-300 rounded mb-4"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
      </div>
    )
  }

  return (
    <div className="fincode-payment-form">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* カード番号入力フィールド */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カード番号
            </label>
            <div id="fincode-card-number" className="border rounded-lg p-3"></div>
          </div>

          {/* 有効期限 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                有効期限（月）
              </label>
              <div id="fincode-expire-month" className="border rounded-lg p-3"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                有効期限（年）
              </label>
              <div id="fincode-expire-year" className="border rounded-lg p-3"></div>
            </div>
          </div>

          {/* セキュリティコード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              セキュリティコード
            </label>
            <div id="fincode-security-code" className="border rounded-lg p-3"></div>
          </div>

          {/* カード名義人 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カード名義人（ローマ字）
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="TARO YAMADA"
              required
            />
          </div>

          {/* 支払いボタン */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              isProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isProcessing ? '処理中...' : `¥${amount.toLocaleString()}を支払う`}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>安全な決済 by fincode</span>
      </div>
    </div>
  )
}