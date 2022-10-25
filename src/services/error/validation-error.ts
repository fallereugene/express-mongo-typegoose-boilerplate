import { StatusCodes } from 'http-status-codes';
import { ValidationError as ValidationErrorType } from './contracts/index.js';

export class ValidationError extends Error {
  httpStatusCode: number;

  details: ValidationErrorType[] = [];

  constructor(message: string, details: ValidationErrorType[]) {
    super(message);
    // HTTP-код сгенерированный исходным сервером для конкретно этого типа проблемы
    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    // Человекочитаемое объяснение, характерное для конкретно этого случая.
    this.message = message;
    // Короткое описание проблемы на английском языке для чтения инженерами
    this.details = details;
  }
}
