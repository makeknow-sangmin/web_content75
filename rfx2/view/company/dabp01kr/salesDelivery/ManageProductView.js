//출하 관리
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.ManageProductView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'manage-product-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
        switch(vCompanyReserved4){	
        case 'DABP01KR' :
        	this.addSearchField (
			{
				type: 'combo'
				,field_id: 'user_name'
				,store: 'UserDeptStoreOnly'
				,params: {hasNull:true, dept_code: '02'}
				,displayField:   'user_name'
				,valueField:   'user_name'
				,innerTpl	:'<div data-qtip="{user_name}">{user_name}</div>'
			});
			this.addSearchField('item_name');
			this.addSearchField('specification');
    		this.addSearchField('wa_name');
    		this.addSearchField('item_code');
    		
    		break;
    		default : 
    			break;
        }
    	
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

    	
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		
		(buttonToolbar.items).each(function(item, index, length) {
			if (index == 1 || index == 2  || index == 3 ) {
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
			modelClass: 'Rfx.model.ManageProduct',
			pageSize: 500,
			sorters: [{
				property: 'unique_id',
				direction: 'desc'
			}],
			byReplacer: {

			},
			deleteClass: ['product']

		}, {
			//groupField: 'parent_code'
		});
		
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

		this.projectAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '수주등록',
			tooltip: '수주등록',
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				gm.me().registPj();			
			}
		});

		this.projectHistoryAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '이력보기',
			tooltip: '수주/생산/출하 이력',
			iconCls: 'fa-subscript_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				historyTab.expand();
			}
		});

		this.changeCtrFlagAction = Ext.create('Ext.Action', {
			xtype : 'button',
			text: '주문수주',
			tooltip: '주문수주로 변경',
			iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			disabled: true,
		//pressed: true,
			handler: function() {
				Ext.MessageBox.show({
					title:'확인',
					msg: '해당 제품의 유형을 주문수주로 변경하시겠습니까?',
					buttons: Ext.MessageBox.YESNO,
					fn:  function(result) {
						if(result=='yes') {
							gm.me().changeCtrFlag();
						}
					},
					// animateTarget: 'mb4',
					icon: Ext.MessageBox.QUESTION
				});
				
			}
		});

		buttonToolbar.insert(1, '-');
		// buttonToolbar.insert(2, '-');
		buttonToolbar.insert(2, this.projectAction);
		// buttonToolbar.insert(4, '-');
		// buttonToolbar.insert(5, this.produceAction);
		// buttonToolbar.insert(4, '-');
		// buttonToolbar.insert(5, this.shipmentAction);
		buttonToolbar.insert(3, '-');
		buttonToolbar.insert(4, this.projectHistoryAction);
		buttonToolbar.insert(5, '-');
		buttonToolbar.insert(6, this.changeCtrFlagAction);
		buttonToolbar.insert(7, '-');

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
		
		var pjHistoryGrid = Ext.create('Ext.grid.Panel', {
			id: 'pjHistoryGrid',
			width: '100%',
			cls : 'rfx-panel',
			store: pjHistoryStore,
			// bodyPadding: 10,
			forceFit: true,
			layout :'fit',
			defaultType: 'textfield',
			autoScroll : true,
			autoHeight: true,
			title: '수주이력',
			bbar: getPageToolbar(pjHistoryStore),
			plugins:Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			}),
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				cls:'my-x-toolbar-default1',
				items: [this.shipmentAction, '->', this.buttonToolbar3]
			}],
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
			columns: [
				{
					text:'상태',
					width:'20%',
					dataIndex:'status',
					align:'center',
					renderer: function(value, meta) {
						switch(value) {
							case 'CR':
							return '계획대기';
							case 'I':
							return '작업정지';
							case 'N':
							return '생산대기';
							case 'P':
							return '계획완료';
							case 'R':
							return '접수대기';
							case 'S':
							return '생산중단';
							case 'W':
							return '생산중';
							case 'Y':
							return '생산완료';
							default:
							return value;
						}
					}
				},{
					text:'수주번호',
					width:'30%',
					dataIndex:'pj_code',
					align:'center'
				},{
					text:'수주명',
					width:'40%',
					dataIndex:'pj_name',
					align:'center'
				},{
					text:'납기일',
					width:'20%',
					dataIndex:'delivery_date',
					align:'center',
					renderer: function(value, meta) {
						if(value != null && value.length > 0) {
							value = value.substr(0,10);
						}
						return value;
					},
				},{
					text:'등록날짜',
					width:'20%',
					dataIndex:'regist_date',
					align:'center',
					renderer: function(value, meta) {
						if(value != null && value.length > 0) {
							value = value.substr(0,10);
						}
						return value;
					},
				},{
					text:'수주수량',
					width:'20%',
					dataIndex:'quan',
					align:'center'
				},{
					text:'단가',
					width:'20%',
					dataIndex:'sales_price',
					align:'center'
				},{
					text:'수주금액',
					width:'20%',
					dataIndex:'selling_price',
					align:'center'
				}
				// ,{
				// 	text:'재고수량',
				// 	width:'20%',
				// 	dataIndex:'stock_quan',
				// 	align:'center'
				// }
				,{
					text:'출하수량',
					width:'20%',
					dataIndex: 'do_qty',
					// dataIndex:'ship_quan',
					align:'center',
					renderer: function(value, meta) {
						if(value == null || value < 1) {
							value = 0;
						}
						return value;
					},
				}
				,{
					text:'출하가능수량',
					width:'20%',
					dataIndex:'avail_quan',
					align:'center'
				}
				,{
					text:'요청수량',
					width:'15%',
					value:0,
					dataIndex:'req_quan',
					editor:{type: 'numberfield'},
					renderer: function(value, meta) {
						meta.css = 'custom-column';
						return value;
					},
					// css: 'edit-cell',
					align:'center'
				},{
					text:'변경사유',
					width:'30%',
					dataIndex:'reserved_varchark',
					align:'center'
				}
			],
			
		});
	
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
			bbar: getPageToolbar(shipHistoryStore),
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

		pjHistoryGrid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
					console_logs('>>> pj history rec', selections);
					var check = true;
					var quans = 0;
					for(var i=0; i<selections; i++) {
						var rec = selections[i];
							status = rec.get('status');
							console_logs('>>>> status', status);
							switch(status) {
								case 'N':
								case 'CR':
								case 'Y':
								case 'R':
								case 'P':
								case 'W':
								case 'S':
								break;
								default:
								check = false;
								break;
							}
						};
						if(check) {
							gm.me().shipmentAction.enable();
						} else {
							gm.me().shipmentAction.disable();
						}
				} else {
					gm.me().shipmentAction.disable();
				}
			}
		});

		pjHistoryGrid.on('edit', function(editor, e) {
			var rec = e.record;
				value = e.value;
				quan = rec.get('quan') * 1;
				avail_quan = rec.get('avail_quan') * 1;
				try {
					do_qty = rec.get('do_qty') * 1;
				} catch (error) {
					do_qty = 0;
				}

				if(value != null && value != undefined) {
					if(value != null && avail_quan != null && value > avail_quan) {
						Ext.MessageBox.alert('알림','최대 출하가능수량 만큼 출하요청 가능합니다.');
						if(do_qty != null && do_qty > 0) {
							rec.set('req_quan', avail_quan);
						} else {
							rec.set('req_quan', quan);
						}
					} else if (value*1  > 0) {
						rec.set('req_quan', value);
					}
				}

		});

		var widgetTab = Ext.widget('tabpanel', {
			layout: 'border',
			border: true,
			region: 'east',
			width: '100%',
			layoutConfig: {
				columns: 2,
				rows: 1
			},
			items: [pjHistoryGrid, /*prdHistoryGrid,*/ shipHistoryGrid]
		});


		var historyTab = Ext.create('Ext.panel.Panel', {
			frame: true,
			activeTab:1,
			region:'east',
			width: 1200,
			collapsed: true,
//	        scroll: true,
//	        autoScroll: true,
            title:  '이력보기',
            layout: 'card',
            cmpId: 'historyTab',
            id: 'historyTab',
            items: [
                widgetTab
            ],
            listeners: {
                'resize' : function(win,width,height,opt){
                    //console_logs('getCrudviewSize', width);
                    // gm.me().setCrudpanelWidth(width);
                },
                collapse : function() {
                    if(gm.me().blockExpand) {
                        gm.me().crudMode = 'VIEW';
                    }
                }
			},
			tools:  [
                {
                    xtype: 'tool',
                    type: 'right',
                    qtip: "접기",
                    handler: function(e, target, header, tool){
                        historyTab.collapsed ? historyTab.expand() : historyTab.collapse();

                    }
                }
            ]
		});

        Ext.apply(this, {
            layout: 'border',
			items: [this.grid, historyTab]
        });

		this.callParent(arguments);
		
		this.addProductAction.enable();
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
				gm.me().projectAction.enable();
				gm.me().projectHistoryAction.enable();
				gm.me().changeCtrFlagAction.enable();
				gm.me().produceAction.enable();
				// gm.me().shipmentAction.enable();

				var rec = gm.me().grid.getSelectionModel().getSelection()[0];
				var stock_quan = rec.get('stock_qty');
				var product_uid = rec.get('unique_id_long');

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
            	gm.me().projectAction.disable();
				gm.me().projectHistoryAction.disable();
				gm.me().changeCtrFlagAction.disable();
				gm.me().produceAction.disable();
				// gm.me().shipmentAction.disable();
            }
        	
        });

        //디폴트 로드
      
        gMain.setCenterLoading(false);
        
        this.store.load();

	},
	changeCtrFlag: function() {
		var select = gm.me().grid.getSelectionModel().getSelection()[0];
			unique_id = select.get('unique_id_long'); // product uid

			Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/productStock.do?method=changeCtrFlag',
				params:{
					unique_id:unique_id
				},
				
				success : function(result, request) { 
					gm.me().store.load();
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
	},
	registPj: function() {
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];
		var pj_name = selection.get('wa_name') + ', ' + selection.get('item_name') + ', ' + selection.get('specification');
		
		// var pj_code = new Date();
		// pj_code = Ext.Date.format(pj_code, 'YmdHis');

		var product_uid = selection.get('unique_id_long');
		var pj_uid = selection.get('pj_uid');
		var sales_price = selection.get('sales_price');
		var srcahd_uid = selection.get('uid_srcahd');
		
		var formItems = [
			{
				xtype: 'fieldset',
				title: '수주정보',
				collapsible: false,
				width: '100%',
				style: 'padding:10px',
				layout: 'column',
				items: [
					new Ext.form.Hidden({
						name: 'pj_type',
						value: 'R'
					}),
					new Ext.form.Hidden({
						name: 'pj_code',
						// value: pj_code
					}),
					new Ext.form.Hidden({
						name: 'pj_uid',
						value: pj_uid
					}),
					new Ext.form.Hidden({
						name: 'product_uid',
						value: product_uid
					}),
					new Ext.form.Hidden({
						name: 'srcahd_uid',
						value: srcahd_uid
					}),
					{
						fieldLabel: '수주명',
						xtype: 'textfield',
						id: 'pj_name',
						name: 'pj_name',
						width:'100%',
						value: pj_name
					}, {
						fieldLabel: '납기일',
						xtype: 'datefield',
						id: 'req_date',
						name: 'req_date',
						format: 'Y-m-d',
						submitFormat: 'Y-m-d',
						dateFormat: 'Y-m-d',
						width:'100%',
						anchor: '100%'
					}, {
						fieldLabel: '수주수량',
						xtype: 'numberfield',
						width:'100%',
						id: 'quan',
						name: 'quan',
						value: 0,
						minValue: 1,
						listeners: {
							change: function(combo, value) {
								var sales_price = Ext.getCmp('sales_price').getValue();
								Ext.getCmp('selling_price').setValue(value * sales_price);
							}
						}
					}, {
						fieldLabel: '수주금액',
						xtype: 'numberfield',
						width:'100%',
						id: 'selling_price',
						name : 'selling_price',
						value: 0
					}, {
						fieldLabel: '수주단가',
						xtype: 'numberfield',
						width:'100%',
						id: 'sales_price',
						name : 'sales_price',
						value: sales_price,
						listeners: {
							change: function(combo, value) {
								var quan = Ext.getCmp('quan').getValue();
								Ext.getCmp('selling_price').setValue(value * quan);
							}
						}
					},{
						xtype: 'textarea',
						id:'reserved_varchark',
						name:'reserved_varchark',
						rows:5,
						fieldLabel: '변경사유',
						width: '100%'
					},
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
						value: selection.get('wa_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					},
					{
						xtype: 'textfield',
						fieldLabel: '품명',
						value: selection.get('item_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					},
					{
						xtype: 'textfield',
						fieldLabel: '규격',
						value: selection.get('specification'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					},
					{
						xtype: 'textfield',
						fieldLabel: '재고수량',
						value: selection.get('stock_qty'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					}, {
						fieldLabel: '기존단가',
						xtype: 'textfield',
						width:'100%',
						id: 'pre_sales_price',
						name : 'pre_sales_price',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;',
						value: sales_price
					}
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
			title: '수주등록',
			width: 700,
			height: 600,
			plain: true,
			items: items,
			buttons: [
				{
					text: CMD_OK,
					id: 'pjBtn',
					handler: function(btn) {
						if(btn == 'no') {
							prWin.close();
						} else {
							if(form.isValid()) {
								var val = form.getValues(false);
								console_logs('>>>>>Val', val);

								var fullYear = gUtil.getFullYear()+'';
								var month = gUtil.getMonth()+'';
								if(month.length==1) {
									month = '0' + month;
								}
								var pj_code = fullYear.substring(2,4) + month;
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
									params:{
										pj_first: pj_code,
										codeLength: 5
									},
									success : function(result, request) {   	
										var result = result.responseText;
										var copy_pjcode = result;
										val['pj_code'] = copy_pjcode;

										Ext.Ajax.request({
											url: CONTEXT_PATH + '/sales/productStock.do?method=stockProjectRegist',
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
										
									},// endofsuccess
									failure: extjsUtil.failureMessage
								});// endofajax
								

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
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					},
					{
						xtype: 'textfield',
						fieldLabel: '품명',
						value: selection.get('item_name'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					},
					{
						xtype: 'textfield',
						fieldLabel: '규격',
						value: selection.get('specification'),
						height: 30,
						width: '100%',
						editable: false,
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
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
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					}, {
						fieldLabel: '생산중 수량',
						xtype: 'textfield',
						id: 'produce_qty',
						name: 'produce_qty',
						value: selection.get('produce_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
					}, {
						fieldLabel: '출하가능 수량',
						xtype: 'textfield',
						id: 'ship_avail_qty',
						name: 'ship_avail_qty',
						value: selection.get('ship_avail_qty'),
						editable: false,
						height: 30,
						width: '100%',
						fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
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

								// Ext.Ajax.request({
								// 	url: CONTEXT_PATH + '/index/process.do?method=addRequest',
								// 	params:{
								// 		assymapUid: assymapUid,
								// 		ac_uid: ac_uid
								// 	},
								// 	success : function(result, request) { 
								// 		gMain.selPanel.store.load();
								// 		Ext.Msg.alert('안내', '요청하였습니다.', function() {});
										
								// 	},// endofsuccess
								// 	failure: extjsUtil.failureMessage
								// });// endofajax
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

	shipmentRequest: function(pj_rec) {
		// console_logs('>>>> rec', rec);

		var rec = gm.me().grid.getSelectionModel().getSelection()[0];

		var task_title = rec.get('wa_name');
		var reminder = rec.get('pj_name');
		var description = rec.get('pj_description');
		var delivery_info = rec.get('address_1');
		var not_dl_qty = rec.get('not_dl_qty');
		var delivery_plan = Ext.Date.add(new Date(), Ext.Date.DAY, 14);
		console_logs('>>> delivery_plan', delivery_plan);
		var noti_flag = rec.get('noti_flag');
		var IsAllDay = rec.get('is_all_day');
		var ship_avail_qty = rec.get('ship_avail_qty');

		var stock = rec.get('stock_qty');
		console_logs('>>>> pj_rec', pj_rec);
		var quans = stock;
		var pj_quans = 0;
		for(var i=0; i<pj_rec.length; i++) {
			var r = pj_rec[i];
			quans += r.get('req_quan') * 1;
			pj_quans += r.get('req_quan') * 1;
		}
		
		//포장단위
		var unit_code=rec.get('unit_code');//포장단위 BOX/VENDING
		console_logs('unit_code@@@@',unit_code);
		if(unit_code=='UNIT_PC'){
			unit_code='BOX';
//					var reserved_number4 = rec.get('reserved_number4');//포장수량
//					var reserved6 = rec.get('reserved6');//품명
//					var reserved7 = rec.get('reserved7');//가로
//					var reserved8 = rec.get('reserved8');//세로
//					var reserved9 = rec.get('reserved9');//높이
//					var reserved10 = rec.get('reserved10');//적재패턴
//					var reserved11 = rec.get('reserved11');//비고
			//카톤박스
			var reserved_number4 = rec.get('reserved15');//포장수량
			var reserved6 = rec.get('reserved6');//품명
			var reserved2 = rec.get('reserved7');//가로
			var reserved3 = rec.get('reserved8');//세로
			var reserved4 = rec.get('reserved9');//높이
			var reserved10 = rec.get('reserved10');//적재패턴
			var reserved11 = rec.get('reserved11');//비고
			
		}else{//UNIT_SET
			unit_code='VENDING';
			//팔레트
//					var reserved_double5 = rec.get('reserved14');//적재수량
			var reserved_number4 = rec.get('reserved14');//적재수량
			var reserved1 = rec.get('reserved1');//유형
			var reserved2 = rec.get('reserved2');//가로
			var reserved3 = rec.get('reserved3');//세로
			var reserved4 = rec.get('reserved4');//높이
			var reserved5 = rec.get('reserved5');//무게

		}
		
		console_logs('not_dl_qty',not_dl_qty);
		console_logs('reserved2',reserved2);
		var ea = 0;
		if(reserved_number4>0){
			ea = Math.ceil((Number(not_dl_qty)/Number(reserved_number4))); //.toFixed(0);
		}
		
		var prd_vol = Number(ea*reserved2*reserved3*reserved4);
				
		var form = Ext.create('Ext.form.Panel', {
			defaultType: 'textfield',
			border: false,
			bodyPadding: 15,
			region: 'center',
			defaults: {
				anchor: '100%',
				allowBlank: false,
				msgTarget: 'side',
				labelWidth: 80
			},
			 items: [
						{
							xtype: 'component',
	//									html: msg,
							anchor: '100%'
						},{
							xtype:'combo',
							fieldLabel:'고객사<br>(본사/지사)',
							id:'task_title',
							name:'task_title',
							anchor:'100%',
							store:gm.me().combstBranchStore,
							valueField:'unique_id',
							displayField:'wa_name',
							value:task_title,
							minChars:2,
							listConfig: {
								loadingText:'검색중..',
								emptyText:'일치하는 항목 없음',
								getInnerTpl: function() {
									return '<div data-qtip="{unique_id}">{wa_name}</div>';
								}
							},
							listeners: {
								select: function(combo, record) {
									var address = record.get('address_1');
									Ext.getCmp('delivery_info').setValue(address);
								}
							}

						}
						// ,{
						// 	xtype: 'textfield',
						// 	fieldLabel: '고객사',
						// 	name: 'task_title',
						// 	value:  task_title,
						// 	anchor: '100%',
						// 	fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
						// 	readOnly: true
						// }
						,{
							xtype: 'textfield',
							fieldLabel: '제품명',
							name: 'reminder',
							value:  reminder,
							anchor: '100%',
							fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
							readOnly: true
						},{
							xtype: 'textarea',
							fieldLabel: '상세설명',
							name: 'description',
							value:  description,
							anchor: '100%',
							grow: true,
							growMax: 150,
							maxLength:10000,
							anchor: '100%',
							fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
							readOnly: true
						},{
							xtype: 'textfield',
							fieldLabel: '배송지',
							id: 'delivery_info',
							name: 'delivery_info',
							value:  delivery_info,
							anchor: '100%'
						},
						// {
						// 	xtype: 'numberfield',
						// 	fieldLabel: '납품계획수량',
						// 	name: 'not_dl_qty',
						// 	value: pj_quans,
						// 	// value:  not_dl_qty,
						// 	anchor: '100%',
						// 	listeners: {
						// 			change: function(field, value) {
									
						// 				// if(reserved_number4>0){
						// 				// 	ea = Math.ceil((Number(value)/Number(reserved_number4))); //.toFixed(0);
						// 				// }else{
						// 				// 	var ea = 0;
						// 				// }
						// 				// var prd_vol = Number(ea*reserved2*reserved3*reserved4);

						// 				// Ext.getCmp('prd_vol').setValue(prd_vol);
						// 				// Ext.getCmp('prd_ea').setValue(ea);
						// 				// Ext.getCmp('car_vol').getValue(car_vol);
									
						// 				// var car_vol = Ext.getCmp('car_vol').getValue();
						// 				// if(car_vol>0&&prd_vol>0){
						// 				// 		weight_percent = Number(prd_vol/car_vol)*100;
						// 				// }else{
						// 				// 		var weight_percent = 0;
						// 				// };
											
											
											
						// 				// Ext.getCmp('weight_percent').setValue(weight_percent.toFixed(2));
									
										
						// 			}
						// 	}
						// }
						,{
							xtype: 'datefield',
							fieldLabel: '배송일시',
							name: 'delivery_plan',
							value:  delivery_plan,
							anchor: '100%'
						},{
							xtype: 'timefield',
	//						            labelWidth: 0,
							fieldLabel: '배송시간',
							name: 'delivery_time',
							anchor: '100%',
	//						            hideLabel: true,
							width: 110,
							minValue: '7:00 AM',
							maxValue: '11:00 PM',
							value: '7:00 AM',
							increment: 30,
							format: 'H:i'
						},{
							xtype:'textfield',
							fieldLabel:'출하수량',
							anchor:'100%',
							readOnly:true,
							// value: ship_avail_qty,
							value: quans,
							fieldStyle: 'background-color: #FBF8E6;  background-image: none; font-size:16px;'
						}
						
						/*,{
							xtype: 'combo',
							fieldLabel: '차량지정',
							name: 'noti_flag',
							value:  noti_flag,
							anchor: '100%',
							store: Ext.create('Mplm.store.CarMgntStore',{})
							,displayField: 'reserved_varchar1'
							,valueField: 'class_code'
							,innerTpl	: '<div data-qtip="{unique_id}">{reserved_varchar1}</div>',
							triggerAction: 'all',
							listeners: {
								select: function(combo, record) {
									var horizon = record.get('reserved_double1'); //가로
									var vertical = record.get('reserved_double2'); //세로
									var height = record.get('reserved_double3'); //높이
									var allow_weight = record.get('reserved_double4'); //허용하중
									
									var car_vol = Number(horizon*vertical*height);
									var weight_percent = 0;
									
									if(car_vol>0&&prd_vol>0){
										weight_percent = Number(prd_vol/car_vol)*100;
									}
									
									Ext.getCmp('car_vol').setValue(car_vol);
									Ext.getCmp('weight_percent').setValue(weight_percent.toFixed(2));

								}
							}
						}*/
						]
		});
		
		
		var capacityForm = Ext.create('Ext.form.Panel', {
			defaultType: 'textfield',
			border: false,
			bodyPadding: 15,
			region: 'east',
			title: '용적율 계산',
			width: 300,
			split: true,
			collapsible: true,
			floatable: false,
			defaults: {
				anchor: '100%',
				allowBlank: false,
				msgTarget: 'side',
				labelWidth: 80
			},
				items: [
					{
//								xtype: 'combo',
//								fieldLabel: '포장방식', //포장단위
//								name: 'unit_code',
//								displayField: 'codeName',
//								valueField: 'systemCode',
//								value:  unit_code,
//								anchor: '100%',
//								store: Ext.create('Mplm.store.CommonUnitStore',{})
//								,displayField: 'codeName'
//								,valueField: 'systemCode'
//								,innerTpl	: '<div>{codeName}</div>',
//				                triggerAction: 'all',
//				                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
////				                readOnly: true,
//				                listeners: {
//				                    select: function(combo, record) {
//
//				                    }
//				                }
							xtype: 'textfield',
							fieldLabel: '포장방식',
							value:  unit_code ,
							anchor: '100%',
							fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
							readOnly: true

						
					},
					
							{
								xtype: 'fieldset',
								title: '카톤박스/파레트 규격',
								defaults: {
									labelWidth: 80,
									anchor: '100%',
									layout: {
										type: 'hbox',
										defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
									}
								},
								
								items: [{
									xtype: 'textfield',
									fieldLabel: '가로(X)',
									value:  reserved2,
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
								},{
									xtype: 'textfield',
									fieldLabel: '세로(Y)',
									value:  reserved3 ,
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
								},{
									xtype: 'textfield',
									fieldLabel: '높이(Z)',
									value:  reserved4 ,
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
								},{
									xtype: 'textfield',
									fieldLabel: '적재수량\n(포장단위)',
									value:  reserved_number4,
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
								}/*,{
									xtype: 'textfield',
									fieldLabel: '밴딩수량',
									value:  reserved_number4,
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
							}*/,{
									xtype: 'textfield',
									fieldLabel: '갯수',
									id:'prd_ea',
									value:  ea,//ea.toFixed(1),//'출하수량/포장수량=',
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
								},{
									xtype: 'textfield',
									fieldLabel: '제품용적',
									id:'prd_vol',
									name:'prd_vol',
									value:  prd_vol,//'갯수*가로*세로*높이=',
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
								}]
							},
							{
								xtype: 'textfield',
								id:'car_vol',
								name:'car_vol',
								fieldLabel: '차량용적',
								value:  '가로*세로*높이',
								anchor: '100%',
								fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '용적율',
								id:'weight_percent',
								value:  '제품용적/차량용적 *100%',
								anchor: '100%',
								fieldStyle: 'font-weight:100%;background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
								readOnly: true
							}
						
						]
		});
		
		var win = Ext.create('ModalWindow', {
			title: gm.getMC('CMD_Shipment_request', '출하 요청'),
			width: 680,
			height: 480,
			minWidth: 600,
			minHeight: 300,
			items: [form/*,
				capacityForm*/
				],
			buttons: [{
				text: '확인',
				handler: function(){
					var val = form.getValues(false);
					
					gMain.selPanel.addDeliveryRequestFc(val, pj_rec);
					if(win) {
						win.close();
					}
				}
			},
			{
				text: '취소',
				handler: function(){
					if(win) {
						win.close();
					}
	

				}
			}]
		});
		win.show();

		// Ext.MessageBox.show({
		// 	title: '확인',
		// 	msg: '지정된 <출하요청수량> 으로 출하요청을 하시겠습니까?',
		// 	buttons: Ext.MessageBox.YESNO,
		// 	icon: Ext.MessageBox.QUESTION,
		// 	fn: function(btn) {
		// 		var selections = gm.me().grid.getSelectionModel().getSelection();
		// 		var unique_ids = [];
		// 		for(var i=0; i<selections.length; i++) {
		// 			var unique_id = selections[i].get('unique_uid');
		// 			unique_ids.push(unique_id);
		// 		}

		// 		if (btn == 'yes') {
		// 			console_logs('>>>>yes', 'y');
		// 			// Ext.Ajax.request({
		// 			// 	url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
		// 			// 	params: {
		// 			// 		unique_ids:unique_ids,
		// 			// 		ctr_flag:'M'
		// 			// 	},
		// 			// 	success: function(result, request) {
		// 			// 		gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
		// 			// 		gm.me().store.load();
		// 			// 	},
		// 			// 	failure: extjsUtil.failureMessage
		// 			// });
		// 		} else {
		// 			return;
		// 		}
		// 	}
		// });
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
        PJ   : '수주이력',
        PRODUCE : '생산이력',
        SHIP   : '출하이력'
    },
	// changeTab: function(mode) {
	// 	console_logs('asdasdasd', this.widgetTab.child('#pjHistoryGrid'));
	// 	Ext.getCmp('historyTab').setTitle(this.vMESSAGE[mode]);
	// 	// Ext.getCmp('pjHistoryGrid').show();
	// 	// this.widgetTab.child('#pjHistoryGrid').tab.show();
	// 	this.widgetTab.child('#pjHistoryGrid').tab.hide();
	// 	// Ext.getCmp('historyTab').child('#prdHistoryGrid').tab.show();
	// },

	// rame: true,
// 			activeTab:1,
// 			region:'east',
// 			width: 500,
// 			collapsed: true,
// //	        scroll: true,
// //	        autoScroll: true,
//             title:  '이력보기',
//             layout: 'card',
//             cmpId: 'historyTab',
//             id: 'historyTab',

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
