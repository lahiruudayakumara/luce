import { createWriteStream } from 'fs';
import { fileTransport } from '../../src/transports/file';

jest.mock('fs');

describe('fileTransport', () => {
    const mockFilePath = 'test/path/to/file.txt';

    beforeEach(() => {
        (createWriteStream as jest.Mock).mockClear();
    });

    it('should create a writable stream with correct file path and flags', () => {
        const mockStream = { write: jest.fn() };
        (createWriteStream as jest.Mock).mockReturnValue(mockStream);

        const mockFlags = 'w';
        const stream = fileTransport({ filePath: mockFilePath, flags: mockFlags });

        expect(createWriteStream).toHaveBeenCalledWith(mockFilePath, { flags: mockFlags });
        expect(stream.write).toBeDefined();
    });

    it('should use default flags if no flags are provided', () => {
        const mockStream = { write: jest.fn() };
        (createWriteStream as jest.Mock).mockReturnValue(mockStream);

        const stream = fileTransport({ filePath: mockFilePath });

        expect(createWriteStream).toHaveBeenCalledWith(mockFilePath, { flags: 'a' });
    });

    it('should call write function on the returned stream', () => {
        const mockWrite = jest.fn((chunk, encoding, callback) => callback());
        const mockStream = { write: mockWrite };
        (createWriteStream as jest.Mock).mockReturnValue(mockStream);

        const stream = fileTransport({ filePath: mockFilePath });

        stream.write('test data', 'utf8', () => { });

        expect(mockWrite).toHaveBeenCalledWith('test data', 'utf8', expect.any(Function));
    });
});
