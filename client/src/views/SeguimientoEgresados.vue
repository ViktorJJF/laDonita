<template>
  <core-view-slot view-name="Lista de egresados">
    <div class="notify-notifications clearfix">
      <div id="notes" class="notify notify-notes">
        <div class="note note-danger note-11">
          <span class="image"><i class="icon-alert-triangle"></i></span
          ><button type="button" class="remove">
            <i class="icon-close"></i>
          </button>
          <div class="content">
            <strong class="title">Hello</strong>I'm a notification I will
            quickly alert you as well!
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary add-noti">Default</button>
      <button type="button" class="btn btn-secondary add-sticky-noti">
        Sticky
      </button>
      <button type="button" class="btn btn-danger add-danger-noti">
        Danger
      </button>
      <button type="button" class="btn btn-info add-info-noti">Info</button>
      <button type="button" class="btn btn-success add-success-noti">
        Success
      </button>
      <button type="button" class="btn btn-warning add-warning-noti">
        Warning
      </button>
    </div>
    <div class="row gutters">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <simple-table
          :extra-fields-filter="['hasResearches', 'hasAdvisors']"
          :headers="headers"
          :items="items"
          date-to-filter="fechaFin"
          @clickViewCustom="setCurrentItem"
        >
          <template v-slot:[`item.fechaInicio`]="{ item }">
            {{ $filters.formatDate(item.fechaInicio) }}
          </template>
          <template v-slot:[`item.fechaFin`]="{ item }">
            {{ $filters.formatDate(item.fechaFin) }}
          </template>
          <template v-slot:[`item.info`]="{ item }">
            <div><b>Investigaciones:</b> {{ item.info.researches.length }}</div>
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
          <template v-slot:modalEditContent>
            <div v-if="item">
              <div v-for="(research, idx) in item.info.researches" :key="idx">
                <ul class="list-group">
                  <li class="list-group-item active">Investigaciones</li>
                  <li class="list-group-item">
                    <b>Título:</b> {{ research.title }}
                  </li>
                  <li class="list-group-item">
                    <b>link:</b>
                    <a :href="research.link" target="_blank">{{
                      research.link
                    }}</a>
                  </li>
                  <li class="list-group-item">
                    <b>Fecha:</b>
                    {{ research.date }}
                  </li>
                  <li class="list-group-item">
                    <b>Autores:</b>
                    {{ research.authors.join(',') }}
                  </li>
                  <li class="list-group-item">
                    <b>Asesores:</b>
                    {{ research.advisors.join(',') }}
                  </li>
                  <li class="list-group-item">
                    <b>Nivel</b>
                    {{ research.grade }}
                  </li>
                  <li class="list-group-item">
                    <b>Universidad</b>
                    {{ research.university }}
                  </li>
                  <li class="list-group-item">Título: {{ research.title }}</li>
                </ul>
              </div>
              <div v-for="(advisor, idx) in item.info.advisors" :key="idx">
                <ul class="list-group">
                  <li class="list-group-item active">Asesorías</li>
                  <li class="list-group-item">
                    <b>Título:</b> {{ advisor.title }}
                  </li>
                  <li class="list-group-item">
                    <b>link:</b>
                    <a :href="advisor.link" target="_blank">{{
                      advisor.link
                    }}</a>
                  </li>
                  <li class="list-group-item">
                    <b>Fecha:</b>
                    {{ advisor.date }}
                  </li>
                  <li class="list-group-item">
                    <b>Autores:</b>
                    {{ advisor.authors.join(',') }}
                  </li>
                  <li class="list-group-item">
                    <b>Asesores:</b>
                    {{ advisor.advisors.join(',') }}
                  </li>
                  <li class="list-group-item">
                    <b>Nivel</b>
                    {{ advisor.grade }}
                  </li>
                  <li class="list-group-item">
                    <b>Universidad</b>
                    {{ advisor.university }}
                  </li>
                  <li class="list-group-item">Título: {{ advisor.title }}</li>
                </ul>
              </div>
            </div>
          </template>
        </simple-table>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
import { format, isAfter } from 'date-fns';
import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import SimpleTable from '@/components/template/SimpleTable.vue';
import axios from 'axios';
// import { ref } from 'vue';

export default {
  components: {
    CoreViewSlot,
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
        // { text: 'Acciones', value: 'actions', width: '15%' },
      ],
      items: [],
      item: null,
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
      hasGrade: item.info.researches.some((research) =>
        this.hasGrade(research.date, item),
      ),
      hasResearches:
        item.info.researches.length > 0 ? 'investigaciones' : false,
      hasAdvisors: item.info.advisors.length > 0 ? 'asesorias' : false,
    }));
    // .filter((el) => el.hasGrade);
  },
  methods: {
    hasGrade(researchDate, item) {
      try {
        const formattedResearchDate = new Date(
          format(new Date(researchDate), "yyyy'-'MM'-'dd"),
        );
        const fechaFin = new Date(
          format(new Date(item.fechaFin), "yyyy'-'MM'-'dd"),
        );
        return isAfter(formattedResearchDate, fechaFin);
      } catch (error) {
        return false;
      }
    },
    setCurrentItem(item) {
      this.item = item;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
