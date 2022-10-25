import { CliCommandInterface } from '../contracts';

export default class HelpCommand implements CliCommandInterface {
  readonly name = '--help';

  /**
   * Исполнение CLI-команды
   */
  async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV в базу данных
            --generator <n> <path> <url> # генерирует произвольное количество тестовых данных, где n - количество 
            генерируемых объектов, path - путь, куда будет записан файл с моковыми данными, url - адрес сервера,
            к которму необходимо сделать запрос.
        `);
  }
}
