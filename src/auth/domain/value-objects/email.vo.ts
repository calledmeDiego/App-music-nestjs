export class Email {
    readonly value: string;
    
    constructor(value: string){
        this.value = value;
    }

    static fromString(value: string): Email {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            throw new Error('Invalid email format');
        }
        return new Email(value);
    }

    equals(other: Email) {
        return this.value === other.value;
    }
}