const findStyledCalls = require('./utils/findStyledCalls');

/**
 * @type {import('jscodeshift').Transform}
 */
function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasChanges = false;

  // biome-ignore lint/complexity/noForEach: <explanation>
  findStyledCalls(j, root).forEach((path) => {
    const arrowFunction = path.node.arguments[0];

    if (
      j.ArrowFunctionExpression.check(arrowFunction) &&
      arrowFunction.params[0]?.typeAnnotation
    ) {
      hasChanges = true;
      // Grab the parameter's type annotation
      const typeAnnotation = arrowFunction.params[0].typeAnnotation;
      // Remove it
      arrowFunction.params[0].typeAnnotation = null;
      // And add it back as the call's type annotation
      path.node.typeParameters = j.tsTypeParameterInstantiation([
        typeAnnotation.typeAnnotation,
      ]);
    }
  });

  if (hasChanges) return root.toSource();

  return file.source;
}

module.exports = transform;
module.exports.parser = 'tsx';
