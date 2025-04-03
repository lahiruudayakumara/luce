import { COLORS, colorize } from './colors';
import { LEVELS, Level } from '../core/levels';

export type Formatter = (level: Level, message: string, meta?: Record<string, any>) => string;

export const formatPretty: Formatter = (level, message, meta) => {
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
    const levelData = LEVELS[level];
    const metaString = meta && Object.keys(meta).length > 0 ? ' ' + JSON.stringify(meta) : '';
    const logLine = `[${timestamp}] ${levelData.label}: ${levelData.emoji} ${message}${metaString}`;
    const colorLevel: keyof typeof COLORS = level === 'trace' || level === 'fatal' ? 'debug' : (level as keyof typeof COLORS);
    return colorize(logLine, colorLevel);
};