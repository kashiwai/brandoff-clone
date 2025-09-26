import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 今月の日付範囲を取得
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 並列でデータを取得
    const [
      totalOrders,
      monthlyOrders,
      lastMonthOrders,
      totalCustomers,
      activeProducts,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue
    ] = await Promise.all([
      // 総注文数
      prisma.order.count(),
      // 今月の注文数
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      // 先月の注文数
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      // 総顧客数
      prisma.user.count(),
      // アクティブな商品数
      prisma.product.count({
        where: { active: true }
      }),
      // 保留中の注文数
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      // 総売上
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: {
            not: 'CANCELLED'
          }
        }
      }),
      // 今月の売上
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: {
            gte: startOfMonth
          },
          status: {
            not: 'CANCELLED'
          }
        }
      }),
      // 先月の売上
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          },
          status: {
            not: 'CANCELLED'
          }
        }
      })
    ]);

    // 月次成長率を計算
    const monthlyGrowth = lastMonthRevenue._sum.total
      ? Math.round(((monthlyRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / lastMonthRevenue._sum.total * 100)
      : 0;

    return NextResponse.json({
      totalOrders,
      totalRevenue: Math.round(totalRevenue._sum.total || 0),
      totalCustomers,
      activeProducts,
      pendingOrders,
      monthlyGrowth,
      monthlyOrders,
      monthlyRevenue: Math.round(monthlyRevenue._sum.total || 0)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}