/**
 * Обработка "сырых" данных и получение нормальизованной структры данных
 * @param data Ненормализованные данные
 */
const getNormalizedData = (data: string): { name: string; email: string } => {
  const normalizedString = data
    .split('\n')
    .filter((row) => row.trim() !== '')
    .map((line) => line.split('\t'));

  const [name, email] = normalizedString[0];

  return {
    name,
    email,
  };
};

export default getNormalizedData;
