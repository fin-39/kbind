import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import sortedIndex from 'lodash/sortedIndex';
import AnyOrderArray from '@/types/AnyOrderArray';
import Handler from '@/types/Handler';
import { keyCodeToKeyName, modifierKeys, primaryKeys } from '@/data';
import Key from '@/enums/Key';
import EnumValuesToValues from '@/types/EnumValuesToValues';
import EnumValueToValue from '@/types/EnumValueToValue';
import isTextInputEventValid from '@/validators/isTextInputEventValid';

class KeyBinder {
    private static state: KeyBinder.State = {
        modifierKeys: [],
        listeners: {},
        layers: {
            default: {
                priority: 0,
                propagate: true,
            },
        },
    };

    public static eventValidators: KeyBinder.EventValidator[] = [
        isTextInputEventValid,
    ];

    public static get isControlPressed() {
        return (
            KeyBinder.state.modifierKeys.includes(Key.ControlLeft) ||
            KeyBinder.state.modifierKeys.includes(Key.ControlRight)
        );
    }

    public static get isShiftPressed() {
        return (
            KeyBinder.state.modifierKeys.includes(Key.ShiftLeft) ||
            KeyBinder.state.modifierKeys.includes(Key.ShiftRight)
        );
    }

    public static get isAltPressed() {
        return (
            KeyBinder.state.modifierKeys.includes(Key.AltLeft) ||
            KeyBinder.state.modifierKeys.includes(Key.AltRight)
        );
    }

    public static get layerIds() {
        return Object.keys(KeyBinder.state.layers).sort(
            (leftLayerId, rightLayerId) => {
                const leftLayer = KeyBinder.state.layers[leftLayerId];
                const rightLayer = KeyBinder.state.layers[rightLayerId];

                return rightLayer.priority - leftLayer.priority;
            },
        );
    }

    public static get listenerIds() {
        return Object.keys(KeyBinder.state.listeners).sort(
            (leftListenerId, rightListenerId) => {
                const leftListener = KeyBinder.state.listeners[leftListenerId];
                const rightListener =
                    KeyBinder.state.listeners[rightListenerId];

                return rightListener.priority - leftListener.priority;
            },
        );
    }

    public static get highestLayerPriority() {
        const layerId = KeyBinder.layerIds[0];

        if (isUndefined(layerId)) return undefined;

        return KeyBinder.state.layers[layerId].priority;
    }

    public static mount() {
        window.addEventListener('blur', KeyBinder.blurHandler);
        window.addEventListener('keydown', KeyBinder.keyDownHandler);
        window.addEventListener('keyup', KeyBinder.keyUpHandler);
    }

    public static unmount() {
        window.removeEventListener('blur', KeyBinder.blurHandler);
        window.removeEventListener('keydown', KeyBinder.keyDownHandler);
        window.removeEventListener('keyup', KeyBinder.keyUpHandler);
    }

    public static blurHandler() {
        KeyBinder.state.modifierKeys = [];
    }

    public static keyDownHandler(event: KeyboardEvent) {
        if (!event.code) return;

        if (!KeyBinder.isModifierKeyCode(event.code)) {
            KeyBinder.emit(event);

            return;
        }

        if (KeyBinder.state.modifierKeys.includes(event.code)) return;

        KeyBinder.state.modifierKeys.splice(
            sortedIndex(KeyBinder.state.modifierKeys, event.code),
            0,
            event.code,
        );
    }

    public static keyUpHandler(event: KeyboardEvent) {
        if (!event.code) return;

        if (!KeyBinder.isModifierKeyCode(event.code)) return;

        const keyIndex = KeyBinder.state.modifierKeys.indexOf(event.code);

        if (keyIndex === -1) return;

        KeyBinder.state.modifierKeys.splice(keyIndex, 1);
    }

    public static isModifierKeyCode(key: string): key is KeyBinder.ModifierKey {
        return modifierKeys.includes(key as KeyBinder.ModifierKey);
    }

    public static isPrimaryKeyCode(key: string): key is KeyBinder.PrimaryKey {
        return primaryKeys.includes(key as KeyBinder.PrimaryKey);
    }

    public static normalizeKey(key: KeyBinder.KeyCode) {
        return keyCodeToKeyName[key] || key;
    }

    public static normalizeKeyBind(keyBind: KeyBinder.KeyBind) {
        if (Array.isArray(keyBind)) {
            return keyBind
                .map(KeyBinder.normalizeKey)
                .sort((a, b) => a.localeCompare(b));
        }

        if (keyBind) return [keyBind];

        return [];
    }

    public static getHighestListenerPriority(
        layerId: KeyBinder.State.Layer.Id,
    ) {
        const { listenerIds } = KeyBinder;

        const listenerId = listenerIds.find((listenerId) => {
            const listener = KeyBinder.state.listeners[listenerId];

            return listener.layerId === layerId;
        });

        if (isUndefined(listenerId)) return undefined;

        return KeyBinder.state.listeners[listenerId].priority;
    }

    public static registerListener(
        id: KeyBinder.State.Listener.Id,
        listener: KeyBinder.State.Listener,
    ) {
        KeyBinder.state.listeners[id] = {
            layerId: listener.layerId ?? 'default',

            ...listener,
        };
    }

    public static unregisterListener(id: KeyBinder.State.Listener.Id) {
        delete KeyBinder.state.listeners[id];
    }

    public static registerLayer(
        id: KeyBinder.State.Layer.Id,
        layer: KeyBinder.State.Layer,
    ) {
        KeyBinder.state.layers[id] = layer;
    }

    public static unregisterLayer(id: KeyBinder.State.Layer.Id) {
        delete KeyBinder.state.layers[id];
    }

    private static isValidEvent(event: KeyboardEvent) {
        return KeyBinder.eventValidators.every((eventValidator) =>
            eventValidator(event),
        );
    }

    private static checkIfBindModifierKeysPressed(bind: KeyBinder.KeyBind) {
        const bindForProcessing = bind as string[];

        const currentModifierKeysState = {
            Control: {
                Left: KeyBinder.state.modifierKeys.includes(Key.ControlLeft),
                Right: KeyBinder.state.modifierKeys.includes(Key.ControlRight),
            },
            Shift: {
                Left: KeyBinder.state.modifierKeys.includes(Key.ShiftLeft),
                Right: KeyBinder.state.modifierKeys.includes(Key.ShiftRight),
            },
            Alt: {
                Left: KeyBinder.state.modifierKeys.includes(Key.AltLeft),
                Right: KeyBinder.state.modifierKeys.includes(Key.AltRight),
            },
        };

        const bindModifierKeysState = {
            Control: {
                Left:
                    bindForProcessing.includes(Key.Control) ||
                    bindForProcessing.includes(Key.ControlLeft),
                Right:
                    bindForProcessing.includes(Key.Control) ||
                    bindForProcessing.includes(Key.ControlRight),
            },
            Shift: {
                Left:
                    bindForProcessing.includes(Key.Shift) ||
                    bindForProcessing.includes(Key.ShiftLeft),
                Right:
                    bindForProcessing.includes(Key.Shift) ||
                    bindForProcessing.includes(Key.ShiftRight),
            },
            Alt: {
                Left:
                    bindForProcessing.includes(Key.Alt) ||
                    bindForProcessing.includes(Key.AltLeft),
                Right:
                    bindForProcessing.includes(Key.Alt) ||
                    bindForProcessing.includes(Key.AltRight),
            },
        };

        return Object.keys(currentModifierKeysState).every((key) => {
            const modifierKey = key as keyof typeof currentModifierKeysState;

            const currentKeyState = currentModifierKeysState[modifierKey];
            const bindKeyState = bindModifierKeysState[modifierKey];

            return (
                (currentKeyState.Left && bindKeyState.Left) ||
                (currentKeyState.Right && bindKeyState.Right) ||
                (!currentKeyState.Left &&
                    !currentKeyState.Right &&
                    !bindKeyState.Left &&
                    !bindKeyState.Right)
            );
        });
    }

    private static findListenerIdByPressedKey(pressedKey: KeyBinder.KeyCode) {
        const { layerIds, listenerIds } = KeyBinder;

        let listenerId: KeyBinder.State.Listener.Id | undefined;

        for (let index = 0; index < layerIds.length; index += 1) {
            const currentLayerId = layerIds[index];
            const currentLayer = KeyBinder.state.layers[currentLayerId];

            const currentListenerId = listenerIds.find((listenerId) => {
                const listener = KeyBinder.state.listeners[listenerId];

                if (listener.layerId !== currentLayerId) return false;

                const { bind } = listener;

                if (isNil(bind)) return false;

                const isAllModifierKeysPressed =
                    KeyBinder.checkIfBindModifierKeysPressed(bind);

                if (isAllModifierKeysPressed) {
                    const bindKeyCode = bind[bind.length - 1];

                    return (
                        bindKeyCode === pressedKey ||
                        (bindKeyCode === 'Enter' &&
                            pressedKey === 'NumpadEnter')
                    );
                }

                return false;
            });

            listenerId = currentListenerId;

            if (!currentListenerId && currentLayer.propagate) {
                // eslint-disable-next-line no-continue
                continue;
            }

            break;
        }

        return listenerId;
    }

    private static emit(event: KeyboardEvent) {
        if (!KeyBinder.isValidEvent(event)) return;

        const listenerId = KeyBinder.findListenerIdByPressedKey(
            event.code as KeyBinder.KeyCode,
        );

        if (isUndefined(listenerId)) return;

        const listener = KeyBinder.state.listeners[listenerId];

        if (listener.options?.preventDefault) event.preventDefault();
        if (listener.options?.stopPropagation) event.stopPropagation();

        listener.handler?.(event);
    }
}

namespace KeyBinder {
    export type ModifierKey = (typeof modifierKeys)[number];
    export type PrimaryKey = (typeof primaryKeys)[number];

    export type KeyCode = keyof typeof Key;

    export type ModifierKeys = [
        Key.Control | Key.ControlLeft | Key.ControlRight,
        Key.Shift | Key.ShiftLeft | Key.ShiftRight,
        Key.Alt | Key.AltLeft | Key.AltRight,
    ];

    export type EventValidator = (event: KeyboardEvent) => boolean;

    export type KeyBind = [...KeyBind.Modifiers, KeyBind.PressKey];

    export namespace KeyBind {
        export type Modifiers = EnumValuesToValues<AnyOrderArray<ModifierKeys>>;
        export type PressKey = EnumValueToValue<PrimaryKey>;
    }

    export interface State {
        modifierKeys: ModifierKey[];
        listeners: Record<State.Listener.Id, State.Listener>;
        layers: Record<State.Layer.Id, State.Layer>;
    }

    export namespace State {
        export interface Layer {
            priority: number;

            propagate: boolean;
        }

        export namespace Layer {
            export type Id = string;
        }

        export interface Listener {
            layerId?: Layer.Id;

            priority: number;
            bind?: KeyBind | null;
            handler?: Handler<KeyboardEvent>;
            options?: Listener.Options;
        }

        export namespace Listener {
            export type Id = string;

            export interface Options {
                preventDefault?: boolean;
                stopPropagation?: boolean;
            }
        }
    }
}

export default KeyBinder;
