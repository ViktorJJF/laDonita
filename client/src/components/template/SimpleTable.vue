<template>
  <div class="row gutters">
    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
      <div class="form-group">
        <label for="inputName">Búsqueda</label>
        <input
          v-model="search"
          type="text"
          class="form-control"
          id="inputName"
          placeholder="Ingresa tu búsqueda"
        />
      </div>
    </div>
    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
      <div class="form-group">
        <label>Desde</label>
        <v-date-picker v-model="dateFrom">
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
    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
      <div class="form-group">
        <label for="inputName">Hasta</label>
        <v-date-picker @input="newDateTo(dateTo)" v-model="dateTo">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="form-control bg-white border px-2 py-1 rounded"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      {{ dateFrom }} - {{ dateTo }}
    </div>
  </div>
  <div class="table-container">
    <div class="table-responsive">
      <table class="table m-0">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">{{ header.text }}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, itemIndex) in limitedItems" :key="itemIndex">
            <td :width="header.width" v-for="header in headers" :key="header">
              <slot :name="'item.' + header.value" :item="item">{{
                item[header.value]
              }}</slot>
            </td>
            <td>
              <!-- Button trigger modal -->
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                data-toggle="modal"
                data-target="#customModal"
                @click="$emit('clickViewCustom', item)"
              >
                <i class="mdi mdi-eye"></i>
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination justify-content-center primary text-center">
      <pagination
        v-model="page"
        :records="filteredItems.length"
        :per-page="itemsPerPage"
        :options="{
          chunk: numberPagesToShow,
          texts: {
            count:
              'Mostrando {from} a {to} de {count} elementos|{count} elementos|Un elemento',
          },
        }"
      />
    </div>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="customModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="customModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="customModalLabel">Información</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div>
            <slot name="modalEditContent"></slot>
          </div>
        </div>
        <div class="modal-footer custom">
          <button
            type="button"
            class="btn btn-link danger"
            data-dismiss="modal"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, isWithinInterval } from 'date-fns';

export default {
  emits: ['clickViewCustom'], // this line
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    extraFieldsFilter: {
      type: Array,
      default: () => [],
    },
    dateToFilter: {
      type: String,
      default: 'createdAt',
    },
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 2,
      numberPagesToShow: 10,
      search: '',
      dateFrom: null,
      dateTo: null,
    };
  },
  computed: {
    totalPages() {
      return this.items.length > 0
        ? Math.ceil(this.items.length / this.itemsPerPage)
        : 1;
    },
    filteredByDate() {
      return this.dateFrom && this.dateTo
        ? this.items.filter((item) =>
            this.isWithinDateRange(
              item[this.dateToFilter],
              this.dateFrom,
              this.dateTo,
            ),
          )
        : this.items;
    },
    filteredItems() {
      return this.search.trim().length > 0
        ? this.filteredByDate.filter((item) =>
            [...Object.keys(item), ...this.extraFieldsFilter].some(
              (key) =>
                (typeof item[key] === 'string' ||
                  typeof item[key] === 'number') &&
                String(item[key])
                  .toLowerCase()
                  .includes(this.search.toLowerCase().trim()),
            ),
          )
        : this.filteredByDate;
    },
    limitedItems() {
      return this.filteredItems.slice(
        (this.page - 1) * this.itemsPerPage,
        this.page * this.itemsPerPage,
      );
    },
  },
  mounted() {
    this.itemsPerPage = this.$store.state.itemsPerPage;
  },
  watch: {
    search() {
      this.page = 1;
    },
  },
  methods: {
    isWithinDateRange(date, from, to) {
      try {
        const formattedFrom = new Date(
          format(new Date(from), "yyyy'-'MM'-'dd"),
        );
        const formattedTo = new Date(format(new Date(to), "yyyy'-'MM'-'dd"));
        const today = new Date(format(new Date(date), "yyyy'-'MM'-'dd"));
        return isWithinInterval(today, {
          start: formattedFrom,
          end: formattedTo,
        });
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
