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
              Cantidad de compras: {{ filteredItems.length }}
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
          @select="selectedProductId = $event.id"
          value-key="formattedName"
        ></el-autocomplete>
      </div>
    </div>
    <div class="row gutters mb-2">
      <div class="col-12">
        <button
          type="button"
          class="btn btn-danger mr-1"
          @click="generateTable"
        >
          <i class="icon-cancel"></i> Exportar PDF
        </button>
        <button @click="exportExcel" type="button" class="btn btn-success">
          <i class="icon-cancel"></i> Exportar XLSX
        </button>
      </div>
    </div>
    <div class="row gutters">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <el-table
          stripe
          border
          id="my-table"
          :data="limitedItems"
          style="width: 100%"
        >
          <el-table-column prop="date" sortable label="Fecha">
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
          <el-table-column prop="provider" sortable label="Proveedor">
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
                  <span v-show="purchaseDetail.product?.brand?.name"
                    >({{ purchaseDetail.product?.brand?.name }})
                  </span>
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
        <div class="mt-2 pagination justify-content-center primary text-center">
          <pagination
            v-model="page"
            :records="filteredItems.length"
            :per-page="itemsPerPage"
            :options="{
              chunk: 10,
              texts: {
                count:
                  'Mostrando {from} a {to} de {count} elementos|{count} elementos|Un elemento',
              },
            }"
          />
        </div>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import XLSX from 'xlsx';

const ENTITY = 'purchases';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';

export default {
  components: {
    CoreViewSlot,
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
      products: [],
      selectedProduct: null,
      selectedProductId: null,
      itemsPerPage: 30,
    };
  },
  computed: {
    items() {
      return this[ENTITY];
    },
    filteredItems() {
      return this.selectedProductId
        ? this.items.filter((el) =>
            el.purchases_details.find(
              (el2) => el2.productId === this.selectedProductId,
            ),
          )
        : this.items;
    },
    limitedItems() {
      return this.filteredItems.slice(
        (this.page - 1) * this.itemsPerPage,
        this.page * this.itemsPerPage,
      );
    },
    entity() {
      return ENTITY;
    },
    totalPurchases() {
      return this.filteredItems.reduce(
        (acc, el) =>
          acc +
          el.purchases_details.reduce(
            (acc2, el2) => acc2 + el2.purchasePrice * el2.qty,
            0,
          ),
        0,
      );
    },
  },
  watch: {
    // async page() {
    //   this.initialize(this.page);
    // },
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
        console.log(
          '🚀 Aqui *** -> this.selectedProduct',
          this.selectedProduct,
        );
        this.selectedProductId = null;
        // this.initialize();
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
        limit: 999999999,
      };
      if (this.startDate || this.endDate) {
        query['fieldDate'] = 'date'; // este es el field a filtrar
        query['startDate'] = this.startDate;
        query['endDate'] = this.endDate;
      }
      if (this.selectedProductId && this.selectedProduct.trim().length > 0) {
        query['productId'] = this.selectedProductId;
      }
      await Promise.all([this.$store.dispatch(ENTITY + 'Module/list', query)]);
      this.products = this.$store.state.productsModule.products;
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
    },
    getProducts($event, callback) {
      // asignar al data del componente
      this.products = this.$store.getters['productsModule/searchProduct'](
        $event || '',
      );
      callback(
        this.products.map((product) => ({
          ...product,
          formattedName:
            product.name + (product.brandId ? ` (${product.brand.name})` : ''),
        })),
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
    filterItemsByDate() {
      this.initialize();
    },
    subTotalRevenue(purchasesDetail) {
      if (purchasesDetail) {
        return purchasesDetail.reduce((a, b) => a + b.purchasePrice * b.qty, 0);
      }
      return 'S/.0';
    },
    generateTable() {
      const docTable = new jsPDF('l', 'pt');
      docTable.setFontSize(9);
      docTable.text(
        `Actualizado al ${this.$filters.formatDate(new Date())}`,
        38,
        20,
        { fontSize: 100 },
      );
      docTable.setFontSize(14);
      docTable.text(
        `Total de compras: S/.${this.$filters.formatMoney(
          this.totalPurchases,
        )}`,
        38,
        36,
      );
      docTable.autoTable({
        theme: 'grid',
        headStyles: { fillColor: [25, 53, 93] },
        styles: { fontSize: 9, overflow: 'ellipsize', cellWidth: 'wrap' },
        columnStyles: { europe: { halign: 'center' } },
        head: [['#', 'Fecha', 'Proveedor', 'Productos', 'Total de compra']],
        body: this.filteredItems.map((item, index) => [
          String(index + 1),
          this.$filters.formatDate(item.date),
          this.$store.state.providersModule.providers.find(
            (el) => el.id === item.providerId,
          )?.name || 'Sin proveedor',
          item.purchases_details
            .map(
              (detail) =>
                '✅' +
                (detail.product
                  ? detail.product.brand
                    ? detail.product.name +
                      ` (${detail.product.brand.name})(${detail.qty} x S/.${detail.purchasePrice})`
                    : detail.product.name +
                      ` (${detail.qty} x S/.${detail.purchasePrice})`
                  : 'Producto eliminado') +
                '\n',
            )
            .join(''),
          'S/.' +
            this.$filters.formatMoney(
              this.subTotalRevenue(item.purchases_details),
            ),
        ]),
      });

      docTable.save('reporte_ventas.pdf');
    },
    exportExcel() {
      let data = XLSX.utils.aoa_to_sheet([
        ['#', 'Fecha', 'Proveedor', 'Productos', 'Total de compra'],
        ...this.filteredItems.map((item, index) => [
          String(index + 1),
          this.$filters.formatDate(item.date),
          this.$store.state.providersModule.providers.find(
            (el) => el.id === item.providerId,
          )?.name || 'Sin proveedor',
          item.purchases_details
            .map(
              (detail) =>
                '-' +
                (detail.product
                  ? detail.product.brand
                    ? detail.product.name +
                      ` (${detail.product.brand.name})(${detail.product.brand.name})`
                    : detail.product.name +
                      ` (${detail.qty} x S/.${detail.purchasePrice})`
                  : 'Producto eliminado') +
                '\n',
            )
            .join(''),

          this.subTotalRevenue(item.purchases_details),
        ]),
      ]);
      const workbook = XLSX.utils.book_new();
      const { filename } = this;
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, 'reporte_compras.xlsx');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
