import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'recent';

    // ユーザーと注文情報を取得
    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    });

    // 各顧客の統計情報を計算
    const customers = users.map(user => {
      const totalSpent = user.orders.reduce((sum, order) => {
        // キャンセルされた注文は除外
        if (order.status === 'CANCELLED') return sum;
        return sum + order.total;
      }, 0);

      const lastOrder = user.orders
        .filter(order => order.status !== 'CANCELLED')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: null, // phoneフィールドがユーザーモデルにない場合
        createdAt: user.createdAt,
        orders: user.orders,
        _count: user._count,
        totalSpent: Math.round(totalSpent),
        lastOrderDate: lastOrder?.createdAt || null
      };
    });

    // ソート処理
    let sortedCustomers = [...customers];
    switch (sort) {
      case 'orders':
        sortedCustomers.sort((a, b) => b._count.orders - a._count.orders);
        break;
      case 'spent':
        sortedCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'name':
        sortedCustomers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'recent':
      default:
        sortedCustomers.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return NextResponse.json(sortedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}