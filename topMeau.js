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
        this.$powerData = $('.top .power-data');
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

        this.$exportData.click(e => this.exportData(e));

        this.$powerData.click(e => this.importPower(e))

        setTimeout(() => {
            this.showGird();
            this.showFigureCoordinate();
        }, 1);
    }

    importPower(e) {
        alert('权重的数据是点的个数阶的方阵的excel文件，(i,j)的值为第i个点到第j个点的权重，如果没有权重请设置为0');
        const input = $('<input type="file">');
        input.click();
        input.change(e => {
            const file = e.target.files[0];
            myFile.importFile(file, (data) => {
                try{
                    graph.edges.forEach(edge => {
                        edge.power = data[edge.startPoint.id][edge.endPoint.id];
                    });
                    graph.canvas.updateCanvas();
                } catch(e) {
                    console.log(e);
                    alert('权重的数据格式不合适');
                    return;
                }
            });
        });
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
        alert('点的数据为两列一样长的excel数据，每行数据为一个点的(x,y)坐标，不能为负，插入后的点是相对于最远点的相对位置')
        const input = $('<input type="file">');
        input.click();
        input.change(e => {
            const file = e.target.files[0];
            myFile.importFile(file, (data) => {
                try{
                    const len = data.length;
                    const {xmax, ymax} = util.getMax(data);
                    for (let i = 0; i < len; i++) {
                        const id = graph.getPointId();
                        graph.executer.insertPoint(id, data[i][0] * 0.8 * window.innerWidth / xmax, data[i][1] * 0.8 * window.innerHeight / ymax);
                    }
                } catch(e) {
                    console.log(e);
                    alert('点的数据格式不合适');
                    return;
                }
            });
        });
    }

    importEdge(e) {
        alert('边的数据是图的邻接表的excel文件，(i,j)的值为第i个点和第j个点有几条边，如果没有边请置为0，如果不是有向图，请将矩阵左下部分全置为0，特别注意：有向图请让最后一行第一个数加1！！！');
        const input = $('<input type="file">');
        input.click();
        input.change(e => {
            const file = e.target.files[0];
            myFile.importFile(file, (data) => {
                try{
                    const len = data.length;
                    const pointsLength = graph.points.length;
                    const direction = +data[len-1][0] > 0 ? 'front' : undefined;
                    data[len-1][0] = +data[len-1][0] - 1;
                    for(let i = 0; i < len; i++) {
                        for (let j = 0; j < len; j++) {
                            if (i < pointsLength && j < pointsLength && data[i][j] > 0) {
                                const startPoint = graph.points[i];
                                const endPoint = graph.points[j];
                                for (let k = 0; k < data[i][j]; k++) {
                                    graph.executer.insertEdge([startPoint, endPoint], direction);
                                }
                            }
                        }
                    }
                } catch(e) {
                    console.log(e);
                    alert('边的数据格式不合适');
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