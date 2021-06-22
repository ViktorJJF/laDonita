<template>
  <core-view-slot view-name="Nueva Venta">
    <div class="row gutters">
      <div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">
        <div class="card">
          <div class="card-body p-0">
            <div class="invoice-container">
              <div class="invoice-header">
                <!-- Row start -->
                <div class="row gutters">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <div class="invoice-logo">Nueva Venta</div>
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
                            <th>Precio de venta (x unidad)</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(sale, idx) in sales" :key="idx">
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
                                    sales
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
      sales: [],
    };
  },
  methods: {
    addToSale(item) {
      console.log(item);
      this.sales.push({
        productDetails: item,
        productId: item.id,
        qty: item.qty,
        purchasePrice: item.purchasePrice,
        salePrice: item.price,
      });
    },
    deleteSale(index) {
      this.sales.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
