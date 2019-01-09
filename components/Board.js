import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import Selector from './Selector';

// Create a custom animation
export const pulseMore = {
  0: { scale: 1 },
  0.5: { scale: 1.2 },
  1: { scale: 1 } };
Animatable.initializeRegistryWithDefinitions({ pulseMore });

export default class Board extends React.Component {

  readLevel = ({ level, grid })  => {
    level.split('|').forEach((row, rowIdx) => {
      row.split("").forEach((cell, colIdx) => {
        if (cell === '.') {
          grid[colIdx][rowIdx].value = 0;
        } else {
          grid[colIdx][rowIdx].value = Number(cell);
          grid[colIdx][rowIdx].locked = true;
        }
      });
    });
  }

  createGrid = (width, height) => {
    return Array(width * height).fill().map(
      () => new Array(width * height).fill().map(
        () => new (function(){ 
          this.value = 0;
          this.notes = [];
          this.duplicate = false;
          this.error = 0;
          this.locked = false;
        })()
      )
    );
  };

  reset({ width, height, level }) {    
    let grid = new this.createGrid(width, height);
    if (level) {
      this.readLevel({ level, grid });
      this.checkErrors({ grid });
    }
    return { grid, selected: null };
  }

  constructor(props) {
    super(props);
    const { width, height, level } = this.props;
    this.state = this.reset({ width, height, level });
  }

  componentWillReceiveProps(nextProps) {
    const { width, height, level } = nextProps;
    this.setState(this.reset({ width, height, level }));
  }
  
  countItems({ grid, prop, value }) {
    return grid.reduce((total, currentRow, rowIdx) => {
      return total += currentRow.reduce((colTotal, currentCell, cellIdx) => {
        if (currentCell[prop] === value) {
            return ++colTotal;
        } else {
          return colTotal;
        }
      }, 0);
    }, 0);
  }

  // Return a reference to all elements in a subset of the grid
  getRegion = ({ grid, regionRow = null, regionCol = null} ) => {
    const { width, height } = this.props;
    return grid.reduce((previousRow, currentRow, rowIdx) => {
      currentRow.forEach((cell, colIdx) => {
        if ( regionRow === null && colIdx === regionCol ) {
          previousRow.push(cell);
        } else if ( regionCol === null && rowIdx === regionRow) {
          previousRow.push(cell);
        } else if ( regionRow === Math.floor(rowIdx / width) 
          && regionCol === Math.floor(colIdx / height) ) {
          previousRow.push(cell);
        }
      });
      return previousRow;
    }, []);
  }

  clearErrors = grid => {
    grid.forEach(row => {
      row.forEach(cell => {
        cell.duplicate = false;
        cell.error = 0;
      });
    });
  }

  checkDuplicates = (region) => {
    const regionValues = region.map((cell) => cell.value).filter(value => value !== 0);

    const duplicateValues = regionValues.reduce((previous, current, idx) => {
        if (regionValues.indexOf(current) < idx) {
            previous.push(current);
        }
        return previous;
    }, []);

    // Set duplicate flags
    let errors = false;
    region.forEach((cell) => {
      if (duplicateValues.indexOf(cell.value) !== -1) {
        errors = true;
        cell.duplicate = true;
      }
    });

    // Set error flags. Add opacity to error cell.
    region.forEach((cell) => {
      if (errors) { cell.error += 3.3; }
    });
  }

  // Check for errors in columns, rows and nonets respectively
  checkErrors = ({ grid }) => {
    const { width, height } = this.props;

    for (let i = 0; i < width * height; i++) {
      this.checkDuplicates(this.getRegion({ grid, regionCol: null, regionRow: i }));
    }
    
    for (let j = 0; j < width * height; j++) {
      this.checkDuplicates(this.getRegion({ grid, regionCol: j, regionRow: null }));
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        this.checkDuplicates(this.getRegion({ 
          grid, 
          regionCol: i, 
          regionRow: j 
        }));
      }
    }
  }

  renderRow({ row, rowIdx }) {
    return (
      <View key={rowIdx}>
        {row.map((cell, colIdx) => this.renderCells({ cell, colIdx, rowIdx }))}
      </View>
    );
  }

  errorStyle = cell => {
    return (cell.error) ? { backgroundColor: `rgba(255, 116, 102, ${cell.error/10})` } : {};
  };

  duplicateStyle = cell => {
    return (cell.duplicate) ? { backgroundColor: 'rgb(255, 116, 102)' } : {};
  };

  lockedStyle = cell => {
    if (cell.locked && cell.duplicate) 
      return { backgroundColor: 'rgb(170, 90, 99)' }
    else if (cell.locked)
      return { backgroundColor: '#ccc'  }
    else
      return {};
  };

  selectStyle = (rowIdx, colIdx) => {
    const { selected } = this.state;
    return (
      selected !== null &&
      selected.row === rowIdx && 
      selected.column === colIdx) ?
        { backgroundColor: '#fff247' } : {};
  };
  
  borderStyle = (rowIdx, colIdx) => {
    let cellBorder = {};
    const separatorWidth = 3;
  
    if (((rowIdx+1) % this.props.width) === 0) {
      cellBorder.borderRightWidth = separatorWidth;
      cellBorder.borderRightColor = '#c1d9ff';
    } else if (rowIdx === 0) {
      cellBorder.borderLeftWidth = separatorWidth;
      cellBorder.borderLeftColor = '#c1d9ff';
    }
  
    if (((colIdx+1) % this.props.height) === 0) {
      cellBorder.borderBottomWidth = separatorWidth;
      cellBorder.borderBottomColor = '#c1d9ff';
    } else if (colIdx === 0) {
      cellBorder.borderTopWidth = separatorWidth;
      cellBorder.borderTopColor = '#c1d9ff';
    }
  
    return cellBorder;
  }

  onSelect = ({ cell, rowIdx, colIdx }) => {
    const { selected } = this.state;

    if (!cell.locked) {
      this.setState({ selected: { row: rowIdx, column: colIdx } })
    }
  }

  renderCellText = ( { duplicate, locked, value } ) => {
    const { cellText } = styles;
    let displayValue = ( value ) ? value : '';

    if (duplicate) {
      return (
        <Animatable.Text 
          animation="pulseMore" 
          easing="ease-out" 
          iterationCount="infinite"
          style={cellText}>
          {displayValue}
        </Animatable.Text>
      );
    } else {
      return (
        <Text style={cellText}>
          {displayValue}
        </Text>
      );
    }
  }

  renderCell = ({ cell, rowIdx, colIdx })  => {
    const { value, notes, duplicate, locked, error } = cell;
    const { cellStyle } = styles;

    return (
      <View 
        style={[
        cellStyle,
        this.errorStyle(cell),
        this.duplicateStyle(cell),
        this.lockedStyle(cell),
        this.selectStyle(rowIdx, colIdx)
        ]}
      >
        {this.renderCellText({ duplicate, locked, value })}
      </View>
    );
  }

  renderCells({ cell, rowIdx, colIdx }) {
    return (
      <TouchableOpacity 
        style={[
          {flex:1},
          this.borderStyle(rowIdx, colIdx)
        ]}
        onPress={() => this.onSelect({ cell, rowIdx, colIdx })}
        key={colIdx}
      >
        {this.renderCell({ cell, rowIdx, colIdx })}
      </TouchableOpacity>
    );
  }

  selectorPressed = (selectedNumber) => {
    const { selected } = this.state;
    const { width, height } = this.props;

    if (selected !== null) {
      let grid = _.cloneDeep(this.state.grid);
      grid[selected.row][selected.column].value = selectedNumber;
      this.clearErrors(grid);
      this.checkErrors({ grid });
      
      if (!this.countItems({ grid, prop: 'value', value: 0 })
        && this.countItems({ grid, prop: 'error', value: 0 }) === Math.pow(width * height, 2))
       this.props.onComplete()
       
      this.setState({ grid });
    }
  }

  render() {
    const { boardContainer } = styles;
    return (
    <Animatable.View animation="fadeInUp" duration={2000}>
        <View style={boardContainer}>
            {this.state.grid.map((row, rowIdx) => this.renderRow({ row, rowIdx }))}
        </View>
        <Animatable.View animation="lightSpeedIn" delay={1000}>
          <Selector onPress={(selectedNumber) => this.selectorPressed(selectedNumber)}/>
        </Animatable.View>
    </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  boardContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: 40*9,
    height: 40*9
  },
  cellStyle: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 39,
    height: 39,
    borderRadius: 1.5,
    borderWidth: 0.5,
    backgroundColor: '#e5efff',
    borderColor: '#c1d9ff'
  },
  cellText: {
    fontSize: 30
  }
});
