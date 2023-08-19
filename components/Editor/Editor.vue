<template>
  <div :id="id" class="code-editor" ref="editorDiv">
  </div>
</template>

<script setup lang="ts">
import {EditorState, Transaction} from "@codemirror/state";
import {basicSetup} from "codemirror";
import {php} from "@codemirror/lang-php";
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
onMounted(() => {
  
  const ydoc = new Y.Doc()
  const ctx = useNuxtApp();
  
  const provider = new WebsocketProvider(props.websocketServer,props.roomName, ydoc);
  
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
      php(),
      javascript(),
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
//    dispatch: (transaction: Transaction, view: EditorView): void => {
//      console.log(transaction);
//      socket?.emit('addTransaction', {transaction: transaction}, (response) => {
//        let newTransaction = new Transaction();
//        
//        console.log(response)
//        response.transaction.startState = transaction.startState;
//        view.update([response.transaction]);
//      });
//  
////      let previousState = transaction.startState;
////      setTimeout(() => {
////        view.setState(previousState);
////        transaction.startState = view.state
////      }, 1000)
//    }
  });
});



</script>