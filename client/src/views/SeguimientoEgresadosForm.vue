<template>
  <div class="main-container">
    <!-- Page header start -->
    <div class="page-header">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">Tables</li>
        <li class="breadcrumb-item active">Bootstrap Tables</li>
      </ol>
    </div>
    <!-- Page header end -->

    <!-- Content wrapper start -->
    <div class="content-wrapper">
      <!-- Row start -->
      <div class="row gutters">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <simple-table :headers="headers" :items="items">
            <template v-slot:[`item.fechaInicio`]="{ item }">
              {{ $filters.formatDate(item.fechaInicio) }}
            </template>
            <template v-slot:[`item.fechaFin`]="{ item }">
              {{ $filters.formatDate(item.fechaFin) }}
            </template>
            <template v-slot:[`item.info`]="{ item }">
              <div>
                <b>Investigaciones:</b> {{ item.info.researches.length }}
              </div>
              <div><b>Asesorías:</b> {{ item.info.advisors.length }}</div>
            </template>
            <template v-slot:[`item.actions`]="{}">
              <div class="custom-btn-group">
                <button class="btn btn-success">
                  <i class="mdi mdi-pencil"></i>
                  Editar
                </button>
                <button class="btn btn-danger">
                  <i class="mdi mdi-delete"></i>
                  Eliminar
                </button>
              </div>
            </template>
          </simple-table>
        </div>
      </div>
      <!-- Row end -->
    </div>
    <!-- Content wrapper end -->
  </div>
</template>

<script>
import SimpleTable from '@/components/template/SimpleTable.vue';
import axios from 'axios';
// import { ref } from 'vue';

export default {
  components: {
    SimpleTable,
  },
  data() {
    return {
      headers: [
        { text: 'Categoría', value: 'categoria' },
        { text: 'Asesor', value: 'asesor' },
        { text: 'nombres', value: 'nombres' },
        { text: 'Mención', value: 'mencion' },
        { text: 'correo', value: 'correo' },
        { text: 'telefono', value: 'telefono' },
        { text: 'fechaInicio', value: 'fechaInicio' },
        { text: 'fechaFin', value: 'fechaFin' },
        { text: 'informeFinal', value: 'informeFinal' },
        { text: 'researches', value: 'info' },
        { text: 'Acciones', value: 'actions', width: '15%' },
      ],
      items: [],
    };
  },
  // async setup() {
  //   const items = ref([]);
  //   items.value = (await axios.get('/students.json')).data;
  //   console.log('antes de retornar: ', items.value);
  //   return { items };
  // },
  async mounted() {
    this.items = (await axios.get('/students.json')).data;
    this.items = this.items.map((item) => ({
      ...item,
      fechaInicioFormatted: 'aaa',
    }));
  },
};
</script>

<style lang="scss" scoped>
</style>
