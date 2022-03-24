Ext.define('Rfx.view.executiveInfo.SPCTemplateMgmtView', {
    extend: 'Ext.panel.Panel',
    xtype: 'spc-template-mgmt-view',
    temper : 1,
    initComponent: function () {
        var storeViewTable = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'view_name',
                type: 'string'
            }, {
                name: 'creator_name',
                type: 'string'
            }, {
                name: 'create_date',
                type: 'string'
            }],
            data: [{
                view_name: 'SPC 양식 1',
                creator_name: '김철수',
                create_date: '2018-06-11 13:26:34'
            },{
                view_name: 'SPC 양식 2',
                creator_name: '이만수',
                create_date: '2018-06-11 07:36:12'
            }]
        });

        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'buyer_name',
                type: 'string'
            }],
            data: [{
                buyer_name: '삼성전자'
            },{
                buyer_name: 'Google'
            },{
                buyer_name: 'Apple'
            },{
                buyer_name: 'Dell'
            },{
                buyer_name: 'AMD'
            }
            ]
        });

        var gridViewTable = Ext.create('Ext.grid.Panel', {
            //title: '분석표 목록',
            store: storeViewTable,
            cls : 'rfx-panel',
            //region:'west',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            //bbar: getPageToolbar(storeViewTable),
            //frame: true,
            padding: '0 10 0 0',
            flex: 1,
            layout          :'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: 'SPC 템플릿 리스트',
                flex: 1,
                dataIndex: 'view_name'
            }]
        });

        var gridInspect = Ext.create('Ext.grid.Panel', {
            store: storeInspect,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            bbar: getPageToolbar(storeInspect),
            //frame: true,
            layout          :'fit',
            forceFit: true,
            flex: 1,
            columns: [{
                text: '고객사명',
                flex: 2,
                dataIndex: 'buyer_name'
            }]
        });

        var tableGrid = {
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            frame: false,
            //layout          :'fit',
            region: 'center',
            flex: 1,
            //forceFit: true,
            margin: '5 0 0 0',
            padding: 10,
            width: '100%',
            flex: 1,
            items : [
                {
                    xtype: 'textfield',
                    width: 400,
                    name: 'template_name',
                    fieldLabel: '템플릿 이름'
                },
                {
                    xtype: 'filefield',
                    width: 400,
                    name: 'template_file',
                    fieldLabel: '템플릿 파일'
                },
                {
                    xtype: 'button',
                    width: 400,
                    text: '검증'
                }
            ]
        };

        var tableGrid2 = Ext.create('Ext.tab.Panel', {
            width: '100%',
            flex: 4,
            items: [{
                title : '데이터',
                padding : 10,
                items : [
                    {
                        xtype: 'textfield',
                        width: 400,
                        fieldLabel: 'SPC 항목 1'
                    },
                    {
                        xtype: 'textfield',
                        width: 400,
                        fieldLabel: 'SPC 항목 2'
                    },
                    {
                        xtype: 'textfield',
                        width: 400,
                        fieldLabel: 'SPC 항목 3'
                    }
                ]
            }
            ]
        });

        var temp = {
            title: '검사 유형',
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 2,
            items: [tableGrid2]
        };

        var itemApply = {
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
                        id: 'label2',
                        text: ''
                    },
                    '->',
                    {
                        iconCls: null,
                        glyph: 'f0c7@FontAwesome',
                        text: gm.getMC('CMD_DELETE', '삭제')
                    }]
            },
            layout: {
                type: 'card'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [temp],
            activeItem: 0
        };


        Ext.apply(this, {

            layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true
            },
            items:[
                {
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex : 1,
                    items: [gridViewTable, gridInspect]
                },
                itemApply

            ]
        });


        this.callParent(arguments);
    },

    autoScroll: true,
    items: null
});
