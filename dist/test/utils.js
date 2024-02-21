export var LogLevel;
(function (LogLevel) {
    LogLevel["info"] = "info";
    LogLevel["debug"] = "debug";
    LogLevel["error"] = "error";
    LogLevel["warn"] = "warn";
    LogLevel["success"] = "success";
})(LogLevel || (LogLevel = {}));
export class Logger {
    namespace;
    constructor(namespace) {
        this.namespace = namespace;
    }
    log(message, level, color) {
        console.log(color, `[${this.namespace}] [${new Date().toLocaleString()}] [${level}] ${message}`, Colors.Reset);
    }
    info(message) {
        this.log(message, LogLevel.info, Colors.Blue);
    }
    debug(message) {
        this.log(message, LogLevel.debug, Colors.Dim);
    }
    error(message) {
        this.log(message, LogLevel.error, Colors.Red);
    }
    warn(message) {
        this.log(message, LogLevel.warn, Colors.Yellow);
    }
    success(message) {
        this.log(message, LogLevel.success, Colors.Green);
    }
}
var Colors;
(function (Colors) {
    Colors["Black"] = "\u001B[30m";
    Colors["Red"] = "\u001B[31m";
    Colors["Green"] = "\u001B[32m";
    Colors["Yellow"] = "\u001B[33m";
    Colors["Blue"] = "\u001B[34m";
    Colors["Magenta"] = "\u001B[35m";
    Colors["Cyan"] = "\u001B[36m";
    Colors["White"] = "\u001B[37m";
    Colors["Gray"] = "\u001B[90m";
    Colors["Reset"] = "\u001B[0m";
    Colors["Bright"] = "\u001B[1m";
    Colors["Dim"] = "\u001B[2m";
    Colors["Underscore"] = "\u001B[4m";
    Colors["Blink"] = "\u001B[5m";
    Colors["Reverse"] = "\u001B[7m";
    Colors["Hidden"] = "\u001B[8m";
})(Colors || (Colors = {}));
export const logger = new Logger("test");
