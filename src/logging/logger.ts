import { ConsoleLogger } from "./consoleLogger";

export interface Logger {
  info(message: string, ...optional: unknown[]): void;
  warn(message: string, ...optional: unknown[]): void;
  error(message: string, ...optional: unknown[]): void;
  debug(message: string, ...optional: unknown[]): void;
}

export const logger: Logger = new ConsoleLogger();
