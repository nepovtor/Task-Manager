import React from 'react';
import DatePicker from 'react-native-date-picker';

const IOSDatePicker = ({ open, date, mode, onConfirm, onCancel, dark }) => (
  <DatePicker
    modal
    open={open}
    date={date}
    mode={mode}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText="Готово"
    cancelText="Отмена"
    theme={dark ? 'dark' : 'light'}
  />
);

export default IOSDatePicker;
