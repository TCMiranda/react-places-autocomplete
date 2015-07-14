'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _google = require('google');

var _google2 = _interopRequireDefault(_google);

var Input = (function (_React$Component) {
  _inherits(Input, _React$Component);

  function Input(props) {
    var _this = this;

    _classCallCheck(this, Input);

    _get(Object.getPrototypeOf(Input.prototype), 'constructor', this).call(this, props);

    this.handleInputChange = function (e) {
      _this.setState({ userInput: e.target.value }, function () {
        return _this.updateAutocomplete();
      });
    };

    this.handleInputFocus = function () {
      _this.updateSuggests();
      _this.setState({ isSuggestsHidden: false });
    };

    this.handleInputBlur = function () {
      setTimeout(function () {
        _this.setState({ isSuggestsHidden: true });
      }, 100);
    };

    this.handleInputKeyDown = function (event) {
      switch (event.which) {
        case 40:
          // DOWN
          event.preventDefault();
          _this.activateSuggest('next');
          break;
        case 38:
          // UP
          event.preventDefault();
          _this.activateSuggest('prev');
          break;
        case 13:
          // ENTER
          _this.selectSuggest(_this.state.activeSuggest);
          break;
        case 9:
          // TAB
          _this.selectSuggest(_this.state.activeSuggest);
          break;
        case 27:
          // ESC
          _this.handleInputBlur();
          break;
      }
    };

    this.handleSuggestSelect = function (suggest) {
      if (!suggest) {
        suggest = {
          label: _this.state.userInput
        };
      }

      _this.setState({
        isSuggestsHidden: true,
        userInput: suggest.label
      });

      if (suggest.location) {
        _this.props.onSuggestSelect(suggest);
        return;
      }

      _this.geocodeSuggest(suggest);
    };

    this.state = {
      isSuggestsHidden: true,
      userInput: '',
      activeSuggest: null,
      suggests: [],
      geocoder: new _google2['default'].maps.Geocoder(),
      autocompleteService: new _google2['default'].maps.places.AutocompleteService()
    };
  }

  _createClass(Input, [{
    key: 'updateAutocomplete',
    value: function updateAutocomplete() {
      var _this2 = this;

      if (!this.state.userInput.length) {
        return this.updateSuggests();
      }

      this.state.autocompleteService.getPlacePredictions({
        input: this.state.userInput,
        location: this.props.location || new _google2['default'].maps.LatLng(0, 0),
        radius: this.props.radius || 0
      }, function (suggestions) {
        return _this2.updateSuggests(suggestions);
      });
    }
  }, {
    key: 'updateSuggests',
    value: function updateSuggests(suggestsGoogle) {
      var suggests = [];
      var regex = new RegExp(this.state.userInput, 'gim');

      (this.props.fixtures || []).forEach(function (suggest) {
        if (suggest.label.match(regex)) {
          suggest.placeId = suggest.label;
          suggests.push(suggest);
        }
      });

      (suggestsGoogle || []).forEach(function (suggest) {
        suggests.push({
          label: suggest.description,
          placeId: suggest.place_id
        });
      });

      this.setState({ suggests: suggests });
    }
  }, {
    key: 'activateSuggest',
    value: function activateSuggest(direction) {
      var suggestsCount = this.state.suggests.length - 1;
      var next = direction === 'next';
      var newActiveSuggest = null;
      var newIndex = 0;

      for (var i = 0; i <= suggestsCount; i++) {
        if (this.state.suggests[i] === this.state.activeSuggest) {
          newIndex = next ? i + 1 : i - 1;
        }
      }

      if (!this.state.activeSuggest) {
        newIndex = next ? 0 : suggestsCount;
      }

      if (newIndex >= 0 && newIndex <= suggestsCount) {
        newActiveSuggest = this.state.suggests[newIndex];
      }

      this.setState({ activeSuggest: newActiveSuggest });
    }
  }, {
    key: 'geocodeSuggest',
    value: function geocodeSuggest(suggest) {
      var _this3 = this;

      this.state.geocoder.geocode({
        address: suggest.label
      }, function (results, status) {

        if (status !== _google2['default'].maps.GeocoderStatus.OK) {
          return;
        }

        var location = results[0].geometry.location;
        suggest.location = {
          lat: location.lat(),
          lng: location.lng()
        };

        _this3.handleSuggestSelect(suggest);
      });
    }
  }, {
    key: 'getSuggestItems',
    value: function getSuggestItems() {
      var _this4 = this;

      return this.state.suggests.map(function (suggest) {
        var isActive = _this4.state.activeSuggest && suggest.placeId === _this4.state.activeSuggest.placeId;

        return _react2['default'].createElement(_item2['default'], {
          key: suggest.placeId,
          suggest: suggest,
          isActive: isActive,
          onSuggestSelect: _this4.handleSuggestSelect
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'geosuggest' },
        _react2['default'].createElement('input', {
          className: 'geosuggest__input',
          ref: 'geosuggestInput',
          type: 'text',
          value: this.state.userInput,
          placeholder: this.props.placeholder || '',
          onKeyDown: this.handleInputKeyDown,
          onChange: this.handleInputChange,
          onFocus: this.handleInputFocus,
          onBlur: this.handleInputBlur
        }),
        _react2['default'].createElement(
          'ul',
          { className: 'geosuggest__suggests' + (this.state.isSuggestsHidden ? ' geosuggest__suggests--hidden' : '') },
          this.getSuggestItems()
        )
      );
    }
  }]);

  return Input;
})(_react2['default'].Component);

exports['default'] = Input;
module.exports = exports['default'];