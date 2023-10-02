// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            websocketHost: "ws://localhost:1234/",
            editorWebsocketHost: "http://localhost:4000"
        }
    },
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@invictus.codes/nuxt-vuetify',
        'nuxt-socket-io',
    ]
    ,
    io: {
        // module options
        sockets: [{
            name: 'main',
            url: process.env.NUXT_PUBLIC_EDITOR_WEBSOCKET_HOST
        }]
    }
})
