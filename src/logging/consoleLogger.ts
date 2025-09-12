import { Logger } from "./logger";

export class ConsoleLogger implements Logger {
  private formatTimestamp(): string {
    return new Date().toISOString(); // e.g., 2025-09-12T14:35:20.123Z
  }

  info(message: string, ...optional: unknown[]): void {
    console.info(`[${this.formatTimestamp()}] [INFO] ${message}`, ...optional);
  }

  warn(message: string, ...optional: unknown[]): void {
    console.warn(`[${this.formatTimestamp()}] [WARN] ${message}`, ...optional);
  }

  error(message: string, ...optional: unknown[]): void {
    console.error(
      `[${this.formatTimestamp()}] [ERROR] ${message}`,
      ...optional,
    );
  }

  debug(message: string, ...optional: unknown[]): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        `[${this.formatTimestamp()}] [DEBUG] ${message}`,
        ...optional,
      );
    }
  }
}
