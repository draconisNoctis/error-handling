const $Throws = Symbol("throws");
type Throws<T> = { [$Throws]?: T };
type ExceptionOf<F extends (...args: any) => any> = ReturnType<F> extends Throws<infer T> ? T : unknown;

export class MyError extends Error {}

export function mightThrow(): number & Throws<MyError> {
  if (Math.random() > 0.5) {
    throw new MyError();
  }

  return 42;
}

// Cannot change the interface of `Promise`
export async function mightThrowAsync(): Promise<number> {
  if (Math.random() > 0.5) {
    throw new MyError();
  }

  return 42;
}

export async function main() {
  try {
    console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${mightThrow() * 2}`);
  } catch (err: unknown) { // can only use `any` or `unknown` here
    const typedErr = err as ExceptionOf<typeof mightThrow>;
    console.log(typedErr.message);
  }

  try {
    console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${await mightThrowAsync() * 2}`);
  } catch (err: unknown) { // can only use `any` or `unknown` here
    console.log(err);
  }
}

/**
 * For a ready to use implementation, see (untested)
 * @see https://www.npmjs.com/package/ts-throwable
 */
