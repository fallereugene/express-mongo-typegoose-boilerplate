import { ValidationError } from 'class-validator';
import { ValidationError as ValidationErrorType } from '../services/error/contracts/index.js';

/**
 * Приведение списка ошибок валидатора к требуемому контракту
 * @param errors Список ошибок валидатора
 */
export const processValidationErrors = (errors: ValidationError[]): ValidationErrorType[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
