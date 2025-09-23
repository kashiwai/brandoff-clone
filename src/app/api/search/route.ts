import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        products: [],
        categories: [],
        total: 0,
      })
    }

    const searchTerm = query.trim()

    // Search products
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { active: true },
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
              { sku: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Search categories
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
    })

    // Format response for SearchBar component
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price.toNumber(),
      image: product.images[0]?.url,
      category: product.category.name,
    }))

    return NextResponse.json({
      products: formattedProducts,
      categories,
      total: products.length + categories.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}