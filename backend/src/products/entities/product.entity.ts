import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  HOME = 'home',
  SPORTS = 'sports',
  BOOKS = 'books',
  TOYS = 'toys',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column('simple-array')
  images: string[];

  @Column({ nullable: true })
  model3dUrl: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column('json', { nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}