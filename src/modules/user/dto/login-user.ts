import { Length, IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be valid email address.' })
  public email!: string;

  @IsString({ message: 'password must be a string' })
  @Length(6, 12, { message: 'password must be from 6 to 12 symbols length' })
  public password!: string;
}
