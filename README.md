# emotion-style-overload-codemod

This codemod works around a very [specific bug](https://github.com/emotion-js/emotion/issues/3174) with TypeScript type overloads in its latest version (v5.6.3 at the time of writing) and @emotion/styled starting from version 11.11.5.

## Usage

```bash
$ npx emotion-style-overload-codemod <paths...>

Positionals:
  paths                                                      [string] [required]

Options:
  --version         Show version number                                [boolean]
  --help            Show help                                          [boolean]
  --dry                                               [boolean] [default: false]
  --ignore-pattern                      [string] [default: "**/node_modules/**"]
```

## Transform 

The codemod looks for emotion styled component declarations and replaces function calls with no params with their returned object if possible, otherwise, it adds an underscore as an unused param:

```diff
import styled from '@emotion/styled';

-const StyledComponent = styled.div(() => ({ display: 'flex' })); 
+const StyledComponent = styled.div(({ display: 'flex' })); 

-const StyledComponentWithBody = styled.div(() => {
    const color = 'red';

    return ({ color });
});
+const StyledComponentWithBody = styled.div(_ => {
    const color = 'red';

    return ({ color });
});
```
