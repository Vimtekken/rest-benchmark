import LogLevel, { LogLevelDesc } from 'loglevel';
import Chalk from 'chalk';
import Environment from './consts/Environment';
import LogLevelMessagePrefix from 'loglevel-message-prefix';


export default class Logger {
	private debugLog: LogLevel.Logger;

	private errorLog: LogLevel.Logger;

	private infoLog: LogLevel.Logger;

	private traceLog: LogLevel.Logger;

	private warnLog: LogLevel.Logger;

	names: string[];

	constructor(...names: string[]) {
		this.names = names;
		this.debugLog = Logger.createLogger(names, 'debug', Chalk.blue);
		this.errorLog = Logger.createLogger(names, 'error', Chalk.red);
		this.infoLog = Logger.createLogger(names, 'info', Chalk.green);
		this.traceLog = Logger.createLogger(names, 'trace', Chalk.white);
		this.warnLog = Logger.createLogger(names, 'warn', Chalk.yellow);
		this.setLevel(Environment.LOG_LEVEL);
	}

	private static createLogger(names: string[], level: string, colorFunc: (s: string) => string): LogLevel.Logger {
		return LogLevelMessagePrefix(
			LogLevel.getLogger(`${names.join('-')}-${level}`),
			{
				prefixFormat: `${colorFunc('[%p]')}`,
				prefixes: ['timestamp'],
				staticPrefixes: names,
				separator: ' | ',
			},
		);
	}

	debug(...logs: any[]): void {
		this.debugLog.debug(...logs);
	}

	error(...logs: any[]): void {
		this.errorLog.error(...logs);
	}

	info(...logs: any[]): void {
		this.infoLog.info(...logs);
	}

	trace(...logs: any[]): void {
		this.traceLog.trace(...logs);
	}

	warn(...logs: any[]): void {
		this.warnLog.warn(...logs);
	}

	setLevel(level: LogLevelDesc): void {
		this.debugLog.setLevel(level);
		this.errorLog.setLevel(level);
		this.infoLog.setLevel(level);
		this.traceLog.setLevel(level);
		this.warnLog.setLevel(level);
	}
}
