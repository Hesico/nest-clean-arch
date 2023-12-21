import { of } from 'rxjs'
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor'

describe('WrapperDataInterceptor Unit Tests', () => {
    let interceptor: WrapperDataInterceptor
    let props: any

    beforeEach(() => {
        interceptor = new WrapperDataInterceptor()
        props = {
            name: 'any_name',
            email: 'any_email@teste.com',
            password: 'any_password',
        }
    })
    it('should be defined', () => {
        expect(interceptor).toBeDefined()
    })

    it('should wrapper with data key', () => {
        const obs$ = interceptor.intercept({} as any, {
            handle: () => of(props),
        })

        obs$.subscribe({
            next: response => {
                expect(response).toEqual({
                    data: props,
                })
            },
        })
    })

    it('should not wrapper when meta key is present', () => {
        const result = {
            data: [props],
            meta: { total: 1 },
        }

        const obs$ = interceptor.intercept({} as any, {
            handle: () => of(result),
        })

        obs$.subscribe({
            next: response => {
                expect(response).toEqual(result)
            },
        })
    })
})
