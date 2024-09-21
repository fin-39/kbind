type SpreadElementInArray<Element, Array extends any[]> = Array extends [
    infer First,
    ...infer Rest,
]
    ? [Element, ...Array] | [First, ...SpreadElementInArray<Element, Rest>]
    : [Element];

export default SpreadElementInArray;
