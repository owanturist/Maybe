import test from 'ava';

import {
    Nothing,
    Just
} from '../src/Maybe';
import {
    List
} from '../src/List';

test('List.isEmpty', t => {
    t.true(
        List.isEmpty([])
    );

    t.false(
        List.isEmpty([ 1, 2, 3 ])
    );
});

test('List.size', t => {
    t.is(
        List.size([]),
        0
    );

    t.is(
        List.size([ 1, 2, 3 ]),
        3
    );
});

test('List.reverse', t => {
    const list1: List<number> = [];

    t.is(
        List.reverse(list1),
        list1
    );

    t.deepEqual(
        List.reverse(list1),
        []
    );

    const list2 = [ 1 ];

    t.is(
        List.reverse(list2),
        list2
    );

    t.deepEqual(
        List.reverse(list2),
        [ 1 ]
    );

    const list3 = [ 1, 2, 3 ];

    t.not(
        List.reverse(list3),
        list3
    );

    t.deepEqual(
        List.reverse(list3),
        [ 3, 2, 1 ]
    );

    t.deepEqual(
        list3,
        [ 1, 2, 3 ]
    );
});

test('List.member', t => {
    t.false(
        List.member(0, []),
    );

    t.false(
        List.member(0, [ 1, 2, 3 ]),
    );

    t.true(
        List.member(0, [ 0, 1, 2, 3 ]),
    );
});

test('List.head', t => {
    t.deepEqual(
        List.head([]),
        Nothing
    );

    t.deepEqual(
        List.head([ 1, 2, 3 ]),
        Just(1)
    );
});

test('List.tail', t => {
   t.deepEqual(
       List.tail([]),
       Nothing
   );

   const list = [ 1 ];

   t.deepEqual(
       List.tail(list),
       Just([])
   );

   t.deepEqual(
       list,
       [ 1 ]
   );

   t.deepEqual(
       List.tail([ 1, 2, 3 ]),
       Just([ 2, 3 ])
   );
});

test.todo('List.filter');

test.todo('List.take');

test('List.drop', t => {
    const list1 = [ 1 ];

    t.is(
        List.drop(0, list1),
        list1
    );

    t.deepEqual(
        List.drop(0, list1),
        [ 1 ]
    );

    t.deepEqual(
        List.drop(100, list1),
        []
    );

    t.deepEqual(
        list1,
        [ 1 ]
    );

    const list2 = [ 1, 2, 3, 4 ];

    t.not(
        List.drop(2, list2),
        list2
    );

    t.deepEqual(
        List.drop(2, list2),
        [ 3, 4 ]
    );

    t.deepEqual(
        list2,
        [ 1, 2, 3, 4 ]
    );
});

test.todo('List.singleton');

test.todo('List.repeat');

test.todo('List.range');

test.todo('List.append');

test.todo('List.concat');

test.todo('List.intersperse');

test.todo('List.partition');

test.todo('List.unzip');

test.todo('List.map');

test.todo('List.map2');

test.todo('List.map3');

test.todo('List.map4');

test.todo('List.map5');

test.todo('List.map6');

test.todo('List.map7');

test.todo('List.map8');

test.todo('List.filterMap');

test.todo('List.concatMap');

test.todo('List.indexedMap');

test.todo('List.foldr');

test.todo('List.foldl');

test.todo('List.sum');

test.todo('List.product');

test.todo('List.maximum');

test.todo('List.minimum');

test.todo('List.all');

test.todo('List.any');

test.todo('List.scanl');

test.todo('List.sort');

test.todo('List.sortBy');

test.todo('List.sortWith');