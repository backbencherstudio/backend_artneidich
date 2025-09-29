import { IsDate, IsEmail, IsObject, IsOptional, IsString } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class CreateCreateJobDto {

    @IsString()
    @IsNotEmpty()
    userID: string;

    @IsString()
    @IsNotEmpty()
    inspector_name: string;

    @IsString()
    @IsNotEmpty()
    inspection_type: string;
    
    @IsString()
    @IsNotEmpty()
    client_name: string;
    
    @IsEmail()
    @IsNotEmpty()
    client_email: string;
    
    @IsString()
    @IsNotEmpty()
    client_phone: string;

    @IsOptional()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    fha_number: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsObject()
    @IsNotEmpty()
    fee_types: {
        standard_fee?: number;
        rush_fee?: number;
        occupied_fee?: number;
        long_range_fee?: number;
    }

    @IsString()
    @IsNotEmpty()
    due_date: Date;
}
