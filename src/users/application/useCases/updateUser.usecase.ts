import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export namespace UpdateUserUseCase {
    export type Output = UserOutput
    export type Input = {
        id: string
        name: string
    }

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            if (!input.name) throw new BadRequestError('Name is required')

            const entity = await this.userRepository.findById(input.id)
            entity.update(input.name)

            await this.userRepository.update(entity)
            return UserOutputMapper.toOutput(entity)
        }
    }
}
