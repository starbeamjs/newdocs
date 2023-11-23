# Reactive Builtins

Starbeam comes with reactive versions of many JavaScript builtin objects.

## object

[[code ./snippets/builtins/object.tsx]]

You create a reactive object using the `reactive.object` function, but once
you've done that, you read and write from it using standard JavaScript
APIs.

:::tip It's not just properties
In addition to property reads and writes, you can also interact with the object
using whatever JavaScript APIs you like.

For example, if you use `Object.keys` as part of a reactive render, it will
invalidate if you add or remove properties. It will not, however, invalidate if
you change the value of a property that already exists.

The same thing goes for the `in` operator `Object.values` and `Object.entries`,
and all of the other introspection APIs on `Object` and `Reflect`.

(The only exception to this is `Object.setPrototypeOf`, which is not currently
supported on reactive objects.)
:::

## array

[[code ./snippets/builtins/array.tsx]]

This example creates a reactive array using the `reactive.array` function, and
then interacts with it just like any other array.

In this example, adding an
additional person to the `people` array will invalidate the reactive render
because it changes `people.length` and affects `people.map()`.

:::tip The entire Array API
Just like with `object`, you can read and write to the array using whatever
JavaScript APIs you like.

For example, if you truncate an array using `.length = 0`, any previous indexed
access (e.g. `array[4]`) will be invalidated. Truncation will also invalidate
reactive renders of `[...spread]` and iteration methods like `.forEach()`,
`.map()`, `.flatMap()` and `filter()` . It also invalidates reactive renders of
methods like `.slice()`.

If a reactive render checks an array's length using `array.length`, it will not
invalidate if you simply replace an existing element with a new one.

Operations like `.push()`, `.pop()`, `.shift()` and `.unshift()` invalidate
reactive renders using `length` as well as any previous indexed access to the
affected array elements.

For example, if you have an array `[1, 2, 3]` and push `4` to the end, renders
that accessed `array[3]` will be invalidated, since it didn't exist before the
`push` but does now. On the other hand, `array[2]` will not be invalidated,
since it wasn't affected by the `push`.
:::

## Map

[[code ./snippets/builtins/map.tsx]]

This example behaves similarly to the [object](#object) example above, but we
use `Map` APIs instead of direct access to an object's properties.

:::tip The entire Map API
At an intuitive level, reactive renders that access a `Map` will invalidate when
a change to the `Map` affects the result.

**Some examples:**

Changes to the `Map` using `set()` will invalidate reactive renders that accessed
the key using `.get()`.

However, if a reactive render checked for the presence of a key using `.has()`,
it will not invalidate if the key was simply changed using `set()`.

Adding a key that didn't previously exist, however, will invalidate reactive
renders that previously checked for the presence of the key and got `false`.

Deleting a key that didn't previously exist invalidates nothing. Deleting a key
that previously existed will invalidate reactive renders that checked for the
presence of the key with `.has()` or accessed it using `.get()`.

Reactive renders that iterate the map using `for/of` or using `.entries()`
will invalidate whenever a key is added, deleted or changed.

On the other hand, reactive renders that iterate the map using `.keys()` won't
invalidate if an existing key is changed using `.set()`.
:::

## Set

[[code ./snippets/builtins/set.tsx]]

Similar to all of the other builtins, we use `reactive.Set` to create a `Set`,
and then use normal `Set` APIs to interact with it.

When you add an element to the `Set` that didn't already exist or remove an
element that **did** exist, it will invalidate the reactive render that accessed
the `Set`'s size or iterated it.

On the other hand, adding an element that did exist or removing an element that
didn't has no effect on the reactive render.

## WeakMap

## WeakSet
