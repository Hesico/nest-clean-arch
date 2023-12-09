import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'

export namespace SignInUseCase {
    export type Output = UserOutput
    export type Input = {
        email: string
        password: string
    }

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private hashProvider: HashProviderInterface,
        ) {}

        async execute(input: Input): Promise<Output> {
            const { email, password } = input

            if (!email || !password) throw new BadRequestError('Missing params')

            const user = await this.userRepository.findByEmail(email)

            const hashPasswordMatches = await this.hashProvider.compareHash(password, user.password)
            if (!hashPasswordMatches) throw new InvalidCredentialsError('Invalid password')

            return UserOutputMapper.toOutput(user)
        }
    }
}
