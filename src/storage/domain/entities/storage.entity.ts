export class StorageEntity{
    constructor(
        public readonly id: string,
        public readonly url: string,
        public readonly filename: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}