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

    updateCanvas() {
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