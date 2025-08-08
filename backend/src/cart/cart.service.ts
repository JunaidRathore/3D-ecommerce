import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId },
        items: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;
    
    // Verify product exists and has enough stock
    const product = await this.productsService.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    let existingItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }
      existingItem.quantity = newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCartWithItems(cart.id);
  }

  async updateCartItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const { quantity } = updateCartItemDto;
    
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { user: { id: userId } } },
      relations: ['product', 'cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCartWithItems(cartItem.cart.id);
  }

  async removeFromCart(userId: string, cartItemId: string): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { user: { id: userId } } },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getCartWithItems(cartItem.cart.id);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    return this.getCartWithItems(cart.id);
  }

  async getCart(userId: string): Promise<Cart> {
    return this.getOrCreateCart(userId);
  }

  private async getCartWithItems(cartId: string): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }

  async getCartTotal(userId: string): Promise<number> {
    const cart = await this.getOrCreateCart(userId);
    return cart.items.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  }
}