import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    //Register
    @Post('register')
    register(@Body() body: RegisterDto){
        return this.authService.register(body)
    }

    //Login
    @Post('login')
    login(@Body() body: LoginDto){
        return this.authService.login(body)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Customer')
    @Get('profile')
    getProfile(@Req() req) {
        console.log(req.user)  //Temp
        return {
            message: 'success',
            user: req.user
        }
    }

}
