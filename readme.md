# DX Engineer Technical Test

> This test is intended for the *Developer Experience Engineer* position found on [our website](https://chess.com/jobs).

## Introduction

Our engineering team and code base is rather large, so often times we must implement custom in-house solutions. These solutions must be efficient as possible in order to increase the DX of our developers.

This technical test will challenge you to find a proper solution for a real issue our tooling faced. This problem is focused on building our front-end code base with `webpack`.

This test will be done in your own time and will later be reviewed during a technical interview with one of our developers.

## The Problem

With a large code base, helping form hundreds of pages on our website, our front-end build times began to painfully grow to durations of over 30 minutes. This is not good for several reasons, and definitely degrades overall DX. Aside from regular maintenance of keeping our build dependencies up-to-date, we needed to make a major change.

After some research and development, we found that using [`esbuild`](https://esbuild.github.io/) over `babel-loader` + `ts-loader` was going to more than half our build times. With the complexity of some parts of our site, we realized we couldn't make a full switch and abandon `webpack`. This was okay, as `esbuild`'s ecosystem hasn't yet matured.

So with this knowledge, we began to experiment with [`esbuild-loader`](https://github.com/privatenumber/esbuild-loader) which allowed us to bundle a majority of our JavaScript/TypeScript, while still allowing `webpack` to handle other exceptions. Everything was working great until we found a major blocker.

### Code Splitting

At the time of writing this, `esbuild` does not have mature support for code splitting via `import()` expressions. And for the base support it does have, it is not accessible with our use of `esbuild`'s Transform API. Using `esbuild-loader` meant we'd have to lose the ability to lazy load parts of our site.

> Without code splitting enabled, an `import()` expression becomes `Promise.resolve().then(() => require())` instead. This still preserves the asynchronous semantics of the expression but it means the imported code is included in the same bundle instead of being split off into a separate file.

**This is a major deal breaker, but we must reduce our build times.**

## The Challenge

Now that the problem has been described, this technical test challenges you to find a solution for us to use `esbuild-loader` while preserving our code splitting capabilities.

![Greet-o-matic](./greet-o-matic.png) 

In this test you'll be working on the Greet-o-matic app. ~~I really should have found a more terrible name.~~ After entering the name you want to greet and clicking on <kbd>Greet</kbd>, the application will then fetch `lazy-chunk.ts` which contains the greeting logic. This module also contains some CSS that reveals the text at the bottom. As the message states, the text should not be visible until _after_ the button is clicked.

**This is the Code Splitting issue you need to solve. You will make whatever changes to the build tooling you deem necessary (`webpack`, `typescript`, `babel`, etc.).**

### Things to Know

* We can't replace `webpack`. The complexity of our application doesn't work with other bundlers, such as `rollup` or `vite`.
* Some of those complexities require us to still make use of `babel-loader` / `ts-loader`, so those dependencies are still available.
* `esbuild-loader`'s default `target` configuration doesn't actually have a problem with code splitting via `import()` expressions. The problem arises when targeting older browsers that don't natively support ESM, which is a non-negotiable part of our user base. `safari11` has been added to the list of `target`s to demonstrate the code splitting problem. This setting cannot be changed.

### Setup

```bash
git clone <your-fork> 

npm install
```

### `package.json` scripts

```bash
# Start development server (http://localhost:8080)
npm run serve

# Build application
npm run build

# Serve built application
npx serve dist

# See original build
npm run original
```

If you need to see what a working result should look like, then use `npm run original`. Note that this command does not run a _real_ solution, as it only uses a `webpack` configuration prior to integrating `esbuild-loader` where Code Splitting was already supported.

## Some last words

This test has a simple problem, but requires a complex solution. The DX Engineer position will come across several problems like this. It's okay if this seems a bit challenging, it's meant to be that way. 

Also, it's okay if you can't find a proper solution. The developer who worked on this didn't have our final solution immediately. This test is meant to help us understand how _you_ would approach this problem.
