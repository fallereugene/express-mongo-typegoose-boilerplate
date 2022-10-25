export class HttpError extends Error {
  public httpStatusCode: number;

  public details: string;

  constructor(httpStatusCode: number, message: string, details: string) {
    super(message);

    // HTTP-код сгенерированный исходным сервером для конкретно этого типа проблемы
    this.httpStatusCode = httpStatusCode;
    // Человекочитаемое объяснение, характерное для конкретно этого случая.
    this.message = message;
    // Короткое описание проблемы на английском языке для чтения инженерами
    this.details = details;
  }
}
