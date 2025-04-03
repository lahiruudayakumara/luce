import { createWriteStream, statSync } from 'fs';

import { RotatingFileOptions } from '../utils/types';
import { Writable } from 'stream';

export function rotatingFileTransport(options: RotatingFileOptions): Writable {
  const { filePath, maxSize = 10 * 1024 * 1024, maxFiles = 5 } = options;
  let currentSize = 0;

  const rotate = () => {
    try {
      for (let i = maxFiles - 1; i > 0; i--) {
        const oldFile = `${filePath}.${i}`;
        const newFile = `${filePath}.${i + 1}`;
        if (statSync(oldFile, { bigint: false })) {
          require('fs').renameSync(oldFile, newFile);
        }
      }
      require('fs').renameSync(filePath, `${filePath}.1`);
      currentSize = 0;
    } catch (e) {
      if (e.code !== 'ENOENT') {
        console.error(`Error rotating log files: ${e.message}`);
      }
    }
  };

  const stream = createWriteStream(filePath, { flags: 'a' });
  const originalWrite = stream.write.bind(stream);

  stream.write = (chunk: any, encoding?: BufferEncoding | ((error?: Error | null) => void), callback?: (error?: Error | null) => void): boolean => {
    if (typeof encoding === 'function') {
      callback = encoding;
      encoding = undefined;
    }
    const size = Buffer.byteLength(chunk);
    if (currentSize + size > maxSize) {
      rotate();
    }
    currentSize += size;
    return originalWrite(chunk, encoding as BufferEncoding, callback);
  };

  return stream;
}