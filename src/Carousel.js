import React from "react";
import ReactDOM from "react-dom";
import Util from "./util";
import Layout from "./layout";
import Depot from "./depot";
import circleLeft from "../static/icons/chevron-circle-left_white.png";
import circleRight from "../static/icons/chevron-circle-right_white.png";
import blackLeft from "../static/icons/chevron-left_black.png";
import blackRight from "../static/icons/chevron-right_black.png";
import whiteLeft from "../static/icons/chevron-left_white.png";
import whiteRight from "../static/icons/chevron-circle-right_white.png";

//import "./index.css";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.images,
      figures: Layout[this.props.layout].figures(
        this.props.width,
        this.props.images,
        0
      ),
      rotationY: 0
    };
  }

  componentWillMount() {
    this.depot = new Depot(this.state, this.props, this.setState.bind(this));
    this.onRotate = this.depot.onRotate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.depot.onNextProps(nextProps);
  }

  getNavStyle(type) {
    const navStyle = {
      position: "absolute",
      height: "100%",
      width: "15%",
      top: 0,
      backgroundImage: "url(" + this.getNavImage(type) + ")",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat"
    };
    switch (type) {
      case "prev":
        return { ...navStyle, left: "0px" };
      case "next":
        return { ...navStyle, right: "0px" };
      default:
        throw new Error("Invalid type passed into getNavStyle");
    }
  }

  getNavImage(type) {
    let images;
    switch (this.props.navType) {
      case "circle":
        images = [circleLeft, circleRight];
        break;
      case "black":
        images = [blackLeft, blackRight];
        break;
      case "white":
        images = [whiteLeft, whiteRight];
        break;
      default:
        throw new Error("Invalid navType passed into Carousel");
    }

    switch (type) {
      case "prev":
        return images[0];
      case "next":
        return images[1];
      default:
        throw new Error("Invalid type passed into getNavImage");
    }
  }

  render() {
    const angle = 2 * Math.PI / this.state.figures.length;
    const width = this.props.width;
    const height = this.props.height;

    var translateZ = -Layout[this.props.layout].distance(
      this.props.width,
      this.state.figures.length
    );
    var figures = this.state.figures.map(function(d, i) {
      return (
        <figure key={i} style={Util.figureStyle(d, width, height)}>
          <img
            src={d.image}
            alt={i}
            style={{ maxHeight: "100%", maxWidth: "70%", margin: "auto" }}
          />
        </figure>
      );
    });

    this.props.onRotate(figures[this.depot.current]);

    return (
      <section className="react-3d-carousel" style={this.props.style}>
        <div
          className="carousel"
          style={{
            transform: "translateZ(" + translateZ + "px)",
            transformStyle: "preserve-3d",
            height: this.props.height,
            width: this.props.width,
            backfaceVisibility: "inherit"
          }}
        >
          {figures}
        </div>
        <div
          style={this.getNavStyle("prev")}
          className="prev"
          onClick={Util.partial(this.onRotate, +angle)}
        />
        <div
          style={this.getNavStyle("next")}
          className="next"
          onClick={Util.partial(this.onRotate, -angle)}
        />
      </section>
    );
  }
}
