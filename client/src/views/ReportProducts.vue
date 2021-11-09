<template>
  <core-view-slot view-name="Listado de Ventas">
    <div class="row gutters">
      <div class="col-sm-6 col-12">
        <ul>
          <li>
            <h3 class="mb-3">Total de productos: {{ items.length }}</h3>
          </li>
        </ul>
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
        <el-table stripe border id="my-table" :data="items" style="width: 100%">
          <el-table-column prop="name" sortable label="Producto">
          </el-table-column>
          <el-table-column prop="brand" sortable label="Marca">
            <template #default="scope">
              {{ scope.row.brand ? scope.row.brand.name : 'Sin marca' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="purchasePrice"
            sortable
            label="Precio de compra"
          >
            <template #default="scope">
              S/. {{ scope.row.purchasePrice }}
            </template>
          </el-table-column>

          <el-table-column
            prop="purchasePrice"
            sortable
            label="Precio de venta"
          >
            <template #default="scope"> S/. {{ scope.row.price }} </template>
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

const ENTITY = 'products';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';

export default {
  components: {
    CoreViewSlot,
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
      editedDate: null,
      editMode: false,
      startDate: null,
      endDate: null,
      products: [],
      selectedProduct: null,
      selectedProductId: null,
      itemsPerPage: 300,
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
    async initialize() {
      // llamada asincrona de items
      await Promise.all([
        this.$store.dispatch('productsModule/list', {
          limit: 999999999,
          sort: 'name',
          order: '1',
        }),
      ]);
      this.products = this.$store.state.productsModule.products;
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
        callback(
          this.products.map((product) => ({
            ...product,
            formattedName:
              product.name +
              (product.brandId ? ` (${product.brand.name})` : ''),
          })),
        );
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
      docTable.text(`Total de productos: ${this.items.length}`, 38, 36);
      docTable.autoTable({
        theme: 'grid',
        headStyles: { fillColor: [25, 53, 93] },
        styles: { fontSize: 9, overflow: 'ellipsize', cellWidth: 'wrap' },
        columnStyles: { europe: { halign: 'center' } },
        head: [
          ['#', 'Producto', 'Marca', 'Precio de Compra', 'Precio de Venta'],
        ],
        body: this.items.map((item, index) => [
          index + 1,
          item.name,
          item.brand ? item.brand.name : 'Sin Marca',
          'S/.' + item.purchasePrice,
          'S/.' + item.price,
        ]),
      });

      docTable.save('reporte_productos.pdf');
    },
    exportExcel() {
      let data = XLSX.utils.aoa_to_sheet([
        ['#', 'Producto', 'Marca', 'Precio de Compra', 'Precio de Venta'],
        ...this.filteredItems.map((item, index) => [
          index + 1,
          item.name,
          item.brand ? item.brand.name : 'Sin Marca',
          item.purchasePrice,
          item.price,
        ]),
      ]);
      const workbook = XLSX.utils.book_new();
      const { filename } = this;
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, 'reporte_productos.xlsx');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
