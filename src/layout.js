import Util from './util';

export default {
    prism: {
        distance: function apothem(width, sides) {
            return Math.ceil(width / (2 * Math.tan(Math.PI / sides)));
        },
        figures: function(width, images, initial) {
            var sides = images.length;
            var angle = 2 * Math.PI / sides;
            var acceptable = Math.round(initial / angle) * angle;
            return Util.range(0, sides).map(function(d) {
                return {
                    rotateY: d * angle + acceptable,
                    translateX: 0,
                    translateZ: exports.default.prism.distance(width, sides),
                    opacity: 1,
                    present: true,
                    key: d,
                    image: images[d]
                };
            });
        }
    },
    classic: {
        distance: function(width, sides) {
            return Math.round(width * Math.log(sides));
        },
        figures: function(width, images, initial) {
            var sides = images.length;
            var angle = 2 * Math.PI / sides;
            var distance = exports.default.classic.distance(width, sides);
            var acceptable = Math.round(initial / angle) * angle;
            return Util.range(0, sides).map(function(d) {
                var angleR = d * angle + acceptable;
                return {
                    rotateY: 0,
                    translateX: distance * Math.sin(angleR),
                    translateZ: distance * Math.cos(angleR),
                    opacity: 1,
                    present: true,
                    key: d,
                    image: images[d]
                };
            });
        }
    }
};
