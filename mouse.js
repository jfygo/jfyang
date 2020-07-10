class Mouse{
    constructor() {
        this.mode = 'cancelInsert';
        this.$canvas = $('#my-canvas');
    }

    init() {
        this.$canvas.click(e => this.canvasClick(e));
    }

    changeMode(newMode) {
        this.mode = newMode;
    }

    changeInsertMode($cancelInsertPointButton, $insertButton) {
        this.changeMode('insertPoint');
        $cancelInsertPointButton.removeClass('active');
        $insertButton.addClass('active');
        this.$canvas.css({
            cursor: 'pointer',
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
}