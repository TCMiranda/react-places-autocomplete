'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var Item = (function (_React$Component) {
  function Item(props) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, props);
  }

  _inherits(Item, _React$Component);

  _createClass(Item, [{
    key: 'handleClick',
    value: function handleClick(event) {
      event.preventDefault();
      if (this.props.onSuggestSelect) {
        this.props.onSuggestSelect(this.props.suggest);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _React2['default'].createElement(
        'li',
        { className: 'geosuggest-item' + (!!this.props.isActive ? ' geosuggest-item--active' : ''), onClick: this.handleClick.bind(this) },
        this.props.suggest.label
      );
    }
  }]);

  return Item;
})(_React2['default'].Component);

exports['default'] = Item;
module.exports = exports['default'];