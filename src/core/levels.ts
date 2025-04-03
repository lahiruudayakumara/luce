export const LEVELS = {
    trace: {
        value: 5,
        label: 'TRACE',
        emoji: '🔍',
        description: 'Detailed debugging information, more verbose than debug',
    },
    debug: {
        value: 10,
        label: 'DEBUG',
        emoji: '🐛',
        description: 'Information useful for debugging during development',
    },
    info: {
        value: 30,
        label: 'INFO',
        emoji: 'ℹ️',
        description: 'General operational entries about system activity',
    },
    warn: {
        value: 40,
        label: 'WARN',
        emoji: '⚠️',
        description: 'Indications of potential issues or unusual behavior',
    },
    error: {
        value: 50,
        label: 'ERROR',
        emoji: '❌',
        description: 'Errors that impact a specific operation but not the system',
    },
    fatal: {
        value: 60,
        label: 'FATAL',
        emoji: '💀',
        description: 'Critical errors causing system failure or shutdown',
    },
} as const;


export type Level = keyof typeof LEVELS;

export interface LevelDefinition {
    value: number;
    label: string;
    emoji: string;
    description: string;
}

export function defineCustomLevel(name: string, definition: LevelDefinition): void {
    if (name in LEVELS) {
        throw new Error(`Level "${name}" already exists`);
    }
    (LEVELS as any)[name] = definition;
}