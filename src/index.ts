import KeyBinder from './KeyBinder';
import isTextInputEventValid from './validators/isTextInputEventValid';

export * as KeyBinder from '@/KeyBinder';

export const defaultEventValidators = {
    isTextInputEventValid,
};

export default KeyBinder;
