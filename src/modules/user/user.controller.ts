import { inject } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ContainerIoC } from '../../constants/index.js';
import { UserServiceInterface } from './contracts/index.js';
import { LoggerInterface } from '../../services/logger/contracts/index.js';
import { ControllerBase } from '../../services/controller/index.js';
import { ConfigInterface } from '../../services/config/contracts/index.js';
import { HttpMethod, JWT_ALGORITM } from '../../constants/index.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { processDto, createJWT } from '../../utils/index.js';
import { UserResponse, LoggedUserResponse } from './response/index.js';
import { HttpError, ValidationError } from '../../services/error/index.js';
import {
  ValidateObjectDtoMiddleware,
  EntityExistsMiddleware,
  UploadFileMiddleware,
  ValidateObjectIdMiddleware,
  PrivateRouteMiddleware,
} from '../../middlewares/index.js';

export class UserController extends ControllerBase {
  constructor(
    @inject(ContainerIoC.LoggerService) logger: LoggerInterface,
    @inject(ContainerIoC.ConfigService) configService: ConfigInterface,
    @inject(ContainerIoC.UserService) private userService: UserServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register route for UserController');

    this.registerRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectDtoMiddleware(CreateUserDto)],
    });

    this.registerRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthentication,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.registerRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateObjectDtoMiddleware(LoginUserDto)],
    });

    this.registerRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new EntityExistsMiddleware('userId', this.userService, 'User service'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_FILES_DIRECTORY'), 'avatar'),
      ],
    });
  }

  /**
   * Создание аватара пользователя
   * @param req Объект запроса
   * @param res Объект ответа
   */
  async uploadAvatar(req: Request, res: Response) {
    const { userId } = req.params;
    const payload = {
      avatar: req.file?.filename ?? '',
    };

    await this.userService.update(userId, payload);
    this.created(res, payload);
  }

  /**
   * Вход в закрытую часть приложения
   * @param req Объект запроса
   * @param res Объект ответа
   */
  async login(
    req: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const { body } = req;
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('SECRET_JWT'),
      this.configService.get('JWT_EXPIRATION_TIME'),
      { email: user.email, id: user.id },
    );

    this.send(res, StatusCodes.OK, processDto(LoggedUserResponse, { email: user.email, token }));
  }

  /**
   * Обработчик роута создания пользователя
   * @param req Объект запроса
   * @param res Объект ответа
   */
  async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const { body, user } = req;
    const { email } = body;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${email} has already exists.`, this.constructor.name);
    }

    if (user) {
      throw new ValidationError('User is logged in already.', []);
    }

    const salt = this.configService.get('SALT');
    const record = await this.userService.create(body, salt);

    this.send(res, StatusCodes.CREATED, processDto(UserResponse, record));
  }

  /**
   * Проверка состояния пользователя.
   * @param req Объект запроса.
   * @param res Объект ответа.
   */
  async checkAuthentication(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.user.email);

    this.send(res, StatusCodes.OK, processDto(UserResponse, user));
  }
}
