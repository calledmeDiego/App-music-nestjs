export type UserRole = 'user' | 'admin';

export class Role {
    readonly value: string;
    public constructor(value: UserRole) {
        this.value = value
     }

    /**
     * Define los roles válidos.
     */
    public static readonly VALID_ROLES: UserRole[] = ['user', 'admin'];

    /**
     * Factory method para crear el Value Object, aplicando validación.
     */
    public static fromString(role: string): Role {
        const lowerCaseRole = role.toLowerCase();
        if (!Role.VALID_ROLES.includes(lowerCaseRole as UserRole)) {
            throw new Error('')
        }
        return new Role(lowerCaseRole as UserRole);
    }

    public equals(other: Role): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        return this.value === other.value;
    }
}