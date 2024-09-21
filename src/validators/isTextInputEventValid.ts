import Key from '@/enums/Key';
import isEventTargetInput from '@/utils/isEventTargetInput';

const shiftableKeys = [
    Key.Backquote,
    Key.Backslash,
    Key.BracketLeft,
    Key.BracketRight,
    Key.Comma,
    Key.Digit0,
    Key.Digit1,
    Key.Digit2,
    Key.Digit3,
    Key.Digit4,
    Key.Digit5,
    Key.Digit6,
    Key.Digit7,
    Key.Digit8,
    Key.Digit9,
    Key.Minus,
    Key.Equal,
    Key.IntlBackslash,
    Key.IntlRo,
    Key.IntlYen,
    Key.KeyA,
    Key.KeyB,
    Key.KeyC,
    Key.KeyD,
    Key.KeyE,
    Key.KeyF,
    Key.KeyG,
    Key.KeyH,
    Key.KeyI,
    Key.KeyJ,
    Key.KeyK,
    Key.KeyL,
    Key.KeyM,
    Key.KeyN,
    Key.KeyO,
    Key.KeyP,
    Key.KeyQ,
    Key.KeyR,
    Key.KeyS,
    Key.KeyT,
    Key.KeyU,
    Key.KeyV,
    Key.KeyW,
    Key.KeyX,
    Key.KeyY,
    Key.KeyZ,
    Key.Quote,
    Key.Semicolon,
    Key.Slash,
];

const writableKeys = [
    ...shiftableKeys,

    Key.Backspace,
    Key.Delete,
    Key.Numpad0,
    Key.Numpad1,
    Key.Numpad2,
    Key.Numpad3,
    Key.Numpad4,
    Key.Numpad5,
    Key.Numpad6,
    Key.Numpad7,
    Key.Numpad8,
    Key.Numpad9,
    Key.NumpadAdd,
    Key.NumpadSubtract,
    Key.NumpadMultiply,
    Key.NumpadDivide,
    Key.NumpadEqual,
    Key.NumpadDecimal,
    Key.NumpadComma,
    Key.Space,
];

const noModifierValidKeys = [Key.Home, Key.End, Key.PageUp, Key.PageDown];

const ctrlValidKeys = [
    Key.ArrowLeft,
    Key.ArrowRight,
    Key.Backspace,
    Key.Delete,
    Key.Home,
    Key.End,
    Key.KeyA,

    Key.KeyC,
    Key.Insert,

    Key.KeyX,

    Key.KeyV,

    Key.KeyZ,
    Key.KeyY,
];

const altValidKeys = [
    Key.Numpad0,
    Key.Numpad1,
    Key.Numpad2,
    Key.Numpad3,
    Key.Numpad4,
    Key.Numpad5,
    Key.Numpad6,
    Key.Numpad7,
    Key.Numpad8,
    Key.Numpad9,
];

const shiftValidKeys = [
    Key.ArrowLeft,
    Key.ArrowRight,
    Key.Home,
    Key.End,

    Key.Delete,

    Key.Insert,
];

const ctrlShiftValidKeys = [Key.ArrowLeft, Key.ArrowRight, Key.Home, Key.End];

/**
 * Validates if a keyboard event is valid for a text input.
 *
 * This function checks the event target to ensure it is an input element of type 'text'.
 * And then it checks if the pressed keys don't overlap with standard hotkeys.
 *
 * @param event - The keyboard event to validate.
 * @returns `true` if the event is valid, `false` otherwise.
 */
function isTextInputEventValid(event: KeyboardEvent) {
    if (!isEventTargetInput(event, 'text')) {
        return true;
    }

    const { ctrlKey, shiftKey, altKey, code } = event;

    // No modifier keys
    if (!ctrlKey && !shiftKey && !altKey) {
        return (
            !noModifierValidKeys.includes(code as Key) &&
            !writableKeys.includes(code as Key)
        );
    }

    // Ctrl
    if (ctrlKey && !shiftKey && !altKey) {
        return !ctrlValidKeys.includes(code as Key);
    }

    // Shift
    if (!ctrlKey && shiftKey && !altKey) {
        return (
            !shiftValidKeys.includes(code as Key) &&
            !shiftableKeys.includes(code as Key)
        );
    }

    // Alt
    if (!ctrlKey && !shiftKey && altKey) {
        return !altValidKeys.includes(code as Key);
    }

    // Ctrl + Shift
    if (ctrlKey && shiftKey && !altKey) {
        return !ctrlShiftValidKeys.includes(code as Key);
    }

    return true;
}

export default isTextInputEventValid;
