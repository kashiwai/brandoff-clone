import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Couponモデルが存在しない場合は、一時的なモックデータを使用
let coupons: any[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discount: 10,
    type: 'PERCENT',
    minAmount: 10000,
    active: true,
    expiresAt: new Date('2024-12-31'),
    createdAt: new Date()
  },
  {
    id: '2',
    code: 'SUMMER2024',
    discount: 5000,
    type: 'AMOUNT',
    minAmount: 30000,
    active: true,
    expiresAt: new Date('2024-08-31'),
    createdAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Prismaでクーポンテーブルが作成されたら実装
    // const coupons = await prisma.coupon.findMany({
    //   orderBy: { createdAt: 'desc' }
    // });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // バリデーション
    if (!data.code || !data.discount || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Prismaでクーポンテーブルが作成されたら実装
    // const coupon = await prisma.coupon.create({
    //   data: {
    //     code: data.code,
    //     discount: data.discount,
    //     type: data.type,
    //     minAmount: data.minAmount || 0,
    //     expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    //     active: true
    //   }
    // });

    // 一時的にモックデータに追加
    const newCoupon = {
      id: Date.now().toString(),
      code: data.code,
      discount: data.discount,
      type: data.type,
      minAmount: data.minAmount || 0,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      active: true,
      createdAt: new Date()
    };

    coupons.push(newCoupon);

    return NextResponse.json(newCoupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    // TODO: Prismaでクーポンテーブルが作成されたら実装
    // await prisma.coupon.delete({
    //   where: { id }
    // });

    // 一時的にモックデータから削除
    coupons = coupons.filter(c => c.id !== id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}