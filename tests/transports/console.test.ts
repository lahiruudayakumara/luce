import { consoleTransport } from '../../src/transports/console';

describe('Console Transport', () => {
  it('should return process.stdout', () => {
    const stream = consoleTransport();
    expect(stream).toBe(process.stdout);
  });
});