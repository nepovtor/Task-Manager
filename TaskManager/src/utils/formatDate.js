import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default function formatDate(dateString) {
  const d = dayjs(dateString).locale('ru');
  return d.format('D MMMM YYYY, HH:mm');
}
