import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';

const IOSDatePicker = ({ open, date, mode, onConfirm, onCancel, dark }) => {
  const [currentDate, setCurrentDate] = useState(date);

  useEffect(() => {
    if (open) {
      setCurrentDate(date);
    }
  }, [open, date]);

  if (!open) return null;

  return (
    <Modal transparent animationType="slide" visible={open} onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: dark ? '#1c1c1e' : '#fff' },
          ]}
        >
          <View style={styles.toolbar}>
            <Button onPress={onCancel} compact uppercase={false} textColor="#4A90E2">
              Отмена
            </Button>
            <Button
              onPress={() => onConfirm(currentDate)}
              compact
              uppercase={false}
              textColor="#4A90E2"
            >
              Готово
            </Button>
          </View>
          <DateTimePicker
            value={currentDate}
            mode={mode}
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setCurrentDate(selectedDate);
              }
            }}
            themeVariant={dark ? 'dark' : 'light'}
            textColor={dark ? '#fff' : undefined}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default IOSDatePicker;
