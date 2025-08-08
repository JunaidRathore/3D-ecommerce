import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getCart(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    const order = this.orderRepository.create({
      user: { id: userId },
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const cartItem of cart.items) {
      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        product: cartItem.product,
        quantity: cartItem.quantity,
        unitPrice: cartItem.product.price,
        productName: cartItem.product.name,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Clear cart
    await this.cartService.clearCart(userId);

    return this.findOne(savedOrder.id);
  }

  async findAll(userId?: string): Promise<Order[]> {
    const where = userId ? { user: { id: userId } } : {};
    return this.orderRepository.find({
      where,
      relations: ['items', 'items.product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paymentIntentId?: string): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    if (paymentIntentId) {
      order.paymentIntentId = paymentIntentId;
    }
    await this.orderRepository.save(order);
    return this.findOne(id);
  }
}