export interface JwtToken {
    sign(payload: object, expiresIn?: string): string;
    verify<T>(token: string): T | null;
    decode<T>(token: string): T | null;
}