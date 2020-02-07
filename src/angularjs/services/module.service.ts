import { Node } from 'acorn';
import { asqtHelper } from '../../vendors/helpers/astq.helper';

export const hasModule = (ast: Node, moduleName: string) => {
  const query = `
    //MemberExpression /Identifier [@name=='${moduleName}']
  `;
  return [...asqtHelper.query(ast, query)].length > 0;
}

export const hasAngularJsModule = (ast: Node) => hasModule(ast, 'angular');
