import React from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTheme } from 'react-native-paper';

LocaleConfig.locales.ru = {
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
  dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
  dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

export default function MiniCalendar({
  tasks,
  monthDate,
  selectedDates = [],
  onSelectDate,
  onChangeMonth,
}) {
  const paper = useTheme();

  const statusColors = {
    'В процессе': '#2196F3',
    Завершена: '#4CAF50',
    Отменена: '#F44336',
  };

  const marked = tasks.reduce((acc, task) => {
    const date = new Date(task.date).toISOString().split('T')[0];
    const color = statusColors[task.status] || paper.colors.primary;
    const dot = { key: task.status, color };
    if (acc[date]) {
      const dots = acc[date].dots || [];
      if (!dots.some((d) => d.key === dot.key)) {
        dots.push(dot);
      }
      acc[date].dots = dots;
    } else {
      acc[date] = { dots: [dot] };
    }
    return acc;
  }, {});

  selectedDates.forEach((d) => {
    marked[d] = {
      ...(marked[d] || {}),
      selected: true,
      selectedColor: paper.colors.primary,
    };
  });

  return (
    <Calendar
      current={monthDate.toISOString().split('T')[0]}
      onMonthChange={(m) => onChangeMonth(new Date(m.year, m.month - 1, 1))}
      onDayPress={(day) => onSelectDate(day.dateString)}
      markedDates={marked}
      markingType="multi-dot"
      hideExtraDays
      firstDay={1}
      enableSwipeMonths
      theme={{
        todayTextColor: paper.colors.primary,
        selectedDayBackgroundColor: paper.colors.primary,
        arrowColor: paper.colors.primary,
      }}
      style={{ marginBottom: 8 }}
    />
  );
}
