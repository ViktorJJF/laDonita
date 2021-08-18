<template>
  <core-view-slot view-name="Órdenes Menú">
    <div class="row gutters d-flex">
      <div class="col-12 col-sm-9">
        <div class="form-group">
          <label for="inputName">Búsqueda por nombre</label>
          <el-input
            placeholder="Ingresa tu búsqueda"
            v-model="search"
            clearable
          >
          </el-input>
        </div>
      </div>
      <div class="col-12 col-sm-3 align-self-center">
        <el-button
          @click="dialog = true"
          type="primary"
          icon="el-icon-shopping-cart-2"
          >Ver pedidos</el-button
        >
      </div>
      <div class="col-12 col-sm-6 col-md-9">
        <div class="row gutters">
          <div
            class="col-12 col-sm-12 col-md-6 col-lg-4"
            v-for="(dish, idx) in filteredItems"
            :key="idx"
          >
            <div class="card-deck">
              <div class="card">
                <img
                  class="card-img-top"
                  :src="dish.img"
                  alt="Card image cap"
                />
                <div class="card-header">
                  <span class="dish-name">{{ dish.name }}</span> - S/.{{
                    dish.price
                  }}
                </div>
                <div class="card-footer text-center">
                  <div class="row gutters">
                    <div class="col-10">
                      <a
                        href="#"
                        class="btn btn-success btn-block"
                        @click.prevent="addToOrder(dish)"
                        >Agregar</a
                      >
                    </div>
                    <div class="col-2">
                      <a
                        href="#"
                        class="btn btn-danger btn-block"
                        @click.prevent="decrease(dish.id)"
                        >-</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="custom-sticky">
          <table class="main" width="100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="content-block">
                  <table class="invoice">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            class="form-control form-control-sm"
                            type="text"
                            placeholder="Nombre del cliente"
                            v-model="order.client"
                          /><br />{{ $filters.formatDate(order.date) }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table
                            class="invoice-items"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tbody>
                              <tr
                                v-for="(dish, idx) in order.dishes"
                                :key="idx"
                              >
                                <td>{{ dish.name }} (x{{ dish.qty }})</td>
                                <td class="alignright">
                                  S/.{{
                                    $filters.formatMoney(dish.price * dish.qty)
                                  }}
                                </td>
                              </tr>
                              <tr class="total">
                                <td class="alignright" width="80%">Total</td>
                                <td class="alignright">
                                  S/.{{
                                    $filters.formatMoney(
                                      order.dishes.reduce(
                                        (acc, el) => acc + el.price * el.qty,
                                        0,
                                      ),
                                    )
                                  }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <a href="#" class="btn btn-info btn-block" @click="saveOrder(order)"
            >Terminar pedido</a
          >
        </div>
      </div>
    </div>
    <el-dialog title="Pedidos recientes" v-model="dialog" width="93%">
      <OrdersTable></OrdersTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialog = false">OK</el-button>
        </span>
      </template>
    </el-dialog>
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
  data() {
    return {
      order: {
        date: new Date(),
        client: null,
        dishes: [],
      },
      historyMode: false,
      search: '',
      dialog: false,
    };
  },
  mounted() {
    this.initialize();
  },
  computed: {
    dishes() {
      return this.$store.state.dishesModule.dishes;
    },
    filteredItems() {
      return this.dishes.filter((el) =>
        el.name.toLowerCase().includes(this.search.toLowerCase()),
      );
    },
  },
  methods: {
    async initialize() {
      await Promise.all([
        this.$store.dispatch('dishesModule/list', { sort: 'name', order: 1 }),
      ]);
    },
    addToOrder(dish) {
      let index = this.order.dishes.findIndex((el) => el.dishId === dish.id);
      if (index > -1) {
        this.order.dishes[index].qty += 1;
      } else {
        this.order.dishes.push({
          name: dish.name,
          dishId: dish.id,
          qty: 1,
          price: dish.price,
        });
      }
    },
    decrease(dishId) {
      let index = this.order.dishes.findIndex((el) => el.dishId === dishId);
      if (index > -1) {
        this.order.dishes[index].qty -= 1;
        if (this.order.dishes[index].qty === 0) {
          this.order.dishes.splice(index, 1);
        }
      }
    },
    async saveOrder(order) {
      let dishesDetails = order.dishes.map((el) => ({
        dishId: el.dishId,
        qty: el.qty,
        salePrice: el.price,
      }));
      // this.loadingButton = true;
      try {
        await this.$store.dispatch('ordersModule/create', {
          history: this.historyMode,
          dishesDetails,
          date: this.order.date,
          client: this.order.client,
        });
        this.order.dishes = [];
        this.order.client = '';
      } finally {
        // this.loadingButton = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
img {
  float: left;
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* -------------------------------------
    GLOBAL
    A very basic CSS reset
------------------------------------- */

img {
  max-width: 100%;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
}

.header {
  width: 100%;
}
/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
  margin-bottom: 0;
}

.first {
  margin-top: 0;
}

.aligncenter {
  text-align: center;
}

.alignright {
  text-align: right;
}

.alignleft {
  text-align: left;
}

.clear {
  clear: both;
}

/* -------------------------------------
    INVOICE
    Styles for the billing table
------------------------------------- */
.invoice {
  margin: 20px auto;
  text-align: left;
  width: 80%;
}
.invoice td {
  padding: 5px 0;
}
.invoice .invoice-items {
  width: 100%;
}
.invoice .invoice-items td {
  border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
  font-weight: 700;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
  h1,
  h2,
  h3,
  h4 {
    font-weight: 600 !important;
    margin: 20px 0 5px !important;
  }

  h1 {
    font-size: 22px !important;
  }

  h2 {
    font-size: 18px !important;
  }

  h3 {
    font-size: 16px !important;
  }

  .container {
    width: 100% !important;
  }

  .content,
  .content-wrap {
    padding: 10px !important;
  }

  .invoice {
    width: 100% !important;
  }
  .dish-name {
    font-weight: 500;
  }
}
</style>
