import * as t from '@babel/types';
import traverse from '@babel/traverse';
type ExportedMember = string;

const searchExportedMembersIds = (file: t.File, matchers = ['Controller', 'Service']) => {
  const result: ExportedMember[] = [];
  searchExportedMembers(file, matchers).forEach(member => {
    member.specifiers.forEach(s => {
      result.push((s as t.ExportSpecifier).local.name);
    })
  });
  return result;
};

const searchExportedMembers = (file: t.File, matchers = ['Controller', 'Service']) => {
  const results: t.ExportNamedDeclaration[] = [];
  traverse(file, {
    ExportNamedDeclaration: function(xPath) {
      const node = xPath.node;
      if(node.specifiers && [...node.specifiers].length > 0) {
        const specifiers: t.ExportSpecifier[] = [...node.specifiers].map(s => s as t.ExportSpecifier);

        const found = specifiers
          .filter(s => !!s.local)
          .map(s => (s.local.name as string))
          .filter(idName => !!matchers.find(m => idName.toLowerCase().includes(m.toLowerCase())));
          if (found.length > 0) {
            results.push(node);
          }
      }
    }
  });
  return results;
}

export { searchExportedMembersIds, searchExportedMembers };
