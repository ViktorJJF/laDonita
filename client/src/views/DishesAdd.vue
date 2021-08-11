<template>
  <core-view-slot :view-name="formTitle">
    <div class="row gutters">
      <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12">
        <div class="card">
          <div class="card-body">
            <div class="doctor-profile">
              <div class="input-group mb-3">
                <div
                  class="text-center"
                  v-show="editedItem.img.length > 0 && editMode == false"
                >
                  <img
                    :src="editedItem.img"
                    class="img-fluid mb-2"
                    alt="Responsive image"
                  />
                  <button class="btn btn-info" @click="editMode = true">
                    Editar
                  </button>
                </div>

                <div
                  class="text-center"
                  v-show="editedItem.img.length == 0 || editMode == true"
                >
                  <UploadImages
                    value="/uploads/grodnobot.png"
                    ref="file"
                    @change="handleImages"
                    :max="1"
                    uploadMsg="Click para insertar o arrastrar una imagen"
                    fileError="Solo se aceptan archivos imágenes"
                    clearAll="Borrar todo"
                    class="mb-2"
                  />
                  <button
                    v-show="editedId"
                    class="btn btn-danger"
                    @click="
                      editMode = false;
                      file = null;
                    "
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-9">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Ingresa detalles</div>
          </div>
          <div class="card-body">
            <div class="row gutters">
              <div class="col-sm-8 col-12">
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
              <div class="col-sm-4 col-12">
                <VTextFieldWithValidation
                  label="Precio"
                  type="number"
                  placeholder="Ingresa un precio"
                  v-model="editedItem.price"
                  :value="editedItem.price"
                  @keyup.enter="save"
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
import UploadImages from 'vue-upload-drop-images';
import axios from 'axios';

const ENTITY = 'dishes';
import vuelidate from '@/plugins/vuelidate';
import MODEL_ITEM from '@/models/dishes';
import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation.vue';

export default {
  components: {
    CoreViewSlot,
    VTextFieldWithValidation,
    UploadImages,
  },
  setup() {
    return { v$: vuelidate.useVuelidate() };
  },
  data() {
    return {
      editMode: false,
      editedItem: MODEL_ITEM(),
      defaultItem: MODEL_ITEM(),
      loadingButton: false,
      brands: [],
      file: null,
      imageName: '',
      imageUrl: '',
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
    formTitle() {
      return this.editedId
        ? 'Formulario actualizar plato'
        : 'Formulario crear plato';
    },
  },
  watch: {
    editedId(newValue) {
      if (!newValue) this.editedItem = this.$deepCopy(this.defaultItem);
    },
  },
  mounted() {
    if (this.editedId) this.initialize();
    this.brands = this.$store.state.brandsModule.brands;
  },
  methods: {
    async initialize() {
      this.editedItem = await this.$store.dispatch(
        ENTITY + 'Module/listOne',
        this.editedId,
      );
    },
    handleImages() {
      // this.editedItem.img = files;
      [this.file] = this.$refs.file.files;
    },
    async save() {
      this.v$.$validate(); // checks all inputs
      if (!this.v$.$error) {
        this.loadingButton = true;
        if (this.editedId) {
          // update item
          try {
            if (this.file) {
              this.editedItem.img = await this.storeImage();
            }
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
            // reasignando path
            if (this.file) {
              this.editedItem.img = await this.storeImage();
            }
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
    async storeImage() {
      let formData = new FormData();
      formData.append('img', this.file);
      let path = (
        await axios.post('/api/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data.payload;
      return path;
    },
    clear() {
      this.editedItem = { ...this.defaultItem };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
