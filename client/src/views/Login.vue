<template>
  <!-- Container start -->
  <div class="container middle">
    <div class="row justify-content-md-center">
      <div class="col-xl-4 col-lg-5 col-md-6 col-sm-12">
        <div class="login-screen">
          <div class="login-box">
            <a href="#" class="login-logo"> La Doñita </a>
            <h5>Bienvenido de nuevo,<br />Por favor, ingresa a tu cuenta.</h5>
            <VTextFieldWithValidation
              type="text"
              placeholder="Correo"
              v-model="user.email"
              :value="user.email"
              @keyup.enter="login"
              :errors="v$.user.email.$errors"
            />
            <VTextFieldWithValidation
              type="password"
              placeholder="Contraseña"
              v-model="user.password"
              :value="user.password"
              @keyup.enter="login"
              :errors="v$.user.password.$errors"
            />
            <div class="actions">
              <!-- <a href="forgot-pwd.html">Recover password</a> -->
              <button @click="login" class="btn btn-info">
                Iniciar Sesión
              </button>
            </div>
            <hr />
            <!-- <div class="m-0">
                <span class="additional-link"
                  >No account?
                  <a href="signup.html" class="btn btn-secondary"
                    >Signup</a
                  ></span
                >
              </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Container end -->
</template>

<script>
import vuelidate from '@/plugins/vuelidate';
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation.vue';

export default {
  components: {
    VTextFieldWithValidation,
  },
  data() {
    return {
      user: { email: '', password: '' },
    };
  },
  setup() {
    return { v$: vuelidate.useVuelidate() };
  },
  validations() {
    return {
      user: {
        email: { required: vuelidate.required },
        password: { required: vuelidate.required },
      },
    };
  },
  methods: {
    login() {
      this.v$.$validate(); // checks all inputs
      if (!this.v$.$error) {
        this.$store
          .dispatch('authModule/login', this.user)
          .then(() => {
            this.$router.push({ name: 'dashboard' });
          })
          .catch((error) => {
            console.log('error en login: ', error);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// .middle {
//   display: flex;
//   align-items: center;
// }
</style>
