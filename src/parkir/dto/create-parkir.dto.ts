import { IsEnum,IsInt,IsNotEmpty,Min } from "class-validator";
import { jenisKendaraan } from "@prisma/client";

export class CreateParkirDto {

    @IsNotEmpty()
    platNomor: string;

    @IsEnum(jenisKendaraan)
    jenisKendaraan: jenisKendaraan;

    @IsInt()
    @Min(1)
    durasi: number;
}
