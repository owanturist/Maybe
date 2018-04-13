import {
    Readonly,
    isArray
} from './Basics';
import {
    List
} from './List';
import {
    Either,
    Left,
    Right
} from './Either';

export type Pattern<T, R> = Readonly<{
    Nothing(): R;
    Just(value: T): R;
}>;

export abstract class Maybe<T> {
    public static fromNullable<T>(value: undefined | null): Maybe<T>;
    public static fromNullable<T>(value: T): Maybe<T>;
    public static fromNullable<T>(value: T | null | undefined): Maybe<T> {
        return value == null ? Nothing() : Just(value);
    }

    public static fromEither<E, T>(either: Either<E, T>): Maybe<T> {
        return either.fold(Nothing, Just) as Maybe<T>;
    }

    public static props<T>(config: {[ K in keyof T ]: Maybe<T[ K ]>}): Maybe<T> {
        let acc = Just({} as T);

        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                acc = acc.chain(
                    (obj: T): Maybe<T> => config[ key ].map(
                        (value: T[ keyof T ]): T => {
                            obj[ key ] = value;

                            return obj;
                        }
                    )
                );
            }
        }

        return acc;
    }

    public static all<T>(list: List<Maybe<T>> | Array<Maybe<T>>): Maybe<List<T>> {
        const list_: Array<Maybe<T>> = isArray(list) ? list : list.toArray();
        let acc = Just<Array<T>>([]);

        for (const item of list_) {
            acc = acc.chain(
                (arr: Array<T>): Maybe<Array<T>> => item.map(
                    (value: T): Array<T> => {
                        arr.push(value);

                        return arr;
                    }
                )
            );
        }

        return acc.map(List.fromArray);
    }

    public abstract isNothing(): boolean;
    public abstract isJust(): boolean;
    public abstract isEqual(another: Maybe<T>): boolean;

    public abstract getOrElse(defaults: T): T;

    public abstract ap<R>(maybeFn: Maybe<(value: T) => R>): Maybe<R>;
    public abstract map<R>(fn: (value: T) => R): Maybe<R>;
    public abstract chain<R>(fn: (value: T) => Maybe<R>): Maybe<R>;
    public abstract orElse(fn: () => Maybe<T>): Maybe<T>;

    public abstract fold<R>(nothingFn: () => R, justFn: (value: T) => R): R;
    public abstract cata<R>(pattern: Pattern<T, R>): R;

    public abstract toEither<E>(error: E): Either<E, T>;
}

namespace Variations {
    export class Nothing<T> extends Maybe<T> {
        public isNothing(): boolean {
            return true;
        }

        public isJust(): boolean {
            return false;
        }

        public isEqual(another: Maybe<T>): boolean {
            return another.isNothing();
        }

        public getOrElse(defaults: T): T {
            return defaults;
        }

        public ap<R>(): Maybe<R> {
            return this as any as Maybe<R>;
        }

        public map<R>(): Maybe<R> {
            return this as any as Maybe<R>;
        }

        public chain<R>(): Maybe<R> {
            return this as any as Maybe<R>;
        }

        public orElse(fn: () => Maybe<T>): Maybe<T> {
            return fn();
        }

        public fold<R>(nothingFn: () => R): R {
            return nothingFn();
        }

        public cata<R>(pattern: Pattern<T, R>): R {
            return pattern.Nothing();
        }

        public toEither<E>(error: E): Either<E, T> {
            return Left(error);
        }
    }

    export class Just<T> extends Maybe<T> {
        constructor(private readonly value: T) {
            super();
        }

        public isNothing(): boolean {
            return false;
        }

        public isJust(): boolean {
            return true;
        }

        public isEqual(another: Maybe<T>): boolean {
            return another.fold(
                (): boolean => false,
                (value: T): boolean => value === this.value
            );
        }

        public getOrElse(): T {
            return this.value;
        }

        public ap<R>(maybeFn: Maybe<(value: T) => R>): Maybe<R> {
            return maybeFn.map(
                (fn: (value: T) => R): R => fn(this.value)
            );
        }

        public map<R>(fn: (value: T) => R): Maybe<R> {
            return new Just(
                fn(this.value)
            );
        }

        public chain<R>(fn: (value: T) => Maybe<R>): Maybe<R> {
            return fn(this.value);
        }

        public orElse(): Maybe<T> {
            return this;
        }

        public fold<R>(_nothingFn: () => R, justFn: (value: T) => R): R {
            return justFn(this.value);
        }

        public cata<R>(pattern: Pattern<T, R>): R {
            return pattern.Just(this.value);
        }

        public toEither<E>(): Either<E, T> {
            return Right(this.value);
        }
    }
}

export const Nothing = <T>(): Maybe<T> => new Variations.Nothing();

export const Just = <T>(value: T): Maybe<T> => new Variations.Just(value);
