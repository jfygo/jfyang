class TopMeau{
    constructor() {
        this.$insertButton = $('.top .insert-point');
        this.$cancelInsertPointButton = $('.top .cancel-insert-point');
        this.$showGirdButton = $('.top .show-gird');
        this.$saveButton = $('.top .save');
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
        const imgUrl = graph.$canvas.toDataURL("image/png");
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
        graph.updateCanvas();
    }

    showGird() {
        graph.ctx.setLineDash([]);
        this.isShowGird = true;
        this.$showGirdButton.addClass('active');
        graph.ctx.strokeStyle = setting['girdColor']; 
        for(let i = setting['girdInterval']; i < graph.$canvas.height; ) {
            graph.ctx.lineWidth = this.getLineWidth(i);
            this.drawHorizontalLine(i);
            i += setting['girdInterval'];
        }

        for(let i = setting['girdInterval']; i < graph.$canvas.width; ) {
            graph.ctx.lineWidth = this.getLineWidth(i);
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
        graph.ctx.beginPath();
        graph.ctx.moveTo(i+0.5, 0);
        graph.ctx.lineTo(i+0.5, graph.$canvas.height);
        graph.ctx.closePath();
        graph.ctx.stroke();
    }

    drawHorizontalLine(i) {
        // 画横线
        graph.ctx.beginPath();
        graph.ctx.moveTo(0, i+0.5);
        graph.ctx.lineTo(graph.$canvas.width, i+0.5);
        graph.ctx.closePath();
        graph.ctx.stroke();
    }

    showFigureCoordinate() {
        graph.ctx.font = setting['outFont'];
        graph.ctx.fillStyle = "#000000";
        graph.ctx.textBaseline = "top";
        for(let i = 0; i < graph.$canvas.height; ) {
            graph.ctx.fillText(i, 0, i);
            i += 5 * setting['girdInterval'];
        }

        for(let i = 0; i < graph.$canvas.width; ) {
            graph.ctx.fillText(i, i, 0);
            i += 5 * setting['girdInterval'];
        }
    }

}