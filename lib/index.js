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

var _SuggestionItem = require('./item');

var _SuggestionItem2 = _interopRequireWildcard(_SuggestionItem);

var _google = require('google');

var _google2 = _interopRequireWildcard(_google);

var Input = (function (_React$Component) {
  function Input(props) {
    _classCallCheck(this, Input);

    _get(Object.getPrototypeOf(Input.prototype), 'constructor', this).call(this, props);
    this.state = {
      isSuggestsHidden: true,
      userInput: '',
      activeSuggest: null,
      suggests: [],
      geocoder: new _google2['default'].maps.Geocoder(),
      autocompleteService: new _google2['default'].maps.places.AutocompleteService()
    };
  }

  _inherits(Input, _React$Component);

  _createClass(Input, [{
    key: 'updateAutocomplete',
    value: function updateAutocomplete() {
      var _this = this;

      if (!this.state.userInput.length) {
        return this.updateSuggests();
      }

      this.state.autocompleteService.getPlacePredictions({
        input: this.state.userInput,
        location: this.props.location || new _google2['default'].maps.LatLng(0, 0),
        radius: this.props.radius || 0
      }, function (suggestions) {
        return _this.updateSuggests(suggestions);
      });
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(e) {
      var _this2 = this;

      this.setState({ userInput: e.target.value }, function () {
        return _this2.updateAutocomplete();
      });
    }
  }, {
    key: 'handleInputFocus',
    value: function handleInputFocus() {
      this.updateSuggests();
      this.setState({ isSuggestsHidden: false });
    }
  }, {
    key: 'handleInputBlur',
    value: function handleInputBlur() {
      var _this3 = this;

      setTimeout(function () {
        _this3.setState({ isSuggestsHidden: true });
      }, 100);
    }
  }, {
    key: 'handleInputKeyDown',
    value: function handleInputKeyDown(event) {
      switch (event.which) {
        case 40:
          // DOWN
          event.preventDefault();
          this.activateSuggest('next');
          break;
        case 38:
          // UP
          event.preventDefault();
          this.activateSuggest('prev');
          break;
        case 13:
          // ENTER
          this.selectSuggest(this.state.activeSuggest);
          break;
        case 9:
          // TAB
          this.selectSuggest(this.state.activeSuggest);
          break;
        case 27:
          // ESC
          this.handleInputBlur();
          break;
      }
    }
  }, {
    key: 'handleSuggestSelect',
    value: function handleSuggestSelect(suggest) {
      if (!suggest) {
        suggest = {
          label: this.state.userInput
        };
      }

      this.setState({
        isSuggestsHidden: true,
        userInput: suggest.label
      });

      if (suggest.location) {
        this.props.onSuggestSelect(suggest);
        return;
      }

      this.geocodeSuggest(suggest);
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
      var _this4 = this;

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

        _this4.handleSuggestSelect(suggest);
      });
    }
  }, {
    key: 'getSuggestItems',
    value: function getSuggestItems() {
      var _this5 = this;

      return this.state.suggests.map(function (suggest) {
        var isActive = _this5.state.activeSuggest && suggest.placeId === _this5.state.activeSuggest.placeId;

        return _React2['default'].createElement(_SuggestionItem2['default'], {
          key: suggest.placeId,
          suggest: suggest,
          isActive: isActive,
          onSuggestSelect: _this5.handleSuggestSelect.bind(_this5)
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _React2['default'].createElement(
        'div',
        { className: 'geosuggest' },
        _React2['default'].createElement('input', {
          className: 'geosuggest__input',
          ref: 'geosuggestInput',
          type: 'text',
          value: this.state.userInput,
          placeholder: this.props.placeholder || '',
          onKeyDown: this.handleInputKeyDown.bind(this),
          onChange: this.handleInputChange.bind(this),
          onFocus: this.handleInputFocus.bind(this),
          onBlur: this.handleInputBlur.bind(this)
        }),
        _React2['default'].createElement(
          'ul',
          { className: 'geosuggest__suggests' + (this.state.isSuggestsHidden ? ' geosuggest__suggests--hidden' : '') },
          this.getSuggestItems()
        )
      );
    }
  }]);

  return Input;
})(_React2['default'].Component);

exports['default'] = Input;
module.exports = exports['default'];