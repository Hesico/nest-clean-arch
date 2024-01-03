import { SignInUseCase } from '@/users/application/useCases/signin.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SigninDto implements SignInUseCase.Input {
    @ApiProperty({ description: 'E-mail do usuário' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ description: 'Senha do usuário' })
    @IsString()
    @IsNotEmpty()
    password: string
}
