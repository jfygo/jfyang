class Edge{
    constructor(id, startPoint, endPoint, multiplicity, direction=undefined, lineWidth=setting['lineWidth'], lineColor=setting['lineColor'], style=setting['edgeStyle']) {
        this.id = id;
        this.startPoint = startPoint;
        this.multiplicity = multiplicity;
        this.endPoint = endPoint;
        this.direction = direction;
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
        this.drawArrow();
    }

    drawArrow() {
        if (this.direction === 'front') {
            this.drawArrowPart(Math.PI - setting['arrorAngel']);
            this.drawArrowPart(Math.PI + setting['arrorAngel']);
        } else if (this.direction === 'back') {
            this.drawArrowPart(setting['arrorAngel']);
            this.drawArrowPart(-setting['arrorAngel']);
        }
    }

    drawLine() {
        graph.canvas.ctx.lineWidth = this.lineWidth;
        graph.canvas.ctx.strokeStyle = this.lineColor;
        graph.canvas.ctx.beginPath();
        if (this.multiplicity === 0) {
            this.arcX = (this.startX + this.endX) / 2;
            this.arcY = (this.startY + this.endY) / 2;
            graph.canvas.ctx.moveTo(this.startX, this.startY);
            graph.canvas.ctx.lineTo(this.endX, this.endY);
        } else {
            this.calculateArc();
            const startAngle = Math.atan2(this.startY - this.centerY, this.startX - this.centerX);
            const endAngle = Math.atan2(this.endY - this.centerY, this.endX - this.centerX);
            if ((this.multiplicity + 1) % 2 === 1) {
                graph.canvas.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            } else {
                graph.canvas.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle, true);
            }
        }
        graph.canvas.ctx.stroke(); 
    }

    drawArrowPart(angle) {
        const x = setting['arrorLength'] * this.cos;
        const y = setting['arrorLength'] * this.sin;
        const rotaryX = x * Math.cos(angle) + y * Math.sin(angle);
        const rotaryY = -x * Math.sin(angle) + y * Math.cos(angle);
        graph.canvas.ctx.lineWidth = this.lineWidth;
        graph.canvas.ctx.strokeStyle = this.lineColor;
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.moveTo(this.arcX, this.arcY);
        graph.canvas.ctx.lineTo(rotaryX + this.arcX, rotaryY + this.arcY);
        graph.canvas.ctx.stroke();
    }

    calculateArc() {
        const position = (this.multiplicity + 1) % 2 === 0 ? -1 : 1;
        const positionMultiplicity = parseInt((this.multiplicity + 1)/ 2);
        const middleX = (this.startX + this.endX) / 2;
        const middleY = (this.startY + this.endY) / 2;
        const edgeInterval = setting['edgeInterval'] * util.getTwoPointDistance(this.startX, this.startY, this.endX, this.endY);
        this.arcX = edgeInterval * this.sin * position * positionMultiplicity + middleX;
        this.arcY =  -edgeInterval * this.cos * position * positionMultiplicity + middleY;
        const center = util.getThreePointCenter(this.startX, this.startY, this.arcX, this.arcY, this.endX, this.endY);
        this.centerX = center.x;
        this.centerY = center.y;
        this.radius = util.getTwoPointDistance(this.startX, this.startY, center.x, center.y);
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
        if (this.multiplicity === 0) {
            const k = (this.endY - this.startY) / (this.endX - this.startX);
            return util.getPointLineDistance(this.startX, this.startY, k, x, y);
        } else {
            return Math.abs(util.getTwoPointDistance(this.centerX, this.centerY, x, y) - this.radius)
        }
    }

    markSelectEdge() {
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.lineWidth = this.lineWidth * 1.5;
        graph.canvas.ctx.strokeStyle = setting['markLineColor'];
        if (this.multiplicity === 0) {
            graph.canvas.ctx.moveTo(this.startX, this.startY);
            graph.canvas.ctx.lineTo(this.endX, this.endY);
        } else {
            const startAngle = Math.atan2(this.startY - this.centerY, this.startX - this.centerX);
            const endAngle = Math.atan2(this.endY - this.centerY, this.endX - this.centerX);
            if ((this.multiplicity + 1) % 2 === 1) {
                graph.canvas.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            } else {
                graph.canvas.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle, true);
            }
        }
        graph.canvas.ctx.stroke();   
    }
}