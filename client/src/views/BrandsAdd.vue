<template>
  <core-view-slot view-name="Formulario Marcas">
    <div class="row gutters">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Ingresa detalles</div>
          </div>
          <div class="card-body">
            <div class="row gutters">
              <div class="col-sm-12 col-12">
                <VTextFieldWithValidation
                  label="Nombre"
                  type="text"
                  placeholder="Ingresa un Nombre"
                  v-model="editedItem.name"
                  :value="editedItem.name"
                  @keyup.enter="save"
                  :errors="v$.editedItem.name.$errors"
                />
              </div>
              <div class="col-sm-12 col-12">
                <div class="form-group">
                  <label for="biO">Descripción</label>
                  <textarea
                    class="form-control"
                    id="biO"
                    rows="3"
                    placeholder="Ingresa una Descripción"
                    v-model="editedItem.description"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between mx-3 mb-3">
            <button class="btn btn-info" @click="$router.go(-1)">
              Regresar
            </button>
            <button class="btn btn-primary" @click="save">
              {{ submitText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
const ENTITY = 'brands';
import vuelidate from '@/plugins/vuelidate';
import MODEL_ITEM from '@/models/brands';
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
      editedItem: MODEL_ITEM(),
      defaultItem: MODEL_ITEM(),
      loadingButton: false,
    };
  },
  validations() {
    return {
      editedItem: {
        name: { required: vuelidate.required },
      },
    };
  },
  computed: {
    editedId() {
      return this.$route.params.id;
    },
    submitText() {
      return this.editedId ? 'Actualizar' : 'Crear';
    },
  },
  watch: {
    editedId(newValue) {
      if (!newValue) this.editedItem = this.$deepCopy(this.defaultItem);
    },
  },
  mounted() {
    if (this.editedId) this.initialize();
  },
  methods: {
    async initialize() {
      this.editedItem = await this.$store.dispatch(
        ENTITY + 'Module/listOne',
        this.editedId,
      );
    },
    async save() {
      this.v$.$validate(); // checks all inputs
      if (!this.v$.$error) {
        this.loadingButton = true;
        if (this.editedId) {
          // update item
          try {
            await this.$store.dispatch(ENTITY + 'Module/update', {
              id: this.editedId,
              data: this.editedItem,
            });
          } finally {
            this.loadingButton = false;
          }
        } else {
          // create item
          try {
            await this.$store.dispatch(
              ENTITY + 'Module/create',
              this.editedItem,
            );
            this.clear();
          } finally {
            this.loadingButton = false;
          }
        }
      }
    },
    clear() {
      this.editedItem = { ...this.defaultItem };
      this.v$.$reset();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
