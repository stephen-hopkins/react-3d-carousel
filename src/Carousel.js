import React from 'react';
import ReactDOM from 'react-dom';
import Util from './util';
import Layout from './layout';
import Depot from './depot';

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
        this.depot = Depot(this.state, this.props, this.setState.bind(this));
        this.onRotate = this.depot.onRotate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.depot.onNextProps(nextProps);
    }

    render() {
        var angle = 2 * Math.PI / this.state.figures.length;
        var translateZ = -Layout[this.props.layout].distance(
            this.props.width,
            this.state.figures.length
        );
        var figures = this.state.figures.map(function(d, i) {
            return (
                <figure key={i} style={Util.figureStyle(d)}>
                    <img src={d.image} alt={i} height={'100%'} width={'100%'} />
                </figure>
            );
        });
        return (
            <section className="react-3d-carousel">
                <div
                    className="carousel"
                    style={{ transform: 'translateZ(' + translateZ + 'px)' }}
                >
                    {figures}
                </div>
                <div
                    className="prev"
                    onClick={Util.partial(this.onRotate, +angle)}
                />
                <div
                    className="next"
                    onClick={Util.partial(this.onRotate, -angle)}
                />
            </section>
        );
    }
}
