Ext.define('Rfx.view.executiveInfo.SPCOutlierMgmtView', {
    extend: 'Ext.panel.Panel',
    xtype: 'spc-outlier-mgmt-view',
    temper : 1,
    initComponent: function () {
        var storeViewTable = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'column00',
                type: 'string'
            }, {
                name: 'column01',
                type: 'string'
            }, {
                name: 'column02',
                type: 'string'
            }],
            data: [{
                column00: 'SA',
                column01: '삼성전자',
                column02: '1, 2, 3, 4, 5, 6, 7'
            }, {
                column00: 'GO',
                column01: 'Google',
                column02: '1, 4, 5, 6, 7'
            }, {
                column00: 'AP',
                column01: 'Apple',
                column02: '1, 2, 3, 4'
            }, {
                column00: 'DE',
                column01: 'Dell',
                column02: '2, 3, 4, 5, 7'
            }, {
                column00: 'AM',
                column01: 'AMD',
                column02: '1, 2, 4, 5, 6, 7'
            }, {
                column00: 'LG',
                column01: 'LG전자',
                column02: '1, 2, 3, 4, 5, 6, 7'
            }, {
                column00: 'AS',
                column01: 'ASUS',
                column02: '1, 4, 5, 6, 7'
            }, {
                column00: 'GI',
                column01: 'GIGABYTE',
                column02: '1, 2, 3, 4'
            }, {
                column00: 'MS',
                column01: 'MSI',
                column02: '2, 3, 4, 5, 7'
            }, {
                column00: 'FO',
                column01: 'FOXCONN',
                column02: '1, 2, 4, 5, 6, 7'
            }]
        });

        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'buyer_name',
                type: 'string'
            }],
            data: [{
                buyer_name: '관리이탈'
            },{
                buyer_name: '크기 7이상의 런'
            },{
                buyer_name: '한계 가까이의 점'
            },{
                buyer_name: '경향과 주기성 빈도'
            },{
                buyer_name: '이상점 리스트 5'
            },{
                buyer_name: '이상점 리스트 6'
            },{
                buyer_name: '이상점 리스트 7'
            }
            ]
        });

        var storeOutlier = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'outlier_list',
                type: 'string'
            }],
            data: [{
                outlier_list: '1. 관리이탈'
            },{
                outlier_list: '2. 크기 7이상의 런'
            },{
                outlier_list: '3. 한계 가까이의 점'
            },{
                outlier_list: '4. 경향과 주기성 빈도'
            },{
                outlier_list: '5. 이상점 리스트 5'
            },{
                outlier_list: '6. 이상점 리스트 6'
            },{
                outlier_list: '7. 이상점 리스트 7'
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
            bbar: getPageToolbar(storeViewTable),
            //frame: true,
            layout          :'fit',
            forceFit: true,
            flex: 1.5,
            columns: [{
                text: '고객사코드',
                flex: 1,
                dataIndex: 'column00'
            },{
                text: '고객사명',
                flex: 1.5,
                dataIndex: 'column01'
            },{
                text: '이상점 리스트',
                flex: 1.5,
                dataIndex: 'column02'
            }]
        });

        var gridOutlierList = Ext.create('Ext.grid.Panel', {
            store: storeOutlier,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            //bbar: getPageToolbar(storeInspect),
            autoHeight: true,
            border: true,
            layout          :'fit',
            forceFit: true,
            margin: '0 3 0 0',
            flex: 1,
            columns: [{
                text: '이상점 범례',
                flex: 2,
                dataIndex: 'outlier_list'
            }]
            //,
            //title: '검사유형 선택'
        });

        var gridInspect = Ext.create('Ext.grid.Panel', {
            store: storeInspect,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            selModel : Ext.create("Ext.selection.CheckboxModel", {} ),
            autoHeight: true,
            border: true,
            bbar: getPageToolbar(storeInspect),
            frame: false,
            layout          :'fit',
            forceFit: true,
            flex: 1,
            columns: [{
                text: '이상점 체크',
                flex: 2,
                dataIndex: 'buyer_name'
            }]
            //,
            //title: '검사유형 선택'
        });

        Ext.apply(this, {

            layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true
            },
            items:[
                {
                    title: '고객사별 이상점 리스트',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: 750,
                    items: [gridOutlierList, gridViewTable]
                },
                {
                    title: '이상점 체크',
                    frame: true,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    items: [gridInspect]
                },

            ]
        });


        this.callParent(arguments);
    },

    autoScroll: true,
    items: null
});
