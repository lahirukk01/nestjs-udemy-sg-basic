import { Transform } from 'class-transformer';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  readonly make: string;

  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1930)
  @Max(new Date().getFullYear())
  readonly year: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  @Max(1_000_000)
  readonly miles: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  readonly price: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  readonly lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  readonly lng: number;
}
