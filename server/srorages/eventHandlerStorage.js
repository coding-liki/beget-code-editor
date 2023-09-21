import Storage from "../storage.js";

export default class EventHandlerStorage extends Storage {
    static addEventHandler(eventName, handler) {
        let handlers = EventHandlerStorage.get(eventName, []);

        handlers.push(handler);

        EventHandlerStorage.set(eventName, handlers);
    }

    static addClientEventHandler(clientUuid, eventName, handler) {
        let handlers = EventHandlerStorage.get('clientHandlers', {});

        handlers[clientUuid] = handlers[clientUuid] ?? {};
        handlers[clientUuid][eventName] = handlers[clientUuid][eventName] ?? [];

        handlers[clientUuid][eventName].push(handler);

        EventHandlerStorage.set('clientHandlers', handlers);
        EventHandlerStorage.addEventHandler(eventName, handler);
    }


    static removeClientEventHandler(clientUuid, eventName, handler) {
        let handlers = EventHandlerStorage.get('clientHandlers', {});

        handlers[clientUuid] = handlers[clientUuid] ?? {};
        handlers[clientUuid][eventName] = handlers[clientUuid][eventName] ?? [];
        handlers[clientUuid][eventName] = handlers[clientUuid][eventName].filter((eventHandler) => eventHandler !== handler);

        EventHandlerStorage.set('clientHandlers', handlers);
        EventHandlerStorage.removeEventHandler(eventName, handler);

    }

    static getClientEventHandlers(clientUuid, eventName) {
        return (EventHandlerStorage.get('clientHandlers', {})[clientUuid] ?? {})[eventName] ?? [];
    }

    static removeEventHandler(eventName, handler) {
        let handlers = EventHandlerStorage.get(eventName, []);

        handlers = handlers.filter((eventHandler) => eventHandler !== handler);

        EventHandlerStorage.set(eventName, handlers);
    }

    static getEventHandlers(eventName) {
        return EventHandlerStorage.get(eventName, []);
    }
}