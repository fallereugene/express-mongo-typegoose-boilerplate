import { CliCommandInterface } from './contracts/index.js';

type ParsedCommand = {
  [key: string]: string[];
};

export class CLI {
  private commands: { [propertyName: string]: CliCommandInterface } = {};

  private defaultCommand = '--help';

  /**
   * Регистрация CLI_команды
   * @param commandList Список регистрируемых команд
   */
  registerCommands(commandList: CliCommandInterface[]) {
    this.commands = commandList.reduce((acc, command) => {
      acc[command.name] = command;
      return acc;
    }, this.commands);
  }

  /**
   * Получение команды из коллекции
   * @param command Имя требуемой команды
   */
  getCommand(command: string) {
    return this.commands[command] ?? this.commands[this.defaultCommand];
  }

  /**
   * Обработка команды с соответствующими аргументами
   * @param argv Передаваемые аргументы
   */
  processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArgs = parsedCommand[commandName] ?? [];
    command.execute(...commandArgs);
  }

  /**
   * Парсинг команды
   * @param cliArguments Переданные пользователем аргументы
   */
  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArguments.reduce((acc, argument) => {
      if (argument.startsWith('--')) {
        acc[argument] = [];
        command = argument;
      } else if (command && argument) {
        acc[command].push(argument);
      }
      return acc;
    }, parsedCommand);
  }
}
