import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'

describe('UserPrismaRepository Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile()
    })

    beforeEach(async () => {
        sut = new UserPrismaRepository(prismaService as any)
        await prismaService.user.deleteMany()
    })

    it('Should throws error when entity not found', async () => {
        expect(() => sut.findById('any_id')).rejects.toThrow(new NotFoundError(`User not found using ID any_id`))
    })

    it('Should find user by ID', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        const newUser = await prismaService.user.create({
            data: entity.toJSON(),
        })

        const output = await sut.findById(newUser.id)
        expect(output.toJSON()).toStrictEqual(entity.toJSON())
    })
})
