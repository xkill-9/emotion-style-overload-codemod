const { expect, describe, test, beforeEach } = require('@jest/globals');
const dedent = require('dedent');
const TestUtils = require('jscodeshift/dist/testUtils');

describe('transform-picker', () => {
  let transformPicker;
  let removeUnnecessaryArrowFunctionsTransform;
  let addConstAssertionTransform;
  let moveTypeAnnotationTransform;

  function applyTransform(source, options = {}) {
    return TestUtils.applyTransform(transformPicker, options, {
      path: 'test.d.ts',
      source: dedent(source),
    });
  }

  beforeEach(() => {
    jest.resetModules();

    function mockTransform(moduleName) {
      const transform = jest.fn();

      jest.doMock(moduleName, () => transform);

      return transform;
    }

    removeUnnecessaryArrowFunctionsTransform = mockTransform(
      '../remove-unnecessary-arrow-functions',
    );
    addConstAssertionTransform = mockTransform('../add-const-assertion');
    moveTypeAnnotationTransform = mockTransform('../move-type-annotation.js');

    transformPicker = require('../transform-picker');
  });

  test('applies subset', () => {
    applyTransform('', {
      selectedTransforms: 'remove-unnecessary-arrow-functions',
    });

    expect(removeUnnecessaryArrowFunctionsTransform).toHaveBeenCalled();
    expect(addConstAssertionTransform).not.toHaveBeenCalled();
    expect(moveTypeAnnotationTransform).not.toHaveBeenCalled();
  });

  test('applies all', () => {
    applyTransform('', {
      selectedTransforms: [
        'remove-unnecessary-arrow-functions',
        'add-const-assertion',
        'move-type-annotation',
      ].join(','),
    });

    expect(removeUnnecessaryArrowFunctionsTransform).toHaveBeenCalled();
    expect(addConstAssertionTransform).toHaveBeenCalled();
    expect(moveTypeAnnotationTransform).toHaveBeenCalled();
  });
});
