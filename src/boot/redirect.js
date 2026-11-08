import { LocalStorage } from 'quasar';

export default ({ router }) => {
  if (!LocalStorage.has('first_visit')) {
    router.push('/anlo-la-gi.html');
    LocalStorage.set('first_visit', true);
  }
};
