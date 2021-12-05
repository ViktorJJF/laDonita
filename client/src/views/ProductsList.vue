<template>
  <core-view-slot view-name="Productos">
    <ProductsTable
      :headers="[
        { text: 'Producto', value: 'name' },
        { text: 'Marca', value: 'brandId' },
        { text: 'Stock', value: 'stock' },
        { text: 'Precio de compra', value: 'purchasePrice' },
        { text: 'Precio de venta', value: 'price' },
        { text: 'Agregado', value: 'createdAt' },
        { text: 'Acciones', value: 'actions', width: '15%' },
      ]"
    ></ProductsTable>
  </core-view-slot>
</template>

<script>
const ENTITY = 'products';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import ProductsTable from '@/components/ProductsTable.vue';

export default {
  components: {
    CoreViewSlot,
    ProductsTable,
  },
  data() {
    return {
      headers: [
        { text: 'Producto', value: 'name' },
        { text: 'Marca', value: 'brandId' },
        { text: 'Stock', value: 'stock' },
        { text: 'Precio de compra', value: 'purchasePrice' },
        { text: 'Precio de venta', value: 'price' },
        { text: 'Agregado', value: 'createdAt' },
        { text: 'Acciones', value: 'actions', width: '15%' },
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
    async initialize() {
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
  },
};
</script>

<style lang="scss" scoped>
</style>
