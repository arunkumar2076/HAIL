import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'email',
    description: 'email',
    required: true,
  })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'password',
    description: 'password',
    required: true,
  })
  readonly password: string;
}
