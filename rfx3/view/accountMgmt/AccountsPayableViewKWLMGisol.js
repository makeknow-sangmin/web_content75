/**
 * 777777
 */
Ext.define('Rfx3.view.accountMgmt.AccountsPayableViewKWLMGisol', {
    extend: 'Rfx.base.BaseView',
    xtype: 'account-pay-viewKWML',
    initComponent: function(){

    	this.initSearchField();
		this.createSearchToolbar();
        this.createCommandToolbar();

        this.createStoreSimple({
				modelClass: 'Rfx.model.HEAVY4CreatePoSew',
				pageSize: gMain.pageSize,
				sorters: [{
					property: 'parent_code',
					direction: 'asc'
				}],
				byReplacer: {	},
				deleteClass: ['cartmap']
			}, {
				groupField: 'parent_code'
		});
	
        this.INIT_PAN1();
		this.INIT_PAN2();  	
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(),this.createCenter()]
        });

       this.callParent(arguments);
    },    
    prchRequest: function() {
    		    Ext.Ajax.request({
    				url: CONTEXT_PATH + '/index/process.do?method=PoRequestPRD',
    				params:{
    					rtgast_uid_arr: gm.me().rtgast_uid_arr,
    					rtgast_uid: gm.me().rtgast_uid
    				},
    				
    				success : function(result, request) { 
    					gm.me().store.load();
    					gm.me().productGrid.store.load();
    					Ext.Msg.alert('안내', '구매부서로 주문을 요청하였습니다.', function() {});
    				},
    				failure: extjsUtil.failureMessage
    			});

   }, 
   rtgast_uid_arr : [],
    setRelationship: function (relationship) {},
    createCenter: function() {
    		this.grid.setTitle('입고목록');
			this.center =  Ext.widget('tabpanel', {
				layout:'border',
			    border: true,
			    region: 'center',
	            width: '55%',
			    items: [this.grid]
			});
			
			return this.center;
    },    
    createWest: function() {
    	
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
    	
    	
    	this.productStore = null;
		this.productGrid =
	    	Ext.create('Rfx.view.grid.AccountPayableGrid', {
	    	 title: '외상매출금 합계',
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
	         store: this.productStore,
	         multiSelect: true,
	         selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.productStore,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	                    }
	                }
		         
		        }),
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
								this.purListSrch
					        ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default1',
					items: [{
					    xtype:'label',
					    width:40,
					    text: '기간',
					    style: 'color:white;'
						 
			    	},{
						  id: gu.id('s_date'),
			              name: 's_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						    	width: 98

			        },{
					    xtype:'label',
					    text: "~",
					    style: 'color:white;'
			        },{
						  id: gu.id('e_date'),
			              name: 'e_date',
			              format: 'Y-m-d',
			              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			              submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	xtype: 'datefield',
						    	value: new Date(),
						    	width: 98

			        } ,{
			    		id: gu.id('lot_no'),
				    	xtype: 'textfield',
				    	fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				        mode: 'local',
				        editable:true,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'자재코드',
				        enableKeyEvents: true,
				        trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'	,
			            listeners : {
			            	render: function( component ) {
			            		component.getEl().on('keydown', function() {
			            			var s_date = Ext.getCmp(gu.id('s_date')).getValue();
			            	    	var e_date = Ext.getCmp(gu.id('e_date')).getValue();
			            	    	var lot_no = Ext.getCmp(gu.id('lot_no')).getValue();
			            	    	gm.me().productStore.getProxy().setExtraParam('name', '%'+lot_no+'%');
			            	    	gm.me().productStore.load();
			            		});
			            	}
			            }
			    	},
			    	]
				}
	    	]
		
		});
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
        		gUtil.enable(gm.me().addAssyAction);
        		gUtil.enable(gm.me().editAssyAction);
        		try{
        		if(selections!=null){
        			
	        		 var rec = selections[0];
	        		 gm.me().SELECTED_UID = rec.get('unique_id');
	        		 var unique_id = rec.get('unique_id');
	        		 gm.me().rtgast_uid = rec.get('unique_id');
	        		 gm.me().rtgast_uid_arr = rec.get('unique_id');
	        		 
	        		 gm.me().store.getProxy().setExtraParam('pr_uid', unique_id);
	        		 gm.me().store.load();
	        		 
        	}
        		}catch(e){
    				console_logs('e',e);
    			}
    		}
        });
		
		 this.west =  Ext.widget('tabpanel', { 
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '45%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.productGrid /*, myFormPanel*/]
			});
    	
    	return this.west;
	},
	INIT_PAN1: function() {
		var arr=[];
        arr.push(this.buttonToolbar);
        arr.push(this.searchToolbar);
        
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};

		this.createGridCore(arr, option);
		// var me = this;
        // (me.buttonToolbar.items).each(function(item,index,length){
      	//   if(index==0||index==1||index==2||index==3||index==4||index==5) {
		// 	me.buttonToolbar.items.remove(item);
      	//   }
		// });

	},
	addAssyAction:
		Ext.create('Ext.Action', {
		itemId:'addAssyAction',
		iconCls:'af-plus-circle',
		disabled: true,
		text: '정산실행',
		handler: function(widget, event) {
			var pr_uid = gm.me().SELECTED_UID;
			Ext.MessageBox.show({
				title:'확인',
				msg: '구매요청 하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				fn:  function(result) {
					if(result=='yes') {
						gm.me().prchRequest();
						
					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		}
	}),
	INIT_PAN2: function() {
		this.buttonToolbar.insert(0, this.addAssyAction);
	},

	purListSrch: Ext.create('Ext.Action', {
		itemId: 'putListSrch',
		iconCls: 'af-search',
		text: CMD_SEARCH/*'검색'*/,
		disabled: false,
		handler: function(widget, event) {
			var s_date = Ext.getCmp(gu.id('s_date')).getValue();
			var e_date = Ext.getCmp(gu.id('e_date')).getValue();
			var lot_no = Ext.getCmp(gu.id('lot_no')).getValue();
			gm.me().productStore.getProxy().setExtraParam('name', lot_no);
			gm.me().productStore.load();
		}
	})
});
