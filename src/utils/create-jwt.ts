import * as jose from 'jose';
import crypto from 'crypto';

/**
 * Генерация JWT-токена на основе переданного алгоритма
 * @param algoritm Выбранный алгоритм
 * @param jwtSecret Переданный секрет
 * @expirationTime Продолжительность жизни токена, задаваемое в конфигурации настройки
 * @param payload Полезная нагрузка, зашиваемая в токен
 */
export const createJWT = async (
  algoritm: string,
  jwtSecret: string,
  expirationTime: string,
  payload: object,
): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
