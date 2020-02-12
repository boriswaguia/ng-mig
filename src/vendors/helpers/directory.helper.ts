import { existsSync } from './file.helper';

const getCurrentDir = () => './';

const dirExist = (dir: string) => existsSync(dir);

const copyRecursive = (src: string, dest: string) => {}

export { getCurrentDir, dirExist, copyRecursive };
