import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default function formatDate(dateString) {
  const d = dayjs(dateString).locale('ru');
  const diff = d.startOf('day').diff(dayjs().startOf('day'), 'day');
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Завтра';
  if (diff === -1) return 'Вчера';
  return d.format('D MMMM YYYY');
}
