import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: true },
        },
      },
    })

    // If not found by ID, try to find by slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          category: true,
          variants: true,
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { reviews: true },
          },
        },
      })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: true,
      },
      take: 4,
    })

    return NextResponse.json({
      ...product,
      averageRating,
      relatedProducts,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const data = await request.json()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        compareAt: data.compareAt,
        cost: data.cost,
        quantity: data.quantity,
        active: data.active,
        featured: data.featured,
        updatedAt: new Date(),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting active to false
    await prisma.product.update({
      where: { id },
      data: {
        active: false,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}