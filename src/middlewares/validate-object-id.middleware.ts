import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../contracts/index.js';
import { HttpError } from '../services/error/index.js';

/**
 * Миддлвэр для валидации переданного id документа
 */
export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  /**
   * Метод, вызываемый при вызове миддлвэра
   * @param param0 Переданные параметры
   * @param _res Объект ответа
   * @param next Передача управления
   */
  execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (!isValidObjectId(objectId)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `Invalid passed id: ${objectId}`, this.constructor.name);
    }

    next();
  }
}
