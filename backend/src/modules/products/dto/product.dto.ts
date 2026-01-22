import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    unit?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    costPrice: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    sellingPrice: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    minStockLevel?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    initialStock?: number;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    unit?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    costPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    sellingPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    minStockLevel?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class ProductQueryDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    status?: 'in_stock' | 'low_stock' | 'out_of_stock';

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    limit?: number = 10;
}
