export interface HashProviderInterface {
    generateHash(payload: string): Promise<string>
    compareHash(payload: string, hash: string): Promise<boolean>
}
