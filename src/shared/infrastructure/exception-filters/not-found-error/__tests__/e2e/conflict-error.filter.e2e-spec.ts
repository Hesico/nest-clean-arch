import { Controller, Get, INestApplication } from '@nestjs/common'
import { NotFoundErrorFilter } from './../../not-found-error.filter'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

@Controller('stub')
class StubController {
    @Get()
    index() {
        throw new NotFoundError('not found')
    }
}

describe('NotFoundErrorFilter tests', () => {
    let app: INestApplication
    let module: TestingModule

    beforeAll(async () => {
        module = await Test.createTestingModule({ controllers: [StubController] }).compile()
        app = module.createNestApplication()
        app.useGlobalFilters(new NotFoundErrorFilter())

        await app.init()
    })

    afterAll(async () => {
        await module.close()
    })

    it('should be defined', () => {
        expect(new NotFoundErrorFilter()).toBeDefined()
    })

    it('should catch a ConflictError', () => {
        return request(app.getHttpServer()).get('/stub').expect(404).expect({
            statusCode: 404,
            error: 'Not Found',
            message: 'not found',
        })
    })
})
