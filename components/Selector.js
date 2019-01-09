import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class Selector extends React.Component {
  constructor(props) {
    super(props);
  }

  renderButton({ number, index, label }) {
    const { buttonContainer, cellText } = styles;
    return (
      <TouchableOpacity 
        key={index} 
        onPress={() => this.props.onPress(number)}
      >
        <View style={buttonContainer}>
          <Text style={cellText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { selectorRow } = styles;
    return (
    <View>
      <View style={ selectorRow }>
        {[...Array(4).keys()].map((number, index) => this.renderButton({ number: ++number, index, label: number }))}
        {this.renderButton({ number: 0, index: 99, label: 'C' })}
      </View>
      <View style={ selectorRow }>
        {[...Array(9).keys()].splice(4).map((number, index) => this.renderButton({ number: ++number, index, label: number }))}
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  selectorRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: 40*9,
    height: 40,
    marginTop: 15
  },
  buttonContainer: {
    flex:1,
    backgroundColor: '#e5efff',
    borderRadius: 2.5,
    borderWidth: 1.5,
    borderColor: '#c1d9ff',
    width: 63,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 30
  }
});
