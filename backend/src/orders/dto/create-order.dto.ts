import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsOptional()
  @IsString()
  notes?: string;
}