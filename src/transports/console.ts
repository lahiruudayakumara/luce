import { Writable } from 'stream';

export function consoleTransport(): Writable {
  return process.stdout;
}