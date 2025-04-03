import { Writable } from 'stream';
import { createWriteStream } from 'fs';

export interface FileOptions {
    filePath: string;
    flags?: string
}

export function fileTransport(options: FileOptions): Writable {
    const { filePath, flags = 'a' } = options;
    return createWriteStream(filePath, { flags });
}