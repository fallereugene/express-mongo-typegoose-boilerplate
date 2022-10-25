import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { LoggerInterface } from '../../services/logger/contracts/index.js';
import { UserServiceInterface } from './contracts/index.js';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto/index.js';
import { UserEntity } from './user.entity.js';
import { ContainerIoC } from '../../constants/index.js';
import { DEFAULT_AVATAR } from './constants/index.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(ContainerIoC.LoggerService) private logger: LoggerInterface,
    @inject(ContainerIoC.UserModel)
    private userModel: types.ModelType<UserEntity>,
  ) {}

  /**
   * Создание нового пользователя
   * @param dto Объект DTO
   * @param salt Соль
   */
  async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const { password } = dto;
    const user = new UserEntity({ ...dto, avatar: DEFAULT_AVATAR });
    user.setPassword(password, salt);

    const record = await this.userModel.create(user);

    this.logger.info(`New user created: ${record.email}`);

    return record;
  }

  /**
   * Обновление данных пользователя. Например, аватар и т.д.
   * @param userId Идентификатор пользователя
   * @param dto Объект DTO
   */
  async update(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(
      { _id: userId },
      {
        avatar: dto.avatar,
      },
      {
        new: true,
      },
    );
  }

  /**
   * Поиск пользователя по email
   * @param email Email пользователя
   */
  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  /**
   * Поиск пользователя.
   * В случае, если пользователь не найден, происходит процедура создания.
   * @param dto Объект DTO
   * @param salt Соль
   * @returns Найденный/новый пользователь.
   */
  async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const { email } = dto;
    const existingUser = await this.findByEmail(email);
    return existingUser ?? this.create(dto, salt);
  }

  /**
   * Проверка существования сущности в коллекции
   * @param documentId Идентификатор документа
   */
  async isExists(documentId: string): Promise<boolean> {
    return !!(await this.userModel.exists({ _id: documentId, deleted: false }));
  }

  /**
   * Проверка и идентификацию пользователя по переданной паре логина/пароля
   * @param dto Объект DTO
   * @param salt Соль
   */
  async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const { email, password } = dto;
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.verifyPassword(password, salt)) {
      return null;
    }

    return user;
  }
}
