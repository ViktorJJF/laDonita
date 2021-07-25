<template>
  <core-view-slot view-name="Nueva Compra">
    <div class="row gutters">
      <div class="col-6">
        <label>Fecha desde:</label>
        <v-date-picker v-model="date">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="form-control bg-white border px-2 py-1 rounded"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="col-6">
        <label for="provider">Proveedor</label>
        <div class="form-group">
          <select
            id="provider"
            required
            placeholder="Selecciona un proveedor"
            v-model="providerId"
            class="form-control"
          >
            <option :value="null" disabled selected>
              Selecciona una opción
            </option>
            <option
              :value="provider.id"
              v-for="provider in $store.state.providersModule.providers"
              :key="provider.id"
            >
              {{ provider.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="row gutters">
      <div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">
        <div class="card">
          <div class="card-body p-0">
            <div class="invoice-container">
              <div class="invoice-header">
                <!-- Row start -->
                <div class="row gutters">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="invoice-logo">Nueva Compra</div>
                  </div>
                </div>
                <!-- Row end -->
              </div>

              <div class="invoice-body invoice-address">
                <!-- Row start -->
                <div class="row gutters">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>X</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio de Compra (x unidad)</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(sale, idx) in purchases" :key="idx">
                            <td>
                              <a
                                href="#"
                                class="btn btn-danger btn-sm"
                                @click="deleteSale(idx)"
                              >
                                <i class="icon-close"></i>
                              </a>
                            </td>
                            <td>{{ sale.productDetails.name }}</td>
                            <td>{{ sale.qty }}</td>
                            <td>{{ sale.productDetails.price }}</td>
                            <td>
                              {{
                                parseInt(sale.qty) *
                                parseFloat(sale.productDetails.price)
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <!-- Row end -->

                <!-- Row start -->
                <div class="invoice-payment">
                  <div class="row gutters">
                    <div class="col-lg-6 col-md-6 col-sm-12"></div>
                    <div class="col-lg-6 col-md-6 col-sm-12 order-last">
                      <table class="table m-0">
                        <tbody>
                          <tr>
                            <td>
                              <!-- <p>
                                Subtotal<br />
                                Shipping &amp; Handling<br />
                                Tax<br />
                              </p> -->
                              <h5 class="text-danger">
                                <strong>Gran Total</strong>
                              </h5>
                            </td>
                            <td>
                              <!-- <p>
                                $7270.00<br />
                                $30.00<br />
                                $50.00<br />
                              </p> -->
                              <h5 class="text-danger">
                                <strong
                                  >S/.{{
                                    purchases
                                      .reduce(
                                        (a, b) => a + b.salePrice * b.qty,
                                        0,
                                      )
                                      .toFixed(2)
                                  }}</strong
                                >
                              </h5>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <button
                        class="btn btn-success"
                        @click="saveSale(purchases)"
                      >
                        Completar Compra
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Row end -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
        <div class="card">
          <div class="card-body p-0">
            <div class="invoice-container">
              <div class="invoice-header">
                <!-- Row start -->
                <div class="row gutters">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="invoice-logo">Lista de Productos</div>
                  </div>
                </div>
                <!-- Row end -->
              </div>

              <div class="invoice-body invoice-address">
                <!-- Row start -->
                <div class="row gutters">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <ProductsTable
                      :productsToShow="4"
                      :isSale="true"
                      :isPurchase="true"
                      :headers="[
                        { text: 'Producto', value: 'name' },
                        { text: 'Cantidad', value: 'qty' },
                        { text: 'Acciones', value: 'actions' },
                      ]"
                      @addToSale="addToSale"
                    ></ProductsTable>
                  </div>
                </div>
                <!-- Row end -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import ProductsTable from '@/components/ProductsTable.vue';

export default {
  components: {
    CoreViewSlot,
    ProductsTable,
  },
  data() {
    return {
      purchases: [],
      date: new Date(),
      providerId: null,
    };
  },
  methods: {
    addToSale(item) {
      this.purchases.push({
        productDetails: item,
        productId: item.id,
        qty: item.qty,
        purchasePrice: item.purchasePrice,
        salePrice: item.price,
        providerId: null,
      });
    },
    deleteSale(index) {
      this.purchases.splice(index, 1);
    },
    async saveSale(products) {
      this.loadingButton = true;
      products = this.$deepCopy(products);
      // delete unnecesary info
      // for (const product of products) {
      //   delete product['productDetails'];
      // }
      // validate if historyMode, set history mode to products
      // if (this.historyMode) {
      //   for (const product of products) {
      //     product.history = true;
      //   }
      // } else {
      //   for (const product of products) {
      //     product.history = false;
      //   }
      // }
      try {
        // date = new Date(date);
        // date = new Date(date.getTime() - date.getTimezoneOffset() * -60000);

        await this.$store.dispatch('purchasesModule/create', {
          history: this.historyMode,
          products,
          date: this.date,
          providerId: this.providerId,
        });
        // for (const product of products) {
        //   // if (!product.history) {
        //   this.$store.commit('productsModule/updateStock', {
        //     productId: product.productId,
        //     qty: -product.qty,
        //   });
        //   // }
        // }
        this.purchases = [];
      } finally {
        this.loadingButton = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 15px;
}
</style>
