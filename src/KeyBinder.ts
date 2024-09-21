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

/**
 * KeyBinder class provides functionality to manage keyboard event listeners,
 * layers, and modifier keys. It allows registering and unregistering listeners
 * and layers, handling key events, and validating events based on custom
 * validators.
 */
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

    /**
     * An array of event validator functions used to determine the validity of keyboard events.
     *
     * It's necessary in case you don't want to trigger some listeners under certain conditions,
     * e.g. `Ctrl+A` in a text field.
     *
     * @type {KeyBinder.EventValidator[]}
     */
    public static eventValidators: KeyBinder.EventValidator[] = [
        isTextInputEventValid,
    ];

    /**
     * Checks if either the left or right Control key is currently pressed.
     *
     * @returns {boolean} `true` if either ControlLeft or ControlRight key is pressed,
     * otherwise `false`.
     */
    public static get isControlPressed() {
        return (
            KeyBinder.state.modifierKeys.includes(Key.ControlLeft) ||
            KeyBinder.state.modifierKeys.includes(Key.ControlRight)
        );
    }

    /**
     * Checks if either the left or right Shift key is currently pressed.
     *
     * @returns {boolean} `true` if either ShiftLeft or ShiftRight key is pressed,
     * otherwise `false`
     */
    public static get isShiftPressed() {
        return (
            KeyBinder.state.modifierKeys.includes(Key.ShiftLeft) ||
            KeyBinder.state.modifierKeys.includes(Key.ShiftRight)
        );
    }

    /**
     * Checks if either the left or right Alt key is currently pressed.
     *
     * @returns {boolean} `true` if either AltLeft or AltRight key is pressed,
     * otherwise `false`.
     */
    public static get isAltPressed() {
        return (
            KeyBinder.state.modifierKeys.includes(Key.AltLeft) ||
            KeyBinder.state.modifierKeys.includes(Key.AltRight)
        );
    }

    /**
     * Gets the sorted list of layer ids based on their priority.
     *
     * NOTE: heavy operation, use it wisely.
     *
     * @returns {string[]} An array of layer IDs sorted in descending order of their priority.
     */
    public static get layerIds() {
        return Object.keys(KeyBinder.state.layers).sort(
            (leftLayerId, rightLayerId) => {
                const leftLayer = KeyBinder.state.layers[leftLayerId];
                const rightLayer = KeyBinder.state.layers[rightLayerId];

                return rightLayer.priority - leftLayer.priority;
            },
        );
    }

    /**
     * Gets the sorted list of listener ids based on their priority.
     *
     * NOTE: heavy operation, use it wisely.
     *
     * @returns {string[]} An array of listener IDs sorted in descending order of their priority.
     */
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

    /**
     * Gets the highest priority of the layer in the stack.
     *
     * NOTE: heavy operation, use it wisely.
     *
     * @returns {number | undefined} The highest priority of the layer in the stack.
     */
    public static get highestLayerPriority() {
        const layerId = KeyBinder.layerIds[0];

        if (isUndefined(layerId)) return undefined;

        return KeyBinder.state.layers[layerId].priority;
    }

    /**
     * Mounts the KeyBinder event listeners to the window object.
     * This method attaches the following event listeners:
     * - 'blur': Calls the `blurHandler` method when the window loses focus.
     * - 'keydown': Calls the `keyDownHandler` method when a key is pressed down.
     * - 'keyup': Calls the `keyUpHandler` method when a key is released.
     */
    public static mount() {
        window.addEventListener('blur', KeyBinder.blurHandler);
        window.addEventListener('keydown', KeyBinder.keyDownHandler);
        window.addEventListener('keyup', KeyBinder.keyUpHandler);
    }

    /**
     * Unmounts the KeyBinder by removing event listeners for 'blur', 'keydown', and 'keyup' events.
     * This method should be called to clean up event listeners when the KeyBinder is no longer
     * needed.
     */
    public static unmount() {
        window.removeEventListener('blur', KeyBinder.blurHandler);
        window.removeEventListener('keydown', KeyBinder.keyDownHandler);
        window.removeEventListener('keyup', KeyBinder.keyUpHandler);
    }

    /**
     * Handles the blur event by resetting the state of modifier keys.
     * This method is called when the window loses focus.
     */
    public static blurHandler() {
        KeyBinder.state.modifierKeys = [];
    }

    /**
     * Handles the key down event by processing the key code and updating the state of modifier
     * keys.
     *
     * @param event - The keyboard event triggered by a key press.
     */
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

    /**
     * Handles the key up event for modifier keys.
     *
     * @param event - The keyboard event triggered on key up.
     */
    public static keyUpHandler(event: KeyboardEvent) {
        if (!event.code) return;

        if (!KeyBinder.isModifierKeyCode(event.code)) return;

        const keyIndex = KeyBinder.state.modifierKeys.indexOf(event.code);

        if (keyIndex === -1) return;

        KeyBinder.state.modifierKeys.splice(keyIndex, 1);
    }

    /**
     * Checks if the given key code is a modifier key.
     *
     * @param key - The key code to check.
     * @returns `true` if the key is a modifier key, otherwise `false`.
     */
    public static isModifierKeyCode(key: string): key is KeyBinder.ModifierKey {
        return modifierKeys.includes(key as KeyBinder.ModifierKey);
    }

    /**
     * Checks if the given key code is a primary key.
     *
     * @param key - The key code to check.
     * @returns `true` if the key is a primary key, otherwise `false`.
     */
    public static isPrimaryKeyCode(key: string): key is KeyBinder.PrimaryKey {
        return primaryKeys.includes(key as KeyBinder.PrimaryKey);
    }

    /**
     * Converts a given key code to its corresponding key name.
     *
     * @param key - The key code to convert.
     * @returns The key name corresponding to the key code,
     * or the key code itself if no key name is found.
     */
    public static normalizeKey(key: KeyBinder.KeyCode) {
        return keyCodeToKeyName[key] || key;
    }

    /**
     * Converts a key binding to an array of key names.
     *
     * @param keyBind - The key binding to convert.
     * @returns An array of key names corresponding to the key binding.
     */
    public static normalizeKeyBind(keyBind: KeyBinder.KeyBind) {
        if (Array.isArray(keyBind)) {
            return keyBind
                .map(KeyBinder.normalizeKey)
                .sort((a, b) => a.localeCompare(b));
        }

        if (keyBind) return [KeyBinder.normalizeKey(keyBind)];

        return [];
    }

    /**
     * Gets the highest priority of the listener in the stack.
     *
     * NOTE: heavy operation, use it wisely.
     *
     * @param layerId - The id of the layer to get the highest listener priority from.
     * @returns {number | undefined} The highest priority of the listener in the given layer stack.
     */
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

    /**
     * Registers a listener with a specified id.
     *
     * @param id - The unique identifier for the listener.
     * @param listener - The listener metadata object containing the callback and other properties.
     */
    public static registerListener(
        id: KeyBinder.State.Listener.Id,
        listener: KeyBinder.State.Listener,
    ) {
        KeyBinder.state.listeners[id] = {
            layerId: listener.layerId ?? 'default',

            ...listener,
        };
    }

    /**
     * Removes a listener from the state by its unique id.
     *
     * @param id - The unique identifier for the listener.
     */
    public static unregisterListener(id: KeyBinder.State.Listener.Id) {
        delete KeyBinder.state.listeners[id];
    }

    /**
     * Registers a layer with a specified id.
     *
     * @param id - The unique identifier for the layer.
     * @param layer - The layer metadata object containing the priority and propagation properties
     */
    public static registerLayer(
        id: KeyBinder.State.Layer.Id,
        layer: KeyBinder.State.Layer,
    ) {
        KeyBinder.state.layers[id] = layer;
    }

    /**
     * Removes a layer from the state by its unique id.
     *
     * @param id - The unique identifier for the layer.
     */
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

        const found = layerIds.some((currentLayerId) => {
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
                return false;
            }

            return true;
        });

        if (found) return listenerId;

        return undefined;
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
    /**
     * Represents a type that corresponds to one of the modifier keys.
     */
    export type ModifierKey = (typeof modifierKeys)[number];

    /**
     * Represents a type that corresponds to one of the primary keys.
     * Primary keys are the keys that are not modifiers and can be used in key binding.
     */
    export type PrimaryKey = (typeof primaryKeys)[number];

    /**
     * Represents a type that corresponds to the keys of the `Key` object.
     * This type is used to define all valid key codes that can be used.
     */
    export type KeyCode = keyof typeof Key;

    /**
     * Represents a type that corresponds to the key codes that can be used in key binding as
     * modifier keys.
     */
    export type ModifierKeys = [
        Key.Control | Key.ControlLeft | Key.ControlRight,
        Key.Shift | Key.ShiftLeft | Key.ShiftRight,
        Key.Alt | Key.AltLeft | Key.AltRight,
    ];

    /**
     * A type representing a function that validates a keyboard event.
     *
     * @callback EventValidator
     * @param {KeyboardEvent} event - The keyboard event to validate.
     * @returns {boolean} - Returns `true` if the event is valid, otherwise `false`.
     */
    export type EventValidator = (event: KeyboardEvent) => boolean;

    /**
     * Represents a key binding that consists of a combination of modifier keys and a primary key.
     */
    export type KeyBind = [...KeyBind.Modifiers, KeyBind.PressKey];

    export namespace KeyBind {
        /**
         * Represents a type that corresponds to the modifier keys that can be used in key binding.
         */
        export type Modifiers = EnumValuesToValues<AnyOrderArray<ModifierKeys>>;

        /**
         * Represents a type that corresponds to the primary keys that can be used in key binding.
         */
        export type PressKey = EnumValueToValue<PrimaryKey>;
    }

    /**
     * Represents the state of the key binder.
     *
     * @interface State
     * @property {ModifierKey[]} modifierKeys - An array of modifier keys currently active.
     * @property {Record<State.Listener.Id, State.Listener>} listeners - A record of listeners
     * identified by their unique ids.
     * @property {Record<State.Layer.Id, State.Layer>} layers - A record of layers identified by
     * their unique ids.
     */
    export interface State {
        modifierKeys: ModifierKey[];
        listeners: Record<State.Listener.Id, State.Listener>;
        layers: Record<State.Layer.Id, State.Layer>;
    }

    export namespace State {
        /**
         * Represents a layer in the key binding system.
         *
         * @interface Layer
         * @property {number} priority - The priority of the layer. Higher numbers indicate higher
         * priority.
         * @property {boolean} propagate - Determines whether the key event should propagate to
         * lower priority layers.
         */
        export interface Layer {
            priority: number;

            propagate: boolean;
        }

        export namespace Layer {
            /**
             * Represents a unique identifier of the layer as a string.
             */
            export type Id = string;
        }

        /**
         * Represents a listener in the key binding system.
         *
         * @interface Listener
         *
         * @property {Layer.Id} layerId - Optional identifier for the layer
         * (default value: `default`).
         * @property {number} priority - The priority of the listener.
         * @property {KeyBind | null} bind - Optional key binding associated with the listener
         * (e.g. `['Control', 'KeyB']`).
         * @property {Handler<KeyboardEvent>} handler - Optional handler function for the keyboard
         * event. The handler is called when the key binding is pressed.
         * @property {Listener.Options} options - Optional additional options for the listener.
         */
        export interface Listener {
            layerId?: Layer.Id;

            priority: number;
            bind?: KeyBind | null;
            handler?: Handler<KeyboardEvent>;
            options?: Listener.Options;
        }

        export namespace Listener {
            /**
             * Represents a unique identifier of the listener as a string.
             */
            export type Id = string;

            /**
             * Options for configuring listener key binding behavior.
             *
             * @interface Options
             * @property {boolean} [preventDefault] - If `true`, the default action of the event
             * will be prevented.
             * @property {boolean} [stopPropagation] - If `true`, the event will not propagate
             * further.
             */
            export interface Options {
                preventDefault?: boolean;
                stopPropagation?: boolean;
            }
        }
    }
}

export default KeyBinder;
