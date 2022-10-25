import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MiddlewareInterface } from '../contracts/index.js';
import { ValidationError } from '../services/error/index.js';
import { processValidationErrors } from '../utils/index.js';

/**
 * Миддлвэр для валидации переданных данных
 */
export class ValidateObjectDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  /**
   * Метод, вызываемый при вызове миддлвэра
   * @param req Объект запроса
   * @param _res Объект ответа
   * @param next Передача управления
   */
  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const { body, path } = req;
    const instance = plainToInstance(this.dto, body);
    const validationResult = await validate(instance);

    if (validationResult.length) {
      throw new ValidationError(`Validation error: "${path}"`, processValidationErrors(validationResult));
    }

    next();
  }
}
