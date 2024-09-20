import Enum from './Enum';

type EnumValuesToValues<EnumValue extends Enum.Value[]> = EnumValue extends [
    infer First extends Enum.Value,
    ...infer Rest extends Enum.Value[],
]
    ? [First extends string ? `${First}` : First, ...EnumValuesToValues<Rest>]
    : [];

export default EnumValuesToValues;
