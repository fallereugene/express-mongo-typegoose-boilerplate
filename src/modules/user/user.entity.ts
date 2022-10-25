import { UserInterface } from './contracts/index.js';
import { User } from '../../contracts/index.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/index.js';

const { prop, modelOptions } = typegoose;

// eslint-disable-next-line
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements UserInterface {
  /**
   * Имя пользователя
   */
  @prop({ required: true, default: '' })
  public name!: string;

  /**
   * Email пользователя
   */
  @prop({ unique: true, required: true })
  public email!: string;

  /**
   * Пароль
   */
  @prop({ required: true, default: '' })
  public password!: string;

  /**
   * Поле аватара пользователя
   */
  @prop()
  public avatar!: string;

  constructor(data: User) {
    super();

    const { name, email, avatar } = data;

    this.email = email;
    this.name = name;
    this.avatar = avatar;
  }

  /**
   * Установка пароля с соответствующим алгоритмом шифрования
   * @param password
   * @param salt
   */
  setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  /**
   * Получение пароля
   */
  getPassword() {
    return this.password;
  }

  /**
   * Верификация переданного пароля и пароля, хранящегося в БД
   * @param password Переданный пользователем пароль в открытом виде
   * @param salt Соль
   */
  verifyPassword(password: string, salt: string): boolean {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
