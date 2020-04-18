import os from 'os';

type ILoggerFunction = (message: string, params?: object) => void;
type IType = 'simple' | 'json';
type ILevel = 'info' | 'debug' | 'silent';

interface IOptions {
  type?: IType;
  level?: ILevel;
  colorize?: boolean;
}

export default class Logger {
  private type: IType;
  private level: ILevel;
  private colorize: boolean;
  private EOL = os.EOL;

  constructor() {
    this.type = 'simple';
    this.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    this.colorize = true;
  }

  public setType(type: IType): void {
    this.type = type;
  }

  public setLevel(level: ILevel): void {
    this.level = level;
  }

  public setColorize(colorize: boolean): void {
    this.colorize = colorize;
  }

  public setOptions(options: IOptions): void {
    this.level = (options && options.level) || this.level;
    this.type = (options && options.type) || this.type;
    this.colorize = (options && options.colorize) || this.colorize;
  }

  public debug: ILoggerFunction = (message, params) => this.checkLevel('debug') && this.print('debug', message, params);
  public info: ILoggerFunction = (message, params) => this.checkLevel('info') && this.print('info', message, params);
  public warn: ILoggerFunction = (message, params) => this.checkLevel('warn') && this.print('warn', message, params);
  public error: ILoggerFunction = (message, params) => this.checkLevel('error') && this.print('error', message, params);

  private checkLevel(callLevel: string): boolean {
    if (this.level === 'silent') {
      return false;
    }

    if (callLevel === 'debug' && this.level !== 'debug') {
      return false;
    }

    return true;
  }

  private print(level: string, message: string, params: object = {}): void {
    const timestamp = new Date().toISOString();

    switch (this.type) {
      case 'json':
        return this.jsonLog(level, message, params, timestamp);
      default:
        return this.simpleLog(level, message, params, timestamp);
    }
  }

  private jsonLog(level: string, message: string, params: object, timestamp: string): void {
    const msg = JSON.stringify({ timestamp, level, message, params: { ...params } });
    this.toConsole(msg, level);
  }

  private simpleLog(level: string, message: string, params: object = {}, timestamp: string): void {
    const arrayParams = Object.keys(params).map(key => params[key] && `${key} -> ${params[key]}`);
    const stringParams = arrayParams.length ? `params: ${arrayParams.join(' | ')}` : '';
    const repeatSpace = ' '.repeat(7 - level.length);

    if (this.colorize === true) {
      level = this.getWithColor(level);
    }

    const msg = `[${timestamp}] [${level}]${repeatSpace}${message}\t${stringParams}`;
    this.toConsole(msg, level);
  }

  private toConsole(message: string, level: string): void {
    if (['info', 'debug'].includes(level)) {
      process.stdout ? process.stdout.write(`${message}${this.EOL}`) : console.log(message);
    } else {
      process.stderr ? process.stderr.write(`${message}${this.EOL}`) : console.error(message);
    }
  }

  private getWithColor(level: string): string {
    switch (level) {
      case 'debug':
        return `\x1b[34m${level}\x1b[0m`;
      case 'info':
        return `\x1b[32m${level}\x1b[0m`;
      case 'warn':
        return `\x1b[33m${level}\x1b[0m`;
      case 'error':
        return `\x1b[31m${level}\x1b[0m`;
    }
  }
}
