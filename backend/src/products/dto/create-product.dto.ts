import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  Min,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsString()
  model3dUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsObject()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}