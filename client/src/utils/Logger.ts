import dateFormat from "dateformat";
import chalk from "chalk";

class Logger {
  get now(): string {
    const now = new Date();
    return dateFormat(now, "dd-mm-yyyy - HH:MM:ss TT");
  }

  log(type: string, message: string): void {
    return console.log(
      `${chalk.blueBright("[INFO]")}[${type.toUpperCase()}][${
        this.now
      }]: ${message}`
    );
  }

  error(type: string, error: Error | string) {
    return console.log(
      `${chalk.redBright("[ERROR]")}[${type.toUpperCase()}][${this.now}]: ${
        typeof error === "object" ? error.stack : error
      }`
    );
  }
}

export default new Logger();
