import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaClient } from '@prisma/client'
import { DeleteUserUseCase } from '../../deleteUser.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

describe('DeleteUserUseCase Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: DeleteUserUseCase.UseCase
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
        sut = new DeleteUserUseCase.UseCase(repository)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should throws error when entity not found on delete', async () => {
        const promise = sut.execute({ id: 'any_id' })
        await expect(promise).rejects.toThrow(new NotFoundError('User not found using ID any_id'))
    })

    it('Should delete a User', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await prismaService.user.create({
            data: entity.toJSON(),
        })

        const newEntity = await prismaService.user.findUnique({
            where: { id: entity.id },
        })

        expect(newEntity).toMatchObject(entity.toJSON())

        await sut.execute({ id: entity.id })

        const deletedEntity = await prismaService.user.findUnique({
            where: { id: entity.id },
        })

        expect(deletedEntity).toBeNull()
    })
})
