export const modifierKeys = [
    'AltLeft',
    'AltRight',
    'ControlLeft',
    'ControlRight',
    'ShiftLeft',
    'ShiftRight',
] as const;

export const primaryKeys = [
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'Backquote',
    'Backslash',
    'Backspace',
    'BracketLeft',
    'BracketRight',
    'CapsLock',
    'Comma',
    'Delete',
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Minus',
    'Equal',
    'End',
    'Enter',
    'Escape',
    'Home',
    'Insert',
    'IntlBackslash',
    'IntlRo',
    'IntlYen',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'F13',
    'F14',
    'F15',
    'F16',
    'F17',
    'F18',
    'F19',
    'F20',
    'F21',
    'F22',
    'F23',
    'F24',
    'KeyA',
    'KeyB',
    'KeyC',
    'KeyD',
    'KeyE',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyI',
    'KeyJ',
    'KeyK',
    'KeyL',
    'KeyM',
    'KeyN',
    'KeyO',
    'KeyP',
    'KeyQ',
    'KeyR',
    'KeyS',
    'KeyT',
    'KeyU',
    'KeyV',
    'KeyW',
    'KeyX',
    'KeyY',
    'KeyZ',
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',
    'NumpadAdd',
    'NumpadSubtract',
    'NumpadMultiply',
    'NumpadDivide',
    'NumpadEqual',
    'NumpadDecimal',
    'NumpadComma',
    'NumpadEnter',
    'PageUp',
    'PageDown',
    'Pause',
    'Period',
    'Quote',
    'ScrollLock',
    'Semicolon',
    'Slash',
    'Space',
    'Tab',
] as const;

export const keyGroups = {
    Alt: ['AltLeft', 'AltRight'],
    Shift: ['ShiftLeft', 'ShiftRight'],
    Control: ['ControlLeft', 'ControlRight'],
} as const;

export const keyNames = {
    Alt: 'Alt',
    AltLeft: 'AltLeft',
    AltRight: 'AltRight',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    ArrowUp: 'ArrowUp',
    Backquote: '`',
    Backslash: '\\',
    Backspace: 'Backspace',
    BracketLeft: '[',
    BracketRight: ']',
    CapsLock: 'CapsLock',
    Comma: ',',
    Control: 'Ctrl',
    ControlLeft: 'ControlLeft',
    ControlRight: 'ControlRight',
    Delete: 'Delete',
    Digit0: '0',
    Digit1: '1',
    Digit2: '2',
    Digit3: '3',
    Digit4: '4',
    Digit5: '5',
    Digit6: '6',
    Digit7: '7',
    Digit8: '8',
    Digit9: '9',
    Minus: '-',
    Equal: '=',
    End: 'End',
    Enter: 'Enter',
    Escape: 'Escape',
    Home: 'Home',
    Insert: 'Insert',
    IntlBackslash: 'IntlBackslash',
    IntlRo: 'IntlRo',
    IntlYen: 'IntlYen',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    F13: 'F13',
    F14: 'F14',
    F15: 'F15',
    F16: 'F16',
    F17: 'F17',
    F18: 'F18',
    F19: 'F19',
    F20: 'F20',
    F21: 'F21',
    F22: 'F22',
    F23: 'F23',
    F24: 'F24',
    KeyA: 'A',
    KeyB: 'B',
    KeyC: 'C',
    KeyD: 'D',
    KeyE: 'E',
    KeyF: 'F',
    KeyG: 'G',
    KeyH: 'H',
    KeyI: 'I',
    KeyJ: 'J',
    KeyK: 'K',
    KeyL: 'L',
    KeyM: 'M',
    KeyN: 'N',
    KeyO: 'O',
    KeyP: 'P',
    KeyQ: 'Q',
    KeyR: 'R',
    KeyS: 'S',
    KeyT: 'T',
    KeyU: 'U',
    KeyV: 'V',
    KeyW: 'W',
    KeyX: 'X',
    KeyY: 'Y',
    KeyZ: 'Z',
    Numpad0: 'Numpad 0',
    Numpad1: 'Numpad 1',
    Numpad2: 'Numpad 2',
    Numpad3: 'Numpad 3',
    Numpad4: 'Numpad 4',
    Numpad5: 'Numpad 5',
    Numpad6: 'Numpad 6',
    Numpad7: 'Numpad 7',
    Numpad8: 'Numpad 8',
    Numpad9: 'Numpad 9',
    NumpadAdd: '+',
    NumpadSubtract: '-',
    NumpadMultiply: '*',
    NumpadDivide: '/',
    NumpadEqual: '=',
    NumpadDecimal: '.',
    NumpadComma: ',',
    NumpadEnter: 'Enter',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
    Pause: 'Pause',
    Period: '.',
    Quote: '"',
    ScrollLock: 'ScrollLock',
    Semicolon: ';',
    Shift: 'Shift',
    ShiftLeft: 'ShiftLeft',
    ShiftRight: 'ShiftRight',
    Slash: '/',
    Space: 'Space',
    Tab: 'Tab',
} as const;

export enum Key {
    Alt = 'Alt',
    AltLeft = 'AltLeft',
    AltRight = 'AltRight',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    ArrowUp = 'ArrowUp',
    Backquote = 'Backquote',
    Backslash = 'Backslash',
    Backspace = 'Backspace',
    BracketLeft = 'BracketLeft',
    BracketRight = 'BracketRight',
    CapsLock = 'CapsLock',
    Comma = 'Comma',
    Control = 'Control',
    ControlLeft = 'ControlLeft',
    ControlRight = 'ControlRight',
    Delete = 'Delete',
    Digit0 = 'Digit0',
    Digit1 = 'Digit1',
    Digit2 = 'Digit2',
    Digit3 = 'Digit3',
    Digit4 = 'Digit4',
    Digit5 = 'Digit5',
    Digit6 = 'Digit6',
    Digit7 = 'Digit7',
    Digit8 = 'Digit8',
    Digit9 = 'Digit9',
    Minus = 'Minus',
    Equal = 'Equal',
    End = 'End',
    Enter = 'Enter',
    Escape = 'Escape',
    Home = 'Home',
    Insert = 'Insert',
    IntlBackslash = 'IntlBackslash',
    IntlRo = 'IntlRo',
    IntlYen = 'IntlYen',
    F1 = 'F1',
    F2 = 'F2',
    F3 = 'F3',
    F4 = 'F4',
    F5 = 'F5',
    F6 = 'F6',
    F7 = 'F7',
    F8 = 'F8',
    F9 = 'F9',
    F10 = 'F10',
    F11 = 'F11',
    F12 = 'F12',
    F13 = 'F13',
    F14 = 'F14',
    F15 = 'F15',
    F16 = 'F16',
    F17 = 'F17',
    F18 = 'F18',
    F19 = 'F19',
    F20 = 'F20',
    F21 = 'F21',
    F22 = 'F22',
    F23 = 'F23',
    F24 = 'F24',
    KeyA = 'KeyA',
    KeyB = 'KeyB',
    KeyC = 'KeyC',
    KeyD = 'KeyD',
    KeyE = 'KeyE',
    KeyF = 'KeyF',
    KeyG = 'KeyG',
    KeyH = 'KeyH',
    KeyI = 'KeyI',
    KeyJ = 'KeyJ',
    KeyK = 'KeyK',
    KeyL = 'KeyL',
    KeyM = 'KeyM',
    KeyN = 'KeyN',
    KeyO = 'KeyO',
    KeyP = 'KeyP',
    KeyQ = 'KeyQ',
    KeyR = 'KeyR',
    KeyS = 'KeyS',
    KeyT = 'KeyT',
    KeyU = 'KeyU',
    KeyV = 'KeyV',
    KeyW = 'KeyW',
    KeyX = 'KeyX',
    KeyY = 'KeyY',
    KeyZ = 'KeyZ',
    Numpad0 = 'Numpad0',
    Numpad1 = 'Numpad1',
    Numpad2 = 'Numpad2',
    Numpad3 = 'Numpad3',
    Numpad4 = 'Numpad4',
    Numpad5 = 'Numpad5',
    Numpad6 = 'Numpad6',
    Numpad7 = 'Numpad7',
    Numpad8 = 'Numpad8',
    Numpad9 = 'Numpad9',
    NumpadAdd = 'NumpadAdd',
    NumpadSubtract = 'NumpadSubtract',
    NumpadMultiply = 'NumpadMultiply',
    NumpadDivide = 'NumpadDivide',
    NumpadEqual = 'NumpadEqual',
    NumpadDecimal = 'NumpadDecimal',
    NumpadComma = 'NumpadComma',
    NumpadEnter = 'NumpadEnter',
    PageUp = 'PageUp',
    PageDown = 'PageDown',
    Pause = 'Pause',
    Period = 'Period',
    Quote = 'Quote',
    ScrollLock = 'ScrollLock',
    Semicolon = 'Semicolon',
    Shift = 'Shift',
    ShiftLeft = 'ShiftLeft',
    ShiftRight = 'ShiftRight',
    Slash = 'Slash',
    Space = 'Space',
    Tab = 'Tab',
}

export default { modifierKeys, primaryKeys, keyGroups, keyNames };
