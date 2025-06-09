import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsEnum(['admin', 'employee'])
  role: 'admin' | 'employee';
}
