import test from 'ava';

import {
    Maybe,
    Nothing,
    Just
} from '../src/Maybe';

test('Maybe.map', t => {
    t.deepEqual(
        Maybe.map((a: number) => a * 2, Nothing),
        Nothing
    );

    t.deepEqual(
        Maybe.map(a => a * 2, Just(3)),
        Just(6)
    );
});

test('Maybe.map2', t => {
    t.deepEqual(
        Maybe.map2(
            (a: number, b: number) => a * 2 + b,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map2(
            (a: number, b) => a * 2 + b,
            Just(1),
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map2(
            (a, b) => a * 2 + b,
            Just(1),
            Just(2)
        ),
        Just(4)
    );
});

test('Maybe.map3', t => {
    t.deepEqual(
        Maybe.map3(
            (a: number, b: number, c: number) => a * 2 + b - c,
            Nothing,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map3(
            (a, b: number, c: number) => a * 2 + b - c,
            Just(1),
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map3(
            (a, b, c: number) => a * 2 + b - c,
            Just(1),
            Just(2),
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map3(
            (a, b, c) => a * 2 + b - c,
            Just(1),
            Just(2),
            Just(3)
        ),
        Just(1)
    );
});

test('Maybe.map4', t => {
    t.deepEqual(
        Maybe.map4(
            (a: number, b: number, c: number, d: number) => a * 2 + b - c * d,
            Nothing,
            Nothing,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map4(
            (a, b: number, c: number, d: number) => a * 2 + b - c * d,
            Just(1),
            Nothing,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map4(
            (a, b, c: number, d: number) => a * 2 + b - c * d,
            Just(1),
            Just(2),
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map4(
            (a, b, c, d: number) => a * 2 + b - c * d,
            Just(1),
            Just(2),
            Just(3),
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map4(
            (a, b, c, d) => a * 2 + b - c * d,
            Just(1),
            Just(2),
            Just(3),
            Just(4)
        ),
        Just(-8)
    );
});

test('Maybe.map5', t => {
    t.deepEqual(
        Maybe.map5(
            (a: number, b: number, c: number, d: number, e: number) => a * 2 + b - c * d + e,
            Nothing,
            Nothing,
            Nothing,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map5(
            (a, b: number, c: number, d: number, e: number) => a * 2 + b - c * d + e,
            Just(1),
            Nothing,
            Nothing,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map5(
            (a, b, c: number, d: number, e: number) => a * 2 + b - c * d + e,
            Just(1),
            Just(2),
            Nothing,
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map5(
            (a, b, c, d: number, e: number) => a * 2 + b - c * d + e,
            Just(1),
            Just(2),
            Just(3),
            Nothing,
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map5(
            (a, b, c, d, e: number) => a * 2 + b - c * d + e,
            Just(1),
            Just(2),
            Just(3),
            Just(4),
            Nothing
        ),
        Nothing
    );

    t.deepEqual(
        Maybe.map5(
            (a, b, c, d, e) => a * 2 + b - c * d + e,
            Just(1),
            Just(2),
            Just(3),
            Just(4),
            Just(5)
        ),
        Just(-3)
    );
});

test('Maybe.andThen', t => {
    t.deepEqual(
        Maybe.andThen(() => Nothing, Nothing),
        Nothing
    );

    t.deepEqual(
        Maybe.andThen(() => Nothing, Just(1)),
        Nothing
    );

    t.deepEqual(
        Maybe.andThen(a => Just(a * 3), Nothing),
        Nothing
    );

    t.deepEqual(
        Maybe.andThen(a => Just(a * 3), Just(1)),
        Just(3)
    );
});

test('Maybe.withDefault', t => {
    t.is(
        Maybe.withDefault(1, Nothing),
        1
    );

    t.is(
        Maybe.withDefault(1, Just(2)),
        2
    );
});

test('Maybe.cata', t => {
    t.is(
        Maybe.cata({
            Nothing: () => 1,
            Just: a => a * 2
        }, Nothing),
        1
    );

    t.is(
        Maybe.cata({
            Nothing: () => 1,
            Just: a => a * 2
        }, Just(3)),
        6
    );
})