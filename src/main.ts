import 'reflect-metadata';
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { LoggerService } from './services/logger/index.js';
import { LoggerInterface } from './services/logger/contracts/index.js';
import { ConfigService } from './services/config/index.js';
import { ConfigInterface } from './services/config/contracts/index.js';
import { Application } from './app/application/index.js';
import { DatabaseService } from './services/database/index.js';
import { DatabaseInterface } from './services/database/contracts/index.js';
import { ControllerInterface } from './services/controller/contracts/index.js';
import { ContainerIoC } from './constants/index.js';
import { UserService, UserServiceInterface, UserModel, UserEntity, UserController } from './modules/user/index.js';
import { ExceptionFilter, ExceptionFilterInterface } from './services/error/index.js';

const container = new Container();
container.bind<Application>(ContainerIoC.Application).to(Application).inSingletonScope();
container.bind<LoggerInterface>(ContainerIoC.LoggerService).to(LoggerService).inSingletonScope();
container.bind<ConfigInterface>(ContainerIoC.ConfigService).to(ConfigService).inSingletonScope();
container.bind<DatabaseInterface>(ContainerIoC.DatabaseService).to(DatabaseService).inSingletonScope();

container.bind<UserServiceInterface>(ContainerIoC.UserService).to(UserService);
container.bind<types.ModelType<UserEntity>>(ContainerIoC.UserModel).toConstantValue(UserModel);
container.bind<ControllerInterface>(ContainerIoC.UserController).to(UserController).inSingletonScope();

container.bind<ExceptionFilterInterface>(ContainerIoC.ExceptionFilter).to(ExceptionFilter).inSingletonScope();

const app = container.get<Application>(ContainerIoC.Application);

await app.init();
