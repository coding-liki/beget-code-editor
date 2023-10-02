<template>
    <Editor
        v-if="nuxtStorage.localStorage?.getData('userName')"
        :room-name=$route.params.name
        :name="nuxtStorage.localStorage?.getData('userName')"
        :user-color="nuxtStorage.localStorage?.getData('userColor')"
        :user-light-color="nuxtStorage.localStorage?.getData('userLightColor')"
        :websocket-server=runtimeConfig.public.websocketHost
        :editor-websocket-server=runtimeConfig.public.editorWebsocketHost>
    </Editor>
</template>

<script setup lang="ts">
import nuxtStorage from 'nuxt-storage';

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

if (!nuxtStorage.localStorage?.getData('userName')) {
    router.push("/?roomName=" + route.params.name);

}

</script>