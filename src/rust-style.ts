interface ResultMethods<T, E> {
    isOk(): this is OkResult<T>;
    isErr(): this is ErrResult<E>;
    map<U>(fn: (val: T) => U): Result<U, E>;
    andThen<U, UE>(fn: (val: T) => Result<U, UE>): Result<U, E | UE>;
    orElse<U, UE>(fn: (val: E) => Result<U, UE>): Result<T | U, UE>;
    unwrap(): T;
}
interface OkResult<T> extends ResultMethods<T, never> { kind: 'ok'; value: T };
interface ErrResult<E> extends ResultMethods<never, E> { kind: 'err'; value: E };
type Result<T, E> = OkResult<T> | ErrResult<E>;

class ResultImpl<T, E> implements ResultMethods<T, E> {
    readonly kind: 'ok' | 'err';
    readonly value: T | E;

    static Ok<T>(value: T): Result<T, never> {
        return new ResultImpl<T, never>('ok', value) as OkResult<T>;
    }

    static Err<E>(error: E): Result<never, E> {
        return new ResultImpl<never, E>('err',  error) as ErrResult<E>;
    }

    protected constructor(kind: 'ok' | 'err', value: T | E) {
        this.kind = kind;
        this.value = value;
    }

    isOk(): this is OkResult<T> {
        return this.kind === 'ok';
    }

    isErr(): this is ErrResult<E> {
        return this.kind === 'err';
    }

    map<U>(fn: (val: T) => U): Result<U, E> {
        if(this.isErr()) return this;

        return ResultImpl.Ok(fn(this.value as T));
    }

    andThen<U, UE>(fn: (val: T) => Result<U, UE>): Result<U, E | UE> {
        if(this.isErr()) return this;

        return fn(this.value as T);
    }

    orElse<U, UE>(fn: (val: E) => Result<U, UE>): Result<T | U, UE> {
        if(this.isOk()) return this;

        return fn(this.value as E);
    }

    unwrap(): T {
        if(this.isErr()) {
            throw this.value;
        }

        return this.value as T;
    }
}

const { Ok, Err } = ResultImpl;


export class MyError extends Error {}

export function mightThrow(): Result<number, MyError> {
    if(Math.random() > 0.5) {
        return Err(new MyError());
    }

    return Ok(21);
}

export async function mightThrowAsync(): Promise<Result<number, MyError>> {
    if(Math.random() > 0.5) {
        return Err(new MyError());
    }

    return Ok(21);
}

export async function main() {
    {
        const res = mightThrow();

        if(res.isOk()) {
            console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${res.value * 2}`);
        } else {
            console.log(res.value)
        }
    }
    
    {
        const res = await mightThrowAsync();

        if(res.isOk()) {
            console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${res.value * 2}`);
        } else {
            console.log(res.value)
        }
    }

    // Fully rust style
    console.log(mightThrow()
        .map(n => `The Answer to the Ultimate Question of Life, the Universe, and Everything is ${n * 2}`)
        .orElse(err => Ok(err.message))
        .unwrap()
    )
}