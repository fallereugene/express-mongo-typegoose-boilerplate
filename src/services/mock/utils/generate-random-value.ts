/**
 * Генерация случайного числа в заданном диапазоне
 * @param min Минимальное значение диапазона
 * @param max Максимальное значение диапазона
 * @param numAfterDigit Количество знаков после разделителя
 */
const generateRandomValue = (min: number, max: number, numAfterDigit = 0) =>
  +(Math.random() * (max - min) + min).toFixed(numAfterDigit);

export default generateRandomValue;
