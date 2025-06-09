import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class OffsetPaginationDto {
  @IsInt()
  @Transform(({ value }) => +value)
  offset: number;

  @IsInt()
  @Transform(({ value }) => +value)
  limit: number;
}
