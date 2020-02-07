import * as acornLib from 'acorn';

const parse = (source: string) => acornLib.parse(source, { ecmaVersion: 6 });
export const astParser = { acorn: {lib: acornLib}, parse};
