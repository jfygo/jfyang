const util = {
    getTwoPointDistance: (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    },

    getPointLineDistance: (lx1, ly1, k, px1, py1) => {
        const A = k;
        const B = -1;
        const C = -k * lx1 + ly1;
        return Math.abs((A * px1 + B *  py1 + C) / Math.sqrt(A * A + B * B));
    },

    getThreePointCenter(x1, y1, x2, y2, x3, y3) {
        if (y1 === y2 === y3) {
            return
        }
        let x, y, k1, k2, b1, b2;
        if (y1 === y2) {
            x = (x1 + x2) / 2;
            k2 = (x3 - x1) / (y1 - y3);
            b2 = -k2 * (x1 + x3) / 2 + (y1 + y3) / 2;
            y = k2 * x + b2;
        } else if (y1 === y3) {
            x = (x1 + x3) / 2;
            k1 = (x2 - x1) / (y1 - y2);;
            b1 = -k1 * (x1 + x2) / 2 + (y1 + y2) / 2;
            y = k1 * x + b1;
        } else {
            k1 = (x2 - x1) / (y1 - y2);
            k2 = (x3 - x1) / (y1 - y3);
            b1 = -k1 * (x1 + x2) / 2 + (y1 + y2) / 2;
            b2 = -k2 * (x1 + x3) / 2 + (y1 + y3) / 2;
            x = (b2 - b1) / (k1 - k2);
            y = k1 * x + b1;
        }
        return {x, y};
    },

    getPointParabolaDistance(x1, y1, x2, y2, x3, y3, x, y) {
        let parm;
        if (x1 === x3) {
            if (y2 === y1) {
                const dy = (x2 - x3) / (y2 - y3);
                parm = util.getParm(dy, y3, x3, y1, x1);
            } else {
                const dy = (x2 - x1) / (y2 - y1);
                parm = util.getParm(dy, y1, x1, y3, x3);
            }
            return 2;
        } else {
            if (x2 === x1) {
                const dy = (y2 - y3) / (x2 - x3);
                parm = util.getParm(dy, x3, y3, x1, y1);
            } else {
                const dy = (y2 - y1) / (x2 - x1);
                parm = util.getParm(dy, x1, y1, x3, y3);
            }
            for(let i = 100; i < 200; ) {
                graph.canvas.ctx.fillStyle = setting.markPointColor;
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.arc(i, parm.a * i * i + parm.b * i + parm.c, 3, 0, 2*Math.PI);
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.fill();
        i+=3;
            }
            
            return util.getPointLineDistance(x, parm.a * x * x + parm.b * x + parm.c, 2 * parm.a * x + parm.b, x, y);
        }
    },

    getParm(dy, x1, y1, x2, y2) {
        let a, b, c;
        a = ((y1 - y2) - dy * (x1 - x2)) / (x1 - x2) / (x2 - x1);
        b = dy - 2 * a * x1;
        c = y1 - a * x1 * x1 - b * x1;
        return {a, b, c};
    },
}