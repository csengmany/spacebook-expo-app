import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const SelectRange = ({
  step,
  minRangeValue,
  maxRangeValue,
  fetchRangeValues,
  setFetchRangeValues,
  suffix,
}) => {
  const MIN = minRangeValue;
  const MAX = maxRangeValue;

  const [rangeValues, setRangeValues] = useState([MIN, MAX]);

  useEffect(() => {
    setRangeValues(fetchRangeValues);
  }, [fetchRangeValues]);

  const renderMarker = ({ pressed, value }) => (
    <View style={[styles.markerContainer, pressed && styles.markerContainerPressed]}>
      <Text style={[styles.markerText, pressed && styles.markerTextPressed]}>
        {value}{suffix}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <MultiSlider
        step={step}
        min={MIN}
        max={MAX}
        values={rangeValues}
        onValuesChange={(values) => {
          setRangeValues(values)
        }}
        onValuesChangeFinish={(values) => {
          setFetchRangeValues(values);
        }}
        trackStyle={styles.trackStyle}
        selectedStyle={styles.selectedStyle}
        markerStyle={styles.markerStyle}
        customMarker={(props) => renderMarker({ ...props, value: props.currentValue })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical:7,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 12,
    color: 'gray',
  },
  trackStyle: {
    height: 3,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  selectedStyle: {
    backgroundColor: '#FF385C',
  },
  markerStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF385C',
    borderWidth: 1,
    borderColor: 'white',
  },
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 20,
    backgroundColor: '#FF385C',
    borderRadius: 4,
  },
  markerContainerPressed: {
    backgroundColor: 'red',
  },
  markerText: {
    fontSize: 12,
    color: 'white',
  },
  markerTextPressed: {
    color: 'black',
  },
});

export default SelectRange;
