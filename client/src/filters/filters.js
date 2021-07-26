import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import currencyFormatter from 'currency-formatter';

export default function initialize(app) {
  app.config.globalProperties.$filters = {
    formatDate(value) {
      try {
        const formattedValue = new Date(value);
        return format(new Date(formattedValue), "d 'de' MMMM 'del' yyyy", {
          locale: es,
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },
    formatMoney(value) {
      if (!value && value !== 0) return 'Sin moneda';
      return currencyFormatter.format(value, { code: 'PE' });
    },
  };
}
