import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { windowWidth } from '../../Constants/Dimensions';

const TimePickerColumn = ({ data, selected, onSelect, width }) => (
  <View style={[styles.timePickerColumn, { width }]}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.timeOption, item === selected && styles.selectedTimeOption]}
          onPress={() => onSelect(item)}
        >
          <Text style={[styles.timeOptionText, item === selected && styles.selectedTimeOptionText]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  timePickerColumn: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
  },
  timeOption: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  selectedTimeOption: {
    backgroundColor: 'rgba(178, 27, 240, 0.2)',
  },
  timeOptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  selectedTimeOptionText: {
    color: '#B21BF0',
    fontWeight: 'bold',
  },
});

export default TimePickerColumn; 