import { UpdateUserPasswordUseCase } from '@/users/application/useCases/updateUserPassword.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserPasswordDto implements Omit<UpdateUserPasswordUseCase.Input, 'id'> {
    @ApiProperty({ description: 'Nova senha do usuário' })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({ description: 'Senha atual do usuário' })
    @IsString()
    @IsNotEmpty()
    oldPassword: string
}
