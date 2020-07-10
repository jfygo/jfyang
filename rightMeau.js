class RightMeau{
    constructor() {
        this.pointAttributeMeau = new PointAttributeMeau();
        this.edgeAttributeMeau = new EdgeAttributeMeau();
    }

    init() {
        document.oncontextmenu = (e) => {
            var e = e || event;
           //阻止默认行为
            e.preventDefault();
            if (graph.selectPoints.length > 0) {
                this.pointAttributeMeau.pointAttributeMeauShow(e.clientX, e.clientY)
            } else if (graph.selectEdges.length > 0) {
                console.log(1)
                this.edgeAttributeMeau.edgeAttributeMeauShow(e.clientX, e.clientY)
            }
        }
    }
}

class EdgeAttributeMeau{
    constructor() {
        this.$edgeAttributeMeau = $('.edge-dialog');
    }

    edgeAttributeMeauShow(x, y) {
        this.$edgeAttributeMeau.css({
            left: x,
            top: y,
            display: 'block',
        })
        const edge = graph.selectEdges[0];
        const $colorInput = this.$edgeAttributeMeau.find('.color-input');
        const $sizeInput = this.$edgeAttributeMeau.find('.size-input');
        this.edgeColorSizeshow($colorInput, $sizeInput, edge);
        const $solidButton = this.$edgeAttributeMeau.find('.solid');
        const $dashButton = this.$edgeAttributeMeau.find('.dash')
        this.edgeStyleShow($solidButton, $dashButton, edge);
        this.bindedgeStyleUpdate($solidButton, $dashButton);
        this.bindedgeRemoveEvent();
        this.edgeAttributeButtonEvent($colorInput, $sizeInput, $solidButton);
    }

    edgeColorSizeshow($colorInput, $sizeInput, edge) {
        $colorInput.val(edge.lineColor);
        $sizeInput.val(edge.lineWidth);
    }

    edgeStyleShow($solidButton, $dashButton, edge) {
        if (edge.style === 'dash') {
            $dashButton.addClass('active');
            $solidButton.removeClass('active');
        } else {
            $solidButton.addClass('active');
            $dashButton.removeClass('active');
        }
    }

    bindedgeStyleUpdate($solidButton, $dashButton) {
        $solidButton.click(e => {
            $dashButton.removeClass('active');
            $solidButton.addClass('active');
        })
        $dashButton.click(e => {
            $solidButton.removeClass('active');
            $dashButton.addClass('active');
        })
    }

    bindedgeRemoveEvent() {
        this.$edgeAttributeMeau.find('.delete-operation').click(e => {
            graph.removEedge();
        });
    }

    edgeAttributeButtonEvent($colorInput, $sizeInput, $solidButton) {
        this.$edgeAttributeMeau.find('.close-dialog').click(e => {
            this.$edgeAttributeMeau.css({
                display: 'none'
            })
        });
        this.$edgeAttributeMeau.find('.comfirm').click(e => {
            const color = $colorInput.val();
            const size = $sizeInput.val();
            let style = 'dash';
            if ($solidButton.attr('class').includes('active')) {
                style = 'solid';
            }
            graph.updateEdge(color, +size, style);
        })
    }
}


class PointAttributeMeau{
    constructor() {
        this.$pointAttributeMeau = $('.point-dialog');
    }

    pointAttributeMeauShow(x, y) {
        this.$pointAttributeMeau.css({
            left: x,
            top: y,
            display: 'block',
        })
        const point = graph.selectPoints[0];
        const $colorInput = this.$pointAttributeMeau.find('.color-input');
        const $sizeInput = this.$pointAttributeMeau.find('.size-input');
        this.pointColorSizeshow($colorInput, $sizeInput, point);
        const $solidButton = this.$pointAttributeMeau.find('.solid');
        const $hollowButton = this.$pointAttributeMeau.find('.hollow')
        this.pointStyleShow($solidButton, $hollowButton, point);
        this.bindPointStyleUpdate($solidButton, $hollowButton);
        this.bindPointConnectEvent();
        this.bindPointRemoveEvent();
        this.pointAttributeButtonEvent($colorInput, $sizeInput, $solidButton);
    }

    pointColorSizeshow($colorInput, $sizeInput, point) {
        $colorInput.val(point.color);
        $sizeInput.val(point.radius);
    }

    pointStyleShow($solidButton, $hollowButton, point) {
        if (point.style === 'hollow') {
            $hollowButton.addClass('active');
            $solidButton.removeClass('active');
        } else {
            $solidButton.addClass('active');
            $hollowButton.removeClass('active');
        }
    }

    bindPointStyleUpdate($solidButton, $hollowButton) {
        $solidButton.click(e => {
            $hollowButton.removeClass('active');
            $solidButton.addClass('active');
        })
        $hollowButton.click(e => {
            $solidButton.removeClass('active');
            $hollowButton.addClass('active');
        })
    }

    bindPointConnectEvent() {
        this.$pointAttributeMeau.find('.connect-operation').click(e => {
            graph.connectPoint();
        });
    }

    bindPointRemoveEvent() {
        this.$pointAttributeMeau.find('.delete-operation').click(e => {
            graph.removePoint();
        });
    }

    pointAttributeButtonEvent($colorInput, $sizeInput, $solidButton) {
        this.$pointAttributeMeau.find('.close-dialog').click(e => {
            this.$pointAttributeMeau.css({
                display: 'none'
            })
        });
        this.$pointAttributeMeau.find('.comfirm').click(e => {
            const color = $colorInput.val();
            const size = $sizeInput.val();
            let style = 'hollow';
            if ($solidButton.attr('class').includes('active')) {
                style = 'solid';
            }
            graph.updatePoint(color, +size, style);
        })
    }
}
