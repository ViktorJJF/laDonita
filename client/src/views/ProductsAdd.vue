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
                  v-show="
                    editedItem.img.length > 0 &&
                    editMode == false &&
                    this.editedId
                  "
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
                  v-show="
                    editedItem.img.length == 0 ||
                    editMode == true ||
                    !this.editedId
                  "
                >
                  <UploadImages
                    :key="resetImage"
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
              <div class="col-sm-6 col-12">
                <label for="marca">Marca</label>
                <div class="form-group">
                  <select
                    id="marca"
                    required
                    placeholder="Selecciona una marca"
                    v-model="editedItem.brandId"
                    class="form-control"
                  >
                    <option :value="0" disabled selected>
                      Selecciona una opción
                    </option>
                    <option
                      :value="brand.id"
                      v-for="brand in brands"
                      :key="brand.id"
                    >
                      {{ brand.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-sm-3 col-12">
                <VTextFieldWithValidation
                  label="Stock mínimo"
                  type="number"
                  placeholder="Ingresa una cantidad"
                  v-model="editedItem.minStock"
                  :value="editedItem.minStock"
                  @keyup.enter="save"
                />
              </div>
              <div class="col-sm-3 col-12">
                <VTextFieldWithValidation
                  label="Stock"
                  type="number"
                  placeholder="Ingresa una cantidad"
                  v-model="editedItem.stock"
                  :value="editedItem.stock"
                  @keyup.enter="save"
                />
              </div>
              <div class="col-sm-4 col-12">
                <VTextFieldWithValidation
                  label="Precio de compra"
                  type="number"
                  placeholder="Ingresa un precio de compar"
                  v-model="editedItem.purchasePrice"
                  :value="editedItem.purchasePrice"
                  @keyup.enter="save"
                />
              </div>
              <div class="col-sm-4 col-12">
                <VTextFieldWithValidation
                  label="Precio de venta"
                  type="number"
                  placeholder="Ingresa un precio"
                  v-model="editedItem.price"
                  :value="editedItem.price"
                  @keyup.enter="save"
                />
              </div>
              <div class="col-sm-4 col-12">
                <div class="form-group">
                  <label>Fecha de expiración</label>
                  <v-date-picker v-model="editedItem.expiration">
                    <template v-slot="{ inputValue, inputEvents }">
                      <input
                        class="form-control bg-white border px-2 py-1 rounded"
                        :value="inputValue"
                        v-on="inputEvents"
                      />
                    </template>
                  </v-date-picker>
                </div>
              </div>
              <div class="col-sm-12 col-12">
                <div class="form-group">
                  <label for="descripcion">Marca</label>
                  <textarea
                    v-model="editedItem.description"
                    class="form-control"
                    id="descripcion"
                    placeholder="Descripción"
                    maxlength="140"
                    rows="4"
                  ></textarea>
                  <div class="form-text text-muted"></div>
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

const ENTITY = 'products';
import vuelidate from '@/plugins/vuelidate';
import MODEL_ITEM from '@/models/products';
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
      resetImage: 0,
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
        ? 'Formulario actualizar producto'
        : 'Formulario crear producto';
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
      this.file = null;
      this.resetImage += 1;
      this.v$.$reset();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
