class TopMeau{
    constructor() {
        this.$insertButton = $('.top .insert-point');
        this.$cancelInsertPointButton = $('.top .cancel-insert-point');
        this.$showGirdButton = $('.top .show-gird');
        this.$saveButton = $('.top .save');
        this.$revokeButton = $('.top .revoke');
        this.$recoveryButton = $('.top .recovery');
        this.$insertTextButton = $('.top .insert-text');
        this.$body = $('body');
        this.$pointData = $('.top .point-data');
        this.$edgeData = $('.top .edge-data');
        this.$exportData = $('.top .export');
        this.isShowGird = false;
        this.isInsertTextBox = false;
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

        this.$revokeButton.click(e => graph.executer.revoke());

        this.$recoveryButton.click(e => graph.executer.recovery());

        this.$insertTextButton.click(e => this.insertTextHandle(e));
        
        this.$pointData.click(e => this.importPoint(e));

        this.$edgeData.click(e => this.importEdge(e));

        this.$exportData.click(e => this.exportData(e))

        setTimeout(() => {
            this.showGird();
            this.showFigureCoordinate();
        }, 1);
    }

    exportData(e) {
        const pointsData = graph.points.map((point) => [point.x, point.y]);
        myFile.exportFile(pointsData, '点的数据');
        const length = graph.points.length;
        let edgeData = [];
        for (let i = 0; i < length; i++) {
            const temp = Array(length).fill(0);
            edgeData.push(temp);
        }
        graph.edges.forEach(edge => {
            let start = -1, end = -1;
            for(let i = 0; i < length; i++){
                if (edge.startPoint.id === graph.points[i].id) {
                    start = i;
                } else if (edge.endPoint.id === graph.points[i].id) {
                    end = i;
                }
            }
            if (start > -1 && end > -1) {
                edgeData[start][end] += 1;
            }
        });
        myFile.exportFile(edgeData, '边的数据');
    }

    importPoint(e) {
        const input = $('<input type="file">');
        input.click();
        input.change(e => {
            const file = e.target.files[0];
            myFile.importFile(file, (data) => {
                try{
                } catch(e) {
                    console.log(e);
                    alert('点的数据格式不合适，其中数据为两列数据，每一行数据为每个点的坐标');
                    return;
                }
                const len = data.length;
                for(let i = 0; i < len; i++) {
                    if(data[i][0] < 0 || data[i][0] > window.innerWidth || data[i][1] < 0 || data[i][1] > window.innerHeight) {
                        alert('第' + i + '个点超出范围');
                    } else {
                        const id = graph.getPointId();
                        graph.executer.insertPoint(id, data[i][0], data[i][1]);
                    }
                }
            });
        });
    }

    importEdge(e) {
        const input = $('<input type="file">');
        input.click();
        input.change(e => {
            const file = e.target.files[0];
            myFile.importFile(file, (data) => {
                const len = data.length;
                    const pointsLength = graph.points.length;
                    for(let i = 0; i < len; i++) {
                        for (let j = 0; j < i; j++) {
                            if (i < pointsLength && j < pointsLength && data[i][j] > 0) {
                                const startPoint = graph.points[i];
                                const endPoint = graph.points[j];
                                for (let k = 0; k < data[i][j]; k++) {
                                    graph.executer.insertEdge([startPoint, endPoint]);
                                }
                            }
                        }
                    }
                try{
                    
                } catch(e) {
                    console.log(e);
                    alert('边的数据格式不合适，其中边的数据是一个邻接表，长宽必须相等，顶点i和顶点j有几条边，ij位置数据就为几，0不可省略');
                    return;
                }
            });
        });
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

    insertTextHandle(e) {
        const model = $('<div class="model"></div>');
        this.$insertTextButton.addClass('active');
        this.isInsertTextBox = true;
        this.$body.append(model);
        model.click(e => {
            if (!this.isInsertTextBox) {
                return
            }
            this.insertText(e)
            model.remove();
            return false;
        });
    }

    insertText(e) {
        const div = $('<div class="text-box"><input type="text" class="input"></div>');
        this.$body.append(div);
        this.isInsertTextBox = false;
        this.$insertTextButton.removeClass('active');
        div.css({
            left: e.originalEvent.clientX,
            top: e.originalEvent.clientY,
        });
        const $input = div.find('.input');
        $input.focus();
        $input.blur(e => {
            const text = $input.val();
            div.text(text);
        });

        div.mousedown(e => {
            if (e.originalEvent.which === 3) {
                div.remove();
            }
        })
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