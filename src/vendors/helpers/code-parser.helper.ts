import * as parser from "@babel/parser";
import { ParserOptions } from '@babel/parser';
import { FilePath } from '../../services/split/module.type';
import { openFile } from './file.helper';

const parse = (input: string, options?: ParserOptions) => parser.parse(input, options)

const parseSourceTypeModule = (input: string) => parse (input,{sourceType: 'module'});

const parseFileSourceTypeModule = (filePath: FilePath) => parse(openFile(filePath),{sourceType: 'module'});

export { parse, parseSourceTypeModule, parseFileSourceTypeModule };
