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
      <div class="col-sm-6 col-12">
        <label class="mb-1 mr-2">Fecha desde:</label>
        <v-date-picker style="display: inline-block" v-model="startDate">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="form-control bg-white border px-2 py-1 rounded"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="col-sm-6 col-12">
        <label class="mb-1 mr-2">Fecha Hasta:</label>
        <v-date-picker style="display: inline-block" class="" v-model="endDate">
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

    <div class="row gutters">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <simple-table
          :headers="headers"
          :items="items"
          date-to-filter="fechaFin"
          :filterBox="false"
          :filterDate="false"
        >
          <template v-slot:[`item.userId`]=""> kxmn@gmail.com </template>
          <template v-slot:[`item.date`]="{ item }">
            <div>
              <v-date-picker
                v-show="editMode && item.id == editedIndex"
                v-model="editedDate"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <input
                    class="form-control bg-white border px-2 py-1 rounded"
                    :value="inputValue"
                    v-on="inputEvents"
                  />
                </template>
              </v-date-picker>
              <span v-show="!editMode || item.id != editedIndex">{{
                $filters.formatDate(item.date)
              }}</span>
            </div>
          </template>
          <template v-slot:[`item.provider`]="{ item }">
            <div>
              {{
                $store.state.providersModule.providers.find(
                  (el) => el.id === item.providerId,
                )?.name || 'Sin proveedor'
              }}
            </div>
          </template>
          <template v-slot:[`item.products`]="{ item }">
            <ul>
              <li
                v-for="purchaseDetail in item.purchases_details"
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
          <template v-slot:[`item.totalPurchase`]="{ item }">
            <span class="inversion"
              >S/.{{
                $filters.formatMoney(subTotalRevenue(item.purchases_details))
              }}</span
            >
          </template>
          <template v-slot:[`pagination`]>
            <pagination
              v-model="page"
              :records="totalItems"
              :per-page="$store.state.itemsPerPage"
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
    async search() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.initialize(this.page);
      }, 600);
    },
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
      };
      if (this.startDate || this.endDate) {
        query['fieldDate'] = 'date'; // este es el field a filtrar
        query['startDate'] = this.startDate;
        query['endDate'] = this.endDate;
      }
      await Promise.all([this.$store.dispatch(ENTITY + 'Module/list', query)]);
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
