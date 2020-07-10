class Edge{
    constructor(startPoint, endPoint, lineWidth=setting['lineWidth'], lineColor=setting['lineColor'], style=setting['edgeStyle']) {
        this.k = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.style = style;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.calculateCoordinate();
    }
    draw() {
        if (this.style === 'solid') {
            this.drawSolid();
        } else if (this.style === 'dash') {
            this.drawDash();
        }  
    }

    drawSolid() {
        // 切换回实线
        graph.ctx.setLineDash([]);
        graph.ctx.beginPath();
        graph.ctx.moveTo(this.startX, this.startY);
        graph.ctx.lineTo(this.endX, this.endY);
        graph.ctx.lineWidth = this.lineWidth;
        graph.ctx.strokeStyle = this.lineColor;
        graph.ctx.closePath();
        graph.ctx.stroke();  
    }

    drawDash() {
        graph.ctx.beginPath();
        graph.ctx.setLineDash([4,8]);
        graph.ctx.moveTo(this.startX, this.startY);
        graph.ctx.lineTo(this.endX, this.endY);
        graph.ctx.lineWidth = this.lineWidth;
        graph.ctx.strokeStyle = this.lineColor;
        graph.ctx.closePath();
        graph.ctx.stroke(); 
    }

    calculateCoordinate() {
        const distance = Math.sqrt(Math.pow((this.startPoint.x - this.endPoint.x), 2) + Math.pow((this.startPoint.y - this.endPoint.y), 2));
        const cos = (this.endPoint.x - this.startPoint.x) / distance;
        const sin = (this.endPoint.y - this.startPoint.y) / distance;
        this.startX = this.startPoint.radius * cos + this.startPoint.x;
        this.startY = this.startPoint.radius * sin + this.startPoint.y;
        this.endX = -this.endPoint.radius * cos + this.endPoint.x;
        this.endY = -this.endPoint.radius * sin + this.endPoint.y;
    }

    getPointFromEdgeDistance(x, y) {
        const A = this.startY - this.endY;
        const B = this.endX - this.startX;
        const C = -B * this.endY - A * this.endX;
        return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B));
    }

    markSelectEdge() {
        graph.ctx.beginPath();
        graph.ctx.moveTo(this.startX, this.startY);
        graph.ctx.lineTo(this.endX, this.endY);
        graph.ctx.lineWidth = this.lineWidth * 1.5;
        graph.ctx.strokeStyle = setting['markLineColor'];
        graph.ctx.closePath();
        graph.ctx.stroke();   
    }
}