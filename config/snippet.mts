/* eslint-disable @typescript-eslint/no-magic-numbers */
import { readFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

import { createConfigItem, transform } from "@babel/core";
/* @ts-expect-error We're only importing so we can create a config item, so we don't care about types */
import decorators from "@babel/plugin-syntax-decorators";
/* @ts-expect-error We're only importing so we can create a config item, so we don't care about types */
import jsx from "@babel/plugin-syntax-jsx";
/* @ts-expect-error We're only importing so we can create a config item, so we don't care about types */
import bts from "@babel/plugin-transform-typescript";
import type { PluginContext } from "rollup";

/**
 * Convert a code snippet (`[[code ./path.snippet.ts]]`) to a string.
 *
 * ## Variations
 *
 * ### Simple usage
 *
 * ```md
 * [[code ./path.snippet.ts]]
 * ```
 *
 * This will create a tabbed view of the code snippet:
 *
 * 1. A TS tab with the title "path.ts"
 * 2. A JS tab with the title "path.js"
 *
 * > The suffix `.snippet.ts` is replaced with `.ts` in the TypeScript title and
 * > `.js` in the JavaScript title.
 *
 * ### With Renaming
 *
 * ```md
 * [[code ./path.snippet.ts as path]]
 * ```
 *
 * This will create a tabbed view of the code snippet:
 *
 * 1. A TS tab with the title "path.ts"
 * 2. A JS tab with the title "path.js"
 *
 * ## Highlights
 *
 * You can highlight specific lines in the source code of the snippet file using
 * one of several syntaxes.
 *
 * The highlight directives are automatically removed from the output.
 *
 * ### Next Line Highlight
 *
 * ```ts
 * // #highlight next
 * ```
 *
 * ### Range Highlight
 *
 * ```ts
 * // #highlight start
 * // ...
 * // #highlight end
 * ```
 *
 * ### Named Highlight Groups
 *
 * Both next line and range highlights can be named:
 *
 * ```ts
 * // #highlight:name next
 * // ...
 * // #highlight:name start
 * // ...
 * // #highlight:name end
 * ```
 *
 * You can specify a named highlight group to use in the snippet call.
 *
 * ```md
 * [[code ./path.snippet.ts as path #highlight:name]]
 * ```
 */
export function codeSnippet(
  from: string,
  code: string,
  context: PluginContext,
): string {
  const REGEX =
    /\[\[code (.*?)(?:\s+as ([^\s]*))?(?:\s+#highlight:(.*))?\]\]/gu;

  return code.replaceAll(
    REGEX,
    (_, id: string, as: string | undefined, highlight: string = "default") => {
      const target = resolve(dirname(from), id);

      context.addWatchFile(target);

      const file = readFileSync(target, { encoding: "utf-8" }).trim();
      const asTS = filename(as ?? target, "ts");
      const ext = extname(target).slice(1);

      const ts = parseHighlights(file);
      const js = parseHighlights(tsc(cut(file)));

      const result = [
        "",
        ":::tabs key:tsjs",
        "",
        `== ts`,
        "",
        `\`\`\`${ext} twoslash ${ts.toTsCurly(highlight)} [${asTS}]`,
        "// @jsx preserve",
        "// ---cut---",
        ts.output,

        "```",
        "",
        `== js`,
        "",
        "```js " + js.toJsCurly(highlight),
        js.output,
        "```",
        ":::",
      ].join("\n");

      return result;
    },
  );
}

function filename(filename: string, extension: string) {
  return basename(basename(filename, ".ts"), ".snippet") + `.${extension}`;
}

const babelTsTransform = createConfigItem([
  bts,
  { isTSX: true, onlyRemoveTypeImports: true },
]);
const babelDecorators = createConfigItem([decorators, { version: "2022-03" }]);
const babelJsx = createConfigItem([jsx]);

const MISSING_INDEX = -1;
const START = 0;
const SKIP_LINE = 1;

function cut(source: string) {
  const lines = source.split("\n");

  const fromIndex = lines.findIndex((line) => line.includes("---cut---"));
  const toIndex = lines.findIndex((line) => line.includes("---cut-after---"));

  const from = fromIndex === MISSING_INDEX ? START : fromIndex + SKIP_LINE;
  const to = toIndex === MISSING_INDEX ? lines.length : toIndex;

  return lines.slice(from, to).join("\n");
}

function tsc(source: string): string {
  const result = transform(source, {
    plugins: [babelTsTransform, babelDecorators, babelJsx],
    generatorOpts: {
      retainLines: true,
      retainFunctionParens: false,
      concise: false,
      compact: false,
      minified: false,
      shouldPrintComment: (comment) => !/^\s*\/\/\s+[#@]/u.exec(comment),
    },
  });

  if (result === null || result === undefined) {
    throw Error(`Could not parse source: ${source}`);
  }

  return result.code ?? "";
}

const NEXT_HIGHLIGHT = /^\s*\/\/\s+#highlight(?::(?<name>[^\s]+))? next/gu;
const RANGE_START_HIGHLIGHT =
  /^\s*\/\/\s+#highlight(?::(?<name>[^\s]+))? start/gu;
const RANGE_END_HIGHLIGHT = /^\s*\/\/\s+#highlight(?::(?<name>[^\s]+))? end/gu;
const DIRECTIVE_LINE = /^\s*\/\/\s*(?<directive>.*)$/gu;

/**
 * A line highlight is a range of lines that should be highlighted with an
 * optional name.
 *
 * ## Variations
 *
 * Highlight the next line.
 *
 * ```ts
 * // #highlight next
 * ```
 *
 * Highlight a group of lines.
 *
 * ```ts
 * // #highlight start
 * // ...
 * // #highlight end
 * ```
 *
 * Named highlights:
 *
 * ```ts
 * // #highlight:name next
 * // ...
 * // #highlight:name start
 * // ...
 * // #highlight:name end
 * ```
 */
function parseHighlights(source: string): Highlights {
  const highlights = Highlights.process(source);

  return highlights;
}

class Highlights {
  static process(source: string) {
    const highlights = new Highlights();

    for (const line of source.split("\n")) {
      switch (highlights.#process(line)) {
        case "skip":
          highlights.#skipped += 1;
          break;
        case "include":
          highlights.#lineno += 1;
          break;
      }
    }

    return highlights;
  }

  readonly #highlights = new Map<string, LineRange[]>();
  readonly #output: string[] = [];
  #lineno = 1;
  #skipped = 0;
  #prev: { name: string; lineno: number } | null = null;
  readonly #currentRangeStack: { name: string; start: number }[] = [];

  toTsCurly(name: string = "default") {
    if (this.#ranges(name).length === 0) return "";
    return `{ ${this.#ranges(name).join(",")} }`;
  }

  toJsCurly(name: string = "default") {
    if (this.#ranges(name).length === 0) return "";

    return `{ ${this.#ranges(name).join(",")} }`;
  }

  #ranges(name: string) {
    const highlights = this.#highlights.get(name);
    if (!highlights) return [];

    return highlights.map((range) =>
      Array.isArray(range) ? `${range[0]}-${range[1]}` : String(range),
    );
  }

  get output() {
    return this.#output.join("\n");
  }

  #process(line: string): "skip" | "include" {
    if (this.#next(line)) return "skip";
    if (this.#start(line)) return "skip";
    if (this.#end(line)) return "skip";
    if (this.#directive(line)) return "skip";

    this.#includeLine(line);
    return "include";
  }

  #includeLine(line: string): void {
    if (line.trim() !== "") {
      if (this.#prev) {
        this.#initialized(this.#prev.name).push(this.#prev.lineno);
      }
    }

    this.#prev = null;
    this.#output.push(line);
  }

  #directive(line: string) {
    const result = DIRECTIVE_LINE.exec(line);

    const { directive } = result?.groups ?? {};

    switch (directive?.trim()) {
      case "prettier-ignore":
      case "^?":
        return true;
      default:
        return false;
    }
  }

  #start(line: string) {
    const start = RANGE_START_HIGHLIGHT.exec(line);

    if (start) {
      const { name = "default" } = start.groups ?? {};

      this.#currentRangeStack.push({
        name,
        start: this.#lineno,
      });

      return true;
    }
  }

  #end(line: string) {
    const end = RANGE_END_HIGHLIGHT.exec(line);

    if (end) {
      const { name: endName } = end.groups ?? {};

      const currentRangeStart = this.#currentRangeStack.pop();

      if (currentRangeStart === undefined) {
        throw new Error(
          `Found #highlight:end without #highlight:start in line ${this.errorLineno}`,
        );
      }

      const { name, start } = currentRangeStart;

      if (endName !== undefined && name !== endName) {
        throw new Error(
          `Found #highlight:end with name ${endName} in line ${this.errorLineno}, but the most recent #highlight:start had name ${name}`,
        );
      }

      this.#initialized(name).push([start, this.#lineno - 1]);
      return true;
    }
  }

  #next(line: string) {
    const next = NEXT_HIGHLIGHT.exec(line);

    if (next) {
      const { name = "default" } = next.groups ?? {};

      this.#prev = { name, lineno: this.#lineno };
      return true;
    }
  }

  #initialized(name: string) {
    let highlights = this.#highlights.get(name);

    if (!highlights) {
      highlights = [];
      this.#highlights.set(name, highlights);
    }

    return highlights;
  }

  get errorLineno() {
    return this.#lineno + this.#skipped;
  }
}

type LineRange = number | [start: number, end: number];
