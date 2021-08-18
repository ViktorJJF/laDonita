<template>
  <core-view-slot>
    <OrdersTable></OrdersTable>
  </core-view-slot>
</template>

<script>
import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import OrdersTable from '@/components/OrdersTable.vue';

export default {
  components: {
    CoreViewSlot,
    OrdersTable,
  },
};
</script>

<style lang="scss" scoped>
</style>
