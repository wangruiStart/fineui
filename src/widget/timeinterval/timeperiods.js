/**
 * 时间区间
 * qcc
 * 2019/2/28
 */

!(function () {
    BI.TimePeriods = BI.inherit(BI.Single, {
        constants: {
            height: 24,
            width: 24,
            lgap: 15,
            offset: 0
        },
        props: {
            extraCls: "bi-time-interval",
            value: {}
        },
        render: function () {
            var self = this, o = this.options;

            return {
                type: "bi.absolute",
                height: this.constants.height,
                items: [{
                    el: {
                        type: "bi.horizontal_auto",
                        items: [{
                            type: "bi.label",
                            height: this.constants.height,
                            width: this.constants.width,
                            text: "-",
                            ref: function (_ref) {
                                self.label = _ref;
                            }
                        }]
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: {
                        type: "bi.center",
                        height: this.constants.height,
                        items: [{
                            type: "bi.absolute",
                            items: [{
                                el: BI.extend({
                                    ref: function (_ref) {
                                        self.left = _ref;
                                    }
                                }, this._createCombo(o.value.start)),
                                left: this.constants.offset,
                                right: this.constants.width / 2,
                                top: 0,
                                bottom: 0
                            }]
                        }, {
                            type: "bi.absolute",
                            items: [{
                                el: BI.extend({
                                    ref: function (_ref) {
                                        self.right = _ref;
                                    }
                                }, this._createCombo(o.value.end)),
                                left: this.constants.width / 2,
                                right: this.constants.offset,
                                top: 0,
                                bottom: 0
                            }]
                        }]
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }]
            };
        },

        _createCombo: function (v) {
            var self = this;
            return {
                type: "bi.time_combo",
                value: v,
                listeners: [{
                    eventName: BI.TimeCombo.EVENT_BEFORE_POPUPVIEW,
                    action: function () {
                        self.left.hidePopupView();
                        self.right.hidePopupView();
                    }
                }, {
                    eventName: BI.TimeCombo.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.TimePeriods.EVENT_CHANGE);
                    }
                }, {
                    eventName: BI.TimeCombo.EVENT_CONFIRM,
                    action: function () {
                        self.fireEvent(BI.TimePeriods.EVENT_CONFIRM);
                    }
                }]
            };
        },

        setValue: function (date) {
            date = date || {};
            this.left.setValue(date.start);
            this.right.setValue(date.end);
        },
        getValue: function () {
            return {start: this.left.getValue(), end: this.right.getValue()};
        }
    });
    BI.TimePeriods.EVENT_CONFIRM = "EVENT_CONFIRM";
    BI.TimePeriods.EVENT_CHANGE = "EVENT_CHANGE";
    BI.shortcut("bi.time_periods", BI.TimePeriods);
})();