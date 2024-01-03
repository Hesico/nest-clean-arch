import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/Validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'

describe('UserModelMapper Integration tests', () => {
    let prismaService: PrismaClient
    let props: any

    beforeAll(async () => {
        // setupPrismaTests()

        prismaService = new PrismaClient()
        await prismaService.$connect()
    })

    beforeEach(async () => {
        await prismaService.user.deleteMany()
        props = {
            id: '775878ef-2675-4672-b9d3-818565e87ec5',
            name: 'Test Name',
            email: 'teste@teste.com',
            password: 'any_pass',
            createdAt: new Date(),
        }
    })

    afterAll(async () => {
        await prismaService.$disconnect()
    })

    it('Should throws error when user model is invalid', async () => {
        const model: User = Object.assign(props, { name: null })
        expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError)
    })

    it('Should convert an user model to an user entity', async () => {
        const model: User = await prismaService.user.create({ data: props })

        const sut = UserModelMapper.toEntity(model)

        expect(sut).toBeInstanceOf(UserEntity)
        expect(sut.toJSON()).toStrictEqual(props)
    })
})
