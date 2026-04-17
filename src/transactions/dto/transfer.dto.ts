import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  @IsString()
  senderAccountId!: string;

  @IsNotEmpty()
  @IsString()
  receiverAccountId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(10000, { message: 'Nominal transaksi untuk transfer minimal Rp10.000.' })
  amount!: number;
}