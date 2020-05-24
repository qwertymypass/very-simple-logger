import os from 'os';

export type IType = 'simple' | 'json';
export type ILevel = 'info' | 'debug' | 'silent';
export type IMessage = string | number;
export type ITime = 'iso' | 'local';
export type ILoggerFunction = (message: IMessage, params?: object) => void;

export interface IOptions {
  type?: IType;
  level?: ILevel;
  colorize?: boolean;
  separator?: string;
  time?: ITime;
}

export default class Logger {
  private readonly EOL = os.EOL;
  private type: IType;
  private level: ILevel;
  private colorize: boolean;
  private separator: string;
  private time: ITime;

  constructor() {
    this.type = 'simple';
    this.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    this.colorize = true;
    this.separator = '|';
    this.time = 'iso';
  }

  public setType(type: IType): Logger {
    this.type = type;
    return this;
  }

  public setLevel(level: ILevel): Logger {
    this.level = level;
    return this;
  }

  public setColorize(colorize: boolean): Logger {
    this.colorize = colorize;
    return this;
  }

  public setSeparator(separator: string): Logger {
    this.separator = separator;
    return this;
  }

  public setTime(typeTime: ITime): Logger {
    this.time = typeTime;
    return this;
  }

  public setOptions(options: IOptions): Logger {
    this.level = (options && options.level) || this.level;
    this.type = (options && options.type) || this.type;
    this.colorize = (options && options.colorize) || this.colorize;
    this.separator = (options && options.separator) || this.separator;
    this.time = (options && options.time) || this.time;
    return this;
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

  private print(level: string, message: IMessage, params: object = {}): void {
    const timestamp = this.getTime();

    switch (this.type) {
      case 'json':
        return this.jsonLog(level, message, params, timestamp);
      default:
        return this.simpleLog(level, message, params, timestamp);
    }
  }

  private jsonLog(level: string, message: IMessage, params: object, timestamp: string): void {
    const payload = { timestamp, level, message, params };

    if (!Object.keys(params).length) {
      delete payload.params;
    }

    const msg = JSON.stringify(payload);
    this.toConsole(msg, level);
  }

  private simpleLog(level: string, message: IMessage, params: object = {}, timestamp: string): void {
    const arrayParams = Object.keys(params).map(key => params[key] && `${key} -> ${params[key]}`);
    const stringParams = arrayParams.join(` ${this.separator} `);
    const repeatSpace = ' '.repeat(7 - level.length);

    if (this.colorize === true) {
      level = this.getWithColor(level);
    }

    const msg = `${timestamp} [${level}]${repeatSpace}${message}\t${stringParams}`;
    this.toConsole(msg, level);
  }

  private toConsole(message: string, level: string): void {
    if (['info', 'debug'].includes(level)) {
      process.stdout ? process.stdout.write(`${message}${this.EOL}`) : console.info(message);
    } else {
      process.stderr ? process.stderr.write(`${message}${this.EOL}`) : console.error(message);
    }
  }

  private getTime() {
    switch (this.time) {
      case 'local':
        return new Date().toLocaleString();
      case 'iso':
      default:
        return new Date().toISOString();
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
