"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _easeFunctions = require("ease-functions");

var _easeFunctions2 = _interopRequireDefault(_easeFunctions);

var _layout = require("./layout");

var _layout2 = _interopRequireDefault(_layout);

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Depot = function () {
  function Depot(initialState, initialProps, callback) {
    _classCallCheck(this, Depot);

    this.state = initialState;
    this.props = initialProps;
    this.callbackSetState = callback;
    this.requestID = false;

    this.onNextProps = this.onNextProps.bind(this);
    this.onRotate = this.onRotate.bind(this);
  }

  _createClass(Depot, [{
    key: "onNextProps",
    value: function onNextProps(nextProps) {
      if (this.props.layout != nextProps.layout || this.props.images != nextProps.images) {
        this.props = nextProps;
        var to = _layout2.default[this.props.layout].figures(this.props.width, this.props.images, this.state.rotationY);
        var bounds = this.transitionFigures(this.state.figures, to, _easeFunctions2.default[this.props.ease], this.props.duration);
        var stepper = this.transit(bounds, to, this.props.duration);
        this.playAnimation(this.state, to, stepper, this.callbackSetState);
      }
      this.props = nextProps;
    }
  }, {
    key: "onRotate",
    value: function onRotate(angle) {
      var to = _layout2.default[this.props.layout].figures(this.props.width, this.props.images, this.state.rotationY + angle);
      this.state.rotationY += angle;
      var bounds = this.transitionFigures(this.state.figures, to, _easeFunctions2.default[this.props.ease], this.props.duration);
      var stepper = this.transit(bounds, to, this.props.duration);
      if (this.requestID) {
        cancelAnimationFrame(this.requestID);
      }
      this.playAnimation(this.state, to, stepper, this.callbackSetState);
    }
  }, {
    key: "playAnimation",
    value: function playAnimation(state, to, stepper, callback) {
      var _this = this;

      if (this.requestID) window.cancelAnimationFrame(this.requestID);
      var animate = function animate(timestamp) {
        _this.requestID = requestAnimationFrame(animate);
        state.figures = stepper(timestamp);
        callback(state);
        if (state.figures == to) {
          cancelAnimationFrame(_this.requestID);
        }
      };
      requestAnimationFrame(animate);
    }

    // NOT USING THIS

  }, {
    key: "transitionFigures",
    value: function transitionFigures(from, to, ease) {
      var _this2 = this;

      var keys = _util2.default.uniq(_util2.default.pluck("key", from.concat(to)));
      var fromTo = [];
      keys.forEach(function (key) {
        fromTo.push(_this2.transfigure(_this2.startFrame(from[key], to[key]), _this2.endFrame(from[key], to[key]), ease));
      });
      return fromTo;
    }
  }, {
    key: "transit",
    value: function transit(entries, to, duration) {
      var _this3 = this;

      var start, end;
      var withChange = this.addChange(entries);
      var time = 0;
      return function (timestamp) {
        if (!start) {
          start = timestamp;
          end = timestamp + duration;
        }
        if (timestamp >= end) {
          return to;
        }
        time = timestamp - start;
        return _this3.tally(time, withChange, duration);
      };
    }
  }, {
    key: "transfigure",
    value: function transfigure(from, to, ease) {
      var _this4 = this;

      var keys = _util2.default.uniq(Object.keys(from || {}).concat(Object.keys(to || {})));
      var res = {};
      keys.forEach(function (key) {
        res[key] = {
          from: from[key],
          to: to[key]
        };
        res[key].ease = isNaN(res[key].from) ? _this4.secondArg : ease;
      });
      return res;
    }
  }, {
    key: "addChange",
    value: function addChange(entries) {
      var len = entries.length;
      var res = new Array(len);
      for (var i = 0; i < len; ++i) {
        res[i] = this.addObjChange(entries[i]);
      }
      return res;
    }
  }, {
    key: "addObjChange",
    value: function addObjChange(entry) {
      var res = Object.create(null);
      for (var key in entry) {
        res[key] = _util2.default.merge(entry[key], {
          change: entry[key].to - entry[key].from
        });
      }
      return res;
    }
  }, {
    key: "tally",
    value: function tally(time, entries, duration) {
      var len = entries.length;
      var res = new Array(len);
      var entry;
      for (var i = 0; i < len; ++i) {
        entry = entries[i];
        var obj = Object.create(null);
        for (var key in entry) {
          obj[key] = entry[key].ease ? entry[key].ease(time, entry[key].from, entry[key].change, duration) : entry[key].from;
        }
        res[i] = obj;
      }
      return res;
    }
  }, {
    key: "secondArg",
    value: function secondArg(x, y) {
      return y;
    }
  }, {
    key: "present",
    value: function present(entries) {
      return entries.filter(function (entry) {
        return entry.present;
      });
    }
  }, {
    key: "startFrame",
    value: function startFrame(now, then) {
      return now || _util2.default.merge(then, { present: true, opacity: 0 });
    }
  }, {
    key: "endFrame",
    value: function endFrame(now, then) {
      return now && !then ? _util2.default.merge(now, { present: false, opacity: 0 }) // leaves
      : _util2.default.merge(then, { present: true, opacity: 1 });
    }
  }]);

  return Depot;
}();

exports.default = Depot;