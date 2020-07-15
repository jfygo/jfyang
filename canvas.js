class Canvas{
    constructor() {
        this.$canvas = document.getElementById('my-canvas');
        this.ctx = this.$canvas.getContext("2d");
        this.$canvasWrap = $('.graph-wrap');
        this.left = 0;
        this.top = 0;
        this.topHeight = +$('.top').height();
    }

    init() {
        this.setWidthAndHeight();
    }

    setWidthAndHeight() {
        if (this.$canvas.width < window.innerWidth){
            this.$canvas.width = window.innerWidth;
        }
        if (this.$canvas.height < window.innerHeight){
            this.$canvas.height = window.innerHeight;
        }
    }

    showEdgeDirection(direction) {
        let len = graph.selectPoints.length;
        if (len === 1) {
            const edge = new Edge(0, graph.selectPoints[0], graph.selectPoints[0], 0, direction);
            edge.draw();
        } else {
            for(let i = 0; i < len - 1; i++) {
                const edge = new Edge(0, graph.selectPoints[i], graph.selectPoints[i+1], 0, direction);
                edge.draw();
            }
        }
    }

    updateCanvas() {
        graph.selectPoints = [];
        graph.selectEdges = [];
        // 切换回实线
        this.ctx.setLineDash([]);
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
        graph.points.forEach(v => {
            v.draw();
        });
        graph.edges.forEach(v => {
            v.draw();
        });
        if (graph.topMeau.isShowGird) {
            graph.topMeau.showGird();
        }
        graph.topMeau.showFigureCoordinate();
    }
}