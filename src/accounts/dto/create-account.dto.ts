import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountType } from '@prisma/client'; // Ambil Enum langsung dari Prisma

export class CreateAccountDto {
  @IsNotEmpty()
  @IsEnum(AccountType, { message: 'Tipe akun harus SAVINGS atau CHECKING' })
  type: AccountType;
}