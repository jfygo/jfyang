class Point{
    constructor(id, x, y, radius=setting['pointSize'], style=setting['pointStyle'], color=setting['pointColor']) {
        this.id = id;
        this.neighborPoint = [];
        this.neighborFrom = [];
        this.neighborTo = [];
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.style = style;
        this.color = color;
    }

    addNeighborPoint(point) {
        this.neighborPoint.push(point)
    }

    removeNeighborPoint(point) {
        this.neighborPoint = this.neighborPoint.filter((value) => {
            value.id != point.id
        })
    }

    addNeighborFrom(point) {
        this.neighborFrom.push(point)
    }

    removeNeighborFrom(point) {
        this.neighborFrom = this.neighborFrom.filter((value) => {
            value.id != point.id
        })
    }

    addNeighborTo(point) {
        this.neighborTo.push(point)
    }

    removeNeighborTo(point) {
        this.neighborTo = this.neighborTo.filter((value) => {
            value.id != point.id
        })
    }

    draw() {
        // 切换回实线
        graph.canvas.ctx.setLineDash([]);
        if (this.style === 'hollow') {
            this.drawHollow();
        } else if (this.style === 'solid') {
            this.drawSolid();
        }
    }

    drawHollow() {
        graph.canvas.ctx.lineWidth = setting['pointlineWidth'];
        graph.canvas.ctx.strokeStyle = this.color;
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.stroke();
    }

    drawSolid() {
        graph.canvas.ctx.fillStyle = this.color;
		graph.canvas.ctx.beginPath();
		graph.canvas.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		graph.canvas.ctx.closePath();
		graph.canvas.ctx.fill();
    }

    markSelectPoint() {
        graph.canvas.ctx.fillStyle = setting.markPointColor;
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.arc(this.x, this.y, this.radius / 2, 0, 2*Math.PI);
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.fill();
    }

    cleanPointMark() {
        graph.canvas.ctx.clearRect(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
    }

    remove() {
        graph.canvas.ctx.clearRect(this.x - this.radius, this.y - this.radius - 0.1, this.radius * 2 - 0.2, this.radius * 2);
    }
}