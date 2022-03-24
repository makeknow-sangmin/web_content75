Ext.define('Rfx.view.executiveInfo.SpcItemMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'spc-item-mgmt-view',
    initComponent: function() {

        var panelTest = Ext.create('Ext.panel.Panel', {
            cls: 'rfx-panel',
            title: '항목 구분',
            flex: 0.5,
            region: 'west',
            frame: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: '구분',
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType'),
                            vertical: 'true',
                            items: [
                                { boxLabel: 'POP 데이터', name: 'radio1'},
                                { boxLabel: '측정 데이터', name: 'radio1'},
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: gm.getMC('CMD_Product', '제품군'),
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType2'),
                            vertical: 'true',
                            items: [
                                { boxLabel: 'Au', name: 'radio2'},
                                { boxLabel: 'Cu', name: 'radio2'},
                                { boxLabel: 'Ag', name: 'radio2'},
                                { boxLabel: 'SB', name: 'radio2'}
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '공정',
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType3'),
                            vertical: 'true',
                            items: [
                                { boxLabel: '신선', name: 'radio3'},
                                { boxLabel: '열처리', name: 'radio3'},
                                { boxLabel: '권선', name: 'radio3'}
                            ]
                        }
                    ]
                }
            ]
        });

        var storeTemplate = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inst_name',
                type: 'string'
            }, {
                name: 'inst_date',
                type: 'string'
            }, {
                name: 'lot_no',
                type: 'string'
            }],
            data: [{
                inst_name: '내부 SPC 항목1'
            }, {
                inst_name: '내부 SPC 항목2'
            }]
        });

        var gridSpcItems = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            title: '항목 목록',
            store: storeTemplate,
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            selModel: Ext.create('Ext.selection.CheckboxModel', {}),
            bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout: 'fit',
            forceFit: true,
            region : 'center',
            margin: '0 0 0 0',
            //width: 200,
            columns: [{
                text: '항목명',
                dataIndex: 'inst_name'
            }]
        });

        var itemSpcItems = {
            frame: false,
            id: gu.id('gridContent'),
            region: 'center',
            tbar: {
                plugins: {
                    boxreorderer: true
                },
                items: [
                    {
                        xtype: 'tbtext',
                        id: 'label3',
                        text: ''
                    },
                    '->', {
                        iconCls: null,
                        glyph: 'f067@FontAwesome',
                        text: '추가',
                        handler: function () {

                        }
                    }, {
                        iconCls: null,
                        glyph: 'f12d@FontAwesome',
                        text: gm.getMC('CMD_DELETE', '삭제')
                    }]
            },
            layout: {
                type: 'card'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridSpcItems],
            activeItem: 0
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [panelTest, itemSpcItems]
        });

        this.callParent(arguments);

    }
});
