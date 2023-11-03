const inputBasic = `
---
import Foo from './Foo.astro'
import Bar from './Bar.astro'
import { foo } from './Baz'
import { bar, baz } from './Baz'
---


<Foo class="  sm:p-0   p-0 ">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const expectedBasic = `
---
import Bar from './Bar.astro'
import { bar,foo } from './Baz'
import Foo from './Foo.astro'
---


<Foo class="  sm:p-0   p-0 ">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const expectedSortAndCombine = `
---
import Bar from './Bar.astro'
import { bar,baz,foo } from './Baz'
import Foo from './Foo.astro'
---


<Foo class="  sm:p-0   p-0 ">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const expectedRemoveUnused = `
---
import Foo from './Foo.astro'
import Bar from './Bar.astro'
import { foo } from './Baz'
import { bar } from './Baz'
---


<Foo class="  sm:p-0   p-0 ">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const expectedWithAstroPlugin = `
---
import Bar from './Bar.astro'
import { bar, foo } from './Baz'
import Foo from './Foo.astro'
---

<Foo class="sm:p-0 p-0">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const expectedWithAstroAndTailwindCSSPlugins = `
---
import Bar from './Bar.astro'
import { bar, foo } from './Baz'
import Foo from './Foo.astro'
---

<Foo class="p-0 sm:p-0">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const functionInJsx = `
---
import { foo } from './Foo'
---

<Foo>
  <Bar>{foo(0)}</Bar>
</Foo>
`.trim()

const organizeImportsIgnore = `
---
// organize-imports-ignore
import Foo from './Foo.astro'
import Bar from './Bar.astro'
import { foo } from './Baz'
import { bar, baz } from './Baz'
---


<Foo class="  sm:p-0   p-0 ">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

const tslintDisableOrderedImports = `
---
// tslint:disable:ordered-imports
import Foo from './Foo.astro'
import Bar from './Bar.astro'
import { foo } from './Baz'
import { bar, baz } from './Baz'
---


<Foo class="  sm:p-0   p-0 ">
  <Bar>{foo} {bar}</Bar>
</Foo>
`.trim()

export const input = {
  basic: inputBasic,
  functionInJsx,
  organizeImportsIgnore,
  tslintDisableOrderedImports,
}

export const expected = {
  basic: expectedBasic,
  sortAndCombine: expectedSortAndCombine,
  removeUnused: expectedRemoveUnused,
  functionInJsx,
  organizeImportsIgnore,
  tslintDisableOrderedImports,
  withAstroPlugin: expectedWithAstroPlugin,
  withAstroAndTailwindCSSPlugins: expectedWithAstroAndTailwindCSSPlugins,
}
