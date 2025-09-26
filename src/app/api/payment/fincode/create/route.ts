import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// fincode APIのエンドポイント
const FINCODE_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api.fincode.jp/v1'
  : 'https://api.test.fincode.jp/v1'

export async function POST(request: NextRequest) {
  try {
    const { amount, items, customerInfo } = await request.json()

    if (!amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 注文IDの生成
    const orderId = `ORDER_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`

    // fincode API用のBasic認証ヘッダーを作成
    const authString = Buffer.from(
      `${process.env.FINCODE_SECRET_KEY}:`
    ).toString('base64')

    // 決済の作成（fincode API）
    const paymentResponse = await fetch(`${FINCODE_API_BASE}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pay_type: 'Card',
        job_code: 'AUTH', // 仮売上
        amount: Math.round(amount), // 円単位で送信
        tax: Math.floor(amount * 0.1), // 10%の消費税
        client_field_1: orderId,
        client_field_2: customerInfo?.email || '',
        client_field_3: JSON.stringify(items?.slice(0, 3).map((i: any) => i.name) || []),
        tds_type: '2', // 3Dセキュア2.0
      }),
    })

    const paymentData = await paymentResponse.json()

    if (!paymentResponse.ok) {
      console.error('fincode payment creation error:', paymentData)
      return NextResponse.json(
        {
          error: 'Payment creation failed',
          details: paymentData
        },
        { status: 400 }
      )
    }

    // 決済IDとアクセスIDを返す
    return NextResponse.json({
      success: true,
      paymentId: paymentData.id,
      accessId: paymentData.access_id,
      accessUrl: paymentData.access_url,
      orderId: orderId,
    })

  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed', details: error.message },
      { status: 500 }
    )
  }
}

// 決済の状態を確認するエンドポイント
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    const authString = Buffer.from(
      `${process.env.FINCODE_SECRET_KEY}:`
    ).toString('base64')

    // 決済情報の取得
    const response = await fetch(`${FINCODE_API_BASE}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get payment status' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      payment: data,
      status: data.status,
    })

  } catch (error: any) {
    console.error('Payment status error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}