export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export class Logger {
    constructor(private context: string) {}

    public debug(message: string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, message, args);
    }

    public info(message: string, ...args: any[]): void {
        this.log(LogLevel.INFO, message, args);
    }

    public warn(message: string, ...args: any[]): void {
        this.log(LogLevel.WARN, message, args);
    }

    public error(message: string, ...args: any[]): void {
        this.log(LogLevel.ERROR, message, args);
    }

    private log(level: LogLevel, message: string, args: any[]): void {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;
        
        if (args.length > 0) {
            console.log(formattedMessage, ...args);
        } else {
            console.log(formattedMessage);
        }
    }
}

export const logger = new Logger('App');