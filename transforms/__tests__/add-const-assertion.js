const { expect, describe, test } = require('@jest/globals');
const TestUtils = require('jscodeshift/dist/testUtils');
const transform = require('../add-const-assertion');
const dedent = require('dedent');

function applyTransform(source, options = {}) {
  return TestUtils.applyTransform(transform, options, {
    path: 'test.d.ts',
    source: dedent(source),
  });
}

describe('add-const-assertion', () => {
  test('arrow function without type assertion', () => {
    expect(
      applyTransform(`
import styled from '@emotion/styled';

const StyledComponent = styled.span(() => ({ textAlign: 'center' }));
const StyledWithBaseComponent = styled(BaseComponent)(() => ({ textAlign: 'center' }));
`),
    ).toMatchInlineSnapshot(`
"import styled from '@emotion/styled';

const StyledComponent = styled.span(() => ((({
  textAlign: 'center'
}) as const)));
const StyledWithBaseComponent = styled(BaseComponent)(() => ((({
  textAlign: 'center'
}) as const)));"
`);
  });

  test('arrow function with type assertion', () => {
    expect(
      applyTransform(`
import styled from '@emotion/styled';

const StyledComponent = styled.span(() => ({ textAlign: 'center' } as const));
const StyledWithBaseComponent = styled(BaseComponent)(() => ({ textAlign: 'center' } as const));
`),
    ).toMatchInlineSnapshot(`
"import styled from '@emotion/styled';

const StyledComponent = styled.span(() => ({ textAlign: 'center' } as const));
const StyledWithBaseComponent = styled(BaseComponent)(() => ({ textAlign: 'center' } as const));"
`);
  });
});
