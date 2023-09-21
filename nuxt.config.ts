// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {public: {websocketHost: "ws://localhost:1234/"}},
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
            url: 'http://localhost:3000'
        }]
    }
})
