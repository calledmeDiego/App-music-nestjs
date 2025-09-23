export interface PasswordEncrypter {
    encrypt(plainText: string): Promise<string>;
    compare(plainText: string, hashed: string): Promise<boolean>;
}