import { IsNotEmpty } from 'class-validator';

export class fundAccountDto {
  @IsNotEmpty()
  spID: string;

  @IsNotEmpty()
  amount: number;
}
