import 'reflect-metadata';
import { CliCommandInterface } from '../contracts';
import { FileReaderService } from '../../../services/file-reader/index.js';
import { getNormalizedData } from '../../../services/file-reader/utils/index.js';
import { DatabaseService } from '../../../services/database/index.js';
import { DatabaseInterface } from '../../../services/database/contracts/index.js';
import { ConfigService } from '../../../services/config/index.js';
import { ConfigInterface } from '../../../services/config/contracts/index.js';
import { LoggerService } from '../../../services/logger/index.js';
import { getUri } from '../../../services/database/utils/index.js';
import { LoggerInterface } from '../../../services/logger/contracts/index.js';
import { UserService, UserServiceInterface, UserModel } from '../../../modules/user/index.js';
import { PASSWORD } from '../constants/index.js';

export default class ImportCommand implements CliCommandInterface {
  readonly name = '--import';

  private readonly logger!: LoggerInterface;
  private readonly databaseService!: DatabaseInterface;
  private readonly userService!: UserServiceInterface;
  private readonly configService!: ConfigInterface;
  private salt!: string;

  constructor() {
    this.emitReadLine = this.emitReadLine.bind(this);
    this.emitCompleteReading = this.emitCompleteReading.bind(this);

    this.logger = new LoggerService();
    this.configService = new ConfigService(this.logger);
    this.databaseService = new DatabaseService(this.logger);
    this.userService = new UserService(this.logger, UserModel);
  }

  /**
   * Исполнение CLI-команды
   * Установка соединения и импорт записей в БД
   */
  async execute(filename: string) {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, SALT } = this.configService.getFullSchema();
    const uri = getUri(DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME);
    this.salt = SALT;

    await this.databaseService.connect(uri);

    const reader = new FileReaderService(filename.trim());

    reader.on('line', this.emitReadLine);
    reader.on('end', this.emitCompleteReading);

    try {
      await reader.read();
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }
      console.log(`Error occured during reading file: ${e.message}`);
    }
  }

  /**
   * Запись данных в БД
   * @param data Нормализованная структура данных
   */
  private async insertData(data: { name: string; email: string }): Promise<void> {
    await this.userService.findOrCreate(
      {
        ...data,
        password: PASSWORD,
      },
      this.salt,
    );
  }

  /**
   * Метод вызывается при наступлении события окончания чтения строки
   * @param line Переданная строка
   */
  private async emitReadLine(line: string, resolve: () => void) {
    const normalizedData = getNormalizedData(line);
    await this.insertData(normalizedData);
    resolve();
  }

  /**
   * Событие наступает по завершению чтения файла
   * @param count Количество обработанных строк
   */
  private emitCompleteReading(count: number) {
    console.log(`${count} rows processed`);
  }
}
