Ext.namespace("Ext.ux.layout");

Ext.ux.layout.TableFormLayout = Ext.extend(Ext.layout.TableLayout, {
    monitorResize: true,
    labelAutoWidth: false,
    packFields: false,
    trackLabels: Ext.layout.FormLayout.prototype.trackLabels,
    setContainer: function(ct) {
        Ext.layout.FormLayout.prototype.setContainer.apply(this, arguments);
        if (ct.labelAlign == 'top') {
            this.labelAutoWidth = false;
            if (this.fieldSpacing)
               this.elementStyle = 'padding-left: ' + this.fieldSpacing + 'px;';
        } else {
            if (this.labelAutoWidth)
                this.labelStyle = 'width: auto;';
            if (this.packFields && !ct.labelWidth)
                ct.labelWidth = 1;
        }
        if (this.fieldSpacing)
            this.labelStyle += 'padding-left: ' + this.fieldSpacing + 'px;';
        this.currentRow = 0;
        this.currentColumn = 0;
        this.cells = [];
    },
    renderItem : function(c, position, target) {
        if (c && !c.rendered) {
            var cell = Ext.get(this.getNextCell(c));
            cell.addClass("x-table-layout-column-" + this.currentColumn);
            if (c.anchor)
                c.width = 1;
            Ext.layout.FormLayout.prototype.renderItem.call(this, c, 0, cell);
        }
    },
    getLayoutTargetSize : Ext.layout.AnchorLayout.prototype.getLayoutTargetSize,
    parseAnchorRE : Ext.layout.AnchorLayout.prototype.parseAnchorRE,
    parseAnchor : Ext.layout.AnchorLayout.prototype.parseAnchor,
    getTemplateArgs : Ext.layout.FormLayout.prototype.getTemplateArgs,
    isValidParent : Ext.layout.FormLayout.prototype.isValidParent,
    onRemove : Ext.layout.FormLayout.prototype.onRemove,
    isHide : Ext.layout.FormLayout.prototype.isHide,
    onFieldShow : Ext.layout.FormLayout.prototype.onFieldShow,
    onFieldHide : Ext.layout.FormLayout.prototype.onFieldHide,
    adjustWidthAnchor : Ext.layout.FormLayout.prototype.adjustWidthAnchor,
    adjustHeightAnchor : Ext.layout.FormLayout.prototype.adjustHeightAnchor,
    getLabelStyle : Ext.layout.FormLayout.prototype.getLabelStyle,
    onLayout : function(ct, target) {
        Ext.ux.layout.TableFormLayout.superclass.onLayout.call(this, ct, target);
        if (!target.hasClass("x-table-form-layout-ct")) {
            target.addClass("x-table-form-layout-ct");
        }
        var viewSize = this.getLayoutTargetSize();
        if (this.fieldSpacing)
            viewSize.width -= this.fieldSpacing;
        var aw, ah;
        if (ct.anchorSize) {
            if (Ext.isNumber(ct.anchorSize)) {
                aw = ct.anchorSize;
            } else {
                aw = ct.anchorSize.width;
                ah = ct.anchorSize.height;
            }
        } else {
            aw = ct.initialConfig.width;
            ah = ct.initialConfig.height;
        }
        var cs = this.getRenderedItems(ct), len = cs.length, i, j, c;
        var x, col, columnWidthsPx, w;
        // calculate label widths
        if (this.labelAutoWidth) {
            var labelWidths = new Array(this.columns);
            var pad = ct.labelPad || 5;
            for (i = 0; i < this.columns; i++)
                labelWidths[i] = ct.labelWidth || 0;
            // first pass: determine maximal label width for each column
            for (i = 0; i < len; i++) {
                c = cs[i];
                // get table cell
                x = c.getEl().parent(".x-table-layout-cell");
                // get column
                col = parseInt(x.dom.className.replace(/.*x\-table\-layout\-column\-([\d]+).*/, "$1"));
                // set the label width
                if (c.label && c.label.getWidth() > labelWidths[col])
                    labelWidths[col] = c.label.getWidth();
            }
            // second pass: set the label width
            for (i = 0; i < len; i++) {
                c = cs[i];
                // get table cell
                x = c.getEl().parent(".x-table-layout-cell");
                // get column
                col = parseInt(x.dom.className.replace(/.*x\-table\-layout\-column\-([\d]+).*/, "$1"));
                // get label
                if (c.label) {
                    // set the label width and the element padding
                    c.label.setWidth(labelWidths[col]);
                    c.getEl().parent(".x-form-element").setStyle('paddingLeft',(labelWidths[col] + pad - 3) + 'px');
                }
            }
        }
        if (!this.packFields) {
            var rest = viewSize.width;
            columnWidthsPx = new Array(this.columns);
            // Calculate the widths in pixels
            for (j = 0; j < this.columns; j++) {
                if (this.columnWidths)
                    columnWidthsPx[j] = Math.floor(viewSize.width * this.columnWidths[j]);
                else
                    columnWidthsPx[j] = Math.floor(viewSize.width / this.columns);
                rest -= columnWidthsPx[j];
            }
            // Correct the last column width, if necessary
            if (rest > 0)
                columnWidthsPx[this.columns - 1] += rest;
        }
        for (i = 0; i < len; i++) {
            c = cs[i];
            // get table cell
            x = c.getEl().parent(".x-table-layout-cell");
            if (!this.packFields) {
                // get column
                col = parseInt(x.dom.className.replace(/.*x\-table\-layout\-column\-([\d]+).*/, "$1"));
                // get cell width (based on column widths)
                for (j = col, w = 0; j < (col + (c.colspan || 1)); j++)
                    w += columnWidthsPx[j];
                // set table cell width
                x.setWidth(w);
            }
            // perform anchoring
            if (c.anchor) {
                var a, h, cw, ch;
                if (this.packFields)
                    w = x.getWidth();
                // get cell width (subtract padding for label) & height to be base width of anchored component
                this.labelAdjust = c.getEl().parent(".x-form-element").getPadding('l');
                if (this.labelAdjust && ct.labelAlign == 'top')
                    w -= this.labelAdjust;
                h = x.getHeight();
                a = c.anchorSpec;
                if (!a) {
                    var vs = c.anchor.split(" ");
                    c.anchorSpec = a = {
                        right: this.parseAnchor(vs[0], c.initialConfig.width, aw),
                        bottom: this.parseAnchor(vs[1], c.initialConfig.height, ah)
                    };
                }
                cw = a.right ? this.adjustWidthAnchor(a.right(w), c) : undefined;
                ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h), c) : undefined;
                if (cw || ch) {
                    c.setSize(cw || undefined, ch || undefined);
                }
            }
        }
    }
});

Ext.Container.LAYOUTS["tableform"] = Ext.ux.layout.TableFormLayout;