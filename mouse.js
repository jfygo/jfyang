class Mouse{
    constructor() {
        this.mode = 'cancelInsertPoint';
        this.$canvas = $('#my-canvas');
        this.$canvasWrap = $('.graph-wrap');
        this.canDragCanvas = false;
        this.longPress = undefined;
        this.originX = 0;
        this.originY = 0;
        this.movePoints = [];
        this.clickPosition = {};
    }

    init() {
        this.$canvas.click(e => this.canvasClick(e));
        this.$canvas.mousedown(e => this.mouseDown(e));
        this.$canvas.mouseup(e => this.mouseUp(e));
    }

    changeMode(newMode) {
        this.mode = newMode;
    }

    mouseMove(e) {
        if (this.originX === 0 && this.originY === 0) {
            this.originX = e.originalEvent.clientX;
            this.originY = e.originalEvent.clientY;
        } else {
            graph.executer.pointMove(graph.selectPoints, e.originalEvent.clientX - this.originX, e.originalEvent.clientY - this.originY);
            this.originX = e.originalEvent.clientX;
            this.originY = e.originalEvent.clientY;
        }
    }

    mouseDown(e) {
        if (e.which === 1) {
            if (graph.selectPoints.length > 0 && this.mode === 'cancelInsertPoint') {
                this.longPress = setTimeout(() => {
                    this.$canvas.css({
                        cursor: 'move',
                    });
                // 记录移动前的位置
                this.movePoints = graph.selectPoints;
                this.clickPosition = {
                    x: e.originalEvent.layerX,
                    y: e.originalEvent.layerY,
                }
                this.$canvas.mousemove(e => this.mouseMove(e));
                }, setting['longPress']);
            }
        }
    }

    mouseUp(e) {
        if (this.longPress) {
            clearTimeout(this.longPress);
            this.$canvas.css({
                cursor: 'auto',
            });
            this.$canvas.off('mousemove');
        }
        this.originX = 0;
        this.originY = 0;
        if (this.movePoints.length > 0) {
            graph.executer.pointMoveOrder(this.movePoints, e.originalEvent.layerX - this.clickPosition.x, e.originalEvent.layerY - this.clickPosition.y);
            this.movePoints = [];
            graph.canvas.updateCanvas();
        } 
    }

    changeInsertMode($cancelInsertPointButton, $insertButton) {
        this.changeMode('insertPoint');
        $cancelInsertPointButton.removeClass('active');
        $insertButton.addClass('active');
        this.$canvas.css({
            cursor: 'Crosshair',
        });
    }

    changeCancelMode($cancelInsertPointButton, $insertButton) {
        this.changeMode('cancelInsertPoint')
        $insertButton.removeClass('active');
        $cancelInsertPointButton.addClass('active');
        this.$canvas.css({
            cursor: 'auto',
        });
    }

    canvasClick(e) {
        // 隐藏所有对话框
        $('.dialog').css({
            display: 'none',
        });

        if (this.mode != 'insertPoint') {
            const ctrl = e.ctrlKey
            graph.search(e.originalEvent.layerX, e.originalEvent.layerY, ctrl);
        } else {
            const x = e.originalEvent.layerX;
            const y = e.originalEvent.layerY;
            const id = graph.getPointId();
            graph.executer.insertPoint(id, x, y);
        }
    }
}