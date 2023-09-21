import Storage from "../storage.js";

export default class RoomStorage extends Storage {
    static addRoom(name, owner, key) {
        let rooms = RoomStorage.getRooms();

        let maxVisitedAt = Date.now() / 1000 - 60 * 60 * 24;

        if (rooms[name]) {
            if (rooms[name].visitedAt < maxVisitedAt || rooms[name].key === key) {
                rooms[name] = RoomStorage.createRoom(name, owner, key);
            }
        } else {
            rooms[name] = RoomStorage.createRoom(name, owner, key);
        }

        RoomStorage.setRooms(rooms);

        RoomStorage.visitRoom(name);
    }

    static visitRoom(name) {
        let rooms = RoomStorage.getRooms();
        if (rooms[name]) {
            rooms[name].visitedAt = Date.now() / 1000;
            RoomStorage.setRooms(rooms);
        }
    }

    static getRoom(name) {
        return RoomStorage.getRooms()[name];
    }

    static getRooms() {
        return RoomStorage.get('rooms', {});
    }

    static setRooms(rooms) {
        RoomStorage.set('rooms', rooms);
    }

    static createRoom(name, owner, key) {
        return {
            name: name,
            owner: owner,
            key: key
        };
    }
};