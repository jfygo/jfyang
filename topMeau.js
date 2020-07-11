class TopMeau{
    constructor() {
        this.$insertButton = $('.top .insert-point');
        this.$cancelInsertPointButton = $('.top .cancel-insert-point');
        this.$showGirdButton = $('.top .show-gird');
        this.$saveButton = $('.top .save');
        this.$lockButton = $('.top .fix-graph');
        this.isShowGird = false;
    }

    init() {
        this.$insertButton.click((e) => {
            graph.mouse.changeInsertMode(this.$cancelInsertPointButton, this.$insertButton);
        });

        this.$cancelInsertPointButton.click((e) => {
            graph.mouse.changeCancelMode(this.$cancelInsertPointButton, this.$insertButton);
        });

        this.$showGirdButton.click(e => {
            if (this.isShowGird) {
                this.closeGird();
            } else {
                this.showGird();
            }
        })

        this.$saveButton.click(e => {
            this.save();
        })

        setTimeout(() => {
            this.showGird();
            this.showFigureCoordinate();
        }, 1);
        
    }

    save() {
        const imgUrl = graph.canvas.$canvas.toDataURL("image/png");
        const a = document.createElement("a");
        // 设置下载的文件名，默认是'下载'
        a.download = '图';
        a.href = imgUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    closeGird() {
        this.isShowGird = false;
        this.$showGirdButton.removeClass('active');
        graph.canvas.updateCanvas();
    }

    showGird() {
        graph.canvas.ctx.setLineDash([]);
        this.isShowGird = true;
        this.$showGirdButton.addClass('active');
        graph.canvas.ctx.strokeStyle = setting['girdColor']; 
        for(let i = setting['girdInterval']; i < graph.canvas.$canvas.height; ) {
            graph.canvas.ctx.lineWidth = this.getLineWidth(i);
            this.drawHorizontalLine(i);
            i += setting['girdInterval'];
        }

        for(let i = setting['girdInterval']; i < graph.canvas.$canvas.width; ) {
            graph.canvas.ctx.lineWidth = this.getLineWidth(i);
            this.drawVerticalLine(i);
            i += setting['girdInterval'];
        }
    }

    getLineWidth(i) {
        if (i % (5 * setting['girdInterval']) === 0) {
            return setting['girdLineWidth'] * 2;
        } else {
            return setting['girdLineWidth'];
        }
    }

    drawVerticalLine(i) {
         // 画竖线
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.moveTo(i+0.5, 0);
        graph.canvas.ctx.lineTo(i+0.5, graph.canvas.$canvas.height);
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.stroke();
    }

    drawHorizontalLine(i) {
        // 画横线
        graph.canvas.ctx.beginPath();
        graph.canvas.ctx.moveTo(0, i+0.5);
        graph.canvas.ctx.lineTo(graph.canvas.$canvas.width, i+0.5);
        graph.canvas.ctx.closePath();
        graph.canvas.ctx.stroke();
    }

    showFigureCoordinate() {
        graph.canvas.ctx.font = setting['outFont'];
        graph.canvas.ctx.fillStyle = "#000000";
        graph.canvas.ctx.textBaseline = "top";
        for(let i = 0; i < graph.canvas.$canvas.height; ) {
            graph.canvas.ctx.fillText(i, 0, i);
            i += 5 * setting['girdInterval'];
        }

        for(let i = 0; i < graph.canvas.$canvas.width; ) {
            graph.canvas.ctx.fillText(i, i, 0);
            i += 5 * setting['girdInterval'];
        }
    }
}