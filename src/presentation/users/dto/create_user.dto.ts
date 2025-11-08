import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/domain/user/user_role.enum';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles!: Role[];
}