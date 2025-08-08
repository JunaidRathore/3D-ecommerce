import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Product, ProductCategory } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(query: GetProductsQueryDto) {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = query;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.where('product.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tags ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    queryBuilder
      .orderBy(`product.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return this.productRepository.find({
      where: { category, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getFeatured(limit: number = 8): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      order: { rating: 'DESC', reviewCount: 'DESC' },
      take: limit,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productRepository.save(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock += quantity;
    return this.productRepository.save(product);
  }
}