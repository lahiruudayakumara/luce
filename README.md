# Luce Logger

**Luce Logger** (Italian for "light") is a lightweight, fast, and customizable logging library for Node.js. Inspired by [Pino](https://github.com/pinojs/pino), it offers structured logging with emoji support, pretty printing, and flexible transports—all with zero runtime dependencies.

## Features


- **Fast**: Asynchronous logging with a non-blocking queue.
- **Customizable**: Supports JSON, pretty printing, or custom formatters.
- **Emoji Support**: Visual log levels (e.g., ℹ️ for info, ❌ for error).
- **Log Levels**: Predefined levels (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) with custom level support.
- **Transports**: Console, file, and rotating file outputs.
- **Child Loggers**: Add context to logs with bindings.
- **TypeScript**: Fully typed with TypeScript support.



## Installation

```bash
npm install luce-logger
```

## Usage

### Basic Example

```typescript
import { createLuce } from 'luce';

const logger = createLuce({
  level: 'info',
  format: 'pretty',
});

logger.info('Server running on port 3000');
// Output: [2025-04-03 16:00:48] INFO: ℹ️ Server running on port 3000
```

### With File Transport

```typescript
import { createLuce, fileTransport } from 'luce';

const logger = createLuce({
  level: 'info',
  stream: fileTransport({ filePath: 'app.log' }),
  format: 'pretty',
});

logger.info('Log to file');
```

### With Rotating File Transport

```typescript
import { createLuce, rotatingFileTransport } from 'luce';

const logger = createLuce({
  level: 'info',
  stream: rotatingFileTransport({
    filePath: 'app.log',
    maxSize: 1024 * 1024,
    maxFiles: 5,
  }),
  format: 'pretty',
});

logger.info('This will rotate when file exceeds 1MB');
```

### Child Loggers

```typescript
const parent = createLuce({ format: 'pretty' });
const child = parent.child({ module: 'auth' });

child.info('User logged in');
// Output: [2025-04-03 16:00:48] INFO: ℹ️ User logged in {"module":"auth"}
```

### Custom Formatter

```typescript
import { createLuce, Level } from 'luce';

const customFormatter = (level: Level, message: string, meta?: Record<string, any>) => {
  return `${level.toUpperCase()} - ${message} [${JSON.stringify(meta || {})}]`;
};

const logger = createLuce({ format: customFormatter });
logger.info('Custom format', { user: 'Alice' });
// Output: INFO - Custom format [{"user":"Alice"}]
```

## API

### `createLuce(options?: LoggerOptions): Luce`
Creates a new logger instance.

#### `LoggerOptions`
- `level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'` - Minimum log level (default: `'info'`).
- `stream?: Writable` - Output stream (default: `process.stdout`).
- `format?: 'pretty' | 'json' | Formatter` - Log format (default: `'json'`).

#### Methods
- `trace(message: string, meta?: Record<string, any>)`
- `debug(message: string, meta?: Record<string, any>)`
- `info(message: string, meta?: Record<string, any>)`
- `warn(message: string, meta?: Record<string, any>)`
- `error(message: string, meta?: Record<string, any>)`
- `fatal(message: string, meta?: Record<string, any>)`
- `child(bindings: Record<string, any>): Luce` - Creates a child logger with additional context.

### Transports
- `consoleTransport(): Writable` - Logs to console.
- `fileTransport(options: FileOptions): Writable`
  - `filePath: string` - File path.
  - `flags?: string` - Write mode (default: `'a'` for append).
- `rotatingFileTransport(options: RotatingFileOptions): Writable`
  - `filePath: string` - Base file path.
  - `maxSize?: number` - Max file size in bytes (default: 10MB).
  - `maxFiles?: number` - Max number of rotated files (default: 5).

### Levels
- Predefined: `trace` (5), `debug` (10), `info` (30), `warn` (40), `error` (50), `fatal` (60).
- Custom: Use `defineCustomLevel(name, definition)` to add new levels.

## Development

### Prerequisites
- Node.js >= 14
- npm >= 6

### Setup
```bash
git clone https://github.com/lahiruudayakumara/luce-logger.git
cd luce-logger
npm install
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Run Example
```bash
npm run example
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

MIT License. See [LICENSE](LICENSE) for details.