import { createLuce, rotatingFileTransport } from '../src';

const logger = createLuce({
  level: 'info',
  stream: rotatingFileTransport({ filePath: './app.log', maxSize: 1024, maxFiles: 3 }), // 1KB for demo
  format: 'pretty',
});

logger.info('Server running Port is 3000');