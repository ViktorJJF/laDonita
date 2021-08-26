<template>
  <div class="row gutters">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
      <simple-table
        :items-per-page-custom="productsToShow || null"
        :headers="headers"
        :items="items"
        date-to-filter="fechaFin"
        :filterBox="true"
        :filterDate="false"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ $filters.formatDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.stock`]="{ item }">
          {{ item.stock }}
          <el-tooltip
            v-if="item.stock < item.minStock"
            content="Por debajo de stock mínimo"
            placement="top"
          >
            <i
              class="icon-warning1 text-danger fa-sm"
              style="font-size: 1.3em"
            ></i>
          </el-tooltip>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-items-center">
            <img
              v-show="item.img"
              :src="item.img"
              alt="image"
              width="90"
              class="img-fluid rounded avatar-50 mr-3"
            />
            <div>
              {{ item.name }}
            </div>
          </div>
        </template>
        <template v-slot:[`item.purchasePrice`]="{ item }">
          S/. {{ item.purchasePrice }}
        </template>
        <template v-slot:[`item.price`]="{ item }">
          S/. {{ item.price }}
        </template>
        <template v-slot:[`item.brandId`]="{ item }">
          {{
            $store.state.brandsModule.brands.find(
              (brand) => brand.id === item.brandId,
            )
              ? $store.state.brandsModule.brands.find(
                  (brand) => brand.id === item.brandId,
                ).name
              : 'Sin marca'
          }}
        </template>
        <template v-slot:[`item.qty`]="{ item }">
          <VTextFieldWithValidation
            type="number"
            v-model="item.qty"
            :errors="item.errors"
            :placeholder="isPurchase ? '' : 'Máximo ' + item.stock"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div v-if="!isSale && !isPurchase" class="btn-group btn-group-sm">
            <button
              @click="
                $router.push({ name: 'ProductsAdd', params: { id: item.id } })
              "
              type="button"
              class="btn btn-info"
            >
              <i class="icon-edit1"></i>
            </button>
            <button
              @click="deleteItem(item)"
              type="button"
              class="btn btn-danger"
            >
              <i class="icon-cancel"></i>
            </button>
          </div>
          <div v-else>
            <button
              v-if="isSale"
              @click="addToSale(item)"
              type="button"
              class="btn btn-warning"
            >
              Agregar</button
            ><button
              v-if="isPurchase"
              @click="addToPurchase(item)"
              type="button"
              class="btn btn-warning"
            >
              Agregar
            </button>
          </div>
        </template>
        <template v-slot:[`search`]>
          <div class="row d-flex justify-content-between mb-3">
            <div class="col-sm-12">
              <label for="inputName">Búsqueda</label>
            </div>
            <div class="col-sm-6">
              <input
                v-model="search"
                type="text"
                class="form-control"
                id="inputName"
                placeholder="Ingresa tu búsqueda"
              />
            </div>
            <div class="col-sm-6">
              <button
                type="button"
                class="btn btn-primary"
                @click="$router.push({ name: 'ProductsCreate' })"
              >
                Agregar Nuevo
              </button>
            </div>
          </div>
        </template>
        <template v-slot:[`pagination`]>
          <pagination
            v-model="page"
            :records="totalItems"
            :per-page="productsToShow || $store.state.itemsPerPage"
            :options="{
              chunk: $store.state.maxPaginationButtons,
              texts: {
                count:
                  'Mostrando {from} a {to} de {count} elementos|{count} elementos|Un elemento',
              },
            }"
          />
        </template>
      </simple-table>
    </div>
  </div>
</template>

<script>
const ENTITY = 'products';

import vuelidate from '@/plugins/vuelidate';
import SimpleTable from '@/components/template/SimpleTable.vue';
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation.vue';

export default {
  emits: ['addToSale', 'addToPurchase'],
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    productsToShow: {
      type: Number,
      default: null,
    },
    isPurchase: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SimpleTable,
    VTextFieldWithValidation,
  },
  setup() {
    return { v$: vuelidate.useVuelidate() };
  },
  validations() {
    return {
      items: {
        $each: {
          qty: { required: vuelidate.required },
        },
      },
    };
  },
  data() {
    return {
      fieldsToSearch: ['name'],
      delayTimer: null,
      [ENTITY]: [],
      editedIndex: -1,
      // configuracion de la tabla
      pagination: {},
      dataTableLoading: true,
      page: 1,
      pageCount: 0,
      loadingButton: false,
      search: '',
      dialog: false,
    };
  },
  computed: {
    totalItems() {
      return this.$store.state[ENTITY + 'Module'].total;
    },
    totalPages() {
      return this.$store.state[ENTITY + 'Module'].totalPages;
    },
    items() {
      return this[ENTITY];
    },
    entity() {
      return ENTITY;
    },
  },
  watch: {
    async search() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.initialize(this.page);
      }, 600);
    },
    async page() {
      this.initialize(this.page);
    },
  },
  async mounted() {
    this.initialize();
  },
  methods: {
    async initialize(page = 1) {
      // llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + 'Module/list', {
          page,
          search: this.search,
          fieldsToSearch: this.fieldsToSearch,
          limit: this.productsToShow || this.$store.state.itemsPerPage,
        }),
      ]);
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
    },
    async deleteItem(item) {
      const index = this[ENTITY].indexOf(item);
      let itemId = this[ENTITY][index].id;
      this.$swal
        .fire({
          title: '¿Estás seguro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, elimínalo!',
          cancelButtonText: 'No, mantenerlo',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$store.dispatch(ENTITY + 'Module/delete', itemId);
            this[ENTITY].splice(index, 1);
          }
        });
    },
    addToSale(item) {
      if (
        (!item.qty || parseInt(item.qty, 10) < 1 || item.qty > item.stock) &&
        !this.isPurchase
      ) {
        item['errors'] = [{ $message: 'Agrega una cantidad válida' }];
        return;
      }
      item['errors'] = [];
      this.$emit('addToSale', item);
      item.qty = null;
    },
    addToPurchase(item) {
      this.$emit('addToPurchase', item);
      item.qty = null;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
