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
        this.k = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
        this.calculateCoordinate();
    }

    draw() {
        if (this.style === 'solid') {
            graph.canvas.ctx.setLineDash([]);
        } else if (this.style === 'dash') {
            graph.canvas.ctx.setLineDash([4,8]);
        } 
        if (this.startPoint.id === this.endPoint.id) {
            this.drawRing();
        } else {
            this.drawLine(); 
            this.drawArrow();
        }
    }

    drawRing() {
        graph.canvas.ctx.lineWidth = this.lineWidth;;
        graph.canvas.ctx.strokeStyle = this.lineColor;
        graph.canvas.ctx.beginPath();
        const radius = (this.multiplicity + 1) * setting['ringRadius']
        graph.canvas.ctx.arc(this.startPoint.x, this.startPoint.y - radius, radius, 0, 2*Math.PI);
        graph.canvas.ctx.stroke(); 
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
        if (this.checkOverBoder(x, y)) {
            return 1000000;
        }
        if (this.startPoint.id === this.endPoint.id) {
            const radius = (this.multiplicity + 1) * setting['ringRadius'];
            return Math.abs(radius - util.getTwoPointDistance(this.startPoint.x, this.startPoint.y - radius, x, y));
        } else {
            if (this.multiplicity === 0) {
                const k = (this.endY - this.startY) / (this.endX - this.startX);
                return util.getPointLineDistance(this.startX, this.startY, k, x, y);
            } else {
                return Math.abs(util.getTwoPointDistance(this.centerX, this.centerY, x, y) - this.radius)
            }
        }
    }

    checkOverBoder(x, y) {
        if (this.startPoint.id === this.endPoint.id) {
            return false;
        }
        const xmax = Math.max(this.startPoint.x, this.endPoint.x),xmin = Math.min(this.startPoint.x, this.endPoint.x), ymax = Math.max(this.startPoint.y, this.endPoint.y), ymin = Math.min(this.startPoint.y, this.endPoint.y);
        if (Math.abs(this.k) > 20) {
            if (y > ymax || y < ymin) {
                return true;
            }
        } else if (Math.abs(this.k) < 0.5) {
            if (x > xmax || x < xmin) {
                return true;
            }
        } else {
            if (y > ymax || y < ymin || x > xmax || x < xmin) {
                return true;
            }
        }
        return false;
    }

    markSelectEdge() {
        const tempColor = this.lineColor;
        this.lineColor = setting['markLineColor'];
        this.draw();
        this.lineColor = tempColor;
    }
}