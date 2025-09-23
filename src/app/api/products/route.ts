import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const featured = searchParams.get('featured') === 'true'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const slug = searchParams.get('slug')
    const categoryId = searchParams.get('categoryId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      active: true,
    }

    if (slug) {
      where.slug = slug
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (featured) {
      where.featured = true
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Build orderBy clause
    const orderBy: any = {}
    if (sort === 'price') {
      orderBy.price = order
    } else if (sort === 'name') {
      orderBy.name = order
    } else {
      orderBy.createdAt = order
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          category: true,
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      name,
      description,
      price,
      compareAt,
      cost,
      sku,
      barcode,
      quantity,
      categoryId,
      featured = false,
      images = [],
      variants = [],
    } = data

    // Validate required fields
    if (!name || !price || !sku || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku },
    })

    if (existingSku) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Product name already exists' },
        { status: 400 }
      )
    }

    // Create product with images and variants
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        compareAt,
        cost,
        sku,
        barcode,
        quantity,
        categoryId,
        featured,
        images: {
          create: images.map((image: any, index: number) => ({
            url: image.url,
            alt: image.alt || name,
            order: index,
          })),
        },
        variants: {
          create: variants.map((variant: any) => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            quantity: variant.quantity,
            image: variant.image,
            attributes: variant.attributes,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}