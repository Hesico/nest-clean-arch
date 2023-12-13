import { UpdateUserUseCase } from '@/users/application/useCases/updateUser.usecase'

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
    name: string
}
