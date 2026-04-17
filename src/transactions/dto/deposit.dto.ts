import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

export class DepositDto {
  @IsNotEmpty()
  @IsString()
  accountId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(50000, { message: 'Nominal transaksi untuk setor tunai minimal Rp50.000.' })
  amount!: number;
}