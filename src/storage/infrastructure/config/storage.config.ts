import { diskStorage } from "multer";
import { extname } from "path";

const PATH_STORAGE = `${process.cwd()}/storage`;

export const multerConfig = {
    storage: diskStorage({
        destination: (_req, _file, cb) => {
            cb(null,PATH_STORAGE);
        },
        filename: (_req, file, cb) => {
            const ext = extname(file.originalname);
            const fileNameRandom = `file-${Date.now()}${ext}`;
            cb(null, fileNameRandom);
        }
    })
}