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
        this.executer = new Executer();
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

    getEdgeId() {
        return this.edges.length;
    }

    search(x, y, ctrl) {
        this.pointSearch(x, y, ctrl);
        this.edgeSearch(x, y, ctrl);
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
                }
                point.markSelectPoint();
                this.selectPoints.push(point);
                break;
            }
        }
        // 如果点击了空白处，就清空选择的列表
        if (i === len && this.selectPoints.length > 0) {
            this.canvas.updateCanvas();
        } 
    }

    edgeSearch(x, y, ctrl) {
        if (this.selectPoints.length > 0) {
            return;
        }
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
        }  
    }
}

graph = new Graph();
graph.init();
