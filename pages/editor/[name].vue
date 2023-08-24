<template>
    <Editor
        v-if="nuxtStorage.localStorage!.getData('userName')"
        :room-name=$route.params.name
        :name="nuxtStorage.localStorage!.getData('userName')"
        :websocket-server=runtimeConfig.public.websocketHost>
    </Editor>
</template>

<script setup lang="ts">
    import nuxtStorage from 'nuxt-storage';

    const runtimeConfig = useRuntimeConfig();
    const router = useRouter();
    const route = useRoute();

    if(!nuxtStorage.localStorage!.getData('userName')){
        router.push("/?roomName="+route.params.name);
        
    }

</script>