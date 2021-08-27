<template>
  <core-view-slot view-name="Listado de insumos">
    <div class="row gutters">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <simple-table
          :headers="headers"
          :items="items"
          date-to-filter="fechaFin"
          :filterBox="true"
          :filterDate="false"
        >
          <template v-slot:[`item.createdAt`]="{ item }">
            {{ $filters.formatDate(item.createdAt) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="btn-group btn-group-sm">
              <button
                @click="
                  $router.push({ name: 'BrandsAdd', params: { id: item.id } })
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
                  @click="$router.push({ name: 'BrandsCreate' })"
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
const ENTITY = 'supplies';

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
        { text: 'Fecha', value: 'createdAt' },
        { text: 'Nombre', value: 'name' },
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
    async initialize(page = 1) {
      // llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + 'Module/list', {
          page,
          search: this.search,
          fieldsToSearch: this.fieldsToSearch,
          order: 1,
          sort: 'name',
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
  },
};
</script>

<style lang="scss" scoped>
</style>
