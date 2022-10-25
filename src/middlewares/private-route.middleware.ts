import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../contracts/index.js';
import { HttpError } from '../services/error/index.js';

/**
 * Миддлвэр проверки доступности роута
 */
export class PrivateRouteMiddleware implements MiddlewareInterface {
  /**
   * Метод, вызываемый при вызове миддлвэра.
   * @param req Обьъект запроса
   * @param _res Объект ответа
   * @param next Передача управления
   */
  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'PrivateRouteMiddleware');
    }

    return next();
  }
}
