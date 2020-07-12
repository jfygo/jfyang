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
            console.log(graph.executer.orders)
            console.log(graph.executer.index)
            if (graph.selectPoints.length > 0) {
                this.pointAttributeMeau.pointAttributeMeauShow(e.clientX, e.clientY)
            } else if (graph.selectEdges.length > 0) {
                this.edgeAttributeMeau.edgeAttributeMeauShow(e.clientX, e.clientY)
            }
        }
    }
}

class EdgeAttributeMeau{
    constructor() {
        this.$edgeAttributeMeau = $('.edge-dialog');
        this.$colorInput = this.$edgeAttributeMeau.find('.color-input');
        this.$sizeInput = this.$edgeAttributeMeau.find('.size-input');
        this.$solidButton = this.$edgeAttributeMeau.find('.solid');
        this.$dashButton = this.$edgeAttributeMeau.find('.dash');
        this.$deleteButton = this.$edgeAttributeMeau.find('.delete-operation');
        this.$comfirmButton = this.$edgeAttributeMeau.find('.comfirm');
        this.$closeDialogButton = this.$edgeAttributeMeau.find('.close-dialog');
    }

    edgeAttributeMeauShow(x, y) {
        this.$edgeAttributeMeau.css({
            left: x,
            top: y,
            display: 'block',
        })
        const edge = graph.selectEdges[0];
        this.edgeColorSizeshow(edge);
        this.edgeStyleShow(edge);
        this.bindedgeStyleUpdate();
        this.bindedgeRemoveEvent();
        this.edgeAttributeButtonEvent(edge);
    }

    edgeColorSizeshow(edge) {
        this.$colorInput.val(edge.lineColor);
        this.$sizeInput.val(edge.lineWidth);
    }

    edgeStyleShow(edge) {
        if (edge.style === 'dash') {
            this.$dashButton.addClass('active');
            this.$solidButton.removeClass('active');
        } else {
            this.$solidButton.addClass('active');
            this.$dashButton.removeClass('active');
        }
    }

    bindedgeStyleUpdate() {
        this.$solidButton.click(e => {
            this.$dashButton.removeClass('active');
            this.$solidButton.addClass('active');
        })
        this.$dashButton.click(e => {
            this.$solidButton.removeClass('active');
            this.$dashButton.addClass('active');
        })
    }

    bindedgeRemoveEvent() {
        this.$deleteButton.click(e => {
            graph.executer.removeEdge(graph.selectEdges.map(edge => edge.id));
        });
    }

    offButtonEvent() {
        graph.canvas.updateCanvas();
        this.$dashButton.off('click');
        this.$solidButton.off('click');
        this.$comfirmButton.off('click');
        this.$deleteButton.off('click');
        this.$closeDialogButton.off('click');
    }

    edgeAttributeButtonEvent(edge) {
        this.$closeDialogButton.click(e => {
            this.$edgeAttributeMeau.css({
                display: 'none'
            });
            this.offButtonEvent();
        });
        this.$comfirmButton.click(e => {
            const color = this.$colorInput.val();
            const size = this.$sizeInput.val();
            let style = 'dash';
            if (this.$solidButton.attr('class').includes('active')) {
                style = 'solid';
            }
            graph.executer.edgeAttributeChange(graph.selectEdges.map(edge => edge.id), {
                new: {
                    color: color,
                    size: +size,
                    style: style,
                },
                old: {
                    color: edge.lineColor,
                    size: edge.lineWidth,
                    style: edge.style,
                }
            });
            this.$edgeAttributeMeau.css({
                display: 'none'
            });
        })
    }
}


class PointAttributeMeau{
    constructor() {
        this.$pointAttributeMeau = $('.point-dialog');
        this.$colorInput = this.$pointAttributeMeau.find('.color-input');
        this.$sizeInput = this.$pointAttributeMeau.find('.size-input');
        this.$solidButton = this.$pointAttributeMeau.find('.solid');
        this.$hollowButton = this.$pointAttributeMeau.find('.hollow');
        this.$comfirmButton = this.$pointAttributeMeau.find('.comfirm');
        this.$closeDialogButton = this.$pointAttributeMeau.find('.close-dialog');
        this.$deleteButton = this.$pointAttributeMeau.find('.delete-operation');
        this.$connectButton = this.$pointAttributeMeau.find('.connect-operation');
    }

    pointAttributeMeauShow(x, y) {
        this.$pointAttributeMeau.css({
            left: x,
            top: y,
            display: 'block',
        })
        const point = graph.selectPoints[0];
        this.bindPointConnectEvent();
        this.bindPointRemoveEvent();
        this.pointColorSizeshow(point);
        this.pointStyleShow(point);
        this.bindPointStyleUpdate();
        this.pointAttributeButtonEvent(point);
    }

    pointColorSizeshow(point) {
        this.$colorInput.val(point.color);
        this.$sizeInput.val(point.radius);
    }

    pointStyleShow(point) {
        if (point.style === 'hollow') {
            this.$hollowButton.addClass('active');
            this.$solidButton.removeClass('active');
        } else {
            this.$solidButton.addClass('active');
            this.$hollowButton.removeClass('active');
        }
    }

    bindPointStyleUpdate() {
        this.$solidButton.click(e => {
            this.$hollowButton.removeClass('active');
            this.$solidButton.addClass('active');
        })
        this.$hollowButton.click(e => {
            this.$solidButton.removeClass('active');
            this.$hollowButton.addClass('active');
        })
    }

    bindPointConnectEvent() {
        this.$connectButton.click(e => {
            graph.executer.insertEdge(graph.selectPoints);
        });
    }

    bindPointRemoveEvent() {
        this.$deleteButton.click(e => {
            graph.executer.removePoint(graph.selectPoints.map(point => point.id));
        });
    }

    offButtonEvent() {
        graph.canvas.updateCanvas();
        this.$solidButton.off('click');
        this.$hollowButton.off('click');
        this.$comfirmButton.off('click');
        this.$deleteButton.off('click');
        this.$connectButton.off('click');
        this.$closeDialogButton.off('click');
    }

    pointAttributeButtonEvent(point) {
        this.$closeDialogButton.click(e => {
            this.$pointAttributeMeau.css({
                display: 'none'
            });
            this.offButtonEvent();
        });
        this.$comfirmButton.click(e => {
            const color = this.$colorInput.val();
            const size = this.$sizeInput.val();
            let style = 'hollow';
            if (this.$solidButton.attr('class').includes('active')) {
                style = 'solid';
            }
            const changePointIds = graph.selectPoints.map(point => point.id);
            graph.executer.pointAttributeChange(changePointIds, {
                new: {
                    color: color,
                    size: +size,
                    style: style,
                },
                old: {
                    color: point.color,
                    size: point.radius,
                    style: point.style,
                }
            });
            this.$pointAttributeMeau.css({
                display: 'none'
            });
        })
    }
}
