import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { SignUpUseCase } from '../application/useCases/signup.usecase'
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider'
import { UserRepository } from '../domain/repository/user.repository'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { SignInUseCase } from '../application/useCases/signin.usecase'
import { GetUserUseCase } from '../application/useCases/getUser.usecase'
import { ListUsersUseCase } from '../application/useCases/listUsers.usecase'
import { UpdateUserUseCase } from '../application/useCases/updateUser.usecase'
import { UpdateUserPasswordUseCase } from '../application/useCases/updateUserPassword.usecase'
import { DeleteUserUseCase } from '../application/useCases/deleteUser.usecase'

@Module({
    controllers: [UsersController],
    providers: [
        {
            provide: 'HashProvider',
            useClass: BcryptjsHashProvider,
        },
        {
            provide: 'UserRepository',
            useClass: UserInMemoryRepository,
        },
        {
            provide: SignUpUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProviderInterface) =>
                new SignUpUseCase.UseCase(userRepository, hashProvider),
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: SignInUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProviderInterface) =>
                new SignInUseCase.UseCase(userRepository, hashProvider),
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: GetUserUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => new GetUserUseCase.UseCase(userRepository),
            inject: ['UserRepository'],
        },
        {
            provide: ListUsersUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => new ListUsersUseCase.UseCase(userRepository),
            inject: ['UserRepository'],
        },
        {
            provide: UpdateUserUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => new UpdateUserUseCase.UseCase(userRepository),
            inject: ['UserRepository'],
        },
        {
            provide: UpdateUserPasswordUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProviderInterface) =>
                new UpdateUserPasswordUseCase.UseCase(userRepository, hashProvider),
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: DeleteUserUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository) => new DeleteUserUseCase.UseCase(userRepository),
            inject: ['UserRepository'],
        },
    ],
})
export class UsersModule {}
