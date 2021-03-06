BI.DynamicDateCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1
    },

    props: {
        baseCls: "bi-dynamic-date-combo bi-border bi-focus-shadow bi-border-radius",
        height: 22,
        minDate: "1900-01-01",
        maxDate: "2099-12-31",
        format: "",
        allowEdit: true
    },


    render: function () {
        var self = this, opts = this.options;
        this.storeTriggerValue = "";
        var date = BI.getDate();
        this.storeValue = opts.value;
        return {
            type: "bi.htape",
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: opts.height,
                    height: opts.height,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: opts.height
            }, {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.combo",
                        container: opts.container,
                        ref: function () {
                            self.combo = this;
                        },
                        toggle: false,
                        isNeedAdjustHeight: false,
                        isNeedAdjustWidth: false,
                        destroyWhenHide: true,
                        el: {
                            type: "bi.dynamic_date_trigger",
                            min: opts.minDate,
                            max: opts.maxDate,
                            format: opts.format,
                            allowEdit: opts.allowEdit,
                            watermark: opts.watermark,
                            height: opts.height,
                            value: opts.value,
                            ref: function () {
                                self.trigger = this;
                            },
                            listeners: [{
                                eventName: BI.DynamicDateTrigger.EVENT_KEY_DOWN,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        self.combo.hideView();
                                    }
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_KEY_DOWN, arguments);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_STOP,
                                action: function () {
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_FOCUS,
                                action: function () {
                                    self.storeTriggerValue = self.trigger.getKey();
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_BLUR,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_BLUR);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_ERROR,
                                action: function () {
                                    self.storeValue = {
                                        type: BI.DynamicDateCombo.Static,
                                        value: {
                                            year: date.getFullYear(),
                                            month: date.getMonth() + 1
                                        }
                                    };
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_ERROR);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_VALID,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_VALID);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CHANGE);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_CONFIRM,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        return;
                                    }
                                    var dateStore = self.storeTriggerValue;
                                    var dateObj = self.trigger.getKey();
                                    if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                                        self.storeValue = self.trigger.getValue();
                                        self.setValue(self.trigger.getValue());
                                    } else if (BI.isEmptyString(dateObj)) {
                                        self.storeValue = null;
                                        self.trigger.setValue();
                                    }
                                    self._checkDynamicValue(self.storeValue);
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }]
                        },
                        adjustLength: this.constants.comboAdjustHeight,
                        popup: {
                            el: {
                                type: "bi.dynamic_date_popup",
                                behaviors: opts.behaviors,
                                min: opts.minDate,
                                max: opts.maxDate,
                                ref: function () {
                                    self.popup = this;
                                },
                                listeners: [{
                                    eventName: BI.DynamicDatePopup.BUTTON_CLEAR_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue();
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDatePopup.BUTTON_lABEL_EVENT_CHANGE,
                                    action: function () {
                                        var date = BI.getDate();
                                        self.setValue({
                                            type: BI.DynamicDateCombo.Static,
                                            value: {
                                                year: date.getFullYear(),
                                                month: date.getMonth() + 1,
                                                day: date.getDate()
                                            }
                                        });
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDatePopup.BUTTON_OK_EVENT_CHANGE,
                                    action: function () {
                                        var value = self.popup.getValue();
                                        if(self._checkValue(value)) {
                                            self.setValue(value);
                                        }
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDatePopup.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                    }
                                }]
                            },
                            stopPropagation: false
                        },
                        // DEC-4250 和复选下拉一样，点击triggerBtn不默认收起
                        hideChecker: function (e) {
                            return self.triggerBtn.element.find(e.target).length === 0;
                        },
                        listeners: [{
                            eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                            action: function () {
                                self.popup.setValue(self.storeValue);
                                self.popup.setMinDate(opts.minDate);
                                self.popup.setMaxDate(opts.maxDate);
                                self.fireEvent(BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW);
                            }
                        }]
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: {
                        type: "bi.icon_button",
                        cls: "bi-trigger-icon-button date-font",
                        width: opts.height,
                        height: opts.height,
                        listeners: [{
                            eventName: BI.IconButton.EVENT_CHANGE,
                            action: function () {
                                if (self.combo.isViewVisible()) {
                                    // self.combo.hideView();
                                } else {
                                    self.combo.showView();
                                }
                            }
                        }],
                        ref: function () {
                            self.triggerBtn = this;
                        }
                    },
                    top: 0,
                    right: 0
                }]
            }],
            ref: function (_ref) {
                self.comboWrapper = _ref;
            }
        };
    },

    mounted: function () {
        this._checkDynamicValue(this.storeValue);
    },

    _checkDynamicValue: function (v) {
        var o = this.options;
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = o.height;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    _checkValue: function (v) {
        switch (v.type) {
            case BI.DynamicDateCombo.Dynamic:
                return BI.isNotEmptyObject(v.value);
            case BI.DynamicDateCombo.Static:
            default:
                return true;
        }
    },

    _defaultState: function () {

    },

    setMinDate: function (minDate) {
        var o = this.options;
        o.minDate = minDate;
        this.trigger.setMinDate(minDate);
        this.popup && this.popup.setMinDate(minDate);
    },

    setMaxDate: function (maxDate) {
        var o = this.options;
        o.maxDate = maxDate;
        this.trigger.setMaxDate(maxDate);
        this.popup && this.popup.setMaxDate(maxDate);
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },
    getValue: function () {
        return this.storeValue;
    },
    getKey: function () {
        return this.trigger.getKey();
    },
    hidePopupView: function () {
        this.combo.hideView();
    }
});

BI.DynamicDateCombo.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.DynamicDateCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateCombo.EVENT_BLUR = "EVENT_BLUR";
BI.DynamicDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.dynamic_date_combo", BI.DynamicDateCombo);

BI.extend(BI.DynamicDateCombo, {
    Static: 1,
    Dynamic: 2
});