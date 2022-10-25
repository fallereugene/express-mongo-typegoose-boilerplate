import crypto from 'crypto';

/**
 * Алгоритм хеширования
 * @param line строка
 * @param salt соль
 * @returns
 */
export const createSHA256 = (line: string, salt: string): string =>
  crypto.createHmac('sha256', salt).update(line).digest('hex');
