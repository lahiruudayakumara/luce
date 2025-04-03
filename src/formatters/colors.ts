import { trace } from "next/dist/trace";

export const COLORS = {
    reset: '\x1b[0m',
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    fatal: '\x1b[35m',
    trace: '\x1b[34m',
} as const;

export function colorize(text: string, level: keyof typeof COLORS): string {
    return `${COLORS[level]}${text}${COLORS.reset}`;
}