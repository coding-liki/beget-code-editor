import EventHandlerStorage from "./srorages/eventHandlerStorage.js";

export default class EventDispatcher {
    static addListener(eventName, handler) {
        EventHandlerStorage.addEventHandler(eventName, handler);
    }

    static dispatch(eventName, eventData) {
        let handlers = EventHandlerStorage.getEventHandlers(eventName);
        handlers.forEach((handler) => {
            handler(eventData);
        });
    }
}