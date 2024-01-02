import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../../auth.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { ConfigService } from '@nestjs/config'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'

describe('AuthService unit tests', () => {
    let sut: AuthService
    let module: TestingModule
    let jwtService: JwtService
    let envConfigService: EnvConfigService
    let configService: ConfigService

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [EnvConfigModule, JwtModule],
            providers: [AuthService],
        }).compile()
    })

    beforeEach(async () => {
        jwtService = new JwtService({
            global: true,
            secret: 'fake_secret',
            signOptions: {
                expiresIn: 86400,
                subject: 'fake_id',
            },
        })

        configService = new ConfigService()
        envConfigService = new EnvConfigService(configService)

        sut = new AuthService(jwtService, envConfigService)
    })
    it('should be defined', () => {
        expect(sut).toBeDefined()
    })

    it('should return a jwt', async () => {
        const result = await sut.generateJwt('fake_id')

        expect(Object.keys(result)).toStrictEqual(['acesssToken'])
        expect(typeof result.acesssToken).toEqual('string')
    })

    it('should verify a jwt', async () => {
        const result = await sut.generateJwt('fake_id')
        const validToken = await sut.verifyJwt(result.acesssToken)

        expect(validToken).not.toBeNull()

        await expect(sut.verifyJwt('invalid_token')).rejects.toThrow()

        await expect(
            sut.verifyJwt(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            ),
        ).rejects.toThrow()
    })
})
