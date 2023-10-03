<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex flex-row h-[70px] w-full flex-none">
            <div class="flex flex-row flex-auto flex-wrap max-w-3/4 content-center">
                <div class="w-1/6 text-center place-self-center">Комната {{ roomName }}</div>
                <div class="w-5/6 flex flex-row content-center">
                    <form class="my-3 flex flex-row content-center">
                        <select v-model="selectedLanguage" @change="onSelect($event)" class="mr-1">
                            <option v-for="language in languages" :selected="language.value == selectedLanguage"
                                    v-bind:value="language.value">{{ language.name }}
                            </option>
                        </select>

                        <select v-model="selectedFontSize">
                            <option v-for="fontSize in fontSizeList" :selected="fontSize == selectedFontSize"
                                    v-bind:value="fontSize">{{ fontSize }}
                            </option>
                        </select>
                    </form>
                </div>
            </div>
            <div class="flex flex-row flex-auto min-w-1/4 flex-wrap content-center">
                <div v-for="client in clients" class="flex-auto flex flex-row">
                    <div class="inline-block w-2.5	 h-2.5 place-self-center rounded border-2 border-black "
                         :style="{backgroundColor: client.user.color}"></div>
                    <div>{{ client.user.name }}</div>
                </div>
            </div>
        </div>
        <div :id="id" class="flex-auto overflow-auto max-h-[calc(100%-70px)]" :style="{
            fontSize: selectedFontSize
        }" ref="editorDiv">
        </div>
    </div>
</template>

<script setup lang="ts">
import {EditorState, Compartment} from "@codemirror/state";
import {basicSetup} from "codemirror";
import {php} from "@codemirror/lang-php";
import {cpp} from "@codemirror/lang-cpp";
import {javascript} from "@codemirror/lang-javascript";
import * as Y from 'yjs'
import {yCollab} from 'y-codemirror.next'

import {EditorView, keymap} from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands";
import {ref} from "vue";
import {NuxtSocket} from "nuxt-socket-io";
import {WebsocketProvider} from "y-websocket";
import {autocompletion} from "@codemirror/autocomplete";
import {LanguageSupport} from "@codemirror/language";
import {uuidv4} from "lib0/random";
import nuxtStorage from 'nuxt-storage';


const props = defineProps<{
    id?: string,
    roomName: string,
    name: string,
    userColor: string,
    userLightColor: string,
    websocketServer: string,
    editorWebsocketServer: string
}>();

let editorDiv = ref(undefined)
let socket: NuxtSocket | undefined = undefined;
let clients = ref([]);
let languages = [
    {'value': 'plain', 'name': 'Plain Text'},
    {'value': 'php', 'name': 'PHP'},
    {'value': 'js', 'name': 'JavaScript'},
    {'value': 'mermaid', 'name': 'Mermaid'},
];

let fontSizeList = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '22px',
    '24px',
];

let selectedFontSize = ref('14px');

let selectedLanguage = ref('plain');

let language = new Compartment();
let view: EditorView | undefined = undefined;

let initialised = false;
const ws = new WebSocket(props.editorWebsocketServer)

class Server {
    private ws: WebSocket;

    constructor(ws) {
        this.ws = ws;
    }

    send(method, data) {
        if (this.ws.readyState !== this.ws.OPEN) {
            setTimeout(() => this.send(method, data), 10);
            return;
        }
        this.ws.send(JSON.stringify({method: method, data: data}));
    }

    process(message) {
        let request = {};

        try {
            request = JSON.parse(message);
        } catch (e) {
            console.log(e);
            return;
        }
        let methodTomethodMap = {
            'changeLanguage': this.changeLanguage,
        }

        let methodToRun = methodTomethodMap[request.method];
        if (methodToRun) {
            methodToRun(request.data);
        }
    }

    changeLanguage = (data) => {
        changeLanguage(data.language);
    }

}

let wsServer = new Server(ws);


onMounted(() => {

    const ydoc = new Y.Doc()
    const ctx = useNuxtApp();

    const provider = new WebsocketProvider(props.websocketServer, props.roomName, ydoc);
    provider.awareness.on('update', event => {
        clients.value = Array.from(provider.awareness.getStates().values());
    });


    const yText = ydoc.getText('codemirror')
    const undoManager = new Y.UndoManager(yText)

    provider.awareness.setLocalStateField('user', {
        name: props.name,
        color: props.userColor,
        colorLight: props.userLightColor
    })


    let startState = EditorState.create({
        doc: yText.toString(),
        extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            language.of([]),
            yCollab(yText, provider.awareness, {undoManager}),
            autocompletion({
                override: []
            })
        ]
    })

    ws.onopen = () => {
        console.log('ws opened on browser')
    }

    ws.onmessage = (message) => {
        wsServer.process(message.data);
    }

    view = new EditorView({
        state: startState,
        parent: editorDiv.value,
    });

    setInterval(async () => {
        wsServer.send('visitRoom', {
            name: props.roomName
        });
    }, 1000);
});

onUpdated(() => {
    async function initialise() {
        if (initialised) {
            return;
        }

        initialised = true;

        let clientList = nuxtStorage.localStorage.getData('clientList') ?? {};

        clientList[props.name] = clientList[props.name] ?? {};
        clientList[props.name].uuid = clientList[props.name].uuid ?? uuidv4();
        nuxtStorage.localStorage.setData('clientList', clientList, 24, 'h')

        try {
            wsServer.send('registerClient', {
                name: props.name,
                uuid: clientList[props.name].uuid
            });
        } catch (e) {
            console.log("error while registering client", e);
        }

        try {
            let roomKeys = nuxtStorage.localStorage.getData('roomKeys') ?? {};
            roomKeys[props.roomName] = roomKeys[props.roomName] ?? uuidv4();

            wsServer.send('registerRoom', {
                name: props.roomName,
                key: roomKeys[props.roomName]
            });

            nuxtStorage.localStorage.setData('roomKeys', roomKeys);
        } catch (e) {
            console.log("error while registering room", e);
        }
    }

    initialise();
});

function changeLanguage(languageName: string) {
    if (view) {
        let languageExtension: { [key: string]: LanguageSupport } = {
            'php': php({plain: true}),
            'js': javascript()
        }
        view.dispatch({
            effects: language.reconfigure(languageExtension[languageName] ?? [])
        });
        selectedLanguage.value = languageName;
    }
}

function onSelect(event: Event) {
    wsServer.send('changeLanguage', {language: event.target?.value, roomName: props.roomName});
}

</script>

<style>
.ͼ1 .cm-ySelectionInfo {
    opacity: 0.8;
}

.cm-editor > .cm-scroller {
    padding-top: 10px;
}
</style>