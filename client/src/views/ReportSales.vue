<template>
  <core-view-slot view-name="Listado de Ventas">
    <div class="row gutters">
      <div class="col-sm-6 col-12">
        <ul>
          <li>
            <h3 class="mb-3">
              Total de Ventas:
              <span class="ganancia"
                >S/.{{ $filters.formatMoney(totalSales) }}</span
              >
            </h3>
          </li>
          <li>
            <h3 class="mb-3">
              Total de Ganancias:
              <span class="ganancia"
                >S/.{{
                  $filters.formatMoney(totalSales - totalSalesCost)
                }}</span
              >
            </h3>
          </li>
          <li>
            <h5 class="mb-3">Cantidad de ventas: {{ filteredItems.length }}</h5>
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
          <el-table-column prop="products" label="Productos">
            <template #default="scope">
              <ul>
                <li
                  v-for="saleDetail in scope.row.sales_details"
                  :key="saleDetail.id"
                >
                  ✅
                  {{
                    saleDetail.product
                      ? saleDetail.product.name
                      : 'Producto eliminado'
                  }}
                  <span v-show="saleDetail.product?.brand?.name"
                    >({{ saleDetail.product?.brand?.name }})
                  </span>
                  ({{ saleDetail.qty }} x S/.{{ saleDetail.salePrice }})
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="Costo">
            <template #default="scope">
              <span class
                >S/.{{
                  $filters.formatMoney(subTotalCost(scope.row.sales_details))
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="totalSale" label="Total de Venta">
            <template #default="scope">
              <span class
                >S/.{{
                  $filters.formatMoney(subTotalRevenue(scope.row.sales_details))
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column resizable prop="amount" label="Ganancias">
            <template #default="scope">
              <span class="ganancia"
                >S/.{{
                  $filters.formatMoney(
                    subTotalRevenue(scope.row.sales_details) -
                      subTotalCost(scope.row.sales_details),
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

const ENTITY = 'sales';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';

export default {
  components: {
    CoreViewSlot,
  },
  data() {
    return {
      headers: [
        { text: 'Fecha', value: 'date' },
        { text: 'Productos', value: 'products' },
        { text: 'Costo', value: 'cost' },
        { text: 'Total de venta', value: 'totalSale' },
        { text: 'Ganancias', value: 'amount' },
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
      itemsPerPage: 30,
      products: [],
      selectedProduct: null,
      selectedProductId: null,
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
    filteredItems() {
      return this.selectedProductId
        ? this.items.filter((el) =>
            el.sales_details.find(
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
    totalSales() {
      return this.filteredItems
        .reduce(
          (a, b) =>
            a + b.sales_details.reduce((c, d) => c + d.salePrice * d.qty, 0),
          0,
        )
        .toFixed(2);
    },
    totalSalesCost() {
      return this.filteredItems
        .reduce(
          (a, b) =>
            a +
            b.sales_details.reduce((c, d) => c + d.purchasePrice * d.qty, 0),
          0,
        )
        .toFixed(2);
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
      let additionalQuery = {};
      let query = {
        page,
        search: this.search,
        fieldsToSearch: this.fieldsToSearch,
        sort: 'date',
        order: -1,
        limit: 999999999,
      };
      if (this.startDate || this.endDate) {
        additionalQuery['fieldDate'] = 'date'; // este es el field a filtrar
        additionalQuery['startDate'] = this.startDate;
        additionalQuery['endDate'] = this.endDate;
      }
      query = { ...query, ...additionalQuery };
      await Promise.all([this.$store.dispatch(ENTITY + 'Module/list', query)]);
      this.products = this.$store.state.productsModule.products;
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
      // recuperando datos para reporte
      additionalQuery['fieldDate'] = 'createdAt';
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
    async saveSale(sale) {
      let date = new Date(this.editedDate);
      date = new Date(date.getTime() - date.getTimezoneOffset() * -60000);
      sale.date = date;
      await this.$store.dispatch('salesModule/update', {
        id: sale.id,
        data: {
          date,
        },
      });
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
    totalRevenue(salesDetail) {
      if (salesDetail) {
        return salesDetail
          .reduce((a, b) => a + b.salePrice * b.qty, 0)
          .toFixed(2);
      }
      return '0';
    },
    filterItemsByDate() {
      this.initialize();
    },
    subTotalRevenue(salesDetail) {
      if (salesDetail) {
        return salesDetail.reduce((a, b) => a + b.salePrice * b.qty, 0);
      }
      return 'S/.0';
    },
    subTotalCost(salesDetail) {
      if (salesDetail) {
        return salesDetail.reduce((a, b) => a + b.purchasePrice * b.qty, 0);
      }
      return 'S/.0';
    },
    generateTable() {
      const docTable = new jsPDF('l', 'pt');
      docTable.setFontSize(9);
      docTable.text(
        `Actualizado al ${this.$filters.formatDate(new Date())}`,
        40,
        20,
        { fontSize: 100 },
      );
      docTable.setFontSize(14);
      docTable.text(
        `Total de ventas: S/.${this.$filters.formatMoney(this.totalSales)}`,
        40,
        36,
      );
      docTable.text(
        `Total de ganancias: S/.${this.$filters.formatMoney(
          this.totalSales - this.totalSalesCost,
        )}`,
        40,
        54,
      );
      docTable.autoTable({
        theme: 'grid',
        margin: [60, 40, 40, 40],
        headStyles: { fillColor: [25, 53, 93] },
        styles: { fontSize: 9, overflow: 'ellipsize', cellWidth: 'wrap' },
        columnStyles: { europe: { halign: 'center' } },
        head: [
          ['#', 'Fecha', 'Productos', 'Costo', 'Total de venta', 'Ganancias'],
        ],
        body: this.filteredItems.map((item, index) => [
          String(index + 1),
          this.$filters.formatDate(item.date),
          item.sales_details
            .map(
              (detail) =>
                '✅' +
                (detail.product
                  ? detail.product.brand
                    ? detail.product.name +
                      ` (${detail.product.brand.name})(${detail.qty} x S/.${detail.salePrice})`
                    : detail.product.name +
                      ` (${detail.qty} x S/.${detail.salePrice})`
                  : 'Producto eliminado') +
                '\n',
            )
            .join(''),
          'S/.' +
            this.$filters.formatMoney(this.subTotalCost(item.sales_details)),
          'S/.' +
            this.$filters.formatMoney(this.subTotalRevenue(item.sales_details)),
          'S/.' +
            this.$filters.formatMoney(
              this.subTotalRevenue(item.sales_details) -
                this.subTotalCost(item.sales_details),
            ),
        ]),
      });

      docTable.save('reporte_compras.pdf');
    },
    exportExcel() {
      let data = XLSX.utils.aoa_to_sheet([
        ['#', 'Fecha', 'Productos', 'Costo', 'Total de venta', 'Ganancias'],
        ...this.filteredItems.map((item, index) => [
          String(index + 1),
          this.$filters.formatDate(item.date),
          item.sales_details
            .map(
              (detail) =>
                '✅' +
                (detail.product
                  ? detail.product.brand
                    ? detail.product.name +
                      ` (${detail.product.brand.name})(${detail.qty} x S/.${detail.salePrice})`
                    : detail.product.name +
                      ` (${detail.qty} x S/.${detail.salePrice})`
                  : 'Producto eliminado') +
                '\n',
            )
            .join(''),
          this.subTotalCost(item.sales_details),
          this.subTotalRevenue(item.sales_details),
          this.subTotalRevenue(item.sales_details) -
            this.subTotalCost(item.sales_details),
        ]),
      ]);
      const workbook = XLSX.utils.book_new();
      const { filename } = this;
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, 'reporte_ventas.xlsx');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
