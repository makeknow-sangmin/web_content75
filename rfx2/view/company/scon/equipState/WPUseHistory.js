//디자인 파일
Ext.define('Rfx2.view.company.scon.equipState.WPUseHistory', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wp-use-history-view',
    initComponent: function() {


//        //검색툴바 필드 초기화
//        this.initSearchField();
//
//        this.addSearchField('pj_name');

       
        this.createStore('Rfx.model.PartLine', [{
                
                property: 'pl_no',
                direction: 'ASC'
            }],
            gMain.pageSize /*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            //Orderby list key change
            // ordery create_date -> p.create로 변경.
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_uid'
            }
            //        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        
            );


        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
//            	this.addPartAction,
//            	this.bomEditAction,
//            	this.removeAction
            ]
        });

        this.createGridCore([ buttonToolbar ], {
            width: '60%',
            title: '몰드사용이력'
        });


        this.setGridOnCallback(function(selections) {
           
            if (selections.length) {
                rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
                gm.me().assymapUidbom = rec.get('unique_uid');
                gm.me().assymapPcr_div = rec.get('request_comment');
                gm.me().assymapBmQuan = rec.get('bm_quan');
                gm.me().assyId = rec.get('hier_pos');
                gm.me().assylevel = rec.get('reserved_integer1');
                gm.me().selectedRecord = rec;
                gUtil.enable(gm.me().bomEditAction);

            } else {

                gUtil.disable(gm.me().bomEditAction);
            }


        });


        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });


        this.commonStandardStore.load(function(records) {
            for (var i = 0; i < records.length; i++) {
                var obj = records[i];
                //console_logs('commonStandardStore2['+i+']=', obj);
                gm.me().standard_flag_datas.push(obj);
            }
        });

        this.WoodenPatternStore.load();


        this.callParent(arguments);

    },
    setRelationship: function(relationship) {},

    createCenter: function() {


        var myCartColumn = [];
        var myCartFields = [];

        for (var i = 0; i < this.columns.length; i++) {

            switch (this.columns[i]['dataIndex']) {
                case 'req_info':
                case 'statusHangul':
                case 'sales_price':
                case 'goodsout_quan':
                    break;
                default:
                    myCartColumn.push(this.columns[i]);
            }
        }


        var selModelMycart = Ext.create("Mplm.util.SelModelCheckbox", {
            onlyCheckOwner: false
        });


        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '70%',
            items: [this.grid]
        });

        return this.center;

    },

    //----------------------- END OF CENTER --------------------

    createWest: function() {

        this.removeAssyAction = Ext.create('Ext.Action', {
            itemId: 'removeAssyAction',
            iconCls: 'af-remove',
            text: '제품' + CMD_DELETE,
            disabled: true,
            handler: function(widget, event) {
                Ext.MessageBox.show({
                    title: delete_msg_title,
                    msg: delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteAssyConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.editAssyAction = Ext.create('Ext.Action', {
            itemId: 'editAssyAction',
            iconCls: 'af-edit',
            disabled: true,
            text: '제품수정',
            handler: function(widget, event) {

                var uniqueId = parent;
                var classCode = gm.me().classCode;
                var itemCode = gm.me().itemCode;
                var itemName = gm.me().itemName;
                var description = gm.me().description;
                //    	    	if(assyCode==null || assyCode=='') {
                //    	    		Ext.MessageBox.alert('Error','수정할 Assembly를 선택하세요.', callBack);  
                //    	            function callBack(id){  
                //    	                return
                //    	            } 
                //    	            return;
                //    	    	}



                //var lineGap = 30;
 
                var inputItem = [];
                inputItem.push({
                    xtype: 'textfield',
                    name: 'classCode',
                    fieldLabel: '분류코드',
                    allowBlank: false,
                    value: classCode,
                    anchor: '-5',
                    //readOnly : true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                });
                inputItem.push({
                    xtype: 'textfield',
                    name: 'itemCode',
                    fieldLabel: '품목코드',
                    allowBlank: false,
                    value: itemCode,
                    anchor: '-5',
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                });
                inputItem.push({
                    xtype: 'textfield',
                    name: 'item_name',
                    fieldLabel: '품명',
                    allowBlank: true,
                    value: itemName,
                    anchor: '-5',
                    editable: true //,
                    //readOnly : false
                    //,
                    //fieldStyle : 'background-color: #ddd; background-image: none;'
                });

                var bHeight = 250;
                var form = Ext.create('Ext.form.Panel', {
                    id:  'modformPanel-' + this.link,
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    width: 400,
                    height: bHeight,
                    defaults: {
                        // anchor: '100%',
                        editable: false,
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: inputItem
                });
                var win = Ext.create('ModalWindow', {
                    title: '제품정보수정',
                    width: 400,
                    height: bHeight,
                    minWidth: 250,
                    minHeight: 180,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function() {
                            var form = Ext.getCmp('modformPanel-' + this.link).getForm();
                            if (form.isValid()) {
                                var val = form.getValues(false);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/material.do?method=update',
                                    params: {

                                        id:  uniqueId,
                                        item_name: val['item_name']
                                    },
                                    success: function(result, request) {
                                    	gm.me().WoodenPatternStore.load();
                                    },
                                    failure: extjsUtil.failureMessage
                                });

                                if (win) {
                                    win.close();
                                }
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }

                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function() {
                            if (win) {
                                win.close();
                            }
                        }
                    }]
                });
                win.show( /* this, function(){} */ );
            } //endofhandler
        });

        this.addAssyAction = Ext.create('Ext.Action', {
            itemId: 'addAssyAction',
            iconCls: 'af-plus-circle',
            disabled: false,
            text: '제품 등록',
            handler: function(widget, event) {

                console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

                var pre_item_code = '0100000002-' + gu.yyyymmdd(new Date(), '');
                var child = -1;
                var ac_uid = -1;
                var unique_uid = -1;
                var assy_name = '제품등록';
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=getNextItemcode',
                    params: {
                    	pre_item_code: pre_item_code
                    },
                    success: function(result, request) {
                        console_logs('result.responseText', result);
                        var vItemcode = result.responseText;
                       

                        var lineGap = 30;
                        var bHeight = 300;


                        var inputItem = [];

                        inputItem.push(new Ext.form.Hidden({
                        	value: child,
                            name: 'child'
                        })); 
                        inputItem.push(new Ext.form.Hidden({
                        	value: ac_uid,
                            name: 'ac_uid'
                        })); 
                        inputItem.push(new Ext.form.Hidden({
                        	value: gm.me().selectedPjCode,
                            name: 'pj_code'
                        })); 
                      inputItem.push({
	                      xtype: 'textfield',
	                      	id: gu.id('target_item_code'),
	                    	name: 'target_item_code',
	                    	emptyText: '자동 생성',
	                      fieldLabel: '제품 코드',
                          readOnly: true,
                          fieldStyle: 'background-color: #EAEAEA; background-image: none;',
	                      anchor: '-5',
	                      value: vItemcode
	                  });
                      inputItem.push({
                          xtype: 'textfield',
                          id: gu.id('target_assy_name'),
                          name: 'assy_name',
                          fieldLabel: '제품 명',
                          value: 'Valve Remote Control System',
                          allowBlank: false,
                          anchor: '-5'
                      });
                      
                      inputItem.push(new Ext.form.Hidden({
                    	  id: gu.id('target_child'),
                          name: 'target_child',
                          value: -1
                      })); 
                      
                      inputItem.push(new Ext.form.Hidden({
                          name: 'unique_uid',
                          value: -1
                      }));
                        
                        inputItem.push({
                            xtype: 'numberfield',
                            name: 'alter_reason',
                            fieldLabel: 'REV.',
                            allowBlank: false,
                            value: 1,
                            anchor: '-5'
                        });
                      inputItem.push({
	                      xtype: 'textfield',
	                      name: 'comment',
	                      fieldLabel: '등록자',
	                      value: vCUR_USER_NAME,
	                      allowBlank: false,
	                      fieldStyle: 'text-align: right;',
	                      anchor: '-5'
	                  });
                      inputItem.push({
	                      xtype: 'textfield',
	                      name: 'model_no',
	                      fieldLabel: '등록일자',
	                      value: gu.yyyymmdd(new Date(), '-') + ' ' + gu.hhmmss(new Date()),
	                      allowBlank: false,
	                      fieldStyle: 'text-align: right;',
	                      anchor: '-5'
	                  });
                        gm.me().createAssyForm = Ext.create('Ext.form.Panel', {
                            defaultType: 'textfield',
                            border: false,
                            bodyPadding: 15,
                            width: 400,
                            height: bHeight,
                            bodyPadding: 15,
                            defaults: {
                                // anchor: '100%',
                                editable: true,
                                allowBlank: false,
                                msgTarget: 'side',
                                labelWidth: 100
                            },
                            items: inputItem
                        });
                        
                        
                        var win = Ext.create('ModalWindow', {
                            title: '제품 추가 등록',
//                            header: {
//                                titlePosition: 2//,
//                                //titleAlign: 'center'
//                            },
                            width: 400,
                            height: bHeight,
                            minWidth: 250,
                            minHeight: 180,
                            //maximizable: true,
                            items:gm.me().createAssyForm,
                            
                            buttons: [{
                                text: CMD_OK,
                                handler: function() {
                                    var form = gm.me().createAssyForm;
                                    if (form.isValid()) {
                                        var val = form.getValues(false);
                                        
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/design/bom.do?method=createTemplateAssy',
                                            params: {
                                            	parent_uid: -1,
                                                parent: -1,
                                                ac_uid: -1,
                                                pl_no: '---',
                                                bm_quan: 1,
                                                item_name: val['assy_name'],
                                                item_code: val['target_item_code'],
                                                alter_reason: 'R' + val['alter_reason'],
                                                comment: val['comment'],
                                                model_no: val['model_no'],
                                                pj_code: '',
                                                child: -1
                                            },
                                            success: function(result, request) {
                                            	
                                            	gm.me().WoodenPatternStore.load();
                                            },
                                            failure: extjsUtil.failureMessage
                                        });

                                        if (win) {
                                            win.close();
                                        }
                                    } else {
                                        Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                    }

                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function() {
                                    if (win) {
                                        win.close();
                                    }
                                }
                            }]
                        });
                        win.show( /* this, function(){} */ );
                    } // endofhandler
                });


            },
            failure: extjsUtil.failureMessage
        });

        // Context Popup Menu
        this.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [ /* this.editAssyAction, this.removeAssyAction*/ ]
        });


        Ext.define('SrcAhd', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'unique_id',
                type: "string"
            }, {
                name: 'item_code',
                type: "string"
            }, {
                name: 'item_name',
                type: "string"
            }, {
                name: 'specification',
                type: "string"
            }, {
                name: 'maker_name',
                type: "string"
            }, {
                name: 'description',
                type: "string"
            }, {
                name: 'specification_query',
                type: "string"
            }],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success'
                }
            }
        });
        this.searchStore = new Ext.data.Store({
            pageSize: 16,
            model: 'SrcAhd',
            // remoteSort: true,
            sorters: [{
                    property: 'specification',
                    direction: 'ASC'
                },
                {
                    property: 'item_name',
                    direction: 'ASC'
                }
            ]

        });




        this.WoodenPatternStore = Ext.create('Mplm.store.WoodenPatternStore');

        var productItems = [
            	            {
            				    dock: 'top',
            				    xtype: 'toolbar',
            				    cls: 'my-x-toolbar-default2',
            					items: [
//            					        this.addAssyAction, 
//            					        this.editAssyAction, 
//            					        this.removeAssyAction
            					       ]
            				}

        ];
            productItems.push({
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default5',
                items: [
                	
                ]
            });
        this.woodPatternGrid =
            Ext.create('Rfx.view.grid.WoodPattern', {
//                id: this.link + '-Assembly',
            	id: this.link + '-WoodPattern',
                title: '몰드List', // cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.WoodenPatternStore,
                layout: 'fit',
//                forceFit: true,
                dockedItems: productItems


            }); //woodPatternGrid of End


        this.woodPatternGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gUtil.enable(gm.me().addPartAction);
                gUtil.enable(gm.me().editAssyAction);
 	
                try {
                    if (selections != null) {
                    	
                        var rec = selections[0];
                        console.log('rec>>>>>>>>>>>>>', rec);

                        var start_date_gridselect = new Date();
                        console.log('>>>start_date_grid_select>>>',start_date_gridselect);

                        gm.me().classCode = rec.get('class_code');
                        gm.me().itemName = rec.get('item_name');
                        gm.me().itemCode = rec.get('item_code');
                        gm.me().modelNo = rec.get('model_no');
                        gm.me().description = rec.get('description');
                        gm.me().parent = rec.get('unique_id_long');
                        gm.me().parent_uid = rec.get('unique_uid');
                        gm.me().reserved_varchar1 = rec.get('item_code');

                        parent = rec.get('unique_id_long');
                        gm.me().store.getProxy().setExtraParam('parent', parent);
                        gm.me().store.getProxy().setExtraParam('parent_uid', -1);
                        gm.me().store.getProxy().setExtraParam('ac_uid', -1);
                        gm.me().store.getProxy().setExtraParam('orderBy', "pl_no");
                        gm.me().store.getProxy().setExtraParam('ascDesc', "ASC");
                        gm.me().store.getProxy().setExtraParam('bom_flag', "T");
                        gm.me().store.load();

                    }
                } catch (e) {
                    console_logs('e', e);
                }
                var end_date_gridselect = new Date();
                console.log('>>>end_date_gridselect>>>',end_date_gridselect);
                var elpasedTime = end_date_gridselect - start_date_gridselect;
                console.log('>>> elpasedTime >>>',elpasedTime);
            }
        });

        this.west = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '40%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },

            items: [this.woodPatternGrid ]
        });

        return this.west;
    },
    cellEditing: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing1: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing2: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    // *****************************GLOBAL VARIABLE**************************/
    grid: null,
    gridStock: null,
    store: null,
    stockStore: null,
    gItemGubunType: null,
    itemGubunType: null,

    sales_price: '',
    quan: '',
    selectedAssyRecord: null,
    lineGap: 35,

    selectedPjUid: '',
    selectedAssyUid: '',

    toPjUidAssy: '', // parent
    toPjUid: '', // ac_uid
    selectionLength: 0,

    commonUnitStore: null,
    commonCurrencyStore: null,
    commonModelStore: null,
    commonStandardStore2: null,

    assy_pj_code: '',
    selectedAssyCode: '',
    selectedPjCode: '',
    selectedPjName: '',
    selectedAssyDepth: 0,
    selectedAssyName: '',
    selectedparent: '',
    ac_uid: '',
    selectedPjQuan: 1,
    selectedAssyQuan: 1,
    selectedMakingQuan: 1,

    addpj_code: '',
    is_complished: false,
    routeTitlename: '',
    puchaseReqTitle: '',

    CHECK_DUP: '-copied-',
    gGridMycartSelects: [],
    copyArrayMycartGrid: function(from) {

        this.gGridMycartSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridMycartSelects[i] = from[i];
            }
        }
    },
    gGridStockSelects: [],
    copyArrayStockGrid: function(from) {

        this.gGridStockSelects = [];
        if (from != null && from.length > 0) {
            for (var i = 0; i < from.length; i++) {
                this.gGridStockSelects[i] = from[i];
            }
        }
    },
    initTableInfo: '',

    setChildQuan: function(n) {
        var o = Ext.getCmp('childCount-' + this.link);
        if (o != null) {
            o.update('' + n);
        }
    },

    setAssyQuan: function(n) {
        var o = Ext.getCmp('assy_quan-' + this.link);
        if (o != null) {
            o.update('' + n);
        }
    },
    setProjectQuan: function(n) {
        var o = Ext.getCmp('pj_quan-' + this.link);
        if (o != null) {
            o.update('' + n);
        }
    },

    setMaking_quan: function(n) {
        var o = Ext.getCmp('making_quan-' + this.link);
        if (o != null) {
            o.update('' + n);
        }

    },

    cloudprojectStore: Ext.create('Mplm.store.cloudProjectStore', {}),
    mesProjectTreeStore: Ext.create('Mplm.store.MesProjectTreeStore', {}),
    routeGubunTypeStore: Ext.create('Mplm.store.RouteGubunTypeStore', {}),
    routeGubunTypeStore_W: Ext.create('Mplm.store.RouteGubunTypeStore_W', {}),
    commonStandardStore: Ext.create('Mplm.store.CommonStandardStore', {
        hasNull: true
    }),


    getPosStandard: function(id) {

        for (var i = 0; i < this.standard_flag_datas.length; i++) {
            if (this.standard_flag_datas[i].get('systemCode') == id) {
                return this.standard_flag_datas[i];
            }
        }
        return null;
    },

    item_code_dash: function(item_code) {
        if (item_code == null || item_code.length < 13) {
            return item_code;
        } else {
            return item_code.substring(0, 12);
        }
    },

    setReadOnlyName: function(name, readonly) {
        this.setReadOnly(Ext.getCmp(name), readonly);
    },

    setReadOnly: function(o, readonly) {
        if (o != undefined && o != null) {
            o.setReadOnly(readonly);
            if (readonly) {
                o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
            } else {
                o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
            }
        }


    },

    getPl_no: function(systemCode) {
        var prefix = systemCode;
        if (systemCode == 'S') {
            prefix = 'K';
        } else if (systemCode == 'O') {
            prefix = 'A';
        }
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
            params: {
                first: prefix,
                parent: this.selectedparent,
                parent_uid: this.selectedAssyUid

            },
            success: function(result, request) {
                var result = result.responseText;
                var str = result; // var str = '293';
                Ext.getCmp('pl_no-' + this.link).setValue(str);


            },
            failure: extjsUtil.failureMessage
        });
    },



    fPERM_DISABLING_Complished: function() {
        // 1. 권한있음.
        if (fPERM_DISABLING() == false && is_complished == false) {
            return false;
        } else { // 2.권한 없음.
            return true;
        }
    },

    //Define reset Action
    resetAction: Ext.create('Ext.Action', {
        itemId: 'resetButton',
        iconCls: 'af-remove',
        text: CMD_INIT,
        handler: function(widget, event) {
            resetPartForm();
            Ext.getCmp('addPartForm-' + this.link).getForm().reset();
            //console_logs('getForm().reset()', 'ok');
        }
    }),



    //수정등록
    modRegAction: Ext.create('Ext.Action', {
        itemId: 'modRegAction',
        iconCls: 'page_copy',
        text: '값 복사',
        disabled: true,
        handler: function(widget, event) {
            gm.me().unselectForm();
            grid.getSelectionModel().deselectAll();
        }
    }),
    cleanComboStore: function(cmpName) {
        var component = Ext.getCmp(cmpName);

        component.setValue('');
        component.setDisabled(false);
        component.getStore().removeAll();
        component.setValue(null)
        component.getStore().commitChanges();
        component.getStore().totalLength = 0;
    },

    resetParam: function() {
        this.store.getProxy().setExtraParam('unique_id', '');
        this.store.getProxy().setExtraParam('item_code', '');
        this.store.getProxy().setExtraParam('item_name', '');
        this.store.getProxy().setExtraParam('specification', '');
    },

    loadTreeAllDef: function() {
        this.loadTreeAll(this.selectedPjUid);
    },
    loadTreeAll: function(pjuid) {
        //this.pjTreeGrid.setLoading(true);

        this.mesProjectTreeStore.removeAll(true);
        this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
        this.mesProjectTreeStore.load({
            callback: function(records, operation, success) {

            }
        });
    },

    setBomData: function(id) {

        this.modRegAction.enable();
        this.resetPartForm();

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id
            },
            success: function(result, request) {

                var jsonData = Ext.decode(result.responseText);
                //console_logs('jsonData', jsonData);
                var records = jsonData.datas;
                //console_logs('records', records);
                //console_logs('records[0]', records[0]);
                setPartFormObj(records[0]);
            },
            failure: extjsUtil.failureMessage
        });

    },

    setPartFormObj: function(o) {

        //규격 검색시 standard_flag를 sp_code로 사용하기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',
            success: function(result) {
                var text = result.responseText;
                console_logs('text', text);
                var o2 = JSON.parse(text, function(key, value) {
                    return value;
                });

                //console_logs('o2', o2);
                gItemGubunType = o2['itemGubunType'];
                //console_logs('itemGubun', itemGubunType);
                //console_logs('itemGubun1', gItemGubunType);


                var standard_flag = null;
                if (gItemGubunType == 'standard_flag') {
                    standard_flag = o['standard_flag'];
                } else {
                    standard_flag = o['sp_code'];
                }

                Ext.getCmp('unique_id-' + this.link).setValue(o['unique_id']);
                Ext.getCmp('unique_uid-' + this.link).setValue(o['unique_uid']);
                Ext.getCmp('item_code-' + this.link).setValue(o['item_code']);
                Ext.getCmp('item_name-' + this.link).setValue(o['item_name']);
                Ext.getCmp('specification-' + this.link).setValue(o['specification']);

                Ext.getCmp('standard_flag-' + this.link).setValue(standard_flag);
                Ext.getCmp('standard_flag_disp-' + this.link).select(getPosStandard(standard_flag));
                Ext.getCmp('model_no-' + this.link).setValue(o['model_no']);
                Ext.getCmp('description-' + this.link).setValue(o['description']);

                Ext.getCmp('comment-' + this.link).setValue(o['comment']);
                Ext.getCmp('maker_name-' + this.link).setValue(o['maker_name']);
                Ext.getCmp('bm_quan-' + this.link).setValue('1');
                Ext.getCmp('unit_code-' + this.link).setValue(o['unit_code']);
                Ext.getCmp('sales_price-' + this.link).setValue(o['sales_price']);


                gm.me().getPl_no(standard_flag);

                var currency = o['currency'];
                if (currency == null || currency == '') {
                    currency = 'KRW';
                }
                Ext.getCmp('currency-' + this.link).setValue(currency);
                this.readOnlyPartForm(true);



            },
            failure: extjsUtil.failureMessage
        });




    },

    setPartForm: function(record) {
        //console_logs('record:', record);

        Ext.getCmp('unique_id-' + this.link).setValue(record.get('unique_id'));
        Ext.getCmp('unique_uid-' + this.link).setValue(record.get('unique_uid'));
        Ext.getCmp('item_code-' + this.link).setValue(record.get('item_code'));
        Ext.getCmp('item_name-' + this.link).setValue(record.get('item_name'));
        Ext.getCmp('specification-' + this.link).setValue(record.get('specification'));

        var standard_flag = record.get('standard_flag');
        Ext.getCmp('standard_flag-' + this.link).setValue(standard_flag);

        Ext.getCmp('standard_flag_disp-' + this.link).select(getPosStandard(standard_flag));
        Ext.getCmp('model_no-' + this.link).setValue(record.get('model_no'));
        Ext.getCmp('description-' + this.link).setValue(record.get('description'));
        Ext.getCmp('pl_no-' + this.link).setValue(record.get('pl_no'));
        Ext.getCmp('comment-' + this.link).setValue(record.get('comment'));
        Ext.getCmp('maker_name-' + this.link).setValue(record.get('maker_name'));
        Ext.getCmp('bm_quan-' + this.link).setValue(record.get('bm_quan'));
        Ext.getCmp('unit_code-' + this.link).setValue(record.get('unit_code'));
        Ext.getCmp('sales_price-' + this.link).setValue(record.get('sales_price'));


        var currency = record.get('currency');
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        Ext.getCmp('currency-' + this.link).setValue(currency);

        var ref_quan = record.get('ref_quan');
        //console_logs('ref_quan', ref_quan);
        if (ref_quan > 1) {
            this.readOnlyPartForm(true);
            Ext.getCmp('isUpdateSpec-' + this.link).setValue('false');
        } else {
            this.readOnlyPartForm(false);
            this.setReadOnlyName('item_code-' + this.link, true);
            this.setReadOnlyName('standard_flag_disp-' + this.link, true);
            Ext.getCmp('isUpdateSpec-' + this.link).setValue('true');
        }

    },

    resetPartForm: function() {

        Ext.getCmp('unique_id-' + this.link).setValue('');
        Ext.getCmp('unique_uid-' + this.link).setValue('');
        Ext.getCmp('item_code-' + this.link).setValue('');
        Ext.getCmp('item_name-' + this.link).setValue('');
        Ext.getCmp('specification-' + this.link).setValue('');
        Ext.getCmp('standard_flag-' + this.link).setValue('');
        Ext.getCmp('standard_flag_disp-' + this.link).setValue('');

        Ext.getCmp('model_no-' + this.link).setValue('');
        Ext.getCmp('description-' + this.link).setValue('');
        Ext.getCmp('pl_no-' + this.link).setValue('');
        Ext.getCmp('comment-' + this.link).setValue('');
        Ext.getCmp('maker_name-' + this.link).setValue('');
        Ext.getCmp('bm_quan-' + this.link).setValue('1');
        Ext.getCmp('unit_code-' + this.link).setValue('');
        Ext.getCmp('sales_price-' + this.link).setValue('0');

        Ext.getCmp('currency-' + this.link).setValue('KRW');
        Ext.getCmp('unit_code-' + this.link).setValue('PC');
        this.readOnlyPartForm(false);
    },

    unselectForm: function() {

        Ext.getCmp('unique_id-' + this.link).setValue('');
        Ext.getCmp('unique_uid-' + this.link).setValue('');
        Ext.getCmp('item_code-' + this.link).setValue('');

        var cur_val = Ext.getCmp('specification-' + this.link).getValue();
        var cur_standard_flag = Ext.getCmp('standard_flag-' + this.link).getValue();

        if (cur_standard_flag != 'O') {
            Ext.getCmp('specification-' + this.link).setValue(cur_val + ' ' + this.CHECK_DUP);
        }

        Ext.getCmp('currency-' + this.link).setValue('KRW');

        this.getPl_no(Ext.getCmp('standard_flag-' + this.link).getValue());
        this.readOnlyPartForm(false);
    },

    readOnlyPartForm: function(b) {

        this.setReadOnlyName('item_code-' + this.link, b);
        this.setReadOnlyName('item_name-' + this.link, b);
        this.setReadOnlyName('specification-' + this.link, b);
        this.setReadOnlyName('standard_flag-' + this.link, b);
        this.setReadOnlyName('standard_flag_disp', b);

        this.setReadOnlyName('model_no-' + this.link, b);
        this.setReadOnlyName('description-' + this.link, b);
        //this.setReadOnlyName('pl_no', b);
        this.setReadOnlyName('comment-' + this.link, b);
        this.setReadOnlyName('maker_name-' + this.link, b);

        this.setReadOnlyName('currency-' + this.link, b);
        this.setReadOnlyName('unit_code-' + this.link, b);

        Ext.getCmp('search_information-' + this.link).setValue('');

    },

    addNewAction: function() {

        var form = Ext.getCmp('addPartForm-' + this.link).getForm();
        if (form.isValid()) {
            var val = form.getValues(false);

            val['parent'] = this.selectedparent;
            val['parent_uid'] = this.selectedAssyUid;
            val['ac_uid'] = this.selectedPjUid;
            val['pj_code'] = this.selectedPjCode;
            val['coord_key2'] = this.order_com_unique;
            val['assy_name'] = this.selectedAssyName;
            val['pj_name'] = this.selectedPjName;


            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                params: val,
                method: 'POST',
                success: function() {

                    gm.me().store.load(function(records) {
                        gm.me().unselectForm();
                        gm.me().setChildQuan(records.length);
                        gm.me().resetPartForm();
                    });

                },
                failure: function(result, op) {
                    var jsonData = Ext.util.JSON.decode(result.responseText);
                    var resultMessage = jsonData.data.result;
                    Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function() {});

                }
            });

        }
    },

    Item_code_dash: function(item_code) {
        return item_code.substring(0, 5) + "-" + item_code.substring(5, 9) + "-" +
            item_code.substring(9, 12);
    },

    getColName: function(key) {
        return gMain.getColNameByField(this.fields, key);
    },

    getTextName: function(key) {
        return gMain.getColNameByField(this.fields, key);
    },


    materialClassStore: new Ext.create('Ext.data.Store', {

        fields: [{
            name: 'class_code',
            type: "string"
        }, {
            name: 'class_name',
            type: "string"
        }, {
            name: 'level',
            type: "string"
        }],
        sorters: [{
            property: 'display_order',
            direction: 'ASC'
        }],
        proxy: {
            type: 'ajax',
            url: CONTEXT_PATH + '/design/class.do?method=read',
            reader: {
                type: 'json',
                root: 'datas',
                totalProperty: 'count',
                successProperty: 'success'
            },
            extraParams: {
                level: '2',
                parent_class_code: ''
            },
            autoLoad: true
        }
    }),
    standard_flag_datas: [],
    pjTreeGrid: null,
    expandAllTree: function() {
        if (this.pjTreeGrid != null) {
            this.pjTreeGrid.expandAll();
        }
    },
    loadStore: function(child) {

        this.store.getProxy().setExtraParam('child', child);

        this.store.load(function(records) {
            console_logs('==== storeLoadCallback records', records);
            console_logs('==== storeLoadCallback store', store);

        });

    },
    arrAssyInfo: function(o1, o2, o3, o4, o5, o6, o7, o8) {
        gm.me().mtrlChilds = o1;
        gm.me().bmQuans = o2;
        gm.me().itemCodes = o3;
        gm.me().spCode = o4;
        gm.me().ids = o5;
        gm.me().levels = o6;
        gm.me().bomYNs = o7;
        gm.me().pcr_divs = o8;
    },
    //        selectedClass1 : '',
    //        selectedClass2 : '',
    //        selectedClass3 : '',
    selectedClassCode: '',
    materialStore: Ext.create('Mplm.store.MtrlSubStore'),
    productSubStore: Ext.create('Mplm.store.ProductSubStore')
        //makeClassCode : function() {
        //	this.selectedClassCode = this.selectedClass1 + this.selectedClass2 + this.selectedClass3
        //}


        ,
    addMtrlGrid: null,
    addPrdGrid: null,
    deleteConfirm: function(result) {
        if (result == 'yes') {
            var arr = gm.me().selectionedUids;
            //console_logs('deleteConfirm arr', arr);
            if (arr.length > 0) {

                var CLASS_ALIAS = gm.me().deleteClass;
                //console_logs('deleteConfirm CLASS_ALIAS', CLASS_ALIAS);
                //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                if (CLASS_ALIAS == null) {
                    CLASS_ALIAS = [];
                    for (var i = 0; i < gm.me().fields.length; i++) {
                        var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
                        if (tableName != 'map') {
                            CLASS_ALIAS.push(tableName);
                        }

                    }
                    CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
                }
                //console_logs('deleteConfirm CLASS_ALIAS 2', CLASS_ALIAS);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: arr
                    },
                    method: 'POST',
                    success: function(rec, op) {
                        //console_logs('success rec', rec);
                        //console_logs('success op', op);
                        //gm.me().redrawStore();
                        gm.me().store.load()

                    },
                    failure: function(rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

                    }
                });

            }
        }

        // }
    },
//    addPartAction : Ext.create('Ext.Action', {
//        itemId: 'addPartAction',
//        iconCls: 'af-plus-circle',
//        disabled: true,
//        text: '유닛 추가',
//        handler: function(widget, event) {
//        	gm.me().popupUnit(null);
//        },
//        failure: extjsUtil.failureMessage
//    }),
    
    
    popupUnit: function(rec) {
    	
    	console_logs('popupUnit rec', rec);
    	var isEdit = (rec==null) ? false : true;
    	
    	console_logs('popupUnit isEdit', isEdit);

    	gm.me().pcsTplStore.proxy.setExtraParam('pcs_type', 'UNIT');
    	
        var parent = gm.me().parent;
        var parent_uid = gm.me().parent_uid;
        var ac_uid = -1;
        
//        Ext.Ajax.request({
//            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
//            params: {
//                pj_code: ''
//            },
//            success: function(result, request) {
//                var result = result.responseText;
//                var str = result;
//                var num = Number(str);
//
//                if (str.length == 3) {
//                    num = num;
//                } else if (str.length == 2) {
//                    num = '' + num;
//                } else if (str.length == 1) {
//                    num = '0' + num;
//                } else {
//                    num = num % 1000;
//                }
//                var pl_no = 'A' + num + '0';
//
                var lineGap = 30;
                var bHeight = 300;
                var bWidth = 400;


                gm.me().createPartForm = Ext.create('Ext.form.Panel', {

                	xtype: 'form',
                    width: bWidth,
                    height: bHeight,
                    bodyPadding: 15,
                    layout: {
                        type: 'vbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'isEdit',
                            value: isEdit
                        }),
                        new Ext.form.Hidden({
                            name: 'parent',
                            value: gm.me().parent
                        }),
                        new Ext.form.Hidden({
                            name: 'parent_uid',
                            value: gm.me().parent_uid
                        }),
                        new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: -1
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('pj_code'),
                            name: 'pj_code',
                            value: ''
                        }),
                        new Ext.form.Hidden({
                        	id: 'assy_code',
                        	name: 'assy_code',
                        	value: ''
                        }),
                        new Ext.form.Hidden({
                        	id: 'vCompanyReserved4',
                        	name: 'vCompanyReserved4',
                        	value: ''
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('coord_key2'),
                            name: -1
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('standard_flag'),
                            name: 'standard_flag',
                            value: 'A'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('child'),
                            name: 'child',
                            value: (isEdit==true) ? rec.get('unique_id'): '-1'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('sg_code'),
                            name: 'sg_code',
                            value: 'T'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('hier_pos'),
                            name: 'hier_pos'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('assy_name'),
                            name: 'assy_name',
                            value: ''

                        }),
                        new Ext.form.Hidden({
                            id: gu.id('pj_name'),
                            name: 'pj_name',
                            value: ''
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('isUpdateSpec'),
                            name: 'isUpdateSpec',
                            value: (isEdit==true) ? 'true' : 'false'
                        }),
                        new Ext.form.Hidden({
                            name: 'unique_id',
                            value: (isEdit==true) ? rec.get('unique_uid'): '-1'
                        }),
                        {
                            id: gu.id('class_code'),
                        	name: 'class_code',
                            xtype: 'combo',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            displayField: 'pcs_code',
                            valueField: 'pcs_code',
                            triggerAction: 'all',
                            fieldLabel: '공정',
                            store: gm.me().pcsTplStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{pcs_code}">[{pcs_code}] {pcs_name}</div>';
                                }
                            },
                            listeners: {
                                load: function(store, records, successful, operation, options) {
                                    if (this.hasNull) {
                                        var blank = {
                                            systemCode: '',
                                            codeNameEn: '',
                                            codeName: ''
                                        };

                                        this.add(blank);
                                    }
                                },
                                select: function(combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    console_log('Selected record : ' + record);
                                    var pcs_name = record.get('pcs_name');
                                    
                                    gu.getCmp('item_name').setValue(pcs_name);
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            width: 100,
                            name: 'pl_no',
                            id: gu.id('pl_no'),
                            value : (isEdit==true) ? rec.get('pl_no') : '',
                            fieldLabel: '순번',
                            readOnly: false,
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            name: 'item_name',
                            id: gu.id('item_name'),
                            value : (isEdit==true) ? rec.get('item_name') : '',
                            fieldLabel: gm.me().getColName('item_name'),
                            readOnly: false,
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            minValue: 0,
                            id: gu.id('bm_quan'),
                            name: 'bm_quan',
                            value : (isEdit==true) ? rec.get('bm_quan') : '',
                            fieldLabel: gm.me().getColName('bm_quan'),
                            allowBlank: true,
                            value: '1',
                            margins: '0'
                        }
                    ]
                });
			    
                var winPart = Ext.create('ModalWindow', {
                    title: (isEdit==true) ? '유닛 수정' : '유닛 추가',
                    width: bWidth,
                    height: bHeight,
                    minWidth: 400,
                    minHeight: 300,
                    items: [gm.me().createPartForm],
                    buttons: [{
                        text: CMD_OK,
                        handler: function() {
                            var form = gm.me().createPartForm;
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                console_logs('form val', val);
                                
                                var isEdit = (val['isEdit']=='false' || val['isEdit']==false) ? false: true;
                                gm.me().registEditPartFc(isEdit, val);


                                if (winPart) {
                                    winPart.close();
                                }
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }

                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function() {
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    }]
                });
                winPart.show( this, function(){
                    if(isEdit==true) {
                    	
                    	var class_code = rec.get('class_code');
                    	console_logs('class_code', class_code);
                    	
                    	gm.me().pcsTplStore.load(function(records) {
                    		
                    		 records.forEach(function(rec,index){
                    			 
	                          	   if(rec.get('pcs_code')==class_code) {
	                          		 gu.getCmp('class_code').select(rec); 
	                          	   }          
                    	      });          	
                    	});
                    	
                    	
                    	
               	
                    }

                }  );
                
//            } // endofhandler
//        });
//
//
    	
    },
    
    registEditPartFc: function(isEdit, val) {

    	console_logs('registEditPartFc val', val);
//        var partLine = Ext.create('Rfx.model.PartLine');
//        for (var attrname in val) {
//            partLine.set(attrname, val[attrname]);
//        }

        if(isEdit) {
        	val['bmQuan'] = val['bm_quan'];
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
                params: val,
                success: function(result, request) {

                    gm.me().store.load();
                },
                failure: extjsUtil.failureMessage
            });
        } else {
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                params: val,
                success: function(result, request) {
                	gm.me().store.load();
                },
                failure: function(batch, opt) {
                    Ext.Msg.alert('결과', '저장 실패.');
                }
            });        	
        }

    }
});
