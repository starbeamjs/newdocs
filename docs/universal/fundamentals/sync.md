# Reactive Synchronization

Reactive synchronization is the last piece of the reactive puzzle. `Sync`s allow
you to synchronize external state with Starbeam reactive state.

## `Sync`: Making External State Reactive

In practice, an API representing external state exposes an event-driven API:
changes to the state are communicated as events.

You can use `Sync` to synchronize that external state with the reactivity
system. This makes it possible to keep rendered outputs up to date with external
state, just as you would with reactive state.

To synchronize external state, a `Sync`:

1. **Sets up internal reactive state** to represent the state of the
   external resource.
2. **Sets up a listener** to state-change events.
3. When the external state changes, **updates the reactive state** to
   reflect the change.
4. **Exposes a public API** that allows consumers to access the current state.
5. When the resource is disposed, it **disconnects the listener**.

### Example: Synchronizing the Current Page `<title>`

In this example, we'll synchronize the current page title (the current value of
`<title>`) with the reactivity system.

[[code ./snippets/synchronization/simple.snippet.ts]]

If we render the synchronized title, it will update whenever the document's
title changes.

```tsx
const title = sync(Title);

render(() => {
  return <h1>{title}</h1>;
});
```

::::details Implementing `Title` as a Class

You can also implement `Title` as a class. This pattern makes the most sense if
you have multiple methods that interact with the internal reactive state, or if
you're working within a framework that prefers classes.

[[code ./snippets/synchronization/simple-class.snippet.ts]]

For this example, the difference is largely aesthetic. You can easily refactor
from one style to another based on your needs, without changing how consumers
interact with the `Sync`.

::::

### Refinement: Allowing Consumers to Change the Title

[[code ./snippets/synchronization/editable-title.snippet.ts]]

## Starbeam Resources Are JavaScript Resources
