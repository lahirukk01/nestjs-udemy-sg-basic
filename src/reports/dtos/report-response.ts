import { Expose, Transform } from 'class-transformer';

export class ReportResponseDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  miles: number;

  @Expose()
  approved: boolean;

  @Expose()
  @Transform(({ obj }) => {
    return obj.user?.id;
  })
  userId: number;
}
