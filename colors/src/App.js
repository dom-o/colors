import React, { Component } from 'react';
import colorList from './color_data';
import getColorCombos, {hex_to_rgb} from './colors';

import logo from './logo.svg';
import './App.css';

    var cards = [
    {squares:['#000','#FFF', '#abac44']}
    ,
    {squares:['#666']}
    ,
    {squares:['#999']}
    ,
];


class App extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.state = {
            on: Array(0),
            combos: Array(0)
        };
    }
    
  render() {
    return (
      <div className="Colors">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Colors</h2>
        </div>
        <p className="App-intro">
          Pick some colors; we'll find the most perceptually distant pairs.
        </p>
        <div className='container'>
            <CardGroup 
                on={this.state.on}
                clickFunction={this.handleClick} 
                cards={getColorList()}
                cardHeight={50}
                cardWidth={45}
            />
            <button onClick={this.handleClearClick}>clear palette</button>
            <CardGroup on={[]} cards={arrToCards(this.state.combos)} cardWidth={70} cardHeight={80} />
        </div>
      </div>
    );
  }
  
    handleClearClick() {
        this.setState({on: []});
    }
    
    handleClick(key) {
        var colorIndexes, combos, rgb, colors;
        
        var newOn = this.state.on;
        if(this.state.on.includes(key)) {
            newOn.splice(newOn.indexOf(key), 1);
        }
        else {
            newOn.push(key);
        }

        this.setState({on:newOn});
        
        if(newOn.length >= 2) {
            colorIndexes = newOn;

            colors = colorIndexes.map(function(a) {return colorList[a];})
            rgb = colors.map(hex_to_rgb);

            combos = getColorCombos(rgb, 6);
            console.log('combos');
            console.log(combos);
            console.log('color list');
            console.log(getColorList());
            this.setState({combos:combos});
        }        
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
    var cards=[], i, joined, squares=[], j;
    console.log(arr);
    for(i=0; i<arr.length; i++) {
        for(j=0; j<arr[i].length; j++) {
            console.log(arr[i][j])
            joined= 'rgb('+arr[i][j].join(',')+')';
            squares.push(joined);
        }
        
        cards.push({squares:squares});
    }
    
    console.log('arr to cards')
    console.log(cards)
    return cards;
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
            border: this.props.on ? 'solid' : 'none' 
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
        <div style={squareStyle}>
        
        </div>
    );
}

export default App;
