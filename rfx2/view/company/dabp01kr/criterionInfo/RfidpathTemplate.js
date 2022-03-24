//RFID 경로 정의

Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.RfidpathTemplate', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'rfid-pathtemplate-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
        this.initSearchField();
        

        //검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        // '/purchase/prch.do?method=readGoodsReceipt'
        
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
		});

		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			console_logs('>>dataIndex', columnObj);
			switch(dataIndex) {
				case 'serial_no':
				columnObj["editor"] = {};
				columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, meta) {
					meta.css = 'custom-column';
					return value;
				};
				break;
			}
		});
		
		/****************  여기에 Rfrouthpath model 정의 할 거. */
	    this.createStore('Rfx.model.RfRouteDetail', [{
	          property: 'unique_id',
	          direction: 'DESC'
	       }],
	       gMain.pageSize/*pageSize*/
		   );
		   

		this.addAction =  Ext.create('Ext.Action', {
			itemId: 'routeAddAction',
			iconCls: 'af-plus-circle',
			disabled: true,
			text: '추가',
			handler: function(widget, event) {
				gm.me().addHandler();
				
			}
		});

		this.editAction =  Ext.create('Ext.Action', {
			itemId: 'routeEditAction',
			iconCls: 'af-edit',
			disabled: true,
			text: gm.getMC('CMD_MODIFY', '수정'),
			handler: function(widget, event) {
				gm.me().editHandler();
				
			}
		});

		this.removeAction =  Ext.create('Ext.Action', {
			itemId: 'routeRemoveAction',
			iconCls: 'af-remove',
			disabled: true,
			text: gm.getMC('CMD_DELETE', '삭제'),
			handler: function(widget, event) {
				Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
						var unique_ids = [];

                        for(var i=0; i<selections.length; i++) {
                            var unique_id = selections[i].get('unique_id_long');
                            unique_ids.push(unique_id);
                        }

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rfid.do?method=removeAreaInRoute',
                                params: {
                                    unique_ids:unique_ids
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '삭제완료');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            
                        }
                    }
                });
				
			}
		});

		buttonToolbar.insert(1, '-');
		buttonToolbar.insert(2, this.addAction);
		buttonToolbar.insert(3, '-');
		buttonToolbar.insert(4, this.editAction);
		buttonToolbar.insert(5, '-');
		buttonToolbar.insert(6, this.removeAction);
		
        var arr=[];
		arr.push(buttonToolbar);

        //grid 생성.
		this.createGridCore(arr);
		//this.createGrid(arr);
        //this.createCrudTab();
//		this.createGrid(arr, {width: '60%'});
        // remove the items
    	this.refreshAction = Ext.create('Ext.Action', {
    		itemId: 'putListSrch',
    	    iconCls: 'af-search',
    	    text: CMD_SEARCH/*'검색'*/,
    	    disabled: false,
    	    handler: function(widget, event) {
    	    	gm.me().rfRouteStore.load();
    	    }
    	});
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter()]
        });

	   this.callParent(arguments);
	   
	   this.setGridOnCallback(function(selections) {
			if(selections.length) {
				this.editAction.enable();
				this.removeAction.enable();
			} else {
				console_logs('>>> selections', selections)
				this.editAction.disable();
				this.removeAction.disable();
			}
		});
		
		this.grid.on('edit', function(editor, e) {
			var rec = e.record;
				field = e['field'];
				
			console_logs('>> edit rec', rec);
			console_logs('>> edit field', field);
		});
	},    
	
//    rtgast_uid_arr : [],
    setRelationship: function (relationship) {},
    createCenter: function() {/*자재목록 그리드*/
    		this.grid.setTitle('템플리트 상세');
			this.center =  Ext.widget('tabpanel', {
				layout:'border',
			    border: true,
			    region: 'center',
	            width: '55%',
			    items: [this.grid]
			});

			this.grid.getSelectionModel().on({
				selectionchange: function(sm, selections) {
					if(selections != null && selections.length > 0) {
						gUtil.enable(gm.me().execApAction);
					} else {
						gUtil.disable(gm.me().execApAction);
					}
				}
			})
			
			return this.center;
    },    
    createWest: function() {/*요청서 목록*/
		
		
    	this.removeAssyAction = Ext.create('Ext.Action', {
    		itemId: 'removeAssyAction',
    	    iconCls: 'af-remove',
    	    text: 'Assy' + CMD_DELETE,
    	    disabled: true,
    	    handler: function(widget, event) {
    	    	Ext.MessageBox.show({
    	            title:delete_msg_title,
    	            msg: delete_msg_content,
    	            buttons: Ext.MessageBox.YESNO,
    	            fn: gm.me().deleteAssyConfirm,
    	            // animateTarget: 'mb4',
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
		
		// var modelClass = 'Rfx.model.AccountsPayableList';
		// var pageSize = 100;
		// var sorters = [{
		// 	property : 'object_name',
		// 	direction : 'ASC'
		// }];

		// var model = Ext.create(modelClass);
		// var store = new Ext.data.Store({
		// 	pageSize : pageSize,
		// 	model : model,
		// 	sorters : sorters
		// });
    	
		this.rfRouteStore = Ext.create('Mplm.store.GenCodeStore', {hasNull: false, gubunType: 'RF_ROUTE'} );

		this.pathdetailGrid =
	    	Ext.create('Rfx.view.grid.RfidpathTemplateGrid', {
	    	 title: '템플리트 명',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
	         store: this.rfRouteStore,
	         multiSelect: true,
			 selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.rfRouteStore,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	//		                        //--- Get Proxy ------//
	//		                        var myProxy = this.store.getProxy();                        
	//		                 //--- Define Your Parameter for send to server ----//
	//		                        myProxy.params = {
	//		                            MENU_NAME: '',
	//		                            MENU_DETAIL: ''
	//		                        };
	//		                  //--- Set value to your parameter  ----//
	//		                        myProxy.setExtraParam('MENU_NAME', '222222');
	//		                        myProxy.setExtraParam('MENU_DETAIL', '555555');
	                    }
	                }
		         
		        }),
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						this.refreshAction
                            ]
                        }
			    	
				
	    	] //dockedItems of End
			
		
		});//pathdetailGrid of End

		
		this.pathdetailGrid.store.load();
		this.pathdetailGrid.store.on('load',function (store, records, successful, eOpts ){
		});
        
		this.pathdetailGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {  
            	try{
            		if(selections.length > 0){
				 		var rec = selections[0];
				 		var route_code = rec.get('system_code');
				 		var start_date = new Date();
				 		console.log('>>> start_date', start_date);
				 		console_logs('>>> route_code ', route_code);

				 		gm.me().store.getProxy().setExtraParam('route_code', route_code);
				 		gm.me().store.load();

				 		gm.me().addAction.enable();
				 
        			} else {
						gm.me().store.getProxy().setExtraParam('route_code', null);
						gm.me().store.load();
						gm.me().addAction.disable();
					}
					var end_date = new Date();
					console.log('>>> end_date', end_date);
					var elapsed_time = end_date - start_date;
					console.log('>>> elpased_time', elapsed_time);
        		} catch(e){
    				console_logs('e',e);
    			}
    		}
        });
		
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '45%',
			    layoutConfig: {columns: 2, rows:1},
			    items: [this.pathdetailGrid /*, myFormPanel*/]
			});
    	return this.west;
	},
	rtgapp_store : null,
	useRouting : (vCompanyReserved4 == null) ? true : false,
	
	buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {}),
	pointCodeStore: Ext.create('Mplm.store.PointCodeStore', {} ),
	accountsWayStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'ACCOUNTS_WAY'} ),

	compareNumbers: function(a,b) {
		return a - b;
	},
	
	addHandler: function() {
				var left_rec = this.pathdetailGrid.getSelectionModel().getSelection()[0];
				console_logs('>>>> left_re', left_rec);
				var route_code = left_rec.get('system_code');
				var r_store = gm.me().store;
				console_logs('>>> sss', r_store);
				var datas = r_store.data.items;
				var serials = [];
				for(var i=0; i<datas.length; i++) {
					var data = datas[i];
					serials.push(data.get('serial_no'));
				}
				serials.sort(gm.me().compareNumbers)
				var len = serials.length;
				var last_no = serials[len-1];
				last_no = last_no + 10;

				// console_logs('sssss 2', serials.sort(1));
	
				var form = Ext.create('Ext.form.Panel', {
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
					items: [
						{
							xtype: 'combo',
							fieldLabel: 'Point코드',
							name: 'point_code',
							id:'point_code',
							store: gm.me().pointCodeStore,
							allowBlank: true,
							valueField: 'code',
							displayField: 'codeInfo',
							emptyText: '선택해주세요.',
							listConfig: {
								loadingText: '검색중...',
								emptyText: '일치하는 항목 없음',
								getInnerTpl: function() {
									return '<div data-qtip="{}">{codeInfo}</div>';
								}
							}
						},{
							xtype: 'textfield',
							name: 'route_code',
							id:'route_code',
							allowBlank: false,
							fieldLabel: '경로코드',
							value: route_code,
							readOnly: true
						},{
							xtype: 'textfield',
							name: 'serial_no',
							id:'serial_no',
							allowBlank: true,
							fieldLabel: '순번',
							value: last_no
						}
					]
				});
	
				var win = Ext.create('ModalWindow', {
					title: '추가',
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
								if(form.isValid()) {
									var val = form.getValues(false);

                                    console_logs('val', val);
                                    form.submit({
                                        url: CONTEXT_PATH + '/rfid.do?method=addRouteArea',
                                        params: val,
                                        success: function(val, action) {
                                            win.close();
                                            gm.me().store.load(function() {});
                                        },
                                        failure: function(val, action) {
                                            win.close();
                                            gm.me().store.load(function() {});
                                        }
                                    });
								}
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

	editHandler: function() {
				var left_rec = this.pathdetailGrid.getSelectionModel().getSelection()[0];
				var right_rec = this.grid.getSelectionModel().getSelection()[0];

				var route_code = right_rec.get('route_code');
					point_code = right_rec.get('point_code');
					serial_no  = right_rec.get('serial_no');
					unique_id  = right_rec.get('unique_id_long');
					
				gm.me().pointCodeStore.load();

				var form = Ext.create('Ext.form.Panel', {
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
						}
					},
					items: [
						new Ext.form.Hidden({
							name: 'unique_id',
							value: unique_id
						}),
						{
							xtype: 'combo',
							fieldLabel: 'Point코드',
							name: 'point_code',
							id:'point_code',
							store: gm.me().pointCodeStore,
							allowBlank: true,
							valueField: 'code',
							displayField: 'codeInfo',
							emptyText: '선택해주세요.',
							value: point_code,
							listConfig: {
								loadingText: '검색중...',
								emptyText: '일치하는 항목 없음',
								getInnerTpl: function() {
									return '<div data-qtip="{}">{codeInfo}</div>';
								}
							}
						},{
							xtype: 'textfield',
							name: 'route_code',
							id:'route_code',
							allowBlank: false,
							fieldLabel: '경로코드',
							value: route_code,
							readOnly: true
						},{
							xtype: 'textfield',
							name: 'serial_no',
							id:'serial_no',
							allowBlank: true,
							fieldLabel: '순번',
							value: serial_no
						}
					]
				});
	
				var win = Ext.create('ModalWindow', {
					title: '수정',
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
								if(form.isValid()) {
									var val = form.getValues(false);

                                    console_logs('val', val);
                                    form.submit({
                                        url: CONTEXT_PATH + '/rfid.do?method=addRouteArea',
                                        params: val,
                                        success: function(val, action) {
                                            win.close();
                                            gm.me().store.load(function() {});
                                        },
                                        failure: function(val, action) {
                                            win.close();
                                            gm.me().store.load(function() {});
                                        }
                                    });
								}
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