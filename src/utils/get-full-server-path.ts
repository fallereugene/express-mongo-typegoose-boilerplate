/**
 * Получение полного адреса сервера
 * @param host Хост приложения
 * @param port Порт приложения
 */
export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;
