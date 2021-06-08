import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

required.$message = 'Este campo es requerido';

export default {
  useVuelidate,
  required,
};
