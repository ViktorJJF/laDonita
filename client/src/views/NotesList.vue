<template>
  <core-view-slot view-name="Listado de insumos">
    <div class="row gutters">
      <div
        v-for="(note, noteIndex) in notes"
        class="col-xl-4 col-lg-4 col-md-6 col-12"
        :key="note.id"
      >
        <div class="row gutters">
          <div class="col-sm-6 col-12">
            <div>
              <small class="text-info">
                Creación {{ $filters.formatDate(note.createdAt) }}
              </small>
            </div>
            <small class="text-info">
              Última actualización {{ $filters.formatDate(note.updatedAt) }}
            </small>
          </div>
          <div class="col-sm-6 col-12 text-right">
            <button
              @click="deleteItem(note.id, noteIndex)"
              type="button"
              class="btn btn-danger"
              style="margin-right: 50px"
            >
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>

        <textarea
          v-model="note.description"
          @input="updateNote(note.id, note)"
        ></textarea>
      </div>
      <div
        class="col-xl-3 col-lg-3 col-md-6 col-12"
        id="create"
        @click="create"
      >
        +
      </div>
    </div>
  </core-view-slot>
</template>

<script>
const ENTITY = 'notes';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';

export default {
  components: {
    CoreViewSlot,
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
          sort: 'createdAt',
          order: 1,
        }),
      ]);
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
    },
    async deleteItem(id, index) {
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
            await this.$store.dispatch(ENTITY + 'Module/delete', id);
            this[ENTITY].splice(index, 1);
          }
        });
    },
    async create() {
      try {
        let newNote = await this.$store.dispatch(ENTITY + 'Module/create', {
          description: '',
        });
        this.notes.push(newNote);
      } catch (error) {
        console.log(error);
      }
    },
    updateNote(id, note) {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.$store.dispatch(ENTITY + 'Module/update', {
          id,
          data: note,
        });
      }, 600);
    },
  },
};
</script>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Gloria+Hallelujah);

* {
  box-sizing: border-box;
}

body {
  background: url(https://subtlepatterns.com/patterns/little_pluses.png) #cacaca;
  margin: 30px;
}

#create {
  padding: 25px 25px 40px;
  margin: 0 20px 20px 0;
  width: 95%;
  height: 500px;
  overflow-y: scroll;
}
textarea {
  padding: 25px 25px 40px;
  margin: 0 20px 20px 0;
  width: 95%;
  height: 500px;
  overflow-y: scroll;
}

#create {
  user-select: none;
  padding: 100px;
  border-radius: 20px;
  text-align: center;
  border: 15px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: rgba(0, 0, 0, 0.1);
  font: 220px 'Helvetica', sans-serif;
  line-height: 185px;
}

#create:hover {
  border-color: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.2);
}

textarea {
  font: 20px 'Gloria Hallelujah', cursive;
  line-height: 1.5;
  border: 0;
  border-radius: 3px;
  background: linear-gradient(#f9efaf, #f7e98d);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.5s ease;
  font-smoothing: subpixel-antialiased;
  max-height: 520px;
}
textarea:hover {
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
}
textarea:focus {
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2);
  outline: none;
}
</style>
