'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _depot = require('./depot');

var _depot2 = _interopRequireDefault(_depot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import "./index.css";

var Carousel = function (_React$Component) {
    _inherits(Carousel, _React$Component);

    function Carousel(props) {
        _classCallCheck(this, Carousel);

        var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

        _this.state = {
            images: _this.props.images,
            figures: _layout2.default[_this.props.layout].figures(_this.props.width, _this.props.images, 0),
            rotationY: 0
        };
        return _this;
    }

    _createClass(Carousel, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.depot = (0, _depot2.default)(this.state, this.props, this.setState.bind(this));
            this.onRotate = this.depot.onRotate.bind(this);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.depot.onNextProps(nextProps);
        }
    }, {
        key: 'render',
        value: function render() {
            var angle = 2 * Math.PI / this.state.figures.length;
            var translateZ = -_layout2.default[this.props.layout].distance(this.props.width, this.state.figures.length);
            var figures = this.state.figures.map(function (d, i) {
                return _react2.default.createElement(
                    'figure',
                    { key: i, style: _util2.default.figureStyle(d) },
                    _react2.default.createElement('img', { src: d.image, alt: i, height: '100%', width: '100%' })
                );
            });
            return _react2.default.createElement(
                'section',
                { className: 'react-3d-carousel' },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'carousel',
                        style: { transform: 'translateZ(' + translateZ + 'px)' }
                    },
                    figures
                ),
                _react2.default.createElement('div', {
                    className: 'prev',
                    onClick: _util2.default.partial(this.onRotate, +angle)
                }),
                _react2.default.createElement('div', {
                    className: 'next',
                    onClick: _util2.default.partial(this.onRotate, -angle)
                })
            );
        }
    }]);

    return Carousel;
}(_react2.default.Component);

exports.default = Carousel;