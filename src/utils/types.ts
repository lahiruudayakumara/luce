import { Level } from '../core/levels';
import { Writable } from 'stream';

export type LogMeta = Record<string, any>;

export type Formatter = (level: Level, message: string, meta?: LogMeta) => string;

export interface LoggerOptions {
  level?: Level;
  stream?: Writable;
  format?: 'pretty' | 'json' | Formatter;
}

export interface RotatingFileOptions {
  filePath: string;
  maxSize?: number;
  maxFiles?: number;
}