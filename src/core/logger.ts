import { Formatter, LogMeta, LoggerOptions } from '../utils/types';
import { LEVELS, Level } from './levels';

import { AsyncQueue } from '../utils/queue';
import { Writable } from 'stream';
import { formatPretty } from '../formatters/pretty';

export class Luce {
  private level: number;
  private stream: Writable;
  private bindings: LogMeta;
  private queue: AsyncQueue;
  private formatter: Formatter;

  constructor(options: LoggerOptions = {}, bindings: LogMeta = {}) {
    this.level = LEVELS[options.level || 'info'].value;
    this.stream = options.stream || process.stdout;
    this.bindings = bindings;
    this.queue = new AsyncQueue(this.stream);

    if (typeof options.format === 'function') {
      this.formatter = options.format;
    } else if (options.format === 'pretty') {
      this.formatter = formatPretty;
    } else {
      this.formatter = (level, message, meta) =>
        JSON.stringify({
          level: LEVELS[level].value,
          time: Date.now(),
          msg: message,
          ...bindings,
          ...meta,
        });
    }
  }

  private log(level: Level, message: string, meta?: LogMeta) {
    if (LEVELS[level].value < this.level) return;
    const logEntry = this.formatter(level, message, { ...this.bindings, ...meta });
    this.queue.write(logEntry + '\n');
  }

  child(bindings: LogMeta) {
    return new Luce(
      {
        level: Object.keys(LEVELS).find((key) => LEVELS[key as Level].value === this.level) as Level,
        stream: this.stream,
        format: this.formatter,
      },
      { ...this.bindings, ...bindings }
    );
  }

  trace(message: string, meta?: LogMeta) {
    this.log('trace', message, meta);
  }

  debug(message: string, meta?: LogMeta) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.log('error', message, meta);
  }

  fatal(message: string, meta?: LogMeta) {
    this.log('fatal', message, meta);
  }
}

export function createLuce(options?: LoggerOptions): Luce {
  return new Luce(options);
}