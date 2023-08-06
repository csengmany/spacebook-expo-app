import React, { useState } from 'react';
import {View, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker-modal';

const CustomDatePicker = ({ onDateChange, unavailableDates }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const isDateDisabled = (date) => {
    return unavailableDates.some((unavailableDate) => isSameDay(date, unavailableDate));
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <View>
      <DatePicker
        style={styles.datePicker}
        date={selectedDate}
        mode="date"
        placeholder="Select date"
        format="YYYY-MM-DD"
        minDate={new Date()}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        disabled={false}
        customStyles={{
          dateInput: {
            borderColor: '#ccc',
            borderRadius: 5,
          },
          dateText: {
            fontSize: 18,
            color: '#000',
            padding: 10,
          },
          dateTouchBody: {
            backgroundColor: '#fff',
          },
          disabled: {
            backgroundColor: '#ddd',
          },
        }}
        onDateChange={handleDateChange}
        disabledDates={unavailableDates.filter(isDateDisabled)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  datePicker: {
    width: '100%',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default CustomDatePicker;
