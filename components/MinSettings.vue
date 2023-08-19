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

  export default {
      methods: {
          async submit (event) {
              const { valid } = await this.$refs.form.validate()
              const router = useRouter();
              if(valid){
                  await router.push("/editor-"+this.roomName+"/"+this.name);
              }
          },
      },
      data: () => ({
          roomName: '',
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
      }),
  }
</script>

