export class StorageEntity{
    constructor(
        public readonly id: string,
        public readonly url: string,
        public readonly filename: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static CreateFormStorage(data: {
        url: string,
        filename: string
    }) {
        return new StorageEntity(
            '',
            data.url,
            data.filename,
            new Date(),
            new Date()
        );
    }

    toPrimitives() {
        const { updatedAt,...publicData } = this;
        return publicData;
    }  

    static toParse(data) {
        return new StorageEntity(
            data.id,
            data.url,
            data.filename,
            data.createdAt,
            data.updatedAt            
        );
    }

    
}