Ext.require([
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);


Ext.define('Rfx.view.designPlan.DesignBomTreeView_DABP2', {
    extend: 'Rfx.base.BaseView',
    xtype: 'design-bom-tree-view-dabp',
    initComponent: function() {
    	
    	this.stateCodeStore.load();


        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('pj_name');
        
        
        
    	var origins = new Ext.data.ArrayStore({
            fields: ['code', 'name'],
            data: [
            	['구매',	'구매'],
            	['재고',	'재고'],
            	['외주재단','외주재단'], //구매, 재단
            	['PE코팅','PE코팅'],
            	['슬리팅',	'슬리팅'],
            	['사입',	'사입'],// 재료. 고객 -> 가공 
            ]
    	});
    	//ROLL/SHEET
    	var item_types = new Ext.data.ArrayStore({
            fields: ['code', 'name'],
            data: [
            	['ROLL',	'ROLL'],
            	['SHEET',	'SHEET']
            	]
    	});
    	

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            
//            columnObj["css"] = 'edit-cell';
//            columnObj["renderer"] = function(value, meta) {
//                meta.css = 'custom-column';
//                return value;
//            };
            
//            //console_logs('columnObj', columnObj);
            switch (dataIndex) {
	            case 'item_code':
	            case 'req_info':
	            	columnObj["align"] = 'center';
	            	columnObj["textAlign"] = 'center';
	            	
	            	break;
	            case 'origin':
	            	{
	            	columnObj['align'] = 'center';
	            	columnObj['style'] = 'align:center;';
		            //columnObj['xtype'] = 'actioncolumn';
	            	//  M:제작, O:Out, S:Stock, P: 구매
	            	columnObj["editor"] = new Ext.form.ComboBox({
                        displayField: 'name',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: origins,
                        triggerAction: 'all',
                        valueField: 'code'
                    });
//	            	columnObj['items'] = [{
//		                getClass: function(v, meta, rec) {
//		                	console_logs('getClass rec', rec);
//		                	if(rec.get('origin')=='구매') {
//		                		return 'dabp-make';
//		                	} else {
//		                		return 'dabp-stock';
//		                	}
//		                	
//
//		                }
//	            		}];
	            	}
	            	break;
	            case 'item_type':
            	{
	            	
	            	//  ROLL/SHEET
	            	columnObj['align'] = 'center';
	            	columnObj['style'] = 'align:center;';
	            	columnObj['xtype'] = 'actioncolumn';
	            	columnObj["editor"] = new Ext.form.ComboBox({
	                    displayField: 'name',
	                    editable: true,
		            	align : 'center',
		            	style : 'align:center;',
	                    forceSelection: true,
	                    mode: 'local',
	                    store: item_types,
	                    triggerAction: 'all',
	                    valueField: 'code'
	                });
	            	columnObj['items'] = [{
		                getClass: function(v, meta, rec) {
		                	console_logs('getClass rec', rec);
		                	if(rec.get('item_type')=='ROLL') {
		                		return 'paper-roll';
		                	} else {
		                		return 'paper-sheet';
		                	}
		                	

		                }
            		}];
            	
            	}
            	break;
            	
	            case 'reserved1':

	            	columnObj['text'] = '재단있음';
	            	columnObj['menuDisabled'] = true;
	            	columnObj['sortable'] = false;
	            	columnObj['useYn'] = true;
	            	columnObj['xtype'] = 'actioncolumn';
	            	columnObj['align'] = 'center';
	            	columnObj['style'] = 'align:center;';
	            	columnObj['width'] = 80;
	            	columnObj['editor'] = {
	                        xtype: 'checkbox',
	                        cls: 'x-grid-checkheader-editor'
	                    };
	            	columnObj['items'] = [{
	    			                getClass: function(v, meta, rec) {
	    			                	console_logs('getClass rec', rec);
	    			                	if(rec.get('reserved1')) {
	    			                		return 'dabp-arrow-right';
	    			                	} else {
	    			                		return 'dabp-close';
	    			                	}
	    			                	
	    		
	    			                }
	    		      		}];

	            	break;
	            case 'reserved2':
	            	columnObj["editor"] = {
	            			xtype: 'textareafield',
	            			emptyText: '슬리팅은 ,로 구분',
	            			height: 25,
	            	};
//	            	columnObj["editor"] = //{ xtype: 'textarea', height: 3, tdCls: 'wrapText' };
//	            	{
//	                        xtype: 'textareafield',
//	                        allowblank: true,
//	                        maxLength: 165,
//	                        enforceMaxLength: true,
//	                        height: 50,
//	                        grow: true,
//	                        completeOnEnter: false,
//	                        enableKeyEvents: true, //Listen to keyevents
//	                        listeners: {
//	                            keydown: function(field, e) {
//	                                if (e.getKey() == e.ENTER) {
//	                                    e.stopEvent(); // Stop event propagation
//	                                }
//	                            }
//	                        }
//	                    };
	            	break;
//	            case 'bm_quan':
//	            case 'comment':
//	            	columnObj['renderer'] = function(val,a,o) {
//	                    return (val==null?'':val) + '<span style="color:' + "#5395c4" + ';"> ' + 'mm' + '</span>';
//	                };
//	                columnObj["editor"] = {};
//	            	break;
	            case 'remark':
	            	columnObj['renderer'] = function(val,a,o) {
	            		var item_type = o.get('item_type');
	            	
	            		var unit = item_type=='ROLL' ? 'M' : 'mm';
	                    return (val==null?'':val) + '<span style="color:' + "#5395c4" + ';"> ' + unit + '</span>';
	                };
	                columnObj["editor"] = {};
	            	break;
////	            case 'reserved3':
//	            case 'reserved4':
//	            	columnObj['editor'] = {
//	                    xtype: 'numberfield',
//	                    allowBlank: true,
//	                    minValue: 0,
//	                    maxValue: 15000000
//	                };
//	            	break;
	            case 'reserved_double1':
	            case 'reserved_double2':
	            	break;
            	default:
            		columnObj["editor"] = {};
            }

        });
//        
//	      this.columns.splice(6, 0, {
//		      text: '재단있음',
//		    	  menuDisabled: true,
//		      sortable: false,
//		      useYn: true,
//		      xtype: 'actioncolumn',
//		      align: 'center',
//		      style: 'align:center;',
//		      dataIndex: 'reserved1',
//		      width: 80,
//		      editor: {},
//		      items: [{
//			                getClass: function(v, meta, rec) {
//			                	console_logs('rec', rec);
//			                	switch(rec.get('reserved1')) {
//			                	case '0':
//			                	case 0:
//			                		return '';
//			                		break;
//			                	default:
//			                		return 'arrow-right';
//			                	}
//		
//			                }
//		      		}]
//		  });
//        
        console_logs('columns', this.columns);

        this.createStore('Rfx.model.PartLine', [{
                property: 'pl_no',
                direction: 'ASC'
            }],
            gm.pageSize /* pageSize */
            // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            // Orderby list key change
            // ordery create_date -> p.create로 변경.
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_uid'
            }
            // //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        
//        // create the Data Store
//        var store = Ext.create('Ext.data.Store', {
//            fields: this.fields,
//            proxy: {
//                type: 'memory'
//            },
//            data: [],
//            sorters: [{
//                property: 'unique_id',
//                direction: 'DESC'
//            }]
//        });
        
        
        
        var buttonToolbar1 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartAction,
                this.importAssyAction,
                '-',
                this.editPartAction,
                this.removePartAction,
                this.addMyCartAction,
                '-',
                this.copyPartAction,
                this.pastePartAction,
                '-',
                this.printPDFAction,
                '->',
                // this.expandAllTreeAction
//                {
//                    xtype: 'component',
//                    html: "자재복사:",
//                    style: 'align:right;'
//                },
                {
                    xtype: 'component',
                    style: 'margin-right:5px;width:18px;text-align:right',
                    id: gu.id('childCount'),
                    style: 'color:#094C80;align:right;',
                    html: '--'
                }

            ]
        });
        
        Ext.grid.RowEditor.prototype.saveBtnText = "확인";
        Ext.grid.RowEditor.prototype.cancelBtnText = "취소";
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        
//        this.createGrid([buttonToolbar1 ,this.buttonToolbar2 ], {
//            width: '60%',
//            plugins: [this.rowEditing]
//        });
//        
        var toolbars = [];
		toolbars.push(buttonToolbar1);
		toolbars.push(this.buttonToolbar2);
		
		var useColumn = [];
		for(var i=0; i <this.columns.length; i++) {
			var o = this.columns[i];
			
			var dataIndex = o['dataIndex'];
							
			if(dataIndex == 'num') {
                //o["style"] ='background-color:#EAEAEA;text-align:center';
                o["tdCls"] = 'custom-column-grey';
			}
			
			if(o['useYn'] ==true) {
				useColumn.push(o);				
			}

		}

		var viewConfig = {
	            stripeRows: true,
	            markDirty:false,
	            enableTextSelection: true
            };

		if(this.rowClassFc!=null) {
			viewConfig['getRowClass'] = this.rowClassFc;
		}

		var selModel = Ext.create("Ext.selection.CheckboxModel", {
			 mode: this.selMode == 'SINGLE'? 'SINGLE' : 'multi',
	         checkOnly: this.selCheckOnly == true ? true : false,
	         allowDeselect: this.selAllowDeselect == false ? false : true
		} );
		
		
		var o = {
	            store: this.store,
	            selModel: selModel,
	            dockedItems: toolbars,
	            columns: useColumn,
	            viewConfig: viewConfig,
	            width: '60%',
	            plugins: [this.rowEditing]
	            ,
	            listeners: {
	                'selectionchange': function(view, records) {
	                	console_logs('selectionchange records', records);
	                    //grid.down('#removeEmployee').setDisabled(!records.length);
	                }
	            }
	        };
		o['loadMask'] = true;
        this.grid = Ext.create('Rfx.base.BaseGrid',  o);

        this.setGridOnCallback(function(selections) {
        	console_logs('setGridOnCallback selections', selections);
            if (selections.length) {
                rec = selections[0];

                gm.me().assymapUidbom = rec.get('unique_uid');
                gm.me().assymapPcr_div = rec.get('request_comment');
                gm.me().assymapBmQuan = rec.get('bm_quan');
                gm.me().assymapPlNo = rec.get('pl_no');
                gm.me().assyId = rec.get('hier_pos');
                gm.me().assylevel = rec.get('reserved_integer1');
                gUtil.enable(gm.me().addPcsPlanAction);
                gUtil.enable(gm.me().editPartAction);
                gUtil.enable(gm.me().copyPartAction);
                
                gUtil.enable(gm.me().removePartAction);
                gUtil.enable(gm.me().addMyCartAction);

            } else {
                gUtil.disable(gm.me().addPcsPlanAction);
                gUtil.disable(gm.me().editPartAction);
                gUtil.disable(gm.me().copyPartAction);
                gUtil.disable(gm.me().removePartAction);
                gUtil.disable(gm.me().addMyCartAction);
            }


        });




        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()/*, this.createEast()*/]
        });
        
        this.cloudprojectStore.getProxy().setExtraParam('start_date_isnull', 'true');
        
        this.cloudprojectStore.load(function(records){
        	console_logs('records cnt', records.length);
        	if(records!=null) {
        		gu.getCmp('target-projectcode').update('<blink>대기건수: ' + records.length + '</blink>');
        	}
        });
//        this.commonStandardStore.load(function(records) {
//            for (var i = 0; i < records.length; i++) {
//                var obj = records[i];
//                // console_logs('commonStandardStore2['+i+']=', obj);
//                gm.me().standard_flag_datas.push(obj);
//            }
//        });

        //Default Value 가져오기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',
            params: {
                paramName: 'CommonProjectAssy'
            },
            success: function(result, request) {
                console_log('success defaultGet');
                var id = result.responseText;
                var arr = id.split(';');
                var ac_uid = arr[0];


//                gm.me().cloudprojectStore.load(function(records) {
//                    if (records != null && records.length > 0) {
//                    	// console_logs('gm.me().cloudprojectStore.load records', records);
//                        for (var i = 0; i < records.length; i++) {
//                            var rec = records[i];
//                           // console_logs('record ac_uid', rec.get('unique_id'));
//                            if (rec.get('unique_id') == ac_uid) {
//                                var combo = gu.getCmp('projectcombo');
//                                //console_logs('combo', combo);
//                                if(combo!=undefined) {
//                                    combo.select(rec);
//                                    gm.me().selectProjectCombo(rec);
//                                }
//
//                            }
//                        }
//
//                    }//
//
//                });
            },
            failure: function(result, request) {
                console_log('fail defaultGet');
            } /*extjsUtil.failureMessage*/
        });
         		
        this.refreshAssyCopy();
        this.refreshPartCopy();


        this.callParent(arguments);
        

    },

    refreshAssyCopy: function() {

        //복사한 Assembly 정보읽기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=readCopyBomAssembly',
            params: {},
            success: function(response, request) {
            	
            	var o = Ext.JSON.decode(response.responseText);
            	
            	var count = o['count'];
            	var assyline = o['datas'];
            	if(count>0) {
            		console_logs('result datas assyline', assyline);
            		var o = Ext.create('Mplm.model.TreeModel', assyline);
            		
            		gm.me().selected_tree_record = o;
            	}else {
            		gm.me().selected_tree_record = null;
            	}
            	gm.me().setCopiedAssyQuan(/*assyline['part_path']*/);
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax  
    },
    
    refreshPartCopy: function() {
        //복사한 파트정보 읽기
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=readCopyBomPart',
            params: {},
            success: function(response, request) {
            	
            	var o = Ext.JSON.decode(response.responseText);
            	
            	var count = o['count'];
            	var uids = o['datas'];
            	if(count>0) {
            		console_logs('result uids', uids);
            		gm.me().setCopiedPartQuan(uids.length);
            	}
            }, // endof success for ajax
            failure: extjsUtil.failureMessage
        }); // endof Ajax    

    },

    ////
    ////**************************************************** END OF initComponent ************************************
    ////
    setRelationship: function(relationship) {},
    
//    createEast: function() {
//       
//    	this.gridStockstate = Ext.create('Ext.grid.Panel', {
//            title: '재고현황',
//            store: this.myCartStore,
//            // /COOKIE//stateful: true,
//            collapsible: true,
//            multiSelect: true,
////            selModel: selModelMycart,
////            stateId: 'gridMycart' + /* (G) */ vCUR_MENU_CODE,
//            // height: getCenterPanelHeight(),
//
//            dockedItems: [{
//                    dock: 'top',
//                    xtype: 'toolbar',
//                    cls: 'my-x-toolbar-default2',
//                    items: [
//                     //   this.searchAction, '-', this.removeCartAction, '-', this.purchase_requestAction,
//                        /*'-',
//                        this.process_requestAction,'-',*/
//                        '->',
//                        {
//                            xtype: 'component',
//                            style: 'margin-right:5px;width:18px;text-align:right',
//                            style: 'color:#094C80;align:right;',
//                            html: '필요수량 = (Assy * BOM수량) - 기요청 - 반려'
//                        }
//                    ]
//                }
//
//            ],
//            columns: /* (G) */ [],
//            //plugins: [this.cellEditing1],
//            viewConfig: {
//                stripeRows: true,
//                enableTextSelection: true,
//                getRowClass: function(record) {
//                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
//                },
//                listeners: {
//                    'afterrender': function(gridMycart) {
//                        var elments = Ext.select(".x-column-header", true);
//                        elments.each(function(el) {
//
//                        }, this);
//
//                    },
//                    itemcontextmenu: function(view, rec, node, index, e) {
//                        e.stopEvent();
//                        gm.me().contextMenuCart.showAt(e.getXY());
//                        return false;
//                    }
//                }
//            }
//        });
//        
////        this.stockstateTab = Ext.widget('tabpanel', {
////            layout: 'border',
////            title: '재고현황',
////            border: false,
////            tabPosition: 'top',
////            layoutConfig: {
////                columns: 1,
////                rows: 1
////            },
////            items: []
////        });
//        this.east = Ext.widget('tabpanel', {
//            layout: 'border',
//            border: true,
//            region: 'east',
//            width: '30%',
//            tabPosition: 'top',
//            items: [this.gridStockstate]
//        });
//        return this.east;
//    },

    createCenter: function() {
        this.inpuArea = Ext.widget({
            title: 'Excel Form',
            xtype: 'form',
            // disabled: true,
            collapsible: false,
            border: false,
            layout: 'fit',
            // fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden;
            // background-color: #EAEAEA; background-image:
            // none;border-bottom: #999999 1px solid;border-left: #999999
            // 1px solid;border-right: #999999 1px solid;border-top: #999999
            // 1px solid;',
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [{
                        iconCls: 'search',
                        text: CMD_INIT,
                        handler: function() {
                            Ext.MessageBox.show({
                                title: '초기화 확인',
                                msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function(btn) {
                                    var result = MessageBox.msg('{0}', btn);
                                    if (result == 'yes') {
                                        var o = gu.getCmp('bom_content');
                                        o.setValue(bomTableInfo);
                                    }
                                }
                            });

                        }
                    }, '-',
                    {
                        iconCls: 'textfield',
                        text: '모두 지우기',
                        handler: function() {
                            Ext.MessageBox.show({
                                title: '모두 지우기',
                                msg: '모두 지우시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function(btn) {
                                    var result = MessageBox.msg('{0}', btn);
                                    if (result == 'yes') {
                                        var o = gu.getCmp('bom_content');
                                        o.setValue('');
                                    }
                                }
                            });

                        }
                    }, '-', {
                        iconCls: 'application_view_tile',
                        text: '사전검증',
                        handler: function() {
                            var bom_content = gu.getCmp('bom_content');

                            var htmlContent = bom_content.getValue();

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
                                params: {
                                    pj_code: gm.me().selectedPjCode,
                                    assy_code: gm.me().selectedAssyCode,
                                    pj_uid: gm.me().selectedPjUid,

    								parent: gm.me().selectedChild,
    								parent_uid: gm.me().selectedAssyUid,
    								
                                    pj_name: Ext.JSON.encode(gm.me().selectedPjName),
                                    assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
                                    htmlContent: htmlContent
                                },
                                success: function(result, request) {
                                    var val = result.responseText;
                                    // console_logs("val", val);
                                    // var htmlData = Ext.decode(val);
                                    // console_logs("htmlData", val);

                                    // htmlContent=func_replaceall(htmlContent,'<table
                                    // border="0"','<table border="1"');

                                    bom_content.setValue(val);

                                },
                                failure: extjsUtil.failureMessage
                            });


                        }
                    }, '-', {
                        text: '디플로이',
                        iconCls: 'save',
                        handler: function() {
                            var bom_content = gu.getCmp('bom_content');

                            var htmlContent = bom_content.getValue();

                            gu.getCmp('bom_content').setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
                                params: {
                                    pj_code: gm.me().selectedPjCode,
                                    assy_code: gm.me().selectedAssyCode,
                                    pj_uid: gm.me().selectedPjUid,
                                    parent: gm.me().selectedChild,
                                    parent_uid: gm.me().selectedAssyUid,
                                    pj_name: Ext.JSON.encode(gm.me().selectedPjName),
                                    assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
                                    htmlContent: htmlContent
                                },
                                success: function(result, request) {

                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs('jsonData', jsonData);

                                    var result = jsonData['result'];

                                    if (result == 'true' || result == true) { // 정상이면
                                        // Reload.
                                        if (gm.me().selectedAssyDepth == 1) {
                                            gm.me().editAssyAction.disable();
                                            gm.me().removeAssyAction.disable();
                                            gm.me().copyAssemblyAction.disable();
                                        } else {
                                            gm.me().editAssyAction.enable();
                                            gm.me().removeAssyAction.enable();
                                            gm.me().copyAssemblyAction.enable();
                                        }
                                        gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                                        gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                                        gm.me().store.getProxy().setExtraParam('ac_uid', gm.me().selectedPjUid);
                                        gm.me().store.load(function(records) {


                                            gm.me().selectAssy(records[0]);
                                            gm.me().setCopiedPartQuan(records.length);


                                            gm.me().setMakeTable(records);

                                        });

                                    } else {
                                        Ext.MessageBox.alert('오류', '입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
                                    }
                                    gu.getCmp('bom_content').setLoading(false);
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    }, '-',
                    '->'
                    /*
                     * , addExcelWithProject, '-',excel_sample
                     */
                ]
            }],
            items: [{
                // fieldLabel: 'board_content.',
                // x: 5,
                // y: 0 + 2*lineGap,
                id: gu.id('bom_content'),
                name: 'bom_content',
                xtype: 'htmleditor',
                width: '100%',
                height: '100%',
                border: false,
                enableColors: false,
                enableAlignments: false,
                anchor: '100%',
                listeners: {
                    initialize: function(editor) {
                        console_logs('editor', editor);
                        var styles = {
                            // backgroundColor : '#193568'
                            // ,border : '1px dashed yellow'
                            // ,color : '#fff'
                            // ,cursor : 'default'
                            // ,font : 'bold '+ 10 +'px Trebuchet MS'
                            // ,height : '10px'
                            // ,left : '10'
                            // ,overflow : 'hidden'
                            // ,position : 'absolute'
                            // ,textAlign : 'center'
                            // ,top : '10'
                            // ,verticalAlign : 'middle'
                            // ,width : '10'
                            // ,zIndex : 60
                        };


                        Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
                    }
                    /*
                     * , afterrender: function() {
                     * this.wrap.setStyle('border', '0'); }
                     */
                },
                value: this.initTableInfo


            }]
        });
        

        var myCartColumn	 = [];
        var myCartFields = [];

        for (var i = 0; i < this.columns.length; i++) {

            switch (this.columns[i]['dataIndex']) {
	            case 'pa_pl_no':
	            case 'pj_code':
	            //case 'reserved_double1':
	            case 'making_quan':
	            {
	            	var nO = gUtil.copyObj(this.columns[i]);
	            	nO["width"] = 60;
	            	myCartColumn.push(nO);
	            }
	            	break;
            	
                case 'req_info':
                case 'statusHangul':
                case 'sales_price':
                case 'static_sales_price':
                case 'goodsout_quan':
                case 'reserved_varchar1':
                case 'ref_quan':
                case 'comment':
                case 'description':
                case 'remark':
                case 'model_no':
                case 'sp_code':
                case 'route_type':
                //case 'user_name':
                    break;
                case 'reserved_double1':  
                {
	            	var columnObj = gUtil.copyObj(this.columns[i]);
	            	columnObj["width"] = 60;
                	columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    myCartColumn.push(columnObj);
                    
                }
                	break;
                case 'bm_quan':
            	{
                	var columnObj = gUtil.copyObj(this.columns[i]);
                	columnObj["editor"] = null;
                    columnObj["css"] = null;
                    columnObj["renderer"] = null
                    myCartColumn.push(columnObj);
                  break;
           	}

               default:
                    myCartColumn.push(this.columns[i]);
            }
        }


        var selModelMycart = Ext.create("Ext.selection.CheckboxModel", {} );

        var myCartModel = Ext.create('Rfx.model.MyCartLine', {
            fields: this.fields
        });

//        this.myCartStore = new Ext.data.Store({
//            pageSize: 100,
//            model: 'Rfx.model.MyCartLine'
//        });
//

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model: myCartModel,
            sorters: [{
                    property: 'create_date',
                    direction: 'desc'
                }

            ]
        });


        this.gridMycart = Ext.create('Ext.grid.Panel', {
            title: '구매요청',
            store: this.myCartStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelMycart,
            stateId: 'gridMycart' + /* (G) */ vCUR_MENU_CODE,
            // height: getCenterPanelHeight(),

            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.searchAction, '-', this.removeCartAction, '-', this.purchase_requestAction,
                        /*'-',
                        this.process_requestAction,'-',*/
                        '->',
                        {
                            xtype: 'component',
                            style: 'margin-right:5px;width:18px;text-align:right',
                            style: 'color:#094C80;align:right;',
                            html: '필요수량 = (Assy * BOM수량) - 기요청 - 반려'
                        }
                    ]
                }

            ],
            columns: /* (G) */ myCartColumn,
            plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        this.gridMycart.getSelectionModel().on({
            selectionchange: function(sm, selections) {
            	gm.me().onMygridSelection(selections);
            }
        });


        this.gridMycart.on('edit', function(editor, e) {
            // commit the changes right after editing finished

            var rec = e.record;
             console_logs('rec', rec);
            var unique_uid = rec.get('unique_uid');
            var reserved_double1 = rec.get('reserved_double1');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
                params: {
                    assymap_uid: unique_uid,
                    pr_qty: reserved_double1,
                    child: rec.get('unique_id_long')
                },
                success: function(result, request) {

                    var result = result.responseText;
                    // console_logs("", result);

                },
                failure: extjsUtil.failureMessage
            });

            rec.commit();
        });

        this.myCartStore.load(function(records) {
        	console_logs('myCartStore load records', records);
        	if(records!=null) {
            	for(var i=0; i<records.length; i++) {
            		var o = records[i];
            		//var reserved_double1 = o.get('reserved_double1');
            		//if(reserved_double1 == null || reserved_double1<1) {
            			var new_pr_quan = o.get('new_pr_quan');
            			o.set('reserved_double1', new_pr_quan);
            		//}
            	}
        	}

        	
        });
        
        
        
        /*******************************************************************************
         * Mycart Grid End
         */
        this.grid.setTitle('조달계획');
//        this.bomTab = Ext.widget('tabpanel', {
//            layout: 'border',
//            title: '조달계획',
//            border: false,
//            tabPosition: 'top',
//            layoutConfig: {
//                columns: 2,
//                rows: 1
//            },
//           
//            items: [this.grid/*, this.inpuArea*/]
//        });
//        this.mycartTab = Ext.widget('tabpanel', {
//            layout: 'border',
//            title: '구매요청',
//            border: false,
//            tabPosition: 'top',
//            layoutConfig: {
//                columns: 1,
//                rows: 1
//            },
//            items: [this.gridMycart]
//        });
        
        
        this.gridStock = Ext.create('Ext.grid.Panel', {
            title: '출고요청',
            store: this.myCartStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelMycart,
            stateId: 'gridStock' + /* (G) */ vCUR_MENU_CODE,
            // height: getCenterPanelHeight(),

            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.searchAction, '-', this.removeCartAction, '-', this.purchase_requestAction,
                        /*'-',
                        this.process_requestAction,'-',*/
                        '->',
                        {
                            xtype: 'component',
                            style: 'margin-right:5px;width:18px;text-align:right',
                            style: 'color:#094C80;align:right;',
                            html: '필요수량 = (Assy * BOM수량) - 기요청 - 반려'
                        }
                    ]
                }

            ],
            columns: /* (G) */ myCartColumn,
            plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        
//        this.stockuseTab = Ext.widget('tabpanel', {
//            layout: 'border',
//            title: '출고요청',
//            border: false,
//            tabPosition: 'top',
//            layoutConfig: {
//                columns: 1,
//                rows: 1
//            },
//            items: []
//        });
        
        this.gridCutplan = Ext.create('Ext.grid.Panel', {
            title: '재단계획',
            store: this.myCartStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelMycart,
            stateId: 'gridCutplan' + /* (G) */ vCUR_MENU_CODE,
            // height: getCenterPanelHeight(),

            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.searchAction, '-', this.removeCartAction, '-', this.purchase_requestAction,
                        /*'-',
                        this.process_requestAction,'-',*/
                        '->',
                        {
                            xtype: 'component',
                            style: 'margin-right:5px;width:18px;text-align:right',
                            style: 'color:#094C80;align:right;',
                            html: '필요수량 = (Assy * BOM수량) - 기요청 - 반려'
                        }
                    ]
                }

            ],
            columns: /* (G) */ myCartColumn,
            plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        
        this.gridOutsource = Ext.create('Ext.grid.Panel', {
            title: '외주가공',
            store: this.myCartStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selModelMycart,
            stateId: 'gridOutsource' + /* (G) */ vCUR_MENU_CODE,
            // height: getCenterPanelHeight(),

            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.searchAction, '-', this.removeCartAction, '-', this.purchase_requestAction,
                        /*'-',
                        this.process_requestAction,'-',*/
                        '->',
                        {
                            xtype: 'component',
                            style: 'margin-right:5px;width:18px;text-align:right',
                            style: 'color:#094C80;align:right;',
                            html: '필요수량 = (Assy * BOM수량) - 기요청 - 반려'
                        }
                    ]
                }

            ],
            columns: /* (G) */ myCartColumn,
            plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        
//        this.cutplanTab = Ext.widget('tabpanel', {
//            layout: 'border',
//            title: '재단계획',
//            border: false,
//            tabPosition: 'top',
//            layoutConfig: {
//                columns: 1,
//                rows: 1
//            },
//            items: []
//        });
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '60%',
            tabPosition: 'top',
            items: [this.grid, this.gridMycart, this.gridOutsource, this.gridStock,this.gridCutplan]
        });

        return this.center;

    },

    // ----------------------- END OF CENTER --------------------

    createWest: function() {

        Ext.tip.QuickTipManager.init();

//        // we want to setup a model and store instead of using dataUrl
//        Ext.define('Task', {
//            extend: 'Ext.data.TreeModel',
//            fields: [{
//                    name: 'task',
//                    type: 'string'
//                },
//                {
//                    name: 'user',
//                    type: 'string'
//                },
//                {
//                    name: 'duration',
//                    type: 'string'
//                },
//                {
//                    name: 'done',
//                    type: 'boolean'
//                }
//            ]
//        });

        this.cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});
        
        this.removeValveAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: 'Valve 삭제하기',
            disabled: true,
            handler: function(widget, event) {
                Ext.MessageBox.show({
                    title: '삭제하기',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteValveConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });
        
        var selValveNo =   Ext.create("Ext.selection.CheckboxModel", {} );
        
        this.refreshAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '리프레쉬',
			 tooltip: '리로드',
			 disabled: false,
			 handler: function() {
				 gm.me().refreshValve();
			 }

        });
        //Valve grid
        this.gridValve = Ext.create('Ext.grid.Panel', {
            title: 'Valve NO.',
            store: this.valveNoStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel: selValveNo,
            stateId: 'gridValve' + /* (G) */ vCUR_MENU_CODE,

            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                    	this.refreshAction, 
                    	this.removeValveAction, '->',
                        {
                            xtype: 'component',
                            id: gu.id('valve_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : '코드',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'parent_item_code'
                },
            	{
                    text     : '품명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'item_name'
                },
                {
                    text     : 'Valve No.',
                    width     : 80,
                    sortable : true,
                    dataIndex: 'specification'
                },
                {
                    text     : '상태',
                    width     : 80,
                    sortable : true,
                    dataIndex: 'status',
                    renderer : function(value, metaData, record, row, col, store, gridView){
                    	if ( value == 'null' || value == null ) {
                    		return '???';
	           			 } else {
	           	        		for(var i=0; gm.me().stateCodeStore.getCount();i++) {
	           	        			var rec = gm.me().stateCodeStore.getAt(i);
	           	        			//console_logs('---------------> rec', rec);
	           	        			if(rec==null) {
	           	        				return value;
	           	        			}else {
	           	        				var systemCode = rec.get('systemCode');
	           	            			if(systemCode==value) {
	           	            				return rec.get('codeName');
	           	            			}        				
	           	        			}
	           	        		}
	           	        		return value;
	           			 }
                    }
                },
            ],
            viewConfig: {
	            stripeRows: true,
	            markDirty:false,
	            enableTextSelection: true,
	            getRowClass: function(record, index) {
	            	
	            	// console_logs('record', record);
	                var c = record.get('status');
	                console_logs('status', c);
	                
	                switch(c) {
                    case 'BM':
                    	return 'white-row';
                    case 'CR':
                    	return 'yellow-row';
                    case 'I':
                    	return 'magenta-row';
                    case 'N':
                    	return 'cyan-row';
                    case 'P':
                    	return 'orange-row';
                    case 'R':
                    	return 'grey-row';
                    case 'S':
                    case 'DE':
                    	return 'red-row';
                    case 'W':
                    	return 'blue-row';
                    case 'Y':
                    	return 'green-row';
                    default:
                    	return 'black-row';
	                }

	            }
            }
        });
        this.gridValve.getSelectionModel().on({
            selectionchange: function(sm, selections) {
            	gm.me().ongridValveSelection(selections);
            }
        });
        
        var makers = new Ext.data.ArrayStore({
            fields: ['maker_code', 'maker_name'],
            data: [
            	['SE',	'(주)세하'],
            	['HC',	'(주)한창제지'],
            	['GO',	'골드지(동남산업)'],
            	['SD',	'(주)에스디페이퍼'],
            	['PL',	'(주) 피엘페이퍼'],
            	['SP',	'(주)신풍제지'],
            	['PH',	'(주)피치밸리'],
            	['CL',	'(주)깨끗한나라'],
            	['DS',	'(주)두성종이-대구지점'],
            	['MD',	'(주)모든페이퍼'],
            	['OS',	'오성지업사'],
            	['SS',	'삼성지업사'],
            	['NG',	'(주)남경지류'],
            	['SW',	'(주)삼원특수지-대구지점'],
            	['KP',	'KPNB'],
            	['JF',	'(주) 제프(Jeff Corp)'],
            	['DI',	'덕인PNP'],
            	['TG',	'태광가공지산업(주)'],
            	['PP',	'(주)신안피피'],
            	['TR',	'(주)타라유통'],
            	['WW',	'우인유통'],
            	['DK',	'덕인PNP'],
            	['DO',	'(주)대웅페이퍼'],
            	['MS',	'(주)엠슨']
            ]
        });
        // Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a
        // tree.TreePanel
        this.assyGrid = Ext.create('Ext.tree.Panel', {
            //title: '수주정보',
            collapsible: true,
            useArrows: true,
            rootVisible: false,
//            hideHeaders: true,
           preventHeader: true,
            store: this.cloudProjectTreeStore,
            multiSelect: true,
            region: 'center',
            height: '60%',
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1}),
            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.addAssyAction,
                        this.editAssyAction,
                        this.removeAssyAction,
                        this.copyAssemblyAction,
                        this.pasteAssyAction,
//                        '->',
//                        this.sendValveAction,
//                        {
//                            xtype: 'component',
//                            html: "복사:",
//                            style: 'color:#094C80;align:right;'
//                        },
                        {
                        	id: gu.id('assy_quan'),
                            xtype: 'component',
                            html: "",
                            style: 'color:#094C80;align:right;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
               	 cls: 'my-x-toolbar-default1',
    	         style:'color:white;',
                    items: [
                    	 {
                    		id: gu.id('target-projectcode'),
     	                    xtype: 'component',
     	                    style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
     	                    html: "----------",
     	                },
                        {
                            id: gu.id('projectcombo'),
                            xtype: 'combo',
                            //cls: 'my-x-toolbar-default1',
                            // fieldStyle: 'background-color: #FBF8E6;
                            // background-image: none;',
                            mode: 'local',
                            editable: false,
                            flex: 1,
                            queryMode: 'remote',
                            emptyText: '프로젝트',
                            displayField: 'pj_name',
                            valueField: 'unique_id',
                            store: this.cloudprojectStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{pj_name}"><small><font color=blue>{pj_code}</font> {pj_name}</small></div>';
                                }
                            },
                            triggerAction: 'all',
                            listeners: {
                                select: function(combo, record) {
                                    gm.me().selectProjectCombo(record);

                                }
                            }
                        }
                    ]
                },{
                    dock: 'bottom',
                    xtype: 'toolbar',
                    items: [ {
                    	id: gu.id('projectinfo'),
                    	xtype:          'component',
                        fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F5F5F5; background-image: none; border: none;',
                        style: 'border: none;',
                        hideBorders: true,
                        height: 110,
                        width: '100%',
                        border: false,
                        readOnly: true
                    	}
                    ]
                }
            ], // dockedItems of End
            columns: [{
                        xtype: 'treecolumn', // this is so we know which column
                        // will show the tree
                        text: '항목',
                        width: 180,
                        sortable: true,
                        dataIndex: 'text',
                        locked: true
                    }, {
                        xtype: 'checkcolumn',
                        text: gm.getMC('sro1_completeAction', '완료'),
                        dataIndex: 'is_closed',
                        width: 50,
                        style: 'text-align:center',
                        align: 'center',
                        listeners: {
                            checkchange: {
                                fn: function( obj, rowIndex, checked, eOpts){
                                    //console_logs('obj', obj);
                                    //console_logs('rowIndex', rowIndex);
                                    //console_logs('checked', checked);
                                    //console_logs('eOpts', eOpts);
									
                                    gm.me().checkTreeNode(obj, rowIndex, checked);
                                    
                                	
//                                  console_logs('obj', obj);
//                                  //console_logs('rowIndex', rowIndex);
//                                  console_logs('checked', checked);
//                                  //console_logs('eOpts', eOpts);
//                              	
//                              	var o = obj.up('grid').getStore().getAt(rowIndex);
//                              	 console_logs('o', o);
//                              	var msg = '선택한 [' + o.get('assy_name') + '] 및 하위 Assembly의 상태를 ' + (checked?'<완료>':'<진행중>') 
//                              				+ ' 상태로 변경하시겠습니까?';
//                              	
//                                  Ext.MessageBox.show({
//                                      title: '완료 확인',
//                                      msg: msg,
//                                      buttons: Ext.MessageBox.YESNO,
//                                      icon: Ext.MessageBox.QUESTION,
//                                      fn: function(btn) {
//                                      	console_logs('btn', btn);
//                                      	//var result = MessageBox.msg('{0}', btn);
//                                          if (btn == 'yes') {
//                                          	gm.me().checkTreeNode(obj, rowIndex, checked);
//                                          } else {
//                                          	var e1 = !checked;
//                                          	console_logs('e1', e1);
//                                          	o.set('checked', e1);
//                                          	obj.up('grid').getStore().sync();
//                                          }
//                                      }
//                                  });

                                }
                            }
                       },
                        stopSelection: true
                    }, {
                        text: '상태',
                        dataIndex: 'status',
                        width: 0,
                        style: 'text-align:center',
                        align: 'center',
                        stopSelection: false
                    }, {
                        text: '규격',
                        flex: 1,
                        dataIndex: 'specification',
                        sortable: true
                    }, {
                        // xtype: 'checkcolumn',
                        text: '수량',
                        dataIndex: 'bm_quan',
                        width: 60,
                        style: 'text-align:right',
                        align: 'right',
                        stopSelection: false
                    },
//                    {
//                        menuDisabled: true,
//                        sortable: false,
//                        text: 'V',
//                        style: 'text-align:right',
//                        align: 'right',
//                        xtype: 'actioncolumn',
//                        width: 40,
//                        items: [{
//                            iconCls: 'sell-col'
//                        }, {
//                            getClass: function(v, meta, rec) {
//                            	var status = rec.get('status');
//                            	var bm_quan = rec.get('bm_quan');
//                            	var pclass_code = rec.get('pclass_code');
//                                if (pclass_code == 'ACT') {
//                                	if(status=='BM' || bm_quan==0 ) {
//                                		return 'font-awesome_4-7-0_gears_16_0_5395c4_none';
//                                	} else {
//                                		return 'ionicons_2-0-1_android-done-all_16_0_c0392b_none';
//                                	}
//                                    
//                                } else {
//                                    return '';
//                                }
//                            },
//                            getTip: function(v, meta, rec) {
//                                if (rec.get('reserved_varchar1') != '') {
//                                    return gu.Comma2Div(rec.get('reserved_varchar1'));
//                                } else {
//                                    return '';
//                                }
//                            },
//                            handler: function(grid, rowIndex, colIndex) {
//                                gm.me().selectedVv = grid.getStore().getAt(rowIndex);
//                                var rec = gm.me().selectedVv;
//                                var reserved_varchar1 = rec.get('reserved_varchar1');
//                                var status = rec.get('status');
//                                var bm_quan = rec.get('bm_quan');
//                                var is_closed = true;
//                                
//                            	try {
//                            		is_closed = rec.get('is_closed');
//                            	} catch (e) {}
//                           
//                                if(is_closed == true) {
//                                    Ext.MessageBox.alert('알림', '이미 완료처리 되었습니다.');
//                                    return;
//                                }
//                                
//                                
//                                if(gm.me().checkClosed() == true) {
//                                    return;
//                                } else { //BM
//                                	var curArr = gu.strComma2Array(reserved_varchar1);
//                                    
//                                    var assy_name = rec.get('assy_name');
//                                    var msg = gm.me().getVvPromptMsg(curArr, assy_name, [], [true]);
//                                    
//                                    var messageBox = Ext.MessageBox.show({
//                                        title: 'VALVE NO.',
//                                        msg:  msg,	
//                                        width:400,
//                                        height:400,
//                                        buttons: Ext.MessageBox.OK,
//                                        multiline: true,
//                                        defaultTextHeight: 200,
//                                        scope: this,
//                                        value: gu.Comma2Area(rec.get('reserved_varchar1')),
//                                       
//                                        initComponent: function() {
//                                        	console_logs('initComponent', this.value);
//                                        },
//                                        buttons: Ext.MessageBox.OKCANCEL,  
//                                        fn: function(btn, text, c) {
//
//                                        	var rec = gm.me().selectedVv;
//                                            var reserved_varchar1 = rec.get('reserved_varchar1');
//                                            var curArr = gu.strComma2Array(reserved_varchar1);
//                                            var allArr = gm.me().valve_nos;
//                                            
//                                            var assy_name = rec.get('assy_name');
//                                            var msg = gm.me().getVvPromptMsg(curArr, assy_name, [], [true]);
//                                        	
//                                        	if(btn == 'ok') {
//                                        		
//                                        		gu.arrRemoveArr(allArr, curArr);
//                                        		
//                                            	console_logs('text', text);
//                                        		var nArr = text.split('\n');
//                                        		
//                                        		if(text!=null && text!='' && nArr.length>0) {
//                                        			var reserved_varchar1 = '';
//                                            		for(var i=0; i<nArr.length; i++) {
//                                            			
//                                            			var s = nArr[i];
//                                            			if(s!=null && s!='') {
//                                            				gm.me().addValve_no(s);
//                                            				if(reserved_varchar1=='') {
//                                            					reserved_varchar1 = s;
//                                            				} else {
//                                            					reserved_varchar1 = reserved_varchar1 + ',' + s;
//                                            				}
//                                            				
//                                            				gm.me().addValve_no(s);
//                                            			}//endof if
//                                            			
//                                            		}//endoffor
//                                            		
//                                            		var unique_uid =  gm.me().selectedVv.get('unique_uid');
//                                            		var unique_id =  gm.me().selectedVv.get('child');
//                                            		var ac_uid =  gm.me().selectedVv.get('ac_uid');
//                                            		var assy_name =  gm.me().selectedVv.get('assy_name');
//                                            		var pj_code =  gm.me().selectedVv.get('pj_code');
//                                            		
//                                                	Ext.Ajax.request({
//                                             			url: CONTEXT_PATH + '/design/bom.do?method=updateValveInfo',
//                                             			params:{
//                                             				reserved_varchar1 : reserved_varchar1,
//                                             				unique_id : unique_id,
//                                             				ac_uid : ac_uid,
//                                             				assy_name : assy_name,
//                                             				pj_code : pj_code
//                                             			},
//                                             			success : function(result, request) {   
//                                             				var grid = gm.me().grid;
//                                             				
//                                                    		//gm.editAjax('assymap', 'reserved_varchar1', reserved_varchar1, 'unique_id', unique_uid,  {bm_quan: nArr.length});
//                                                    		
//                                                    		gm.me().selectedVv.set('reserved_varchar1', reserved_varchar1);
//                                                    		gm.me().selectedVv.set('bm_quan', nArr.length);
//                                                    		
//                                                    		grid.getStore().sync();
//                                                    		
//                                                    		console_logs('결과', '반영하였습니다.');
//                                             			}
//                                               	    });
//                                                	   
//                                            		
//                                            		
//                                        		}
//                                        		
//                                        	}
//
//                                            //gm.me().showToast(Ext.String.format('You clicked the {0} button and entered the text "{1}".', btn, text));
//                                        }//,
//                                        //animateTarget: btn
//                                    });
//                                    var v = messageBox.textArea.value.replace(/ /g, "").toUpperCase();
//                                    
//                                   // messageBox.msgButtons.ok.setDisabled(v==null || v=='');
//                                    
//                                    messageBox.textArea.allowBlank = false;
//                                    messageBox.textArea.spellcheck = false;
//                                    messageBox.textArea.on('change', function (e, text, o) {
////                                    	console_logs('messageBox e', e);
////                                    	console_logs('messageBox Msg', messageBox.msg);
////                                    	console_logs('text', text);
////                                    	console_logs('o', o);
//                                    	
//                                    	var rec = gm.me().selectedVv;
//                                        var reserved_varchar1 = rec.get('reserved_varchar1');
//                                        var curArr = gu.strComma2Array(reserved_varchar1);
//                                        var allArr = gm.me().valve_nos;
//                                        
//                                        var assy_name = rec.get('assy_name');
//                                        var msg = gm.me().getVvPromptMsg(curArr, assy_name, [], [true]);
//                                    	
//                                    	
//                                    	
//                                    	
//                                    	var clean = text.replace(/ /g, "").replace(/,/g, "").toUpperCase();
//
//                                    	if(clean!='') {
//                                        	//console_logs('clean', clean);
//                                    		var arr = clean.split('\n');
//                                    		arr = gu.sortedSet(arr);
//                                    		//console_logs('enter arr', arr);
//                                    		
//                                    		var canSave = [true];
//                                    		
//                                			var msg = gm.me().getVvPromptMsg(curArr, assy_name, arr, canSave);
//                                			
//                                			//console_logs('canSave', canSave[0]);
//                                			if(canSave[0]==false) {
//                                				messageBox.msgButtons.ok.setDisabled(true);
//                                			} else {
//                                				messageBox.msgButtons.ok.setDisabled(false);
//                                			}
//
//                                			messageBox.msg.setHtml(msg);
//                                			
//                                        	if(text.length>1 && text.substr(text.length-1,1) == '\n') {
//                                        		//console_logs('enter', true);
//                                        		var s = '';
//                                        		for(var i=0; i<arr.length; i++) {
//                                        			if(s=='') {
//                                        				s = arr[i];
//                                        			} else {
//                                        				s = s + '\n' + arr[i];
//                                        			}
//                                        		}
//                                    			e.setValue(s+'\n');
//
//                                    			
//                                        	} else {
//                                        		//console_logs('enter', false);
//                                        		e.setValue(clean);
//                                        	}
//                                    	} else {
//                                    		//e.setValue('');
//                                    	}
//                                    	
//                                    	
//                                    });
//
//                                }
//                                
//                                
//                                
//                                
//                            }
//                        }]
//                    }, 
                    {
                        text: '제조원',
                        width: 180,
                        dataIndex: 'maker_name',
                        editor: new Ext.form.ComboBox({
                            displayField: 'maker_name',
                            valueField: 'maker_name',
                            editable: false,
                            forceSelection: true,
                            mode: 'local',
                            store: makers,
                            triggerAction: 'all',
							listConfig : {
								getInnerTpl : function() {
									return '<div data-qtip="{maker_code}"><small>{maker_name}</small></div>';
								}
							}
                        }),
                        css: 'edit-cell',
                    	renderer: function(value, meta) {
	                      meta.css = 'custom-column';
	                      return value;
	                  }
                    }
//                    , {
//                        text: '제조원',
//                        width: 60,
//                        dataIndex: 'maker_code',
//                        sortable: true,
//                        editor: {},
//                    	css: 'edit-cell',
//                    	renderer: function(value, meta) {
//		                      meta.css = 'custom-column';
//		                      return value;
//		                  }
//                    
//                    }
//                    , {
//                        text: '요청사항',
//                        flex: 1,
//                        // flex: 1,
//                        // cls:'rfx-grid-header',
//                        dataIndex: 'part_folder',
//                        // resizable: true,
//                        // autoSizeColumn : true,
//                        style: 'text-align:left',
//                        align: 'left'
//                    }
//                    , {
//                        text: '식별기호',
//                        width: 150,
//                        dataIndex: 'part_path',
//                        sortable: true
//                    }
                    /*
                     * , { text: gm.getMC('CMD_MODIFY', '수정'), width: 60, menuDisabled: true, xtype:
                     * 'actioncolumn', tooltip: 'Edit task', align: 'center',
                     * icon: '../../../resources2/images/edit_task.png',
                     * handler: function(grid, rowIndex, colIndex, actionItem,
                     * event, record, row) { Ext.Msg.alert('Editing' +
                     * (record.get('done') ? ' completed task' : '') ,
                     * record.get('task')); }, // Only leaf level tasks may be
                     * edited isDisabled: function(view, rowIdx, colIdx, item,
                     * record) { return !record.data.leaf; } }
                     */

                    /*
                     * ,{ //we must use the templateheader component so we can use a
                     * custom tpl xtype: 'templatecolumn', text: '설계시간', width: 80,
                     * sortable: true, dataIndex: 'duration', align: 'center', //add
                     * in the custom tpl for the rows tpl:
                     * Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
                     * formatHours: function(v) { if (v < 1) { return Math.round(v *
                     * 60) + ' mins'; } else if (Math.floor(v) !== v) { var min = v -
                     * Math.floor(v); return Math.floor(v) + 'h ' + Math.round(min *
                     * 60) + 'm'; } else { return v + ' hour' + (v === 1 ? '' :
                     * 's'); } } }) }
                     */
                    // text: '프로젝트 코드',
                    // cls:'rfx-grid-header',
                    // dataIndex: 'pj_code',
                    // resizable: true,
                    // autoSizeColumn : true,
                    // style: 'text-align:center',
                    // align:'center'
                    // },{
            ]
        	,listeners: {
                'afterrender': function(grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function(el) {

                    }, this);

                },
                activate: function(tab){
                    setTimeout(function() {
                    	// gu.getCmp('main-panel-center').setActiveTab(0);
                        // alert(tab.title + ' was activated.');
                    }, 1);
                },
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                }
            }
        });


//        this.cloudProjectTreeStore.on('load',function (store, records, successful, eOpts ){
//        	
//        	if(records!=null) {
//            	for(var i=0; i<records.length; i++) {
//            		var rec = records[i];
//            		
//            		var pclass_code = rec.get('pclass_code');
//            		//console_logs('pclass_code', pclass_code);
//            		if(pclass_code=='ACT') {
//            			//console_logs('cloudProjectTreeStore.on records records', records);
//            			//console_logs('tree act rec', rec);
//            			var reserved_varchar1 = rec.get('reserved_varchar1');
//            			var status = rec.get('status');
//            			//console_logs('reserved_varchar1', reserved_varchar1);
//                        if ( reserved_varchar1!=null && reserved_varchar1 != '') {
//                        	
//                        	var arr = gu.strComma2Array(reserved_varchar1);
//                        	//console_logs('reserved_varchar1', reserved_varchar1);
//                    		for(var j=0; j<arr.length; j++) {
//                        		gm.me().addValve_no(arr[j]);
//                    		}
//
//                        }
//            		}
//            	}        		
//        	}
//            //Block of codes
//            //var access=records[0].data.access;
//            //Block of codes
//       });

        this.assyGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
            	gm.me().onAssemblyGridSelection(selections);
            }
        });
        
        
        this.gridStockWonji = Ext.create('Ext.grid.Panel', {
            store: this.myCartStore,
		    title: '원지',
            border: true,
            collapsible: true,
            multiSelect: true,
            columns: /* (G) */ [],
            //plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        this.gridStockWondan = Ext.create('Ext.grid.Panel', {
            store: this.myCartStore,
		    title: '원단',
            border: true,
            collapsible: true,
            multiSelect: true,
            columns: /* (G) */ [],
            //plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        this.gridStockSubpart = Ext.create('Ext.grid.Panel', {
            store: this.myCartStore,
		    title: '부자재',
            border: true,
            collapsible: true,
            multiSelect: true,
            columns: /* (G) */ [],
            //plugins: [this.cellEditing1],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record) {
                    return record.get('creator_uid') == vCUR_USER_UID ? 'my-row' : '';
                },
                listeners: {
                    'afterrender': function(gridMycart) {
                        var elments = Ext.select(".x-column-header", true);
                        elments.each(function(el) {

                        }, this);

                    },
                    itemcontextmenu: function(view, rec, node, index, e) {
                        e.stopEvent();
                        gm.me().contextMenuCart.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
		this.stockstateTab = Ext.widget('tabpanel', {
			collapsible: true,
			title: '재고 현황',
		    layout: 'border',
            region: 'south',
            height: '40%',
            style: {
                border: '1px solid #133160'//,
                //borderStyle: 'dotted'
             },
		    tabPosition: 'top',
		    layoutConfig: {
		        columns: 1,
		        rows: 1
		    },
		    items: [this.gridStockWonji, this.gridStockWondan, this.gridStockSubpart]
		});
		
		var panel = Ext.create('Ext.panel.Panel', {
			id: "bomTab",
		    layout:'border',
		    title: '수주정보',
		    border: false,
		    tabPosition: 'bottom',
		    layoutConfig: {columns: 2, rows:1},
		    items: [this.assyGrid, this.stockstateTab]
		});
        

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            width: '40%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },

            items: [panel]
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
    gridMycart: null,
    gridStock: null,
    store: null,
    myCartStore: null,
    stockStore: null,
    gItemGubunType: null,
    itemGubunType: null,
    inpuArea: null,

    sales_price: '',
    quan: '',
    lineGap: 35,

    selectedPjUid: '',
    selectedAssyUid: '',
    selectedChild: '',

    selectionLength: 0,

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
    INIT_TABLE_HEAD: function() {
        var a =
            '<style>' +
            ' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }' +
            ' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
            ' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
            ' </style>' +
            '<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
            '<colgroup>' +
            '<col width="80px">' +
            '<col width="90px">' +
            '<col width="*">' +

            '<col width="90px">' +
            '<col width="90px">' +
            '<col width="50px">' +
            '<col width="90px">' +

            '<col width="60px">' +
            '<col width="60px">' +
            '<col width="40px">' +

            '<col width="110px">' +
            '<col width="90px">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr  height="30" >' +
            '	  <td class="xl66" align=center>프로젝트코드</td>' +
            '	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
            '	  <td class="xl66" align=center>프로젝트이름</td>' +
            '	  <td class="xl67" align=center>' + this.selectedPjName + '</td>' +
            '<td colspan="8" rowspan="2">' +
            '</td>' +
            '	 </tr>' +
            '<tr  height="30" >' +
            '	  <td class="xl66" align=center>Assy코드</td>' +
            '	  <td class="xl67" align=center>' + this.selectedAssyCode + '</td>' +
            '	  <td class="xl66" align=center>Assy이름</td>' +
            '	  <td class="xl67" align=center>' + this.selectedAssyName + '</td>' +
            '	 </tr>' +
            '<tr  height="25" >' +
            '	  <td class="xl66" align=center>품번</td>' +
            '	  <td class="xl66" align=center>품명</td>' +
            '	  <td class="xl66" align=center>규격</td>' +

            '	  <td class="xl66" align=center>재질</td>' +
            '	  <td class="xl66" align=center>후처리</td>' +
            '	  <td class="xl66" align=center>열처리</td>' +
            '	  <td class="xl66" align=center>제조원</td>' +

            '	  <td class="xl66" align=center>예상가격</td>' +
            '	  <td class="xl66" align=center>수량</td>' +
            '	  <td class="xl66" align=center>구분</td>' +
            '	  <td class="xl66" align=center>품목코드</td>' +
            '	  <td class="xl66" align=center>UID</td>' +
            '	 </tr>';

        return a;
    },
    INIT_TABLE_TAIL: '</tbody></table><br><br>' +
        '<div style="color:blue;font-size:11px;position:relative; "><ul>' +
        '<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>' +
        '<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>' +
        '<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>' +
        '</ul></div>',
    makeInitTable: function() {
        var initTableLine =
            '	 <tr height="25" style="height:12.75pt">' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl65">&nbsp;</td>' +
            '	  <td class="xl67">&nbsp;</td>' +
            '	  <td class="xl67">&nbsp;</td>' +
            '	 </tr>';

        this.initTableInfo = INIT_TABLE_HEAD();
        this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
    },
    bomTableInfo: '',

    createLine: function(val, align, background, style) {
        return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>' + val + '</td>';
    },

    setCopiedPartQuan: function(n) {
    	console_logs('setCopiedPartQuan', n);
        var o = gu.getCmp('childCount');
        if (o != null) {
            o.update( n + '건 복사됨.');
        }
        
        this.copiedPartCnt = n;
        
        if(this.copiedPartCnt>0) {
        	this.pastePartAction.enable();
        } else {
        	this.pastePartAction.disable();
        }
        
    },

    setCopiedAssyQuan: function() {
        var o = gu.getCmp('assy_quan');
        if (o != null) {
        	
    		var assyline = this.selected_tree_record;
    		if(assyline !=null ) {
         		console_logs('this.selected_tree_record', this.selected_tree_record);
         		if(assyline.get('parentId') == 'root') {
         			o.update( assyline.get('pj_code') + ' 프로젝트' + ' 복사');
         		} else {
         			o.update( assyline.get('pj_code') + '/' + assyline.get('part_path') + ' 복사');
         		}
         		
                		
    		}

        } else {
        	o.update( '');
        }
    },
    setProjectQuan: function(n) {
        var o = gu.getCmp('pj_quan');
        if (o != null) {
            o.update('' + n);
        }
    },

    setMaking_quan: function(n) {
        var o = gu.getCmp('making_quan');
        if (o != null) {
            o.update('' + n);
        }

    },

    createHtml: function(route_type, rqstType, catmapObj) {
        var htmlItems =
            '<style>' +
            ' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }' +
            ' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
            ' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
            ' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
            '<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
            '<colgroup>' +
            '<col width="10%">' +
            '<col width="10%">' +
            '<col width="10%">' +
            '<col width="20%">' +
            '<col width="40%">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr  height="25" >' +
            '	  <td class="xl67" align=center>품목코드</td>' +
            '	  <td class="xl67" align=center>필요수량</td>' +
            '	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
            '	  <td class="xl67" align=center>품명</td>' +
            '	  <td class="xl67" align=center>규격</td>' +
            '	 </tr>';
        for (var i = 0; i < catmapObj.length; i++) {
            var rec = catmapObj[i]; // grid.getSelectionModel().getSelection()[i];
            var item_code = rec.get('item_code');
            var quan = route_type == 'P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
            var new_pr_quan = rec.get('new_pr_quan');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');

            htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
            htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65'); // 품번
            htmlItems = htmlItems + '</tr>';

        }
        htmlItems = htmlItems + '</tbody></table></div>';
        return htmlItems;
    },

    setMakeTable: function(records) {
        this.bomTableInfo = this.INIT_TABLE_HEAD();
        if (records == null || records.length == 0) {
            // bomTableInfo = initTableInfo;
        } else {

            for (var i = 0; i < records.length; i++) {
                var rec = records[i];
                var unique_id = rec.get('unique_id');
                var unique_uid = rec.get('unique_uid');
                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                var specification = rec.get('specification');
                var standard_flag = rec.get('standard_flag');
                var sp_code = rec.get('sp_code'); // 표시는 고객사 선책톧로

                var model_no = rec.get('model_no');
                var description = rec.get('description');
                var pl_no = rec.get('pl_no');
                var comment = rec.get('comment');
                var maker_name = rec.get('maker_name');
                var bm_quan = rec.get('bm_quan');
                var unit_code = rec.get('unit_code');
                var sales_price = rec.get('sales_price');

                this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
                this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65'); // 품번
                this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65'); // 품명
                this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65'); // 규격
                this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65'); // 재질/모델
                this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65'); // 후처리
                this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65'); // 열처리
                this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65'); // 제조원
                this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65'); // 예상가(숫자)
                this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65'); // 수량(숫자)
                this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65'); // 구분기호
                this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67'); // 품목코드
                this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67'); // UID
                this.bomTableInfo = this.bomTableInfo + '	 </tr>';
            }
        }
        this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
        var o = gu.getCmp('bom_content');
        o.setValue(this.bomTableInfo);
    },

    insertStockStoreRecord: function(records) {},
    
    cloudprojectStore: Ext.create('Mplm.store.cloudProjectStore', {}),
    /*
    cloudprojectStore: Ext.create('Ext.data.ArrayStore', {
    	data : [
        	[1,1, '[티바 한마리합지 (이수민)](땡초갈릭+아삭킹새우)', '170600429', 'WE-CHEMICAL(위켐)'],
        	[2,2, '[마데카 습윤 밴드 인박스](스팟) 제조번호-17MH10002', '170600430', '엄마블루베리'],
        	[3,3, '[봉수아피자 12인치]305-8', '170600431', '의성흑마늘남사장'],
        	[4,4, '[미쳐버린 파닭 <브라질산>]대', '170600432', '아이디파일']
        ],
    	fields: [
            'id',
            'unique_id',
            'pj_name',
            'pj_code',
            'wa_name'

        ]
    }),
    */
    mesProjectTreeStore: null,//Ext.create('Mplm.store.MesProjectTreeStore', {}),
    routeGubunTypeStore: null,//Ext.create('Mplm.store.RouteGubunTypeStore', {}),
    routeGubunTypeStore_W: null,//Ext.create('Mplm.store.RouteGubunTypeStore_W', {}),
    commonStandardStore: null,//Ext.create('Mplm.store.CommonStandardStore', {
//        hasNull: true
//    }
//),



    renderCarthistoryPlno: function(value, p, record) {
        var unique_uid = record.get('unique_uid');

        return Ext.String.format(
            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
            unique_uid, value
        );
    },


    getPosStandard: function(id) {

        for (var i = 0; i < this.standard_flag_datas.length; i++) {
            if (this.standard_flag_datas[i].get('systemCode') == id) {
                return this.standard_flag_datas[i];
            }
        }
        return null;
    },

    selectAssy: function(record) {
    	console_logs('selectAssy record', record);
        this.addAssyAction.enable();
        this.addPartAction.enable();
        this.importAssyAction.enable();
    	if(this.copiedPartCnt>0) {
            this.pastePartAction.enable();
    	}
        this.pasteAssyAction.enable();
        this.inpuArea.enable();
        //gu.getCmp('addPartForm')).enable();
        gu.getCmp('target-routeTitlename').update(this.routeTitlename);
        var myLink = gu.link;
        //console_logs('myLink>>>>>>>>>>>>>', myLink);
        this.copyAssemblyAction.enable();
        if (this.depth == 1) {
            this.editAssyAction.disable();
            this.removeAssyAction.disable();            
        } else {
            this.editAssyAction.enable();
            this.removeAssyAction.enable();
            
        }

        if(	record!=null && 
        	record.get('pclass_code')=='ACT' /* &&
        	record.get('status')=='BM'*/
        ) {
        	this.sendValveAction.enable();
        }else {
        	this.sendValveAction.disable();
        }

    },

    unselectAssy: function(record) {
        this.addAssyAction.disable();
        this.addPartAction.disable();
        this.importAssyAction.disable();
        this.pastePartAction.disable();
        this.pasteAssyAction.disable();
        this.editAssyAction.disable();
        this.removeAssyAction.disable();
        this.copyAssemblyAction.disable();
        this.inpuArea.disable();
        gu.getCmp('bom_content').setValue(this.initTableInfo);
        
        this.sendValveAction.disable();

    },


    item_code_dash: function(item_code) {
        if (item_code == null || item_code.length < 13) {
            return item_code;
        } else {
            return item_code.substring(0, 12);
        }
    },

    setReadOnlyName: function(name, readonly) {
        this.setReadOnly(gu.getCmp(name), readonly);
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
//        if(systemCode == 'O') {
//        	systemCode = 0;
//        }
//        
//        if (systemCode == 'S') {
//            prefix = 'K';
//        } else if (systemCode == 'O') {
//            prefix = 'A';
//        }
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
            params: {
                first: prefix,
                parent: this.selectedChild,
                parent_uid: this.selectedAssyUid
            },
            success: function(result, request) {
                var result = result.responseText;
                var str = result; // var str = '293';
                
                if(systemCode == 'O') {
                	str = str.substring(0, str.length-1) + '0'; //'O'를 0 으로 교체.
                }
                
                gu.getCmp( 'pl_no').setValue(str);


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

    // Define reset Action
    resetAction: Ext.create('Ext.Action', {
        itemId: 'resetButton',
        iconCls: 'af-remove',
        text: CMD_INIT,
        handler: function(widget, event) {
            resetPartForm();
            //gu.getCmp('addPartForm')).getForm().reset();
            // console_logs('getForm().reset()', 'ok');
        }
    }),


    importAssyAction: Ext.create('Ext.Action', {
        itemId: 'importAssyAction',
        iconCls: 'font-awesome_4-7-0_arrow-down_14_0_5395c4_none',
        text: '가져오기',
        disabled: true,
        handler: function(widget, event) {

            console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '추가할  Assembly를 선택하세요.', function callBack(id) {
                    return
                });
                return;
            }
                
            if(gm.me().checkClosed() == true) {
                return;
            } 
          
            var searchStandardAssyStore = gm.me().searchStandardAssyStore;
            //searchStandardAssyStore.getProxy().setExtraParam('bom_flag', 'T');
            searchStandardAssyStore.getProxy().setExtraParam('sg_code', 'BOM');
            
            var itemGrid = Ext.create('Ext.grid.Panel', {
                //title: '종전 Assembly',
                store: gm.me().partlineStore,
                // /COOKIE//stateful: true,
                collapsible: false,
                multiSelect: false,
                //selModel: selModelMycart,
                //stateId: 'gridMycart' + /* (G) */ vCUR_MENU_CODE,
                // height: getCenterPanelHeight(),
                width: 600,
                height:400,
                dockedItems: [{
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default1',
                        items: [
                        	{
                        		width: '100%',
                        		field_id:  'search_information_assy',
                                id: gu.id('search_information_assy'),
                                name: 'search_information_assy',
                                xtype: 'combo',
                                emptyText: '코드, 품명 또는 규격으로 Assembly 검색',
                                store: searchStandardAssyStore,
                                displayField: 'specification',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                sortInfo: {
                                    field: 'specification',
                                    direction: 'ASC'
                                },
                                minChars: 1,
                                typeAhead: false,
                                hideLabel: true,
                                hideTrigger: true,
                                //anchor: '100%',
                                allowBlank: true,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 결과가 없습니다.',

                                    // Custom rendering template for each item
                                    getInnerTpl: function() {
                                        return '<div onclick="gm.me().setBomDataImport({id},\'{item_code}\',\'{item_name}\');"><a class="search-item" href="javascript:gm.me().setBomDataImport({id},\'{item_code}\',\'{item_name}\');">' +
                                        '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                            '</a></div>';
                                    }
                                },
                                pageSize: 10
                            }
                        ]
                    }

                ],
                columns: [
                	{ 
			        	text: '순번',  
			        	dataIndex: 'pl_no'
			        },
			        { 
			        	text: '자재번호',  
			        	dataIndex: 'item_code'
			        },
			        { 
			        	text: '품명',  
			        	dataIndex: 'item_name'
			        },
			        { 
			        	text: '규격',
			        	flex: 1,
			        	dataIndex: 'specification'
			        },
			        { 
			        	text: '수량', 
			        	width: 50,
			        	align: 'right',
			        	dataIndex: 'bm_quan'
			        }
                	
                ]
                
            });
            
            var win = Ext.create('ModalWindow', {
                title: 'Assembly 가져오기',
//                        header: {
//                            titlePosition: 2//,
//                            //titleAlign: 'center'
//                        },
                width: 600,
                height:400,
                minWidth: 250,
                minHeight: 180,
                maximizable: true,
                items: itemGrid,
               
                buttons: [{
                        text: '가져오기',
                        handler: function() {
                        	var myStore = gm.me().partlineStore;
                        	var uids = [];
                        	myStore.data.each(function(rec) {
                        		//console_logs('this', rec);
                        		uids.push(rec.get('unique_uid'));
                            });
                        	console_logs('import uids', uids);
                        	
                            if (win) {
                                win.close();
                            }
                            
                        	if(uids.length==0) {
                                 Ext.MessageBox.alert('알림','가져올 항목이 없습니다.');
                        	} else {
                                var pj_uid = gm.me().selectedPjUid;
                                var parent = gm.me().selectedChild;
                                var parent_uid = gm.me().selectedAssyUid;
                                var cnt = uids.length;
                            	
                                console_logs('pj_uid', pj_uid);
                                console_logs('parent_uid', parent_uid);
                                
                            	
                            	if(cnt<1) {
                            		Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
                            	} else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                                    Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
                                } else {
                                	gm.me().pastePartActionHandler(uids);
                                	gm.me().partlineStore.removeAll();
                                }
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


        }
    }),
    
    pastePartActionHandler: function(uids) {
    	
    	this.grid.setLoading(true);
    	
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=addPastePartAssymap',
            params: {
                project_uid: gm.me().selectedPjUid,
                parent: gm.me().selectedChild,
                parent_uid: gm.me().selectedAssyUid,
                resetQty: 'false',
                resetPlno: 'false',
                uidList: uids
            },
            success: function(result, request) {
//                if (w) {
//                    w.close();
//                }
//                var result = result.responseText;
                //this.store.load(function() {});
                // Ext.MessageBox.alert('결과','총
                // ' + result + '건을
                // 복사하였습니다.');
                gm.me().store.load(function(records) {

                	gm.me().grid.setLoading(false);
                });
            },
            failure: extjsUtil.failureMessage
        });
        /*

            var fp = Ext.create('Ext.FormPanel', {
                id: gu.id('formPanelSelect'),
                frame: true,
                border: false,
                fieldDefaults: {
                    labelWidth: 80
                },
                width: 300,
                height: 220,
                bodyPadding: 10,
                items: [{
                        xtype: 'component',
                        html: '복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '10 10 10',
                        items: [{
                            xtype: 'fieldset',
                            flex: 1,
                            border: false,
                            // title: '복사 수행시 수량을 1로 초기화하거나
                            // 품번을 대상 Assy에 맞게 재 부여할 수
                            // 있습니다.',
                            defaultType: 'checkbox', // each
                            // item
                            // will
                            // be a
                            // checkbox
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%',
                                hideEmptyLabel: false
                            },
                            items: [{
                                fieldLabel: '복사 옵션',
                                boxLabel: '수량을 1로 초기화',
                                name: 'resetQty',
                                checked: false,
                                inputValue: 'false'
                            }, {
                                boxLabel: '품번 재부여',
                                name: 'resetPlno',
                                checked: false,
                                inputValue: 'false'
                            }, new Ext.form.Hidden({
                                name: 'hid_null_value'
                            })]
                        }]
                    }
                ]
            });

            w = Ext.create('ModalWindow', {
                title: CMD_ADD + ' :: ' + vCUR_MENU_NAME,
                width: 300,
                height: 220,
                plain: true,
                items: fp,
                buttons: [{
                    text: '복사 실행',
                    disabled: false,
                    handler: function(btn) {
                        var form = gu.getCmp('formPanelSelect').getForm();
                        var val = form.getValues(false);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design/bom.do?method=addPastePartAssymap',
                            params: {
                                project_uid: gm.me().selectedPjUid,
                                parent: gm.me().selectedChild,
                                parent_uid: gm.me().selectedAssyUid,
                                resetQty: val['resetQty'],
                                resetPlno: val['resetPlno'],
                                uidList: uids
                            },
                            success: function(result, request) {
                                if (w) {
                                    w.close();
                                }
                                var result = result.responseText;
                                //this.store.load(function() {});
                                // Ext.MessageBox.alert('결과','총
                                // ' + result + '건을
                                // 복사하였습니다.');
                                gm.me().store.load(function(records) {
                                   // gm.me().insertStockStoreRecord(records);
                                  gm.me().setCopiedPartQuan(0);

                                });
                            },
                            failure: extjsUtil.failureMessage
                        });

                    }


                }, {
                    text: CMD_CANCEL,
                    handler: function() {
                        if (w) {
                            w.close();
                        }
                    }
                }]
            });
            w.show();
		*/
    },
    
    pastePartAction: Ext.create('Ext.Action', {
        itemId: 'pasteActionButton',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function(widget, event) {
            var pj_uid = gm.me().selectedPjUid;
            var parent = gm.me().selectedChild;
            var parent_uid = gm.me().selectedAssyUid;
            var cnt = gm.me().copiedPartCnt;
        	
            console_logs('pj_uid', pj_uid);
            console_logs('parent_uid', parent_uid);
            
        	
        	if(cnt<1) {
        		Ext.MessageBox.alert('오류', '복사한 자재가 없습니다.');
        	} else if (parent_uid == null || parent_uid == '' || pj_uid == null || pj_uid == '') {
                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
            } else {
            	gm.me().pastePartActionHandler(null);
            }

        }
    }),

    sendValveAction: Ext.create('Ext.Action', {
        itemId: 'sendValveAction',
        iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        text: 'V/V생산요청',
        disabled: true,
        handler: function(widget, event) {
        	
        	
    		var rec = gm.me().selected_tree_record;
    		var selectedAssyUid = rec.get('unique_uid');
    		var reserved_varchar1 = rec.get('reserved_varchar1');
    		console_logs('sendValveAction selectedAssyUid', selectedAssyUid);
    		console_logs('sendValveAction reserved_varchar1', reserved_varchar1);
    		
    		if(reserved_varchar1==null || reserved_varchar1=='') {
    			Ext.MessageBox.alert('알림', 'Valve No가 입력되지 않았습니다.');
    		} else {

    	        var msg = 'Actuator를  Valve No.기준으로 생산요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.'
    	        	 +'<hr><u>Valve No. 목록</u><br>'
    	        	 +'<div style="background-color:#EFFDDE ;border:0px solid #EAEAEA;width: 200; height: 80; word-wrap: break-word; white-space:normal; overflow-x:hidden; overflow-y: hidden;">'
    	        	 + gu.Comma2Area(reserved_varchar1)
    	        	 + '</div>'
    	        	;

    			
    			
    			
    			var messageBox = Ext.MessageBox.show({
                    title: 'V/V No(Actucatior) 생산요청',
                    msg: msg,
                    width: 360,
                    buttons: Ext.MessageBox.OKCANCEL,  
                    fn: function (result){
                    	if(result=='ok') {
                    		gm.me().requestValve();
                    	}
                    },
                    icon: Ext.MessageBox.QUESTION
                });
    		}
        
        }
    }),
    
    pasteAssyAction: Ext.create('Ext.Action', {
        itemId: 'pasteAssyAction',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        disabled: true,
        handler: function(widget, event) {
        	
        	console_logs('gm.me().selectedAssyUid', gm.me().selectedAssyUid);
        	
            if (gm.me().selectedAssyUid == null || gm.me().selectedAssyUid == '' || gm.me().selectedPjUid == null || gm.me().selectedPjUid == '') {
                Ext.MessageBox.alert('오류', '먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
            } else {
            	
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=addPasteAssyAssymap',
                    params: {
                    	to_pj_uid: gm.me().selectedPjUid,
                        to_assy_uid: gm.me().selectedAssyUid,
                        to_parent:gm.me().selectedChild
                    },
                    success: function(result, request) {
                        var result = result.responseText;
                        console_logs('result', result);
                        gm.me().selectTreeGrid(null);
                        gm.me().refreshAssyCopy();
                   		gm.me().cloudProjectTreeStore.load({
                   		    callback: function(records, operation, success) {
                   		    	console_log('load tree store');
                   		    	console_logs('cloudProjectTreeStore records ==> ', records);
                   		    	console_log('ok');
                   		    	//pjTreeGrid.setLoading(false);
                   		        // treepanel.expandAll();
                   		    }                               
                   		});
                    },
                    failure: extjsUtil.failureMessage
                });

//                var fp = Ext.create('Ext.FormPanel', {
//                    id: gu.id('pasteAssyAction'),
//                    frame: true,
//                    border: false,
//                    fieldDefaults: {
//                        labelWidth: 80
//                    },
//                    width: 300,
//                    height: 220,
//                    bodyPadding: 10,
//                    items: [{
//                            xtype: 'component',
//                            html: '복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
//                        },
//                        {
//                            xtype: 'container',
//                            layout: 'hbox',
//                            margin: '10 10 10',
//                            items: [{
//                                xtype: 'fieldset',
//                                flex: 1,
//                                border: false,
//                                // title: '복사 수행시 수량을 1로 초기화하거나
//                                // 품번을 대상 Assy에 맞게 재 부여할 수
//                                // 있습니다.',
//                                defaultType: 'checkbox', // each
//                                // item
//                                // will
//                                // be a
//                                // checkbox
//                                layout: 'anchor',
//                                defaults: {
//                                    anchor: '100%',
//                                    hideEmptyLabel: false
//                                },
//                                items: [{
//                                    fieldLabel: '복사 옵션',
//                                    boxLabel: '수량을 1로 초기화',
//                                    name: 'resetQty',
//                                    checked: true,
//                                    inputValue: 'true'
//                                }, {
//                                    boxLabel: '품번 재부여',
//                                    name: 'resetPlno',
//                                    checked: true,
//                                    inputValue: 'true'
//                                }, new Ext.form.Hidden({
//                                    name: 'hid_null_value'
//                                })]
//                            }]
//                        }
//                    ]
////                });
//
//                w = Ext.create('ModalWindow', {
//                    title: CMD_ADD + ' :: ' + /* (G) */ vCUR_MENU_NAME,
//                    width: 300,
//                    height: 220,
//                    plain: true,
//                    items: fp,
//                    buttons: [{
//                        text: '복사 실행',
//                        disabled: false,
//                        handler: function(btn) {
//                            var form = gu.getCmp('pasteAssyAction').getForm();
//                            var val = form.getValues(false);
//                            var selections = gridMycart.getSelectionModel().getSelection();
//                            if (selections) {
//                                var uids = [];
//                                for (var i = 0; i < selections.length; i++) {
//                                    var rec = selections[i];
//                                    var unique_uid = rec.get('unique_uid');
//                                    uids.push(unique_uid);
//                                }
//                                Ext.Ajax.request({
//                                    url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
//                                    params: {
//                                        project_uid: gm.me().selectedPjUid,
//                                        parent: gm.me().selectedChild,
//                                        parent_uid: gm.me().selectedAssyUid,
//                                        unique_uids: uids,
//                                        resetQty: val['resetQty'],
//                                        resetPlno: val['resetPlno']
//                                    },
//                                    success: function(result, request) {
//                                        if (w) {
//                                            w.close();
//                                        }
//                                        var result = result.responseText;
//                                        this.myCartStore.load(function() {});
//                                        // Ext.MessageBox.alert('결과','총
//                                        // ' + result + '건을
//                                        // 복사하였습니다.');
//                                        store.load(function(records) {
//                                            gm.me().insertStockStoreRecord(records);
//                                            gm.me().setCopiedPartQuan(records.length);
//
//                                        });
//                                    },
//                                    failure: extjsUtil.failureMessage
//                                });
//
//                            }
//
//                        }
//                    }, {
//                        text: CMD_CANCEL,
//                        handler: function() {
//                            if (w) {
//                                w.close();
//                            }
//                        }
//                    }]
//                });
//                w.show();
//
//
            }
        }
    }),

    // 수정등록
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
        var component = gu.getCmp(cmpName);

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
        // this.this.assyGrid.setLoading(true);

        this.mesProjectTreeStore.removeAll(true);
        this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
        this.mesProjectTreeStore.load({
            callback: function(records, operation, success) {

            }
        });
    },

    setBomData: function(id) {
    	
    	gm.me().createPartForm.setLoading(true);
    	

        console_logs('setBomData id=', id);
        //        this.modRegAction.enable();
        //        this.resetPartForm();

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id
            },
            success: function(result, request) {

                var jsonData = Ext.decode(result.responseText);
                // console_logs('jsonData', jsonData);
                var records = jsonData.datas;
                // console_logs('records', records);
                // console_logs('records[0]', records[0]);
                gm.me().setPartFormObj(records[0]);
                
                gm.me().createPartForm.setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });

    },
    
    setBomDataAssy : function(id, item_code, item_name) {
    	gu.getCmp('target_item_code').setValue(item_code);
        gu.getCmp('target_assy_name').setValue(item_name);
        gu.getCmp('search_information_assy_add').setValue(item_name);
        gu.getCmp('target_child').setValue(id);
  },
    setBomDataImport: function(id, item_code, item_name) {
    	
    	console_logs('id', id);
    	console_logs('item_code', item_code);
    	console_logs('item_name', item_name);
    	
//        gu.getCmp('target_uid').setValue(id);
//        gu.getCmp('target_item_code').setValue(item_code);
        //gu.getCmp('assy_name').setValue(item_name);
    	try {
            gu.getCmp('information_assy').setValue(item_name);    		
    	} catch(e) {console_logs('setBomDataImport e', e);}

		 gm.me().partlineStore.getProxy().setExtraParam('parent', id);
		 gm.me().partlineStore.getProxy().setExtraParam('ac_uid', -1);
		 gm.me().partlineStore.getProxy().setExtraParam('parent_uid', -1);
		 gm.me().partlineStore.getProxy().setExtraParam('orderBy', "pl_no");
		 gm.me().partlineStore.getProxy().setExtraParam('ascDesc', "ASC");  
		 gm.me().partlineStore.load();
        
    },


    setPartFormObj: function(o) {
        console_logs('setPartFormObj o', o);

        //        // 규격 검색시 standard_flag를 sp_code로 사용하기
        //        Ext.Ajax.request({
        //            url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',
        //            success: function(result) {
        //                var text = result.responseText;
        //                console_logs('text', text);
        //                var o2 = JSON.parse(text, function(key, value) {
        //                    return value;
        //                });
        //
        //                // console_logs('o2', o2);
        //                gItemGubunType = o2['itemGubunType'];
        //                // console_logs('itemGubun', itemGubunType);
        //                // console_logs('itemGubun1', gItemGubunType);


        var standard_flag = 'R';
        //                if (gItemGubunType == 'standard_flag') {
        //                    standard_flag = o['standard_flag'];
        //                } else {
        //                    standard_flag = o['sp_code'];
        //                }

        gu.getCmp('unique_id').setValue(o['unique_id_long']);
        gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);

        gu.getCmp('standard_flag').setValue(standard_flag);
        gu.getCmp('standard_flag_disp').select(gm.me().getPosStandard(standard_flag));
        gu.getCmp('model_no').setValue(o['model_no']);
        gu.getCmp('description').setValue(o['description']);

        gu.getCmp('comment').setValue(o['comment']);
        gu.getCmp('maker_name').setValue(o['maker_name']);
        gu.getCmp('bm_quan').setValue('1');
        gu.getCmp('unit_code').setValue(o['unit_code']);
        gu.getCmp('sales_price').setValue(o['sales_price']);


        gm.me().getPl_no(standard_flag);

        var currency = o['currency'];
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp('currency').setValue(currency);
        this.readOnlyPartForm(true);

        //
        //
        //            },
        //            failure: extjsUtil.failureMessage
        //        });




    },

    setPartForm: function(record) {
        // console_logs('record:', record);

        gu.getCmp( 'unique_id').setValue(record.get('unique_id'));
        gu.getCmp( 'unique_uid').setValue(record.get('unique_uid'));
        gu.getCmp( 'item_code').setValue(record.get('item_code'));
        gu.getCmp( 'item_name').setValue(record.get('item_name'));
        gu.getCmp( 'specification').setValue(record.get('specification'));

        var standard_flag = record.get('standard_flag');
        gu.getCmp( 'standard_flag').setValue(standard_flag);

        gu.getCmp( 'standard_flag_disp').select(getPosStandard(standard_flag));
        gu.getCmp( 'model_no').setValue(record.get('model_no'));
        gu.getCmp( 'description').setValue(record.get('description'));
        gu.getCmp( 'pl_no').setValue(record.get('pl_no'));
        gu.getCmp( 'comment').setValue(record.get('comment'));
        gu.getCmp( 'maker_name').setValue(record.get('maker_name'));
        gu.getCmp( 'bm_quan').setValue(record.get('bm_quan'));
        gu.getCmp( 'unit_code').setValue(record.get('unit_code'));
        gu.getCmp( 'sales_price').setValue(record.get('sales_price'));


        var currency = record.get('currency');
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp( 'currency').setValue(currency);

        var ref_quan = record.get('ref_quan');
        // console_logs('ref_quan', ref_quan);
        if (ref_quan > 1) {
            this.readOnlyPartForm(true);
            gu.getCmp( 'isUpdateSpec').setValue('false');
        } else {
            this.readOnlyPartForm(false);
            this.setReadOnlyName('item_code', true);
            this.setReadOnlyName('standard_flag_disp', true);
            gu.getCmp( 'isUpdateSpec').setValue('true');
        }

    },

    resetPartForm: function() {

        gu.getCmp( 'unique_id').setValue('');
        gu.getCmp( 'unique_uid').setValue('');
        gu.getCmp( 'item_code').setValue('');
        gu.getCmp( 'item_name').setValue('');
        gu.getCmp( 'specification').setValue('');
        gu.getCmp( 'standard_flag').setValue('');
        gu.getCmp( 'standard_flag_disp').setValue('');

        gu.getCmp( 'model_no').setValue('');
        gu.getCmp( 'description').setValue('');
        gu.getCmp( 'pl_no').setValue('');
        gu.getCmp( 'comment').setValue('');
        gu.getCmp( 'maker_name').setValue('');
        gu.getCmp( 'bm_quan').setValue('1');
        gu.getCmp( 'unit_code').setValue('');
        gu.getCmp( 'sales_price').setValue('0');

        gu.getCmp( 'currency').setValue('KRW');
        gu.getCmp( 'unit_code').setValue('PC');
        this.readOnlyPartForm(false);
    },

    unselectForm: function() {

        gu.getCmp( 'unique_id').setValue('');
        gu.getCmp( 'unique_uid').setValue('');
        gu.getCmp( 'item_code').setValue('');

        var cur_val = gu.getCmp( 'specification').getValue();
        var cur_standard_flag = gu.getCmp( 'standard_flag').getValue();

        if (cur_standard_flag != 'O') {
            gu.getCmp( 'specification').setValue(cur_val + ' ' + this.CHECK_DUP);
        }

        gu.getCmp( 'currency').setValue('KRW');

        this.getPl_no(gu.getCmp( 'standard_flag').getValue());
        this.readOnlyPartForm(false);
    },

    readOnlyPartForm: function(b) {

        this.setReadOnlyName('item_code', b);
        this.setReadOnlyName('item_name', b);
        this.setReadOnlyName('specification', b);
        this.setReadOnlyName('standard_flag', b);
        this.setReadOnlyName('standard_flag_disp', b);

        this.setReadOnlyName('model_no', b);
        this.setReadOnlyName('description', b);
        // this.setReadOnlyName('pl_no', b);
        this.setReadOnlyName('comment', b);
        this.setReadOnlyName('maker_name', b);

        this.setReadOnlyName('currency', b);
        this.setReadOnlyName('unit_code', b);

        gu.getCmp('information').setValue('');

    },

    searchAction: Ext.create('Ext.Action', {
        itemId: 'searchButton',
        iconCls: 'font-awesome_4-7-0_refresh_14_0_5395c4_none',
        text: '새로 고침',
        disabled: false,
        handler: function() {
        	gm.me().myCartStore.getProxy().setExtraParam('type', 'BOM');
            gm.me().myCartStore.load(function() {
            });
        }
    }),


    Item_code_dash: function(item_code) {
        return item_code.substring(0, 5) + "-" + item_code.substring(5, 9) + "-" +
            item_code.substring(9, 12);
    },

//    materialClassStore: new Ext.create('Ext.data.Store', {
//
//        fields: [{
//            name: 'class_code',
//            type: "string"
//        }, {
//            name: 'class_name',
//            type: "string"
//        }, {
//            name: 'level',
//            type: "string"
//        }],
//        sorters: [{
//            property: 'display_order',
//            direction: 'ASC'
//        }],
//        proxy: {
//            type: 'ajax',
//            url: CONTEXT_PATH + '/design/class.do?method=read',
//            reader: {
//                type: 'json',
//                root: 'datas',
//                totalProperty: 'count',
//                successProperty: 'success'
//            },
//            extraParams: {
//                level: '2',
//                parent_class_code: ''
//            },
//            autoLoad: true
//        }
//    }),
    standard_flag_datas: [],
    assyGrid: null,
    expandAllTree: function() {
        if (this.assyGrid != null) {
            this.assyGrid.expandAll();
        }
    },
    isExistMyCart: function(inId) {
        var bEx = false; // Not Exist
        this.myCartStore.data.each(function(item, index, totalItems) {
            console_logs('item', item);
            var uid = item.data['unique_uid'];
            console_logs('uid', uid);
            console_logs('inId', inId);
            if (inId == uid) {
                bEx = true; // Found
            }
        });

        return bEx;
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
    // selectedClass1 : '',
    // selectedClass2 : '',
    // selectedClass3 : '',
    selectedClassCode: '',
    materialStore: Ext.create('Mplm.store.MtrlSubStore'),
    productSubStore: Ext.create('Mplm.store.ProductSubStore')
        // makeClassCode : function() {
        // this.selectedClassCode = this.selectedClass1 + this.selectedClass2 +
        // this.selectedClass3
        // }


        ,
    addMtrlGrid: null,
    addPrdGrid: null,
    deleteValveConfirm: function(result) {
    	 if (result == 'yes') {
    		 var selections = gm.me().gridValve.getSelectionModel().getSelection();
	        if (selections == null || selections.length == 0) {
	            Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
	        } else {
	        	var exist = [];
             	var targetUid = [];
             	for(var i=0; i< selections.length; i++) {
             		var status = selections[i].get('status');
            		var unique_uid = selections[i].get('unique_uid');
            		if(status =='CR' || status =='BM') {
            			targetUid.push(unique_uid);
            		} else {
            			exist.push(unique_uid);
            		}
            		
             	}
            	console_logs('targetUid', targetUid);
            	if(targetUid.length>0) {
                	gm.me().gridValve.setLoading(true);
                	Ext.Ajax.request({
             			url: CONTEXT_PATH + '/design/bom.do?method=deleteConfirmValve',
             			params:{
             				assymap_uids : targetUid
             			},
             			success : function(result, request) {   
             				gm.me().valveNoStore.load(function() {
             					gm.me().gridValve.setLoading(false);
             				});
             			}
               	    });
                	            		
            	}

            	if(exist.length>0) {
            		Ext.Msg.alert('안내', exist.length + '건은 [진행중]이어서 삭제할 수 없습니다.', function() {});
            	}
	        }
    		 
    	 }
    },
    
    deleteConfirm: function(result) {
        if (result == 'yes') {
            var arr = gm.me().selectionedUids;
            // console_logs('deleteConfirm arr', arr);
            if (arr.length > 0) {

                var CLASS_ALIAS = gm.me().deleteClass;
                // console_logs('deleteConfirm CLASS_ALIAS',
                // CLASS_ALIAS);
                // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
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
                // console_logs('deleteConfirm CLASS_ALIAS 2',
                // CLASS_ALIAS);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: arr
                    },
                    method: 'POST',
                    success: function(rec, op) {
                        // console_logs('success rec', rec);
                        // console_logs('success op', op);
                        // gm.me().redrawStore();
                        gm.me().store.load();

                    },
                    failure: function(rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

                    }
                });

            }
        }

        // }
    },

    srchTreeHandler: function(my_treepanel, cloudProjectTreeStore, widName, parmName, b) {

        console_logs("srchSingleHandler my_treepanel", my_treepanel);
        console_logs("srchSingleHandler cloudProjectTreeStore", cloudProjectTreeStore);
        console_logs("srchSingleHandler widName", widName);
        console_logs("srchSingleHandler parmName", parmName);
        console_logs("srchSingleHandler b", b);

        //this.assyGrid.setLoading(true);

        this.resetParam(this.cloudProjectTreeStore, this.searchField);
        var val = gu.getCmp(widName).getValue();
        console_log('val' + val);

        try {
            this.cloudProjectTreeStore.getProxy().setExtraParam(parmName, val);
            this.cloudProjectTreeStore.load({

                callback: function(records, operation, success) {
                    console_logs('======> records', records);
                    gm.me().assyGrid.setLoading(false);

                    gm.me().valve_nos = [];
                    gm.me().selectTree();
                    //gm.me().assyGrid.getSelectionModel().select(0);
                    //gm.me().assyGrid.expandAll ();

                }
            });        	
        } catch(e) {console_logs('catch e', e);}


    },

    selectProjectCombo: function(record) {

    	console_logs('selectProjectCombo record', record);
        var pjuid = record.get('unique_id');
        this.ac_uid = pjuid;
        var pj_name = record.get('pj_name');
        var pj_code = record.get('pj_code');
        var pm_name = record.get('pm_name');
        var delivery_plan_str = record.get('delivery_plan_str');
        
        var reserved_varchara = record.get('reserved_varchara');
        var reserved_varcharb = record.get('reserved_varcharb'); //칼날Size
        var reserved_varcharc = record.get('reserved_varcharc'); //판걸이단위
        var reserved_varchard = record.get('reserved_varchard'); //제품Size
        var reserved_varchare = record.get('reserved_varchare'); //단가정보
        var reserved_varcharf = record.get('reserved_varcharf');
        
        
        var description = '<u><b>담당자: ' + pm_name + ', 납품예정일:' + delivery_plan_str + '</b></u><br>';
        description = description + '칼날Size: <b>' + reserved_varcharb + '</b>, 판걸이단위: <b>' +  reserved_varcharc + '</b>, 제품Size: <b>' + reserved_varchard + '</b><br>';
        description = description +  record.get('description');
        if(reserved_varchare!=null && reserved_varchare.length>0) {
            description = description +  ' (단가정보: <b>' + reserved_varchare + '</b>)';
        }
        
        
        this.assy_pj_code = '';
        this.selectedAssyCode = '';
        this.selectedPjCode = pj_code;
        this.selectedPjName = pj_name;
        this.selectedPjUid = pjuid;

        this.puchaseReqTitle = '[' + pj_code + '] ' + pj_name;

        gu.getCmp('target-projectcode').update(pj_code);
        
        gu.getCmp('projectinfo').update(description);

        this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        this.store.removeAll();
        this.unselectAssy(record);
        // Default Set
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
            params: {
                paramName: 'CommonProjectAssy',
                paramValue: pjuid + ';' + '-1'
            },

            success: function(result, request) {
                console_log('success defaultSet');
            },
            failure: function(result, request) {
                console_log('fail defaultSet');
            }
        });
        
        gm.me().refreshValve();
    },
    registPartFc: function(val) {
        console_logs('registPartFc val', val);
        gm.me().addNewAction(val);
    },
    addNewAction: function(val) {

        var partLine = Ext.create('Rfx.model.PartLine');
        for (var attrname in val) {
            //partLine[attrname] = val[attrname]; 
            partLine.set(attrname, val[attrname]);
        }


        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=createNew',
            params: val,
            success: function(result, request) {
            	gm.me().selectTreeGrid(null);
//                gm.me().cloudProjectTreeStore.load({
//
//                    callback: function(records, operation, success) {
//                        gm.me().selectTreeGrid(null);
//                    	//gm.me().assyGrid.expandAll();
//                    }
//                });

                //Ext.Msg.alert('결과', '저장 성공.');
            },
            failure: function(batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });

    },

    selectTree: function() {
        if (this.selected_tree_record != null) {
            //this.assyGrid.getSelectionModel().select(this.selected_tree_record);
        } else {
            //this.assyGrid.getSelectionModel().select(0);
        }
        this.assyGrid.expandAll();

    },

    selectTreeRecord: function(rec) {

        if (this.selected_tree_record != null && rec.id == this.selected_tree_record.id) {
            console_logs('===== matched', rec);
            this.assyGrid.getSelectionModel().select(rec);
        }
    },

    selectTreeGrid: function(rec) {
    	//console_logs('selectTreeGrid rec', rec);
        if (rec == null) {
            this.store.load(function(records){
            	gm.me().setMakeTable(records);
            });
        } else {
            this.selected_tree_record = rec;
            this.classCode = rec.get('class_code');
            this.selectedAssyCode = rec.get('assy_code');
            this.modelNo = rec.get('model_no');
            this.description = rec.get('description');
            this.selectedparent = rec.get('parent');
            this.selectedChild = rec.get('child');
            this.selectedAssyUid = rec.get('unique_uid');
            this.assy_uid = rec.get('parent');
            this.reserved_varchar1 = rec.get('reserved_varchar1');
            this.selectedAssyName = rec.get('assy_name');
            this.selectedPjUid = rec.get('ac_uid');
            this.selectedPjCode = rec.get('pj_code');

            this.routeTitlename = '[' + rec.get('pl_no') + '] ' + rec.get('item_name') + ' / ' + rec.get('specification');
            this.depth = rec.get('depth');
            this.selectAssy(rec);

            var parent = rec.get('unique_id_long');
            this.store.getProxy().setExtraParam('parent', this.selectedChild);
            this.store.getProxy().setExtraParam('parent_uid', this.selectedAssyUid);
            this.store.getProxy().setExtraParam('orderBy', "pl_no");
            this.store.getProxy().setExtraParam('ascDesc', "ASC");
            this.store.getProxy().setExtraParam('ac_uid', this.selectedPjUid);
            this.store.load(function(records){
            	gm.me().setMakeTable(records);
            });
            
        }
        


    },

    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'req_info':
                this.updateDesinComment(rec);
                break;
            default:
            	gm.editRedord(field, rec);

        }


    },

    updateDesinComment: function(rec) {
        var unique_uid = rec.get('unique_uid');
        var req_info = rec.get('req_info');
        var reserved_varchar1 = rec.get('reserved_varchar1');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
            params: {
                id: unique_uid,
                req_info: req_info,
                reserved_varchar1 : reserved_varchar1
            },
            success: function(result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },
    
    doRequestAction: function(isGoodsin) {


        var selections = null;
        var rqstType = null;
        if (isGoodsin) {
            selections = this.gridStock.getSelectionModel().getSelection();
            rqstType = '반출요청';
            console_logs(rqstType, selections);
        } else {
            selections = this.gridMycart.getSelectionModel().getSelection();
            rqstType = '구매요청';
            console_logs(rqstType, selections);
        }

        console_logs('selections', selections);
        if (selections == null || selections.length == 0) {
            Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
        }

        var nique_uids = new Array();
        var new_pr_quans = new Array();

        var userStore = Ext.create('Mplm.store.UserStore', {
            hasNull: false
        });

        var route_type = isGoodsin == true ? 'G' : 'P';

        var puchaseReqTitle = '[' + this.selectedPjCode + '] ' + this.selectedPjName + ' : ' + rqstType;

        var unique_uids = [];
        this.catmapObj = [];
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];

            if (isGoodsin == false) {
                var ac_uid = rec.get('ac_uid');
                if (ac_uid + '' != this.selectedPjUid + '') {
                    Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + this.selectedPjName + '] 프로젝트에 속한 자재만 ' + rqstType + '할 수 있습니다.');
                    return;
                }
//                if (rec.get('goodsout_quan') > 0) {
//                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '" 아이템에 가용재고가 있습니다. 먼저 창고반출요청을 진행하세요.');
//                    return;
//                }

                new_pr_quans[i] = rec.get('reserved_double1');


            } else {
                if (rec.get('goodsout_quan') > rec.get('new_pr_quan')) {
                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 반출요청 수량이 필요수량보다 큽니다.');
                    return;
                } else if (rec.get('goodsout_quan') > rec.get('stock_qty_useful')) {
                    Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 반출요청 수량이 재고수량보다 큽니다.');
                    return;
                }
                new_pr_quans[i] = rec.get('goodsout_quan');
            }

            unique_uids[i] = rec.get('unique_uid');
            if (new_pr_quans[i] < 0.00000001) {
                Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 요청 수량이 0입니다.');
                return;
            }

            this.catmapObj[i] = rec;

        }//emdoffor



        var item_name = rec.get('item_name');
        var item_code = rec.get('item_code');
        var item_qty = selections.length;
        
        Ext.MessageBox.show({
            title: '구매요청',
            msg: '구매요청 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (result){
            	console_logs('구매요청 result', result);
            	if(result='yes') {
            		var unique_ids = [];
            		var cartmapQtys = [];
            		var curArr = [];
            		var my_child = [];
            		var mycart_uids=[];
            		var arr = gm.me().catmapObj;
            		for(var i=0 ; i< arr.length; i++) {
            			var o = arr[i];
            			unique_ids.push(o.get('unique_uid'));
            			my_child.push(o.get('unique_id'));
            			cartmapQtys.push(o.get('reserved_double1'));
            			curArr.push(o.get('currency'));
            			mycart_uids.push(o.get('id'));
            		}
            		// console_logs('unique_ids', unique_ids);
            		// console_logs('cartmapQtys', cartmapQtys);
            		
    	        	Ext.Ajax.request({
    					url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
    					params:{
    						type: 'BOM',
    						unique_uids: unique_ids,
    						child:my_child,
    						pr_quan:cartmapQtys,
    						item_name:item_name,
    						src_currencies:curArr,
    						mycart_uids:mycart_uids,
    						pj_uid: gm.me().selectedPjUid
    					},
    					
    					success : function(result, request) { 
    						gm.me().store.load();
             				gm.me().myCartStore.load(function() {
             					gm.me().gridMycart.setLoading(false);
             				});
    						Ext.Msg.alert('안내', '요청하었습니다.', function() {});
    						
    					},//endofsuccess
    					failure: extjsUtil.failureMessage
    				});//endofajax
            		
            		
            		
            		
				 }           
            	},
            icon: Ext.MessageBox.QUESTION
        });

//        var rtgapp_store = new Ext.data.Store({
//            pageSize: getPageSize(),
//            model: 'RtgApp'
//        });
//
//        var removeRtgapp = Ext.create('Ext.Action', {
//            itemId: 'removeRtgapp',
//            iconCls: 'remove',
//            text: CMD_DELETE,
//            disabled: true,
//            handler: function(widget, event) {
//                Ext.MessageBox.show({
//                    title: delete_msg_title,
//                    msg: delete_msg_content,
//                    buttons: Ext.MessageBox.YESNO,
//                    fn: deleteRtgappConfirm,
//                    // animateTarget: 'mb4',
//                    icon: Ext.MessageBox.QUESTION
//                });
//            }
//        });

    	}, //ndofdorequest

    	// Define process_request Action 
    	process_requestAction : Ext.create('Ext.Action', {
    		itemId: 'process_requestButton',
    	    iconCls: 'chevron-circle-right',
    	    text: '생산요청',
    	    disabled: true,
    	    handler: function(widget, event) {
    	    	Ext.MessageBox.show({
    	            title: '제작요청',
    	            msg: '제작요청 하시겠습니까?',
    	            buttons: Ext.MessageBox.YESNO,
    	            fn: process_requestConfirm,
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	}),
    	
        deleteCartConfirm : function(btn){
        	console_logs('deleteCartConfirm', btn);
            var selections = gm.me().gridMycart.getSelectionModel().getSelection();
            if (selections) {
               	
                	console_logs('selections', selections);
                	
                	var targetUid = [];
                	for(var i=0; i< selections.length; i++) {
                		var unique_uid = selections[i].get('unique_uid');
                		targetUid.push(unique_uid);
                	}
                	
                	console_logs('targetUid', targetUid);
                	
                	gm.me().gridMycart.setLoading(true);
                	Ext.Ajax.request({
             			url: CONTEXT_PATH + '/design/bom.do?method=deleteMyCart',
             			params:{
             				assymap_uids : targetUid
             			},
             			success : function(result, request) {   
             				gm.me().myCartStore.load(function() {
             					
             					gm.me().gridMycart.setLoading(false);
             				});
             			}
               	    });
                	
                	

            }
        },

        removeCartAction : Ext.create('Ext.Action', {
        	itemId: 'removeCartAction',
            iconCls: 'af-remove',
            text: 'Cart' + CMD_DELETE,
            disabled: true,
            handler: function(widget, event) {
            	Ext.MessageBox.show({
                    title:delete_msg_title,
                    msg: delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteCartConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        }),

        purchase_requestAction : Ext.create('Ext.Action', {
        	
        	itemId: 'purchaseButton',
        	iconCls:'font-awesome_4-7-0_dollar_14_0_5395c4_none',
            text: PURCHASE_REQUEST,
            disabled: true,
            handler: function(widget, event) {
            	gm.me().doRequestAction(false);
            
            }// endof handler
        }),

    	
    	contextMenuCart: Ext.create('Ext.menu.Menu', {
    	    items: [ /* addElecAction, editAction, */ this.removeCartAction  ]
    	}),
    	
    	copiedPartCnt: 0,
    	ongridValveSelection: function(selections) {
    		console_logs('--> ongridValveSelection selections', selections);
    		
    		if (selections.length>0) {
    			console_logs('enable', selections.length);
    			gm.me().removeValveAction.enable();
    		} else {
    			gm.me().removeValveAction.disable();
    		}
    		
    	},
    	onMygridSelection: function(selections) {
    		console_logs('onMygridSelection selections', selections);
    		this.selectionLength = selections.length;
            
    		var disable = false; //fPERM_DISABLING()
    		
            if (this.selectionLength>0) {
                if (disable== true) {
                    this.removeCartAction.disable();
                    this.pastePartAction.disable();
                    this.process_requestAction.disable();
                    this.purchase_requestAction.disable();
                } else {
                	this.removeCartAction.enable();
                	if(this.copiedPartCnt>0) {
                        this.pastePartAction.enable();                		
                	}

                    this.process_requestAction.enable();
                    this.purchase_requestAction.enable();

                }
            } else {
                if (this.gGridMycartSelects.length > 1) {
                	this.gridMycart.getView().select(this.gGridMycartSelects);
                }

                //this.collapseProperty();
                this.removeCartAction.disable();
                this.pastePartAction.disable();
                this.process_requestAction.disable();
                this.purchase_requestAction.disable();

            }
            
            this.copyArrayMycartGrid(selections);
    	},
        onAssemblyGridSelection: function(selections) {

                if (selections != null && selections.length > 0) {
                    gUtil.enable(gm.me().addAssyAction);
                    gUtil.enable(gm.me().editAssyAction);

                    var rec = selections[0];
                    gm.me().selectTreeGrid(rec);

                } else {
                    gm.me().selected_tree_record = null;
                    gUtil.disable(gm.me().addAssyAction);
                    gUtil.disable(gm.me().editAssyAction);

                }
        },
        reSelect: function() {
        	this.srchTreeHandler(this.assyGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
        	//this.selectProjectCombo(this.selected_tree_record);
        },
        copyAssemblyAction : Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            text: '복사',
            disabled: true,
            handler: function(widget, event) {
            	var selectedTreeRecord = gm.me().selected_tree_record;
            	if(selectedTreeRecord!=null) {
            		
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=copyBomAssembly',
                        params: {
                        	id : selectedTreeRecord.get('child'),
                        	parent : selectedTreeRecord.get('parent'),
                        	unique_uid : selectedTreeRecord.get('unique_uid'),
                        	ac_uid : selectedTreeRecord.get('ac_uid'),
                        	assy_code : selectedTreeRecord.get('assy_code'),
                        	pl_no : selectedTreeRecord.get('pl_no'),
                        	bm_quan : selectedTreeRecord.get('bm_quan'),
                        	part_folder : selectedTreeRecord.get('part_folder'),
                        	part_path : selectedTreeRecord.get('part_path'),
                        	pj_code : selectedTreeRecord.get('pj_code')
                        },
                        success: function(result, request) {
                        	console_logs('result', result.responseText);
                        	gm.me().setCopiedAssyQuan(/*result.responseText*/);
                        	
                        	var assyline = gm.me().selected_tree_record;
                        	var type = (assyline.get('depth') >1) ? 'Assembly' : '프로젝트';
                        	
                        	gm.me().showToast('결과', result.responseText + ' ' + type + '가 복사되었습니다.');
                            //Ext.MessageBox.alert('경과', result.responseText + ' ' + type + '가 복사되었습니다.');

                        }, // endof success for ajax
                        failure: extjsUtil.failureMessage
                    }); // endof Ajax            		
            	}

            }
        }),
        addPcsPlanAction : Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '공정 설계',
            tooltip: '',
            disabled: true,

            handler: function() {


            }
        }),

        removePartAction : Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: 'Part 삭제하기',
            disabled: true,
            handler: function(widget, event) {
                if(gm.me().checkClosed() == true) {
                    return;
                } 
                Ext.MessageBox.show({
                    title: '삭제하기',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        }),


        addPartAction : Ext.create('Ext.Action', {
            itemId: 'addPartAction',
            iconCls: 'af-plus-circle',
            disabled: true,
            text: '추가',
            handler: function(widget, event) {

            	console_logs('addPartAction event', event);
            	
            	var d = new Date();
            	var n = d.getTime();
            	
                // Create a model instance
                var r = Ext.create('Rfx.model.PartLine', {
                	//route_type: '--->',
                	id: n,
                	origin: '구매',
                	item_type: 'SHEET' ,
                	comment: null,
                	remark: null,
                	reserved_double1: null,
                	reserved_double2: null,
                	bm_quan: null,
                	reserved1: '1',
                	reserved2: null,
                	reserved3: null,
                	reserved4: null
                });
                
                
                var cnt = gm.me().store.getCount();

                gm.me().store.insert(cnt, r);
                gm.me().rowEditing.startEdit(cnt, 0);

            }
        }),

        copyPartAction : Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            text: '복사',
            disabled: true,
            handler: function(widget, event) {
            	var grid = gm.me().grid;
                // make uidlist
                var uidList = [];
                var selections = grid.getSelectionModel().getSelection();
                if (selections) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var standard_flag = rec.get('standard_flag');
                        if(standard_flag!='A') {//파트복사는 Assembly 제외
                            uidList.push(rec.get('unique_uid') );
                        }
                    }
                }

                if(uidList.length>0) {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=copyBomPart',
                        params: {
                            uidList: uidList
                        },
                        success: function(result, request) {
//                        	console_logs('result', result.responseText);
                        	gm.me().setCopiedPartQuan(Number(result.responseText));
                        	gm.me().showToast('결과', result.responseText + '개 자재가 복사되었습니다.');
//                            Ext.MessageBox.alert('경과', result.responseText + '개 자재가 복사되었습니다.');

                        }, // endof success for ajax
                        failure: extjsUtil.failureMessage
                    }); // endof Ajax                	
                } else {
                	 Ext.MessageBox.alert('알림', '선택한 항목에 자재가 존재하지 않습니다. <br>Assembly 복사를 활용하세요.');
                }


            }
        }),
        
      //Mycart
        addMyCartAction : Ext.create('Ext.Action', {
        	
        	itemId: 'addMyCartAction',
        	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
            text: gm.getMC('CMD_Add_to_Cart', '카트담기'),
            disabled: true,
            handler: function(widget, event) {
                if(gm.me().checkClosed() == true) {
                    return;
                } 
            	var my_child = new Array();
            	var my_assymap_uid = new Array();
            	var my_pl_no = new Array();
            	var my_pr_quan = new Array();
            	var my_item_code = new Array();
            	var my_sales_price = new Array();
            	
            	var arrExist = [];
            	
            	var selections = gm.me().grid.getSelectionModel().getSelection();
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var unique_uid = rec.get('unique_uid');
            		var item_code = rec.get('item_code');
            		var item_name = rec.get('item_name');
            		var pl_no = rec.get('pl_no');
            		var sales_price = rec.get('sales_price');
            		
            		var bEx = gm.me().isExistMyCart(unique_uid) ;
            		console_logs('bEx', bEx)
            		if(bEx == false ) {
                		my_child.push( rec.get('unique_id'));
                		my_assymap_uid.push( unique_uid );
                		my_pl_no.push( pl_no );
                		my_pr_quan.push( rec.get('new_pr_quan'));
                		my_item_code.push( item_code);
                		my_sales_price.push(sales_price);
            		} else {
            			arrExist.push('[' +pl_no + '] \''+ item_name + '\'');
            		}
            		
            	}
            	
            	if(arrExist.length>0) {
                	Ext.MessageBox.alert('경고', arrExist[0] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');    		
            	}

            	
            	if(my_assymap_uid.length>0) {
//                	var tab = gu.getCmp("main2");
//                	tab.setLoading(true);
            		
            		gm.me().grid.setLoading(true);
                	Ext.Ajax.request({
             			url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
             			params:{
             				childs : my_child,
             				assymap_uids : my_assymap_uid,
             				pl_nos : my_pl_no,
             				pr_quans : my_pr_quan,
             				item_codes: my_item_code,
	            			sales_prices: my_sales_price
             			},
             			success : function(result, request) {   
             				gm.me().myCartStore.load(function() {
             					var tab = gm.me().center;
             					tab.setActiveTab(gm.me().gridMycart);
             					tab.setLoading(false);
             					
             					gm.me().grid.setLoading(false);
                                Ext.MessageBox.alert('알림', '카트담기 성공.', function callBack(id) {
                                    return;
                                });
             				});
             			}
               	    });    		
            	}

                	
        	}//endofhandler

        }),

        // BOM수정
        editPartAction : Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: 'Part 수정하기',
            disabled: true,
            handler: function(widget, event) {
                if(gm.me().checkClosed() == true) {
                    return;
                } 
                var uniqueId = gm.me().assymapUidbom;
                var pcr_div = gm.me().assymapPcr_div;
                var bm_quan = gm.me().assymapBmQuan;
                var hier_pos = gm.me().assyId;
                var pl_no = gm.me().assymapPlNo;

                var lineGap = 30;
                var bHeight = 250;

                var inputItem = [];
//                inputItem.push({
//                    xtype: 'textfield',
//                    name: 'hier_pos',
//                    fieldLabel: 'ID',
//                    anchor: '-5',
//                    // readOnly : true,
//                    // fieldStyle : 'background-color: #ddd;
//                    // background-image: none;',
//                    allowBlank: true,
//                    value: hier_pos,
//                    editable: true
//                });
                inputItem.push({
                    xtype: 'textfield',
                    name: 'pl_no',
                    fieldLabel: '품번',
                    anchor: '-5',
                    allowBlank: true,
                    editable: true // ,
                        ,
                    value: pl_no
                    // readOnly : false
                    // ,
                    // fieldStyle : 'background-color: #ddd;
                    // background-image: none;'
                });

                inputItem.push({
                    fieldLabel: 'BOM수량',
                    x: 5,
                    y: 0 + 3 * lineGap,
                    name: 'bm_quan',
                    // readOnly : false,
                    allowBlank: true,
                    editable: true,
                    value: bm_quan,
                    anchor: '-5' // anchor width by
                    // percentage
                });


                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('BomEditPanel'),
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
                    title: 'BOM 수정',
                    width: 400,
                    height: bHeight,
                    minWidth: 250,
                    minHeight: 180,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function() {
                            var form = gu.getCmp('BomEditPanel').getForm();
                            if (form.isValid()) {
                                var val = form.getValues(false);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
                                    params: {

                                        unique_id: uniqueId, // 유니크아이디
                                        //id: val['hier_pos'], // ID
                                        pl_no: val['pl_no'], // Level
                                        pcrDiv: val['pcr_div'], // 조달구분
                                        bmQuan: val['bm_quan'] // bmQuan

                                    },
                                    success: function(result, request) {

                                        gm.me().store.load();
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
        }),

        // PDF 파일 출력기능
        printPDFAction : Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: 'PartList 출력',
            disabled: false,
            handler: function(widget, event) {
                var ac_uid = gm.me().ac_uid;
                var assy_uid = gm.me().assy_uid;         
                console_logs('selected_tree_record', gm.me().selected_tree_record);
                console_logs('class_code', gm.me().classCode);
                console_logs('item_code', gm.me().selectedAssyCode);
                console_logs('model_no', gm.me().modelNo);
                console_logs('description', gm.me().description);
                console_logs('parent', gm.me().selectedChild);
                console_logs('parent_uid', gm.me().selectedAssyUid);
                
                console_logs('assy_uid', assy_uid);
                console_logs('ac_uid', ac_uid);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPl',
                    params: {
                    	rtgast_uid: gm.me().selectedAssyUid,
                    	parent_uid: gm.me().selectedAssyUid,
                        po_no: ac_uid,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N'
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_logs(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        }),
        
        removeAssyAction : Ext.create('Ext.Action', {
            itemId: 'removeAssyAction',
            iconCls: 'af-remove',
            text: CMD_DELETE,
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
        }),

        editAssyAction : Ext.create('Ext.Action', {
            itemId: 'editAssyAction',
            iconCls: 'af-edit',
            disabled: true,
            text: gm.getMC('CMD_MODIFY', '수정'),
            handler: function(widget, event) {

                console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

                if (gm.me().selected_tree_record == null) {
                    return;
                }
                
                if(gm.me().checkClosed() == true) {
                    return;
                } 
                
                var unique_id = gm.me().selected_tree_record.get('child');
                var assy_code = gm.me().selected_tree_record.get('assy_code');
                var assy_name = gm.me().selected_tree_record.get('assy_name');
                var unique_uid = gm.me().selected_tree_record.get('unique_uid');
                var parent = gm.me().selected_tree_record.get('parent');
                var ac_uid = gm.me().selected_tree_record.get('ac_uid');
                var pl_no = gm.me().selected_tree_record.get('pl_no');
                var bm_quan = gm.me().selected_tree_record.get('bm_quan');
                var reserved_varchar1 = gm.me().selected_tree_record.get('reserved_varchar1');
                var pclass_code = gm.me().selected_tree_record.get('pclass_code');
                var lineGap = 30;
                var bHeight = 300;
                var bWidth = 400;
                
                var area = gu.Comma2Area(reserved_varchar1);


                var inputItem = [];
                inputItem.push({
                    xtype: 'textfield',
                    name: 'unique_uid',
                    fieldLabel: 'Unique UID',
                    allowBlank: false,
                    value: unique_uid,
                    anchor: '-5',
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                });
                inputItem.push({
                    xtype: 'textfield',
                    name: 'unique_id',
                    fieldLabel: 'Child UID',
                    allowBlank: false,
                    value: unique_id,
                    anchor: '-5',
                    readOnly: true,
                    fieldStyle: 'background-color: #ddd; background-image: none;'
                });
                 inputItem.push(
                 {
	                 xtype: 'textfield',
	                 name: 'assy_code',
	                 fieldLabel: 'Assembly 코드',
	                 allowBlank:false,
	                 value: assy_code,
	                 anchor: '-5',
	                 readOnly : true,
	                 fieldStyle : 'background-color: #ddd; background-image: none;'
                 });
                inputItem.push({
                    xtype: 'textfield',
                    name: 'assy_name',
                    fieldLabel: 'Assembly 명',
                    allowBlank: false,
                    value: assy_name,
                    anchor: '-5'
                });
                inputItem.push({
                    xtype: 'textfield',
                    name: 'pl_no',
                    fieldLabel: '파트순번',
                    allowBlank: false,
                    value: pl_no,
                    anchor: '-5'
                });
                inputItem.push({
                    xtype: 'numberfield',
                    name: 'bm_quan',
                    fieldLabel: '수량',
                    allowBlank: false,
                    value: bm_quan,
                    anchor: '-5'
                });


                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('modformPanel'),
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    width: 400,
                    height: bHeight,
                    region: 'center',
                    defaults: {
                        // anchor: '100%',
                        editable: true,
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: inputItem
                });
                
                var winItems = [form];
                
//                if(pclass_code=='ACT') {
//                	bWidth = 500;
//                	winItems.push({
//                        region: 'east',
//                        //title: 'VALVE NO.',
//                        width: 200,
//                        split: true,
//                        collapsible: false,
//                        floatable: false,
//                        style: 'margin-bottom:10px;margin-top:15px;',
//                        items: {
//	                        xtype: 'textarea',
//	                        labelAlign: 'top',
//	                        emptyText: 'VALVE NO.',
//	                        //fieldLabel: 'VALVE NO.',
//	                        name : 'reserved_varchar1',
//	                        value: area,
//	                        readOnly : false,
//	                        editable:true,
//	                        
//	                        height: '100%'
//	                    }
//                	});
//                }
                
                var win = Ext.create('ModalWindow', {
                    title: 'Assembly 수정',
                    width: bWidth,
                    height: bHeight,
                    minWidth: 250,
                    minHeight: 180,
                    items: winItems,
                    buttons: [{
                        text: CMD_OK,
                        handler: function() {
                            var form = gu.getCmp('modformPanel').getForm();
                            if (form.isValid()) {
                                var val = form.getValues(false);


                                var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                                gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                                gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                                gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                                gm.me().selected_tree_record.set('text', text);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/material.do?method=updateSrcahdAssymap',
                                    params: {

                                        unique_uid: val['unique_uid'],
                                        unique_id: val['unique_id'],
                                        pl_no: val['pl_no'],
                                        bm_quan: val['bm_quan'],
                                        item_name: val['assy_name']

                                    },
                                    success: function(result, request) {

                                        // productlist.store.getProxy().setExtraParam('class_code',
                                        // gm.me().classCode);
                                        // productlist.store.load();
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
        }),

        addAssyAction : Ext.create('Ext.Action', {
            itemId: 'addAssyAction',
            iconCls: 'af-plus-circle',
            disabled: true,
            text: '추가',
            handler: function(widget, event) {

                console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

                if (gm.me().selected_tree_record == null) {
                    Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                        return
                    });
                    return;
                }
                var child = gm.me().selected_tree_record.get('child');
                var ac_uid = gm.me().selected_tree_record.get('ac_uid');
                var unique_uid = gm.me().selected_tree_record.get('unique_uid');
                var assy_name = gm.me().selected_tree_record.get('text');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno3',
                    params: {
                        ac_uid: gm.me().selectedPjUid
                    },
                    success: function(result, request) {
                        console_logs('result.responseText', result);
                        var str = result.responseText;
                        var num = Number(str);

                        if (str.length == 3) {
                            num = num;
                        } else if (str.length == 2) {
                            num = '0' + num;
                        } else if (str.length == 1) {
                            num = '00' + num;
                        } else {
                            num = num % 1000;
                        }
                        var pl_no = 'A' + num;

                        var lineGap = 30;
                        var bHeight = 300;


                        var inputItem = [];

                        inputItem.push({
                        	xtype: 'component',
                            html:  '상위 Assembly : ' + assy_name,
                            style: 'text-align:right;',
                            anchor: '-5'
                        });
                        inputItem.push({
                        	xtype: 'component',
                            html:  '<hr>',
                            anchor: '-5'
                        });
                        
//                        inputItem.push({
//                            xtype: 'displayfield',
//                            value: '먼저 등록된 자재인지 검색하세요.'
//                        });
                        inputItem.push({
                            id: gu.id('search_information_assy_add'),
                            fieldLabel: '종전자재',
                            field_id:  'search_information_assy_add',
                            allowBlank: true,
                            name: 'search_information_assy_add',
                            xtype: 'combo',
                            emptyText: 'Assembly 검색',
                            anchor: '-5',
                            store: gm.me().searchAssyStore,
                            displayField: 'specification',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            sortInfo: {
                                field: 'specification',
                                direction: 'ASC'
                            },
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: true,
                            hideTrigger: true,
                            anchor: '100%',

                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 결과가 없습니다.',
                            	
                                // Custom rendering template for each item
                                getInnerTpl: function() {
                                    return '<div><a class="search-item" href="javascript:gm.me().setBomDataAssy({id},\'{item_code}\',\'{item_name}\');">' +
                                        '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                        '</a></div>';
                                }
                            },
                            pageSize: 10
                        });

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
	                      fieldLabel: 'Assembly 코드',
	                      allowBlank: true,
	                      anchor: '-5',
	                  });
                      inputItem.push({
                          xtype: 'textfield',
                          id: gu.id('target_assy_name'),
                          name: 'assy_name',
                          fieldLabel: 'Assembly 명',
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
                          value: unique_uid
                      }));
                        
                        inputItem.push({
                            xtype: 'textfield',
                            name: 'pl_no',
                            fieldLabel: 'Assy 순번',
                            value: pl_no,
                            allowBlank: false,
                            fieldStyle: 'text-align: right;',
                            anchor: '-5'
                        });
                        inputItem.push({
                            xtype: 'numberfield',
                            name: 'bm_quan',
                            fieldLabel: '수량',
                            allowBlank: false,
                            value: 1,
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
                            title: 'Assembly 추가',
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


                                        var text = val['pl_no'] + ' <font color=#163F69>' + val['assy_name'] + '</font>';
                                        gm.me().selected_tree_record.set('assy_name', val['assy_name']);
                                        gm.me().selected_tree_record.set('pl_no', val['pl_no']);
                                        gm.me().selected_tree_record.set('bm_quan', val['bm_quan']);
                                        gm.me().selected_tree_record.set('text', text);

                                        
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/design/bom.do?method=cloudAssycreate',
                                            params: {
                                            	parent_uid: val['unique_uid'],
                                                parent: val['child'],
                                                ac_uid: val['ac_uid'],
                                                pl_no: val['pl_no'],
                                                bm_quan: val['bm_quan'],
                                                item_name: val['assy_name'],
                                                pj_code: val['pj_code'],
                                                child: val['target_child'],
                                        		

                                            },
                                            success: function(result, request) {
                                            	
                                            	gm.me().reSelect();
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
        }),
        
        // Context Popup Menu
        assyContextMenu : Ext.create('Ext.menu.Menu', {
            items: [
                this.editAssyAction,
                this.removeAssyAction,
                this.copyAssemblyAction
            ]
        }),
        searchDetailStore: Ext.create('Mplm.store.MaterialDetailSearchStore', {
        	
        }),

        searchStore : Ext.create('Mplm.store.MaterialSearchStore', {
        	
        }),
        
        searchAssyStore : Ext.create('Mplm.store.AssemblySearchStore', {myLink:'T'
        	
        }),
        
        searchStandardAssyStore : Ext.create('Mplm.store.AssemblySearchStore', {myLink:'F'
        	
        }),

        productStore : Ext.create('Mplm.store.ProductStore', {
        	
        }),
        
        commonUnitStore : Ext.create('Mplm.store.CommonUnitStore2', {
            hasNull: false
        }),
        commonCurrencyStore : Ext.create('Mplm.store.CommonCurrencyStore', {
            hasNull: false
        }),
        commonModelStore : Ext.create('Mplm.store.CommonModelStore', {
            hasNull: false
        }),
        commonDescriptionStore : Ext.create('Mplm.store.CommonDescriptionStore', {
            hasNull: false
        }),
        commonStandardStore2 : Ext.create('Mplm.store.CommonStandardStore', {
            hasNull: false
        }),
        gubunStore : Ext.create('Mplm.store.GubunStore', {
            hasNull: false
        }),

        buttonToolbar2 : Ext.create('widget.toolbar', {
        	 cls: 'my-x-toolbar-default1',
	         style:'color:white;',
	         items: [
	                {
	                    id: gu.id('target-routeTitlename'),
	                    xtype: 'component',
	                    style: 'font-weight:normal;text-align:right;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;',
	                    html: "<i>자재항목을  선택하세요.</i>",
	                },
	                '->'
	         ]
         }),
         
         
         parentRecursive: function(o) {
        	 //console_logs('parentRecursive o', o);
        	 o.set('is_closed', false);
        	 var id = o.get('unique_uid');
             //console_logs('id', id);
             
                 gm.editAjax(
                         "assymap",
                         "is_closed",
                         "N",
                         "unique_id",
                         id
                     );            	 

             
             var parentNode = o['parentNode'];
             if(parentNode!=null) {
               this.parentRecursive(parentNode);
             }
             
         },
         
         eachRecursive: function(o, checked) {
        	 //console_logs('eachRecursive o', o);
        	 o.set('is_closed', checked);
        	 
        	 var id = o.get('id');
             //console_logs('id', id);
             
             gm.editAjax(
                 "assymap",
                 "is_closed",
                 checked?"Y":"N",
                 "unique_id",
                 id
             );
             
             this.timerRefresh(o.get('assy_name'), checked, o);
             
             //console_logs('recCount', this.recCount);
             
             var childNodes = o['childNodes'];
             if(childNodes!=null) {
                 for(var i=0; i<childNodes.length; i++) {
                	 this.eachRecursive(childNodes[i], checked);
                 }            	 
             }
             
         },
         
         timerRefresh: function(assy_name, checked, o) {
        	 console_logs('timerRefresh', checked);
             gUtil.timer(function() {
            	 console_logs('gm.me().recCount', gm.me().recCount);
            	 //gm.me().srchTreeHandler(gm.me().assyGrid, gm.me().cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
            	 if(gm.me().recCount>0) {
                	 console_logs('recCount', gm.me().recCount);
            		 gm.me().timerRefresh();
            	 } else {
            		 gm.me().togToast = true;
            		 gm.me().showToast('결과', '[' + assy_name+ '] Assy가 ' + (checked?'<완료>':'<진행중>') + ' 처리 되었습니다.');
            		 
            		 console_logs('o', o);
            	 }
             }, 1000);
         },
         
         checkTreeNode: function (obj, rowIndex, checked) {
        	 this.togToast = false;
        	 this.recCount = 0;
             if(obj!=null) {
            	 var o = obj.up('grid').getStore().getAt(rowIndex);
            	 this.eachRecursive(o, checked);
            	 if(checked==false) {
            		 var parentNode = o['parentNode'];
            		 if(parentNode!=null)
            		 this.parentRecursive(parentNode);
            	 }
                 //markDirty 체크
                 obj.up('grid').getStore().sync();
             }
        	 
         },

         deleteAssyConfirm: function (result){
             if(gm.me().checkClosed() == true) {
                 return;
             } 
            if(result=='yes') {
            	if(gm.me().selected_tree_record==null) {
        			Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
        			return;
            	} else {
    		    	var name = gm.me().selected_tree_record.data.text;
    		    	var id = gm.me().selected_tree_record.data.id;
    		    	var depth = gm.me().selected_tree_record.data.depth;
    		    	
    		    	if(depth<2) {
    	    			Ext.MessageBox.alert('선택 확인', '최상위 Assy는 삭제할 수 없습니다.');
    	    			return;
    		    	} else {
    		    		
    		    		console_logs('target id', id);
    		    		Ext.Ajax.request({
    		     			url: CONTEXT_PATH + '/design/bom.do?method=getChildQuan',
    		     			params:{
    		     				parent : id
    		     			},
    		     			success : function(result, request) {   
    		     				console_logs('result', result);
    	        				var jsonData = Ext.decode(result.responseText);
    	        				console_logs('jsonData', jsonData);
    	        				var quan = jsonData['result'];
    	        				if(quan>0) {
    	        					Ext.MessageBox.alert('오류', '하위 Assy 또는 BOM이 존재하여 삭제할 수 없습니다.');
    	        				} else {
    	        					var unique_uid = gm.me().selected_tree_record.data.unique_uid;
    	        					
    	        		    		Ext.Ajax.request({
    	        		     			url: CONTEXT_PATH + '/design/bom.do?method=deleteAssy',
    	        		     			params:{
    	        		     				assymap_uid : unique_uid
    	        		     			},
    	        		     			success : function(result, request) {   
    	        		     				console_logs('result', result);
    	        	        				var jsonData = Ext.decode(result.responseText);
    	        	        				console_logs('jsonData', jsonData);
    		                           		gm.me().reSelect();
    	        		     			}
    	        		       	    });
    	        				}
    		     			}
    		       	    });
    		    	}
            	}
            }
    },
    valve_nos: [],
    addValve_no: function (s) {
    	//console_logs('addValve_no s', s);
    	this.valve_nos.push(s);
    	this.valve_nos = gu.sortedSet(this.valve_nos);
    	//console_logs('addValve_no', this.valve_nos);
    },
    partlineStore : Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),
    
    valveNoStore : Ext.create('Mplm.store.PartLineGeneralStore', {
        hasNull: false
    }),
    
    getVvPromptMsg : function(curArr, assy_name, addArr, canSave) {
    	var allArr = this.valve_nos;
        var msg = '등록 VALVE NO.:<br><div style="background-color:#EFFDDE ;border:0px solid #EAEAEA;width: 200; height: 80; word-wrap: break-word; white-space:normal; overflow-x:hidden; overflow-y: hidden;">';
        var b1 = false;
        var target = '';
        for(var k=0; k<allArr.length; k++) {
        	var s = allArr[k];
        	if(curArr.indexOf(s)<0) {
        		var b = false;
        		
        		for(var j=0; j<addArr.length; j++) {
        			if(s==addArr[j]) {
        				b = true;
        				target = s;
        			}
        		}
        		
        		if(b==false) {
        			msg = msg + '<label style="margin:3px;">' + s + '</label>';
        		} else {
        			msg = msg + '<label style="margin:3px;color:red;">' + s + '</label>';
        			b1 = true;
        			canSave[0] = false;
        		}
            	
        	}
        }
        
        if(b1==true) {
        	//console_logs('addArr', addArr);
			//addArr = gu.arrRemove(addArr, target);
        	msg = msg + '</div>이미 사용된 Valve No가 입력되었습니다.';
        	//console_logs('addArr', addArr);
        } else {
        	//msg = msg + '</div><hr style="border-top: dashed 1px;">';
        }
        
        msg = msg + '</div><hr style="border-top: dashed 1px;">' + assy_name;
        
        return msg;
    },

    //Valve No 생산요청
    requestValve: function() {
		var rec = gm.me().selected_tree_record;
		var unique_uid = rec.get('unique_uid');
		var unique_id = rec.get('child');
		var ac_uid = rec.get('ac_uid');

		gm.me().showToast('결과', 'Valve 생산요청 중입니다.');
		
    	Ext.Ajax.request({
    		
    		url : CONTEXT_PATH + '/index/process.do?method=addRequestValveSkana',
			params:{
				assymapUid: unique_uid,
				parent: unique_id,
				ac_uid: ac_uid
			},
			
			success : function(result, request) { 
				try {
					gm.me().selectedVv.set('status', 'CR');					
				} catch(e){}

				gm.me().showToast('결과', '생산요청이 성공하였습니다.');
				//Ext.Msg.alert('안내', '요청하었습니다.', function() {});
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
    },
    
    clearSearchStore : function() {
    	var store = gm.me().searchDetailStore;
    	
    	store.getProxy().setExtraParam('start', 0);
    	store.getProxy().setExtraParam('page', 1);
    	store.getProxy().setExtraParam('limit', 100);
    	
    	store.getProxy().setExtraParam('item_code', '');
    	store.getProxy().setExtraParam('item_name', '');
    	store.getProxy().setExtraParam('specification', '');
    	store.getProxy().setExtraParam('model_no', '');
    },
    
    stateCodeStore : Ext.create('Rfx.store.GeneralCodeStore', {hasNull:false, parentCode: 'SRO1_CLD_STATE'} ),
    redrawSearchStore : function() {
    	
    	this.clearSearchStore();
    	
    	var store = gm.me().searchDetailStore;
    	
    	var item_code = gu.getValue('search_item_code');
    	var item_name = gu.getValue('search_item_name');
    	var specification = gu.getValue('search_specification');
    	var model_no = gu.getValue('search_model_no');
    	
		//var field_id = fieldObj['field_id'];
		console_logs('item_code', item_code);
		console_logs('item_name', item_name);
		console_logs('specification', specification);
		console_logs('model_no', model_no);
		
		var bIn = false;
		if(item_code.length>0) {
			store.getProxy().setExtraParam('item_code', item_code);
			bIn = true;
		}
		
		if(item_name.length>0) {
			store.getProxy().setExtraParam('item_name', item_name);
			bIn = true;
		}
		
		if(specification.length>0) {
			store.getProxy().setExtraParam('specification', specification);
			bIn = true;
		}
		
		if(model_no.length>0) {
			store.getProxy().setExtraParam('model_no', model_no);
			bIn = true;
		}
		
		if(bIn == true) {
			store.load();
		} else {
			store.removeAll();
		}
		
		
		
    },
    
    checkClosed: function() {
    	var is_closed = false;
    	
    	try {
    		is_closed = gm.me().selected_tree_record.get('is_closed');
    	
    	} catch (e) {}
        
        
        if(is_closed == true) {
            Ext.MessageBox.alert('알림', '이미 완료처리 되었습니다.');
        }
        return is_closed;
    },
    
    refreshValve : function() {
    	
		gm.me().valveNoStore.getProxy().setExtraParam('parent_uid', -1);
	    gm.me().valveNoStore.getProxy().setExtraParam('orderBy', "specification");
	    gm.me().valveNoStore.getProxy().setExtraParam('ascDesc', "ASC");
	    gm.me().valveNoStore.getProxy().setExtraParam('ac_uid', gm.me().ac_uid);
	    gm.me().valveNoStore.getProxy().setExtraParam('valve_no', false);
	    gm.me().valveNoStore.load(function(records){
	        var o = gu.getCmp('valve_quan');
	        if (o != null) {
	        	
	        	o.update( '총수량: ' + records.length);
	        }
	    });

    }
});