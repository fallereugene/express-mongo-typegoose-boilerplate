import { generateRandomValue } from './index.js';

/**
 * Получение случайного элемента массива
 * @param items Коллекция элементов
 */
const getRandomElement = <T>(items: T[]): T => items[generateRandomValue(0, items.length - 1)];

export default getRandomElement;
