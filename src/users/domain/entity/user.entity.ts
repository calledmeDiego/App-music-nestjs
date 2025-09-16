import { Email } from "../values-object/email.vo";

export class User {
    /**
     *
     */
    constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly name: string | null,
        public readonly password: string,
        public readonly role: 'user' | 'admin',
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    
    ) {
        
    }
}