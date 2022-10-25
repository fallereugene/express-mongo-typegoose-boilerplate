import { generateRandomValue } from './index.js';

/**
 * Получение случайного количества элементов из массива
 * @param items Коллекция элементов
 */
const getRandomElements = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export default getRandomElements;
