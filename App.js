import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Board from './components/Board';
import config from './assets/config.json';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { levelNo: 0, level: config.levels[0] };
  }

  levelChange = ({ levelNo, level }) => {
    this.setState({ levelNo, level });
  }

  render() {
    const { container, titleStyle, endGameStyle } = styles;
    const { levelNo, level } = this.state;

    if (levelNo === config.levels.length) {
      return (
        <View style={container}>
          <Animatable.Text
            style={endGameStyle}
            animation="rubberBand" 
            easing="ease-out" 
            iterationCount="infinite"
            duration={6000}
          >
            Congratulations!
          </Animatable.Text>
        </View>
      );
    } else {
      return (
        <View style={container}>
          <Animatable.Text 
          style={titleStyle}
          animation="bounceInDown"
          delay={1500}
          duration={1500}
          >
            Level {levelNo + 1}
          </Animatable.Text>

          <Board 
            width={3} 
            height={3}
            level={level}
            onComplete={() => this.levelChange({ levelNo: levelNo + 1, level: config.levels[levelNo+1] })}
          />

        </View>
      );
    }
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
  },
  endGameStyle: {
    fontSize: 40
  }
});
