/**
 * 浮动布局实现的居中容器
 * @class BI.FloatCenterLayout
 * @extends BI.Layout
 */
BI.FloatCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatCenterLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options, items = o.items;
        var list = [], width = 100 / items.length;
        BI.each(items, function (i) {
            var widget = BI.createWidget({
                type: "bi.default"
            });
            widget.element.addClass("center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")).css({
                width: width + "%",
                height: "100%"
            });
            list.push({
                el: widget
            });
        });
        BI.each(items, function (i, item) {
            if (item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto",
                    height: "auto"
                });
                list[i].el.addItem(w);
            }
        });
        return {
            type: "bi.left",
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            items: list
        };
    },

    resize: function () {
        // console.log("floatcenter布局不需要resize");
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added");
    },

    update: function (opt) {
        return this.wrapper.update(opt);
    },

    populate: function (items) {
        this.wrapper.populate.apply(this.wrapper, arguments);
    }
});
BI.shortcut("bi.float_center", BI.FloatCenterLayout);