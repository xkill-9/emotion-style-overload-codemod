/**
 * @param {import('jscodeshift').API['jscodeshift']} j
 * @param {import('jscodeshift').Collection} root
 */
function getEmotionIdentifierName(j, root) {
  const defaultSpecifiers = root
    .find(j.ImportDeclaration, { source: { value: '@emotion/styled' } })
    .find(j.ImportDefaultSpecifier);

  return defaultSpecifiers.length
    ? defaultSpecifiers.get('local', 'name').value
    : 'styled';
}

/**
 * Finds styled.x calls
 *
 * @param {import('jscodeshift').API['jscodeshift']} j
 * @param {import('jscodeshift').Collection} root
 */
function findStyledCalls(j, root) {
  const emotionIdentifierName = getEmotionIdentifierName(j, root);

  return root.find(j.CallExpression).filter(
    (path) =>
      // styled.div(...)
      (j.MemberExpression.check(path.node.callee) &&
        j.Identifier.check(path.node.callee.object) &&
        path.node.callee.object.name === emotionIdentifierName) ||
      // styled(BaseComponent)(...)
      (j.CallExpression.check(path.node.callee) &&
        j.Identifier.check(path.node.callee.callee) &&
        path.node.callee.callee.name === emotionIdentifierName),
  );
}

module.exports = findStyledCalls;
