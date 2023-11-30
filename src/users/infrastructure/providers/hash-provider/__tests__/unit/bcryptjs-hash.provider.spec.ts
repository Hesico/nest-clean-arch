import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider'

describe('BcryptjsHashProvider unit Tests', () => {
    let sut: BcryptjsHashProvider

    beforeEach(() => {
        sut = new BcryptjsHashProvider()
    })

    it('Should return encrypted password', async () => {
        const password = 'TestPassword123'
        const hash = await sut.generateHash(password)

        expect(hash).toBeDefined()
    })

    it('Should return false if password does not match', async () => {
        const password = 'TestPassword123'
        const hash = await sut.generateHash(password)
        const result = await sut.compareHash('fake', hash)

        expect(result).toBe(false)
    })

    it('Should return true if password matches', async () => {
        const password = 'TestPassword123'
        const hash = await sut.generateHash(password)
        const result = await sut.compareHash(password, hash)

        expect(result).toBe(true)
    })
})
