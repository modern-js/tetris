const React = require('react');
const ReactDOM = require('react-dom');
const CanvasRow = require('./CanvasRow');
const tetris = require('./tetris');
const PropTypes = require('prop-types');
const _ = require('lodash');

const Component = React.Component;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return tetris.getInitialState(this.props.height, this.props.width);
  }
  componentDidMount() {
    const step = () =>{
      this.setState(tetris.step(this.state));
      setTimeout(step.bind(this), this.state.speed);
    };
    step.call(this);
    ReactDOM.findDOMNode(this).focus();
  }
  _handleKey(event) {
    console.log(event)
    console.log(this)
    event.preventDefault();
    const actionMap = {
      'ArrowUp': tetris.rotate,
      'ArrowDown': tetris.moveDown,
      'ArrowLeft': tetris.moveLeft,
      'ArrowRight': tetris.moveRight,
      ' ': tetris.drop
    };
    if (event.key in actionMap) {
      this.setState(actionMap[event.key](this.state))
    }
  }
  _onFocus(event) {
    _.set(this, 'state.running', true);
  }
  _onBlur(event) {
    _.set(this, 'state.running', false);
  }
  render () {
    const rows = this.state.board.map(function(row, i) {
      return CanvasRow({ key: i, row: row });
    });
    return React.createElement('div', {
      ref: 'board',
      className: 'board',
      tabIndex: 0,
      onKeyDown: event => {
        this._handleKey.bind(event, this);
        this._handleKey(event);
      },
      onFocus: this._onFocus,
      onBlur: this._onBlur
    }, rows);
  }
}
App.defaultProps = {
  height: 15,
  width: 10
};
App.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};
module.exports = App;