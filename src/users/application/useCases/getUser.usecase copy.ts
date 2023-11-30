import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput } from '../dto/user-output'

export namespace GetUserUseCase {
    export type Output = UserOutput
    export type Input = {
        id: string
    }

    export class UseCase {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.userRepository.findById(input.id)
            return entity.toJSON()
        }
    }
}
