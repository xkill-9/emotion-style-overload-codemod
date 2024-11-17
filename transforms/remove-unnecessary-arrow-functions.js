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
    .forEach((path) => {
      hasChanged = true;
      // If the function immediately returns an object
      if (j.ObjectExpression.check(path.node.body)) {
        // Replace arrow function with the returned object
        path.replace(path.node.body);
      }
    });

  if (hasChanged) return root.toSource();

  return file.source;
}

module.exports = transform;
module.exports.parser = 'tsx';
