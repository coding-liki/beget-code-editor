import Storage from "../storage.js";
import ClientStorage from "../srorages/clientStorage.js";
import RoomStorage from "../srorages/roomStorage.js";
import EventHandlerStorage from "../srorages/eventHandlerStorage.js";
import EventDispatcher from "../EventDispatcher.js";

export default function (socket, io) {
    function checkRoomKey(message) {
        let rooms = Storage.get('rooms', {});


        let room = rooms[message.name];
        let nowMinusOneDay = Date.now() / 1000 - 60 * 60 * 24;

        return {
            checkResult: !room || (room.lastVisited ?? nowMinusOneDay - 1) < nowMinusOneDay || room.key === message.key
        }
    }

    return Object.freeze({
        hasRoom(message) {
            let room = Storage.get('rooms', {})[message.name] ?? undefined;
            let nowMinusOneDay = Date.now() / 1000 - 60 * 60 * 24;
            // return {data: "data"};

            return {
                hasRoom: !!room
            };
        },
        checkRoomKey: checkRoomKey,

        initialiseRoom: (message) => {
            if (checkRoomKey(message).checkResult) {
                let rooms = Storage.get('rooms', {});

                let room = rooms[message.name] ?? {};

                room.name = message.name;
                room.owner = message.owner;
                room.key = message.key;
                rooms[message.name] = room;

                Storage.set('rooms', rooms);

                return {created: true};
            }

            return {created: false};
        },
        registerClient(message) {
            let client = ClientStorage.getClient(message.uuid);
            let created = !client;

            if (!client) {
                ClientStorage.addClient(message.uuid, message.name, socket.id);
            }

            ClientStorage.setWsClientId(message.uuid, socket.id);

            return {
                created: created
            };

        },
        registerRoom(message) {
            let room = RoomStorage.getRoom(message.name);
            let client = ClientStorage.getClientByWsClientId(socket.id);

            if (!room) {
                RoomStorage.addRoom(message.name, client.uuid, message.key);
                room = RoomStorage.getRoom(message.name);
            }

            EventHandlerStorage.addClientEventHandler(client.uuid, 'changeLanguage', (eventData) => {
                if (eventData.roomName === room.name) {
                    socket.emit('changeLanguage', {
                        language: eventData.language,
                    });
                }
            })

            return {
                isOwner: room.owner === client.uuid
            };

        },
        changeLanguage(message) {
            EventDispatcher.dispatch('changeLanguage', {
                roomName: message.roomName,
                language: message.language
            });

            return {status: 'ok', language: message.language, rooms: Storage.get('rooms', {})};
        },
        visitRoom(message) {
            let rooms = Storage.get('rooms', {});
            let room = rooms[message.name];

            if (room) {
                room.lastVisited = Date.now() / 1000;

                rooms[message.name] = room;
                Storage.set('rooms', rooms);
            }

            return {visited: !!room}
        },
        disconnect(message) {
            let client = ClientStorage.getClientByWsClientId(socket.id);
            let clientHandlers = EventHandlerStorage.getClientEventHandlers(client.uuid, 'changeLanguage');
            clientHandlers.forEach((handler) => {
                EventHandlerStorage.removeClientEventHandler(client.uuid, 'changeLanguage', handler);
            })
        }
    })
}