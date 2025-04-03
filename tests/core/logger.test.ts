import { Luce, createLuce } from '../../src/core/logger';

import { Writable } from 'stream';

describe('Luce Logger', () => {
  let mockStream: Writable;
  let writeSpy: jest.SpyInstance;

  beforeEach(() => {

    mockStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });

    // Spy on the write method
    writeSpy = jest.spyOn(mockStream, 'write');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a logger instance with default options', () => {
    const logger = createLuce();
    expect(logger).toBeInstanceOf(Luce);
  });

  it('should log info messages with pretty format', () => {
    const logger = createLuce({ stream: mockStream, format: 'pretty', level: 'info' });
    logger.info('Test message', { key: 'value' });
    expect(writeSpy).toHaveBeenCalled();
    const logOutput = writeSpy.mock.calls[0][0].toString();
    expect(logOutput).toMatch(/\[.*\] INFO: ℹ️ Test message {"key":"value"}/);
  });

  it('should not log below the set level', () => {
    const logger = createLuce({ stream: mockStream, level: 'warn' });
    logger.info('This should not log');
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('should support child loggers with bindings', () => {
    const parent = createLuce({ stream: mockStream, format: 'pretty' });
    const child = parent.child({ module: 'test' });
    child.info('Child message');
    const logOutput = writeSpy.mock.calls[0][0].toString();
    expect(logOutput).toContain('"module":"test"');
  });
});
