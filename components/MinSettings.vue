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

  export default {
      methods: {
          async submit (event) {
              const { valid } = await this.$refs.form.validate()
              const router = useRouter();
              if(valid){
                  nuxtStorage.localStorage.setData('userName', this.name, 1, 'd');
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

