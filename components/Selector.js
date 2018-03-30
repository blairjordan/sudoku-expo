import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class Selector extends React.Component {

  constructor(props) {
    super(props);
  }

  renderButton(number, index) {
    const { buttonContainer, cellText } = styles;
    return (
      <TouchableOpacity 
        key={index} 
        onPress={() => this.props.onPress(number)}
      >
        <View style={buttonContainer}>
          <Text style={cellText}>{number}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { selectorContainer } = styles;
    return (
    <View style={selectorContainer}>
      {[...Array(9).keys()].map((number, index) => this.renderButton(++number, index))}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  selectorContainer: {
    justifyContent: 'flex-start',
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 30
  }
});
