import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        category: true,
        brand: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // 画像の処理
    const images = data.images || [];
    delete data.images;

    // brandIdが空文字の場合はnullに変換
    if (data.brandId === '') {
      data.brandId = null;
    }

    // 商品を更新
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...data,
        images: {
          deleteMany: {}, // 既存の画像を削除
          create: images.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || null,
            order: index
          }))
        }
      },
      include: {
        images: true,
        category: true,
        brand: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 商品を削除（関連する画像も自動的に削除される）
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}