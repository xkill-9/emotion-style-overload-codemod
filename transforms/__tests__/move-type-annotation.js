const { expect, describe, test } = require('@jest/globals');
const TestUtils = require('jscodeshift/dist/testUtils');
const transform = require('../move-type-annotation');
const dedent = require('dedent');

function applyTransform(source, options = {}) {
  return TestUtils.applyTransform(transform, options, {
    path: 'test.d.ts',
    source: dedent(source),
  });
}

describe('move-type-annotation', () => {
  test('should move type annotation from parameters to call function', () => {
    expect(
      applyTransform(`
import styled from '@emotion/styled';

const SomeComponent = styled.div(({ display }: { display: string }) => ({ display }));
const WithBaseComponent = styled(BaseComponent)(({ display }: { display: string }) => ({ display }));
`),
    ).toMatchInlineSnapshot(`
"import styled from '@emotion/styled';

const SomeComponent = styled.div<{ display: string }>(({
  display
}) => ({ display }));
const WithBaseComponent = styled(BaseComponent)<{ display: string }>(({
  display
}) => ({ display }));"
`);
  });
});
