import { MockData, GeneratorInterface } from './contracts/index.js';

export class MockGenerator implements GeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  /**
   * Подготовка данных для записи в файл в
   * формате tsv
   */
  generate(index: number): string {
    return [this.mockData.users[index], this.mockData.emails[index]].join('\t');
  }
}
