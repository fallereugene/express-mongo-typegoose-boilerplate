import 'reflect-metadata';
import mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { DatabaseInterface } from './contracts';
import { ContainerIoC } from '../../constants/index.js';
import { LoggerInterface } from '../logger/contracts/index.js';

@injectable()
export class DatabaseService implements DatabaseInterface {
  constructor(@inject(ContainerIoC.LoggerService) private logger: LoggerInterface) {}

  /**
   * Установкаа подключения к базе данных
   * @param url строка подключения
   */
  async connect(url: string): Promise<void> {
    this.logger.info('Connection to database...');
    await mongoose.connect(url);
    this.logger.info('Database connected');
  }

  /**
   * Разрыв подлючения к базе данных
   */
  async disconnect(): Promise<void> {
    return mongoose.disconnect();
  }
}
