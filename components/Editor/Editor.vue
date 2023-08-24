<template>
  <div class="flex flex-col h-full w-full">
      <div class="flex flex-row h-[70px] w-full flex-none">
        <div class="flex-auto max-w-3/4">Комната - {{roomName}}</div>
        <div class="flex flex-row flex-auto min-w-1/4 flex-wrap content-center">
            <div v-for="client in clients" class="flex-auto flex flex-row"><div class="inline-block w-2 h-2" :style="{backgroundColor: client.user.color}" > </div>{{client.user.name}}</div>
        </div>
      </div>
    <div :id="id" class="flex-auto overflow-auto max-h-[calc(100%-70px)]" ref="editorDiv">
    </div>
  </div>

</template>

<script setup lang="ts">
import {EditorState, Transaction} from "@codemirror/state";
import {basicSetup} from "codemirror";
import {php} from "@codemirror/lang-php";
import {cpp} from "@codemirror/lang-cpp";
import {javascript} from "@codemirror/lang-javascript";
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'

import {EditorView, keymap} from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands";
import {ref} from "vue";
import {NuxtSocket} from "nuxt-socket-io";
import {WebsocketProvider} from "y-websocket";

const props = defineProps<{
  id?: string,
  roomName: string,
  name: string,
  websocketServer: string
}>();

let editorDiv = ref(null)
let socket: NuxtSocket|undefined = undefined;
let clients = ref([]);
onMounted(() => {
  
  const ydoc = new Y.Doc()
  const ctx = useNuxtApp();
  
  const provider = new WebsocketProvider(props.websocketServer,props.roomName, ydoc);
  provider.awareness.on('update', event => {
    clients.value = Array.from(provider.awareness.getStates().values());
    console.log(clients.value);

  });
  const yText = ydoc.getText('codemirror')
  const undoManager = new Y.UndoManager(yText)
  
  provider.awareness.setLocalStateField('user', {
    name: props.name,
    color: '#ecd444',
    colorLight: '#ecd44433'
  })
  let startState = EditorState.create({
    doc: yText.toString(),
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      php({plain: true}),
      cpp(),
      yCollab(yText, provider.awareness, { undoManager })
    ]
  })
//  socket = ctx.$nuxtSocket({
//    name: "editor",
//    channel: "/editor",
//  });
//  socket
//    .on('someEvent', (msg, cb) => {
//      console.log("get some event");
//    });
  
  let view = new EditorView({
    state: startState,
    parent: editorDiv.value,
  });
});



</script>