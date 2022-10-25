import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * Преобразование переданных ненормализованных данных
 * в требуемый объект DTO.
 * @param dto Объект DTO
 * @param plainObject Ненормализованные данные
 */
export const processDto = <T, V>(dto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(dto, plainObject, { excludeExtraneousValues: true });
