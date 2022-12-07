import { IsString, IsInt, IsUUID, IsBoolean, Length } from 'class-validator';

export class MakeAnAgreementInput {
  @IsUUID()
  debtorPartyId: string;

  @IsUUID()
  creditorPartyId: string;

  @IsString()
  @Length(3, 80)
  description: string;

  @IsInt()
  amount: number;

  @IsBoolean()
  isCurrency: boolean;
}
