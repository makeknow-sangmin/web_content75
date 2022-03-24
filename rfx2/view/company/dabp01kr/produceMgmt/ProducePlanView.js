Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.ProducePlanView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produceplan-view',
    initComponent: function(){

       	// 검색툴바 필드 초기화
    	this.initSearchField();
    	// 검색툴바 추가
    	this.defOnlyCreate = true;
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); // Hidden
																			// Value임.
    	
		this.addSearchField (
				{
						field_id: 'pm_name'
						,store: "UserDeptStoreOnly"
	    			    ,displayField:   'user_name'
	    			    ,valueField:   'user_name'
						,innerTpl	: '<div data-qtip="{unique_id}">[{dept_name}] {user_name}</div>'
						,params:{dept_code: '02'}
							
				});	
		this.addSearchField ('item_name');	
		this.addSearchField('wa_name');
		this.addSearchField('pj_code');
		
		
		this.addCallback('CHECK_BLADE_SIZE', function(o, cur, prev){
			console_logs('CHECK_BLADE_SIZE cur', cur);
			gMain.selPanel.refreshBladeInfo();
			gMain.selPanel.refreshBladeInfoAll();
		});
        // Widget 추가
		    this.addFormWidget('reserved_varcharc', {
        	tabTitle:"수주정보", 
            xtype: 'displayfield',
            text: '칼날요약',
            name: 'blade_size_info',
            value: '칼 000 * 000 1EA',
            fieldStyle: 'background-image: none; color:red; padding: 1px',
            // margins: '0 0 0 10',
            canCreate:   true,
            canEdit:     true,
            canView:     true,
            position: 'center'
        });        
// this.addFormWidget(0, {
// tabTitle:"구매요청",
// name: 'blade_size_info1',
// xtype: 'displayfield',
// text: '',
// emptyText: '칼날Size',
// fieldStyle: 'background-color: #FBF8E6; background-image: none;
// padding:1px;',
// value: '<font color="#EAEAEA;">칼 000 * 000 1EA</font>',
// //margins: '0 0 0 10',
// canCreate: true,
// canEdit: true,
// canView: true,
// position: 'center'
// });
        
		// 검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1) {
            	buttonToolbar.items.remove(item);        		
        	}

        });      
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==2) {
            	buttonToolbar.items.remove(item);        		
        	}

        });
        
        // 콘솔 로그
        // console_logs('this.fields', this.fields);
        // 모델 정의
        this.createStore('Rfx.model.ProducePlan', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/* pageSize */
        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	// Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'a.creator',
        	unique_id: 'a.unique_id'
        }
    	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['cartmap']
        );
        

        
		var formItems = [{
            xtype: 'fieldset',
            title: '단가정보',
            collapsible: false,
            width: '100%',
            style: 'padding:10px',
            defaults: {
                width: '100%',
                layout: {
                    type: 'hbox'
                }
            },
            items: [
            	{
                    fieldLabel: '수주금액',
                    name:'selling_price',
                    id:'selling_price1',
                    xtype: 'numberfield',
                    fieldStyle: 'background-color: #FFFF99; background-image: none;',
                    value: 0,
                    editable: false,
                    listeners : {
//                    	change: function(field, value) {
//                    		sales_price1 = Ext.getCmp('source_price').getValue();
//							var sales_price	= gm.me().getInputJust('partline|source_price');
//							sales_price.setValue(sales_price1);
//                        }
                    }
                },{
                    fieldLabel: '제품단가',
                    name:'sales_price',
                    id:'sales_price1',
                    xtype: 'numberfield',
                    fieldStyle: 'background-color: white; background-image: none;',
                    value: 0,
                    listeners : {
                    	change: function(field, value) {
                    		sales_price1 = Ext.getCmp('sales_price1').getValue();
							var sales_price	= gm.me().getInputJust('partline|sales_price');
							sales_price.setValue(sales_price1);
                      	  
                        }
                    }
                },
                {
                    fieldLabel: '개발비총합',
                    name:'reserved_double1',
                    id:'dev_total_cost1',
                    xtype: 'numberfield',
                    fieldStyle: 'background-color: #FFFF99; background-image: none;',
                    value: 0,
                    editable: false,
                    listeners : {
                    	change: function(field, value) {
                    		reserved_double11 = Ext.getCmp('dev_total_cost1').getValue();
							var reserved_double1	= gm.me().getInputJust('project|reserved_double1');
							reserved_double1.setValue(reserved_double11);
                      	  
                        }
                    }
                },
                
                {
					 items: [
						 {
			                    fieldLabel: '물류비',//  project reserved_double2->reserved_varchar6
			                    name:'reserved_varchar6',
			                    id:'reserved_varchar61',
			                    xtype: 'textfield',
//			                    fieldStyle: 'background-color: white; background-image: none;',
//			                    value: 0,
			                    listeners : {
			                    	change: function(field, value) {
			                    		reserved_double22 = Ext.getCmp('reserved_varchar61').getValue();
										var reserved_double2	= gm.me().getInputJust('project|reserved_varchar6');
										reserved_double2.setValue(reserved_double22);
			                      	  
			                        }
			                    }
			                },{
			                    fieldLabel: '물류비포함여부',
			                    name:'reserved_varchar7',
			                    id:'reserved_varchar71',
			                    xtype: 'combo',
			                    store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'CONTAIN_FLAG'}),
			                    displayField:   'codeName',
						        valueField:     'systemCode',
						        value: 'N',
//			                    fieldStyle: 'background-color: white; background-image: none;',
			                    listeners : {
			                    	change: function(field, value) {
			                    		reserved_varchar77 = Ext.getCmp('reserved_varchar71').getValue();
										var reserved_varchar7	= gm.me().getInputJust('project|reserved_varchar7');
										console_logs('reserved_varchar7', reserved_varchar71)
										reserved_varchar7.setValue(reserved_varchar77);
			                      	  
			                        }
			                    }
			                }
					  ]
				}
                ,{
                    fieldLabel: '물류비 메모',
                    name:'reserved_varchar5',
                    id:'reserved_varchar51',
                    xtype: 'textarea',
                    fieldStyle: 'background-color: white; background-image: none;',
//                    value: 0,
                    listeners : {
                    	change: function(field, value) {
                    		reserved_varchar55 = Ext.getCmp('reserved_varchar51').getValue();
							var reserved_varchar5	= gm.me().getInputJust('project|reserved_varchar5');
							reserved_varchar5.setValue(reserved_varchar55);
                      	  
                        }
                    }
                }
            ]
        }];
		//단가관리
		gm.extFieldColumnStore.load({
			params : {
				menuCode : 'SRO1_CST'
			},
			callback : function(records, operation, success) {
				if (success == true) {
					var o = gm.parseGridRecord(records, 'poducePlanGrid');
					var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
					// 소팅기준
					var sortBy = o['sortBy'];
					var tabPanel = Ext.getCmp(gm.geTabPanelId());
					var checkbox = true;
					
					Ext.each(
							columns,
							function(o, index) {
								o['sortable'] = false;

								switch (o['dataIndex']) {
//								case 'cost_type':
//									o['editor'] = {
//										allowBlank : false
//									};
//									break;
								case 'cost':
									o['style'] = 'text-align:right';
									o['align'] = 'right';
									o['editor'] = {
										xtype : 'numberfield',
										allowBlank : false,
										minValue : 0
									};
									break;
								case 'comment1':
								case 'tex_flag':
									o['editor'] = {
										allowBlank : true,
										xtype : 'combo',
										store: Ext.create('Mplm.store.CommonCodeStore',{parentCode:'CONTAIN_FLAG'}),
					                    displayField:   'codeName',
								        valueField:     'systemCode'
									};
								}
							});
					
					var cellEditing = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					
					var grid = Ext.create('Ext.grid.Panel',{
								id : 'costGrid',
								store : gm.me().CostStore,
								title : '단가관리',
								border : true,
								resizable : true,
								scroll : false,
								multiSelect : true,
								collapsible : false,
								layout : 'fit',
								// forceFit: true,
								region : 'center',
								plugins : [ cellEditing ],
								 
					            dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            cls: 'my-x-toolbar-default3',
					            items: [
					            	'-',
				 	   		    	saveCostMap
					      				
				  				     ]
						        },{
						            dock: 'top',
						            xtype: 'toolbar',
						            cls: 'my-x-toolbar-default3',
						            items: formItems
							        }],
							    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{}): null,
								listeners : {
									itemdblclick : function(view,
											record, htmlItem,
											index, eventObject,
											opts) {

									}, // endof itemdblclick
									cellkeydown : function(
											gridPcsStd, td,
											cellIndex, record, tr,
											rowIndex, e, eOpts) {
										// console_logs('record',
										// record);
//										if (e.getKey() == Ext.EventObject.ENTER
//												&& record.get('pcs_name').length > 0
//												&& record.get('std_mh') >= 0) {
//											savePcsStd();
//
//										}

									}
								},// endof listeners
								columns : columns
							});
					
			if (checkbox == true) {
				grid.getSelectionModel().on({

				});

			}
			
//	        var costTab = Ext.widget('tabpanel', {
//	            layout: 'border',
//	            title: '단가관리',
//	            border: false,
//	            tabPosition: 'top',
//	            layoutConfig: {
//	                columns: 2,
//	                rows: 1
//	            }, 
//	            items: grid
//	        });
			
			
			
			tabPanel.add(grid);
					
					
				} else {// endof if(success..
					Ext.MessageBox.show({
						title : '연결 종료',
						msg : '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
						buttons : Ext.MessageBox.OK,
						// animateTarget: btn,
						scope : this,
						icon : Ext.MessageBox['ERROR'],
						fn : function() {

						}
					});
				}
			},
			scope : this
		});
		
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            // console_logs('tabpanel newTab', newTab);
            // console_logs('tabpanel newTab newTab.title', newTab.title);

            switch(newTab.title) {
//            case '구매요청':
//            	console_logs('tab selected', newTab.title);
//            	
//            	gMain.selPanel.refreshBladeInfoAll();
//                break;
            case '공정설계':
            	gMain.selPanel.refreshProcess();
            	break;
            case '단가관리':
	        	
	        	
	        	var selling_price	= gm.me().getInputJust('project|selling_price');//수주금액
	        	var sales_price	= gm.me().getInputJust('partline|sales_price');//제품단가
	        	var reserved_double1	= gm.me().getInputJust('project|reserved_double1');//개발비 합계
				var reserved_varchar6e	= gm.me().getInputJust('project|reserved_varchar6');//물류비
				var reserved_varchar7e	= gm.me().getInputJust('project|reserved_varchar7');//물류비 포함
				var reserved_varchar5e	= gm.me().getInputJust('project|reserved_varchar5');//물류비메모
				
				
				var selling_price1 = Ext.getCmp('selling_price1');  //수주금액
				var sales_price1 = Ext.getCmp('sales_price1'); //제품단가
				var total_cost1 = Ext.getCmp('dev_total_cost1'); //개발비합계
				var reserved_varchar61 = Ext.getCmp('reserved_varchar61');//물류비
				var reserved_varchar71 = Ext.getCmp('reserved_varchar71');//물류비 포함
				var reserved_varchar51 = Ext.getCmp('reserved_varchar51');//물류비메모
				
				selling_price1.setValue(selling_price.getValue());
				sales_price1.setValue(sales_price.getValue());
				total_cost1.setValue(reserved_double1.getValue());
				reserved_varchar61.setValue(reserved_varchar6e.getValue());
				reserved_varchar71.setValue(reserved_varchar7e.getValue());
				reserved_varchar51.setValue(reserved_varchar5e.getValue());

	        	break;
            case '구매규격':
	            
 	   		    gMain.selPanel.refreshPrchInfoAR();
	        	break;
            }
            
        };
        // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        
// this.setRowClass(function(record, index) {
//        	
// console_logs('record', record);
// var c = record.get('status');
// //console_logs('c', c);
// switch(c) {
// case 'CR':
// return 'yellow-row';
// break;
// case 'PO':
// return 'orange-row';
// break;
// case 'GR':
// return 'green-row';
// break;
// case 'DE':
// return 'red-row';
// break;
// default:
// }
//
// } );
        
        // grid 생성.
        this.createGrid(arr, function(){});
        
        this.removeAction.setText('반려');
        // Action Button 이름 변경.
        // this.editAction.setText('계획수립');
       // 
        // this.setEditPanelTitle('계획수립');
        
        // 계획확정 Action 생성
        this.addProcessPlan = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '계획확정',
			 tooltip: '생산계획 확정',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '생산계획을 확정하시겠겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.addProcessPlanFc();
	            	        	gMain.selPanel.StoreLoadRecordSet();
	            	        }
			            },
			            // animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        // 재생산지시 Action 생성
        this.reProduceAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '재생산 지시',
			 tooltip: '구매요청과 동시에 재생산 지시',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '구매요청과 동시에 작업 지시를 실행 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	// gMain.selPanel.doWorkOrder();
	            	        }
			            },
			            // animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
		var calQuan = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '구매수량계산',
			 tooltip: '구매수량 계산하기',
			 handler: function() {
				 	gm.me().prchCalQuan();
			 }
			});
		
		var saveAssymap = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '구매내용저장',
			 tooltip: '구매 내용 저장',
			 // toggleGroup: 'toolbarcmd',
			 handler:  function() {
				 	gm.me().saveAssymapHandlerMulti();
			 }
			});
		
		
			var addPartRowAction = Ext.create('Ext.Action',{
				iconCls : 'af-plus-circle',
				text : '추가',
				disabled : true,
				handler : function() {
	//				var recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid');
					var recvPoAssyGrid = gMain.selPanel.recvPoPartGrid;
					var mainGrid = gm.me().grid;
	
					var main_rec = mainGrid.getSelectionModel().getSelection()[0];
					if(recvPoAssyGrid == null || recvPoAssyGrid == undefined) {
						recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid1');
					}
					var selections =  recvPoAssyGrid.getSelectionModel().getSelection();
					var parent_uid = 200;
	
					try {
						parent_uid = main_rec.get('unique_uid');
					} catch (error) {
						parent_uid = 200;
					}
					
					var unique_uid = -1;
					
					if(selections==null || selections.length==0) {
						unique_uid = 200;
					} else {
						var rec = selections[0];
						 unique_uid = rec.get('unique_uid');
						
					}
					
					//console_logs('recvPoAssyGrid rec', rec);
					
					//console_logs('unique_uid', unique_uid);
					
					// console_logs('rec', rec);
					console_logs('>>>>> sssss 111', gm.me().AssemblyPartStore);
					Ext.Ajax.request({
						url : CONTEXT_PATH
								+ '/index/process.do?method=copyPartLineRow',
						params : {
							assymapUid : unique_uid,
							parent_uid:parent_uid
						},
						success : function(
								result,
								request) {
	
							gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
							gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
							gm.me().AssemblyPartStore.getProxy().setExtraParam('groupBy', 'a.unique_id');
							gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code_list', 'R,O,K');
							// gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code', 'R');
							
							console_logs('>>>>> sssss', gm.me().AssemblyPartStore);
							gm.me().AssemblyPartStore.load();
						},
						failure : extjsUtil.failureMessage
					});
				}
			});
			
			var removePartRowAction = Ext.create('Ext.Action',{
				iconCls : 'af-remove',
				text : '삭제',
				disabled : true,
				handler : function() {
					var recvPoAssyGrid = Ext.getCmp('recvPoAssyGrid1');
					// var recvPoAssyGrid = gMain.selPanel.recvPoPartGrid;
					var rec = recvPoAssyGrid.getSelectionModel().getSelection()[0];
					console_logs('>>>>>>>>>>>>>>>>>>>>rec',rec);
					var unique_uid = rec.get('unique_uid');
					var sp_code = rec.get('sp_code');
					var ac_uid = rec.get('ac_uid');
					console_logs('>>>>>>>>>>>>>>>>>>>>sp_code',sp_code);
					console_logs('>>>>>>>>>>>>>>>>>>>>ac_uid',ac_uid);
					if(unique_uid==undefined && unique_uid==null) { //값이없으면 -> 신규등록
						gm.extFieldColumnStore.remove(rec);
					} else { //수정.
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/index/process.do?method=deleteItem',
							// url: CONTEXT_PATH + '/index/generalData.do?method=delete',
							params: {
								unique_uid:unique_uid,
								sp_code:sp_code,
								pj_uid:ac_uid
							},
							method: 'POST',
							success: function(rec) {
								//console_logs('load>>>>>>>>>>>>>>>>>>>');
	//	                    	gm.extFieldColumnStore.remove(rec);
								
								gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
								gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
								gm.me().AssemblyPartStore.getProxy().setExtraParam('groupBy', 'a.unique_id');
								gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code_list', 'R,O,K');
								// gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code', 'R');
								gm.me().AssemblyPartStore.load();
								
								// gm.me().AssemblyPartStore2.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
								// gm.me().AssemblyPartStore2.getProxy().setExtraParam('orderBy', 'pl_no');
								// gm.me().AssemblyPartStore2.getProxy().setExtraParam('sp_code', 'O');
								// gm.me().AssemblyPartStore2.load();
								
								// gm.me().AssemblyPartStore3.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
								// gm.me().AssemblyPartStore3.getProxy().setExtraParam('orderBy', 'pl_no');
								// gm.me().AssemblyPartStore3.getProxy().setExtraParam('sp_code', 'K');
								// gm.me().AssemblyPartStore3.load();
								//console_logs('fisish>>>>>>>>>>>>>>>>>>>');
							},
							failure: function(rec, op) {
								Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});
	
							}
						});
					}
					
	
				}
			});
		var purColStore = Ext.create(
			'Rfx.store.ExtFieldColumnStore', {
				fields : [ {
					name : 'name'
				} ]
			});

		// 구매내역
		purColStore.load({
			params : {
				menuCode : 'SRO1_PUR'
			},
			callback : function(records, operation, success) {
				// console_logs('>>>>records', records);
				if (success == true) {
					var o = gm.parseGridRecord(records, 'recvPoAssyGrid');
					console_logs('>>>> oo', o);
					var fields = o['fields'], /*columns = o['columns'],*/ tooltips = o['tooltips'];
					var columns = [];
					for(var i=0; i<o['columns'].length; i++) {
						var c = o['columns'][i];
						var dataIndex = c['dataIndex'];
						if(dataIndex == 'sp_code') {
							c['width'] = 100;
						}
						columns.push({
							text:c['text'],
							dataIndex:c['dataIndex'],
							style:c['style'],
							width: c['width']
						})
					}
					console_logs('>>>> oo columns', columns);
					// 소팅기준
					var sortBy = o['sortBy'];
					var tabPanel = Ext.getCmp(gm.geTabPanelId());
					var checkbox = true;

					Ext.each(
						columns,
						function(o, index) {
							o['sortable'] = true;

							switch (o['dataIndex']) {
							case 'serial_no':
							case 'pl_no':
								o['editor'] = {
									allowBlank : false
								};
								break;
							case 'bm_quan':
								o['style'] = 'text-align:right';
								o['align'] = 'right';
								o['editor'] = {
									allowBlank : false,
									xtype : 'numberfield',
									minValue : 0
								};
								break;
							case 'sp_code':
									o['renderer'] = function(value) {
										switch(value) {
											case 'R':
											return '원지';
											case 'O':
											return '원단';
											case 'K':
											return '부자재';
											default:
											return value;
										}
									}
									o['editor'] = {
										xtype: 'combo',
										typeAhead : true,
										triggerAction : 'all',
										store : gm.me().standardFlagStore,
										displayField : 'code_name_kr',
										valueField : 'system_code',
										listConfig : {
											getInnerTpl : function() {
												return '<div data-qtip="{system_code}">{code_name_kr}</div>';
											}
										},
									}
								break;
							case 'description_src':
							case 'remark_src':
							case 'comment':
							case 'item_name':
							case 'specification':
								o['editor'] = {
//										allowBlank : true
								};
							}
						});
					
					var cellEditing = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					
					// var cellEditing2 = new Ext.grid.plugin.CellEditing({
					// 	clicksToEdit : 1
					// });
					// var cellEditing3 = new Ext.grid.plugin.CellEditing({
					// 	clicksToEdit : 1
					// });

					var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
						// groupField: 'sp_code_kr',
						groupHeaderTpl: '<div><font color=#003471><b>' +
						'{[values.rows[0].data.sp_code == "R" ? "원지" :' + 
						'values.rows[0].data.sp_code == "O" ? "원단" :' + 
						'values.rows[0].data.sp_code == "K" ? "부자재" : values.rows[0].data.sp_code]} </b></font></div>',
					});

					console_logs('---->  AssemblyPartStore', gm.me().AssemblyPartStore);
					console_logs('---->  groupingFeature', groupingFeature);
					
					var grid = Ext.create('Ext.grid.Panel',{
								id : 'recvPoAssyGrid1',
								store : gm.me().AssemblyPartStore,
								title : '정보',
								border : true,
								resizable : true,
								scroll : true,
								multiSelect : false,
								collapsible : false,
								// layout : 'fit',
								// forceFit: true,
								features: [groupingFeature],
								region : 'center',
								// plugins : [ cellEditing ],
								dockedItems: [
							        {
							            dock: 'top',
							            xtype: 'toolbar',
							            cls: 'my-x-toolbar-default3',
							            items: [
											addPartRowAction, removePartRowAction
							                    // '-',
							 	   		    	// saveAssymap, textAction,
							                    // '->',
//							                    calQuan,
							                    // '-'
					      				        ]
								        },
								        // {
										// 	dock : 'top',
										// 	xtype : 'toolbar',
										// 	cls : 'my-x-toolbar-default3',
										// 	items : [ '-', addPartRowAction, removePartRowAction ]
										// }
							        ],
							    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{mode:'single'}): null,
								listeners : {
									itemdblclick : function(view,
											record, htmlItem,
											index, eventObject,
											opts) {
										gm.me().changePurSpec(record);
									}, // endof itemdblclick
									cellkeydown : function(
											gridPcsStd, td,
											cellIndex, record, tr,
											rowIndex, e, eOpts) {
										// console_logs('record',
										// record);
										// if (e.getKey() == Ext.EventObject.ENTER) {
											

										// }

									}
								},// endof listeners
								columns : columns,
								
							});
					
					grid.on('edit', function(grid, data) {
						// console_logs('>>> data', data);
						// var field = data['field'];
						// if(field == 'sp_code') {
						// 	var rec = Ext.getCmp('recvPoAssyGrid1').getSelectionModel().getSelection()[0];
						// 	var value = data['value'];
						// 	var value_name = '';
						// 	switch(value) {
						// 		case 'R':
						// 		value_name = '원지';
						// 		break;
						// 		case 'O':
						// 		value_name = '원단';
						// 		break;
						// 		case 'K':
						// 		value_name = '부자재';
						// 		break;
						// 	}
						// 	rec.set('sp_code', value);
						// 	rec.set('sp_code_name', value_name);
						// }
						var rec = gm.me().AssemblyPartStore.data.items[0];
		    			//console_logs('tUtil.delListStore rec',rec);
		    			
		    			gMain.selPanel.rItemSpec=rec.get('item_name')+rec.get('description_src')+" "+rec.get('specification')+" "+ rec.get('bm_quan')+"EA";
						gm.me().refreshPrchInfoAR();
					})
					
			if (checkbox == true) {
				grid.getSelectionModel().on({
					selectionchange: function(sm, selections) {
						if(selections.length > 0) {
							console_logs('>> 구매규격 선택', selections);
							addPartRowAction.enable();
							removePartRowAction.enable();
						} else {
							addPartRowAction.disable();
							removePartRowAction.disable();
						}
					}
					
				});

			}
			
// 			var grid2 = Ext.create('Ext.grid.Panel',{
// 				id : 'recvPoAssyGrid2',
// 				store : gm.me().AssemblyPartStore2,
// 				title : '원단',
// 				border : true,
// 				resizable : true,
// 				scroll : false,
// 				multiSelect : true,
// 				collapsible : false,
// 				layout : 'fit',
// 				// forceFit: true,
// 				region : 'center',
// 				plugins : [ cellEditing2 ],
// 				dockedItems: [
// 			        {
// 			            dock: 'top',
// 			            xtype: 'toolbar',
// 			            cls: 'my-x-toolbar-default3',
// 			            items: [
// 			                    '-',
// 			 	   		    	saveAssymap,
// 			                    '->',
// //			                    calQuan,
// 			                    '-'
// 	      				        ]
// 				        },
// 				        {
// 							dock : 'top',
// 							xtype : 'toolbar',
// 							cls : 'my-x-toolbar-default3',
// 							items : [ '-', addPartRowAction, removePartRowAction ]
// 						}
// 			        ],
// 			    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{}): null,
// 				listeners : {
// 					itemdblclick : function(view,
// 							record, htmlItem,
// 							index, eventObject,
// 							opts) {

// 					}, // endof itemdblclick
// 					cellkeydown : function(
// 							gridPcsStd, td,
// 							cellIndex, record, tr,
// 							rowIndex, e, eOpts) {
// 						// console_logs('record',
// 						// record);
// 						// if (e.getKey() == Ext.EventObject.ENTER) {


// 						// }

// 					}
// 				},// endof listeners
// 				columns : columns
// 			});
	
// 			if (checkbox == true) {
// 			grid2.getSelectionModel().on({
// 			});
			
// 			}
			
// 			var grid3 = Ext.create('Ext.grid.Panel',{
// 				id : 'recvPoAssyGrid3',
// 				store : gm.me().AssemblyPartStore3,
// 				title : '부자재',
// 				border : true,
// 				resizable : true,
// 				scroll : false,
// 				multiSelect : true,
// 				collapsible : false,
// 				layout : 'fit',
// 				// forceFit: true,
// 				region : 'center',
// 				plugins : [ cellEditing3 ],
// 				dockedItems: [
// 			        {
// 			            dock: 'top',
// 			            xtype: 'toolbar',
// 			            cls: 'my-x-toolbar-default3',
// 			            items: [
// 			                    '-',
// 			 	   		    	saveAssymap,
// 			                    '->',
// //			                    calQuan,
// 			                    '-'
// 							        ]
// 				        },
// 				        {
// 							dock : 'top',
// 							xtype : 'toolbar',
// 							cls : 'my-x-toolbar-default3',
// 							items : [ '-', addPartRowAction, removePartRowAction ]
// 						}
// 			        ],
// 			    selModel : checkbox ? Ext.create("Ext.selection.CheckboxModel",{}): null,
// 				listeners : {
// 					itemdblclick : function(view,
// 							record, htmlItem,
// 							index, eventObject,
// 							opts) {
			
// 					}, // endof itemdblclick
// 					cellkeydown : function(
// 							gridPcsStd, td,
// 							cellIndex, record, tr,
// 							rowIndex, e, eOpts) {
// 						// console_logs('record',
// 						// record);
// 						if (e.getKey() == Ext.EventObject.ENTER) {
			
// 						}
			
// 					}
// 				},// endof listeners
// 				columns : columns
// 			});

			// if (checkbox == true) {
			// 	grid3.getSelectionModel().on({
			// 		selectionchange: function(sm, selections) {
			// 			if(selections) {
			// 				console_logs('>>>>grid3', selections);
			// 			} else {

			// 			}
			// 		}
			// 	});
			
			// }
			
			
			
	        var matTab = Ext.widget('tabpanel', {
	            layout: 'border',
	            title: '구매규격',
				border: false,
	            tabPosition: 'top',
	            layoutConfig: {
	                columns: 2,
	                rows: 1
	            }, 
	            dockedItems: [{
	            dock: 'top',
	            xtype: 'toolbar',
	            cls: 'my-x-toolbar-default4',
	            items: [
	 	   		        {
	                    	id: this.link + '-'+ 'grid-top-pqty'+'2',
	 	   		        	xtype:'tbtext',
	 	   		        	text:'칼 000 * 000 1EA/제품명/생산수량 : 0'
	 	   		        },{
						  id: this.link + '-'+ 'grid-top-item_spec',
		   		        	  xtype:'tbtext',
		   		        	  text:'[원지정보]'
		   		        }
	 	   		  
	 	   	    	
  				     ]
		        }],
	            items: [grid/*,grid2,grid3*/],
	            listeners: {
// 	                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
// //	                    if(gm.me().tabchangeHandler2!=null) {
// 	                        gm.me().tabchangeHandler2(tabPanel, newTab, oldTab, eOpts);
// //	                    }
// 	                }
	            }
	        });
			
			
			// tabPanel.add(matTab);
			tabPanel.insert(1, matTab);
					
					
				} else {// endof if(success..
					Ext.MessageBox.show({
						title : '연결 종료',
						msg : '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
						buttons : Ext.MessageBox.OK,
						// animateTarget: btn,
						scope : this,
						icon : Ext.MessageBox['ERROR'],
						fn : function() {

						}
					});
				}
			},
			scope : this
		});
		
        // 버튼 추가.
        // buttonToolbar.insert(4, this.reProduceAction);
        // buttonToolbar.insert(4, '-');
        buttonToolbar.insert(4, this.addProcessPlan);
        buttonToolbar.insert(4, '-');
        
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	var processGrid = Ext.getCmp('producePlanGrid');
        	var mainmenu = Ext.getCmp( 'producePlanview' + '-mainmenu' );
        	
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('set grid callback rec>>>>>>>>>>>>>>>>>>>', rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('coord_key3'); // assymap_uid
            	console_logs('vSELECTED_UNIQUE_ID >>>>>>>>>>>>>>>>>>>', gMain.selPanel.vSELECTED_UNIQUE_ID);
            	console_logs('RECODE UNIQUE_ID >>>>>>>>>>>>>>>>>>>', rec.get('unique_id'));
            	gMain.selPanel.addProcessPlan.enable();
            	gMain.selPanel.vSELECTED_CHILD = rec.get('child'); 
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
                // 판걸이 수량 체크
                this.handlerChangePanQty();

            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.addProcessPlan.disable();
            	mainmenu.enable();
            }
            
        	if(gMain.selPanel.vSELECTED_UNIQUE_ID==null){
        		gMain.selPanel.vSELECTED_UNIQUE_ID = 200;
                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
                processGrid.getStore().load();
            	
                
                var costGrid = Ext.getCmp('costGrid'/* gMain.getGridId() */);
                costGrid.getStore().getProxy().setExtraParam('srcahd_uid',  -1);
                costGrid.getStore().getProxy().setExtraParam('ac_uid', -1);
                costGrid.getStore().load();
                
                
            	gm.me().loadPrchPart4create();
            	
            	
            	gm.me().pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
            	gm.me().pcsTemplateStore.load( function(records) {
        			console_logs('pcsTemplateStore', records);
        			
        			var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );
        			
        			for(var i=0; i<records.length; i++ ) {	
        				var o = records[i];
        				var o1 = {
        						text: o.get('systemCode') + ' - ' + o.get('codeName'),
        						dataIndex: o.get('unique_id'),
        						handler: function(o) {
        							var selectedTemplate = this['dataIndex'];
        							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
        							
        							oTemplate.setText(this['text']);
        							oTemplate['selectedTemplate'] = this['dataIndex'];
        							
        							console_logs('menu this', selectedTemplate);
        							
        						    Ext.Ajax.request({
        								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
        								params:{
        									fromUid: selectedTemplate ,
        									toUid: gMain.selPanel.vSELECTED_UNIQUE_ID
        								},
        								
        								success : function(result, request) { 
        							          // gMain.selPanel.vSELECTED_UNIQUE_ID =
        										// vCUR_USER_UID*(100);
        							          var processGrid = Ext.getCmp('recvPoPcsGrid'/* gMain.getGridId() */);
        							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
        																																			// UID로
        																																			// 임시생성
        							          processGrid.getStore().load();
        									
        								},// endofsuccess
        								failure: extjsUtil.failureMessage
        							});// endofajax
        							
        						}
        				}
        				mainmenu.add(o1);

        			}
        			
                });
        	}else{
        		gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
    			 gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
                gMain.selPanel.CostStore.load();
                
                gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);
                
                 processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
            	 processGrid.getStore().load();
        	}
        	
        });

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

		var calcNumber = Ext.create('Ext.Action', {
			 iconCls: 'fa-calculator_14_0_5395c4_none',
			 text: '수량계산',
			 tooltip: '수량 계산하기',
			 handler: function() {
				 if(gMain.selPanel.vSELECTED_UNIQUE_ID>200){
					 
				 }else{
					 gMain.selPanel.vSELECTED_UNIQUE_ID=200;
				 }
				 
				 var gridPcsStd = Ext.getCmp('producePlanGrid');
			    	var modifiend =[];
			    	var target_bm_quan = gm.me().getInputTarget('bm_quan');
	           		
			    	var bm_quan = target_bm_quan.getValue();
			    	if(gMain.selPanel.rQty>gMain.selPanel.oQty||gMain.selPanel.rQty==gMain.selPanel.oQty||gMain.selPanel.rQty>0){
			    		bm_quan=gMain.selPanel.rQty;
			    	}else{
			    		bm_quan=gMain.selPanel.oQty;
			    	}
			    	
	           		
	           		var target_reserved_double3 = gm.me().getInputTarget('reserved_double3');
	           		var reserved_double3 = target_reserved_double3.getValue();
	           		
			    	
			    	
//			    	if(gMain.selPanel.vSELECTED_BM_QUAN>1){
//			    	  var prevQty = Number(gMain.selPanel.vSELECTED_BM_QUAN);  
//			    	}
//			    	else{
			    		var prevQty = Number(bm_quan);
//			    	}
			    	 // var tomCheck = false;
			    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
			    	  {
			    	        var record = gridPcsStd.store.data.items [i];
	    	           		var pcs_no =  record.get('pcs_no');
	    	           		var pcs_code = record.get('pcs_code');
	    	           		var serial_no = Number(pcs_no) / 10;
//	    	           		var plan_qty = record.get('plan_qty');
	    	           		var plan_qty = bm_quan;
			    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
			    	           	console_logs(record);
			    	           	var pcs_code = record.get('pcs_code').toUpperCase();
			    	           	if(gMain.checkPcsName(pcs_code)) {
			    	           		
			    	           		var plan_date = record.get('plan_date');
			    	           		var yyyymmdd ='';
			    	           		if(plan_date!=null) {
			    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
			    	           		}
			    	           		
			    	           		
			    					 switch(pcs_code){
			    					 case 'CRC':
			    					 case 'CTP':
			    					 case 'EMB':
			    					 case 'HAP':
			    					 case 'LEF':
			    					 case 'LMC':
			    					 case 'PRN':
			    					 case 'TOM':
			    						 plan_qty = bm_quan;
			    						 break;
			    					 case 'ADH':
			    					 case 'ETC':
			    					 case 'PKG':
			    					 case 'STC':
			    					 case 'TRY':
			    						 plan_qty = Math.round(bm_quan*reserved_double3);
			    						 
			    						 break;
			    				 }
			    					 
		    	           			
			    	           		
			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																				// pcs_name...
			    		           	obj['serial_no'] = serial_no;
			    		           	obj['pcs_code'] = record.get('pcs_code');
			    		           	obj['pcs_name'] = record.get('pcs_name');

			    		           	obj['description'] = record.get('description');
			    		           	obj['comment'] = record.get('comment');
			    		           	obj['machine_uid'] = record.get('machine_uid');
			    		           	obj['seller_uid'] = record.get('seller_uid');

			    		           	obj['std_mh'] = record.get('std_mh');
			    		           	obj['plan_date'] = yyyymmdd;
			    		           	obj['plan_qty'] = plan_qty;
			    		           	
			    		           	modifiend.push(obj);
			    		           	
			    	        }
			    	        prevQty = plan_qty;
			    	  }
			    	  
			    	  if(modifiend.length>0) {
			    		
			    		  console_logs('modifiend>>>>>>>',modifiend);
			    		  var str =  Ext.encode(modifiend);
			    		  console_logs(str);
			    		    Ext.Ajax.request({
			    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
			    				params:{
			    					modifyIno: str,
			    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
			    				},
			    				success : function(result, request) {   
			    					gridPcsStd.store.load(function() {
			    						
			    					});
			    				}
			    		    });
			    	  }
			    	  
			 }
			});
		
		this.store.on('load',function (store, records, successful, eOpts ){
        	gMain.selPanel.StoreLoadRecordSet(records);
       });
		
		var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '공정저장',
			 tooltip: '공정설계 내용 저장',
			 // toggleGroup: 'toolbarcmd',
			 handler: this.savePcsstdHandler
			});
		var saveCostMap = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '저장',
			 tooltip: '단가정보 저장',
			 // toggleGroup: 'toolbarcmd',
			 handler: this.saveCostmapHandler
			});
		
       // 공정설계 gridPcsStd Tab 추가.
		gMain.addTabGridPanel('공정설계', 'EPC1', {  
				pageSize: 100,
				model: 'Rfx.model.PcsStd',
		        dockedItems: [
			        
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default4',
			            items: [
			                    {
			                    	id: this.link + '-'+ 'grid-top-spoQty',
			 	   		        	xtype:'tbtext',
			 	   		        	text:'생산수량: 50000'
			 	   		        },
				 	   		    {
				    				id: this.link + '-'+ 'grid-top-paperQty',
				 	   		        xtype:'tbtext',
				 	   		        text:'원지수량: 50000'
				 	   		    },
			      				{
			    					  id: this.link + '-'+ 'grid-top-bladeinfo',
			 	   		        	  xtype:'tbtext',
			 	   		        	  text:'칼 000 * 000 1EA'
			 	   		        	 // style:'text-align:right;',
			 	   		        	 // width: 70,
			 	   		        }
	      				     ]
				        }
			        
			        ,
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			                    '-',
			 	   		    	savePcsStep
			    				 ,
// addPcsStep,
// '-',

			                    '->',
			                    calcNumber,
			                    '-',
			                    {
			                    	id: 'splitbuttonTemplate' + this.link,
			                    	iconCls: 'fa-bitbucket_14_0_5395c4_none',
		    						xtype: 'splitbutton',
		    					   	text: '템플리트',
		    					   	selectedMennu: -1,
		    					   	tooltip: '표준공정 템플리트',
		    					   	handler: function() {}, // handle a click on
															// the button itself
		    					   	menu: new Ext.menu.Menu({
		    					   		id: 'producePlanview' + '-mainmenu'
		    					   	})
			    				 }
	      				        ]
				        }
			        ],
					sorters: [{
			           property: 'serial_no',
			           direction: 'ASC'
			       }]
			}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	// console_logs(rec);
	            	gm.me().selectPcsRecord = rec;
	            	pcs_code = rec.get('pcs_code');
	            	
	                // maker store relod
	                gm.supastPcsStore.removeAll();
	                gm.supastPcsStore.getProxy().setExtraParam('pcs_code', pcs_code);
	                gm.supastPcsStore.load();
	                
	                gm.mchnPcsStore.removeAll();
	                gm.mchnPcsStore.getProxy().setExtraParam('pcs_code', pcs_code);
	                gm.mchnPcsStore.load();
	                
	            	gMain.selPanel.selectPcsRecord = rec;
	            } else {
	            	
	            }
	        },
	        'producePlanGrid'// toolbar
		);

		
		

        this.callParent(arguments);
        
  		this.pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
        this.pcsTemplateStore.load( function(records) {
			console_logs('pcsTemplateStore', records);
			
			var mainmenu = Ext.getCmp( 'producePlanview' + '-mainmenu' );
			
			for(var i=0; i<records.length; i++ ) {	
				var o = records[i];
				var o1 = {
						text: o.get('systemCode') + ' - ' + o.get('codeName'),
						dataIndex: o.get('unique_id'),
						handler: function(o) {
							var selectedTemplate = this['dataIndex'];
							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
							
							oTemplate.setText(this['text']);
							oTemplate['selectedTemplate'] = this['dataIndex'];
							
							console_logs('menu this', selectedTemplate);
							
						    Ext.Ajax.request({
								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
								params:{
									fromUid: selectedTemplate ,
									toUid: gMain.selPanel.vSELECTED_UNIQUE_ID
								},
								
								success : function(result, request) { 
							          // gMain.selPanel.vSELECTED_UNIQUE_ID =
										// vCUR_USER_UID*(-100);
							          var processGrid = Ext.getCmp('producePlanGrid'/* gMain.getGridId() */);
							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
																																			// UID로
																																			// 임시생성
							          processGrid.getStore().load();
									
								},// endofsuccess
								failure: extjsUtil.failureMessage
							});// endofajax
							
						}
				}
				mainmenu.add(o1);

			}
			
        });
        // EditPane size 늘림.
		// this.crudEditSize = 700;
		
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.storeLoad = function() {
			var start_time = new Date();
			console.log('>>>> start_time',start_time);

            this.store.load(function(records) {

            	for(var i=0; records!=null && i<records.length; i++) {
            		var rec = records[i];
            		var item_name_r1 = rec.get('item_name_r1'); 
            		var item_name_r2 = rec.get('item_name_r2');
            		var item_name_u = rec.get('item_name_u');

            		var specification_r1 = rec.get('specification_r1');
            		var specification_r2 = rec.get('specification_r2');
            		var specification_u = rec.get('specification_u');
            		
            		var description_r1 = rec.get('description_r1');
            		var description_r2 = rec.get('description_r2');
            		var description_u = rec.get('description_u');
            		
            		var comment_r1 = rec.get('comment_r1');
            		var comment_r2 = rec.get('comment_r2');
            		var comment_u = rec.get('comment_u');

            		var remark_r1 = rec.get('remark_r1');
            		var remark_r2 = rec.get('remark_r2');
            		var remark_u = rec.get('remark_u');
            		
            		var bm_quan_r1 = rec.get('bm_quan_r1');
            		var bm_quan_r2 = rec.get('bm_quan_r2');
            		var bm_quan_u = rec.get('bm_quan_u');

            		var request_comment1 = rec.get('request_comment1');
            		var request_comment2 = rec.get('request_comment2');
            		
            		var req_info1 = rec.get('req_info1');
            		var req_info2 = rec.get('req_info2');
            		
            		var delivery_info = rec.get('delivery_info');
            		var reserved_varchare = rec.get('reserved_varchare');
            		var order_com_unique = rec.get('order_com_unique');
            		
            		var pm_uid=rec.get('pm_uid');
            		var regist_date = rec.get('regist_date');
            		
            		//console_logs('setCenterLoading@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', regist_date);
            		rec.set('item_name|1', item_name_r1);
            		rec.set('item_name|2', item_name_r2);
            		rec.set('item_name|3', item_name_u);
            		
            		rec.set('specification|1', specification_r1);
            		rec.set('specification|2', specification_r2);
            		rec.set('specification|3', specification_u);
            		
            		rec.set('description|1', description_r1);
            		rec.set('description|2', description_r2);
            		rec.set('description|3', description_u);
            		
            		rec.set('comment|1', comment_r1);
            		rec.set('comment|2', comment_r2);
            		rec.set('comment|3', comment_u);
            		
            		rec.set('remark|1', remark_r1);
            		rec.set('remark|2', remark_r2);
            		rec.set('remark|3', remark_u);
            		
            		rec.set('bm_quan|1', bm_quan_r1);
            		rec.set('bm_quan|2', bm_quan_r2);
            		rec.set('bm_quan|3', bm_quan_u);
            		
            		rec.set('request_comment|1', request_comment1);
            		rec.set('request_comment|2', request_comment2);
            		
            		rec.set('req_info|1', req_info1);
            		rec.set('req_info|2', req_info2);
            		
            		rec.set('delivery_info', delivery_info);
            		rec.set('reserved_varchare', reserved_varchare);
            		rec.set('pm_uid', pm_uid);
            		rec.set('order_com_unique', order_com_unique);
            		rec.set('regist_date', regist_date);
            		// console_logs('rec', rec);
            	}
            	
// gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
                var processGrid = Ext.getCmp('producePlanGrid'/* gMain.getGridId() */);
// processGrid.getStore().getProxy().setExtraParam('assymap_uid',
// gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
// processGrid.getStore().load();
            	if(gMain.selPanel.vSELECTED_UNIQUE_ID==null){
            		gMain.selPanel.vSELECTED_UNIQUE_ID = 200;
                    processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
                    processGrid.getStore().load();
                	
                    
                    var costGrid = Ext.getCmp('costGrid'/* gMain.getGridId() */);
                    costGrid.getStore().getProxy().setExtraParam('srcahd_uid',  -1);
                    costGrid.getStore().getProxy().setExtraParam('ac_uid', -1);
                    costGrid.getStore().load();
                    
                    
                	gm.me().loadPrchPart4create();
                	
                	
                	gm.me().pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
                	gm.me().pcsTemplateStore.load( function(records) {
            			console_logs('pcsTemplateStore', records);
            			
            			var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );
            			
            			for(var i=0; i<records.length; i++ ) {	
            				var o = records[i];
            				var o1 = {
            						text: o.get('systemCode') + ' - ' + o.get('codeName'),
            						dataIndex: o.get('unique_id'),
            						handler: function(o) {
            							var selectedTemplate = this['dataIndex'];
            							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
            							
            							oTemplate.setText(this['text']);
            							oTemplate['selectedTemplate'] = this['dataIndex'];
            							
            							console_logs('menu this', selectedTemplate);
            							
            						    Ext.Ajax.request({
            								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
            								params:{
            									fromUid: selectedTemplate ,
            									toUid: gMain.selPanel.vSELECTED_UNIQUE_ID
            								},
            								
            								success : function(result, request) { 
            							          // gMain.selPanel.vSELECTED_UNIQUE_ID
													// =
            										// vCUR_USER_UID*(100);
            							          var processGrid = Ext.getCmp('recvPoPcsGrid'/* gMain.getGridId() */);
            							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);// 사용자
            																																			// UID로
            																																			// 임시생성
            							          processGrid.getStore().load();
            									
            								},// endofsuccess
            								failure: extjsUtil.failureMessage
            							});// endofajax
            							
            						}
            				}
            				mainmenu.add(o1);

            			}
            			
                    });
            	}else{
            		gMain.selPanel.CostStore.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
        			 gMain.selPanel.CostStore.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
                    gMain.selPanel.CostStore.load();
                    
                    gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);
                    
                     processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
                	 processGrid.getStore().load();
            	}
				var end_time = new Date();
				console.log('>>>> end_time',end_time);
				var elapsedTime = end_time - start_time;
				console.log('>>>> elapsedTime(ms)',elapsedTime);
              });	
        };
        
        this.storeLoad();
    },

    selectPcsRecord: null,
    items : [],
    computeProduceQty: function(cur) {
		// console_logs('computeProduceQty cur', cur);
		var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
		var target_bm_quan = this.getInputTarget('bm_quan');
		
		var val = cur - target_stock_qty_useful.getValue();
		if(val<0) {
			val = 0;
		}
		target_bm_quan.setValue(val);
    },

    refreshBladeInfo: function() {
		var val = gMain.getBladeInfo();
		var target = this.getInputTarget('blade_size_info');
		target.setValue(val);
    },
    
    refreshReqBom: function() {
    	// 판걸이수량
    	var target_reserved_double3 = this.getInputTarget('reserved_double3');
    	var reserved_double3 = target_reserved_double3.getValue();
    	// 수주수량
    	var target_bm_quan = this.getInputTarget('bm_quan');
    	var bm_quan = target_bm_quan.getValue();
    	// 원지구매수량
    	var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(bm_quan/reserved_double3);
		// 원단구매수량
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(bm_quan/reserved_double3);
    	
    },
    
    
    refreshBladeInfoAll: function() {
    	var val1 = gMain.getBladeInfoAll();
    	console_logs("val1", val1);
// var target1 = this.getInputTarget('blade_size_info1');
// target1.setValue(val1);
    	if(val1!=null) {
// var target1 = this.getInputTarget('blade_size_info1');
// target1.setValue(val1);
    	}
        	//        	
// } else {
// var bladeInfo = gMain.getBladeInfo();
//        	
// var target_item_name = this.getInputTarget('item_name');
// var target_bm_quan = this.getInputTarget('bm_quan');
// var item_name = target_item_name.getValue();
// var bm_quan = target_bm_quan.getValue();
// var wa_name ='';
//        	
// var order_com_unique = this.vSELECTED_RECORD.get('order_com_unique');
// var buyerStore = Ext.create('Mplm.store.BuyerStore', {hasNull:true} );
//    		
// var bladeInfoAll = bladeInfo + ', ' + wa_name + ' / ' + item_name + ' , 생산수량:
// ' + bm_quan;
//    		
// buyerStore.load(records) {
// for(var i=0; i<records.length; i++) {
// var rec = records[i];
// console_logs()
// if(rec.get('unique_id') + '' == order_com_unique + '') {
// this.selPanel.inputBuyer = rec;
// var wa_name = this.selPanel.inputBuyer.get('wa_name');
//                    	
// var bladeInfoAll = bladeInfo + ', ' + wa_name + ' / ' + item_name + ' , 생산수량:
// ' + bm_quan;
// console_logs('bladeInfoAll from store load', bladeInfoAll);
//                    	
// var target1 = this.getInputTarget('blade_size_info1');
// target1.setValue(bladeInfoAll);
// }
//     				
// }
//  			
// }
//
// }

    },
    // 원지/원단 수량 설정
    refreshBmquan: function(cur) {
		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(cur);
		
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(cur);
    },
    refreshProcess: function() {
    	
// var target_bm_quan = this.getInputTarget('bm_quan');
// var bm_quan = target_bm_quan.getValue();
		
// var o = Ext.getCmp( this.link + '-'+ 'grid-top-spoQty' ).setText('생산수량: ' +
// bm_quan);
		
    	
// var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
// var bm_quan1 = target_bm_quan1.getValue();
// Ext.getCmp( this.link + '-'+ 'grid-top-paperQty' ).setText('원지수량: ' +
// bm_quan1);

		
		var val = gMain.getBladeInfo();
		Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo' ).setText(val);
		

    },
    // 판걸이 수량이 변경된 andler
    handlerChangePanQty: function() {
    	// console_logs('handlerChangePanQty', 'in');
		var target_bm_quan = this.getInputTarget('bm_quan');
		var target_reserved_double3 = this.getInputTarget('reserved_double3');
		var target_reserved_double4 = this.getInputTarget('reserved_double4');
		
		var qty = Number(target_bm_quan.getValue()) / Number(target_reserved_double3.getValue());
		// console_logs('qty', qty);
		target_reserved_double4.setValue(qty);
		
// var val = gMain.getBladeInfo();
// var target = this.getInputTarget('blade_size_info');
// target.setValue(val);

		this.refreshBladeInfo();
		this.refreshBladeInfoAll();
		
// target_reserved_varcharc.setValue(target_reserved_double3.getValue()+'ea');
    },
// //구매/제작요청
// doWorkOrder: function() {
//    	
//    	
// // var target_reserved_double3 = this.getInputTarget('unique_id');
// // var assymapUid = target_reserved_double3.getValue()
// //
// console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
//    	
// var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
// var assymapUid = this.vSELECTED_RECORD.get('unique_uid');
//    	
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/index/process.do?method=addWorkOrder',
// params:{
// assymapUid: assymapUid,
// ac_uid: ac_uid
// },
//			
// success : function(result, request) {
// gain.selPanel.store.load();
// Ext.Msg.alert('안내', '요청하였습니다.', function() {});
//				
// },//endofsuccess
// failure: extjsUtil.failureMessage
// });//endofajax
//    	
//    	
//    	
//
// },
    
    
	    // 계획수립
		addProcessPlanFc: function() {
	    	
	    	
// var target_reserved_double3 = this.getInputTarget('unique_id');
// var assymapUid = target_reserved_double3.getValue()
//	    	
	    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

			var cartmapUid = this.vSELECTED_RECORD.get('unique_uid');
			
			var cartmap_uids = [];
			var selections = gm.me().grid.getSelectionModel().getSelection();
			for(var i=0; i<selections.length; i++) {
				var rec = selections[i];
				    uid = rec.get('unique_uid');
				cartmap_uids.push(uid);
			}
			
	    	
		    Ext.Ajax.request({
				url: CONTEXT_PATH + '/index/process.do?method=addProcessPlan',
				params:{
					cartmap_uids:cartmap_uids
					// cartmapUid: cartmapUid
				},
				
				success : function(result, request) { 
					gMain.selPanel.store.load();
					Ext.Msg.alert('안내', '요청하였습니다.', function() {});
					
				},// endofsuccess
				failure: extjsUtil.failureMessage
			});// endofajax

	    },
	    StoreLoadRecordSet: function(records){
	    	//console_logs('StoreLoadRecordSet>>>>>>>>>>>>>>>>>', records);
	       	for(var i=0; records!=null && i<records.length; i++) {
	    		var rec = records[i];
	    		var class_code = rec.get("class_code");
	    		
	    		var item_name_r1 = rec.get('item_name_r1'); 
	    		var item_name_r2 = rec.get('item_name_r2');
	    		var item_name_u = rec.get('item_name_u');

	    		var specification_r1 = rec.get('specification_r1');
	    		var specification_r2 = rec.get('specification_r2');
	    		var specification_u = rec.get('specification_u');
	    		
	    		var description_r1 = rec.get('description_r1');
	    		var description_r2 = rec.get('description_r2');
	    		var description_u = rec.get('description_u');
	    		
	    		var comment_r1 = rec.get('comment_r1');
	    		var comment_r2 = rec.get('comment_r2');
	    		var comment_u = rec.get('comment_u');

	    		var remark_r1 = rec.get('remark_r1');
	    		var remark_r2 = rec.get('remark_r2');
	    		var remark_u = rec.get('remark_u');
	    		
	    		var bm_quan_r1 = rec.get('bm_quan_r1');
	    		var bm_quan_r2 = rec.get('bm_quan_r2');
	    		var bm_quan_u = rec.get('bm_quan_u');

	    		var request_comment1 = rec.get('request_comment1');
	    		var request_comment2 = rec.get('request_comment2');
	    		var delivery_info = rec.get('delivery_info');
	    		var reserved_varchare = rec.get('reserved_varchare');
	    		var order_com_unique = rec.get('order_com_unique');
	    		
	    		var pm_uid=rec.get('pm_uid');
	    		var req_info1=rec.get('req_info1');
	    		var req_info2=rec.get('req_info2');
	    		
	    		rec.set('item_name|1', item_name_r1);
	    		rec.set('item_name|2', item_name_r2);
	    		rec.set('item_name|3', item_name_u);
	    		
	    		rec.set('specification|1', specification_r1);
	    		rec.set('specification|2', specification_r2);
	    		rec.set('specification|3', specification_u);
	    		
	    		rec.set('description|1', description_r1.replace(/,/gi,""));
	    		rec.set('description|2', description_r2);
	    		rec.set('description|3', description_u);
	    		
	    		rec.set('comment|1', comment_r1.replace(/,/gi,""));
	    		rec.set('comment|2', comment_r2.replace(/,/gi,""));
	    		rec.set('comment|3', comment_u);
	    		
	    		rec.set('remark|1', remark_r1.replace(/,/gi,""));
	    		rec.set('remark|2', remark_r2.replace(/,/gi,""));
	    		rec.set('remark|3', remark_u);
	    		
	    		rec.set('bm_quan|1', bm_quan_r1);
	    		rec.set('bm_quan|2', bm_quan_r2);
	    		rec.set('bm_quan|3', bm_quan_u);
	    		
	    		rec.set('req_info|1', req_info1);
	    		rec.set('req_info|2', req_info2);
	    		
	    		rec.set('request_comment|1', request_comment1);
	    		rec.set('request_comment|2', request_comment2);
	    		
	    		rec.set('delivery_info', delivery_info);
	    		rec.set('reserved_varchare', reserved_varchare);
	    		rec.set('pm_uid', pm_uid);
	    		rec.set('order_com_unique', order_com_unique);
	    		
	    		rec.set('class_code', class_code);
	    		// console_logs('rec', rec);
	    	}
	    },
    
	    savePcsstdHandler : function() {
		 var gridPcsStd = Ext.getCmp('producePlanGrid');
		 // console_logs('gridPcsStd', gridPcsStd);
		 
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan');
	    	
	    	  var prevQty = Number(target_bm_quan.getValue());
	    	  // var tomCheck = false;
	    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
	    	  {
	    	        var record = gridPcsStd.store.data.items [i];
	           		var pcs_no =  record.get('pcs_no');
	           		var pcs_code = record.get('pcs_code');
	           		var serial_no = Number(pcs_no) / 10;
	           		var plan_qty = record.get('plan_qty');
	           		
	    	        if (record.dirty) {
	    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	           	console_logs(record);
	    	           	var pcs_code = record.get('pcs_code').toUpperCase();
	    	           	var pcs_name = record.get('pcs_name');
	    	           	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	           		var plan_date = record.get('plan_date');
	    	           		var yyyymmdd ='';
	    	           		if(plan_date!=null) {
	    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
	    	           		}

	    	           		if(plan_qty==0) {
	    	           			plan_qty = prevQty;
	    	           		}
	    	           		
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																		// pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	obj['pcs_code'] = record.get('pcs_code');
	    		           	obj['pcs_name'] = record.get('pcs_name');

	    		           	obj['description'] = record.get('description');
	    		           	obj['comment'] = record.get('comment');
	    		           	obj['machine_uid'] = record.get('machine_uid');
	    		           	obj['seller_uid'] = record.get('seller_uid');

	    		           	obj['std_mh'] = record.get('std_mh');
	    		           	obj['plan_date'] = yyyymmdd;
	    		           	obj['plan_qty'] = plan_qty;
	    		           	
	    		           	modifiend.push(obj);
	    	           	} else {
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																		// pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	
	    		           	obj['pcs_code'] = '';
	    		           	obj['pcs_name'] = '';

	    		           	obj['description'] = '';
	    		           	obj['comment'] = '';
	    		           	obj['machine_uid'] = '-1';
	    		           	obj['seller_uid'] = '-1';

	    		           	obj['std_mh'] = '0';
	    		           	obj['plan_date'] = '';
	    		           	obj['plan_qty'] = '0';
	    		           	modifiend.push(obj);
	    	           	}

	    	        }
	    	        prevQty = plan_qty;
	    	  }
	    	  
	    	  if(modifiend.length>0) {
	    		
	    		  console_log(modifiend);
	    		  var str =  Ext.encode(modifiend);
	    		  console_log(str);
	    		  console_log('modify>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
	    				params:{
	    					modifyIno: str,
	    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
	    				},
	    				success : function(result, request) {   
	    					gridPcsStd.store.load(function() {
	    						// alert('come');
	    	       				// var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				// cellEditing.startEditByPosition({row:
								// idxGrid, column: 2});
	    						
	    					});
	    				}
	    		    });
	    	  }
	 },
	 selectPcsRecord:null,
	 saveAssymapHandler: function(gridAssymapStore) {
   	  for (var i = 0; i <gridAssymapStore.data.items.length; i++)
   	  {
   		  var modifiend =[];
   	        var record = gridAssymapStore.data.items [i];
          		var pl_no =  record.get('pl_no');
          		var sp_code = record.get('sp_code');
          		var item_name = record.get('item_name');
          		var item_name = record.get('description_src');
          		var item_name = record.get('specification');
          		var bm_quan = record.get('bm_quan');
          		switch(sp_code){
          		case 'R':
          			gMain.selPanel.rQty=bm_quan;
          			break;
          		case 'O':
          			gMain.selPanel.oQty=bm_quan;
          			break;
          		}
   	        	gridAssymapStore.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
   	           		console_logs('record.dirty',record);
   	           		console_logs('record>>>>>>>>>',record);
   	           		console_logs('unique_uid>>>>>>>>>',record.get('unique_uid'));
   	           		console_logs('unique_id>>>>>>>>>',record.get('unique_id'));
   	           		console_logs('child>>>>>>>>>',record.get('srcahd_uid'));
   		           	var obj = {};
   		           	obj['unique_id'] = record.get('unique_uid');
   		           	obj['child'] = record.get('srcahd_uid');
   		           	obj['ac_uid'] = record.get('ac_uid');
   		           	obj['pl_no'] = record.get('pl_no');
   		           	obj['sp_code'] = record.get('sp_code');
   		           	obj['item_name'] = record.get('item_name');
   		           	obj['description'] = record.get('description_src');
   		           	obj['specification'] = record.get('specification');
   		           	obj['bm_quan'] = record.get('bm_quan');
   		           	
   		           	modifiend.push(obj);

// }
   		            if(modifiend.length>0) {
   			    		
   			    		  console_log(modifiend);
   			    		  var str =  Ext.encode(modifiend);
   			    		  console_log(str);
   			    		  console_log('modify>>>>>>>>');
   			    		    Ext.Ajax.request({
   			    				url: CONTEXT_PATH + '/design/bom.do?method=modifyPartList',
   			    				params:{
   			    					modifyIno: str,
   			    					assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID,
   			    					sp_code : sp_code
   			    				},
   			    				success : function(result, request) {
   			    					gridAssymapStore.sync();

                                       console_logs('결과', '반영하였습니다.');
// gridAssymapStore.load(function() {
   			    						// alert('come');
   			    	       				// var idxGrid =
										// storePcsStd.getTotalCount() -1;
   			    	       				// cellEditing.startEditByPosition({row:
   										// idxGrid, column: 2});
// });
   			    				}
   			    		    });
   			    	  }
   	  }
// gm.me().store.load();
   	 
   	  
},
 vSELECTED_UNIQUE_ID : 200,
 AssemblyPartStore : Ext.create('Mplm.store.AssemblyPartStore', {
	remoteSort: true,
	remoteGroup:true,
	groupField: 'sp_code',
	sortInfo: {
		field: 'sp_code',
		direction: 'desc'
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			// console_logs('>>> records', records);
				var rec1 = records[0];
				// console_logs('rec1@@@',rec1);
			  if(rec1!=null){
				  for(var i=0; i<records.length; i++) {
					var r = records[i];
						sp_code = r.get('sp_code');
					switch(sp_code) {
						case 'R':
						gMain.selPanel.rQty=r.get('bm_quan');
						break;
						case 'O':
						gMain.selPanel.oQty=r.get('bm_quan');
						break;
					}
				  }
				//   console_logs('rQty',gMain.selPanel.rQty);
				//   console_logs('oQty',gMain.selPanel.oQty);
				  gMain.selPanel.rItemSpec=rec1.get('item_name')+' '+rec1.get('description_src')+' '+rec1.get('specification')+ ' '+ gMain.selPanel.rQty+'EA';
					  gMain.selPanel.refreshPrchInfoAR();
			  }
		}
	}
}),
// AssemblyPartStore2 : Ext.create('Mplm.store.AssemblyPartStore', {
// 	  listeners: {
// 			load: function(store, records, successful,operation, options) {
// 				  var rec2 = records[0];
// 				  if(rec2!=null){
// 					  console_logs('rec2@@@',rec2);
// 					  gMain.selPanel.oQty=rec2.get('bm_quan');
// 					  console_logs('oQty',gMain.selPanel.oQty);
// 				  }

// 			}
// 	  }
// }),
// AssemblyPartStore3 : Ext.create('Mplm.store.AssemblyPartStore', {}),
standardFlagStore : Ext.create('Mplm.store.StandardFlagStore', {}),
CostStore : Ext.create('Mplm.store.CostStore', {}),

partReload(sp_code, parent_uid) {
	var store =this.AssemblyPartStore;
  //   switch(sp_code) {
  //   case 'R':
  // 	  store = this.AssemblyPartStore;
  // 	  break;
  //   case 'O':
  // 	  store = this.AssemblyPartStore2;
  // 	  break;
  //   case 'K':
  // 	  store = this.AssemblyPartStore3;
  // 	  break;
  //   }
	
	if(store!=null) {
		store.getProxy().setExtraParam('parent_uid', parent_uid);
		store.getProxy().setExtraParam('groupBy', 'a.unique_id');
		store.getProxy().setExtraParam('sp_code_list', 'R,O,K');
		store.getProxy().setExtraParam('orderBy', 'sp_code desc, pl_no asc');
		store.load();
	   
	}
	
},saveAssymapHandlerMulti : function() {
	  this.saveAssymapHandler(this.AssemblyPartStore);
	//   this.saveAssymapHandler(this.AssemblyPartStore2);
	//   this.saveAssymapHandler(this.AssemblyPartStore3);
},

loadPrchPart4Edit : function(parent_uid) {
	  this.partReload('R', parent_uid);
	//   this.partReload('O', parent_uid);
	//   this.partReload('K', parent_uid);
},
loadPrchPart4create : function() {
	  this.partReload('R', 200);
	//   this.partReload('O', 200);
	//   this.partReload('K', 200);
},
prchCalQuan : function(){
	  this.prchmodify(this.AssemblyPartStore);
	//   this.prchmodify(this.AssemblyPartStore2);
	//   this.prchmodify(this.AssemblyPartStore3);
 	},
prchmodify :function(store){
	  var modifiend =[];
 	
	    	for (var i = 0; i <store.data.items.length; i++)
	    	  {
	    	        var record = store.data.items [i];
	           		var pl_no =  record.get('pl_no');
	           		var sp_code = record.get('sp_code');
	           		var item_name = record.get('item_name');
	           		var description_src = record.get('description_src');
	           		var specification = record.get('specification');
	           		
	           		var target_bm_quan = gm.me().getInputTarget('bm_quan');
	           		var bm_quan = target_bm_quan.getValue();
	           		
	           		var target_reserved_double3 = gm.me().getInputTarget('reserved_double3');
	           		var reserved_double3 = target_reserved_double3.getValue();
	           		
	           		var target_reserved_varcharb = gm.me().getInputTarget('reserved_varcharb');
	        		var val = gm.getBladeInfo();
//	        		target.setValue(val);
	        		
	            	// 칼날사이즈
	            	var target_reserved_varcharb = gm.me().getInputTarget('reserved_varcharb');
	            	var reserved_varcharb = target_reserved_varcharb.getValue();
	            	console_logs('reserved_varcharb', reserved_varcharb);
	            	console_logs('record.dirty', record.dirty);
	            	console_logs('record',record);
//	            	if (record.dirty) {
	            		store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	           	console_logs(record);

//	    	           		if(bm_quan==0) {
//	    	           			bm_quan = prevQty;
//	    	           		}
	    	           		switch(record.get('sp_code')){
	    	           			case 'R':
	    	           				bm_quan = Math.round(Number(bm_quan) / Number(reserved_double3));
	    			            	// 원지
	    			            	reserved_varcharb = reserved_varcharb.replace('X','*');
	    			            	var reserved_varcharb_arr = reserved_varcharb.split('*');
	    			            	console_log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',reserved_varcharb);
	    			            	specification = (reserved_varcharb_arr[0]*1+20) +'*'+(reserved_varcharb_arr[1]*1+15);
	    	           				break;
	    	           			case 'O':
	    	           				bm_quan = Math.round(Number(bm_quan) / Number(reserved_double3));
	    	           			// 원단
	    			            	reserved_varcharb = reserved_varcharb.replace('X','*');
	    			            	var reserved_varcharb_arr = reserved_varcharb.split('*');
	    			            	specification = (reserved_varcharb_arr[1]*1+10) +'*'+(reserved_varcharb_arr[0]*1+15);
	    	           				break;
	    	           		}
	    	           	
	    	           		console_logs('unique_uid>>>>>>>>>',record.get('unique_uid'))
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_uid');
	    		           	obj['unique_uid'] = record.get('unique_uid');
	    		           	obj['child'] = record.get('unique_id');
	    		           	obj['ac_uid'] = record.get('ac_uid');
	    		           	obj['pl_no'] = record.get('pl_no');
	    		           	obj['sp_code'] = record.get('sp_code');
	    		           	obj['item_name'] = record.get('item_name');
	    		           	obj['description'] = record.get('description_src');
	    		           	obj['description_src'] = record.get('description_src');
	    		           	obj['specification'] = specification;
	    		           	obj['bm_quan'] = bm_quan;
	    		           	
	    		           	modifiend.push(obj);
	    		           	
//	    	        }
	    	        
	    	  }
	    	store.clearData();
        	store.removeAll();
        	store.add(modifiend);
	}, 
	saveCostmapHandler: function() {
		 var costGrid = Ext.getCmp('costGrid');
		 // console_logs('gridPcsStd', gridPcsStd);
		 
	    	var unique_ids =[];
	    	var ac_uids =[];
	    	var srcahd_uids =[];
	    	var cost_types =[];
	    	var costs =[];
	    	var tex_flags =[];
	    	var comment1s =[];
	    	var dev_cost_total = 0;
	    	  // var tomCheck = false;
	    	  for (var i = 0; i <costGrid.store.data.items.length; i++){
	    	        
	    		var record = costGrid.store.data.items [i];
	           	var cost_type =  record.get('cost_type');
	           	var cost = record.get('cost');
	           	var tex_flag = record.get('tex_flag');
	           	var comment1 = record.get('comment1');
	           		if(comment1==null||comment1==''){
	           			comment1='-';
	           		}
	           		unique_ids.push(record.get('unique_id'));
	           	 	ac_uids.push(gMain.selPanel.vSELECTED_AC_UID);
	           	 	srcahd_uids.push(gMain.selPanel.vSELECTED_CHILD);
		    	 	cost_types.push(cost_type);
		    	 	costs.push(cost);
		    	 	tex_flags.push(tex_flag);
		    	 	comment1s.push(comment1);
//	    		    modifiend.push(obj);
		    	 	
		    	 	dev_cost_total=(parseInt(dev_cost_total)+parseInt(cost));
	    	  }
	    	//저장할때 계산하는 쿼리
	    	    var selling	= gm.me().getInputJust('project|selling_price'); 
	    	    var reserved1 = gm.me().getInputJust('project|reserved_double1'); 
	    	    
			 	var quan	= gm.me().getInputJust('project|quan'); 
			 	var bm_quan = quan.getValue();//수주수량
			 	var selling_price = Ext.getCmp('selling_price1');  //수주금액
			 	var total_cost = Ext.getCmp('dev_total_cost1'); //개발비합계
			 	var sales_price = Ext.getCmp('sales_price1').getValue(); //제품 1개당 가격
			 	var delivery_price = Ext.getCmp('reserved_varchar61').getValue();//물류비
			 	var total_price= 0;
			 	if(delivery_price==''){
			 		total_price = ((parseInt(bm_quan)*parseInt(sales_price))+parseInt(dev_cost_total)+0);
			 	}else{
			 		total_price = ((parseInt(bm_quan)*parseInt(sales_price))+parseInt(dev_cost_total)+parseInt(delivery_price));
			 	}
			 	
			 	
			 	selling_price.setValue(total_price);
			 	selling.setValue(total_price);
			 	total_cost.setValue(dev_cost_total);
			 	reserved1.setValue(dev_cost_total);
			 	
	    	  if(unique_ids.length>0) {
	    		
//	    		  console_log(modifiend);
//	    		  var str =  Ext.encode(modifiend);
//	    		  console_log(str);
	    		  console_log('saveCostmapHandler>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/index/process.do?method=saveCostMapSession',
	    				params:{
	    					unique_ids:unique_ids,
	    					ac_uids:ac_uids,
	    					srcahd_uids:srcahd_uids,
	    					cost_types:cost_types,
	    					costs:costs,
	    					tex_flags:tex_flags,
	    					comment1s:comment1s
	    				},
	    				success : function(result, request) {   
//	    					costGrid.store.getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_CHILD);
//	    					costGrid.store.getProxy().setExtraParam('ac_uid', gMain.selPanel.vSELECTED_AC_UID);
//	    					costGrid.store.load(function() {
//	    					});
	    				}
	    		    });
	    	  }
	    	  
	 },	 
	 vSELECTED_CHILD : -1,
	 vSELECTED_AC_UID : -1,
	 rQty:0,
	 oQty:0,
	 refreshPrchInfoAR: function() {
	    	
	    	var val = gMain.getBladeInfo();
//			Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo'+'2' ).setText(val);
			
			var target_item_name = this.getInputTarget('item_name');
			var item_name = target_item_name.getValue();
//			Ext.getCmp(this.link + '-'+ 'grid-top-item_name'+'2').setText(item_name);
			
			var target_bm_quan = this.getInputTarget('bm_quan');
			var bm_quan = target_bm_quan.getValue();
			// Ext.getCmp(	this.link + '-'+ 'grid-top-pqty'+'2').setText(val+'/'+item_name+'/'+' 생산수량: ' +bm_quan);
			
			// Ext.getCmp(this.link + '-'+ 'grid-top-item_spec').setText('['+gMain.selPanel.rItemSpec+']');
			

	    },
		rItemSpec:null,
		changePurSpec: function(record) {
			var pl_no = record.get('pl_no');
				sp_code = record.get('sp_code');
				item_name = record.get('item_name');
				description_src = record.get('description_src');
				specification = record.get('specification');
				bm_quan = record.get('bm_quan');

				unique_id = record.get('unique_id_long');
			
			console_logs('>>> 유니크아이디', unique_id);
			
			gm.me().standardFlagStore.load();
			var form = Ext.create('Ext.form.Panel', {
				id: 'formSpec',
				defaultType: 'textfield',
				border: false,
				bodyPadding: 15,
				width: 750,
				height: 200,
				layout: 'column',
				defaults: {
					labelWidth: 89,
					anchor: '50%',
					width: '50%',
					style: 'padding-left: 50px; padding-top: 15px;',
					layout: {
						type: 'column',
						// defaultMargins: {
						// 	top: 20,
						// 	right: 30,
						// 	bottom: 0,
						// 	left: 10
						// }
					}
				},
				// defaults: {
				// 	anchor: '50%',
				// 	width: '50%',
				// 	editable:true,
				// 	allowBlank: false,
				// 	// msgTarget: 'side',
				// 	labelWidth: 100
				// },
				items: [
					new Ext.form.Hidden({
						name: 'unique_id',
						value: unique_id
					}),
					{
						xtype: 'textfield',
						name: 'pl_no',
						id:'pl_no',
						allowBlank: false,
						fieldLabel: '순번',
						value: pl_no
					},{
						xtype: 'combo',
						fieldLabel: '항목',
						id: 'sp_code',
						name: 'sp_code',
						allowBlank: false,
						store : gm.me().standardFlagStore,
						displayField : 'code_name_kr',
						valueField : 'system_code',
						// listeners: {
						// 	select: function(store, combo) {
						// 		var value = combo.value;
						// 		console_logs('>>>> combo value', value);
						// 		Ext.getCmp('sp_code').setValue(value);
						// 	}
						// },
						listConfig : {
							getInnerTpl : function() {
								return '<div data-qtip="{system_code}">{code_name_kr}</div>';
							}
						},
						value: sp_code
					},{
						xtype: 'textfield',
						name: 'item_name',
						id:'item_name',
						allowBlank: true,
						fieldLabel: '지종(규격)',
						value: item_name
					},{
						xtype: 'textfield',
						name: 'description_src',
						id:'description_src',
						allowBlank: true,
						fieldLabel: '평량(배합)',
						value: description_src
					},{
						xtype: 'textfield',
						name: 'specification',
						id:'specification',
						allowBlank: true,
						fieldLabel: '규격',
						value: specification
					},{
						xtype: 'textfield',
						name: 'bm_quan',
						id:'bm_quan',
						allowBlank: true,
						fieldLabel: '요청수량',
						value: bm_quan
					}
				]
			});

			var win = Ext.create('ModalWindow', {
				title: '구매내용저장',
				width: 800,
				height: 230,
				minWidth: 800,
				minHeight: 50,
				items: form,
				// layout: 'column',
				buttons: [{
					text: CMD_OK,
					handler: function(btn){
						if(btn == "no") {
							win.close();
						} else {
							// var array = [];
							var obj = {};
							var sp_code = Ext.getCmp('sp_code').getValue();
							obj['unique_id'] = record.get('unique_uid');
							obj['child'] = record.get('srcahd_uid');
							obj['ac_uid'] = record.get('ac_uid');
							obj['pl_no'] = Ext.getCmp('pl_no').getValue();
							obj['sp_code'] = Ext.getCmp('sp_code').getValue();
							obj['item_name'] = Ext.getCmp('item_name').getValue();
							obj['description'] = Ext.getCmp('description_src').getValue();
							obj['specification'] = Ext.getCmp('specification').getValue();
							obj['bm_quan'] = Ext.getCmp('bm_quan').getValue();


							// array.push(obj);
							var str =  Ext.encode(obj);

							Ext.Ajax.request({
								url: CONTEXT_PATH + '/design/bom.do?method=modifyPartOne',
								params:{
									modifyInfo: str,
									assymap_uid:gMain.selPanel.vSELECTED_UNIQUE_ID,
									sp_code : sp_code
								},
								success: function(val, action) {
									win.close();

									switch(sp_code){
									case 'R':
										gMain.selPanel.rQty=obj['bm_quan'];
										gMain.selPanel.rItemSpec=item_name+description_src+" "+specification+" "+ bm_quan+"EA";
										break;
									case 'O':
										gMain.selPanel.oQty=obj['bm_quan'];
										break;
									}

									gm.me().AssemblyPartStore.load();
									// 마지막에 들어가야댐
									gm.me().refreshPrchInfoAR();
									gm.me().showToast('알림', '구매내용 저장완료');
								},
								failure: function() {
									win.close();
								}
							})
						}
					}
				},{
					text: CMD_CANCEL,
					handler: function(btn) {
						win.close();
					}
				}]
			});
			win.show();

			
		},
});