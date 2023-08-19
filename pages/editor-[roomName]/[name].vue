<template>
    <Editor :room-name=$route.params.roomName :name=$route.params.name :websocket-server=runtimeConfig.public.websocketHost>
    
    </Editor>
</template>

<script setup lang="ts">
    const runtimeConfig = useRuntimeConfig()

</script>