import * as jose from 'jose';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../contracts/index.js';

/**
 * Миддлвэр аутентификации пользователя
 */
export class AuthenticationMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  /**
   * Метод, вызываемый при вызове миддлвэра.
   * @param req Обьъект запроса
   * @param _res Объект ответа
   * @param next Передача управления
   */
  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jose.jwtVerify(token, crypto.createSecretKey(this.jwtSecret, 'utf-8'));
      req.user = {
        email: payload.email as string,
        id: payload.id as string,
      };

      next();
    } catch {
      next();
    }
  }
}
