import { SignInUseCase } from '@/users/application/useCases/signin.usecase'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SigninDto implements SignInUseCase.Input {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsString()
    @IsNotEmpty()
    password: string
}
