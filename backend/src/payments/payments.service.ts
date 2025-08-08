import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(orderId: string): Promise<{ clientSecret: string }> {
    const order = await this.ordersService.findOne(orderId);
    
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalAmount) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
      },
    });

    await this.ordersService.updatePaymentStatus(
      orderId,
      PaymentStatus.PENDING,
      paymentIntent.id,
    );

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.ordersService.updatePaymentStatus(
          paymentIntent.metadata.orderId,
          PaymentStatus.PAID,
          paymentIntent.id,
        );
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await this.ordersService.updatePaymentStatus(
          failedPayment.metadata.orderId,
          PaymentStatus.FAILED,
          failedPayment.id,
        );
        break;
    }

    return { received: true };
  }
}