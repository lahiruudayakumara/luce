import { Writable } from 'stream';

export class AsyncQueue {
  private queue: string[] = [];
  private isWriting = false;
  private stream: Writable;

  constructor(stream: Writable) {
    this.stream = stream;
  }

  async write(entry: string) {
    this.queue.push(entry);
    await this.process();
  }

  private async process() {
    if (this.isWriting || this.queue.length === 0) return;
    this.isWriting = true;

    while (this.queue.length > 0) {
      const entry = this.queue.shift()!;
      await new Promise((resolve) => this.stream.write(entry, resolve));
    }

    this.isWriting = false;
  }
}