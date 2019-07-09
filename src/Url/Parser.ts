import {
} from 'ts-toolbelt';
import {
    Maybe,
    Nothing,
    Just
} from '../Maybe';

interface Params {
    readonly [ key: string ]: Array<string>;
}

interface State<T> {
    readonly visited: Array<string>;
    readonly unvisited: Array<string>;
    readonly params: Params;
    readonly frag: Maybe<string>;
    readonly value: T;
}

const getFirstMatch = <T>(states: Array<State<T>>): Maybe<T> => {
    if (states.length === 0) {
        return Nothing;
    }

    const state = states[0];

    if (state.unvisited.length === 0) {
        return Just(state.value);
    }

    return getFirstMatch(states.slice(1));
};

export const processPath = (path: string): Array<string> => path.replace(/(^\/|\/$)/g, '').split('/');

export const processQuery = (query: string): Params => {
    const acc: { [key: string]: Array<string> } = {};

    for (const pair of query.split('&')) {
        const [ key, value ] = pair.split('=');

        if (key && value) {
            const values = acc[ key ];

            if (typeof values === 'undefined') {
                acc[ key ] = [ value ];
            } else {
                values.push(value);
            }
        }
    }

    return acc;
};

export class Parser<T> {
    public static get top(): Parser<unknown> {
        throw new Error();
    }

    public static get string(): Parser<(value: string) => unknown> {
        throw new Error();
    }

    public static get number(): Parser<(value: number) => unknown> {
        throw new Error();
    }

    public static custom<T>(_parser: (str: string) => Maybe<T>): Parser<(value: T) => unknown> {
        throw new Error();
    }

    public static s(_path: string): Parser<unknown> {
        throw new Error();
    }

    public static oneOf<T>(_parsers: Array<Parser<T>>): Parser<T> {
        throw new Error();
    }

    public static query(_name: string): SingleQuery<unknown> {
        throw new Error();
    }

    private constructor() {}

    public ap<R>(
        _tagger: FR<T, R>
    ): Parser<R> {
        throw new Error();
    }

    public get slash(): Path<T> {
        throw new Error();
    }

    public query(_name: string): SingleQuery<T> {
        throw new Error();
    }

    public fragment<R>(_handler: (fr: Maybe<string>) => R): Parser<
        T extends (arg: unknown) => unknown
            ? FF<T, R>
            : FF<(arg: T) => unknown, R>
    > {
        throw new Error();
    }

    public parse(): string {
        throw new Error();
    }
}

abstract class Path<T> {
    public get string(): Parser<FF<T, string>> {
        throw new Error();
    }

    public get number(): Parser<FF<T, number>> {
        throw new Error();
    }

    public custom<R>(_parser: (str: string) => Maybe<R>): Parser<FF<T, R>> {
        throw new Error();
    }

    public s(_path: string): Parser<T> {
        throw new Error();
    }

    public oneOf<R>(
        _parsers: Array<Parser<R>>
    ): Parser<FF<T, R>> {
        throw new Error();
    }
}

abstract class SingleQuery<T> {
    public get string(): Parser<FF<T, Maybe<string>>> {
        throw new Error();
    }

    public get number(): Parser<FF<T, Maybe<number>>> {
        throw new Error();
    }

    public get boolean(): Parser<FF<T, Maybe<boolean>>> {
        throw new Error();
    }

    public get list(): MultiQuery<T> {
        throw new Error();
    }

    public custom<R>(_parser: (str: Maybe<string>) => R): Parser<FF<T, R>> {
        throw new Error();
    }

    public enum<R>(_vairants: Array<[ string, R ]>): Parser<FF<T, Maybe<R>>> {
        throw new Error();
    }
}

abstract class MultiQuery<T> {
    public get string(): Parser<FF<T, Array<string>>> {
        throw new Error();
    }

    public get number(): Parser<FF<T, Array<number>>> {
        throw new Error();
    }

    public get boolean(): Parser<FF<T, Array<boolean>>> {
        throw new Error();
    }

    public custom<R>(_parser: (str: Array<string>) => R): Parser<FF<T, R>> {
        throw new Error();
    }

    public enum<R>(_vairants: Array<[ string, R ]>): Parser<FF<T, Array<R>>> {
        throw new Error();
    }
}

type FF<F, R> = F extends (arg: infer A) => infer N
    ? (arg: A) => FF<N, R>
    : (arg: R) => unknown;

type FR<F, R> = F extends (arg0: infer A0) => infer F1
    ? (arg0: A0) => F1 extends (arg1: infer A1) => infer F2
    ? (arg1: A1) => F2 extends (arg2: infer A2) => infer F3
    ? (arg2: A2) => F3 extends (arg3: infer A3) => infer F4
    ? (arg3: A3) => F4 extends (arg4: infer A4) => infer F5
    ? (arg4: A4) => F5 extends (arg5: infer A5) => infer F6
    ? (arg5: A5) => F6 extends (arg6: infer A6) => infer F7
    ? (arg6: A6) => F7 extends (arg7: infer A7) => infer F8
    ? (arg7: A7) => F8 extends (arg8: infer A8) => infer F9
    ? (arg8: A8) => F9 extends (arg9: infer A9) => infer F10
    ? (arg9: A9) => F10 extends (arg10: infer A10) => infer F11
    ? (arg10: A10) => F11 extends (arg11: infer A11) => infer F12
    ? (arg11: A11) => F12 extends (arg12: infer A12) => infer F13
    ? (arg12: A12) => F13 extends (arg13: infer A13) => infer F14
    ? (arg13: A13) => F14 extends (arg14: infer A14) => infer F15
    ? (arg14: A14) => F15 extends (arg15: infer A15) => infer F16
    ? (arg15: A15) => F16 extends (arg16: infer A16) => infer F17
    ? (arg16: A16) => F17 extends (arg17: infer A17) => infer F18
    ? (arg17: A17) => F18 extends (arg18: infer A18) => infer F19
    ? (arg18: A18) => F19 extends (arg19: infer A19) => infer F20
    ? (arg19: A19) => FR<F20, R>
    : R : R : R : R : R : R : R : R : R : R : R : R : R : R : R : R : R : R : R : R;

class Route {
    public foo() {
        throw new Error();
    }

    public bar() {
        throw new Error();
    }
}

const Home: Route = new Route();
const Profile: Route = new Route();
const Article = (_id: number): Route => new Route();
const Comment = (_id: number) => (_p: string): Route => new Route();
const Search = (_q: string) => (_p: number): Route => new Route();
const Post = (_q: string) => (_p: Date): Route => new Route();

export const test1 = Parser.top.ap(Home);
export const test2 = Parser.s('search').slash.number.slash.string.ap(Comment);
export const test3 = Parser.s('foo').slash.number.slash.s('bar').ap(Article);
export const test4 = Parser.s('foo').ap(Home);
export const test5 = Parser.s('foo')
    .slash.string
    .slash.s('asd')
    .slash.number
    .ap(Search);

export const test51 = Parser
    .s('base')
    .slash.number
    .query('q1').number
    .query('q2').boolean
    .query('q3').list.boolean
    .query('q4').custom(val => val)
    .query('q44').list.custom(val => val)
    .query('q4').enum([
        [ 'false', false ],
        [ 'true', true ]
    ])
    .query('q5').list.enum([
        [ 'false', false ],
        [ 'true', true ]
    ])
    .slash.number
    .slash.s('hi')
    .slash.string
    ;

export const test6 = Parser.s('foo');

export const test10 = Parser.oneOf([
    Parser.top.ap(Home),
    Parser.s('profile').ap(Profile),
    Parser.s('article').slash.number.ap(Article),
    Parser.s('article').slash.number.slash.s('comment').slash.string.ap(Comment),
    Parser.s('search').slash.string.slash.number.ap(Search),
    Parser.s('post').slash.string.slash.custom(str => str === '' ? Nothing : Just(new Date())).ap(Post),
    Parser.s('hi').slash.number.fragment(a => a.getOrElse('')).ap(Comment)
]).fragment(a => a.cata({
    Nothing: () => 1,
    Just: str => parseInt(str, 10)
}));

export const test11 = Parser.s('base').slash.number.slash.oneOf([
    Parser.oneOf([
        Parser.top.ap(Home)
    ]),
    Parser.top.ap(Profile)
]).ap(a => r => {
    return a > 2 ? r : Article(a);
});
