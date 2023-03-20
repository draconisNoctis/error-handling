
type Ok <T> = [T, null];
type Err<E> = [null, E];
type Result<T, E> = Ok<T> | Err<E>;

export class MyError extends Error {}

export function mightThrow(): Result<number, MyError> {
    if(Math.random() > 0.5) {
        return [ null, new MyError() ];
    }

    return [ 42, null ];
}

export async function mightThrowAsync(): Promise<Result<number, MyError>> {
    if(Math.random() > 0.5) {
        return [ null, new MyError() ];
    }

    return [ 42, null ];
}

export async function main() {
    {
        const [n, err] = mightThrow();

        // You need to check for error, otherwise `n` would be typed `number | null`
        // console.log(n.toFixed(2));

        if(err) {
            console.log(err.message);
        } else {
            console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${n * 2}`);
        }
    }

    // Async works the same
    {
        const [n, err] = await mightThrowAsync();

        if(err) {
            console.log(err.message);
        } else {
            console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${n * 2}`);
        }
    }
}