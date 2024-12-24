// import { View, StyleSheet } from "react-native";

// const DotComponent = ({ selected }) => {
//   return (
//     <View
//       style={[
//         styles.dot,
//         { backgroundColor: selected ? "#007BFF" : "#ccc" },
//       ]}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
// });


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DotComponent = ({ selected }) => {
  return (
    <View
      style={[
        styles.dot,
        { backgroundColor: selected ? "#007BFF" : "#ccc" },
      ]}
    />
  )
}

export default DotComponent

const styles = StyleSheet.create({
  dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
      },
})