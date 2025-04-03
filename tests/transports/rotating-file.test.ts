import * as fs from 'fs';

import { RotatingFileOptions } from '../../src/utils/types';
import { Writable } from 'stream';
import { rotatingFileTransport } from '../../src/transports/rotating-file';

jest.mock('fs');

describe('rotatingFileTransport', () => {
    const defaultOptions: RotatingFileOptions = {
        filePath: 'test.log',
        maxSize: 100,
        maxFiles: 3,
    };

    let mockStream: Writable;
    let mockWrite: jest.Mock;

    beforeEach(() => {
        mockWrite = jest.fn();
        mockStream = new Writable({
            write: mockWrite,
        });

        jest.clearAllMocks();
        (fs.renameSync as jest.Mock).mockImplementation(() => { });
        (fs.statSync as jest.Mock).mockImplementation(() => ({ size: 0 }));
        (fs.createWriteStream as jest.Mock).mockReturnValue(mockStream);
    });

    it('creates a writable stream with provided options', () => {
        const stream = rotatingFileTransport(defaultOptions);
        expect(stream).toBeInstanceOf(Writable);
        expect(fs.createWriteStream).toHaveBeenCalledWith('test.log', { flags: 'a' });
    });

    it('uses default values when options are partially provided', () => {
        const stream = rotatingFileTransport({ filePath: 'test.log' });
        expect(stream).toBeInstanceOf(Writable);
        expect(fs.createWriteStream).toHaveBeenCalledWith('test.log', { flags: 'a' });
    });

    it('writes data without rotation when under maxSize', () => {
        const stream = rotatingFileTransport(defaultOptions);

        stream.write('test data');

        expect(mockWrite).toHaveBeenCalledWith(
            Buffer.from('test data'),
            'buffer',
            expect.any(Function)
        );
        expect(fs.renameSync).not.toHaveBeenCalled();
    });

    it('rotates files when size exceeds maxSize', () => {
        (fs.statSync as jest.Mock).mockReturnValue({ size: 0 });

        const stream = rotatingFileTransport(defaultOptions);

        const largeData = Buffer.alloc(101, 'a');
        stream.write(largeData);

        expect(fs.renameSync).toHaveBeenCalledTimes(3);
        expect(mockWrite).toHaveBeenCalledWith(
            largeData,
            'buffer',
            expect.any(Function)
        );
    });

    it('handles file rotation correctly with maxFiles', () => {
        (fs.statSync as jest.Mock).mockReturnValue({ size: 0 });

        const stream = rotatingFileTransport(defaultOptions);

        stream.write(Buffer.alloc(150));

        expect(fs.renameSync).toHaveBeenCalledWith('test.log.2', 'test.log.3');
        expect(fs.renameSync).toHaveBeenCalledWith('test.log.1', 'test.log.2');
        expect(fs.renameSync).toHaveBeenCalledWith('test.log', 'test.log.1');
    });

    it('handles errors during rotation gracefully', () => {
        (fs.statSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });
        (fs.renameSync as jest.Mock).mockImplementation(() => {
            throw new Error('Rename failed');
        });

        const stream = rotatingFileTransport(defaultOptions);

        expect(() => stream.write(Buffer.alloc(150))).not.toThrow();
        expect(mockWrite).toHaveBeenCalled();
    });

    it('supports callback-style write', () => {
        const stream = rotatingFileTransport(defaultOptions);
        const callback = jest.fn();

        stream.write('test', callback);

        expect(mockWrite).toHaveBeenCalledWith(
            Buffer.from('test'),
            'buffer',
            expect.any(Function)
        );
    });

    it('supports encoding parameter', () => {
        const stream = rotatingFileTransport(defaultOptions);
        const callback = jest.fn();

        stream.write('test', 'utf8', callback);

        expect(mockWrite).toHaveBeenCalledWith(
            Buffer.from('test', 'utf8'),
            'buffer',
            expect.any(Function)
        );
    });
});