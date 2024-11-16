/**
 * @type {import('jscodeshift').Transform}
 */
function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasChanged = false;
  const emotionDefaultImport = root
    .find(j.ImportDeclaration, {
      source: { value: '@emotion/styled' },
    })
    .find(j.ImportDefaultSpecifier);

  const emotionImportedName = emotionDefaultImport.length
    ? emotionDefaultImport.get()?.node?.local?.name
    : undefined;

  if (!emotionImportedName) return file.source;

  // biome-ignore lint/complexity/noForEach: <explanation>
  root
    .find(j.Identifier, {
      name: emotionImportedName,
    })
    .closest(j.VariableDeclarator, {
      init: { type: 'CallExpression' },
    })
    .find(j.ArrowFunctionExpression)
    .filter((path) => path.node.params.length === 0)
    .find(j.ObjectExpression)
    .forEach((path) => {
      // If the object already has a type assertion do nothing.
      if (path.parent.node.type === 'TSAsExpression') return;

      // Otherwise add a const assertion
      hasChanged = true;
      path.replace(
        j.tsAsExpression(path.node, j.tsTypeReference(j.identifier('const'))),
      );
    });

  if (hasChanged) return root.toSource();

  return file.source;
}

module.exports = transform;
module.exports.parser = 'tsx';
