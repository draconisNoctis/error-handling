
export class MyError extends Error {}

export function mightThrow(): number {
    if(Math.random() > 0.5) {
        throw new MyError();
    }

    return 21;
}

export async function mightThrowAsync(): Promise<number> {
    if(Math.random() > 0.5) {
        throw new MyError();
    }

    return 21;
}

export async function main() {
    try {
        console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${mightThrow() * 2}`);
    } catch(err: unknown) { // can only use `any` or `unknown` here
        console.log(err);
    }

    try {
        console.log(`The Answer to the Ultimate Question of Life, the Universe, and Everything is ${await mightThrowAsync() * 2}`);
    } catch(err: unknown) { // can only use `any` or `unknown` here
        console.log(err);
    }
}