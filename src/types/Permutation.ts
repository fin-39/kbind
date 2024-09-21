import SpreadElementInArray from '@/types/SpreadElementInArray';

type Permutation<Array extends any[]> = Array extends [
    infer First,
    ...infer Result,
]
    ? SpreadElementInArray<First, Permutation<Result>> | Permutation<Result>
    : Array;

export default Permutation;
