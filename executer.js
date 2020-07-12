class Executer{
    constructor() {
        this.orders = [];
        this.index = 0;
    }

    recovery() {
        const length = this.orders.length;
        if (this.index === length) {
            return
        } else {
            const order = this.orders[this.index];
            switch (order.tag) {
                case 'insertPoint':
                    this.insertPoint(order.parameter.id, order.parameter.x, order.parameter.y, false);
                    break;
                case 'insertEdge':
                    this.insertEdge([order.parameter.startPoint, order.parameter.endPoint], false);
                    break;
                case 'pointAttributeChange':
                    this.pointAttributeChange(order.ids, order.parameter, false);
                    break;
                case 'edgeAttributeChange':
                    this.edgeAttributeChange(order.ids, order.parameter, false);
                    break;
                case 'removePoint':
                    this.removePoint(order.parameter.removePoints.map(point => point.id), false);
                    break;
                case 'removePoint':
                    this.removeEdge(order.parameter.removeEdges.map(edge => edge.id), false);
                    break;
                case 'pointsMove':
                    this.pointMove(order.parameter.points, order.parameter.distanceX, order.parameter.distanceY);
                    break;
                default:
                    return;
            }
            this.index += 1;
        }
    }

    revoke() {
        if (this.index === 0) {
            return
        } else {
            const order = this.orders[this.index - 1];
            switch (order.tag) {
                case 'insertPoint':
                    this.removePoint([order.parameter.id], false);
                    break;
                case 'insertEdge':
                    this.removeEdge([order.parameter.id], false)
                    break;
                case 'pointAttributeChange':
                    this.pointAttributeChange(order.ids, {
                        new: order.parameter.old,
                        old: order.parameter.new,
                    }, false);
                    break;
                case 'edgeAttributeChange':
                    this.edgeAttributeChange(order.ids, {
                        new: order.parameter.old,
                        old: order.parameter.new,
                    }, false);
                    break;
                case 'removePoint':
                    graph.points = graph.points.concat(order.parameter.removePoints);
                    graph.edges = graph.edges.concat(order.parameter.removeEdges);
                    graph.canvas.updateCanvas();
                    break;
                case 'removeEdge':
                    graph.edges = graph.edges.concat(order.parameter.removeEdges);
                    graph.canvas.updateCanvas();
                    break;
                case 'pointsMove':
                    this.pointMove(order.parameter.points, -order.parameter.distanceX, -order.parameter.distanceY);
                    break;
                default:
                    return;
            }
            this.index -= 1;
        }
    }

    insertPoint(id, x, y, isTrack=true) {
        const point = new Point(id, x, y);
        point.draw();
        graph.points.push(point);
        if (isTrack) {
            this.orders = this.orders.slice(0, this.index);
            this.orders.push({
                tag: 'insertPoint',
                parameter: {
                    id: id,
                    x: x,
                    y: y,
                },
            });
            this.index += 1;
        }
    }

    removePoint(ids, isTrack=true) {
        let edgeIds = [];
        let removePoints = [];
        let removeEdges = [];
        graph.points = graph.points.filter(point => {
            if (ids.includes(point.id)) {
                removePoints.push(point);
                edgeIds.push(point.connectEdge)
                return false;
            } else {
                return true;
            }
        });
        const intIds = Array.from(edgeIds.toString().split(','));
        if (!(intIds.length === 1 && intIds[0] == "")) {
            for(let i = 0; i < intIds.length; i++) {
                intIds[i] = +intIds[i];
            }
            removeEdges = this.removeEdge(intIds, false);
        }
        if (isTrack) {
            this.orders = this.orders.slice(0, this.index);
            this.orders.push({
                tag: 'removePoint',
                parameter: {
                    removePoints: removePoints,
                    removeEdges: removeEdges,
                },
            });
            this.index += 1;
        }
        graph.canvas.updateCanvas();
    }

    insertEdge(points, isTrack=true) {
        const len = points.length;
        let edge;
        for (let i = 0; i < len - 1; i++) {
            const id = graph.getEdgeId();
            points[i].addConnectEdge(id);
            points[i + 1].addConnectEdge(id);
            edge = new Edge(id, points[i], points[i + 1]);
            graph.edges.push(edge);
            edge.draw();
            if (isTrack) {
                this.orders = this.orders.slice(0, this.index);
                this.orders.push({
                    tag: 'insertEdge',
                    parameter: {
                        id: id,
                        startPoint: points[i],
                        endPoint: points[i + 1],
                    },
                });
                this.index += 1;
            }
        }
        graph.canvas.updateCanvas();
    }

    removeEdge(ids, isTrack=true) {
        let removeEdges = [];
        graph.edges = graph.edges.filter(edge => {
            if (ids.includes(edge.id)) {
                removeEdges.push(edge);
                return false;
            } else {
                return true;
            }
        });
        graph.canvas.updateCanvas();
        if (isTrack) {
            this.orders = this.orders.slice(0, this.index);
            this.orders.push({
                tag: 'removeEdge',
                parameter: {
                    removeEdges: removeEdges,
                },
            });
            this.index += 1;
        }
        return removeEdges;
    }

    pointAttributeChange(ids, info, isTrack=true) {
        graph.points.forEach(point => {
            if (ids.includes(point.id)) {
                point.color = info.new.color;
                point.radius = info.new.size;
                point.style = info.new.style;
            }
        });
        if (isTrack) {
            this.orders = this.orders.slice(0, this.index);
            this.orders.push({
                tag: 'pointAttributeChange',
                parameter: info,
                ids: ids,
            });
            this.index += 1;
        } 
        graph.canvas.updateCanvas();
    }

    edgeAttributeChange(ids, info, isTrack=true) {
        graph.edges.forEach(edge => {
            if (ids.includes(edge.id)) {
                edge.lineColor = info.new.color;
                edge.lineWidth = info.new.size;
                edge.style = info.new.style;
            }
        });
        if (isTrack) {
            this.orders = this.orders.slice(0, this.index);
            this.orders.push({
                tag: 'edgeAttributeChange',
                parameter: info,
                ids: ids,
            });
            this.index += 1;
        } 
        graph.canvas.updateCanvas();
    }

    pointMove(points, x, y) {
        points.forEach(point => {
            point.move(x, y);
        });
        graph.canvas.updateCanvas();
    }

    pointMoveOrder(points, distanceX, distanceY) {
        this.orders.push({
            tag: 'pointsMove',
            parameter: {
                points,
                distanceX,
                distanceY,
            },
        });
        this.index += 1;
    }
}