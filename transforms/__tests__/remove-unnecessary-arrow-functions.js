const { expect, describe, test } = require('@jest/globals');
const TestUtils = require('jscodeshift/dist/testUtils');
const transform = require('../remove-unnecessary-arrow-functions');
const dedent = require('dedent');

function applyTransform(source, options = {}) {
  return TestUtils.applyTransform(transform, options, {
    path: 'test.d.ts',
    source: dedent(source),
  });
}

describe('remove-unnecessary-arrow-functions', () => {
  test('arrow function without body', () => {
    expect(
      applyTransform(`
  import styled from '@emotion/styled';

  const StyledComponent = styled.div(() => ({ display: 'none' }));
  const StyledWithBaseComponent = styled(StyledComponent)(() => ({ color: 'red' }));
`),
    ).toMatchInlineSnapshot(`
"import styled from '@emotion/styled';

const StyledComponent = styled.div(({
  display: 'none'
}));
const StyledWithBaseComponent = styled(StyledComponent)(({
  color: 'red'
}));"
`);
  });

  test('arrow function with body', () => {
    expect(
      applyTransform(`
import styled from '@emotion/styled';

const StyledComponent = styled.span(() => {
  const display = 'none';

  return ({
    display,
  });
})
`),
    ).toMatchInlineSnapshot(`
"import styled from '@emotion/styled';

const StyledComponent = styled.span(() => {
const display = 'none';

return ({
  display,
});
})"
`);
  });

  test('arrow function with params', () => {
    expect(
      applyTransform(`
import styled from '@emotion/styled';

const StyledComponent = styled.div(({theme}) => ({ color: theme.color }));
`),
    ).toMatchInlineSnapshot(`
"import styled from '@emotion/styled';

const StyledComponent = styled.div(({theme}) => ({ color: theme.color }));"
`);
  });
});
