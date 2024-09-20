import Enum from './Enum';

type EnumValueToValue<EnumValue extends Enum.Value> = EnumValue extends string
    ? `${EnumValue}`
    : EnumValue;

export default EnumValueToValue;
