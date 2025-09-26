import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
        price: true,
        active: true,
        category: {
          select: {
            name: true
          }
        },
        brand: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        quantity: 'asc'
      }
    });

    // 在庫レベルごとの商品数をカウント
    const lowStockCount = products.filter(p => p.quantity < 10).length;
    const warningStockCount = products.filter(p => p.quantity >= 10 && p.quantity < 50).length;
    const normalStockCount = products.filter(p => p.quantity >= 50).length;

    return NextResponse.json({
      products,
      stats: {
        total: products.length,
        lowStock: lowStockCount,
        warningStock: warningStockCount,
        normalStock: normalStockCount
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}