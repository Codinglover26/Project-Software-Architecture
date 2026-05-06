import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ){}

    //Register
    async register(data: RegisterDto){
        //Check existing email
        const existing = await this.prisma.user.findUnique({
            where: {email: data.email}
        })

        if(existing) throw new BadRequestException('Email already exist')

        if(!this.isValidEmailDomain(data.email)){
            throw new BadRequestException('Email must end with .com, .org, .net, or .id')
        }

        if(data.password.includes(' ')){
            throw new BadRequestException('Password cannot contain spaces')
        }

        if (data.password.length < 8) {
            throw new BadRequestException('Password must at least 8 characters');
        }

        if (!this.hasAtLeastTwoDigits(data.password)) {
            throw new BadRequestException('Password must contain at least 2 numbers');
        }

        const user = await this.prisma.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                role: 'Customer'
            }
        })

        return {
            message: 'Register success',
        }
    }

    //Login
    async login(data: LoginDto){
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if(!user){
            throw new BadRequestException('User not found')
        }

        if(user.password !== data.password){
            throw new UnauthorizedException('Wrong password')
        }

        //Generate JWT
        const payload = {
            sub: user.id,
            role: user.role
        }

        return {
            message: 'Login success',
            access_token: this.jwtService.sign(payload)
        }
    }


    private hasAtLeastTwoDigits(password: string): boolean {
        let count = 0
        for(let i = 0; i < password.length; i++){
            if(password[i] >= '0' && password[i] <= '9'){
                count++
            }
        }

        return count >= 2
    }

    private isValidEmailDomain(email: string): boolean {
        return (
            email.endsWith('.com') ||
            email.endsWith('.net') ||
            email.endsWith('.org') ||
            email.endsWith('.id')
        )
    }
}
