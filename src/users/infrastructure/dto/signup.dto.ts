import { SignUpUseCase } from '@/users/application/useCases/signup.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignupDto implements SignUpUseCase.Input {
    @ApiProperty({ description: 'Nome do usuário' })
    @IsString()
    @IsNotEmpty()
    name: string

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
