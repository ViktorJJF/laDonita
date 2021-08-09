<template>
  <core-view-slot view-name="Órdenes Menú">
    <div class="row gutters">
      <div class="col-12 col-sm-9">
        <div class="row gutters">
          <div
            class="col-12 col-sm-6 col-md-6 col-lg-4"
            v-for="(dish, idx) in dishes"
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
                  <div class="">{{ dish.name }}</div>
                </div>
                <div class="card-footer text-center">
                  <a href="#" class="btn btn-success btn-block">Agregar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <div class="card-body">
          <table class="main" width="100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="content-block">
                  <table class="invoice">
                    <tbody>
                      <tr>
                        <td>
                          Karla Xiomara<br />Recibo #12345<br />08 de Agosto de
                          2021
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
                              <tr>
                                <td>Picante a la Tacneña (x2)</td>
                                <td class="alignright">S/.20.00</td>
                              </tr>
                              <tr>
                                <td>Chicharrón de Chancho</td>
                                <td class="alignright">S/.10.00</td>
                              </tr>
                              <tr class="total">
                                <td class="alignright" width="80%">Total</td>
                                <td class="alignright">S/.30.00</td>
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
        </div>
        <div class="card-footer text-center">
          <a href="#" class="btn btn-info btn-block">Terminar pedido</a>
        </div>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
import CoreViewSlot from '@/components/core/CoreViewSlot.vue';

export default {
  components: {
    CoreViewSlot,
  },
  data() {
    return {
      dishes: [
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.26-PM-1024x678.jpeg',
          name: 'Picante a la Tacneña',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.29-PM.jpeg',
          name: 'Pollo a la parrilla',
          price: 25,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.27-PM-1024x605.jpeg',
          name: 'Chicharrón de Chancho',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.34-PM.jpeg',
          name: 'Arroz con Pollo',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.26-PM-1024x678.jpeg',
          name: 'Picante a la Tacneña',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.29-PM.jpeg',
          name: 'Pollo a la parrilla',
          price: 25,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.27-PM-1024x605.jpeg',
          name: 'Chicharrón de Chancho',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.34-PM.jpeg',
          name: 'Arroz con Pollo',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.26-PM-1024x678.jpeg',
          name: 'Picante a la Tacneña',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.29-PM.jpeg',
          name: 'Pollo a la parrilla',
          price: 25,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.27-PM-1024x605.jpeg',
          name: 'Chicharrón de Chancho',
          price: 15,
        },
        {
          img: 'https://ladonita.com/wp-content/uploads/2021/04/WhatsApp-Image-2021-04-15-at-4.02.34-PM.jpeg',
          name: 'Arroz con Pollo',
          price: 15,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
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
* {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  font-size: 14px;
}

img {
  max-width: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: none;
  width: 100% !important;
  height: 100%;
  line-height: 1.6;
}

/* Let's make sure all tables have defaults */
table td {
  vertical-align: top;
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
    TYPOGRAPHY
------------------------------------- */
h1,
h2,
h3 {
  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
  color: #000;
  line-height: 1.2;
  font-weight: 400;
}

h1 {
  font-size: 32px;
  font-weight: 500;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 14px;
  font-weight: 600;
}

p,
ul,
ol {
  font-weight: normal;
}
p li,
ul li,
ol li {
  margin-left: 5px;
  list-style-position: inside;
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
}
</style>
