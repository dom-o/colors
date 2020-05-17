import React, { Component } from 'react';
import colorList from './color_data';
import getColorCombos, {hex_to_rgb} from './colors';

import './App.css';

class App extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.calculate = this.calculate.bind(this)
        this.contrastOnChange = this.contrastOnChange.bind(this)
        this.state = {
            on: Array(0),
            combos: Array(0),
            contrast: 50,
        };
    }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Colors</h1>
          <p className="App-intro">
            Picks the color pairs that look most different from each other.
          </p>
        </div>
        <div className="Container">
            <CardGroup
                on={this.state.on}
                clickFunction={this.handleClick}
                cards={getColorList()}
                cardHeight={55}
                cardWidth={55}
            />
            <button onClick={this.handleClearClick}>clear</button>
            <button onClick={this.calculate}>get color pairs</button>

            <input type="range" id="contrast" min="1" max="99" step="1" value={this.state.contrast} onChange={this.contrastOnChange} />

            <CardGroup on={[]} cards={arrToCards(this.state.combos)} cardWidth={70} cardHeight={80} />
        </div>
      </div>
    );
  }

    handleClearClick() {
        this.setState({on: [], combos:[]});
    }

    contrastOnChange(e) {
      this.setState({contrast: e.target.value})
    }

    calculate() {
      const colorIndexes = this.state.on;

      const colors = colorIndexes.map(function(a) { return colorList[a] })
      const rgb = colors.map(hex_to_rgb)

      const contrast = this.state.contrast
      const main_weight = contrast
      const tail_weight = 100 - contrast
      console.log(main_weight)
      console.log(tail_weight)

      const combos = getColorCombos(rgb, 6, main_weight, tail_weight)
      this.setState({combos:combos})
    }

    handleClick(key) {
        var newOn = this.state.on;
        if(this.state.on.includes(key)) {
            newOn.splice(newOn.indexOf(key), 1);
        }
        else {
            newOn.push(key);
        }

        this.setState({on:newOn});

        // if(newOn.length >= 2) {
        //     colorIndexes = newOn;
        //
        //     colors = colorIndexes.map(function(a) {return colorList[a];})
        //     rgb = colors.map(hex_to_rgb);
        //
        //     combos = getColorCombos(rgb, 6, main_weight, tail_weight);
        //     this.setState({combos:combos});
        // }
        // else {
        //     this.setState({combos:[]});
        // }
    }
}

function getColorList() {
    var cards=[], i;

    for(i=0; i<colorList.length; i++) {
        cards.push({squares:[colorList[i]]});
    }
    return cards;
}

function arrToCards(arr) {
    //arr = [[[r,g,b],[r,g,b]], [[r,g,b],[r,g,b]], [[r,g,b],[r,g,b]]]
    var cards=[], colors=[];
    if (arr) {
      cards = arr.map(function(card) {
          colors = card.map(function(color) { return 'rgb('+color.join(',')+')'; });
          return {squares: colors};
      });
    }

    return cards;
    //cards = [{squares:['rgb', 'rgb']}, {squares:['rgb','rgb']}]
}

const CardGroup = (props) => {
    var cardGroupStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(9, min-content)'
    };

    return (
        <div style={cardGroupStyle}>
            {props.cards.map((card, index) =>
                <Card
                    key={index}
                    colorIndex={index}
                    on={props.on.includes(index)}
                    clickFunction={props.clickFunction}
                    width={props.cardWidth}
                    height={props.cardHeight}
                    squares={card.squares}
                />
            )}
        </div>
    );
}

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if(this.props.clickFunction) this.props.clickFunction(this.props.colorIndex);
    }

    render() {
        var cardStyle = {
            display: 'inline-block',
            width: this.props.width,
            height: this.props.height,
            margin: 5,
            boxSizing: 'border-box',
            overflow: 'hidden',
            border: this.props.on ? 'medium solid grey' : 'thin solid black',
            // outline: this.props.on ? 'thin solid white' : 'none',
            boxShadow: this.props.on ? '0 0 0 0.2rem black' : 'none',
            borderRadius: this.props.on ? '10% / 10%' : '5% / 5%'
        };
        return(
            <div style={cardStyle} onClick={this.handleClick}>
                {this.props.squares.map(
                    (color, index) => <Square
                        key={index}
                        color={color}
                        height={cardStyle.height/this.props.squares.length}
                />)}
            </div>
        );
    }
}

const Square = (props) => {
    var squareStyle = {
        backgroundColor: props.color,
        height: props.height
    };

    return (
        <div style={squareStyle}></div>
    );
}

export default App;
