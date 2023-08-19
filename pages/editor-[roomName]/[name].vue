<template>
    <Editor :room-name=$route.params.roomName :name=$route.params.name :websocket-server=appConfig.websocketServer>
    
    </Editor>
</template>

<script setup lang="ts">
    const appConfig = useAppConfig()

</script>