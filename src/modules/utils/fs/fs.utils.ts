import { existsSync, mkdirSync, readFile, writeFile } from "node:fs";
import { join, dirname } from "node:path";

export const readFileAsync = (relativePath: string) => {
    const rootDirPath = dirname(require.main.filename);
    const filePath = join(rootDirPath, relativePath);
    return new Promise((resolve, reject) => {
        readFile(filePath, { encoding: "utf-8" }, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};

export const saveFileAsync = (relativePath: string, data: Buffer) => {
    return new Promise<void>((resolve, reject) => {
        const rootDirPath = dirname(require.main.filename);
        const filePath = join(rootDirPath, relativePath);
        writeFile(filePath, data, (error) => {
            if (error) {
                console.error(error);
                reject(error);
            }
            resolve();
        });
    });
};

export const ensureDirSync = (relativePath): void => {
    const rootDirPath = dirname(require.main.filename);
    const dirPath = join(rootDirPath, relativePath);
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
};
