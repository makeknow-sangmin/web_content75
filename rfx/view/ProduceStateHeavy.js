
Ext.define('Rfx.view.ProduceStateHeavy', {
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
	                id:  gMain.selectedMenuId +   's_date',
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
		                id: gMain.selectedMenuId + 'e_date',
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
	              // id : 'pm_uid',
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
	               xtype:          'combo',
	               mode:           'local',
	               editable:       true,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'wa_name',
	               valueField:   'unique_id',
	               triggerAction:  'all',
	               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
	               store: Ext.create('Mplm.store.BuyerStore', {hasNull:true} ),
	               width: 120,
	               cls : 'newCSS',
	              // id : 'buyer_uid',
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
		              // id : 'item_name',
		               name : 'item_name',
		               listeners : {
	  		      		   render: function( component ) {
//				                component.getEl().on('click', treatOrgCombo  );
//				                component.getEl().on('keypress', treatOrgCombo  );
				           }
	  		      	  },
	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		            });
			
	    	items.push({
				xtype : 'checkbox',
				boxLabel : '완료제외',
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
            config.items = items;
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
    	console_logs('this','Rfx.view.ProduceStateHeavy');
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
    	
//    	// 검색 조건 추가
//    	 var s_date = Ext.getCmp(gMain.selectedMenuId +   's_date');
//    	 s_date = s_date.getValue();
//    	 var e_date = Ext.getCmp(gMain.selectedMenuId +   'e_date');
//    	 e_date = e_date.getValue();
//    	 var pm_uid = Ext.getCmp('pm_uid');
//    	 pm_uid = pm_uid.getValue();
//    	 var buyer_uid = Ext.getCmp('buyer_uid');
//    	 buyer_uid = buyer_uid.getValue();
//    	 var val = Ext.getCmp('item_name');
//    	 var item_name = val.getValue();
//    	 //console_logs('>>>>>>>>val', item_name);
//    	 var item = Ext.JSON.encode(item_name);
//    	 //console_logs('>>>>>>>>', item);
//    	
    	this.southStore.getProxy().setExtraParam('comast_uid', vCOMAST_UID);
    	
	    this.southStore.load( function(records){
	     	console_logs('==== storeLoadCallback records', records);
        	console_logs('==== storeLoadCallback store', store);
        	
//        	
//        	var arr = [];
//        	var prev_pj_code = null;
//        	var prev_rec = null;
//        	for(var i=0; i< records.length; i++) {
//        		var cur = records[i];
//        		
//        		var pj_code = cur.get('pj_code');
//        		if(pj_code!=prev_pj_code) {
//        			prev_rec = {};
//        			for (var key in cur['data']) { 
//        				prev_rec[key] = cur.get(key); 
//        			}
//        			arr.push(prev_rec);
//        			console_logs('==== prev_rec', prev_rec);
//        		}
//        		var ratio =   cur.get('process_qty')==0 ? 0 : cur.get('outpcs_qty') / cur.get('process_qty');
//        		var supplier_name = cur.get('supplier_name');
//        		if(supplier_name!='<사내>') {
//        			supplier_name = '<font color=#003471><b>' + supplier_name + '</b></font>'
//        		}
//        		
//        		var progress = Ext.util.Format.number(ratio*100, '0,00.0') + '%';
//        		if(ratio>0) {
//        			progress = '<font color=#C1493B>' + progress + '</font>'
//        		}
//        		prev_rec['ratio' + cur.get('pcs_no')] =ratio;        		
//        		prev_rec['pcs' + cur.get('pcs_no')] = cur.get('pcs_name') + ' : ' + supplier_name +
//        														'<br/>' + progress;
//        		prev_pj_code = pj_code;
//        		console_logs('==== prev_pj_code', prev_pj_code);
//        		//prev_rec[cur.get('pcs_no')+'Name'] = cur.get('pcs_name');
//        		//prev_rec[cur.get('pcs_no')+'Supplier'] = cur.get('supplier_name');
//        		
//        	}
// //       	//records = arr;
//        	console_logs('==== storeLoadCallback arr', arr);
//        	
//        	store.removeAll();
//        	store.add(arr);
        });
	    
    },
	 createSouth: function(){
		 
		 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		        groupHeaderTpl: '<b><font color=#003471>{name}</b></font> ({rows.length} 종)'
		    });
	    	
		 var model = Ext.create('Rfx.model.TotalStateHeavy', {});
	 	 this.southStore = new Ext.data.Store({  
			pageSize: 50,
		    //groupField: 'class_name',
		    sorters: ['regist_date'],
			model:  model
		 });
	 	 
		    this.south = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
		    	title: makeGridTitle('<span>LOT(작업그룹)</span> 별 생산현황'),
		    	border: true,
		    	resizable: true,
		    	scroll: true,
		    	minWidth: 200,
		        height: "100%",
		        region: 'south',
		        collapsible: false,
		        layout          :'fit',
		        forceFit: true,
		    	store: this.southStore,
		          bbar: getPageToolbar(this.southStore, true, null, function () {
                  	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                  })
		    	//features: [groupingFeature]
		    });
		    
		    this.loadSouth();

	        return this.south;

    }
});
