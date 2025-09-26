import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: {
                  select: {
                    url: true,
                    alt: true
                  },
                  take: 1
                }
              }
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        },
        returns: {
          select: {
            id: true,
            returnNumber: true,
            status: true,
            type: true,
            reason: true,
            createdAt: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // 許可されたフィールドのみ更新
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
    if (data.trackingNumber) updateData.trackingNumber = data.trackingNumber;
    if (data.notes) updateData.notes = data.notes;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // ステータスがSHIPPEDに変更された場合、メール通知を送信（TODO）
    if (data.status === 'SHIPPED' && data.trackingNumber) {
      // await sendShippingNotification(order);
      console.log('Shipping notification would be sent to:', order.email);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ソフトデリート（ステータスをCANCELLEDに変更）
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' }
    });

    // 在庫を戻す
    for (const item of await prisma.orderItem.findMany({ where: { orderId: params.id } })) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            increment: item.quantity
          }
        }
      });

      if (item.variantId) {
        await prisma.variant.update({
          where: { id: item.variantId },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        });
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}