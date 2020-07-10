class Canvas{
    constructor() {
        this.$canvas = document.getElementById('my-canvas');
        this.ctx = this.$canvas.getContext("2d");
        this.$canvasWrap = $('.graph-wrap');
        this.left = 0;
        this.top = 0;
        this.topHeight = +$('.top').height();
        this.moveX = 0;
        this.moveY = 0;
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

    move(x, y) {
        if (this.moveX === 0 && this.moveY === 0) {
            this.moveX = x;
            this.moveY = y;
        } else {
            this.left += (x - this.moveX);
            this.top += (y - this.moveY);
            this.moveX = x;
            this.moveY = y;
            this.$canvasWrap.css({
                left: this.left,
                top: this.top,
            })
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

    scale(scroll) {
        const width = this.$canvas.width;
        const height = this.$canvas.height;
        if (scroll > 0) {
            this.ctx.scale(setting['canvasEnlarge'], setting['canvasEnlarge']);
            this.$canvas.width *= setting['canvasEnlarge'];
            this.$canvas.height *= setting['canvasEnlarge'];
        } else {
            this.ctx.scale(setting['canvasNarrow'], setting['canvasNarrow']);
            this.$canvas.width *= setting['canvasNarrow'];
            this.$canvas.height *= setting['canvasNarrow'];
        }
        this.left -= (this.$canvas.width - width) / 2;
        this.top -= (this.$canvas.height - height) / 2;
        this.$canvasWrap.css({
            left: this.left,
            top: this.top,
        })
        this.updateCanvas();
    }
}