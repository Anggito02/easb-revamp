import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAsbDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    jenisBangunan: string;

    @IsString()
    @IsNotEmpty()
    klasifikasi: string;

    @IsOptional()
    rekomendasiFile?: string;
}
