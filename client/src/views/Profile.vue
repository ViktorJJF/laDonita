<template>
  <core-view-slot view-name="Perfil">
    <div class="row gutters">
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12">
        <div class="card">
          <div class="card-body">
            <div class="account-settings">
              <div class="user-profile">
                <div class="user-avatar">
                  <img :src="$store.getters.getBusinessImage" alt="La donita" />
                </div>
                <h5 class="user-name">
                  {{ $store.getters['authModule/user'] }}
                </h5>
                <h6 class="user-email">
                  {{ $store.state.authModule.user.email }}
                </h6>
              </div>
              <div class="setting-links">
                <a href="#">
                  <i class="icon-bell"></i>
                  Notifications
                </a>
                <a href="#">
                  <i class="icon-chat"></i>
                  Messages
                </a>
                <a href="#">
                  <i class="icon-date_range"></i>
                  Tasks
                </a>
                <a href="#">
                  <i class="icon-settings"></i>
                  Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-9">
        <div class="row gutters">
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Actualizar Perfil</div>
              </div>
              <div class="card-body">
                <div class="row gutters">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                      <label for="firstName">Nombres</label>
                      <input
                        v-model="user.first_name"
                        type="text"
                        class="form-control"
                        id="firstName"
                        placeholder="Ingresa tus nombres"
                      />
                    </div>
                    <div class="form-group">
                      <label for="lastname">Apellidos</label>
                      <input
                        v-model="user.last_name"
                        type="text"
                        class="form-control"
                        id="lastname"
                        placeholder="Ingresa tus apellidos"
                      />
                    </div>
                    <!-- <div class="form-group">
                  <label for="eMail">Correo</label>
                  <input
                    type="email"
                    class="form-control"
                    id="eMail"
                    placeholder="Enter email ID"
                  />
                </div> -->
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                      <label for="phone">Teléfonos</label>
                      <input
                        v-model="user.phone"
                        type="text"
                        class="form-control"
                        id="phone"
                        placeholder="Ingresa tu teléfono"
                      />
                    </div>
                    <div class="form-group">
                      <label for="addRess">Ciudad</label>
                      <input
                        v-model="user.city"
                        type="text"
                        class="form-control"
                        id="addRess"
                        placeholder="Ingresa tu ciudad"
                      />
                    </div>
                  </div>
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div class="text-right">
                      <button
                        type="button"
                        id="submit2"
                        name="submit2"
                        class="btn btn-primary"
                        @click="updateUser"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Actualizar Perfil</div>
              </div>
              <div class="card-body">
                <VTextFieldWithValidation
                  label="Nombre"
                  type="text"
                  placeholder="Ingresa una nueva contraseña"
                  v-model="newPassword"
                  :value="newPassword"
                  @keyup.enter="updatePassword"
                  :errors="v$.newPassword.$errors"
                />
                <div class="text-right">
                  <button
                    type="button"
                    id="submit2"
                    name="submit2"
                    class="btn btn-primary"
                    @click="updatePassword"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
import vuelidate from '@/plugins/vuelidate';
import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation.vue';

export default {
  components: {
    CoreViewSlot,
    VTextFieldWithValidation,
  },
  setup() {
    return { v$: vuelidate.useVuelidate() };
  },
  data() {
    return {
      newPassword: '',
      user: {},
    };
  },
  validations() {
    return {
      newPassword: { required: vuelidate.required },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.initialData();
  },
  methods: {
    async initialData() {
      this.user = await this.$store.dispatch(
        'usersModule/listOne',
        this.$store.state.authModule.user.id,
      );
      console.log('🚀 Aqui *** -> this.user', this.user);
    },
    updateUser() {
      this.$store.dispatch('usersModule/update', {
        id: this.user.id,
        data: this.user,
      });
    },
    updatePassword() {
      this.$store.dispatch('authModule/updatePassword', this.newPassword);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
