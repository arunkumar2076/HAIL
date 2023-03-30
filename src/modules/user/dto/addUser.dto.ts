import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsAlpha,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class addUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'firstName',
    description: 'User First Name',
    required: true,
  })
  @IsOptional()
  @IsAlpha()
  readonly firstName: string;

  @IsString()
  @ApiProperty({
    name: 'lastName',
    description: 'User Last Name',
    required: false,
  })
  @IsOptional()
  @IsAlpha()
  readonly flastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'email',
    description: 'User Email',
    required: true,
  })
  @IsEmail()
  readonly email: string;


  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'password',
    description: 'User Password',
    required: true,
  })
  @IsOptional()
  @IsStrongPassword()
  password: string;
}
