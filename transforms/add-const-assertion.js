const findStyledCalls = require('./utils/findStyledCalls');

/**
 * @type {import('jscodeshift').Transform}
 */
function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasChanged = false;

  // biome-ignore lint/complexity/noForEach: <explanation>
  findStyledCalls(j, root)
    .find(j.ArrowFunctionExpression)
    .filter((path) => path.node.params.length === 0)
    .find(j.ObjectExpression)
    .forEach((path) => {
      // If the object already has a type assertion do nothing.
      if (path.parent && j.TSAsExpression.check(path.parent.node)) return;

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
