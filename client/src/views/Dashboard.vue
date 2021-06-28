<template>
  <core-view-slot view-name="Inicio">
    <div class="row gutters">
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div
          @click="$router.push({ name: 'PurchasesAdd' })"
          class="hospital-tiles red"
        >
          <!-- <img width="100" src="/images/compras2.svg" alt="Appointments" /> -->
          <p class="custom-title">Compras</p>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div
          @click="$router.push({ name: 'SalesAdd' })"
          class="hospital-tiles secondary"
        >
          <!-- <img width="100" src="/images/ventas.png" alt="Appointments" /> -->
          <p class="custom-title">Ventas</p>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div
          @click="$router.push({ name: 'ProductsList' })"
          class="hospital-tiles primary card"
        >
          <!-- <img width="100" src="/images/drink.svg" alt="Appointments" /> -->
          <p class="custom-title">Productos</p>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div
          @click="$router.push({ name: 'BrandsList' })"
          class="hospital-tiles blue"
        >
          <p class="custom-title">Marcas</p>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div
          @click="$router.push({ name: 'SuppliersList' })"
          class="hospital-tiles yellow"
        >
          <p class="custom-title">Insumos</p>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
        <div
          @click="$router.push({ name: 'ProvidersList' })"
          class="hospital-tiles blue"
        >
          <p class="custom-title">Proveedores</p>
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

export default {
  components: {
    CoreViewSlot,
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
          } finally {
            this.loadingButton = false;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
