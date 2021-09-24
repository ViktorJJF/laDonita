<template>
  <core-view-slot view-name="Listado de Ventas">
    <div class="row gutters">
      <div class="col-sm-6 col-12">
        <ul>
          <li>
            <h3 class="mb-3">
              Total de Compras:
              <span class="inversion"
                >S/.{{ $filters.formatMoney(totalPurchases) }}</span
              >
            </h3>
          </li>
          <li>
            <h5 class="mb-3">
              Cantidad de compras: {{ $store.state.purchasesModule.total }}
            </h5>
          </li>
        </ul>
      </div>
    </div>
    <div class="row gutters mb-3">
      <div class="col-sm-4 col-12">
        <label class="mb-1 mr-2">Fecha desde:</label>
        <v-date-picker v-model="startDate">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="form-control bg-white border px-2 py-1 rounded date-picker"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="col-sm-4 col-12">
        <label class="mb-1 mr-2">Fecha Hasta:</label>
        <v-date-picker v-model="endDate">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="form-control bg-white border px-2 py-1 rounded date-picker"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="col-sm-4 col-12">
        <label class="mb-1 mr-2">Producto:</label>
        <el-autocomplete
          style="display: block"
          v-model="selectedProduct"
          :fetch-suggestions="getProducts"
          placeholder="Seleccione un producto"
          @select="
            selectedProductId = $event.id;
            initialize();
          "
          value-key="name"
        ></el-autocomplete>
      </div>
    </div>
    <div class="row gutters">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <el-table height="750" :data="items" style="width: 100%">
          <el-table-column prop="date" label="Fecha">
            <template #default="scope">
              <div>
                <v-date-picker
                  v-show="editMode && scope.row.id == editedIndex"
                  v-model="editedDate"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <input
                      class="
                        form-control
                        bg-white
                        border
                        px-2
                        py-1
                        rounded
                        date-picker
                      "
                      :value="inputValue"
                      v-on="inputEvents"
                    />
                  </template>
                </v-date-picker>
                <span v-show="!editMode || scope.row.id != editedIndex">{{
                  $filters.formatDate(scope.row.date)
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="provider" label="Proveedor">
            <template #default="scope">
              <div>
                {{
                  $store.state.providersModule.providers.find(
                    (el) => el.id === scope.row.providerId,
                  )?.name || 'Sin proveedor'
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="products" label="Productos">
            <template #default="scope">
              <ul>
                <li
                  v-for="purchaseDetail in scope.row.purchases_details"
                  :key="purchaseDetail.id"
                >
                  ✅
                  {{
                    purchaseDetail.product
                      ? purchaseDetail.product.name
                      : 'Producto eliminado'
                  }}
                  ({{ purchaseDetail.qty }} x S/.{{
                    purchaseDetail.purchasePrice
                  }})
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            resizable
            prop="totalPurchase"
            label="Total de compra"
            width="100"
          >
            <template #default="scope">
              <span class="inversion"
                >S/.{{
                  $filters.formatMoney(
                    subTotalRevenue(scope.row.purchases_details),
                  )
                }}</span
              >
            </template>
          </el-table-column>
        </el-table>
        <simple-table
          :headers="headers"
          :items="items"
          date-to-filter="fechaFin"
          :filterBox="false"
          :filterDate="false"
          :show-reports="true"
          filename="Reporte de compras"
        >
          <template v-slot:[`pagination`]>
            <pagination
              v-model="page"
              :records="totalItems"
              :per-page="itemsPerPage"
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
  </core-view-slot>
</template>

<script>
const ENTITY = 'purchases';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import SimpleTable from '@/components/template/SimpleTable.vue';

export default {
  components: {
    CoreViewSlot,
    SimpleTable,
  },
  data() {
    return {
      headers: [
        { text: 'Fecha', value: 'date' },
        { text: 'Proveedor', value: 'provider' },
        { text: 'Productos', value: 'products' },
        { text: 'Total de compra', value: 'totalPurchase' },
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ],
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
      editedDate: null,
      editMode: false,
      startDate: null,
      endDate: null,
      products: [],
      selectedProduct: null,
      selectedProductId: null,
      itemsPerPage: 100,
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
    totalPurchases() {
      return this.purchases.reduce(
        (acc, el) =>
          acc +
          el.purchases_details.reduce(
            (acc2, el2) => acc2 + el2.product.purchasePrice * el2.qty,
            0,
          ),
        0,
      );
    },
  },
  watch: {
    async page() {
      this.initialize(this.page);
    },
    startDate() {
      this.page = 1;
      this.initialize(this.page);
    },
    endDate() {
      this.page = 1;
      this.initialize(this.page);
    },
    selectedProduct() {
      if (this.selectedProduct.trim().length === 0) {
        this.initialize();
      }
    },
  },
  async mounted() {
    this.initialize();
  },
  methods: {
    async initialize(page = 1) {
      // llamada asincrona de items
      let query = {
        page,
        search: this.search,
        fieldsToSearch: this.fieldsToSearch,
        sort: 'date',
        order: -1,
        limit: this.itemsPerPage,
      };
      if (this.startDate || this.endDate) {
        query['fieldDate'] = 'date'; // este es el field a filtrar
        query['startDate'] = this.startDate;
        query['endDate'] = this.endDate;
      }
      if (this.selectedProductId && this.selectedProduct.trim().length > 0) {
        query['productId'] = this.selectedProductId;
      }
      await Promise.all([
        this.$store.dispatch(ENTITY + 'Module/list', query),
        this.$store.dispatch('productsModule/list', {
          showLoading: false,
          page: 1,
        }),
      ]);
      this.products = this.$store.state.productsModule.products;
      console.log('🚀 Aqui *** -> this.products', this.products);
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
    },
    getProducts($event, callback) {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(async () => {
        // llamada asincrona de items
        let query = {
          search: $event,
          showLoading: false,
          limit: 10,
          page: 1,
        };
        if (this.fieldsToSearch) {
          query['fieldsToSearch'] = this.fieldsToSearch;
        }
        await Promise.all([this.$store.dispatch('productsModule/list', query)]);
        // asignar al data del componente
        this.products = this.$store.state.productsModule.products;
        callback(this.products);
      }, 1000);
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
            try {
              await this.$store.dispatch(ENTITY + 'Module/delete', itemId);
              // for (const detailsProduct of detailsProducts) {
              // console.log('este es el history: ', detailsProduct.history);
              // if (!detailsProduct.history) {
              // this.$store.commit('productsModule/updateStock', {
              //   productId: detailsProduct.productId.id,
              //   qty: detailsProduct.qty,
              // });
              // }
              // }
              this[ENTITY].splice(index, 1);
            } catch (error) {
              console.log(error);
            }
          }
        });
    },
    totalRevenue(purchasesDetail) {
      if (purchasesDetail) {
        return purchasesDetail
          .reduce((a, b) => a + b.purchasePrice * b.qty, 0)
          .toFixed(2);
      }
      return '0';
    },
    filterItemsByDate() {
      this.initialize();
    },
    subTotalRevenue(purchasesDetail) {
      if (purchasesDetail) {
        return purchasesDetail.reduce((a, b) => a + b.purchasePrice * b.qty, 0);
      }
      return 'S/.0';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
