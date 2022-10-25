/**
 * Получение url-строки для подлючения к БД
 * @param username имя пользователя
 * @param password пароль
 * @param host имя хоста
 * @param port прослушиваемый порт
 * @param databaseName имя базы данных, к которой требуется подключение
 */
const getUri = (username: string, password: string, host: string, port: number, databaseName: string) =>
  `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;

export default getUri;
