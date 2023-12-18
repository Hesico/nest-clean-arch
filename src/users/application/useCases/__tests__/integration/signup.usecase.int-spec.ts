import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaClient } from '@prisma/client'
import { SignUpUseCase } from '../../signup.usecase'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'

describe('SignupUseCase Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: SignUpUseCase.UseCase
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
        sut = new SignUpUseCase.UseCase(repository, hashProvider)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should create a User', async () => {
        const props = {
            name: 'any_name',
            email: 'any_emai@example.com',
            password: 'any_password',
        }

        const output = await sut.execute(props)

        expect(output.id).toBeDefined()
        expect(output.createdAt).toBeInstanceOf(Date)
        expect(output).toMatchObject(props)
    })
})
