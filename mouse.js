class Mouse{
    constructor() {
        this.mode = 'cancelInsert';
        this.$canvas = $('#my-canvas');
        this.$canvasWrap = $('.graph-wrap');
        this.canDragCanvas = false;
        this.longPress = undefined;
    }

    init() {
        this.$canvas.click(e => this.canvasClick(e));
        this.bindScrollEvent();
        this.$canvas.mousedown(e => this.mouseDown(e));
        this.$canvas.mouseup(e => this.mouseUp(e));
    }

    changeMode(newMode) {
        this.mode = newMode;
    }

    mouseMove(e, x, y) {
        graph.canvas.move(e.originalEvent.clientX - x, e.originalEvent.clientY - y);
    }

    mouseDown(e) {
        if (e.which === 1) {
            const x = e.originalEvent.clientX;
            const y = e.originalEvent.clientY;
            this.longPress = setTimeout(() => {
                this.$canvas.css({
                    cursor: 'move',
                });
                this.$canvas.mousemove(e => this.mouseMove(e, x, y));
            }, 800)
        }
    }

    mouseUp() {
        if (this.longPress) {
            clearTimeout(this.longPress);
            this.$canvas.css({
                cursor: 'auto',
            });
            this.$canvas.off('mousemove');
            const position = this.$canvasWrap.offset();
            graph.canvas.left = position.left;
            graph.canvas.top = position.top - $('.top').height();
        }

        if (this.mode === 'insertPoint') {
            this.$canvas.css({
                cursor: 'Crosshair',
            });
        }

        graph.canvas.moveX = 0;
        graph.canvas.moveY = 0;
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

    scorllEventHandle(event) {
        let delta = 0;
        if (!event) {
            event = window.event;
        }
        if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
            delta = event.wheelDelta / 120; 
            if (window.opera){
                delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
            } 
        } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
            delta = -event.detail / 3;
        }
        graph.canvas.scale(delta);
    }
}