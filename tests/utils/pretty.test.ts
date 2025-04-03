import { formatPretty } from '../../src/formatters/pretty';

describe('Pretty Formatter', () => {
    it('should format logs with timestamp, level, emoji, and message', () => {
        const output = formatPretty('info', 'Test message', { key: 'value' });
        expect(output).toMatch(/\[.*\] INFO: ℹ️ Test message {"key":"value"}/);
    });

    it('should apply colors', () => {
        const output = formatPretty('error', 'Error occurred');
        expect(output).toContain('\x1b[31m');
        expect(output).toContain('\x1b[0m');
    });
});