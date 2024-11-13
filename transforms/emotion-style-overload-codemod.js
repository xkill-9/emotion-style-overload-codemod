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
    .forEach((path) => {
      hasChanged = true;
      switch (path.node.body.type) {
        // If the function immediately returns an object
        case 'ObjectExpression':
          // Replace arrow function with the returned object
          path.replace(path.node.body);
          break;
        // If the function has a body
        case 'BlockStatement':
          // Add an underscore as an unused param to silence linters
          path.node.params.push(j.identifier('_'));
          break;
        default:
          break;
      }
    });

  if (hasChanged) return root.toSource();

  return file.source;
}

module.exports = transform;
module.exports.parser = 'tsx';
