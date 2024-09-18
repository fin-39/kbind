type Put<Element, Array extends any[]> = Array extends [
    infer First,
    ...infer Rest,
]
    ? [Element, ...Array] | [First, ...Put<Element, Rest>]
    : [Element];

type Permutation<Array extends any[]> = Array extends [
    infer First,
    ...infer Result,
]
    ? Put<First, Permutation<Result>> | Permutation<Result>
    : Array;

type AnyOrderArray<Array extends any[]> = Permutation<Array>;

export default AnyOrderArray;
