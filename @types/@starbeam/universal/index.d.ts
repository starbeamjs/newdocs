export interface Cell<T> {}

export function Cell<T>(value: T): Cell<T>;

export function Sync<T>(create: (build: BuildSync) => T): Sync<T>;

interface BuildSync {
  readonly on: {
    sync: (synchronize: () => void | (() => void)) => void;
    dispose: (dispose: () => void) => void;
  };
}

export interface Sync<T> {
  readonly setup: () => SyncResult<T>;
}

export interface SyncResult<T> {
  readonly sync: () => void;
  readonly value: T;
}

export const on: {
  sync: (synchronize: () => void | (() => void)) => void;
};

export const sync: <T>(sync: Sync<T>) => T;

export function tracked<This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext,
): ClassAccessorDecoratorResult<This, Value>;
