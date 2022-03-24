Ext.define('Rfx.view.produceMgmt.WorkOrderView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'workorder-view',
    initComponent: function(){


        
    	//this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
       	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
		this.addSearchField (
				{
						field_id: 'status'
						,store: "RecevedStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	
		this.addSearchField (
				{
						field_id: 'pm_name'
						,store: "UserDeptStoreOnly"
	    			    ,displayField:   'user_name'
	    			    ,valueField:   'unique_id'
	    			    ,value: vCUR_USER_UID
						,innerTpl	: '<div data-qtip="{unique_id}">[{dept_name}] {user_name}</div>'
						,params:{dept_code: '02'}
				});	
		this.addSearchField ('item_name');	
		
		this.addSearchField('item_code');
		
		this.addSearchField('wa_name');


		this.addSearchField('pj_code');
		
        //Widget 추가
        this.addFormWidget('reserved_varcharc', {
        	tabTitle:"수주정보", 
            xtype: 'displayfield',
            text: '칼날요약',
            name: 'blade_size_info',
            value: '칼 000 * 000 1EA',
            fieldStyle: 'background-image: none; color:red; padding: 1px',
            //margins: '0 0 0 10',
            canCreate:   true,
            canEdit:     true,
            canView:     true,
            position: 'center'
        });        
//        this.addFormWidget(0, {
//        	tabTitle:"구매요청",
//        	name: 'blade_size_info1',
//            xtype: 'displayfield',
//            text: '',
//            emptyText: '칼날Size',
//            fieldStyle: 'background-color: #FBF8E6; background-image: none; padding:1px;',
//            value: '<font color="#EAEAEA;">칼 000 * 000 1EA</font>',
//            //margins: '0 0 0 10',
//            canCreate:   true,
//            canEdit:     true,
//            canView:     true,
//            position: 'center'
//        });
//        
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        });
        
        //콘솔 로그
        //console_logs('this.fields', this.fields);
        //모델 정의
        this.createStore('Rfx.model.WorkOrder', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/*pageSize*/
        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	//Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'a.creator',
        	unique_id: 'a.unique_id'
        }
    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['cartmap']
        );
        
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            //console_logs('tabpanel newTab', newTab);
            //console_logs('tabpanel newTab newTab.title', newTab.title);

            switch(newTab.title) {
            case '구매요청':
                gMain.selPanel.refreshBladeInfoAll();
                break;
            case '공정설계':
            	gMain.selPanel.refreshProcess();
            	break;
            case '구매규격':
 	   		    gMain.selPanel.refreshPrchInfoAR();
	        	break;
            }
            
            
        };

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        
//        this.setRowClass(function(record, index) {
//        	
//        	console_logs('record', record);
//            var c = record.get('status');
//            //console_logs('c', c);
//            switch(c) {
//                case 'CR':
//                	return 'yellow-row';
//                	break;
//                case 'PO':
//                	return 'orange-row';
//                	break;
//                case 'GR':
//                	return 'green-row';
//                	break;
//                case 'DE':
//                	return 'red-row';
//                	break;
//                default:
//            }
//
//        }	);
        
        //grid 생성.
        this.createGrid(arr/*, function(){}*/);
        
        //작업지시 Action 생성
        this.addWorkOrder = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: gm.getMC('CMD_Job_Confirm', '작업지시'),
			 tooltip: '작업지시 확정',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '작업지시를 진행하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.addWorkOrder.disable();
	            	        	
	            	        	gMain.selPanel.addWorkOrderFc();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
        //추가작업지시 Action 생성
        this.reWorkAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '추가 작업',
			 tooltip: '추가 생산 작업 지시',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '추가 작업을 실행 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	//gMain.selPanel.doWorkOrder();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            
            tooltip:'작업지시서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var ac_uid = gMain.selPanel.vSELECTED_PROJECT_UID;
            	var item_code = gMain.selPanel.vSELECTED_PRODUCT_CODE;
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printWo',
            		params:{
            			item_code : item_code,
            			ac_uid : ac_uid,
            			pdfPrint : 'pdfPrint',
            			is_rotate : 'N'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_logs(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });

        //계획반려
        this.rejectAction = Ext.create('Ext.Action', {
   		 iconCls: 'af-reject',
   		 text: '계획반려',
   		 tooltip: '계획반려',
   		 disabled: true,
   		 handler: function(widget, event) {
   		    	Ext.MessageBox.show({
   		            title: '계획반려',
   		            msg: '선택한 항목을 반려하시겠습니까?<br>!!!반려할 경우 생산계획수립단계로 돌아갑니다.',
   		            buttons: Ext.MessageBox.YESNO,
   		            fn: function(result) {
            	        if(result=='yes') {
            	        	gMain.selPanel.planReject();
            	        }
   		            	
   		            },
   		            icon: Ext.MessageBox.QUESTION
   		        });
   		 }
        });
        
        //작업지시취소
        this.workCancleAction = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: '작업지시취소',
			 tooltip: '작업지시취소',
			 disabled: true,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '작업지시를 취소하시겠습니까?<br>!!!취소할 경우 계획완료상태로 돌아갑니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.workOrderCancle();
	            	        	//gMain.selPanel.doWorkOrder();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
        
      //작업완료
        this.pcsCompleteAction = Ext.create('Ext.Action', {
   		 text: '공정완료처리',
   		 tooltip: '모든공정이 완료됐지만 완료처리 안됐을때 실행',
   		 disabled: true,
   		 handler: function(widget, event) {
   		    	Ext.MessageBox.show({
   		            title: '공정완료처리',
   		            msg: '선택한 항목을 완료처리하시겠습니까?<br>!!!모든공정이 완료 됐지만 처리가 안됐을떄 실행하여야합니다.',
   		            buttons: Ext.MessageBox.YESNO,
   		            fn: function(result) {
            	        if(result=='yes') {
            	        	gMain.selPanel.pcsComplete();
            	        }
   		            	
   		            },
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
			disabled : false,
			handler : function() {
				var poducePlanGrid = Ext.getCmp('poducePlanGrid');
				
				
				var selections =  poducePlanGrid.getSelectionModel().getSelection();
				
				var unique_uid = -1;
				
				if(selections==null || selections.length==0) {
					unique_uid = 200;
				} else {
					var rec = selections[0];
					 unique_uid = rec.get('unique_uid');
					
				}
				
				console_logs('poducePlanGrid rec', rec);
				
				console_logs('unique_uid', unique_uid);
				
				// console_logs('rec', rec);
				Ext.Ajax.request({
							url : CONTEXT_PATH
									+ '/index/process.do?method=copyPartLineRow',
							params : {
								assymapUid : unique_uid
							},
							success : function(
									result,
									request) {
								gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
		                    	gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'pl_no');
		                    	gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code', 'R');
		                    	gm.me().AssemblyPartStore.load();
		                    	
		                    	gm.me().AssemblyPartStore2.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
		                    	gm.me().AssemblyPartStore2.getProxy().setExtraParam('orderBy', 'pl_no');
		                    	gm.me().AssemblyPartStore2.getProxy().setExtraParam('sp_code', 'O');
		                    	gm.me().AssemblyPartStore2.load();
		                    	
		                    	gm.me().AssemblyPartStore3.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
		                    	gm.me().AssemblyPartStore3.getProxy().setExtraParam('orderBy', 'pl_no');
		                    	gm.me().AssemblyPartStore3.getProxy().setExtraParam('sp_code', 'K');
		                    	gm.me().AssemblyPartStore3.load();
							},
							failure : extjsUtil.failureMessage
						});
				}
				

		});
		
		var removePartRowAction = Ext.create('Ext.Action',{
			iconCls : 'af-remove',
			text : '삭제',
			disabled : false,
			handler : function() {
				var poducePlanGrid = Ext.getCmp('poducePlanGrid');
				var rec = poducePlanGrid.getSelectionModel().getSelection()[0];
				var unique_uid = rec.get('unique_uid');
				
				if(unique_uid==undefined && unique_uid==null) { // 값이없으면 -> 신규등록
					gm.extFieldColumnStore.remove(rec);
				} else { // 수정.
	                Ext.Ajax.request({
	                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
	                    params: {
	                        DELETE_CLASS: 'assymap',
	                        uids: unique_uid
	                    },
	                    method: 'POST',
	                    success: function(rec) {
	                    	console_logs('load>>>>>>>>>>>>>>>>>>>');
//gm.extFieldColumnStore.remove(rec);
	                    	
	                    	gm.me().AssemblyPartStore.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
	                    	gm.me().AssemblyPartStore.getProxy().setExtraParam('orderBy', 'pl_no');
	                    	gm.me().AssemblyPartStore.getProxy().setExtraParam('sp_code', 'R');
	                    	gm.me().AssemblyPartStore.load();
	                    	
	                    	gm.me().AssemblyPartStore2.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
	                    	gm.me().AssemblyPartStore2.getProxy().setExtraParam('orderBy', 'pl_no');
	                    	gm.me().AssemblyPartStore2.getProxy().setExtraParam('sp_code', 'O');
	                    	gm.me().AssemblyPartStore2.load();
	                    	
	                    	gm.me().AssemblyPartStore3.getProxy().setExtraParam('parent_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
	                    	gm.me().AssemblyPartStore3.getProxy().setExtraParam('orderBy', 'pl_no');
	                    	gm.me().AssemblyPartStore3.getProxy().setExtraParam('sp_code', 'K');
	                    	gm.me().AssemblyPartStore3.load();
	                    	console_logs('fisish>>>>>>>>>>>>>>>>>>>');
	                    },
	                    failure: function(rec, op) {
	                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

	                    }
	                });
				}
				

			}
		});
		// 구매내역
		gm.extFieldColumnStore.load({
			params : {
				menuCode : 'SRO1_PUR'
			},
			callback : function(records, operation, success) {
				if (success == true) {
					var o = gm.parseGridRecord(records, 'workOrderGridS');
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
										allowBlank : false,
										minValue : 0
									};
									break;
								case 'sp_code':
									o['editor'] = new Ext.form.field.ComboBox(
											{
												typeAhead : true,
												triggerAction : 'all',
												displayField : 'code_name_kr',
												valueField : 'system_code',
												editable : false,
												store : gm.me().standardFlagStore,
												listConfig : {
													getInnerTpl : function() {
														return '<div data-qtip="{systemCode}">{codeName}</div>';
													}
												},
											});
									break;
								case 'description_src':
								case 'remark_src':
								case 'comment':
								case 'item_name':
								case 'specification':
									o['editor'] = {
// allowBlank : true
									};
								}
							});
					
					var cellEditing = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					
					var cellEditing2 = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					var cellEditing3 = new Ext.grid.plugin.CellEditing({
						clicksToEdit : 1
					});
					
					var grid = Ext.create('Ext.grid.Panel',{
								id : 'workOrderGridS',
								store : gm.me().AssemblyPartStore,
								title : '원지',
								border : true,
								resizable : true,
								scroll : false,
								multiSelect : true,
								collapsible : false,
								layout : 'fit',
								// forceFit: true,
								region : 'center',
								plugins : [ cellEditing ],
								dockedItems: [
							        {
							            dock: 'top',
							            xtype: 'toolbar',
							            cls: 'my-x-toolbar-default3',
							            items: [
							                    '-',
							 	   		    	saveAssymap,
							                    '->',
							                    calQuan,
							                    '-'
					      				        ]
								        },
								        {
											dock : 'top',
											xtype : 'toolbar',
											cls : 'my-x-toolbar-default3',
											items : [ '-', addPartRowAction, removePartRowAction ]
										}
							        ],
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

									}
								},// endof listeners
								columns : columns
							});
					
					grid.on('edit', function(a,b) {
						var rec = gm.me().AssemblyPartStore.data.items[0];
		    			
		    			gMain.selPanel.rItemSpec=rec.get('item_name')+rec.get('description_src')+" "+rec.get('specification')+" "+ rec.get('bm_quan')+"EA";
						gm.me().refreshPrchInfoAR();
					})
					
			if (checkbox == true) {
				grid.getSelectionModel().on({
// selectionchange : function(sm, selections) {
// if (selections.length) {
// var rec = selections[0];
// // console_logs(rec);
// gMain.selPanel.selectPcsRecord = rec;
// } else {
//			            	
// }
// }
				});

			}
			
			var grid2 = Ext.create('Ext.grid.Panel',{
				id : 'workOrderGridS2',
				store : gm.me().AssemblyPartStore2,
				title : '원단',
				border : true,
				resizable : true,
				scroll : false,
				multiSelect : true,
				collapsible : false,
				layout : 'fit',
				// forceFit: true,
				region : 'center',
				plugins : [ cellEditing2 ],
				dockedItems: [
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			                    '-',
			 	   		    	saveAssymap,
			                    '->',
			                    calQuan,
			                    '-'
	      				        ]
				        },
				        {
							dock : 'top',
							xtype : 'toolbar',
							cls : 'my-x-toolbar-default3',
							items : [ '-', addPartRowAction, removePartRowAction ]
						}
			        ],
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
						if (e.getKey() == Ext.EventObject.ENTER
								&& record
										.get('pcs_name').length > 0
								&& record
										.get('std_mh') >= 0) {

							// console_log("cellIndex-------------" +
							// cellIndex);
							// console_log("rowIndex-------------" + rowIndex);
							
							
							// Ext.getCmp('pcs_code').focus(true,100);
							// addPcsStd();
							// var pcs_name =
							// record.get('pcs_name');
							// if(checkPcsName(pcs_name)){
							savePcsStd();
							// } else {
							// alert(pcs_name+'
							// don\'t exist!');

							// }

							// save

						}

					}
				},// endof listeners
				columns : columns
			});
	
			if (checkbox == true) {
			grid.getSelectionModel().on({
			// selectionchange : function(sm, selections) {
			// if (selections.length) {
			// var rec = selections[0];
			// // console_logs(rec);
			// gMain.selPanel.selectPcsRecord = rec;
			// } else {
			//        	
			// }
			// }
			});
			
			}
			
			var grid3 = Ext.create('Ext.grid.Panel',{
				id : 'workOrderGridS3',
				store : gm.me().AssemblyPartStore3,
				title : '부자재',
				border : true,
				resizable : true,
				scroll : false,
				multiSelect : true,
				collapsible : false,
				layout : 'fit',
				// forceFit: true,
				region : 'center',
				plugins : [ cellEditing3 ],
				dockedItems: [
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			                    '-',
			 	   		    	saveAssymap,
			                    '->',
			                    calQuan,
			                    '-'
							        ]
				        },
				        {
							dock : 'top',
							xtype : 'toolbar',
							cls : 'my-x-toolbar-default3',
							items : [ '-', addPartRowAction, removePartRowAction ]
						}
			        ],
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
						if (e.getKey() == Ext.EventObject.ENTER
								&& record
										.get('pcs_name').length > 0
								&& record
										.get('std_mh') >= 0) {
			
							// console_log("cellIndex-------------" +
							// cellIndex);
							// console_log("rowIndex-------------" + rowIndex);
							
							
							// Ext.getCmp('pcs_code').focus(true,100);
							// addPcsStd();
							// var pcs_name =
							// record.get('pcs_name');
							// if(checkPcsName(pcs_name)){
							savePcsStd();
							// } else {
							// alert(pcs_name+'
							// don\'t exist!');
			
							// }
			
							// save
			
						}
			
					}
				},// endof listeners
				columns : columns
			});
			
			if (checkbox == true) {
			grid.getSelectionModel().on({
			// selectionchange : function(sm, selections) {
			// if (selections.length) {
			// var rec = selections[0];
			// // console_logs(rec);
			// gMain.selPanel.selectPcsRecord = rec;
			// } else {
			//
			// }
			// }
			});
			
			}
			
			
			
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
	            items: [grid,grid2,grid3]
	        });
			
			
			tabPanel.add(matTab);
					
					
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
        
        //버튼 추가.
//        buttonToolbar.insert(4, this.reWorkAction);
//        buttonToolbar.insert(4, '-');
        
        buttonToolbar.insert(3, this.rejectAction);
        buttonToolbar.insert(3, '-');
        buttonToolbar.insert(3, this.workCancleAction);
        buttonToolbar.insert(3, '-');
        buttonToolbar.insert(3, this.addWorkOrder);
        buttonToolbar.insert(3, '-');

        buttonToolbar.insert(9, this.printPDFAction);
        buttonToolbar.insert(9, '-');
        buttonToolbar.insert(9, this.pcsCompleteAction);
        buttonToolbar.insert(9, '-');

        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs(rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('coord_key3'); //assymap의 unique_id
            	gMain.selPanel.vSELECTED_PROJECT_UID = rec.get('ac_uid');//project의 uid
            	gMain.selPanel.vSELECTED_PRODUCT_CODE = rec.get('item_code'); //product의 item_code
            	gMain.selPanel.printPDFAction.enable();
            	console_logs('status=============================>',rec.get('status'));
            	if(rec.get('status')=='N'){
            	gMain.selPanel.workCancleAction.enable();
            	}
            	if(rec.get('status')=='P'){
                	this.rejectAction.enable();
                	gMain.selPanel.addWorkOrder.enable();
                	}
            	if(rec.get('status')=='W'||rec.get('status')=='N'){
            		gMain.selPanel.pcsCompleteAction.enable();
                	}
            	
                //판걸이 수량 체크
                this.handlerChangePanQty();
                
                gm.me().loadPrchPart4Edit(gMain.selPanel.vSELECTED_UNIQUE_ID);

            	
            } else {
            	gMain.selPanel.pcsCompleteAction.disable();
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.addWorkOrder.disable();
            	gMain.selPanel.printPDFAction.disable();
            	gMain.selPanel.workCancleAction.disable();
            	gMain.selPanel.rejectAction.disable();
            }
        	var processGrid = Ext.getCmp('workOrderGrid');
        	processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
        	processGrid.getStore().load(function (records){
        		console_logs('records', records);
        		
        	});
        })

        
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
				 var gridPcsStd = Ext.getCmp('workOrderGrid');
				 //console_logs('gridPcsStd', gridPcsStd);
				 //console_logs('gMain.selPanel.vSELECTED_UNIQUE_ID', gMain.selPanel.vSELECTED_UNIQUE_ID);
				 
			    	var modifiend =[];
			    	//var rec = gridPcsStd.getSelectionModel().getSelection()[0];
			    	//var unique_id = rec.get('unique_id');
			    	
			    	var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan');
			    	
			    	  var prevQty = Number(target_bm_quan.getValue());
			    	  var tomCheck = false;
			    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
			    	  {
			    	        var record = gridPcsStd.store.data.items [i];
	    	           		var pcs_no =  record.get('pcs_no');
	    	           		var pcs_code = record.get('pcs_code');
	    	           		var serial_no = Number(pcs_no) / 10;
	    	           		var plan_qty = record.get('plan_qty');
	    	           		
			    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
			    	           	console_log(record);
			    	           	var pcs_code = record.get('pcs_code').toUpperCase();
			    	           	if(gMain.checkPcsName(pcs_code)) {
			    	           		
			    	           		var plan_date = record.get('plan_date');
			    	           		var yyyymmdd ='';
			    	           		if(plan_date!=null) {
			    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
			    	           		}
			    	           		
		    	           			if(pcs_code=='TOM' && tomCheck==false) {
		    	           				var target_reserved_double3 = gMain.selPanel.getInputTarget('reserved_double3');
		    	           				prevQty = prevQty*Number(target_reserved_double3.getValue());
		    	           				tomCheck = true;
		    	           			}
		    	           			plan_qty = prevQty;
			    	           		
			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
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
			    						//alert('come');
			    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
			    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
			    						
			    					});
			    				}
			    		    });
			    	  }
			 }
			});
		
		var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '공정저장',
			 tooltip: '공정설계 내용 저장',
			 //toggleGroup: 'toolbarcmd',
			 handler: function() {
				 var gridPcsStd = Ext.getCmp('workOrderGrid');
				 //console_logs('gridPcsStd', gridPcsStd);
				 
			    	var modifiend =[];
//			    	var rec = gridPcsStd.getSelectionModel().getSelection()[0];
//			    	var unique_id = rec.get('unique_id');
			    	
			    	var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan');
			    	
			    	  var prevQty = Number(target_bm_quan.getValue());
			    	  var tomCheck = false;
			    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
			    	  {
			    	        var record = gridPcsStd.store.data.items [i];
	    	           		var pcs_no =  record.get('pcs_no');
	    	           		var pcs_code = record.get('pcs_code');
	    	           		var serial_no = Number(pcs_no) / 10;
	    	           		var plan_qty = record.get('plan_qty');
	    	           		
			    	        if (record.dirty) {
			    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
			    	           	console_log(record);
			    	           	var pcs_code = record.get('pcs_code').toUpperCase();
			    	           	if(gMain.checkPcsName(pcs_code)) {
			    	           		
			    	           		var plan_date = record.get('plan_date');
			    	           		var yyyymmdd ='';
			    	           		if(plan_date!=null) {
			    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
			    	           		}
			    	           		

			    	           		
			    	           		if(plan_qty==0) {
			    	           			if(pcs_code=='TOM' && tomCheck==false) {
			    	           				var target_reserved_double3 = gMain.selPanel.getInputTarget('reserved_double3');
			    	           				prevQty = prevQty*Number(target_reserved_double3.getValue());
			    	           				tomCheck = true;
			    	           			}
			    	           			plan_qty = prevQty;
			    	           		}
			    	           		
			    		           	var obj = {};
			    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
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
			    	           		//alert("공정명은 반드시 지정해야 합니다.");
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
			    						//alert('come');
			    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
			    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
			    						
			    					});
			    				}
			    		    });
			    	  }
			 }
			});
		
       //공정설계 gridPcsStd Tab 추가.
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
//			                    addPcsStep,
//			                    '-',

			                    '->',
			                    calcNumber,
			                    '-',
			                    {
			                    	iconCls: 'fa-bitbucket_14_0_5395c4_none',
		    						xtype: 'splitbutton',
		    					   	text: '템플리트',
		    					   	tooltip: '표준공정 템플리트',
		    					   	handler: function() {}, // handle a click on the button itself
		    					   	menu: new Ext.menu.Menu({
		    					        items: [
		    					                {
		    					                	text: '1000 - 미 입력',
		    					                	dataIndex: 1000,
		    					    				handler: function(o) {
		    					    					Ext.Msg.alert('안내', '준비중인 기능입니다.' + ' : ' + this['text']
		    					    							, function() {});
		    					    				}
		    					                }, {
		    					                	text: '1001 - 피자박스',
		    					                	dataIndex: 1001,
		    					    				handler: function(o) {
		    					    					Ext.Msg.alert('안내', '준비중인 기능입니다.' + ' : ' + this['text']
		    					    							, function() {});
		    					    				}
		    					   				}, {
		    					                	text: '1002 - 사과박스',
		    					                	dataIndex: 1002,
		    					    				handler: function(o) {
		    					    					Ext.Msg.alert('안내', '준비중인 기능입니다.' + ' : ' + this['text']
		    					    							, function() {});
		    					    				}
		    					   				}, {
		    					                	text: '1003 - 선물상자',
		    					                	dataIndex: 1003,
		    					    				handler: function(o) {
		    					    					Ext.Msg.alert('안내', '준비중인 기능입니다.' + ' : ' + this['text']
		    					    							, function() {});
		    					    				}
		    					                }
		    					                
		    					                ]
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
	            	//console_logs(rec);
	            	gMain.selPanel.selectPcsRecord = rec;
	            } else {
	            	
	            }
	        },
	        'workOrderGrid'//toolbar
		);

		
		

        this.callParent(arguments);
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.storeLoad = function() {
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
            		var delivery_info = rec.get('delivery_info');
            		var reserved_varchare = rec.get('reserved_varchare');
            		var order_com_unique = rec.get('order_com_unique');
            		
            		var pm_uid=rec.get('pm_uid');
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
            		
            		rec.set('delivery_info', delivery_info);
            		rec.set('reserved_varchare', reserved_varchare);
            		rec.set('pm_uid', pm_uid);
            		rec.set('order_com_unique', order_com_unique);
            		//console_logs('rec', rec);
            	}
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
                var processGrid = Ext.getCmp('workOrderGrid'/*gMain.getGridId()*/);
                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
                processGrid.getStore().load();
              });	
        };
        
        this.storeLoad();

    },

    selectPcsRecord: null,
    items : [],
    computeProduceQty: function(cur) {
		//console_logs('computeProduceQty cur', cur);
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
    
    refreshBladeInfoAll: function() {
//    	var val1 = gMain.getBladeInfoAll();
//    	var target1 = this.getInputTarget('blade_size_info1');
//    	target1.setValue(val1);
    },
    //원지/원단 수량 설정
    refreshBmquan: function(cur) {
		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(cur);
		
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(cur);
    },
    refreshProcess: function() {
    	
		var target_bm_quan = this.getInputTarget('bm_quan');
		var bm_quan = target_bm_quan.getValue();
		
		var o = Ext.getCmp(	this.link + '-'+ 'grid-top-spoQty' ).setText('생산수량: ' + bm_quan);
		
    	
//		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		var target_bm_quan1 = this.getInputJust('partline|bm_quan','1');
		var bm_quan1 = target_bm_quan1.getValue();
		Ext.getCmp(	this.link + '-'+ 'grid-top-paperQty' ).setText('원지수량: ' + bm_quan1);

		
		var val = gMain.getBladeInfo();
		Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo' ).setText(val);
		

    },
    //판걸이 수량이 변경된 andler
    handlerChangePanQty: function() {
    	//console_logs('handlerChangePanQty', 'in');
		var target_bm_quan = this.getInputTarget('bm_quan');
		var target_reserved_double3 = this.getInputTarget('reserved_double3');
		var target_reserved_double4 = this.getInputTarget('reserved_double4');
		var target_reserved_varcharc = this.getInputTarget('reserved_varcharc');
		
		 
		
		var qty = Number(target_bm_quan.getValue()) / Number(target_reserved_double3.getValue());
		//console_logs('qty', qty);
		target_reserved_double4.setValue(qty);
		
		var val = gMain.getBladeInfo();
		var target = this.getInputTarget('blade_size_info');
		target.setValue(val);

		this.refreshBladeInfo();
		this.refreshBladeInfoAll();
		
		target_reserved_varcharc.setValue(target_reserved_double3.getValue()+'ea');
    },
//    //구매/제작요청
//    doWorkOrder: function() {
//    	
//    	
////    	var target_reserved_double3 = this.getInputTarget('unique_id');
////    	var assymapUid = target_reserved_double3.getValue()
////    	
//    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
//    	
//    	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
//    	var assymapUid = this.vSELECTED_RECORD.get('unique_uid');
//    	
//	    Ext.Ajax.request({
//			url: CONTEXT_PATH + '/index/process.do?method=addWorkOrder',
//			params:{
//				assymapUid: assymapUid,
//				ac_uid: ac_uid
//			},
//			
//			success : function(result, request) { 
//				gain.selPanel.store.load();
//				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
//				
//			},//endofsuccess
//			failure: extjsUtil.failureMessage
//		});//endofajax
//    	
//    	
//    	
//
//    },
	    //작업지시
		addWorkOrderFc: function() {
	    	
	    	
//	    	var target_reserved_double3 = this.getInputTarget('unique_id');
//	    	var assymapUid = target_reserved_double3.getValue()
//	    	
	    	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

	    	var cartmapUid = this.vSELECTED_RECORD.get('unique_uid');
	    	
		    Ext.Ajax.request({
				url: CONTEXT_PATH + '/index/process.do?method=addWorkOrder',
				params:{
					cartmapUid: cartmapUid
				},
				
				success : function(result, request) { 
					gMain.selPanel.store.load();
					Ext.Msg.alert('안내', '요청하였습니다.', function() {});
					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax

	    },
    
	  //미완료처리			
	    pcsComplete: function() {
	   	
	   	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
	
	   	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
	   	
		    Ext.Ajax.request({
				url: CONTEXT_PATH + '/index/process.do?method=pcsComplete',
				params:{
					ac_uid: ac_uid,
				},
				
				success : function(result, request) { 
					gMain.selPanel.store.load();
					Ext.Msg.alert('안내', '해당 수주를 완료처리하였습니다.', function() {});
					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
	
    	},
		//계획반려			
	    	planReject: function() {
		   	
		   	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
		
		   	var status = this.vSELECTED_RECORD.get('status');
		   	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
		   	var cartmapUid = this.vSELECTED_RECORD.get('unique_uid');
		   	
			    Ext.Ajax.request({
					url: CONTEXT_PATH + '/index/process.do?method=planReject',
					params:{
						status: status,
						ac_uid: ac_uid,
						cartmapUid: cartmapUid,
					},
					
					success : function(result, request) { 
						gMain.selPanel.store.load();
						Ext.Msg.alert('안내', '반려처리가 완료되었습니다.', function() {});
						
					},//endofsuccess
					failure: extjsUtil.failureMessage
				});//endofajax
		
	    },
	    //작업지시 취소
    	workOrderCancle: function() {
	   	
	   	console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
	
	   	var cartmapUid = this.vSELECTED_RECORD.get('unique_uid');
	   	var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
	   	var status = this.vSELECTED_RECORD.get('status');
		    Ext.Ajax.request({
				url: CONTEXT_PATH + '/index/process.do?method=delWorkOrder',
				params:{
					cartmapUid: cartmapUid,
					ac_uid: ac_uid,
					status: status
				},
				
				success : function(result, request) { 
					gMain.selPanel.store.load();
					Ext.Msg.alert('안내', '작업지시를 취소하였습니다.', function() {});
					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
	
	   },
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
				listeners: {
					load: function(store, records, successful,operation, options) {
				   		 var rec1 = records[0];
						  if(rec1!=null){
							  console_logs('rec1@@@',rec1);
							  gMain.selPanel.rQty=rec1.get('bm_quan');
							  console_logs('rQty',gMain.selPanel.rQty);
							  gMain.selPanel.rItemSpec=rec1.get('item_name')+' '+rec1.get('description_src')+' '+rec1.get('specification')+ ' '+ gMain.selPanel.rQty+'EA';
				 	   		  gMain.selPanel.refreshPrchInfoAR();
						  }

					}
				}
		  }),
		  AssemblyPartStore2 : Ext.create('Mplm.store.AssemblyPartStore', {
			  listeners: {
					load: function(store, records, successful,operation, options) {
						  var rec2 = records[0];
						  if(rec2!=null){
							  console_logs('rec2@@@',rec2);
							  gMain.selPanel.oQty=rec2.get('bm_quan');
							  console_logs('oQty',gMain.selPanel.oQty);
						  }

					}
			  }
		  }),
		  AssemblyPartStore3 : Ext.create('Mplm.store.AssemblyPartStore', {}),
		  standardFlagStore : Ext.create('Mplm.store.StandardFlagStore', {}),
		  CostStore : Ext.create('Mplm.store.CostStore', {}),
		  
		  partReload(sp_code, parent_uid) {
			  var store =null;
			  switch(sp_code) {
			  case 'R':
				  store = this.AssemblyPartStore;
				  break;
			  case 'O':
				  store = this.AssemblyPartStore2;
				  break;
			  case 'K':
				  store = this.AssemblyPartStore3;
				  break;
			  }
			  
			  if(store!=null) {
				  store.getProxy().setExtraParam('parent_uid', parent_uid);
				  store.getProxy().setExtraParam('sp_code', sp_code);
				  store.getProxy().setExtraParam('orderBy', 'pl_no');
				  store.load();
				 
			  }
			  
		  },saveAssymapHandlerMulti : function() {
			  this.saveAssymapHandler(this.AssemblyPartStore);
			  this.saveAssymapHandler(this.AssemblyPartStore2);
			  this.saveAssymapHandler(this.AssemblyPartStore3);
		  },
		  
		  loadPrchPart4Edit : function(parent_uid) {
			  this.partReload('R', parent_uid);
			  this.partReload('O', parent_uid);
			  this.partReload('K', parent_uid);
		  },
		  loadPrchPart4create : function() {
			  this.partReload('R', 200);
			  this.partReload('O', 200);
			  this.partReload('K', 200);
		  },
		  prchCalQuan : function(){
			  this.prchmodify(this.AssemblyPartStore);
			  this.prchmodify(this.AssemblyPartStore2);
			  this.prchmodify(this.AssemblyPartStore3);
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
//			        		target.setValue(val);
			        		
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
			 refreshPrchInfoAR: function() {
			    	
			    	var val = gMain.getBladeInfo();
//					Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo'+'2' ).setText(val);
					
					var target_item_name = this.getInputTarget('item_name');
					var item_name = target_item_name.getValue();
//					Ext.getCmp(this.link + '-'+ 'grid-top-item_name'+'2').setText(item_name);
					
					var target_bm_quan = this.getInputTarget('bm_quan');
					var bm_quan = target_bm_quan.getValue();
					Ext.getCmp(	this.link + '-'+ 'grid-top-pqty'+'2').setText(val+'/'+item_name+'/'+' 생산수량: ' +bm_quan);
					
					Ext.getCmp(this.link + '-'+ 'grid-top-item_spec').setText('['+gMain.selPanel.rItemSpec+']');
					

			    },
			    rItemSpec:null
});