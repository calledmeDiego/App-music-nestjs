export class Email {
    
    constructor(private readonly value: string){}

    static create(value: string): Email {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            throw new Error('Invalid email format');
        }

        return new Email(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email) {
        return this.value === other.value;
    }
}