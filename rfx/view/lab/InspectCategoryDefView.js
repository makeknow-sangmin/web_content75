Ext.define('Rfx.view.lab.InspectCategoryDefView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'inspect-category-def-view',
    temper : 1,
    initComponent: function () {

        this.storeCube = Ext.create('Mplm.store.CubeStore', {});

        var storeCubeDim = Ext.create('Mplm.store.CubeDimStore', {});

        var gridTemplate = Ext.create('Ext.grid.Panel', {
            store: this.storeCube,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            //bbar: getPageToolbar(this.storeCube),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '큐브 코드',
                dataIndex: 'code'
            },{
                text: '큐브 이름',
                dataIndex: 'name'
            }]
        });

        this.storeCube.load();

        this.crudMode = 'CREATE';

        gridTemplate.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                storeCubeDim.getProxy().setExtraParam('cube_uid', selections[0].id);
                storeCubeDim.load();
            }
        });

        var temp = {
            title: '큐브',
            collapsible: true,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.5,
            items: [gridTemplate]
        };

        var gridDimension = Ext.create('Ext.grid.Panel', {
            store: storeCubeDim,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            //bbar: getPageToolbar(storeCubeDim),
            frame: false,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            columns: [{
                text: '차원 코드',
                dataIndex: 'dim_code'
            },{
                text: '차원 명',
                dataIndex: 'dim_name'
            },{
                text: '그룹 코드',
                dataIndex: 'dim_code2'
            },{
                text: '그룹 명',
                dataIndex: 'dim_name2'
            }, {
                text: '차원',
                dataIndex: 'position',
                renderer : function(value) {
                    if(value < 13) {
                        return value + ' 차원';
                    } else {
                        return '측정데이터'; //value;
                    }
                }
            }]
        });

        var gridViewprop = Ext.create('Ext.grid.Panel', {
            //store: storeCubeDim,
            title: '뷰 속성',
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            reigon: 'south',
            layout: 'fit',
            forceFit: true,
            flex: 1,
            columns: [{
                text: '뷰 코드',
                dataIndex: 'prop_key'
            },{
                text: '뷰 이름',
                dataIndex: 'title'
            },{
                text: '설명',
                dataIndex: 'description'
            },{
                text: '그룹 명',
                dataIndex: 'group_name'
            }, {
                text: '속성 유형',
                dataIndex: 'prop_type'
            }, {
                text: 'Buffer Pos',
                dataIndex: 'buffer_pos'
            }]
        });

        var gridContent2 = {
            cls: 'rfx-panel',
            id: gu.id('gridContent2'),
            collapsible: false,
            region: 'center',
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            layout: 'fit',
            forceFit: true,
            margin: '0 10 0 0',
            flex: 1,
            title: '추가',
            items: this.createFormPane()
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
                    '->', {
                        iconCls: null,
                        glyph: 'f0c7@FontAwesome',
                        text: '저장',
                        handler: function() {
                            gm.me().doCreate();
                            gm.me().storeCube.load();
                        }
                    }, {
                        iconCls: null,
                        glyph: 'f0c5@FontAwesome',
                        text: '복제하기'
                    }, {
                        iconCls: null,
                        glyph: 'f12d@FontAwesome',
                        text: '초기화',
                        handler: function() {
                            gm.me().doReset();
                        }
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
            title: '차원',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridDimension, gridViewprop]
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
        labelWidth: 300
    },
    items: null,

    createFormPane: function(mode) {


        //code_order2로 다시 소트
//		this.fields.sort(function(item1, item2) {
//			//console_logs('item1', item1);
//			//console_logs('item2', item2.code_order2);

//			if(item1.name == item2.name) return 0;
//			return (item1.name < item2.name) ? -1 : 1;
//		});


        var tabTitleArr = [/*'입력항목'*/];
        for(var i=0; i<this.fields.length; i++) {
            var o = this.fields[i];
            //console_logs('createFormPane o', o);
            //console_logs('createFormPane o', o);
            var tabTitle = o['tabTitle'];
            if( (tabTitle!=undefined) && (tabTitle!=null) && (tabTitle.length > 0)) {
                tabTitleArr.push(tabTitle);
            }
        }
        //중복제거
        tabTitleArr = extjsUtil.mergeDuplicateArray(tabTitleArr);

        this.formItems = [];
        for(var i=0; i<tabTitleArr.length; i++) {

            var forms = this.getFormPane(tabTitleArr[i]);

            if(i==0) {
                forms.insert({
                    cmpId: this.link + '-'+ 'selectedUidFrom',
                    xtype : 'hiddenfield',
                    name : 'default'+'|'+'unique_id' //,
                });

            }

            this.formItems.push(forms);
        }
        this.resetAction = Ext.create('Ext.Action', {
            iconCls: 'af-rotate-left',
            text: '초기화',
            disabled: true,
            handler: function() {

                gm.me().doReset();
            }
        });
        this.createAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '저장 확인',
            disabled: true,
            handler: function() {
                gm.me().doCreate();
            }
        });

        var toolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default1',
            dock: 'bottom',
            items: [{
                xtype: 'displayfield',
                name:  gMain.selectedMenuId + 'create-msg',
                cmpId:  gMain.selectedMenuId + 'create-msg',
                value: gMain.DEF_CRUD_TOOLBAR_MSG
            },'->',
                this.resetAction,this.createAction]
        });

        var myId = gMain.geTabPanelId(); //viewId +'-'+ 'tabpanel';

        this.formPane = new Ext.TabPanel({
            id: myId,
            cmpId: myId,
            collapsible: false,
            xtype: 'tabpanel',
            activeTab: 0,
            tabPosition: 'top',

            items: this.formItems,
            dockedItems: [],
            listeners: {
                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
                    if(gm.me().tabchangeHandler!=null) {
                        gm.me().tabchangeHandler(tabPanel, newTab, oldTab, eOpts);
                    }
                }
            },
        });

        this.selectedUidFrom = Ext.getCmp(this.link + '-'+ 'selectedUidFrom');


        //console_logs('*****************this.defOnlyCreate*******************', this.defOnlyCreate);

        if(this.defOnlyCreate==false || this.crudMode=='CREATE') {

            for(var key in this.defComboValues) {
                //console_logs('this.defComboValues**************************************************************');
                //console_logs('defComboValues key', key);
                var o = this.defComboValues[key];
                var combo = Ext.getCmp(gMain.selectedMenuId + '-' + key);

                if(combo!=null) {
                    combo.store.load(function(records) {
                        for (var i=0; i<records.length; i++){
                            var obj = records[i];
                            try {
                                if(obj.get(combo.valueField)==o['value'] ) {
                                    combo.select(obj);
                                }
                            } catch(e){}
                        }
                    });
                    //combo.setValue(o['value']);

                }
            }
        }



        return this.formPane;
    }
});