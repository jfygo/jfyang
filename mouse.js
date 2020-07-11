class Mouse{
    constructor() {
        this.mode = 'cancelInsertPoint';
        this.$canvas = $('#my-canvas');
        this.$canvasWrap = $('.graph-wrap');
        this.canDragCanvas = false;
        this.longPress = undefined;
        this.originX = 0;
        this.originY = 0;
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
            graph.selectPoints.forEach(point => {
                point.move(e.originalEvent.clientX - this.originX, e.originalEvent.clientY - this.originY);
            });
            graph.canvas.updateCanvas();
            graph.selectPoints.forEach(point => {
                point.markSelectPoint();
            });
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
                this.$canvas.mousemove(e => this.mouseMove(e));
                }, setting['longPress']);
            }
        }
    }

    mouseUp() {
        if (this.longPress) {
            clearTimeout(this.longPress);
            this.$canvas.css({
                cursor: 'auto',
            });
            this.$canvas.off('mousemove');
        }
        this.originX = 0;
        this.originY = 0;
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
            const point = new Point(id, x, y);
            point.draw();
            graph.addPoint(point);
        }
    }

    bindScrollEvent() {
        if (window.addEventListener){
            window.addEventListener('DOMMouseScroll', this.scorllEventHandle, false);
        } else {
            window.onmousewheel = document.onmousewheel = this.scorllEventHandle;
        }
    }
}