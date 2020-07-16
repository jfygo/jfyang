class RightMeau{
    constructor() {
        this.pointAttributeMeau = new PointAttributeMeau();
        this.edgeAttributeMeau = new EdgeAttributeMeau();
    }

    init() {
        this.pointAttributeMeau.init();
        this.edgeAttributeMeau.init();
        document.oncontextmenu = (e) => {
            var e = e || event;
           //阻止默认行为
            e.preventDefault();
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
        this.$powerInput = this.$edgeAttributeMeau.find('.power-input');
    }

    init() {
        this.bindedgeRemoveEvent();
        this.bindedgeStyleUpdate();
        this.$comfirmButton.click(e => this.confirmEventHandle(e));
        this.$closeDialogButton.click(e => this.closeDialogEventHandle(e));
    }

    edgeAttributeMeauShow(x, y) {
        this.$edgeAttributeMeau.css({
            left: x,
            top: y,
            display: 'block',
        })
        const edge = graph.selectEdges[0];
        this.edgeAttributeshow(edge);
        this.edgeStyleShow(edge);
    }

    edgeAttributeshow(edge) {
        this.$colorInput.val(edge.lineColor);
        this.$sizeInput.val(edge.lineWidth);
        if (edge.power != undefined) {
            this.$powerInput.val(edge.power);
        }
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

    confirmEventHandle() {
        const edge = graph.selectEdges[0];
        const color = this.$colorInput.val();
        const size = this.$sizeInput.val();
        const power = this.$powerInput.val();
        let style = 'dash';
        if (this.$solidButton.attr('class').includes('active')) {
            style = 'solid';
        }
        graph.executer.edgeAttributeChange(graph.selectEdges.map(edge => edge.id), {
            new: {
                color: color,
                size: +size,
                style: style,
                power: +power,
            },
            old: {
                color: edge.lineColor,
                size: edge.lineWidth,
                style: edge.style,
                power: edge.power,
            }
        });
        this.$edgeAttributeMeau.css({
            display: 'none'
        });
    }

    closeDialogEventHandle() {
        this.$edgeAttributeMeau.css({
            display: 'none'
        });
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
        this.$xInput = this.$pointAttributeMeau.find('.x-input');
        this.$yInput = this.$pointAttributeMeau.find('.y-input');
        this.$connectFront = this.$pointAttributeMeau.find('.connect-front-operation');
        this.$connectBack = this.$pointAttributeMeau.find('.connect-back-operation');
    }

    init() {
        this.bindPointConnectEvent();
        this.bindPointRemoveEvent();
        this.$comfirmButton.click(e => {this.comfirmEventHandle(e)})
        this.$closeDialogButton.click(e => {this.closeDialogEventHandle(e)});
        this.bindHoverEvent();
        this.$connectFront.click(e => this.connectFrontArcHandle(e));
        this.$connectBack.click(e => this.connectBackArcHandle(e));
    }

    bindHoverEvent(){
        this.$connectFront.hover(e => {
            graph.canvas.showEdgeDirection('front');
        },() => {
            this.hoverLeave();
        });

        this.$connectBack.hover(e => {
            graph.canvas.showEdgeDirection('back');
        },() => {
            this.hoverLeave();
        });

        this.$connectButton.hover(e => {
            graph.canvas.showEdgeDirection(undefined);
        },() => {
            this.hoverLeave();
        });
    }

    hoverLeave() {
        const temp = graph.selectPoints;
        graph.canvas.updateCanvas();
        graph.selectPoints = temp;
        temp.forEach(point => {
            point.markSelectPoint();
        });
    }

    connectFrontArcHandle(){
        graph.executer.insertEdge(graph.selectPoints, 'front');
        this.$pointAttributeMeau.css({
            display: 'none'
        });
    }

    connectBackArcHandle() {
        graph.executer.insertEdge(graph.selectPoints, 'back');
        this.$pointAttributeMeau.css({
            display: 'none'
        });
    }

    pointAttributeMeauShow(x, y) {
        this.$pointAttributeMeau.css({
            left: x,
            top: y,
            display: 'block',
        });
        const point = graph.selectPoints[0];
        this.pointColorSizeshow(point);
        this.pointStyleShow(point);
        this.pointPositionShow(point);
        this.bindPointStyleUpdate();
    }

    pointColorSizeshow(point) {
        this.$colorInput.val(point.color);
        this.$sizeInput.val(point.radius);
    }

    pointPositionShow(point) {
        this.$xInput.val(point.x);
        this.$yInput.val(point.y);
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
            graph.executer.insertEdge(graph.selectPoints, undefined);
            this.$pointAttributeMeau.css({
                display: 'none'
            });
        });
    }

    bindPointRemoveEvent() {
        this.$deleteButton.click(e => {
            graph.executer.removePoint(graph.selectPoints.map(point => point.id));
        });
    }

    closeDialogEventHandle(e) {
        this.$pointAttributeMeau.css({
            display: 'none'
        });
        graph.canvas.updateCanvas();
    }

    comfirmEventHandle(e) {
        const point = graph.selectPoints[0];
        const color = this.$colorInput.val();
        const size = this.$sizeInput.val();
        const x = this.$xInput.val();
        const y = this.$yInput.val();
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
                x: +x,
                y: +y,
            },
            old: {
                color: point.color,
                size: point.radius,
                style: point.style,
                x: point.x,
                y: point.y,
            }
        });
        this.$pointAttributeMeau.css({
            display: 'none'
        });
    }
}
