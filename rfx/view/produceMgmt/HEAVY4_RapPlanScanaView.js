//출하 관리
Ext.define('Rfx.view.produceMgmt.HEAVY4_RapPlanScanaView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'rapplan-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
   
			this.addSearchField('item_name');
			this.addSearchField('specification');
    		this.addSearchField('item_code');
  
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

    	
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		(buttonToolbar.items).each(function(item, index, length) {
			if (index == 1 || index == 2  || index == 3 || index == 5) {
				buttonToolbar.items.remove(item);
			}
		});
        
        
        if(vCompanyReserved4 == 'DABP01KR'){
        	this.editAction.setText('상세보기');
		}

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			console_logs('>> columnObj', columnObj);
			console_logs('>> dataIndex', dataIndex);
			columnObj['align'] = 'center';
			columnObj['style'] = 'center';
		});

        this.createStoreSimple({
			modelClass: 'Rfx.model.RapMgmt',
			//modelClass: 'Rfx.model.ManageProduct',
			pageSize: 500,
			sorters: [{
				property: 'unique_id',
				direction: 'desc'
			}],
			byReplacer: {

			},
			deleteClass: ['srcahd']

		}, {
			//groupField: 'parent_code'
		});

		this.store.getProxy().setExtraParam('bom_flag', 'T');
		this.store.getProxy().setExtraParam('sg_code', 'BOM');
		this.store.getProxy().setExtraParam('parent', '-1');
		this.store.getProxy().setExtraParam('parent_uid', '-1');
		
		this.addProductAction = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            disabled: true,
            handler: function() {
                gm.selPanel.addProduct();
            }
		});
        
        this.setAllView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '전체',
   			 tooltip: '전체',
   			 handler: function() {
   				gMain.selPanel.productviewType = 'ALL';
   				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
   				gMain.selPanel.store.load(function(){});
   			 }
   		});
           
       this.setPrdView = Ext.create('Ext.Action', {
             	 xtype : 'button',
      			 text: '제작',
      			 tooltip: '제작',
      			//pressed: true,
      			 handler: function() {
      				gMain.selPanel.productviewType = 'PRD';
      				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'PRD');
      				gMain.selPanel.store.load(function(){});
      			 }
      		});
           
        this.setPntView = Ext.create('Ext.Action', {
             	 xtype : 'button',
      			 text: '도장',
      			 tooltip: '도장',
      			//pressed: true,
      			 handler: function() {
      				gMain.selPanel.productviewType = 'PNT';
      				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'PNT');
      				gMain.selPanel.store.load(function(){});
      			 }
			  });
				
			
		this.produceAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '생산요청',
			tooltip: '생산요청',
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				gm.me().produceRequest();
			}
		});

		this.shipmentAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '출하요청',
			tooltip: '출하요청',
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				var rec = gm.me().grid.getSelectionModel().getSelection()[0];
				var pjG = pjHistoryGrid.getSelectionModel().getSelection();
				for(var i=0; i<pjG.length; i++) {
					var request_quan = pjG[i].get('req_quan');
					if(request_quan == null || request_quan < 1) {
						Ext.MessageBox.alert('알림','출하수량이 지정되지 않은 항목이 있습니다.');
						return;
					} 
				}	
					
				gm.me().combstBranchStore.getProxy().setExtraParam('wa_group_in', rec.get('wa_code'));
				gm.me().combstBranchStore.load(function() {
					gm.me().shipmentRequest(pjG);
				});
			}
		});

		this.doProduceAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '생산작업지시',
			tooltip: '생산작업지시',
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				gm.me().registPj();
			}
		});

		// this.projectHistoryAction = Ext.create('Ext.Action', {
		// 	xtype : 'button',
		// 	text: '이력보기',
		// 	tooltip: '수주/생산/출하 이력',
		// 	iconCls: 'fa-subscript_14_0_5395c4_none',
		// 	disabled: true,
		// //pressed: true,
		// 	handler: function() {
		// 		historyTab.expand();
		// 	}
		// });

		buttonToolbar.insert(1, '-');
		// buttonToolbar.insert(2, '-');
		buttonToolbar.insert(2, this.doProduceAction);
		// buttonToolbar.insert(4, '-');
		// buttonToolbar.insert(5, this.produceAction);
		// buttonToolbar.insert(4, '-');
		// buttonToolbar.insert(5, this.shipmentAction);
		buttonToolbar.insert(3, '-');
		// buttonToolbar.insert(4, this.projectHistoryAction);
		// buttonToolbar.insert(5, '-');

		// buttonToolbar.insert(7, '-');
        
        var arr=[];
        arr.push(buttonToolbar);
		arr.push(searchToolbar);
		
		Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
			switch(dataIndex) {
				case 'ship_req_qty':
					// columnObj["editor"] = {
					// 	xtype: 'numberfield'
					// };
					// columnObj["css"] = 'edit-cell';
					columnObj["renderer"] = function(value, meta) {
						meta.css = 'custom-column';
						return value;
					};
				break;
			}
		});
        
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	/*groupHeaderTpl: '<div><font color=#003471>{name} :: </font></div>'*/
	       	//groupHeaderTpl: '<input type="checkbox" id={name}_gr_chk onClick="gMain.selPanel.groupSelect(this.id, this.checked);" />&nbsp;&nbsp;{name}',
        	//ftype: 'grouping',
        	//startCollapsed: false,
        	
        	//groupHeaderTpl: '<input type="checkbox"/>&nbsp;&nbsp;{name}' //,
        	groupHeaderTpl: '{name}' //,
	       	
	       	/*['<span class="gridHeaderCheckbox"><input class="group-checkbox" type="checkbox" role="checkbox" id={name}_gr_chk value=checked onClick="gMain.selPanel.groupSelect(this.id, this.checked);">&nbsp;&nbsp;{name}</span>', {
                checked: function(name) {
                	console_logs('checked');
                  //  return groupFeature.isExpanded(name) ? 'checked=true' : 'checked=false';
                    return groupFeature.onGroupClick ? checked=true : checked=false;
                }
            }],*/
            
//            onGroupClick: function(view, group, idx, foo, e) {
//            	//startCollapsed: false
//            	try{
//            		this.groupFeature.isExpanded();
//            	}catch(e){
//            		console_logs('e', e);
//            	}
//            	
//            	
//	       		//return groupHeaderTpl='<input type="checkbox"/>111';
//			   }
        
	       	
		}); 
        
		var option = {
				features: [groupingFeature],
				listeners: {
			        groupclick: function (view, node, group, e, eOpts) {
			        	console_logs('groupclick', gMain.selPanel.po_no_records);
			        	
			        	var arr = '';
			        	
			        	var chk = true;
			        	
			        	
			        	
			        	for(var i=0; i<gMain.selPanel.po_no_records.length ; i++){
			        		arr = gMain.selPanel.po_no_records[i];
			        		console_logs('arr', arr);
			        		if(arr == group){
			        			chk = false;
			        			break;
			        		}else{
			        			chk = true;
			        		}
			        	};
			        	
			        	gMain.selPanel.groupSelect(group, chk);
			        	
			        	view.features[0].expand(group);
			            
			        }
			    },
		};

		// 안전재고수량 보다 출하가능수량이 적으면 표시
		this.rowClassFc = function(record, index) {
			var ship_avail_qty = record.get('ship_avail_qty');
				stock_qty_safe	= record.get('stock_qty_safe');

				if(ship_avail_qty == null || ship_avail_qty == undefined) {
					ship_avail_qty = 0;
				}
				if(stock_qty_safe == null || stock_qty_safe == undefined) {
					stock_qty_safe = 0;
				}
				 
				if(ship_avail_qty < stock_qty_safe) {
					return 'red-row';
				}
		}
        
      //grid 생성.
        //this.createGrid(searchToolbar, buttonToolbar);
		this.createGridCore(arr/*, option*/);
        
        //입력/상세 창 생성.
		// this.createCrudTab();

		var pjHistoryStore = Ext.create('Mplm.store.StockPjHistoryStore', {
		
		});
	
		var prdHistoryStore= Ext.create('Mplm.store.StockPrdHistoryStore', {
			
		});
	
		var shipHistoryStore= Ext.create('Mplm.store.StockShipHistoryStore', {
			
		});
		
		// var pjHistoryGrid = Ext.create('Ext.grid.Panel', {
		// 	id: 'pjHistoryGrid',
		// 	width: '100%',
		// 	cls : 'rfx-panel',
		// 	store: pjHistoryStore,
		// 	// bodyPadding: 10,
		// 	forceFit: true,
		// 	layout :'fit',
		// 	defaultType: 'textfield',
		// 	autoScroll : true,
		// 	autoHeight: true,
		// 	title: '생산이력',
		// 	plugins:Ext.create('Ext.grid.plugin.CellEditing', {
		// 		clicksToEdit: 1
		// 	}),
		// 	dockedItems: [{
		// 		dock: 'top',
		// 		xtype: 'toolbar',
		// 		cls:'my-x-toolbar-default1',
		// 		items: [this.shipmentAction, '->', this.buttonToolbar3]
		// 	}],
		// 	selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
		// 	columns: [
		// 		{
		// 			text:'상태',
		// 			width:'20%',
		// 			dataIndex:'status',
		// 			align:'center',
		// 			renderer: function(value, meta) {
		// 				switch(value) {
		// 					case 'CR':
		// 					return '계획대기';
		// 					case 'I':
		// 					return '작업정지';
		// 					case 'N':
		// 					return '생산대기';
		// 					case 'P':
		// 					return '계획완료';
		// 					case 'R':
		// 					return '접수대기';
		// 					case 'S':
		// 					return '생산중단';
		// 					case 'W':
		// 					return '생산중';
		// 					case 'Y':
		// 					return '생산완료';
		// 					default:
		// 					return value;
		// 				}
		// 			}
		// 		},{
		// 			text:'수주번호',
		// 			width:'30%',
		// 			dataIndex:'pj_code',
		// 			align:'center'
		// 		},{
		// 			text:'수주명',
		// 			width:'40%',
		// 			dataIndex:'pj_name',
		// 			align:'center'
		// 		},{
		// 			text:'납기일',
		// 			width:'20%',
		// 			dataIndex:'delivery_date',
		// 			align:'center',
		// 			renderer: function(value, meta) {
		// 				if(value != null && value.length > 0) {
		// 					value = value.substr(0,10);
		// 				}
		// 				return value;
		// 			},
		// 		},{
		// 			text:'등록날짜',
		// 			width:'20%',
		// 			dataIndex:'regist_date',
		// 			align:'center',
		// 			renderer: function(value, meta) {
		// 				if(value != null && value.length > 0) {
		// 					value = value.substr(0,10);
		// 				}
		// 				return value;
		// 			},
		// 		},{
		// 			text:'수주수량',
		// 			width:'20%',
		// 			dataIndex:'quan',
		// 			align:'center'
		// 		},
		// 		// {
		// 		// 	text:'단가',
		// 		// 	width:'20%',
		// 		// 	dataIndex:'sales_price',
		// 		// 	align:'center'
		// 		// },
		// 		// {
		// 		// 	text:'수주금액',
		// 		// 	width:'20%',
		// 		// 	dataIndex:'selling_price',
		// 		// 	align:'center'
		// 		// }
		// 		// ,{
		// 		// 	text:'재고수량',
		// 		// 	width:'20%',
		// 		// 	dataIndex:'stock_quan',
		// 		// 	align:'center'
		// 		// }
		// 		,{
		// 			text:'출하수량',
		// 			width:'20%',
		// 			dataIndex: 'do_qty',
		// 			// dataIndex:'ship_quan',
		// 			align:'center',
		// 			renderer: function(value, meta) {
		// 				if(value == null || value < 1) {
		// 					value = 0;
		// 				}
		// 				return value;
		// 			},
		// 		}
		// 		,{
		// 			text:'출하가능수량',
		// 			width:'20%',
		// 			dataIndex:'avail_quan',
		// 			align:'center'
		// 		}
		// 		,{
		// 			text:'요청수량',
		// 			width:'15%',
		// 			value:0,
		// 			dataIndex:'req_quan',
		// 			editor:{type: 'numberfield'},
		// 			renderer: function(value, meta) {
		// 				meta.css = 'custom-column';
		// 				return value;
		// 			},
		// 			// css: 'edit-cell',
		// 			align:'center'
		// 		},{
		// 			text:'변경사유',
		// 			width:'30%',
		// 			dataIndex:'reserved_varchark',
		// 			align:'center'
		// 		}
		// 	],
			
		// });
	
		var prdHistoryGrid = Ext.create('Ext.grid.Panel', {
			id: 'prdHistoryGrid',
			width: '100%',
			cls : 'rfx-panel',
			// bodyPadding: 10,
			forceFit: true,
			layout :'fit',
			defaultType: 'textfield',
			autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
			title: '생산이력',
			viewConfig: {
				getRowClass: function(record) {
					var status = record.get('status');
					switch(status) {
						case 'Y':
						return 'green-row';
					}
				}
			},
			columns: [
				{
					text:'진행상태',
					width:'20%',
					dataIndex: 'status',
					align:'center',
					renderer: function(value, meta) {
						switch(value) {
							case 'N':
							return '생산대기';
							case 'CR':
							return '계획대기';
							case 'Y':
							return '생산완료';
							case 'BM':
							return '입력중';
							case 'R':
							return '접수대기';
							case 'P':
							return '계획완료';
							case 'W':
							return '생산중';
							case 'S':
							return '생산중단';
							default:
							return value;
						}
					}
				},{
					text:'생산수량',
					width:'30%',
					dataIndex: 'bm_quan',
					align:'center'
				},{
					text:'요청날짜',
					width:'50%',
					dataIndex: 'create_date',
					align:'center',
					renderer: function(value, meta) {
						if(value != null && value.length > 0) {
							value = value.substr(0,10);
						}
						return value;
					},
				}
		],
			store: prdHistoryStore,
		});
	
		var shipHistoryGrid = Ext.create('Ext.grid.Panel', {
			id: 'shipHistoryGrid',
			width: '100%',
			cls : 'rfx-panel',
			// bodyPadding: 10,
			forceFit: true,
			layout :'fit',
			defaultType: 'textfield',
			autoScroll : true,
			autoHeight: true,
			title: '출하이력',
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
			viewConfig: {
				getRowClass: function(record) {
					var ship_state = record.get('ship_state');
					switch(ship_state) {
						case '배송완료':
						return 'green-row';
						case '반려':
						return 'red-row'
					}
				}
			},
			columns: [
				{
					text:'진행상태',
					width:'10%',
					dataIndex:'ship_state',
					align:'center'
				},{
					text:'수주번호',
					width:'15%',
					dataIndex: 'pj_code',
					align:'center'
				},{
					text:'출하수량',
					width:'15%',
					dataIndex:'do_qty',
					align:'center'
				},{
					text:'납품수량',
					width:'15%',
					dataIndex:'dl_qty',
					align:'center'
				},{
					text:'출하요청일자',
					width:'20%',
					dataIndex:'do_date',
					renderer: function(value, meta) {
						if(value != null && value.length > 0) {
							value = value.substr(0,10);
						}
						return value;
					},
					align:'center'
				},{
					text:'납품요청일자',
					with:'10%',
					dataIndex:'dl_date',
					renderer: function(value, meta) {
						if(value != null && value.length > 0) {
							value = value.substr(0,10);
						}
						return value;
					},
					align:'center'
				}
		],
			store: shipHistoryStore,
		});

		// pjHistoryGrid.getSelectionModel().on({
		// 	selectionchange: function(sm, selections) {
		// 		if(selections.length) {
		// 			console_logs('>>> pj history rec', selections);
		// 			var check = true;
		// 			var quans = 0;
		// 			for(var i=0; i<selections; i++) {
		// 				var rec = selections[i];
		// 					status = rec.get('status');
		// 					console_logs('>>>> status', status);
		// 					switch(status) {
		// 						case 'N':
		// 						case 'CR':
		// 						case 'Y':
		// 						case 'R':
		// 						case 'P':
		// 						case 'W':
		// 						case 'S':
		// 						break;
		// 						default:
		// 						check = false;
		// 						break;
		// 					}
		// 				};
		// 				if(check) {
		// 					gm.me().shipmentAction.enable();
		// 				} else {
		// 					gm.me().shipmentAction.disable();
		// 				}
		// 		} else {
		// 			gm.me().shipmentAction.disable();
		// 		}
		// 	}
		// });

		// pjHistoryGrid.on('edit', function(editor, e) {
		// 	var rec = e.record;
		// 		value = e.value;
		// 		quan = rec.get('quan') * 1;
		// 		avail_quan = rec.get('avail_quan') * 1;
		// 		try {
		// 			do_qty = rec.get('do_qty') * 1;
		// 		} catch (error) {
		// 			do_qty = 0;
		// 		}

		// 		if(value != null && value != undefined) {
		// 			if(value != null && avail_quan != null && value > avail_quan) {
		// 				Ext.MessageBox.alert('알림','최대 출하가능수량 만큼 출하요청 가능합니다.');
		// 				if(do_qty != null && do_qty > 0) {
		// 					rec.set('req_quan', avail_quan);
		// 				} else {
		// 					rec.set('req_quan', quan);
		// 				}
		// 			} else if (value*1  > 0) {
		// 				rec.set('req_quan', value);
		// 			}
		// 		}

		// });

		// var widgetTab = Ext.widget('tabpanel', {
		// 	layout: 'border',
		// 	border: true,
		// 	region: 'east',
		// 	width: '100%',
		// 	layoutConfig: {
		// 		columns: 2,
		// 		rows: 1
		// 	},
		// 	items: [pjHistoryGrid, /*prdHistoryGrid,*/ shipHistoryGrid]
		// });


// 		var historyTab = Ext.create('Ext.panel.Panel', {
// 			frame: true,
// 			activeTab:1,
// 			region:'east',
// 			width: 1200,
// 			collapsed: true,
// //	        scroll: true,
// //	        autoScroll: true,
//             title:  '이력보기',
//             layout: 'card',
//             cmpId: 'historyTab',
//             id: 'historyTab',
//             items: [
//                 widgetTab
//             ],
//             listeners: {
//                 'resize' : function(win,width,height,opt){
//                     //console_logs('getCrudviewSize', width);
//                     // gm.me().setCrudpanelWidth(width);
//                 },
//                 collapse : function() {
//                     if(gm.me().blockExpand) {
//                         gm.me().crudMode = 'VIEW';
//                     }
//                 }
// 			},
// 			tools:  [
//                 {
//                     xtype: 'tool',
//                     type: 'right',
//                     qtip: "접기",
//                     handler: function(e, target, header, tool){
//                         historyTab.collapsed ? historyTab.expand() : historyTab.collapse();

//                     }
//                 }
//             ]
// 		});

        Ext.apply(this, {
            layout: 'border',
			// items: [this.grid, historyTab]
			items: [this.grid]
        });

		this.callParent(arguments);
		
		this.addProductAction.enable();
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {

				var rec = gm.me().grid.getSelectionModel().getSelection()[0];
				var stock_quan = rec.get('stock_qty');
				var product_uid = rec.get('unique_id_long');
				var is_closed = rec.get('is_closed');

				//설계완료 되었을경우에만 활성화
				if(is_closed =='Y'){
					gm.me().doProduceAction.enable();
					gm.me().produceAction.enable();
				}else{
					gm.me().doProduceAction.disable();
					gm.me().produceAction.disable();
				}
				

				pjHistoryStore.getProxy().setExtraParam('product_uid', product_uid);
				shipHistoryStore.getProxy().setExtraParam('product_uid', product_uid);
				// prdHistoryStore.getProxy().setExtraParam('product_uid', product_uid);

				pjHistoryStore.load(function(record) {
					var quans = 0;
					for(var i=0; i<record.length; i++) {
						var quan = record[i].get('quan');
						if(quan != null && quan > 0) {
							quan = quan * 1;
						} else {
							quan = 0;
						}
						quans += quan;
						record[i].set('stock_quan', stock_quan);

						var do_qty = record[i].get('do_qty');
						if(do_qty != null && do_qty > 0) {
							record[i].set('avail_quan', quan - do_qty);
						} else {
							record[i].set('avail_quan', quan);
						}
						// record[i].set('avail_quan', stock_quan + quan);
					}
					gm.me().buttonToolbar3.items.items[1].update('총 출하가능수량: ' + quans);
				});
				shipHistoryStore.load();
				// prdHistoryStore.load();
            } else {
            	gm.me().doProduceAction.disable();
				gm.me().produceAction.disable();
            }
        	
        });

        //디폴트 로드
      
        gMain.setCenterLoading(false);
        
        this.store.load();

    },
	registPj: function() {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];
		var pj_name = selection.get('wa_name') + ', ' + selection.get('item_name') + ', ' + selection.get('specification');
		
		var pj_code = new Date();
		pj_code = Ext.Date.format(pj_code, 'YmdHis');

		var srcahd_uid = selection.get('unique_id_long');
		var pj_uid = selection.get('pj_uid');
		var sales_price = selection.get('sales_price');
		
		var formItems = [
			{
				xtype: 'fieldset',
				title: '생산정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					new Ext.form.Hidden({
						name: 'pj_type',
						value: 'P'
					}),
					new Ext.form.Hidden({
						name: 'pj_code',
						value: pj_code
					}),
					new Ext.form.Hidden({
						name: 'pj_uid',
						value: pj_uid
					}),
					new Ext.form.Hidden({
						name: 'srcahd_uid',
						value: srcahd_uid
					}),
                    new Ext.form.Hidden({
                        name: 'order_com_unique',
                        value: 79070000001
                    }),
                    new Ext.form.Hidden({
                        name: 'big_pcs_code',
                        value: 'RAP'
					}),
					{
						xtype: 'fieldcontainer',
						fieldLabel: 'Lot 명',
						combineErrors: true,
						msgTarget : 'side',
						layout: 'hbox',
						defaults: {
							flex: 1,
							hideLabel: true,
						},
						items: [
						{
							xtype     : 'textfield',
							id: gu.id('lot_no'),
							name      : 'lot_no',
							fieldLabel: 'LOT 명',
							margin: '0 5 0 0',
							width: 350,
							allowBlank: true,
							value : gm.me().lotname,
							fieldStyle: 'text-transform:uppercase',
							emptyText: '영문 대문자 및 숫자',
							validator: function(v) {
								gm.me().setCheckname(false);
								if (/[^a-zA-Z0-9_-]/g.test(v)) {
									v = v.replace(/[^a-zA-Z0-9_-]/g,'');
								}
								this.setValue(v.toUpperCase());
								return true;
							}
						},
						{
							xtype:'button',
							style: 'margin-left: 3px;',
							width : 100,
							text: '중복'+CMD_CONFIRM,
							//style : "width : 50px;",
							handler : function(){
								
								var po_no = gu.getCmp('lot_no').getValue();
								console_logs('po_no', po_no);
								if(po_no==null || po_no.length==0) {
									gm.me().setCheckname(false);
								} else {
									//중복 코드 체크
										Ext.Ajax.request({
										url: CONTEXT_PATH + '/index/process.do?method=checkName',				
										params:{
											po_no : po_no
										},
										
										success : function(result, request) {
											var resultText = result.responseText;
											
											if(resultText=='0') {
												gm.me().setCheckname(true);
												Ext.MessageBox.alert('정상', '사용가능합니다.');
												
											}else {
												gm.me().setCheckname(false);
												Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
											}
											
					
										},//Ajax success
										failure: extjsUtil.failureMessage
									}); 										
								}	
							}//endofhandler
						}
					]
					},
				
						
					{
						fieldLabel: '생산수량',
						xtype: 'numberfield',
						width:'100%',
						id: 'quan',
						name: 'quan',
						value: 0,
						minValue: 1
						// listeners: {
						// 	change: function(combo, value) {
						// 		var sales_price = Ext.getCmp('sales_price').getValue();
						// 		Ext.getCmp('selling_price').setValue(value * sales_price);
						// 	}
						// }
					}
					
				]
			},
			{
				xtype: 'fieldset',
				title: '제품정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel: '고객사',
						value: '자체생산',
						height: 30,
						width: '100%',
						editable: false,
						hidden: true,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}
					,
					{
						xtype: 'textfield',
						fieldLabel: '품명',
						value: selection.get('item_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '규격',
						value: selection.get('specification'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '재고수량',
						value: selection.get('stock_qty'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}, 
					// {
					// 	fieldLabel: '기존단가',
					// 	xtype: 'textfield',
					// 	width:'100%',
					// 	id: 'pre_sales_price',
					// 	name : 'pre_sales_price',
					// 	editable: false,
					// 	hidden: true,
					// 	fieldStyle: 'background-color: #FBF8E6;  background-image: none; ',
					// 	value: sales_price
					// }
				]
			}			
		]

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formRegistPj'),
			xtype: 'form',
			frame : false,
			border: false,
			width: '100%',
			bodyPadding: 10,
			region: 'center',
			layout: 'column',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
			},
			items: formItems
		});

		var items = [form];

		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: '생산작업지시',
			width: 600,
			height: 500,
			plain: true,
			items: items,
			buttons: [
				{
					text: CMD_OK,
					id: gu.id('pjBtn'),
					handler: function(btn) {
						if(btn == 'no') {
							prWin.close();
						} else {
							if(form.isValid()) {
								var val = form.getValues(false);
								console_logs('>>>>>Val', val);

								Ext.Ajax.request({
									url: CONTEXT_PATH + '/sales/productStock.do?method=stockHanaroProjectRegist',
									params: val,
									success: function(result, request) {
										gm.me().store.load();
										if(prWin) {
											prWin.close();
										}
										Ext.Msg.alert('안내', '등록하였습니다.', function() {});
									},
									failure: extjsUtil.failureMessage
								});

							}
						}
					}
				}, {
					text: CMD_CANCEL,
					handler: function(btn) {
						prWin.close();
					}
				}
			]
		});
		prWin.show();
	},

	produceRequest : function() {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];

		var formItems = [
			{
				xtype: 'fieldset',
				title: '요청정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					{
						fieldLabel: '생산요청 수량',
						xtype: 'numberfield',
						id: 'prd_req_qty',
						name: 'prd_req_qty',
						value: 0,
						minValue: 1
					}
				]
			}, {
				xtype: 'fieldset',
				title: '재고정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				default: {
					width: '100%',
					layout: {
						type: 'hbox'
					}
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel: '고객사',
						value: selection.get('wa_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '품명',
						value: selection.get('item_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						xtype: 'textfield',
						fieldLabel: '규격',
						value: selection.get('specification'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					},
					{
						fieldLabel: '재고 수량',
						xtype: 'textfield',
						id: 'stock_qty',
						name: 'stock_qty',
						value: selection.get('stock_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}, {
						fieldLabel: '생산중 수량',
						xtype: 'textfield',
						id: 'produce_qty',
						name: 'produce_qty',
						value: selection.get('produce_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}, {
						fieldLabel: '출하가능 수량',
						xtype: 'textfield',
						id: 'ship_avail_qty',
						name: 'ship_avail_qty',
						value: selection.get('ship_avail_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
					}
				]
			}
		]

		var form = Ext.create('Ext.form.Panel', {
			id: gu.id('formRegistPrd'),
			xtype: 'form',
			frame : false,
			border: false,
			width: '100%',
			bodyPadding: 10,
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			items: formItems
		});

		var items = [form];

		var prWin = Ext.create('Ext.Window', {
			modal: true,
			title: '생산요청',
			width: 700,
			height: 600,
			plain: true,
			items: items,
			buttons: [
				{
					text: CMD_OK,
					id: 'prdBtn',
					handler: function(btn) {
						if(btn == 'no') {
							prWin.close();
						} else {
							if(form.isValid()) {
								var val = form.getValues(false);
								var selection = gm.me().grid.getSelectionModel().getSelection()[0];
								var assymapUid = selection.get('assymap_uid');
								var ac_uid = selection.get('pj_uid');
								var pj_code = new Date();
								pj_code = Ext.Date.format(pj_code, 'YmdHis');

								form.submit({
									url: CONTEXT_PATH + '/index/process.do?method=addRequestStock',
									params:{
										assymapUid: assymapUid,
										ac_uid: ac_uid,
										pj_code:pj_code
									},
									success : function(result, request) { 
										gMain.selPanel.store.load();
										if(prWin) {
											prWin.close();
										}
										Ext.Msg.alert('안내', '요청하였습니다.', function() {});
										
									},// endofsuccess
									failure: extjsUtil.failureMessage
								});
							}
						}
					}
				}, {
					text: CMD_CANCEL,
					handler: function(btn) {
						prWin.close();
					}
				}
			]
		});
		prWin.show();
	},
	

	

	addDeliveryRequestFc: function(val, pj_rec) {
		console_logs('>>>>val' , val);

		var address = val['delivery_info'];
		var ship_qty = val['not_dl_qty'];
		var delivery_plan = val['delivery_plan'];
		var delivery_time = val['delivery_time'];

		var rec = gm.me().grid.getSelectionModel().getSelection()[0];

		var product_uid = rec.get('unique_id_long');
		// var pj_uid = rec.get('pj_uid');
		// var pj_code = new Date();
		// pj_code = Ext.Date.format(pj_code, 'YmdHis');

		var infos = [];
		for(var i=0; i<pj_rec.length; i++) {
			var r = pj_rec[i];
			infos.push(r.get('unique_id_long') + ':' + r.get('req_quan'));
			// req_quans.push(r.get('req_quan'));
		}

		Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/productStock.do?method=addStockShip',
			params:{
				address:address,
				ship_qty:ship_qty,
				delivery_plan:delivery_plan,
				delivery_time:delivery_time,
				product_uid:product_uid,
				infos:infos
				// pj_uid:pj_uid,
				// pj_code:pj_code
			},
			
			success : function(result, request) { 
				if(this.win) {
					this.win.close();
				}
				gm.me().store.load();				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
	},

	vMESSAGE: {
        PJ   : '생산이력',
        PRODUCE : '생산이력',
        SHIP   : '출하이력'
    },
	

setCheckname: function (b) {
	this.checkname = b;

	var btn = gu.getCmp('pjBtn');
	console_logs('상민',btn);
	if (b == true) {
		btn.enable();
	} else {
		btn.disable();
	}

},

	widgetFn: function() {

		var widgetTab = Ext.widget('tabpanel', {
			layout: 'border',
			border: true,
			region: 'east',
			width: '100%',
			layoutConfig: {
				columns: 2,
				rows: 1
			},
			items: [pjHistoryGrid, this.prdHistoryGrid, this.shipHistoryGrid]
		});

		return widgetTab;
	},

	prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: 'LOT 명',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
            id: gu.id('prwinopen-OK-button'),
            disabled: true,
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gm.me().checkname);
        		if(gm.me().checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{
                    	var form = gu.getCmp('formPanel').getForm();
						var cartmaparr =[];
						var assymaparr = [];
                    	var po_quan = 0;
                    	var reserved_double4 = 0;
                    	var selections = gm.me().grid.getSelectionModel().getSelection();
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid =  rec.get('unique_uid');  //CARTMAP unique_id
                    		cartmaparr.push(uid);
                    		var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
                    		
                    		console_logs('unit 수량', po_quan_unit);
                    		po_quan = po_quan + po_quan_unit;
                    		console_logs('po_quan 수량', po_quan);
                    		var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                    		reserved_double4 = reserved_double4 + tmp_weight;
                    		console_logs('중량', reserved_double4);
                    	}
                    	console_logs('cartmaparr', cartmaparr);
                    	//var cartmaparr = gm.me().cartmap_uids;
                    		var ac_uid = gm.me().vSELECTED_AC_UID;
                    		var pcs_code = gm.me().getProcessType();
                    		if(pcs_code == 'ACT-V') {
                    			pcs_code = 'ACT';
							};
							
							if(pcs_code == 'ACT') {
								var valveSelections = gm.me().gridValve.getSelectionModel().getSelection();
								
								for(var i=0; i< valveSelections.length; i++) {
									
									var unique_uid = valveSelections[i].get('unique_uid');
									
										assymaparr.push(unique_uid);
									
			
								}
                    		};
                    	
                    		prWin.setLoading(true); //<-------
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3 : pcs_code,
                                				po_quan: po_quan,
												reserved_double4 : reserved_double4,
												assymaparr : assymaparr
                               				},
                                			success: function(val, action){
                                				//prWin.close();
                                				//gm.me().storeLoad();
                                				
                                				var myWin = prWin; //<-------
                                				gm.me().store.load(function(records) {
                                	            	
                                	            	myWin.close(); //<-------
												});
												
												if(pcs_code == "ACT"){
													gm.me().valveNoStore.load(function(records){
														console_logs('gm.me().valveNoStore.load records', records);
														if(records!=null) {
															var o = gu.getCmp('valve_quan');
															if (o != null) {
										
																o.update( '총수량: ' + records.length);
															}
														};

														if(records.length==0){
															gm.me().planFinishByCartmap(cartmaparr);
														}
													});
												}
                                				
                                			},
                                			failure: function(val, action){
                                				 prWin.close();
                                			}
                    		}); 
    			}// checkname of end
        	
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prWin) {
        			
        			prWin.close();
        			
        		}
        	}
		}]
    });
	  prWin.show();
    },

	// widgetTab : Ext.widget('tabpanel', {
	// 	layout: 'border',
	// 	border: true,
	// 	region: 'east',
	// 	width: '100%',
	// 	layoutConfig: {
	// 		columns: 2,
	// 		rows: 1
	// 	},
	// 	items: [this.pjHistoryGrid, this.prdHistoryGrid, this.shipHistoryGrid]
	// }),

	buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #133160; font-weight: bold; font-size: 15px;',
            text: '총 출하가능수량: 0'
        }]
    }),

	setPartFormObj: function(o) {
		console_logs('setPartFormObj o', o);

		// gu.getCmp('unique_id').setValue(o['unique_id_long']);
		gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);
	},

	combstBranchStore: Ext.create('Mplm.store.CombstBranchStore', {}),
	
    searchStore : Ext.create('Mplm.store.MaterialSearchStore', {

	}),
	
	projectStore: Ext.create('Mplm.store.ProjectStore', {

	})
});
