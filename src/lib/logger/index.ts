/**
 * Structured logger for Cloudflare Workers / Edge environments.
 * Uses console methods to output structured JSON logs.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  data?: Record<string, unknown>;
  error?: string | Error;
}

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'session',
  'cookie',
  'authorization',
  'auth',
  'key',
];

class Logger {
  private formatLog(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: unknown
  ): LogEntry {
    const sanitizedData = this.sanitizeData(data);
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(sanitizedData && Object.keys(sanitizedData).length > 0 ? { data: sanitizedData } : {}),
    };

    if (error) {
      if (error instanceof Error) {
        entry.error = {
          message: error.message,
          name: error.name,
          stack: error.stack,
        } as any;
      } else {
        entry.error = String(error);
      }
    }

    return entry;
  }

  private sanitizeData(data?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!data) return undefined;

    try {
      // Deep clone to avoid mutating the original object
      const cloned = JSON.parse(JSON.stringify(data));
      this.redactSensitive(cloned);
      return cloned;
    } catch {
      // Fallback if data is not JSON serializable (e.g. contains circular refs)
      return { _warning: 'Data could not be sanitized and was omitted to prevent logging sensitive information.' };
    }
  }

  private redactSensitive(obj: any): void {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const lowerKey = key.toLowerCase();
        
        const isSensitive = SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive));
        
        if (isSensitive) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          this.redactSensitive(obj[key]);
        }
      }
    }
  }

  public debug(message: string, data?: Record<string, unknown>): void {
    const entry = this.formatLog('debug', message, data);
    console.debug(JSON.stringify(entry));
  }

  public info(message: string, data?: Record<string, unknown>): void {
    const entry = this.formatLog('info', message, data);
    console.info(JSON.stringify(entry));
  }

  public warn(message: string, data?: Record<string, unknown>, error?: unknown): void {
    const entry = this.formatLog('warn', message, data, error);
    console.warn(JSON.stringify(entry));
  }

  public error(message: string, data?: Record<string, unknown> | Error, error?: unknown): void {
    let err = error;
    let logData: Record<string, unknown> | undefined;

    if (data instanceof Error) {
      err = data;
      logData = undefined;
    } else {
      logData = data;
    }

    const entry = this.formatLog('error', message, logData, err);
    console.error(JSON.stringify(entry));
  }
}

export const logger = new Logger();
