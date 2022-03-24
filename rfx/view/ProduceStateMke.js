
Ext.define('Rfx.view.ProduceStateMke', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
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

		        		
		        		this.my_store.getProxy().setExtraParam("srch_type", 'excelPrint');
		        		this.my_store.getProxy().setExtraParam("srch_fields", 'major');
		        		this.my_store.getProxy().setExtraParam("srch_rows", 'all');
		        		this.my_store.getProxy().setExtraParam("menuCode", 'SOP');  
		        		
//		        		try {
		        			var count = Number(this.my_store.getProxy().getReader().rawData.count);
		        			console_logs('===count===', count);
		        			
		        			var me = this;
		        			this.my_store.load({
		        			    scope: this,
		        			    callback: function(records, operation, success) {
		        			    	console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
		        			    	var excelPath = me.my_store.getProxy().getReader().rawData.excelPath;
		        			    	if(excelPath!=null && excelPath.length > 0) {
		        			    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
		        			    		top.location.href=url;	
		        			    	} else {
		        			    		alert('다운로드 경로를 찾을 수 없습니다.');
		        			    	}
		        			    }
		        			});
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
		
		Ext.define('MenuModel', {
			extend: 'Ext.data.Model',
			fields: [
			{name: 'name'},
			{name: 'link'}
			]
		});

		this.store = Ext.create('Ext.data.Store', {
			model: 'MenuModel',
			data: []
		});


        Ext.apply(this, {
            layout: 'border',
			items: [this.getMenuTreePanel('현황관리',  []), this.createPivot() ]
        });
       // this.relayEvents(this.display, ['opentab']);
        this.relayEvents(this.center, ['rowdblclick']);
        this.callParent(arguments);
        
        this.orgSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});
        this.SERIES_BUFFER_ORG_MAP = new Ext.util.HashMap();
        
        this.redrawProduceAll();


    },
        
    redrawProduceAll: function() {
    	//this.loadSouth();
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
    	 var e_dateDABP = Ext.getCmp('e_dateDABP');
    	 e_dateDABP = e_dateDABP.getValue();
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
        	console_logs('==== storeLoadCallback arr', arr);
        	
        	store.removeAll();
        	store.add(arr);
        });
	    
    },
	
	createPivot: function() {
		
	
	Ext.define('Sale', function() {
	    var regions = {
	        "한국": '아시아',
	        "일본": '아시아',
	        "중국": '아시아',
	        "Canada": 'North America',
	        "USA": 'North America',
	        "독일": 'Europe'
	    };

	    return {
	        extend: 'Ext.data.Model',

	        fields: [
	            {name: 'id',        type: 'int'},
	            {name: 'company',   type: 'string'},
	            {name: 'country',   type: 'string'},
	            {name: 'person',    type: 'string'},
	            {name: 'date',      type: 'date', dateFormat: 'c'},
	            {name: 'value',     type: 'float', allowNull: true},
	            {name: 'quantity',  type: 'float', allowNull: true},
	            {
	                name: 'year',
	                calculate: function(data){
	                    return parseInt(Ext.Date.format(data.date, "Y"), 10);
	                }
	            },{
	                name: 'month',
	                calculate: function(data){
	                    return parseInt(Ext.Date.format(data.date, "m"), 10) - 1;
	                }
	            },{
	                name: 'continent',
	                calculate: function(data){
	                    return regions[data.country];
	                }
	            }
	        ]
	    };
	});
	
	
	var saleStore = Ext.create('Ext.data.Store', {
	    model : 'Sale'
	});

	var yearLabelRenderer = function(value){
        return  value + '년';
	};
	
	var monthLabelRenderer = function(value) {
        return Ext.Date.monthNames[value];
	};
	var onBeforeDocumentSave = function (view) {
        this.center.mask('Please wait ...');
    };

    var onDocumentSave = function (view) {
        this.center.unmask();
	};

	var 
		items = 500,
		rand = 37,
		companies = ['삼성', 'Apple', 'Dell', 'LG', 'Hynix'],
		countries = ['한국', '일본', '중국', 'Canada', 'USA', '독일'],
		persons = ['김영철', '이상훈', 'Kim Chul', '주강록', 'Robert'],
		randomItem = function(data){
			var k = rand % data.length;

			rand = rand * 1664525 + 1013904223;
			rand &= 0x7FFFFFFF;
			return data[k];
		},
		randomDate = function(start, end){
			return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime() ));
		},
		i, j;

	for (i = 0; i < items; i++){
		j = rand % companies
		saleStore.add ( {
			id:         i,
			company:    randomItem(companies),
			country:    randomItem(countries),
			person:     randomItem(persons),
			date:       randomDate(new Date(2012, 0, 1), new Date()),
			value:      Math.random() * 1000 + 1,
			quantity:   Math.floor(Math.random() * 30 + 1)
		});
	}

	var me
	 = Ext.create('Ext.pivot.Grid', {
		//title: makeGridTitle('<span>전체 </span> 생산현황'),
		//border: true,
		//resizable: true,
		scroll: true,
		//minWidth: 200,
		//height: "100%",
		//region: 'center',
		//collapsible: false,
		layout: 'fit',
		forceFit: true,
		selModel: {
			type: 'rowmodel'
		},

		plugins: {

			pivotexporter: true,
			pivotconfigurator: {
				id: 'configurator',
				// It is possible to configure a list of fields that can be used to
				// configure the pivot grid
				// If no fields list is supplied then all fields from the Store model
				// are fetched automatically
				fields: [{
					dataIndex: 'quantity',
					header: 'Qty',
					// You can even provide a default aggregator function to be used
					// when this field is dropped
					// on the agg dimensions
					aggregator: 'min',
					formatter: 'number("0")',
	
					settings: {
						// Define here in which areas this field could be used
						allowed: ['aggregate'],
						// Set a custom style for this field to inform the user that
						// it can be dragged only to "Values"
						style: {
							fontWeight: 'bold'
						},
						// Define here custom formatters that ca be used on this dimension
						formatters: {
							'0': 'number("0")',
							'0%': 'number("0%")'
						}
					}
				}, {
					dataIndex: 'value',
					header: 'Value',
	
					settings: {
						// Define here in which areas this field could be used
						allowed: 'aggregate',
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['sum', 'avg', 'count'],
						// Set a custom style for this field to inform the user that it
						// can be dragged only to "Values"
						style: {
							fontWeight: 'bold'
						},
						// Define here custom renderers that can be used on this dimension
						renderers: {
							'Colored 0,000.00': 'coloredRenderer'
						},
						// Define here custom formatters that ca be used on this dimension
						formatters: {
							'0': 'number("0")',
							'0.00': 'number("0.00")',
							'0,000.00': 'number("0,000.00")',
							'0%': 'number("0%")',
							'0.00%': 'number("0.00%")'
						}
					}
				}, {
					dataIndex: 'company',
					header: 'Company',
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['count']
					}
				}, {
					dataIndex: 'country',
					header: 'Country',
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['count']
					}
				}, {
					dataIndex: 'person',
					header: 'Person',
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: 'count'
					}
				}, {
					dataIndex: 'year',
					header: 'Year',
	
					settings: {
						// Define here the areas in which this field is fixed and cannot
						// be moved from
						fixed: ['topAxis']
					}
				}, {
					dataIndex: 'month',
					header: 'Month',
					labelRenderer: monthLabelRenderer,
	
					settings: {
						// Define here what aggregator functions can be used when this
						// field is used as an aggregate dimension
						aggregators: ['count'],
						// Define here in which areas this field could be used
						allowed: ['leftAxis', 'topAxis']
					}
				}]
			}
		},
	
		// Set this to true to lock leftAxis dimensions
		enableLocking: true,
	    // Set this to false if multiple dimensions are configured on leftAxis and
	    // you want to automatically expand the row groups when calculations are ready.
	    startRowGroupsCollapsed: false,
	
		doExport: function (config) {
			console.log('config', config);
			me.saveDocumentAs(config).then(null, this.onError);
		},
		onError: function (error) {
			Ext.Msg.alert('Error', typeof error === 'string' ? error : 'Unknown error');
		},
		getMyMatrix: function() {
			return this.matrix;
		},
	    matrix: {
	        type: 'local',
			store: saleStore,
			
		// Set layout type to "tabular". If this config is missing then the
        // default layout is "outline"
        viewLayoutType: 'tabular',

	        // Configure the aggregate dimensions. Multiple dimensions are supported.
	        aggregate: [{
	            dataIndex: 'value',
	            header: 'Total',
	            aggregator: 'sum',
	            width: 90
	        }],

	        // Configure the left axis dimensions that will be used to generate
	        // the grid rows
	        leftAxis: [{
	            dataIndex: 'person',
	            header: '담당자',
	            width: 80
	        }, {
	            dataIndex: 'company',
	            header: '발주처',
	            sortable: false,
	            width: 80
	        }],

	        /**
	         * Configure the top axis dimensions that will be used to generate
	         * the columns.
	         *
	         * When columns are generated the aggregate dimensions are also used.
	         * If multiple aggregation dimensions are defined then each top axis
	         * result will have in the end a column header with children columns
	         * for each aggregate dimension defined.
	         */
	        // topAxis: [{
	        //     dataIndex: 'country',
	        //     header: '국가'
			// }]
			topAxis: [{
				dataIndex: 'year',
				header: 'Year'
			}, {
				dataIndex: 'country',
				header: 'Country'
			}]
		},
		listeners: {
			// this event notifies us when the document was saved
			documentsave: function() {this.unmask();}, //onDocumentSave,
			beforedocumentsave: function() {this.mask('Please wait ...');}, //onBeforeDocumentSave,
			pivotdone: function(){
				// var me = this,
				// 	view = me.getView(),
				// 	pivot = view.down('pivotgrid'),
				// 	chart = view.down('chart');
	
				// if(chart){
				// 	view.remove(chart);
				// }
	
				// view.add({
				// 	xtype: 'cartesian',
				// 	region: 'south',
				// 	flex: 1,
				// 	legend: {
				// 		docked: 'bottom'
				// 	},
				// 	store: pivot.getPivotStore(),
				// 	axes: [{
				// 		type: 'numeric',
				// 		position: 'left',
				// 		adjustByMajorUnit: true,
				// 		fields: ['id'],
				// 		renderer: function(axis, v) {
				// 			return (v * 100).toFixed(0) + '%';
				// 		},
				// 		grid: true
				// 	},{
				// 		type: 'category',
				// 		position: 'bottom',
				// 		grid: true,
				// 		fields: ['id'],
				// 		renderer: Ext.bind(me.chartRenderer, pivot)
				// 	}],
				// 	series: [{
				// 		type: 'bar',
				// 		axis: 'left',
				// 		title: me.getTitles(pivot),
				// 		yField: me.getFields(pivot),
				// 		xField: 'id',
				// 		stacked: true
				// 	}]
				// });
			}
		},
	
		header: {
			itemPosition: 1, // after title before collapse tool
			items: [{
				ui: 'default-toolbar',
				xtype: 'button',
				text: '파일 내보내기...',
				menu: {
					defaults: {
						handler: function(btn){
							var cfg = Ext.merge({
								title: '매출 현황',
								fileName: 'PivotGridExport' + (btn.cfg.onlyExpandedNodes ? 'Visible' : '') + '.' + (btn.cfg.ext || btn.cfg.type)
							}, btn.cfg);
					
							me.doExport(cfg)
						},
					},
					items: [{
						text:   'Excel xlsx (pivot table definition)',
						handler: function () {
							console.log('exportToPivotXlsx');
							me.doExport({
								type: 'pivotxlsx',
								matrix: me.getMatrix(),
								title: '매출 현황',
								fileName: 'ExportPivot.xlsx'
							});
						}
					},{
						text:   'Excel xlsx (all items)',
						cfg: {
							type: 'excel07',
							ext: 'xlsx'
						}
					},{
						text:   'Excel xlsx (visible items)',
						cfg: {
							type: 'excel07',
							onlyExpandedNodes: true,
							ext: 'xlsx'
						}
					},{
						text: 'Excel xml (all items)',
						cfg: {
							type: 'excel03',
							ext: 'xml'
						}
					},{
						text:   'Excel xml (visible items)',
						cfg: {
							type: 'excel03',
							onlyExpandedNodes: true,
							ext: 'xml'
						}
					},{
						text:   'CSV (all items)',
						cfg: {
							type: 'csv'
						}
					},{
						text:   'CSV (visible items)',
						cfg: {
							type: 'csv',
							onlyExpandedNodes: true
						}
					},{
						text:   'TSV (all items)',
						cfg: {
							type: 'tsv',
							ext: 'csv'
						}
					},{
						text:   'TSV (visible items)',
						cfg: {
							type: 'tsv',
							onlyExpandedNodes: true,
							ext: 'csv'
						}
					},{
						text:   'HTML (all items)',
						cfg: {
							type: 'html'
						}
					},{
						text:   'HTML (visible items)',
						cfg: {
							type: 'html',
							onlyExpandedNodes: true
						}
					}]
				}
			}]
		}
		});
		 this.center =  Ext.create('Ext.panel.Panel', {
			title: makeGridTitle('<span>전체 </span> 생산현황'),
			border: true,
			resizable: true,
			scroll: true,
			minWidth: 200,
			height: "100%",
			region: 'center',
			collapsible: false,
			layout: 'fit',
			forceFit: true,
			items: [ 
			me
			// {
			// 	xtype: 'pivotgrid',
			// 	region: 'center',
			// 	scroll: true,
			// 	//minWidth: 200,
			// 	//height: "100%",
			// 	//region: 'center',
			// 	//collapsible: false,
			// 	layout: 'fit',
			// 	forceFit: true,
			// 	selModel: {
			// 		type: 'rowmodel'
			// 	},
		
			// 	plugins: {
		
			// 		pivotexporter: true,
			// 		pivotconfigurator: {
			// 			id: 'configurator',
			// 			dock: 'right',
			// 			// It is possible to configure a list of fields that can be used to
			// 			// configure the pivot grid
			// 			// If no fields list is supplied then all fields from the Store model
			// 			// are fetched automatically
			// 			fields: [{
			// 				dataIndex: 'quantity',
			// 				header: 'Qty',
			// 				// You can even provide a default aggregator function to be used
			// 				// when this field is dropped
			// 				// on the agg dimensions
			// 				aggregator: 'min',
			// 				formatter: 'number("0")',
			
			// 				settings: {
			// 					// Define here in which areas this field could be used
			// 					allowed: ['aggregate'],
			// 					// Set a custom style for this field to inform the user that
			// 					// it can be dragged only to "Values"
			// 					style: {
			// 						fontWeight: 'bold'
			// 					},
			// 					// Define here custom formatters that ca be used on this dimension
			// 					formatters: {
			// 						'0': 'number("0")',
			// 						'0%': 'number("0%")'
			// 					}
			// 				}
			// 			}, {
			// 				dataIndex: 'value',
			// 				header: 'Value',
			
			// 				settings: {
			// 					// Define here in which areas this field could be used
			// 					allowed: 'aggregate',
			// 					// Define here what aggregator functions can be used when this
			// 					// field is used as an aggregate dimension
			// 					aggregators: ['sum', 'avg', 'count'],
			// 					// Set a custom style for this field to inform the user that it
			// 					// can be dragged only to "Values"
			// 					style: {
			// 						fontWeight: 'bold'
			// 					},
			// 					// Define here custom renderers that can be used on this dimension
			// 					renderers: {
			// 						'Colored 0,000.00': 'coloredRenderer'
			// 					},
			// 					// Define here custom formatters that ca be used on this dimension
			// 					formatters: {
			// 						'0': 'number("0")',
			// 						'0.00': 'number("0.00")',
			// 						'0,000.00': 'number("0,000.00")',
			// 						'0%': 'number("0%")',
			// 						'0.00%': 'number("0.00%")'
			// 					}
			// 				}
			// 			}, {
			// 				dataIndex: 'company',
			// 				header: 'Company',
			
			// 				settings: {
			// 					// Define here what aggregator functions can be used when this
			// 					// field is used as an aggregate dimension
			// 					aggregators: ['count']
			// 				}
			// 			}, {
			// 				dataIndex: 'country',
			// 				header: 'Country',
			
			// 				settings: {
			// 					// Define here what aggregator functions can be used when this
			// 					// field is used as an aggregate dimension
			// 					aggregators: ['count']
			// 				}
			// 			}, {
			// 				dataIndex: 'person',
			// 				header: 'Person',
			
			// 				settings: {
			// 					// Define here what aggregator functions can be used when this
			// 					// field is used as an aggregate dimension
			// 					aggregators: 'count'
			// 				}
			// 			}, {
			// 				dataIndex: 'year',
			// 				header: 'Year',
			
			// 				settings: {
			// 					// Define here the areas in which this field is fixed and cannot
			// 					// be moved from
			// 					fixed: ['topAxis']
			// 				}
			// 			}, {
			// 				dataIndex: 'month',
			// 				header: 'Month',
			// 				labelRenderer: monthLabelRenderer,
			
			// 				settings: {
			// 					// Define here what aggregator functions can be used when this
			// 					// field is used as an aggregate dimension
			// 					aggregators: ['count'],
			// 					// Define here in which areas this field could be used
			// 					allowed: ['leftAxis', 'topAxis']
			// 				}
			// 			}]
			// 		}
			// 	},
			
			// 	// Set this to true to lock leftAxis dimensions
			// 	enableLocking: true,
			// 	// Set this to false if multiple dimensions are configured on leftAxis and
			// 	// you want to automatically expand the row groups when calculations are ready.
			// 	startRowGroupsCollapsed: false,
			
			// 	doExport: function (config) {
			// 		console.log('config', config);
			// 		me.saveDocumentAs(config).then(null, this.onError);
			// 	},
			// 	onError: function (error) {
			// 		Ext.Msg.alert('Error', typeof error === 'string' ? error : 'Unknown error');
			// 	},
			// 	getMyMatrix: function() {
			// 		return this.matrix;
			// 	},
			// 	matrix: {
			// 		type: 'local',
			// 		store: saleStore,
					
			// 	// Set layout type to "tabular". If this config is missing then the
			// 	// default layout is "outline"
			// 	viewLayoutType: 'tabular',
		
			// 		// Configure the aggregate dimensions. Multiple dimensions are supported.
			// 		aggregate: [{
			// 			dataIndex: 'value',
			// 			header: 'Total',
			// 			aggregator: 'sum',
			// 			width: 90
			// 		}],
		
			// 		// Configure the left axis dimensions that will be used to generate
			// 		// the grid rows
			// 		leftAxis: [{
			// 			dataIndex: 'person',
			// 			header: '담당자',
			// 			width: 80
			// 		}, {
			// 			dataIndex: 'company',
			// 			header: '발주처',
			// 			sortable: false,
			// 			width: 80
			// 		}],
		
			// 		/**
			// 		 * Configure the top axis dimensions that will be used to generate
			// 		 * the columns.
			// 		 *
			// 		 * When columns are generated the aggregate dimensions are also used.
			// 		 * If multiple aggregation dimensions are defined then each top axis
			// 		 * result will have in the end a column header with children columns
			// 		 * for each aggregate dimension defined.
			// 		 */
			// 		// topAxis: [{
			// 		//     dataIndex: 'country',
			// 		//     header: '국가'
			// 		// }]
			// 		topAxis: [{
			// 			dataIndex: 'year',
			// 			header: 'Year'
			// 		}, {
			// 			dataIndex: 'country',
			// 			header: 'Country'
			// 		}]
			// 	},
			// 	listeners: {
			// 		// this event notifies us when the document was saved
			// 		documentsave: onDocumentSave,
			// 		beforedocumentsave: onBeforeDocumentSave,
			// 		pivotdone: function(){
			// 			// var me = this,
			// 			// 	view = me.getView(),
			// 			// 	pivot = view.down('pivotgrid'),
			// 			// 	chart = view.down('chart');
			
			// 			// if(chart){
			// 			// 	view.remove(chart);
			// 			// }
			
			// 			// view.add({
			// 			// 	xtype: 'cartesian',
			// 			// 	region: 'south',
			// 			// 	flex: 1,
			// 			// 	legend: {
			// 			// 		docked: 'bottom'
			// 			// 	},
			// 			// 	store: pivot.getPivotStore(),
			// 			// 	axes: [{
			// 			// 		type: 'numeric',
			// 			// 		position: 'left',
			// 			// 		adjustByMajorUnit: true,
			// 			// 		fields: ['id'],
			// 			// 		renderer: function(axis, v) {
			// 			// 			return (v * 100).toFixed(0) + '%';
			// 			// 		},
			// 			// 		grid: true
			// 			// 	},{
			// 			// 		type: 'category',
			// 			// 		position: 'bottom',
			// 			// 		grid: true,
			// 			// 		fields: ['id'],
			// 			// 		renderer: Ext.bind(me.chartRenderer, pivot)
			// 			// 	}],
			// 			// 	series: [{
			// 			// 		type: 'bar',
			// 			// 		axis: 'left',
			// 			// 		title: me.getTitles(pivot),
			// 			// 		yField: me.getFields(pivot),
			// 			// 		xField: 'id',
			// 			// 		stacked: true
			// 			// 	}]
			// 			// });
			// 		}
			// 	},
			
			// 	header: {
			// 		itemPosition: 1, // after title before collapse tool
			// 		items: [{
			// 			ui: 'default-toolbar',
			// 			xtype: 'button',
			// 			text: '파일 내보내기...',
			// 			menu: {
			// 				defaults: {
			// 					handler: function(btn){
			// 						var cfg = Ext.merge({
			// 							title: '매출 현황',
			// 							fileName: 'PivotGridExport' + (btn.cfg.onlyExpandedNodes ? 'Visible' : '') + '.' + (btn.cfg.ext || btn.cfg.type)
			// 						}, btn.cfg);
							
			// 						me.doExport(cfg)
			// 					},
			// 				},
			// 				items: [{
			// 					text:   'Excel xlsx (pivot table definition)',
			// 					handler: function () {
			// 						console.log('exportToPivotXlsx');
			// 						me.doExport({
			// 							type: 'pivotxlsx',
			// 							matrix: me.getMatrix(),
			// 							title: '매출 현황',
			// 							fileName: 'ExportPivot.xlsx'
			// 						});
			// 					}
			// 				},{
			// 					text:   'Excel xlsx (all items)',
			// 					cfg: {
			// 						type: 'excel07',
			// 						ext: 'xlsx'
			// 					}
			// 				},{
			// 					text:   'Excel xlsx (visible items)',
			// 					cfg: {
			// 						type: 'excel07',
			// 						onlyExpandedNodes: true,
			// 						ext: 'xlsx'
			// 					}
			// 				},{
			// 					text: 'Excel xml (all items)',
			// 					cfg: {
			// 						type: 'excel03',
			// 						ext: 'xml'
			// 					}
			// 				},{
			// 					text:   'Excel xml (visible items)',
			// 					cfg: {
			// 						type: 'excel03',
			// 						onlyExpandedNodes: true,
			// 						ext: 'xml'
			// 					}
			// 				},{
			// 					text:   'CSV (all items)',
			// 					cfg: {
			// 						type: 'csv'
			// 					}
			// 				},{
			// 					text:   'CSV (visible items)',
			// 					cfg: {
			// 						type: 'csv',
			// 						onlyExpandedNodes: true
			// 					}
			// 				},{
			// 					text:   'TSV (all items)',
			// 					cfg: {
			// 						type: 'tsv',
			// 						ext: 'csv'
			// 					}
			// 				},{
			// 					text:   'TSV (visible items)',
			// 					cfg: {
			// 						type: 'tsv',
			// 						onlyExpandedNodes: true,
			// 						ext: 'csv'
			// 					}
			// 				},{
			// 					text:   'HTML (all items)',
			// 					cfg: {
			// 						type: 'html'
			// 					}
			// 				},{
			// 					text:   'HTML (visible items)',
			// 					cfg: {
			// 						type: 'html',
			// 						onlyExpandedNodes: true
			// 					}
			// 				}]
			// 			}
			// 		}]
			// 	}
			// }
		]
				});

		return this.center;
	},
	checkbox: null
});
