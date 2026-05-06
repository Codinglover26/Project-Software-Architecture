import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsAlpha } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsAlpha()
    first_name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsAlpha()
    last_name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    password: string

    constructor(first_name: string, last_name: string, email: string, password: string){
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.password = password
    }
}