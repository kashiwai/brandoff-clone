import { NextRequest, NextResponse } from 'next/server'
import { squareClient, formatAmountForSquare } from '@/lib/square'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { sourceId, amount, items, customerInfo } = await request.json()

    if (!sourceId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 冪等性キーの生成（同じ支払いが重複して処理されないように）
    const idempotencyKey = uuidv4()

    // Square Payment APIを呼び出す
    const result = await squareClient.payments.create({
      sourceId, // カード情報のトークン
      idempotencyKey,
      amountMoney: {
        amount: formatAmountForSquare(amount),
        currency: 'JPY',
      },
      autocomplete: true, // 自動で決済を完了
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
      referenceId: idempotencyKey,
      note: `Order from ${customerInfo?.email || 'Guest'}`,
      buyerEmailAddress: customerInfo?.email,
      billingAddress: customerInfo?.billingAddress,
      shippingAddress: customerInfo?.shippingAddress,
      statementDescriptionIdentifier: 'FANCY',
    })

    if (result.payment) {
      // 注文情報をデータベースに保存する処理をここに追加
      // await saveOrder({
      //   paymentId: result.payment.id,
      //   amount,
      //   items,
      //   customerInfo,
      //   status: result.payment.status,
      // })

      return NextResponse.json({
        success: true,
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          receiptUrl: result.payment.receiptUrl,
          orderId: result.payment.referenceId,
        },
      })
    }

    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Payment error:', error)

    // Squareのエラーレスポンスを解析
    if (error.errors) {
      return NextResponse.json(
        {
          error: 'Payment failed',
          details: error.errors.map((e: any) => ({
            code: e.code,
            detail: e.detail,
            field: e.field,
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}