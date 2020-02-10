import * as fs from 'fs';


const getCurrentDir = () => './';

const dirExist = (dir: string) => fs.existsSync(dir);

export { getCurrentDir, dirExist };
