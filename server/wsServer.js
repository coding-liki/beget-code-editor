import Storage from "./storage.js";
import { WebSocketServer } from 'ws';
import ClientStorage from "./srorages/clientStorage.js";
import RoomStorage from "./srorages/roomStorage.js";
import EventHandlerStorage from "./srorages/eventHandlerStorage.js";
import EventDispatcher from "./EventDispatcher.js";

const wss = new WebSocketServer({ port: 4000 });
wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.on('connection', function connection(ws) {
    let server = new Server(ws);
    ws.id = wss.getUniqueID();
    
    ws.on('message', function message(data) {
        console.log('received: %s', data);
        server.process(data);
    });

    ws.send("connected");
});

class Server {
    ws = undefined;
    
    constructor(ws) {
        this.ws = ws;
    }
    send = (method, data) => {
        this.ws.send(JSON.stringify({method: method, data: data}));
    }
    process = (message) => {
        let request = {};
        
        try {
            request = JSON.parse(message);
        } catch (e) {
            console.log(e);
            return;
        }
        let methodTomethodMap = {
            'registerClient': this.registerClient,
            'registerRoom': this.registerRoom,
            'changeLanguage': this.changeLanguage,
        } 
        
        let methodToRun = methodTomethodMap[request.method];
        if(methodToRun){
            methodToRun(request.data);
        }
    }
    registerClient = (message) => {
        let client = ClientStorage.getClient(message.uuid);
        let created = !client;

        if (!client) {
            ClientStorage.addClient(message.uuid, message.name, this.ws.id);
        }

        console.log(this.ws);
        
        ClientStorage.setWsClientId(message.uuid, this.ws.id);

        return {
            created: created
        };

    }
    
    registerRoom = (message) => {
        let room = RoomStorage.getRoom(message.name);
        let client = ClientStorage.getClientByWsClientId(this.ws.id);

        if (!room) {
            RoomStorage.addRoom(message.name, client.uuid, message.key);
            room = RoomStorage.getRoom(message.name);
        }

        EventHandlerStorage.addClientEventHandler(client.uuid, 'changeLanguage', (eventData) => {
            if (eventData.roomName === room.name) {
                this.send('changeLanguage', {
                    language: eventData.language,
                });
            }
        })

        return {
            isOwner: room.owner === client.uuid
        };

    }
    changeLanguage = (message) => {
        EventDispatcher.dispatch('changeLanguage', {
            roomName: message.roomName,
            language: message.language
        });

        return {status: 'ok', language: message.language, rooms: Storage.get('rooms', {})};
        }
    visitRoom = (message) => {
        let rooms = Storage.get('rooms', {});
        let room = rooms[message.name];

        if (room) {
            room.lastVisited = Date.now() / 1000;

            rooms[message.name] = room;
            Storage.set('rooms', rooms);
        }

        return {visited: !!room}
    }
    disconnect(message) {
        let client = ClientStorage.getClientByWsClientId(this.ws.id);
        let clientHandlers = EventHandlerStorage.getClientEventHandlers(client.uuid, 'changeLanguage');
        clientHandlers.forEach((handler) => {
            EventHandlerStorage.removeClientEventHandler(client.uuid, 'changeLanguage', handler);
        })
    }
}