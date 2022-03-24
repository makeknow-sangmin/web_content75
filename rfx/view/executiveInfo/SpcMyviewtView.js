Ext.define('Rfx.view.executiveInfo.SpcMyviewtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'spc-myview-view',
    initComponent: function(){

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
                view_name: 'Solder Ball 원재료 검사',
                creator_name: '김철수',
                create_date: '2018-06-11 13:26:34'
            },{
                view_name: 'Solder Ball 원재료 검사 2018',
                creator_name: '이만수',
                create_date: '2018-06-11 07:36:12'
            }]
        });

        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inspect_name',
                type: 'string'
            }, {
                name: 'creator_name',
                type: 'string'
            }],
            data: [{
                inspect_name: 'Solder Ball 측정_ C2008001_1',
                creator_name: '2018-06-11 13:26:34'
            },{
                inspect_name: 'Solder Ball 측정_ C2008001_2',
                creator_name: '2018-06-11 07:36:12'
            }]
        });

        var storeTable = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [
             {  name: 'v001',       type: 'string'   }
            ,{  name: 'v002',       type: 'string'   }
            ,{  name: 'v003',       type: 'string'   }
            ,{  name: 'v004',       type: 'string'   }
            ,{  name: 'v005',       type: 'string'   }
            ,{  name: 'v006',       type: 'string'   }
            ,{  name: 'v007',       type: 'string'   }
            ,{  name: 'v008',       type: 'string'   }
            ,{  name: 'v009',       type: 'string'   }
            ,{  name: 'v010',       type: 'string'   }
            ,{  name: 'v011',       type: 'string'   }
            ,{  name: 'v012',       type: 'string'   }
            ,{  name: 'v013',       type: 'string'   }
            ,{  name: 'v014',       type: 'string'   }
            ,{  name: 'v015',       type: 'string'   }
        ],
            data: [
            {
                v001 : '1',
                v002 : 'Sn',
                v003 : 'Balance',
                v004 : '96.69',
                v005 : 'Acc',
                v006 : '96.72',
                v007 : 'Acc',
                v008 : '7.36',
                v009 : 'Acc',
                v010 : '217.4', 
                v011 : 'Acc'
            }
            ,{
                v001 : '2',
                v002 : 'Ag',
                v003 : '2.6±0.1 %',
                v004 : '2.6245',
                v005 : 'Acc',
                v006 : '2.6126',
                v007 : 'Acc'
            },{
                v001 : '3',
                v002 : 'Cu',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '4',
                v002 : 'Pb',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '5',
                v002 : 'Sb',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '6',
                v002 : 'Al',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '7',
                v002 : 'Cd',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '8',
                v002 : 'Fe',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '9',
                v002 : 'Zn',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '10',
                v002 : 'Bi',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '11',
                v002 : 'As',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '12',
                v002 : 'In',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '13',
                v002 : 'Au',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '14',
                v002 : 'Ni',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '15',
                v002 : 'P',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '16',
                v002 : 'Ge',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '17',
                v002 : 'S',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            },{
                v001 : '18',
                v002 : 'Co',
                v003 : '0.5±0.2 %',
                v004 : '0.62',
                v005 : 'Acc',
                v006 : '0.60',
                v007 : 'Acc'
            }
        
        ]
        });

        var storeInspectFields = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'field_name',
                type: 'string'
            }, {
                name: 'field_type',
                type: 'string'
            }],
            data: [{
                field_name: 'Lot 번호',
                field_type: 'SYSTEM'
            },{
                field_name: '공정명',
                field_type: 'USER'
            },{
                field_name: '조성',
                field_type: 'USER'
            },{
                field_name: 'Diameter',
                field_type: 'USER'
            },{
                field_name: 'ROUNDNESS',
                field_type: 'USER'
            }]
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
            layout          :'fit',
            forceFit: true,
            margin: '5 10 0 0',
            width: 180,
            columns: [{
                text: '분석표',
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
            margin: '5 0 0 0',
            flex: 1,
            columns: [{
                text: '검사명',
                flex: 2,
                dataIndex: 'inspect_name'
            }, {
                text: '검사일자',
                width: 80,
                dataIndex: 'creator_name'
            }]
            //,
            //title: '검사유형 선택'
        });



        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  false,
            allowDeselect: true

        });

        var tableGrid = Ext.create('Ext.grid.Panel', {
            store: storeTable,
            cls : 'rfx-panel',
            selModel: selModel,
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            //border: true,
            frame: true,
            flex: 1,
            //layout          :'fit',
            region: 'center',
            forceFit: true,
            margin: '5 0 0 0',
            flex: 1,
            dockedItems : [
                        
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [{
                        xtype: "combobox",
                        forceSelection: true,
                        store: [
                            [1, "생산결과 판정"],
                            [2, "QA 판정"],
                            [3, "비중 판정"],
                            [4, "M.P 판정"]
                        ],
                        queryMode: "local",
                        name: "Combo",
                        fieldLabel: "수정항목",
                        itemId: "Combo"
                    },
                        {
                            xtype: "textfield",
                            name: "Text",
                            itemId: "Text",
                            value: 'Acc'
                        },
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text:'수정',
                            listeners : [{
                                click: function() {

                                    Ext.Msg.alert('결과', '수정 되었습니다.');

                                }
                            }]
                        }]
                    })
            ],
            columns: [{
                text: '항목',
                dataIndex: 'v001'
            }, {
                text: '화학조성',
                dataIndex: 'v002'
            }, {
                text: 'Spec(%)',
                dataIndex: 'v003'
            }, {
                text: '생산결과(%)',
                dataIndex: 'v004'
            }, {
                text: '판 정',
                dataIndex: 'v005'
            }, {
                text: 'QA결과(%)',
                dataIndex: 'v006'
            }, {
                text: '판 정',
                dataIndex: 'v007'
            }, {
                text: '비중',
                dataIndex: 'v008'
            }, {
                text: '판 정',
                dataIndex: 'v009'
            }, {
                text: 'M.P',
                dataIndex: 'v010'
            }, {
                text: '판 정',
                dataIndex: 'v011'
            }

        ]

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
                    title: '측정데이터 선택',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: 500,
                    items: [gridViewTable, gridInspect]
                },
                tableGrid

            ]
        });


        this.callParent(arguments);

    },

    autoScroll: true,
    items: null
});
