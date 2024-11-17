# emotion-styled-codemod
Collection of transforms for [jscodeshift](https://github.com/facebook/jscodeshift) related to @emotion/styled

## Usage

```bash
$ npx emotion-styled-codemod <paths...>

Positionals:
  paths                                                      [string] [required]

Options:
  --version         Show version number                                [boolean]
  --help            Show help                                          [boolean]
  --dry                                               [boolean] [default: false]
  --ignore-pattern                      [string] [default: "**/node_modules/**"]
```

## Transforms

### `remove-unnecessary-arrow-functions`

Replaces styled component functions with no parameters with their returned object if possible, if the function has an actual body then no transformation is applied.

```diff
import styled from '@emotion/styled';

-const StyledComponent = styled.div(() => ({ display: 'flex' })); 
+const StyledComponent = styled.div(({ display: 'flex' })); 

-const StyledWithBaseComponent = styled(SomeBaseComponent)(() => ({ display: 'flex' })); 
+const StyledWithBaseComponent = styled(SomeBaseComponent)(({ display: 'flex' })); 

```

### `add-const-assertion`

Adds `as const` to the returned object of styled calls if the function has no parameters, if the object already has a type assertion then no transformation is applied. This is a workaround for a very [specific bug](https://github.com/emotion-js/emotion/issues/3174) with TypeScript type overloads in its latest version (v5.6.3 at the time of writing) and @emotion/styled starting from version 11.11.5.

```diff
import styled from '@emotion/styled';

-const StyledComponent = styled.div(() => ({ display: 'flex' })); 
+const StyledComponent = styled.div(() => ((({ display: 'flex' }) as const))); 

-const StyledWithBaseComponent = styled(SomeBaseComponent)(() => ({ display: 'flex' })); 
+const StyledWithBaseComponent = styled(SomeBaseComponent)(() => ((({ display: 'flex' }) as const))); 
```

NOTE: The extra parenthesis around the returned object is an artifact of jscodeshift' object expression builder and should be removed if you use a code formatter like Prettier.

### `move-type-annotation`

Moves the function parameter's type annotation to the styled call.

```diff
import styled from '@emotion/styled';

-const StyledComponent = styled.div(({ display }: { display: string }) => ({ display })); 
+const StyledComponent = styled.div<{ display: string }>(({ display }) => ({ display })); 

-const StyledWithBaseComponent = styled(SomeBaseComponent)(({ display }: { display: string }) => ({ display })); 
+const StyledWithBaseComponent = styled(SomeBaseComponent)<{ display: string }>(({ display }) => ({ display })); 
```


## Acknowledgements 

This project is based on [types-react-codemod](https://github.com/eps1lon/types-react-codemod)

