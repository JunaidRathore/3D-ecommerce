import {
  Controller,
  Post,
  Body,
  Headers,
  RawBody,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  createPaymentIntent(@Body('orderId') orderId: string) {
    return this.paymentsService.createPaymentIntent(orderId);
  }

  @Post('webhook')
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
  ) {
    return this.paymentsService.handleWebhook(signature, payload);
  }
}