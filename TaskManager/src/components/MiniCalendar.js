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

export default function MiniCalendar({ tasks, monthDate, selectedDate, onSelectDate, onChangeMonth }) {
  const paper = useTheme();

  const marked = tasks.reduce((acc, task) => {
    const date = new Date(task.date).toISOString().split('T')[0];
    acc[date] = {
      ...(acc[date] || {}),
      marked: true,
      dotColor: paper.colors.primary,
    };
    return acc;
  }, {});

  if (selectedDate) {
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: paper.colors.primary,
    };
  }

  return (
    <Calendar
      current={monthDate.toISOString().split('T')[0]}
      onMonthChange={(m) => onChangeMonth(new Date(m.year, m.month - 1, 1))}
      onDayPress={(day) => onSelectDate(day.dateString)}
      markedDates={marked}
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
