class Graph{
    constructor() {
        this.points = [];
        this.edges = [];
        this.selectPoints = [];
        this.selectEdges = [];
        this.canvas = new Canvas();
        this.mouse = new Mouse();
        this.rightMeau = new RightMeau();
        this.topMeau = new TopMeau();
        this.isSelectPoint = false;
    }

    init() {
        this.canvas.init();
        this.mouse.init();
        this.rightMeau.init();
        this.topMeau.init();
    }

    getPointId() {
        return this.points.length;
    }

    addPoint(point) {
        this.points.push(point);
    }

    search(x, y, ctrl) {
        if (this.selectPoints.length > 0) {
            this.pointSearch(x, y, ctrl);
        } else if (this.selectEdges.length > 0) {
            this.edgeSearch(x, y, ctrl);
        } else {
            this.pointSearch(x, y, ctrl); 
            if (!this.isSelectPoint) {
                this.edgeSearch(x, y, ctrl);
            }
        }
    }

    pointSearch(x, y, ctrl) {
        const len = this.points.length;
        let i;
        for (i=0; i < len; i++) {
            const point = this.points[i];
            // 检查是否点击了点
            if ((x >= point.x - point.radius) && (x <= point.x + point.radius)
                && (y >= point.y - point.radius) && (y <= point.y + point.radius)
            ) {
                // 如果没按ctrl，点击了别的点，清空选择的列表
                if (this.selectPoints.length > 0 && !ctrl) {
                    this.canvas.updateCanvas(); 
                    this.selectPoints = [];
                }
                this.isSelectPoint = true;
                point.markSelectPoint();
                this.selectPoints.push(point);
                break;
            }
        }
        // 如果点击了空白处，就清空选择的列表
        if (i === len && this.selectPoints.length > 0) {
            this.canvas.updateCanvas();
            this.selectPoints = [];
            this.isSelectPoint = false;
        } 
    }

    edgeSearch(x, y, ctrl) {
        const len = this.edges.length;
        let i;
        for (i=0; i < len; i++) {
            const edge = this.edges[i];
            if (edge.getPointFromEdgeDistance(x, y) < setting['edgeClickDistance']) {
                // 如果没按ctrl，点击了别的点，清空选择的列表
                if (this.selectEdges.length > 0 && !ctrl) {
                    this.canvas.updateCanvas();
                }
                edge.markSelectEdge();
                this.selectEdges.push(edge);
                break;
            }
        } 
        // 如果点击了空白处，就清空选择的列表
        if (i === len && this.selectEdges.length > 0) {
            this.canvas.updateCanvas();
            this.selectEdges = [];
        }  
    }

    updatePoint(color, size, style) {
        this.selectPoints.forEach(point => {
            point.color = color;
            point.radius = size;
            point.style = style;
        });
        this.canvas.updateCanvas();
    }

    removePoint() {
        let selectPointIds = [];
        this.selectPoints.forEach(point => {
            selectPointIds.push(point.id);
        });
        this.points = this.points.filter(point => {
            return !selectPointIds.includes(point.id)
        });
        this.edges = this.edges.filter(edge => {
            return !(selectPointIds.includes(edge.startPoint.id) || selectPointIds.includes(edge.endPoint.id));
        })
        this.canvas.updateCanvas();
    }

    connectPoint() {
        const len = this.selectPoints.length;
        let edge;
        for (let i = 0; i < len - 1; i++) {
            this.selectPoints[i].addNeighborPoint(this.selectPoints[i+1]);
            edge = new Edge(this.selectPoints[i], this.selectPoints[i+1]);
            this.edges.push(edge);
            edge.draw();
        }
    }

    removEedge() {
        this.selectEdges.forEach(edge => {
            edge.lineWidth = 0;
        });
        this.edges = this.edges.filter(edge => {
            return edge.lineWidth > 0;
        })
        this.canvas.updateCanvas();
    }

    updateEdge(color, size, style) {
        this.selectEdges.forEach(edge => {
            edge.lineColor = color;
            edge.lineWidth = size;
            edge.style = style;
        });
        this.canvas.updateCanvas();
    }
}

graph = new Graph();
graph.init();
