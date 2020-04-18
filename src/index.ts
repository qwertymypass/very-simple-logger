import ConsoleLogger from './singl';
const logger = new ConsoleLogger();

logger.setColorize(true);
logger.setType('simple');

export default logger;
