Ext.define('Rfx.view.lab.InspectCategoryMgmtView', {
    extend: 'Ext.panel.Panel',
    xtype: 'inspect-category-mgmt-view',
    initComponent: function () {

        var fields = [];

        var storeTemplate = Ext.create('Mplm.store.CubeStore', {});

        var storeCubeDim = Ext.create('Mplm.store.CubeDimStore', {});

        var storeInspect = Ext.create('Ext.data.Store', {
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
                inst_name: '테스트용 검사_C1000001',
                inst_date: '2018-06-11 11:30:30',
                lot_no: '김철수'
            }, {
                inst_name: '테스트용 검사_C1000002',
                inst_date: '2018-06-11 15:01:33',
                lot_no: '장영희'
            }]
        });

        this.storeContent = Ext.create('Ext.data.Store', {
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
                inst_name: '연월일',
                inst_date: '2018-06-11 11:30:30'
            }, {
                inst_name: '테스트값',
                inst_date: '12345'
            }]
        });

        var gridTemplate = Ext.create('Ext.grid.Panel', {
            store: storeTemplate,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(storeTemplate),
            frame: false,
            layout: 'fit',
            forceFit: true,
            margin: '0 10 0 0',
            width: 200,
            columns: [{
                text: '템플리트 이름',
                dataIndex: 'name'
            }]
        });

        gridTemplate.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gu.getCmp('gridContent2').removeAll();

                storeCubeDim.getProxy().setExtraParam('cube_uid', selections[0].id);
                storeCubeDim.load({
                    callback: function(records, operation, success) {
                        gu.getCmp('gridContent2').add({
                            xtype: "textfield",
                            name: "inspect_name",
                            fieldLabel: '검사명',
                            itemId: "Text",
                            margin: '10px',
                            width: '100%'
                        });

                        for (var i = 0; i < records.length; i++) {
                            gu.getCmp('gridContent2').add({
                                xtype: "textfield",
                                name: "Text"+i,
                                fieldLabel: records[i].data.dim_name,
                                itemId: records[i].data.id,
                                margin: '10px',
                                width: '100%'
                            });
                        }
                    }
                });
            }
        });

        storeTemplate.load();

        var gridInspect = Ext.create('Ext.grid.Panel', {
            store: storeInspect,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(storeInspect),
            frame: false,
            layout: 'fit',
            forceFit: true,
            margin: '0 10 0 0',
            flex: 1,
            columns: [{
                text: '검사명',
                dataIndex: 'inst_name'
            }, {
                text: '작성시간',
                dataIndex: 'inst_date'
            }, {
                text: '작성자',
                dataIndex: 'lot_no'
            }]
        });

        var temp = {
            title: '검사 유형',
            collapsible: true,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 2,
            items: [gridTemplate, gridInspect]
        };

        var gridContent = Ext.create('Ext.grid.Panel', {
            store: this.storeContent,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeContent),
            frame: false,
            reigon: 'east',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            columns: [{
                text: '필드명',
                dataIndex: 'inst_name'
            }, {
                text: '내용',
                dataIndex: 'inst_date'
            }]
        });

        var gridContent2 = {
            //store: storeContent,
            cls: 'rfx-panel',
            id: gu.id('gridContent2'),
            collapsible: false,
            region: 'center',
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            //bbar: getPageToolbar(storeContent),
            frame: true,
            layout: 'vbox',
            forceFit: true,
            margin: '0 10 0 0',
            flex: 1,
            title: '추가',
            items: fields
        };

        var itemApply = {
            frame: false,
            id: gu.id('gridContent'),
            region: 'east',
            tbar: {
                plugins: {
                    boxreorderer: true
                },
                items: [
                    {
                        xtype: 'tbtext',
                        id: 'label1',
                        text: ''
                    },
                    '->',
                    {
                        iconCls: null,
                        glyph: 'f0c7@FontAwesome',
                        text: '저장',
                        handler: function() {

                            var cube_dim_uids = [];
                            var contents = [];
                            var records = gu.getCmp('gridContent2').items.items;

                            for(var i = 0; i < records.length; i++) {
                                if(records[i].itemId == 'Text') {
                                    cube_dim_uids.push(-1);
                                } else {
                                    cube_dim_uids.push(records[i].itemId);
                                }
                                contents.push(records[i].value);
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/xdview/xdmInspect.do?method=insertXdmValue',
                                params:{
                                    cube_uid : gridTemplate.getSelectionModel().getSelection()[0].id,
                                    cube_dim_uids : cube_dim_uids,
                                    contents : contents
                                },
                                success : function(result, request) {
                                    gu.getCmp('gridContent2').removeAll();
                                    storeCubeDim.getProxy().setExtraParam('cube_uid',
                                        gridTemplate.getSelectionModel().getSelection()[0].id);
                                    storeCubeDim.load({
                                        callback: function(records, operation, success) {
                                            gu.getCmp('gridContent2').add({
                                                xtype: "textfield",
                                                name: "inspect_name",
                                                fieldLabel: '검사명',
                                                itemId: "Text",
                                                margin: '10px',
                                                width: '100%'
                                            });

                                            for (var i = 0; i < records.length; i++) {
                                                gu.getCmp('gridContent2').add({
                                                    xtype: "textfield",
                                                    name: "Text"+i,
                                                    fieldLabel: records[i].data.dim_name,
                                                    itemId: records[i].data.id,
                                                    margin: '10px',
                                                    width: '100%'
                                                });
                                            }
                                        }
                                    });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }, {
                        iconCls: null,
                        glyph: 'f0c5@FontAwesome',
                        text: '복제하기'
                    }, {
                        iconCls: null,
                        glyph: 'f12d@FontAwesome',
                        text: '초기화'
                    }]
            },
            layout: {
                type: 'card'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridContent2],
            activeItem: 0
        };

        var temp2 = {
            title: '상세내용',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1.5,
            items: [gridContent]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [temp, temp2, itemApply]
        });


        this.callParent(arguments);


    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300 //Only Support this
        //labelWidth: "100"     //Doesn't render with 100 Pixel Size
        //labelWidth: "100px"	//Suffix with px won't work
        //, height:20
    },
    items: null,
    storeCubeDimLoad: function() {

    }
});
