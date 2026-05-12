import 'reflect-metadata';
import { initConfig } from '../../src/common/config';

beforeAll(async () => {
  await initConfig(true);
});
