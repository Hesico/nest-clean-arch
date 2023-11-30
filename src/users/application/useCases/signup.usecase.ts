import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repository/user.repository'

export namespace SignUpUseCase {
    export type Input = {
        name: string
        email: string
        password: string
    }

    export type Output = {
        id: string
        name: string
        email: string
        password: string
        createdAt: Date
    }

    export class UseCase {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            const { name, email, password } = input

            if (!name || !email || !password) throw new BadRequestError('Missing params')

            await this.userRepository.emailExists(email)

            const user = new UserEntity({ name, email, password })

            await this.userRepository.insert(user)
            return user.toJSON()
        }
    }
}
