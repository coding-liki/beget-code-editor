<template>
    <v-sheet width="300" class="mx-auto">
    <v-form  @submit.prevent="submit" ref="form">
      <v-text-field
        v-model="roomName"
        :rules="roomNameRules"
        label="Комната"
      ></v-text-field>
      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="Имя"
      ></v-text-field>
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import nuxtStorage from 'nuxt-storage';

    const usercolors = [
        { color: '#30bced', light: '#30bced33' },
        { color: '#6eeb83', light: '#6eeb8333' },
        { color: '#ffbc42', light: '#ffbc4233' },
        { color: '#ecd444', light: '#ecd44433' },
        { color: '#ee6352', light: '#ee635233' },
        { color: '#9ac2c9', light: '#9ac2c933' },
        { color: '#8acb88', light: '#8acb8833' },
        { color: '#1be7ff', light: '#1be7ff33' },
        { color: '#EC2A44', light: '#EC2A4433' },
        { color: '#0080F0', light: '#0080F033' },
        { color: '#28EFB6', light: '#28EFB633' },
        { color: '#EFD100', light: '#EFD10033' },
        ];

  export default {
      methods: {
          async submit (event) {
              const { valid } = await this.$refs.form.validate()
              const router = useRouter();
              if(valid){
                  nuxtStorage.localStorage.setData('userName', this.name, 1, 'd');
                  let randomNumber = Math.floor(Math.random()*usercolors.length);

                  let colors = usercolors[randomNumber];
                  nuxtStorage.localStorage.setData('userColor', colors.color, 1, 'd');
                  nuxtStorage.localStorage.setData('userLightColor', colors.light, 1, 'd');

                  await router.push("/editor/"+this.roomName);
              }
          },
      },
      data: () => {
          const route = useRoute()

          return ({
              roomName: route.query.roomName ?? '',
              roomNameRules: [
                  value => {
                      if (value) return true

                      return  'Укажите комнату';
                  },
                  ],

              name: '',
              nameRules: [
                  value => {
                      if (value) return true

                      return  'Укажите имя';
                  },
                  ],
          })
      },
  }
</script>

