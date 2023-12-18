import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaClient } from '@prisma/client'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UpdateUserPasswordUseCase } from '../../updateUserPassword.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('SignupUseCase Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: UpdateUserPasswordUseCase.UseCase
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
        sut = new UpdateUserPasswordUseCase.UseCase(repository, hashProvider)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should throws error when entity not found', async () => {
        const promise = sut.execute({ id: 'any_id', password: 'any_password', oldPassword: 'any_name' })
        await expect(promise).rejects.toThrow(new NotFoundError('User not found using ID any_id'))
    })

    it('Should throws error when oldPassword is invalid', async () => {
        const entity = new UserEntity(UserDataBuilder({ password: await hashProvider.generateHash('any_password') }))

        await prismaService.user.create({
            data: entity.toJSON(),
        })

        const promise = sut.execute({ id: entity.id, password: 'any_password', oldPassword: 'invalid_old_password' })

        await expect(promise).rejects.toThrow(new InvalidPasswordError('Invalid old password'))
    })

    it('Should update a Users password', async () => {
        const entity = new UserEntity(UserDataBuilder({ password: await hashProvider.generateHash('any_password') }))

        await prismaService.user.create({
            data: entity.toJSON(),
        })

        await sut.execute({ id: entity.id, password: 'new_password', oldPassword: 'any_password' })

        const output = await prismaService.user.findUnique({ where: { id: entity.id } })

        expect(hashProvider.compareHash('new_password', output.password)).toBeTruthy()
    })
})
