import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'

export namespace GetUserUseCase {
    export type Output = UserOutput
    export type Input = {
        id: string
    }

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.userRepository.findById(input.id)
            return entity.toJSON()
        }
    }
}
