import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaClient } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UpdateUserUseCase } from '../../updateUser.usecase'

describe('UpdateUserUseCase Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: UpdateUserUseCase.UseCase
    let repository: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        // setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile()

        repository = new UserPrismaRepository(prismaService as any)
    })

    beforeEach(async () => {
        sut = new UpdateUserUseCase.UseCase(repository)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should throws error when entity not found', async () => {
        const promise = sut.execute({ id: 'any_id', name: 'any_name' })
        await expect(promise).rejects.toThrow(new NotFoundError('User not found using ID any_id'))
    })

    it('Should update a User', async () => {
        const entity = new UserEntity(UserDataBuilder({ name: 'old_name' }))
        await prismaService.user.create({
            data: entity.toJSON(),
        })

        entity.update('new_name')

        const user = await sut.execute(entity)
        expect(user).toMatchObject(entity.toJSON())
        expect(user.name).toBe('new_name')
    })
})
