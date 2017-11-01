import Ease from "ease-functions";
import Layout from "./layout";
import Util from "./util";

export default class Depot {
  constructor(initialState, initialProps, callback) {
    this.state = initialState;
    this.props = initialProps;
    this.callbackSetState = callback;
    this.requestID = false;
    this.current = 0;

    this.onNextProps = this.onNextProps.bind(this);
    this.onRotate = this.onRotate.bind(this);
  }

  onNextProps(nextProps) {
    if (
      this.props.layout != nextProps.layout ||
      this.props.images != nextProps.images
    ) {
      this.props = nextProps;
      var to = Layout[this.props.layout].figures(
        this.props.width,
        this.props.images,
        this.state.rotationY
      );
      var bounds = this.transitionFigures(
        this.state.figures,
        to,
        Ease[this.props.ease],
        this.props.duration
      );
      var stepper = this.transit(bounds, to, this.props.duration);
      this.playAnimation(this.state, to, stepper, this.callbackSetState);
    }
    this.props = nextProps;
  }

  onRotate(angle) {
    const imagesLen = this.state.figures.length;
    if (angle > 0) {
      this.current = (--this.current + imagesLen) % imagesLen;
    } else {
      this.current = ++this.current % imagesLen;
    }

    var to = Layout[this.props.layout].figures(
      this.props.width,
      this.props.images,
      this.state.rotationY + angle
    );
    this.state.rotationY += angle;
    var bounds = this.transitionFigures(
      this.state.figures,
      to,
      Ease[this.props.ease],
      this.props.duration
    );
    var stepper = this.transit(bounds, to, this.props.duration);
    if (this.requestID) {
      cancelAnimationFrame(this.requestID);
    }
    this.playAnimation(this.state, to, stepper, this.callbackSetState);
  }

  playAnimation(state, to, stepper, callback) {
    if (this.requestID) window.cancelAnimationFrame(this.requestID);
    const animate = timestamp => {
      this.requestID = requestAnimationFrame(animate);
      state.figures = stepper(timestamp);
      callback(state);
      if (state.figures == to) {
        cancelAnimationFrame(this.requestID);
      }
    };
    requestAnimationFrame(animate);
  }

  // NOT USING THIS

  transitionFigures(from, to, ease) {
    var keys = Util.uniq(Util.pluck("key", from.concat(to)));
    var fromTo = [];
    keys.forEach(key => {
      fromTo.push(
        this.transfigure(
          this.startFrame(from[key], to[key]),
          this.endFrame(from[key], to[key]),
          ease
        )
      );
    });
    return fromTo;
  }

  transit(entries, to, duration) {
    var start, end;
    var withChange = this.addChange(entries);
    var time = 0;
    return timestamp => {
      if (!start) {
        start = timestamp;
        end = timestamp + duration;
      }
      if (timestamp >= end) {
        return to;
      }
      time = timestamp - start;
      return this.tally(time, withChange, duration);
    };
  }

  transfigure(from, to, ease) {
    var keys = Util.uniq(Object.keys(from || {}).concat(Object.keys(to || {})));
    var res = {};
    keys.forEach(key => {
      res[key] = {
        from: from[key],
        to: to[key]
      };
      res[key].ease = isNaN(res[key].from) ? this.secondArg : ease;
    });
    return res;
  }

  addChange(entries) {
    var len = entries.length;
    var res = new Array(len);
    for (var i = 0; i < len; ++i) {
      res[i] = this.addObjChange(entries[i]);
    }
    return res;
  }

  addObjChange(entry) {
    var res = Object.create(null);
    for (var key in entry) {
      res[key] = Util.merge(entry[key], {
        change: entry[key].to - entry[key].from
      });
    }
    return res;
  }

  tally(time, entries, duration) {
    var len = entries.length;
    var res = new Array(len);
    var entry;
    for (var i = 0; i < len; ++i) {
      entry = entries[i];
      var obj = Object.create(null);
      for (var key in entry) {
        obj[key] = entry[key].ease
          ? entry[key].ease(time, entry[key].from, entry[key].change, duration)
          : entry[key].from;
      }
      res[i] = obj;
    }
    return res;
  }

  secondArg(x, y) {
    return y;
  }

  present(entries) {
    return entries.filter(function(entry) {
      return entry.present;
    });
  }

  startFrame(now, then) {
    return now || Util.merge(then, { present: true, opacity: 0 });
  }

  endFrame(now, then) {
    return now && !then
      ? Util.merge(now, { present: false, opacity: 0 }) // leaves
      : Util.merge(then, { present: true, opacity: 1 });
  }
}
