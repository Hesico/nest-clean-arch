import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'

export namespace SignUpUseCase {
    export type Output = UserOutput
    export type Input = {
        name: string
        email: string
        password: string
    }

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private hashProvider: HashProviderInterface,
        ) {}

        async execute(input: Input): Promise<Output> {
            const { name, email, password } = input

            if (!name || !email || !password) throw new BadRequestError('Missing params')

            await this.userRepository.emailExists(email)

            const hashedPassword = await this.hashProvider.generateHash(password)
            const user = new UserEntity(Object.assign(input, { password: hashedPassword }))

            await this.userRepository.insert(user)
            return user.toJSON()
        }
    }
}
