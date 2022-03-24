Ext.define('Rfx2.base.BaseViewV2', {
    extend: 'Rfx2.base.AbsBaseViewV2',
    initComponent: function () {

        Ext.QuickTips.init();

        Ext.override(Ext.data.proxy.Ajax, {timeout: 60000});

        if (gMain.checkPcHeight() && gMain.checkPcWidth()) {

            if (gMain.checkPcHeight() && gMain.checkPcWidth()) {

            }

            let data1 = [];
            let clipColumns = [];
            Ext.each(this.columns, function (o) {

                let name = o['text'];
                let code = o['dataIndex'];

                data1.push({
                    name: name,
                    code: code
                });

                clipColumns.push({
                    text: o['text'],
                    dataIndex: o['dataIndex'],
                    handler: function (r) {
                        let o = gu.getCmp('clipboard');
                        o.value = r.dataIndex;
                        gm.me().popupClip(r.dataIndex, r.text, 300, 500);
                    }
                });
            });

            let datas = [];

            for (let i = 0; i < 3; i++) {
                let store = Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'code', type: 'string'},
                        {name: 'name', type: 'string'}
                    ],
                    proxy: {
                        type: 'memory',
                        data: data1,
                        reader: {
                            type: 'json'
                        }
                    },
                    sorters: [{
                        property: 'name',
                        direction: 'ASC'
                    }]
                });

                if (i > 0) {
                    datas.push({xtype: 'tbspacer', hidden: this.multiSortHidden});
                    datas.push({
                        xtype: 'component',
                        hidden: this.multiSortHidden,
                        html: '<span style="color: #5E9BD0; ">|</span>'
                    });
                    datas.push({xtype: 'tbspacer', hidden: this.multiSortHidden});
                }

                datas.push({
                    xtype: 'combobox',
                    store: store,
                    id: gu.id('multisort' + (i + 1) + 'combo'),
                    hidden: this.multiSortHidden,
                    width: 100,
                    emptyText: '정렬기준 ' + (i + 1),
                    displayField: 'name',
                    valueField: 'code',
                    forceSelection: false,
                    editable: true,
                    triggerAction: 'all',
                    enableKeyEvents: true,
                    autoLoad: true,
                    autoSync: true,
                    listConfig: {
                        getInnerTpl: function () {
                            return '<div data-qtip="{code}"><small>{name}</small></div>';
                        }
                    },
                    listeners: {
                        select: function () {
                            gm.me().setMultisortCond();
                        }
                    }
                });

                datas.push(new Ext.form.Hidden({
                    id: gu.id('multisort' + (i + 1) + 'ascdesc'),
                    value: ''
                }));

                datas.push({xtype: 'tbspacer', hidden: this.multiSortHidden});
                datas.push({
                    xtype: 'button',
                    iconCls: 'fa-sort-alpha-asc',
                    tooltip: '오름차순',
                    hidden: this.multiSortHidden,
                    index: i,
                    value: 'asc',
                    style: {
                        background: '#EAEAEA'
                    },
                    listeners: {
                        click: function () {
                            let v = this.value;
                            let index = this.index;

                            this.value = (v === 'asc') ? 'desc' : 'asc';
                            if (this.value === 'asc') {
                                this.setIconCls('fa-sort-alpha-asc');
                                this.setTooltip('오름차순');
                            } else {
                                this.setIconCls('font-awesome_4-7-0_sort-alpha-desc_14_0_f39c12_none');
                                this.setTooltip('내림차순');
                            }


                            gu.getCmp('multisort' + (index + 1) + 'ascdesc').setValue(this.value);

                            gm.me().setMultisortCond();
                        }
                    }

                });


            }

            datas.push({xtype: 'tbspacer', hidden: this.multiSortHidden});
            datas.push({xtype: 'component', hidden: this.multiSortHidden, html: '<span style="color: #5E9BD0; ">|</span>'});
            datas.push({xtype: 'tbspacer', hidden: this.multiSortHidden});
            datas.push({
                id: gu.id('clipboard'), // + this.link+sub_key,
                xtype: 'splitbutton',
                text: '값복사',
                value: null,
                hidden: this.multiSortHidden,
                tooltip: '값복사 필드 선택',
                handler: function () {
                    gm.me().popupClip(null, null, 1000, 600);
                }, // handle a click on the button itself
                menu: new Ext.menu.Menu({
                    items: clipColumns
                })
            });

            datas.push({xtype: 'tbspacer'});
            datas.push({xtype: 'tbspacer'});
            datas.push({xtype: 'tbspacer'});

            datas.push(
                new Ext.form.Hidden({
                    id: gu.id('sortCond-multisort'),
                    value: 'unique_id desc'
                }));

            this.header = {
                items: datas
            };

            this.tools = [
                {
                    xtype: 'tool',
                    type: 'refresh',
                    qtip: "다시그리기",
                    scope: this,
                    text: '다시그리기',
                    handler: function (e, target, header) {
                        let ownerCt = header.ownerCt;
                        ownerCt.redrawStore();
                    }
                },
                {
                    type: 'mytool',
                    width: 50,
                    bind: {
                        html: '<div class="x-tool-mytool" title="다운로드"><img src="{srcDownload}" align="{align}" />{excel}</div>'
                    },
                    handler: this.printExcelHandler
                }];
        }


        this.callParent(arguments);
        if (gMain.checkPcWidth() === false) {
            gMain.closeMenu();
        }
    },

    insertDategangeField: function (srchToolbar, field_id, fieldObj) {

        let srchId = gMain.getSearchField(field_id);
        let srchId_link = this.link + '-' + srchId;

        let valSdate = fieldObj['sdate'];
        let valEdate = fieldObj['edate'];

        let labelWidth = fieldObj['labelWidth'] === undefined ? 48 : fieldObj['labelWidth'];

        let yyyymmdd = gUtil.yyyymmdd(valSdate) + ':' + gUtil.yyyymmdd(valEdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymmdd}));

        let s_date = srchId_link + '-s';
        let e_date = srchId_link + '-e';

        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'

        });

        let disabled = fieldObj['disabled'] == null ? false : fieldObj['disabled'];
        let editable = fieldObj['editable'] == null ? true : fieldObj['editable'];

        srchToolbar.push({
            cmpId: s_date,
            name: s_date,
            id: s_date,
            format: 'Y-m-d',
            disabled: disabled,
            editable: editable,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: valSdate,
            width: 102,
            listeners: {
                select: {
                    fn: function (a) {
                        if (a.focusTask !== undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function () {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey: function (fieldObj, e) {
                    if (e.getKey() === Ext.EventObject.ENTER) {
                        gm.me().redrawStore(true);
                    }
                }
            }

        });

        srchToolbar.push({
            xtype: 'label',
            text: "~",
            style: 'color:white;'
        });

        srchToolbar.push({
            cmpId: e_date,
            name: e_date,
            id: e_date,
            format: 'Y-m-d',
            disabled: disabled,
            editable: editable,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            allowBlank: true,
            xtype: 'datefield',
            value: valEdate,
            width: 102,
            listeners: {
                select: {
                    fn: function (a) {
                        if (a.focusTask !== undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function () {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey: function (fieldObj, e) {
                    if (e.getKey() === Ext.EventObject.ENTER) {

                        gm.me().redrawStore(true);
                    }
                }
            }
        });
    },

    getMC: function (variableCode, falseMsg) {
        try {
            return eval(variableCode);
        } catch (e) {
            return falseMsg;
        }
    }
});