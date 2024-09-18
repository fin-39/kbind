import { isNil, isUndefined, sortedIndex } from 'lodash';
import AnyOrderArray from '@/types/AnyOrderArray';
import Handler from '@/types/Handler';
import { keyNames, modifierKeys, primaryKeys } from './data';
import isValidTextInputEvent from './utils/isValidTextInputEvent';

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

    public static get isControlPressed() {
        return (
            KeyBinder.state.modifierKeys.includes('ControlLeft') ||
            KeyBinder.state.modifierKeys.includes('ControlRight')
        );
    }

    public static get isShiftPressed() {
        return (
            KeyBinder.state.modifierKeys.includes('ShiftLeft') ||
            KeyBinder.state.modifierKeys.includes('ShiftRight')
        );
    }

    public static get isAltPressed() {
        return (
            KeyBinder.state.modifierKeys.includes('AltLeft') ||
            KeyBinder.state.modifierKeys.includes('AltRight')
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

    public static normalizeKey(key: KeyBinder.KeyName) {
        return keyNames[key] || key;
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
            layerId: listener.layerId || 'default',

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

    private static isValidTextInputEvent(event: KeyboardEvent) {
        return isValidTextInputEvent(event);
    }

    private static isValidEvent(event: KeyboardEvent) {
        const isEventTargetInput =
            (event.target as HTMLElement).tagName.toLowerCase() === 'input';

        if (isEventTargetInput) {
            const target = event.target as HTMLInputElement;

            if (target.type === 'text') {
                return KeyBinder.isValidTextInputEvent(event);
            }
        }

        return true;
    }

    private static emit(event: KeyboardEvent) {
        if (!KeyBinder.isValidEvent(event)) return;

        const { layerIds } = KeyBinder;
        const { listenerIds } = KeyBinder;

        let listenerId: KeyBinder.State.Listener.Id | undefined;

        for (let index = 0; index < layerIds.length; index += 1) {
            const currentLayerId = layerIds[index];
            const currentLayer = KeyBinder.state.layers[currentLayerId];

            const currentListenerId = listenerIds.find((listenerId) => {
                const listener = KeyBinder.state.listeners[listenerId];

                if (listener.layerId !== currentLayerId) return false;

                const bind = listener.bind as string[] | undefined | null;

                if (isNil(bind)) return false;

                const currentModifierKeysState = {
                    Control: {
                        Left: KeyBinder.state.modifierKeys.includes(
                            'ControlLeft',
                        ),
                        Right: KeyBinder.state.modifierKeys.includes(
                            'ControlRight',
                        ),
                    },
                    Shift: {
                        Left: KeyBinder.state.modifierKeys.includes(
                            'ShiftLeft',
                        ),
                        Right: KeyBinder.state.modifierKeys.includes(
                            'ShiftRight',
                        ),
                    },
                    Alt: {
                        Left: KeyBinder.state.modifierKeys.includes('AltLeft'),
                        Right: KeyBinder.state.modifierKeys.includes(
                            'AltRight',
                        ),
                    },
                };

                const bindModifierKeysState = {
                    Control: {
                        Left:
                            bind.includes('Control') ||
                            bind.includes('ControlLeft'),
                        Right:
                            bind.includes('Control') ||
                            bind.includes('ControlRight'),
                    },
                    Shift: {
                        Left:
                            bind.includes('Shift') ||
                            bind.includes('ShiftLeft'),
                        Right:
                            bind.includes('Shift') ||
                            bind.includes('ShiftRight'),
                    },
                    Alt: {
                        Left: bind.includes('Alt') || bind.includes('AltLeft'),
                        Right:
                            bind.includes('Alt') || bind.includes('AltRight'),
                    },
                };

                const modifierKeysCheck = Object.keys(
                    currentModifierKeysState,
                ).every((key) => {
                    const modifierKey =
                        key as keyof typeof currentModifierKeysState;

                    const currentKeyState =
                        currentModifierKeysState[modifierKey];
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

                if (modifierKeysCheck) {
                    const bindKeyCode = bind[bind.length - 1];

                    return (
                        bindKeyCode === event.code ||
                        (bindKeyCode === 'Enter' &&
                            event.code === 'NumpadEnter')
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

    export type KeyName = keyof typeof keyNames;

    type ModifierKeys = [
        'Control' | 'ControlLeft' | 'ControlRight',
        'Shift' | 'ShiftLeft' | 'ShiftRight',
        'Alt' | 'AltLeft' | 'AltRight',
    ];

    export type ModifierKeyBindPart = AnyOrderArray<ModifierKeys>;

    export type KeyBind = [...ModifierKeyBindPart, PrimaryKey];

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
            bind?: KeyBind | undefined | null;
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
