import 'reflect-metadata';
import cors from 'cors';
import express, { Express } from 'express';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../services/logger/contracts/index.js';
import { ConfigInterface } from '../../services/config/contracts/index.js';
import { DatabaseInterface } from '../../services/database/contracts/index.js';
import { ControllerInterface } from '../../services/controller/contracts/index.js';
import { ExceptionFilterInterface } from '../../services/error/index.js';
import { ContainerIoC, Route } from '../../constants/index.js';
import { getUri } from '../../services/database/utils/index.js';
import { AuthenticationMiddleware } from '../../middlewares/index.js';

@injectable()
export class Application {
  private express: Express;

  constructor(
    @inject(ContainerIoC.LoggerService) private logger: LoggerInterface,
    @inject(ContainerIoC.ConfigService) private config: ConfigInterface,
    @inject(ContainerIoC.DatabaseService) private db: DatabaseInterface,
    @inject(ContainerIoC.UserController)
    private userController: ControllerInterface,
    @inject(ContainerIoC.ExceptionFilter)
    private exceptionFilter: ExceptionFilterInterface,
  ) {
    this.express = express();
  }

  /**
   * Инициализация приложения
   */
  async init() {
    this.logger.info('Application inintializing...');

    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = this.config.getFullSchema();
    const url = getUri(DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME);

    await this.db.connect(url);

    await this.startServer();
  }

  /**
   * Запуск сервера: регистрация роутов, миддлвэров, обработки ошибок и т.д.
   */
  private async startServer() {
    this.initMiddlewares();
    this.initRoutes();
    this.initExceptionFilter();
    this.express.listen(this.config.get('PORT'));

    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }

  /**
   * Регистрация миддлвэров
   */
  private async initMiddlewares() {
    const authMiddleware = new AuthenticationMiddleware(this.config.get('SECRET_JWT'));
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(authMiddleware.execute.bind(authMiddleware));
    this.express.use('/upload', express.static(this.config.get('UPLOAD_FILES_DIRECTORY')));
    this.express.use('/static', express.static(this.config.get('STATIC_FILES_DIRECTORY')));
  }

  /**
   * Регистрация роутов
   */
  private initRoutes() {
    this.express.use(this.getUrlWithApiVersions(Route.Users), this.userController.router);
  }

  /**
   * Получение полного пути для регистрации роутов, включающий версию API
   * @param path Переданная часть пути роута
   */
  private getUrlWithApiVersions(path: string) {
    const { API_PREFIX } = this.config.getFullSchema();
    return `${API_PREFIX}/${path}`.replace(/\/{2,}/g, '/');
  }

  /**
   * Обработка ошибок
   */
  private initExceptionFilter() {
    this.express.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
}
