
Ext.define('Rfx.view.ProduceState', {
    extend: 'Rfx2.base.BasePanel',
    alias: 'widget.produceState',
	frame        : false,
    border: false,
	split: true,
	createToolbar: function(){
        var items = [],
            config = {};
        if (!this.inTab) {
        	var orgSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});
        	items.push(
    				 {
    					 style: 'color:white;',
	   		        	 xtype:'tbtext',
	   		        	 text:'기간:'
	   		          },{ 
	                name: 's_date',
	                id: 's_dateDABP',
		                format: 'Y-m-d',
		              	fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						allowBlank: true,
						xtype: 'datefield',
						value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1) ,
						width: 100,
						handler: function(){
						}
					},
					{
						xtype:'label', 
					    text: "~",
					    style: 'color:white;'
					    
					 },
					{ 
		                name: 'e_date',
		                id: 'e_dateDABP',
		                format: 'Y-m-d',
		              	fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						allowBlank: true,
						xtype: 'datefield',
						value: new Date(),
						width: 99,
						handler: function(){
						}
					},'-');
			items.push(
					
					{
			       emptyText: '담당',
	               xtype:          'combo',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'user_name',
	               valueField:   'unique_id',
	               triggerAction:  'all',
	               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
	               store: Ext.create('Mplm.store.UserDeptStoreOnly', {hasNull:true, dept_code: '02'} ),
	               width: 80,
	               cls : 'newCSS',
	               id : 'pm_uidDABP',
	               name : 'pm_uid',
	               listConfig:{
	               getInnerTpl: function(){
	                		return '<div data-qtip="{user_id}">{user_name}</div>';
	                	}			                	
	                },
	 	            listeners: {
 	                    select: function (combo, record) {
 	                    	var systemCode = record.get('systemCode');
 	                    	ORG_PARAMS[this.id] = combo.getValue();
 	                    },
 	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
 	               }
	            });
			items.push(
//					 {
//   					 style: 'color:white;',
//	   		        	 xtype:'tbtext',
//	   		        	 text:'제품선택:'
//	   		          },
					{
			       emptyText: '고객사',
			       id : 'buyer_uid',
	               xtype:          'combo',
	               mode:           'local',
	               editable:       true,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'wa_name',
	               valueField:   'unique_id',
	               triggerAction:  'all',
	               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
	               store: Ext.create('Mplm.store.BuyerStore'),
	               width: 120,
	               cls : 'newCSS',
	               name : 'buyer_uid',
	               minChars: 1,
	               listConfig:{
	               getInnerTpl: function(){
	                		return '<div data-qtip="{unique_id}">{wa_name}</div>';
	                	}			                	
	                },
	 	            listeners: {
 	                    select: function (combo, record) {
 	                    	var systemCode = record.get('systemCode');
 	                    	ORG_PARAMS[this.id] = combo.getValue();
 	                    },
 	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
 	               }
	            });
//			items.push(
//					{
//			       emptyText: '공정명',
//	               xtype:          'combo',
//	               mode:           'local',
//	               editable:       false,
//	               allowBlank: false,
//	               queryMode: 'remote',
//	               displayField:   'codeName',
//	               triggerAction:  'all',
//	               valueField: 'system_code',
//	               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
//	               store: Ext.create('Mplm.store.ProcessNameStore', {hasNull:true} ),
//	               width: 120,
//	               cls : 'newCSS',
//	               listConfig:{
//	               getInnerTpl: function(){
//	                		return '<div data-qtip="{system_code}">{codeName}</div>';
//	                	}			                	
//	                },
//	 	            listeners: {
//	                    select: function (combo, record) {
//	                    	var systemCode = record.get('systemCode');
//	                    	ORG_PARAMS[this.id] = combo.getValue();
//	                    },
//	                    change: function(sender, newValue, oldValue, opts) {
//				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
//				            }
//	               }
//	            });
			items.push(
//					 {
//  					 style: 'color:white;',
//	   		        	 xtype:'tbtext',
//	   		        	 text:'제품선택:'
//	   		          },
					{
				       emptyText: '제품명',
				       xtype: 'triggerfield',
		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		               store: Ext.create('Mplm.store.ClaAstStoreMt', {hasNull:true} ),
		               width: 100,
		               style: 'cursor:pointer',
		               cls : 'newCSS',
		               id : 'item_nameDABP',
		               name : 'item_name',
		               enableKeyEvents: true,
		               listeners : {
	  		      		   render: function( component ) {
//				                component.getEl().on('click', treatOrgCombo  );
//				                component.getEl().on('keypress', treatOrgCombo  );
	  		      			component.getEl().on('keydown', function() {
	  		      				gUtil.redrawProduceAll();
	  		      			});
				           }
	  		      	  },
	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		            });
			items.push(
//					 {
// 					 style: 'color:white;',
//	   		        	 xtype:'tbtext',
//	   		        	 text:'제품선택:'
//	   		          },
					{
				       emptyText: '수주번호',
				       xtype: 'triggerfield',
		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		               //store: Ext.create('Mplm.store.ClaAstStoreMt', {hasNull:true} ),
		               width: 100,
		               style: 'cursor:pointer',
		               cls : 'newCSS',
		               id : 'pj_codeDABP',
		               name : 'pj_code',
		               enableKeyEvents: true,
		               listeners : {
	  		      		   render: function( component ) {
//				                component.getEl().on('click', treatOrgCombo  );
//				                component.getEl().on('keypress', treatOrgCombo  );
	  		      			component.getEl().on('keydown', function() {
	  		      				gUtil.redrawProduceAll();
	  		      			});
				           }
	  		      	  },
	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		            });
	    	items.push({
				xtype : 'checkbox',
				id : 'checkbox',
				boxLabel : '완료포함',
				checked: false,
				listeners: {
			            change: function(field, newValue, oldValue, eOpts){
			            }
	               }
			}, '-');
	        items.push({
	        	xtype: 'component',
	            //html: '<div class="inputBT"><button type="button" onClick="redrawProduceChart1();"><span class="search">검색</span></button></div>'
	        	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="gUtil.redrawProduceAll();"></button></span></div>'
	        });
	        items.push('->');
	        
	        
	       	 var my_model = Ext.create('Rfx.model.TotalState', {});
		 	 var my_store = new Ext.data.Store({  
				pageSize: 50,
			    //groupField: 'class_name',
			    sorters: ['regist_date'],
				model:  my_model
			 });
			
		        //여기에 Excel 다운로드 추가
		        items.push({
		        	xtype: 'button',
		        	iconCls: 'af-excel',
		        	text:'Excel',
		        	my_store: my_store,
		            //html: '<div class="inputBT"><button type="button" onClick="redrawProduceChart1();"><span class="search">검색</span></button></div>'
		        	handler: function(a,b,c,d) {
//		        		console_logs('===my_store===', this.my_store);
//		        		console_logs('===b===', b);
//		        		console_logs('===c===', c);
//		        		console_logs('===d===', d);
		            	var me = this;
//		            	console_logs('===me===', me);
//		        		
//		        		var store = gm.me().getStore();
		              	 var s_dateDABP = Ext.getCmp('s_dateDABP');
						 s_dateDABP = s_dateDABP.getValue();
						 s_dateDABP = Ext.Date.format(s_dateDABP, 'Y-m-d');
		            	 var e_dateDABP = Ext.getCmp('e_dateDABP');
						 e_dateDABP = e_dateDABP.getValue();
						 e_dateDABP = Ext.Date.format(e_dateDABP, 'Y-m-d');
		            	 var pm_uid = Ext.getCmp('pm_uidDABP');
		            	 pm_uid = pm_uid.getValue();
		            	 var buyer_uid = Ext.getCmp('buyer_uid');
		            	 buyer_uid = buyer_uid.getValue();
		            	 var val = Ext.getCmp('item_nameDABP');
		            	 var item_name = val.getValue();
		            	 //console_logs('>>>>>>>>val', item_name);
		            	 var item = Ext.JSON.encode(item_name);
		            	 //console_logs('>>>>>>>>', item);
		            	 var pj_code = Ext.getCmp('pj_codeDABP');
		            	 pj_code = pj_code.getValue();
		            	 
		            	 var check = Ext.getCmp('checkbox');
						 ch = check.getValue();
						 var pj_status = null;

		            	 if(ch==true){
							this.my_store.getProxy().setExtraParam('pj_status', 'Y');
							pj_status = "Y";
		            	 }else{
							 this.my_store.getProxy().setExtraParam('pj_status', null);
							 pj_status = null;
		            	 }
		            	this.my_store.getProxy().setExtraParam('s_date', s_dateDABP);
		            	this.my_store.getProxy().setExtraParam('e_date', e_dateDABP);
		            	if(vCUR_DEPT_CODE=='02'&&pm_uid==null){
		            		if(vCUR_USER_UID!='79480003908'){
								this.my_store.getProxy().setExtraParam('pm_uid', vCUR_USER_UID );
								pm_uid = vCUR_USER_UID;
		            		}
		            	}else{
		            		this.my_store.getProxy().setExtraParam('pm_uid', pm_uid);
		            	}
		            	this.my_store.getProxy().setExtraParam('buyer_uid', buyer_uid);
		            	this.my_store.getProxy().setExtraParam('item_name', item);
		            	this.my_store.getProxy().setExtraParam('pj_code', pj_code);
		            	
		        		this.my_store.getProxy().setExtraParam("srch_type", 'excelPrint');
		        		this.my_store.getProxy().setExtraParam("srch_fields", 'major');
		        		this.my_store.getProxy().setExtraParam("srch_rows", 'all');
						this.my_store.getProxy().setExtraParam("menuCode", 'SOP');  
						
						
//		        		try {
		        			// var count = Number(this.my_store.getProxy().getReader().rawData.count);
		        			// console_logs('===count===', count);

							// var me = this;
		        			// this.my_store.load({
		        			//     scope: this,
		        			//     callback: function(records, operation, success) {
							// 		console_logs('>>aaa', records);
							// 		console_logs('>>bbb', operation);
		        			//     	var excelPath = this.my_store.getProxy().getReader().rawData.excelPath;
		        			//     	if(excelPath!=null && excelPath.length > 0) {
		        			//     		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
		        			//     		top.location.href=url;	
		        			//     	} else {
		        			//     		alert('다운로드 경로를 찾을 수 없습니다.');
		        			//     	}
		        			//     }
							// });
							
							Ext.Ajax.request({
								url: CONTEXT_PATH + '/production/pcsline.do?method=produceState',
								params:{
									pj_status: pj_status,
									s_date :s_dateDABP,
									e_date :e_dateDABP,
									pm_uid :pm_uid,
									buyer_uid :buyer_uid,
									item_name :item,
									pj_code :pj_code,
									srch_type :'excelPrint',
									srch_fields :'major',
									srch_rows :'all',
									menuCode :'SOP'
								},
								success : function(result, request) { 
									var jsonData = Ext.decode(result.responseText);
									var excelPath = jsonData.excelPath;
									if(excelPath!=null && excelPath.length > 0) {
										var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
										top.location.href=url;
									} else {
										alert('다운로드 경로를 찾을 수 없습니다.');
									}
								},// endofsuccess
								failure: extjsUtil.failureMessage
							});// endofajax
//		        		} catch(e){}

		        	}
		        	

				});	        
				if(vSYSTEM_TYPE != 'HANARO') {
				items.push({
					xtype : 'checkbox',
					id : 'chkAuto-produce-state',
					boxLabel : '<font color=white>화면유지</font>',
					tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
					checked: gMain.getSaveAutoRefresh(),
					listeners: {
							change: function(field, newValue, oldValue, eOpts){
								gMain.checkRefresh(newValue);
							},
							render: function(c) {
								Ext.create('Ext.tip.ToolTip', {
									target: c.getEl(),
									html: c.tip
								});
							}
					}
				}, '-');
			}
	        items.push({
				xtype : 'checkbox',
				id : 'chkOpenCrud-produce-state',
				boxLabel : '<font color=white>자동 창열기</font>',
				tip: '상세보기 창을 자동으로 엽니다.',
				checked: gMain.getOpenCrudWindow(),
				listeners: {
			            change: function(field, newValue, oldValue, eOpts){
			            	console_logs('field', field);
			            	console_logs('oldValue', oldValue);
			            	console_logs('newValue', newValue);
			            	console_logs('eOpts', eOpts);
			            	
			            	gMain.checkOpenCrudWindow(newValue);
			            },
			            render: function(c) {
				            Ext.create('Ext.tip.ToolTip', {
				                target: c.getEl(),
				                html: c.tip
				            });
				        }
	               }
			}, '-');
	        items.push({
	        	xtype: 'component',
	        	html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
	            //html: '<div class="inputBT"><button type="button" onClick="openNewWindow();"><span class="search">새창으로 보기</span></button></div>'
	        });
	        config.items = items;
        
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },

	
	layoutConfig: {columns: 1, rows:2},
			    defaults: {
			        collapsible: false,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
	bodyPadding: 10,
    
    orgSearchTypeStore : null,
    ocProduceStateCenterEast : null,
    ocProduceStateCenterCenter : null,
    selectedO1 : null,
    SERIES_BUFFER_ORG_MAP : null,
    
    storeLotTable1: null,
    gridLotTable1: null,
    storeProduceTable: null,
    south: null,

    initComponent: function(){
    	console_logs('this','Rfx.view.ProduceState');
    	
    	this.dockedItems = [this.createToolbar()];
        Ext.apply(this, {
            layout: 'border',
            items: [this.createSouth()]
        });
       // this.relayEvents(this.display, ['opentab']);
        this.relayEvents(this.south, ['rowdblclick']);
        this.callParent(arguments);
        
        this.orgSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});
        this.SERIES_BUFFER_ORG_MAP = new Ext.util.HashMap();
        
        this.redrawProduceAll();


    },
        
    redrawProduceAll: function() {
    	this.loadSouth();
    	//redrawProduceChart1();
    	//this.redrawProduceChart2('RESEARCH', '연구');
    	//redrawProduceTable('RESEARCH', null);
    	Ext.getBody().unmask();
    },

    redrawProduceTable: function(o1, name_in) { //RESEARCH, 201502, 2015년 02월
    	
    },
    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url){
        //this.grid.loadFeed(url);
       // this.display.loadFeed(url);
    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
    	console_logs('onSelect', rec);
       // this.display.setActive(rec);
    },

    
    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function(){
       // this.fireEvent('openall', this);
    },
    
    southStore: null,
    loadSouth: function() {
    	var store = this.southStore;
    	// 검색 조건 추가
    	 var s_dateDABP = Ext.getCmp('s_dateDABP');
		 s_dateDABP = s_dateDABP.getValue();
		 s_dateDABP = Ext.Date.format(s_dateDABP, 'Y-m-d');			  
    	 var e_dateDABP = Ext.getCmp('e_dateDABP');
		 e_dateDABP = e_dateDABP.getValue();
		 e_dateDABP = Ext.Date.format(e_dateDABP, 'Y-m-d');
    	 var pm_uid = Ext.getCmp('pm_uidDABP');
    	 pm_uid = pm_uid.getValue();
    	 var buyer_uid = Ext.getCmp('buyer_uid');
    	 buyer_uid = buyer_uid.getValue();
    	 var val = Ext.getCmp('item_nameDABP');
    	 var item_name = val.getValue();
    	 //console_logs('>>>>>>>>val', item_name);
    	 var item = Ext.JSON.encode(item_name);
    	 //console_logs('>>>>>>>>', item);
    	 var pj_code = Ext.getCmp('pj_codeDABP');
    	 pj_code = pj_code.getValue();
    	 
    	 var check = Ext.getCmp('checkbox');
    	 ch = check.getValue();

    	 if(ch==true){
    		this.southStore.getProxy().setExtraParam('pj_status', 'Y');
    	 }else{
    		 this.southStore.getProxy().setExtraParam('pj_status', null);
    	 }
    	this.southStore.getProxy().setExtraParam('s_date', s_dateDABP);
    	this.southStore.getProxy().setExtraParam('e_date', e_dateDABP);
    	if(vCUR_DEPT_CODE=='02'&&pm_uid==null){
    		if(vCUR_USER_UID!='79480003908'){
    			this.southStore.getProxy().setExtraParam('pm_uid', vCUR_USER_UID );
    		}
    	}else{
    		this.southStore.getProxy().setExtraParam('pm_uid', pm_uid);
    	}
    	this.southStore.getProxy().setExtraParam('buyer_uid', buyer_uid);
    	this.southStore.getProxy().setExtraParam('item_name', item);
    	this.southStore.getProxy().setExtraParam('pj_code', pj_code);
    	
    	//검색조건 넣고 검색했을떄
    	this.southStore.getProxy().setExtraParam('start', 0);
    	this.southStore.getProxy().setExtraParam('page', 1);
		this.southStore.getProxy().setExtraParam('limit', 50);

		
	    this.southStore.load( function(records){
			var start_date = new Date();
			console.log('>>> start_date', start_date);

        	console_logs('==== storeLoadCallback arr', arr);
	     	console_logs('==== storeLoadCallback records', records);
        	console_logs('==== storeLoadCallback store', store);
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
        		var col1 = cur.get('col1');
        		prev_rec['col1'] =col1;
        		var col2 = cur.get('col2');
        		prev_rec['col2'] =col2;
        		var col3 = cur.get('col3');
        		prev_rec['col3'] =col3;
        		var col4 = cur.get('col4');
        		prev_rec['col4'] =col4;
        		var col5 = cur.get('col5');
        		
	        		if(col5.indexOf('완료')>0){
	        			col5 = '<font color=#09b709>' + col5 + '</font>';
	        		}else if(col5.indexOf('생산중')>0){
	        			col5 = '<font color=#d80000>' + col5 + '</font>';
	        		}
        		prev_rec['col5'] =col5;
        		
        		var col6 = cur.get('col6');
        		
	        		if(col6.indexOf('완료')>0){
	        			col6 = '<font color=#09b709>' + col6 + '</font>';
	        		}else if(col6.indexOf('생산중')>0){
	        			col6 = '<font color=#d80000>' + col6 + '</font>';
	        		}
        		
        		prev_rec['col6'] =col6;
        		
        		var col7 = cur.get('col7');
	        		if(col7.indexOf('완료')>0){
	        			col7 = '<font color=#09b709>' + col7 + '</font>';
	        		}else if(col7.indexOf('생산중')>0){
	        			col7 = '<font color=#d80000>' + col7 + '</font>';
	        		}
        		
        		prev_rec['col7'] =col7;
        		var col8 = cur.get('col8');
	        		if(col8.indexOf('완료')>0){
	        			col8 = '<font color=#09b709>' + col8 + '</font>';
	        		}else if(col8.indexOf('생산중')>0){
	        			col8 = '<font color=#d80000>' + col8 + '</font>';
	        		}
        		
        		prev_rec['col8'] =col8;
        		
        		var col9 = cur.get('col9');
	        		if(col9.indexOf('완료')>0){
	        			col9 = '<font color=#09b709>' + col9 + '</font>';
	        		}else if(col9.indexOf('생산중')>0){
	        			col9 = '<font color=#d80000>' + col9 + '</font>';
	        		}
        		prev_rec['col9'] =col9;
        		
        		var col10 = cur.get('col10');
	        		if(col10.indexOf('완료')>0){
	        			col10 = '<font color=#09b709>' + col10 + '</font>';
	        		}else if(col10.indexOf('생산중')>0){
	        			col10 = '<font color=#d80000>' + col10 + '</font>';
	        		}
        		prev_rec['col10'] =col10;
        		var col11 = cur.get('col11');
	        		if(col11.indexOf('완료')>0){
	        			col11 = '<font color=#09b709>' + col11 + '</font>';
	        		}else if(col11.indexOf('생산중')>0){
	        			col11 = '<font color=#d80000>' + col11 + '</font>';
	        		}
        		prev_rec['col11'] =col11;
        		var col12 = cur.get('col12');
	        		if(col12.indexOf('완료')>0){
	        			col12 = '<font color=#09b709>' + col12 + '</font>';
	        		}else if(col12.indexOf('생산중')>0){
	        			col12 = '<font color=#d80000>' + col12 + '</font>';
	        		}
        		prev_rec['col12'] =col12;
        		var col13 = cur.get('col13');
	        		if(col11.indexOf('완료')>0){
	        			col13 = '<font color=#09b709>' + col13 + '</font>';
	        		}else if(col13.indexOf('생산중')>0){
	        			col13 = '<font color=#d80000>' + col13 + '</font>';
	        		}
        		prev_rec['col13'] =col13;
        		
        		var col14 = cur.get('col14');
        		prev_rec['col14'] =col14;
        		var col15 = cur.get('col15');
        		prev_rec['col15'] =col15;
	         	
        		arr.push(prev_rec);
        	} 	
			records = arr;
			
        	
        	store.removeAll();
			store.add(arr);
			var end_date = new Date();
			console.log('>>>> end_date',end_date);
			var elapsed_time = end_date - start_date;
			console.log('>>>> elapsed_time', elapsed_time);
        });
		
    },
    checkbox: null,
	 createSouth: function(){
		 
		 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		        groupHeaderTpl: '<b><font color=#003471>{name}</b></font> ({rows.length} 종)'
		    });
	    	
		 var model = Ext.create('Rfx.model.TotalState', {});
	 	 this.southStore = new Ext.data.Store({  
			pageSize: 50,
		    //groupField: 'class_name',
		    sorters: ['regist_date'],
			model:  model
		 });
	        this.southStore.on('load',function (store, records, successful, eOpts ){
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
	        		var col1 = cur.get('col1');
	        		prev_rec['col1'] =col1;
	        		var col2 = cur.get('col2');
	        		prev_rec['col2'] =col2;
	        		var col3 = cur.get('col3');
	        		prev_rec['col3'] =col3;
	        		var col4 = cur.get('col4');
	        		prev_rec['col4'] =col4;
	        		var col5 = cur.get('col5');
	        		
		        		if(col5.indexOf('완료')>0){
		        			col5 = '<font color=#09b709>' + col5 + '</font>';
		        		}else if(col5.indexOf('생산중')>0){
		        			col5 = '<font color=#d80000>' + col5 + '</font>';
		        		}
	        		prev_rec['col5'] =col5;
	        		
	        		var col6 = cur.get('col6');
	        		
		        		if(col6.indexOf('완료')>0){
		        			col6 = '<font color=#09b709>' + col6 + '</font>';
		        		}else if(col6.indexOf('생산중')>0){
		        			col6 = '<font color=#d80000>' + col6 + '</font>';
		        		}
	        		
	        		prev_rec['col6'] =col6;
	        		
	        		var col7 = cur.get('col7');
		        		if(col7.indexOf('완료')>0){
		        			col7 = '<font color=#09b709>' + col7 + '</font>';
		        		}else if(col7.indexOf('생산중')>0){
		        			col7 = '<font color=#d80000>' + col7 + '</font>';
		        		}
	        		
	        		prev_rec['col7'] =col7;
	        		var col8 = cur.get('col8');
		        		if(col8.indexOf('완료')>0){
		        			col8 = '<font color=#09b709>' + col8 + '</font>';
		        		}else if(col8.indexOf('생산중')>0){
		        			col8 = '<font color=#d80000>' + col8 + '</font>';
		        		}
	        		
	        		prev_rec['col8'] =col8;
	        		
	        		var col9 = cur.get('col9');
		        		if(col9.indexOf('완료')>0){
		        			col9 = '<font color=#09b709>' + col9 + '</font>';
		        		}else if(col9.indexOf('생산중')>0){
		        			col9 = '<font color=#d80000>' + col9 + '</font>';
		        		}
	        		prev_rec['col9'] =col9;
	        		
	        		var col10 = cur.get('col10');
		        		if(col10.indexOf('완료')>0){
		        			col10 = '<font color=#09b709>' + col10 + '</font>';
		        		}else if(col10.indexOf('생산중')>0){
		        			col10 = '<font color=#d80000>' + col10 + '</font>';
		        		}
	        		prev_rec['col10'] =col10;
	        		var col11 = cur.get('col11');
		        		if(col11.indexOf('완료')>0){
		        			col11 = '<font color=#09b709>' + col11 + '</font>';
		        		}else if(col11.indexOf('생산중')>0){
		        			col11 = '<font color=#d80000>' + col11 + '</font>';
		        		}
	        		prev_rec['col11'] =col11;
	        		var col12 = cur.get('col12');
		        		if(col12.indexOf('완료')>0){
		        			col12 = '<font color=#09b709>' + col12 + '</font>';
		        		}else if(col12.indexOf('생산중')>0){
		        			col12 = '<font color=#d80000>' + col12 + '</font>';
		        		}
	        		prev_rec['col12'] =col12;
	        		var col13 = cur.get('col13');
		        		if(col11.indexOf('완료')>0){
		        			col13 = '<font color=#09b709>' + col13 + '</font>';
		        		}else if(col13.indexOf('생산중')>0){
		        			col13 = '<font color=#d80000>' + col13 + '</font>';
		        		}
	        		prev_rec['col13'] =col13;
	        		
	        		var col14 = cur.get('col14');
	        		prev_rec['col14'] =col14;
	        		var col15 = cur.get('col15');
	        		prev_rec['col15'] =col15;
		         	
	        		arr.push(prev_rec);
	        	} 	
	        	records = arr;
	        	console_logs('==== storeLoadCallback arr', arr);
	        	
	        	store.removeAll();
	        	store.add(arr);
	       });
		    this.south = Ext.create('Rfx.view.grid.ProduceTableGrid', {
		    	title: makeGridTitle('<span>전체 </span> 생산현황'),
		    	border: true,
		    	resizable: true,
		    	scroll: true,
		    	minWidth: 200,
		        height: "100%",
		        region: 'south',
		        collapsible: false,
		        //layout          :'fit',
		        //forceFit: true,
		    	store: this.southStore,
//		          bbar: getPageToolbar(this.southStore, true, null, function () {
//                  	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                  })
		    	bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.southStore,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	                    	
//	                    	console_logs('---------------------------page', page);
//	                    	console_logs('***************************curpage', currentPage);
//	                    	console_logs('page', page.pageSize)
	                    	this.store.getProxy().setExtraParam('start', (currentPage-1)*50);
	                    	this.store.getProxy().setExtraParam('page', currentPage);
	                    	this.store.getProxy().setExtraParam('limit', 50);
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
				viewConfig: {
					getRowClass: function(record) {
						// var req_date = record.get('col15').split('<br>')[0];  // delivery_date
						// var today = Ext.Date.format(new Date(), 'Y-m-d');
						// req_date = new Date(req_date);
						// today = new Date(today);
						// var diff = req_date.getTime() - today.getTime();
						// diff = Math.ceil(diff / (1000 * 3600 * 24));

						// var cnt = 0;
						// while(true) {
						// 	if(req_date.getTime() < today.getTime() && cnt == 0) {
						// 		return 'green-row';
						// 	} else if(req_date.getTime() < today.getTime() && cnt > 0) {
						// 		if(cnt < 4) {
						// 			return 'red-row';
						// 		} else {
						// 			return;
						// 		}
						// 	} else {
						// 		var tmp = req_date.getDay();
						// 		// 일요일 제외
						// 		if(tmp == 0) {

						// 		} else {
						// 			cnt++;
						// 		}
						// 		today.setDate(today.getDate() + 1); 
						// 	}
						// };
					}
				}
		    	//features: [groupingFeature]
		    });
		    this.loadSouth();

	        return this.south;

    }
//    ,
//	statusFontChange: function(o){
//		if(o.indexOf('완료')>0)
//		var start = o.indexOf('완');
//		var end = o.indexOf('료', start+1);
//		var status = o.substring(start+1, end); 
//		
//		
//		return '<font color=#09b709>' + o + '</font>';
//	}
}
);
