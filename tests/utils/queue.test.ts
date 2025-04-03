import { AsyncQueue } from '../../src/utils/queue';
import { Writable } from 'stream';

describe('AsyncQueue', () => {
  let mockStream: Writable;

  beforeEach(() => {
    mockStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });
  });

  it('should queue and write entries asynchronously', async () => {
    const queue = new AsyncQueue(mockStream);
    const writeSpy = jest.spyOn(mockStream, 'write');
    await queue.write('test entry');
    expect(writeSpy).toHaveBeenCalledWith('test entry', expect.any(Function));
  });

  it('should process queue sequentially', async () => {
    const queue = new AsyncQueue(mockStream);
    const writeSpy = jest.spyOn(mockStream, 'write');
    await Promise.all([queue.write('first'), queue.write('second')]);
    expect(writeSpy.mock.calls[0][0]).toBe('first');
    expect(writeSpy.mock.calls[1][0]).toBe('second');
  });
});