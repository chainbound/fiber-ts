export declare enum LogLevel {
    info = "info",
    debug = "debug",
    error = "error",
    warn = "warn",
    success = "success"
}
export declare class Logger {
    private namespace;
    constructor(namespace: string);
    private log;
    info(message: string): void;
    debug(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    success(message: string): void;
}
export declare const logger: Logger;
