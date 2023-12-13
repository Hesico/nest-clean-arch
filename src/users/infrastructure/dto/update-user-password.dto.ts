import { UpdateUserPasswordUseCase } from '@/users/application/useCases/updateUserPassword.usecase'

export class UpdateUserPasswordDto implements Omit<UpdateUserPasswordUseCase.Input, 'id'> {
    password: string
    oldPassword: string
}
