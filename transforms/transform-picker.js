const removeUnnecessaryArrowFunctionsTransform = require('./remove-unnecessary-arrow-functions');
const addConstAssertionTransform = require('./add-const-assertion');

/**
 * @type {import('jscodeshift').Transform}
 */
function transform(file, api, options) {
  const { selectedTransforms } = options;

  const transformNames = new Set(selectedTransforms.split(','));

  /**
   * @type {import('jscodeshift').Transform[]}
   */
  const transforms = [];

  if (transformNames.has('remove-unnecessary-arrow-functions')) {
    transforms.push(removeUnnecessaryArrowFunctionsTransform);
  }

  if (transformNames.has('add-const-assertion')) {
    transforms.push(addConstAssertionTransform);
  }

  let skippedAllOptions = true;
  const newSource = transforms.reduce((currentFileSource, transform) => {
    const result = transform(
      { path: file.path, source: currentFileSource },
      api,
      options,
    );

    if (result == null) return currentFileSource;

    skippedAllOptions = false;
    return result;
  }, file.source);

  if (!skippedAllOptions) return newSource;
}

module.exports = transform;
module.exports.parser = 'tsx';
