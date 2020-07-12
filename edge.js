class Edge{
    constructor(id, startPoint, endPoint, multiplicity, lineWidth=setting['lineWidth'], lineColor=setting['lineColor'], style=setting['edgeStyle']) {
        this.id = id;
        this.startPoint = startPoint;
        this.multiplicity = multiplicity;
        this.endPoint = endPoint;
        this.style = style;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.calculateCoordinate();
    }

    draw() {
        if (this.style === 'solid') {
            graph.canvas.ctx.setLineDash([]);
        } else if (this.style === 'dash') {
            graph.canvas.ctx.setLineDash([4,8]);
        } 
        this.drawLine(); 
    }

    drawLine() {
        const arc = this.calculateArc();
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.moveTo(this.startX, this.startY);
        graph.canvas.ctx.quadraticCurveTo(arc.arcX, arc.arcY, this.endX, this.endY);
        graph.canvas.ctx.lineWidth = this.lineWidth;
        graph.canvas.ctx.strokeStyle = this.lineColor;
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.stroke(); 
    }

    calculateArc() {
        const position = (this.multiplicity + 1) % 2 === 0 ? -1 : 1;
        const positionMultiplicity = parseInt((this.multiplicity + 1)/ 2);
        const middleX = (this.startX + this.endX) / 2;
        const middleY = (this.startY + this.endY) / 2;
        const arcX = setting['edgeInterval'] * this.sin * position * positionMultiplicity + middleX;
        const arcY =  -setting['edgeInterval'] * this.cos * position * positionMultiplicity + middleY;
        return {arcX, arcY};
    }

    calculateCoordinate() {
        const distance = Math.sqrt(Math.pow((this.startPoint.x - this.endPoint.x), 2) + Math.pow((this.startPoint.y - this.endPoint.y), 2));
        this.cos = (this.endPoint.x - this.startPoint.x) / distance;
        this.sin = (this.endPoint.y - this.startPoint.y) / distance;
        this.startX = this.startPoint.radius * this.cos + this.startPoint.x;
        this.startY = this.startPoint.radius * this.sin + this.startPoint.y;
        this.endX = -this.endPoint.radius * this.cos + this.endPoint.x;
        this.endY = -this.endPoint.radius * this.sin + this.endPoint.y;
    }

    getPointFromEdgeDistance(x, y) {
        if (x > Math.max(this.startX,  this.endX) || x < Math.min(this.startX,  this.endX) 
        || y > Math.max(this.startY,  this.endY) || y < Math.min(this.startY,  this.endY)){
            return 10000000
        }
        const A = this.startY - this.endY;
        const B = this.endX - this.startX;
        const C = -B * this.endY - A * this.endX;
        return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B));
    }

    markSelectEdge() {
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.moveTo(this.startX, this.startY);
        graph.canvas.ctx.lineTo(this.endX, this.endY);
        graph.canvas.ctx.lineWidth = this.lineWidth * 1.5;
        graph.canvas.ctx.strokeStyle = setting['markLineColor'];
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.stroke();   
    }
}