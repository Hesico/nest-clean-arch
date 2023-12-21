import { SignUpUseCase } from '@/users/application/useCases/signup.usecase'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignupDto implements SignUpUseCase.Input {
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsString()
    @IsNotEmpty()
    password: string
}
