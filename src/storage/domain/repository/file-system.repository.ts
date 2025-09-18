export interface FileSystemPort {
    deleteFile(filename: string): Promise<void>;
}