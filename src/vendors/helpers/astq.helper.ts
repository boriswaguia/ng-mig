import { Node } from 'acorn';
const ASTQ = require('astq');

const query = (ast: Node, query: string) => {
  const astq = new ASTQ();
  astq.adapter("mozast");
  return astq.query(ast, query);
}

export const asqtHelper = {query}
