import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Board from './components/Board';
import config from './assets/config.json';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { levelNo: 1, level: config.levels[0] };
  }

  render() {
    const { container, titleStyle } = styles;
    const { levelNo, level } = this.state;
    return (
      <View style={container}>
        <Animatable.Text 
        style={titleStyle}
        animation="bounceInDown"
        delay={1500}
        duration={1500}
        >
          Level {levelNo}
        </Animatable.Text>
        <Board 
          width={3} 
          height={3}
          level={level}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfdff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: 25,
    marginBottom: 10
  }
});
