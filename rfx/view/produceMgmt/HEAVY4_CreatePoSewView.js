//주문작성

Ext.define('Rfx.view.produceMgmt.HEAVY4_CreatePoSewView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'create-po-sew-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "요청기간" ,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	});    

//		this.addSearchField('maker_name');
		this.addSearchField('pj_code');
		this.addSearchField('pj_name');
		this.addSearchField('creator');
		
//		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStoreSimple({
    		modelClass: 'Rfx.model.HEAVY4CreatePoSew',
	        pageSize: gMain.pageSize,/*pageSize*/
	        sorters: [{
	        	property: 'parent_code',
	        	direction: 'asc'
	        }],
	        byReplacer: {

	        },
	        deleteClass: ['cartmap']
		        
	    }, {
	    	groupField: 'parent_code'
    });
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
        		
		 this.reqdateAction = Ext.create('Ext.Action', {
				xtype: 'button',
				iconCls: 'af-check',
				cmpId: 'check_id', //임시
				text: '요청납기일 설정',
				disabled: true,
				handler: function() {	

					var date = buttonToolbar2.items.items[0].getValue();
					var year = date.getFullYear();
					var month = (1 + date.getMonth());
					month = month >= 10? month : '0' + month;
					var day = date.getDate();
					day = day >= 10? day : '0' + day;
					date = year + '-' + month + '-' + day;
					
					var selections = records;
					console_logs('selections>>>>>>>>', selections);
					if(selections!=null) {
						var whereValue = [];
						var field = 'req_date';
						for( var i=0; i<selections.length; i++) {
							var o = selections[i];
							o.set(field, date);
							console_logs('o', o);
						
							var assymap_uid = o.get('id');
							whereValue.push(assymap_uid);
						}
						console_logs('createPcsToobars', whereValue);
						gm.editAjax('cartmap', 'req_date', date, 'unique_id', whereValue,  {type:''});
						selectedgrid.getStore().load();
					}
				}
		});
		 var buttonToolbar2 = Ext.create('widget.toolbar', {
      	 	 cls: '.my-x-toolbar-default2',
	         style:'color:white;',
	         items: [
	        	 {   
	        		 name: 'req_date',
	        		 cmpId: 'req_date',
	        		 format: 'Y-m-d',
	        		 fieldStyle: 'background-color: #D6E8F6; background-image: none;',
	        		 submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	        		 dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	        		 allowBlank: true,
	        		 xtype: 'datefield',
	        		 value: new Date(),
	        		 width: 100,
	        		 handler: function(){
	        		 }
	     		},
	     		this.reqdateAction
	     		
	         ]
       });
		
		 arr.push(buttonToolbar2);
		 

        //grid 생성.
		this.createGridCore(arr, option);
		//this.createGrid(arr);
        //this.createCrudTab();
//		this.createGrid(arr, {width: '60%'});
		
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        this.addAssyAction = Ext.create('Ext.Action', {
        	itemId:'addAssyAction',
    		iconCls:'af-plus-circle',
    		disabled: true,
    	    text: '구매요청',
    	    handler: function(widget, event) {
    	    	var pr_uid = gMain.selPanel.SELECTED_UID;
    	    	Ext.MessageBox.show({
		            title:'확인',
		            msg: '구매요청 하시겠습니까?',
		            buttons: Ext.MessageBox.YESNO,
		            fn:  function(result) {
            	        if(result=='yes') {
            	        	gm.me().prchRequest();
            	        	
            	        }
		            },
		            // animateTarget: 'mb4',
		            icon: Ext.MessageBox.QUESTION
		        });
    	    }
    	});
        
    	this.purListSrch = Ext.create('Ext.Action', {
    		itemId: 'putListSrch',
    	    iconCls: 'af-search',
    	    text: CMD_SEARCH/*'검색'*/,
    	    disabled: false,
    	    handler: function(widget, event) {
    	    	var s_date = Ext.getCmp('s_date_PPO1TURN').getValue();
    	    	var e_date = Ext.getCmp('e_date_PPO1TURN').getValue();
    	    	var lot_no = Ext.getCmp('lot_no_PPO1TURN').getValue();
//    	    	var wa_code = Ext.getCmp('wa_code_PPO1TURN').getValue();
//    	    	gMain.selPanel.productStore.getProxy().setExtraParam('sdate', s_date);
//    	    	gMain.selPanel.productStore.getProxy().setExtraParam('edate', e_date);
//    	    	gMain.selPanel.productStore.getProxy().setExtraParam('req_date', s_date+":"+e_date);
    	    	gMain.selPanel.productStore.getProxy().setExtraParam('name', lot_no);
//    	    	gMain.selPanel.productStore.getProxy().setExtraParam('wa_code', wa_code);
    	    	gMain.selPanel.productStore.load();
    	    }
    	});
    	
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter()]
        });

       this.callParent(arguments);
    },    
    prchRequest: function() {
    	
    	
    	// var target_reserved_double3 = this.getInputTarget('unique_id');
    	// var assymapUid = target_reserved_double3.getValue()
//    	    	
//    	    	console_logs('gMain.selPanel.SELECTED_UID@@@@@@@@@@@@@', gMain.selPanel.SELECTED_UID);
//    	    	
//    	    	var unique_id = gMain.selPanel.SELECTED_UID;
    	    	
    		    Ext.Ajax.request({
    				url: CONTEXT_PATH + '/index/process.do?method=PoRequestPRD',
    				params:{
    					rtgast_uid_arr: gMain.selPanel.rtgast_uid_arr,
    					rtgast_uid: gMain.selPanel.rtgast_uid
    				},
    				
    				success : function(result, request) { 
    					gMain.selPanel.store.load();
    					gMain.selPanel.productGrid.store.load();
    					Ext.Msg.alert('안내', '구매부서로 주문을 요청하였습니다.', function() {});
    					
    				},// endofsuccess
    				failure: extjsUtil.failureMessage
    			});// endofajax

   }, 
   rtgast_uid_arr : [],
    setRelationship: function (relationship) {},
    createCenter: function() {/*자재목록 그리드*/
    		this.grid.setTitle('자재목록');
			this.center =  Ext.widget('tabpanel', {
				layout:'border',
			    border: true,
			    region: 'center',
	            width: '75%',
			    items: [this.grid]
			});
			
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
    	            fn: gMain.selPanel.deleteAssyConfirm,
    	            // animateTarget: 'mb4',
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
    	
    	
		this.productStore = Ext.create('Mplm.store.PurcahseRequestStore');
		var sew_sdate = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
		var sew_edate = Ext.Date.add(new Date(), Ext.Date.MONTH);

		sew_sdate = Ext.Date.format(sew_sdate, 'Y-m-d');
		sew_edate = Ext.Date.format(sew_edate, 'Y-m-d');

		this.productStore.getProxy().setExtraParam('sew_sdate', sew_sdate);
		this.productStore.getProxy().setExtraParam('sew_edate', sew_edate);
		this.productGrid =
	    	Ext.create('Rfx.view.grid.PurchseRequestGridHeavy', {
	    	 //id: gm.me().link + 'DBM7-Assembly',
//			 id: 'PPO1_TURN_PREQ',
	    	 title: '구매요청목록',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
	         store: this.productStore,
	         //layout          :'fit',
	         //forceFit: true,
	         multiSelect: true,
	         selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.productStore,
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
						this.purListSrch, 
						this.addAssyAction//, 
					        //this.removeAssyAction, 
					        //'->', 
					        //this.expandAllTreeAction 
					        ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default1',
					items: [{
					    xtype:'label',
					    width:40,
					    text: '납기일',
					    style: 'color:white;'
						 
			    	},{
						  id: 's_date_PPO1TURN',
			              name: 's_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
						  dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						  xtype: 'datefield',
						  value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						  width: 98,
						  listeners: {
							  select:function(data, value) {
								var s_date = Ext.Date.format(value, 'Y-m-d');
								gm.me().productStore.getProxy().setExtraParam('sew_sdate', s_date);
							  }
						  }

			        },{
					    xtype:'label',
					    text: "~",
					    style: 'color:white;'
			        },{
						  id: 'e_date_PPO1TURN',
			              name: 'e_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					      dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						  xtype: 'datefield',
						  value: new Date(),
						  width: 98,
						  listeners: {
							  select:function(data, value) {
								var e_date = Ext.Date.format(value, 'Y-m-d');
								gm.me().productStore.getProxy().setExtraParam('sew_edate', e_date);
							  }
						  }

			        } ,{
			    		id: 'lot_no_PPO1TURN',
				    	xtype: 'textfield',
				    	fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				        mode: 'local',
				        editable:true,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'LOT번호',
				        enableKeyEvents: true,
				        trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'	,
			            listeners : {
			            	render: function( component ) {
			            		component.getEl().on('keydown', function() {
			            			var s_date = Ext.getCmp('s_date_PPO1TURN').getValue();
			            	    	var e_date = Ext.getCmp('e_date_PPO1TURN').getValue();
			            	    	var lot_no = Ext.getCmp('lot_no_PPO1TURN').getValue();
//			            	    	var wa_code = Ext.getCmp('wa_code_PPO1TURN').getValue();
//			            	    	gMain.selPanel.productStore.getProxy().setExtraParam('sdate', s_date);
//			            	    	gMain.selPanel.productStore.getProxy().setExtraParam('edate', e_date);
//			            	    	gMain.selPanel.productStore.getProxy().setExtraParam('req_date', s_date+":"+e_date);
			            	    	gMain.selPanel.productStore.getProxy().setExtraParam('name', '%'+lot_no+'%');
//			            	    	gMain.selPanel.productStore.getProxy().setExtraParam('wa_code', wa_code);
			            	    	gMain.selPanel.productStore.load();
			            		});
			            	}
			            }
			    	},
//			    	{
//			    		id: 'wa_code_PPO1TURN',
//				    	xtype: 'combo',
//				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//				        mode: 'local',
//				        editable:false,
//				        // allowBlank: false,
//				        width: '25%',
//				        queryMode: 'remote',
//				        emptyText:'발주업체',
//				        displayField:   'wa_name',
//				        valueField:     'wa_code',
//				        store: 	Ext.create('Mplm.store.BuyerStore'),
//				        listConfig:{
//				            	getInnerTpl: function(){
//				            		return '<div data-qtip="{wa_name}">[{wa_code}] <small><font color=blue>{wa_name}</font></small></div>';
//				            	}
//				           },
//					        listeners: {
//						           select: function (combo, record) {
//					                 	
//						           }
//					        }
//			    	
//			    	},
			    	]
				}
	    	] //dockedItems of End
			
		
		});//productGrid of End
		this.productGrid.store.load();
		 this.productGrid.store.on('load',function (store, records, successful, eOpts ){
	        	var arr = [];
	        	var prev_rec = null;
	        	for(var i=0; i< records.length; i++) {
	        		var cur = records[i];
	        		prev_rec = {};
	        		for (var key in cur['data']) { 
	    				prev_rec[key] = cur.get(key); 
	    			}
	        		var unique_id = cur.get('unique_id');
	        		prev_rec['unique_id'] =unique_id;
	        		var state = cur.get('state');
	        		
	        		if(state.indexOf('I')>-1){
	        			state = '대기';
	        		}else if(state.indexOf('A')>-1){
	        			state = '접수중';
	        		}
	        		else{
	        			state = '접수완료';
	        		}
	        		prev_rec['state'] = state;
	        		
	        		var po_no = cur.get('po_no');
	        		prev_rec['po_no'] =po_no;
	        		
	        		var name = cur.get('name');
	        		prev_rec['name'] =name;
	        		
	        		var item_quan = cur.get('item_quan');
	        		prev_rec['item_quan'] =item_quan;
	        		
	        		var creator = cur.get('creator');
	        		prev_rec['creator'] =creator;
	        		
	        		var create_date = cur.get('create_date');
	        		prev_rec['create_date'] =create_date;
	        		

		         	
	        		arr.push(prev_rec);
	        	} 	
	        	records = arr;
	        	console_logs('==== storeLoadCallback arr', arr);
	        	
	        	store.removeAll();
	        	store.add(arr);
	       });
        this.productGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {  
        		gUtil.enable(gMain.selPanel.addAssyAction);
        		gUtil.enable(gMain.selPanel.editAssyAction);
        		try{
        		if(selections!=null){
        			
	        		 var rec = selections[0];
	        		 console_logs('rec>>>>>>>>>>>>>',rec)
	        		 gMain.selPanel.SELECTED_UID = rec.get('unique_id');
	        		 var unique_id = rec.get('unique_id');
	        		 gMain.selPanel.rtgast_uid = rec.get('unique_id');
	        		 gMain.selPanel.rtgast_uid_arr = rec.get('unique_id');
	        		 console_logs('rec>>>>>>>>>>>>>',gMain.selPanel.rtgast_uid_arr)
	        		 
	        		 gMain.selPanel.store.getProxy().setExtraParam('pr_uid', unique_id);
	        		 gMain.selPanel.store.load(function(records){
	        			 if(records!=null && records.length>0) {
	        				 for(var i=0; i<records.length; i++) {
	        					 var o = records[i];
	        					 var req_date = o.get('req_date');
	        					 if(req_date==null) {
	        						 o.set('req_date', gu.getNextday(5));
	        					 }
	        				 }
	        			 }
	        		 });
	        		 
        	}
        		}catch(e){
    				console_logs('e',e);
    			}
    		}
        });
		        
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	this.reqdateAction.enable();
            	records = selections;
            } else {
            	this.reqdateAction.disable();
            }
        	
        });
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '35%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.productGrid /*, myFormPanel*/]
			});
    	
    	return this.west;
    },
});
