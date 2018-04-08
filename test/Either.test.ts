import test from 'ava';

import {
    Nothing,
    Just
} from '../src/Maybe';
import {
    Either,
    Left,
    Right
} from '../src/Either';

test('Either.fromNullable()', t => {
    t.deepEqual(
        Either.fromNullable('err', undefined),
        Left('err')
    );

    t.deepEqual(
        Either.fromNullable('err', null),
        Left('err')
    );

    t.deepEqual(
        Either.fromNullable('err', 0),
        Right(0)
    );

    t.deepEqual(
        Either.fromNullable('err', ''),
        Right('')
    );
});

test('Either.isLeft', t => {
    t.true(Left('err').isLeft);

    t.false(Right(1).isLeft);
});

test('Either.isRight', t => {
    t.false(Left('err').isRight);

    t.true(Right(1).isRight);
});

test('Either.isEqual()', t => {
    t.true(
        Left('err').isEqual(Left('err'))
    );

    t.false(
        Left('err').isEqual(Right(1))
    );

    t.false(
        Right(1).isEqual(Left('err'))
    );

    t.false(
        Right(1).isEqual(Right(2))
    );

    t.false(
        Right([]).isEqual(Right([]))
    );

    t.true(
        Right(1).isEqual(Right(1))
    );
});

test('Either.getOrElse()', t => {
    t.is(
        Left('err').getOrElse(1),
        1
    );

    t.is(
        Right(2).getOrElse(1),
        2
    );
});

test('Either.ap()', t => {
    t.deepEqual(
        Left('1').ap(Left('2')),
        Left('1')
    );

    t.deepEqual(
        Left<string, number>('1').ap(Right((a: number) => a * 2)),
        Left('1')
    );

    t.deepEqual(
        Right(1).ap(Left('1')),
        Left('1')
    );

    t.deepEqual(
        Right(1).ap(Right((a: number) => a * 2)),
        Right(2)
    );
});

test('Either.map()', t => {
    t.deepEqual(
        Left<string, number>('err').map(a => a * 2),
        Left('err')
    );

    t.deepEqual(
        Right(1).map(a => a * 2),
        Right(2)
    );

    interface Foo {
        bar: Either<string, number>;
    }

    const foo: Foo = {
        bar: Left('err')
    };

    t.deepEqual(
        foo.bar.map(a => a * 2),
        Left('err')
    );
});

test('Either.chain()', t => {
    t.deepEqual(
        Left('err').chain(() => Left('err')),
        Left('err')
    );

    t.deepEqual(
        Right(1).chain(() => Left('err')),
        Left('err')
    );

    t.deepEqual(
        Left<string, number>('err').chain(a => Right(a * 2)),
        Left('err')
    );

    t.deepEqual(
        Right(1).chain(a => Right(a * 2)),
        Right(2)
    );
});

test('Either.fold()', t => {
    t.deepEqual(
        Left<string, number>('err').fold(err => err + '_', a => '_' + a.toString()),
        'err_'
    );

    t.deepEqual(
        Right<string, number>(1).fold(err => err + '_', a => '_' + a.toString()),
        '_1'
    );
});

test('Either.cata()', t => {
    t.is(
        Left<string, number>('err').cata({
            Left: err => err + '_',
            Right: a => '_' + a.toString()
        }),
        'err_'
    );

    t.is(
        Right<string, number>(1).cata({
            Left: err => err + '_',
            Right: a => '_' + a.toString()
        }),
        '_1'
    );
});

test('Either.swap()', t => {
    t.deepEqual(
        Left('err').swap(),
        Right('err')
    );

    t.deepEqual(
        Right(1).swap(),
        Left(1)
    );
});

test('Either.bimap()', t => {
    t.deepEqual(
        Left<string, number>('err').bimap(err => err + '_', a => a * 2),
        Left('err_')
    );

    t.deepEqual(
        Right<string, number>(1).bimap(err => err + '_', a => a * 2),
        Right(2)
    );
});

test('Either.leftMap()', t => {
    t.deepEqual(
        Left('err').leftMap(err => err + '_'),
        Left('err_')
    );

    t.deepEqual(
        Right<string, number>(1).leftMap(err => err + '_'),
        Right(1)
    );
});

test('Either.orElse()', t => {
    t.deepEqual(
        Left('err').orElse(err => Left(err + '_')),
        Left('err_')
    );

    t.deepEqual(
        Right<string, number>(1).orElse(err => Left(err + '_')),
        Right(1)
    );

    t.deepEqual(
        Left('err').orElse(() => Right(1)),
        Right(1)
    );

    t.deepEqual(
        Right(1).orElse(() => Right(2)),
        Right(1)
    );
});

test('Either.toMaybe()', t => {
    t.deepEqual(
        Left('err').toMaybe(),
        Nothing()
    );

    t.deepEqual(
        Right(1).toMaybe(),
        Just(1)
    );
});

test('Either.props()', t => {
    t.deepEqual(
        Either.props({}),
        Right({})
    );

    t.deepEqual(
        Either.props({
            foo: Left('1')
        }),
        Left('1')
    );

    t.deepEqual(
        Either.props({
            foo: Right(1)
        }),
        Right({
            foo: 1
        })
    );

    t.deepEqual(
        Either.props({
            foo: Left('1'),
            bar: Left('2')
        }),
        Left('1')
    );

    t.deepEqual(
        Either.props({
            foo: Left('1'),
            bar: Right(1)
        }),
        Left('1')
    );

    t.deepEqual(
        Either.props({
            foo: Right(1),
            bar: Left('1')
        }),
        Left('1')
    );

    t.deepEqual(
        Either.props({
            foo: Right('foo'),
            bar: Right(1)
        }),
        Right({
            foo: 'foo',
            bar: 1
        })
    );

    t.deepEqual(
        Either.props({
            foo: Right('foo'),
            bar: Right(1)
        }).map(obj => obj.foo),
        Right('foo')
    );

    t.deepEqual(
        Either.props({
            foo: Right('foo'),
            bar: Right(1)
        }).map(obj => obj.bar),
        Right(1)
    );

    t.deepEqual(
        Either.props({
            foo: Right('foo'),
            bar: Either.props({
                baz: Left('1')
            })
        }),
        Left('1')
    );

    t.deepEqual(
        Either.props({
            foo: Right('foo'),
            bar: Either.props({
                baz: Right(1)
            })
        }),
        Right({
            foo: 'foo',
            bar: {
                baz: 1
            }
        })
    );
});

test('Either.all()', t => {
    t.deepEqual(
        Either.all([]),
        Right([])
    );

    t.deepEqual(
        Either.all([ Left('1') ]),
        Left('1')
    );

    t.deepEqual(
        Either.all([ Right(1) ]),
        Right([ 1 ])
    );

    t.deepEqual(
        Either.all([ Left('1'), Left('2') ]),
        Left('1')
    );

    t.deepEqual(
        Either.all([ Left('1'), Right(2) ]),
        Left('1')
    );

    t.deepEqual(
        Either.all([ Right(1), Left('2') ]),
        Left('2')
    );

    t.deepEqual(
        Either.all([ Right(1), Right(2) ]),
        Right([ 1, 2 ])
    );
});
