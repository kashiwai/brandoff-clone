import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: 'asc' },
                },
              },
            },
            variant: true,
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { order: 'asc' },
                  },
                },
              },
              variant: true,
            },
          },
        },
      })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price
      return sum + (price.toNumber() * item.quantity)
    }, 0)

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      ...cart,
      subtotal,
      totalItems,
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, variantId, quantity } = await request.json()

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    })

    if (!product || !product.active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    // If variant specified, verify it exists
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId)
      if (!variant) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        )
      }
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      })
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: 'asc' },
                },
              },
            },
            variant: true,
          },
        },
      },
    })

    const subtotal = updatedCart!.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price
      return sum + (price.toNumber() * item.quantity)
    }, 0)

    const totalItems = updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      ...updatedCart,
      subtotal,
      totalItems,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item
      await prisma.cartItem.delete({
        where: { id: itemId },
      })
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      })
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: 'asc' },
                },
              },
            },
            variant: true,
          },
        },
      },
    })

    const subtotal = updatedCart!.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price
      return sum + (price.toNumber() * item.quantity)
    }, 0)

    const totalItems = updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      ...updatedCart,
      subtotal,
      totalItems,
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Clear all items from cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    return NextResponse.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}