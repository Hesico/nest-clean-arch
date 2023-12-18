import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaClient } from '@prisma/client'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { SignInUseCase } from '../../signin.usecase'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'

describe('SignInUseCase Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: SignInUseCase.UseCase
    let repository: UserPrismaRepository
    let module: TestingModule
    let hashProvider: HashProviderInterface

    beforeAll(async () => {
        // setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile()

        repository = new UserPrismaRepository(prismaService as any)
        hashProvider = new BcryptjsHashProvider()
    })

    beforeEach(async () => {
        sut = new SignInUseCase.UseCase(repository, hashProvider)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should throws error when entity not found', async () => {
        const promise = sut.execute({ email: 'any_email', password: 'any_password' })
        await expect(promise).rejects.toThrow(new NotFoundError('User not found using email any_email'))
    })

    it('Should throws error when password is invalid', async () => {
        const entity = new UserEntity(UserDataBuilder({ password: await hashProvider.generateHash('any_password') }))

        await prismaService.user.create({
            data: entity.toJSON(),
        })

        const promise = sut.execute({ email: entity.email, password: 'invalid_password' })

        await expect(promise).rejects.toThrow(new InvalidCredentialsError('Invalid password'))
    })

    it('Should authenticate a user with valid credentials', async () => {
        const entity = new UserEntity(UserDataBuilder({ password: await hashProvider.generateHash('any_password') }))

        await prismaService.user.create({
            data: entity.toJSON(),
        })

        const output = await sut.execute({ email: entity.email, password: 'any_password' })

        expect(output).toEqual(entity.toJSON())
    })
})
