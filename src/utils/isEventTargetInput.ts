import Arrayable from '@/types/Arrayable';
import { isUndefined } from 'lodash';
import isArray from 'lodash/isArray';

function isEventTargetInput(
    event: KeyboardEvent,
    types?: Arrayable<string>,
): boolean {
    const { target } = event;

    if (
        !(
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement
        )
    ) {
        return false;
    }

    const targetType = target.getAttribute('type') ?? 'text-area';

    if (isUndefined(types)) {
        return true;
    }

    return isArray(types)
        ? (types?.includes(targetType) ?? true)
        : targetType === types;
}

export default isEventTargetInput;
