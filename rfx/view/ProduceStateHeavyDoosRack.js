Ext.define('exceed_msg', {
	singleton: true,
	this_msg: '',
	count: 0
});

Ext.define('Rfx.view.ProduceStateHeavyDoosRack', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel', 
    alias: 'widget.produceState',
    frame: false,
    border: false, 
    split: true,
    //exceed_msg: '납기일이 초과된 자재가 있습니다.<br>',
    createToolbar: function(){

        var items = [],
            config = {};
        if (!this.inTab) {
        	//var orgSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});
        	items.push(
    				 {
    					 style: 'color:white;',
	   		        	 xtype:'tbtext',
	   		        	 text:'기간:'
	   		          },{ 
	                name: 's_date',
	                id: 's_dateDoos',
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
		                id: 'e_dateDoos',
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
			/*items.push(
					
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
	            });*/
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
        	switch(vCompanyReserved4){
        	case "HAEW01KR":
        	case "DAEH01KR":
        		break;
        	case "CHNG01KR":
        		items.push({
        			 emptyText: '블록번호',
				       xtype: 'triggerfield',
		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		               store: this.produceStores[0],
		               width: 100,
		               style: 'cursor:pointer',
		               cls : 'newCSS',
		               id : 'reserved_varchar2',
		               name : 'reserved_varchar2',
		               enableKeyEvents: true,
		               listeners : {
	  		      		   render: function( component ) {
	  		      			component.getEl().on('keyup', function() {
	  		      				gUtil.redrawProduceAll();
	  		      			});
				           }
	  		      	  },
	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
        		});
        	   	items.push({
   				       emptyText: '호선',
   				       xtype: 'triggerfield',
   		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
   		               //store: Ext.create('Mplm.store.ClaAstStoreMt', {hasNull:true} ),
   		               width: 100,
   		               style: 'cursor:pointer',
   		               cls : 'newCSS',
   		               id : 'pj_name',
   		               name : 'pj_name',
   		               enableKeyEvents: true,
   		               listeners : {
   	  		      		   render: function( component ) {
   	  		      			component.getEl().on('keyup', function() {
   	  		      				gUtil.redrawProduceAll();
   	  		      			});
   				           }
   	  		      	  },
   	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
   		            }, '--');
        		break;
//        	case "DAEH01KR":
//        		items.push(
////   					 {
////     					 style: 'color:white;',
////   	   		        	 xtype:'tbtext',
////   	   		        	 text:'제품선택:'
////   	   		          },
//   					{
//   				       emptyText: 'LOT 번호',
//   				       xtype: 'triggerfield',
//   		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
//   		               store: this.produceStores[0],
//   		               width: 100,
//   		               style: 'cursor:pointer',
//   		               cls : 'newCSS',
//   		               id : 'lot_no',
//   		               name : 'lot_no',
//   		               enableKeyEvents: true,
//   		               listeners : {
//   	  		      		   render: function( component ) {
//   	  		      			component.getEl().on('keyup', function() {
//   	  		      				gUtil.redrawProduceAll();
//   	  		      			});
//   				           }
//   	  		      	  },
//   	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
//   		            });
//        		items.push(
////   					 {
////     					 style: 'color:white;',
////   	   		        	 xtype:'tbtext',
////   	   		        	 text:'제품선택:'
////   	   		          },
//        				{
//        					emptyText: 'W/O일',
//        					xtype: 'triggerfield',
//        					fieldStyle: 'background-color: #D6E8F6; background-image: none;',
//        					store: this.produceStores[0],
//        					width: 100,
//        					style: 'cursor:pointer',
//        					cls : 'newCSS',
//        					id : 'reserved2',
//        					name : 'reserved2',
//        					enableKeyEvents: true,
//        					listeners : {
//        						render: function( component ) {
//        							component.getEl().on('keyup', function() {
//        								gUtil.redrawProduceAll();
//        							});
//        						}
//        					},
//        					trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
//        				});
//        		break;
        	
        	default :
			items.push(
//					 {
//  					 style: 'color:white;',
//	   		        	 xtype:'tbtext',
//	   		        	 text:'제품선택:'
//	   		          },
					{
				       emptyText: '블록번호',
				       xtype: 'triggerfield',
		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		               store: this.produceStores[0],
		               width: 100,
		               style: 'cursor:pointer',
		               cls : 'newCSS',
		               id : 'area_codeDoos',
		               name : 'area_code',
		               enableKeyEvents: true,
		               listeners : {
	  		      		   render: function( component ) {
	  		      			component.getEl().on('keyup', function() {
	  		      				gUtil.redrawProduceAll();
	  		      			});
				           }
	  		      	  },
	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		            });
        	items.push(
//					 {
//					 style: 'color:white;',
//	   		        	 xtype:'tbtext',
//	   		        	 text:'제품선택:'
//	   		          },
					{
				       emptyText: '호선',
				       xtype: 'triggerfield',
		               fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		               //store: Ext.create('Mplm.store.ClaAstStoreMt', {hasNull:true} ),
		               width: 100,
		               style: 'cursor:pointer',
		               cls : 'newCSS',
		               id : 'pj_nameDoos',
		               name : 'pj_name',
		               enableKeyEvents: true,
		               listeners : {
	  		      		   render: function( component ) {
//				                component.getEl().on('click', treatOrgCombo  );
//				                component.getEl().on('keypress', treatOrgCombo  );
	  		      			component.getEl().on('keyup', function() {
	  		      				gUtil.redrawProduceAll();
	  		      			});
				           }
	  		      	  },
	  		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		            }, '--');
        		break;
        	}
			
	    	/*items.push({
				xtype : 'checkbox',
				id : 'checkbox',
				boxLabel : '완료포함',
				style : 'color: #fafafa',
				checked: false,
				listeners: {
			            change: function(field, newValue, oldValue, eOpts){
			            }
	               }
			}, '-');*/
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
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },

    layoutConfig: {
        columns: 1,
        rows: 2
    },
    defaults: {
        collapsible: false,
        split: true,
        cmargins: '2 0 0 0',
        margins: '0 0 0 0'
    },
    bodyPadding: 10,

    // orgSearchTypeStore: null,
    ocProduceStateCenterEast: null,
    ocProduceStateCenterCenter: null,
    selectedO1: null,
    SERIES_BUFFER_ORG_MAP: null,

    storeLotTable1: null,
    gridLotTable1: null,
    storeProduceTable: null,
    produceGrids: [],
    produceStores: [],
    groupingFeature: [],
    
    defineColumns:  function(big_pcs_code){
    	
    	switch(vCompanyReserved4) {
    	case "DAEH01KR":
    		this.columns2 = [
 	    	   {
 	    		text: '이름',
 	   			cls:'rfx-grid-header', 
 	   			dataIndex: 'user_name_1',
 	   			resizable: true,
 	   			width: 100,
 	   			autoSizeColumn : false,
 	   			style: 'text-align:center',     
 	   			align:'center'
 	    	   },
 	    	   {
 	    		   text: '부서명',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'ep_dept_name_1',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: 'text-align:center',     
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '근태',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'ep_suborg_code_1',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: {background:'#F5AB35'},
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '이름',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'user_name_2',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: 'text-align:center',     
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '부서명',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'ep_dept_name_2',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: 'text-align:center',     
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '근태',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'ep_suborg_code_2',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: {background:'#F5AB35'},
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '이름',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'user_name_3',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: 'text-align:center',     
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '부서명',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'ep_dept_name_3',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: 'text-align:center',     
 	    		   align:'center'
 	    	   },
 	    	   {
 	    		   text: '근태',
 	    		   cls:'rfx-grid-header', 
 	    		   dataIndex: 'ep_suborg_code_3',
 	    		   resizable: true,
 	    		   width: 100,
 	    		   autoSizeColumn : false,
 	    		   style: {background:'#F5AB35'},
 	    		   align:'center'
 	    	   },
// 	    	   {
// 	    		   text: '이름',
// 	    		   cls:'rfx-grid-header', 
// 	    		   dataIndex: 'user_name_4',
// 	    		   resizable: true,
// 	    		   width: 100,
// 	    		   autoSizeColumn : false,
// 	    		   style: 'text-align:center',     
// 	    		   align:'center'
// 	    	   },
// 	    	   {
// 	    		   text: '부서명',
// 	    		   cls:'rfx-grid-header', 
// 	    		   dataIndex: 'ep_dept_name_4',
// 	    		   resizable: true,
// 	    		   width: 100,
// 	    		   autoSizeColumn : false,
// 	    		   style: 'text-align:center',     
// 	    		   align:'center'
// 	    	   },
// 	    	   {
// 	    		   text: '근태',
// 	    		   cls:'rfx-grid-header', 
// 	    		   dataIndex: 'ep_suborg_code_4',
// 	    		   resizable: true,
// 	    		   width: 100,
// 	    		   autoSizeColumn : false,
// 	    		   style: {background:'#F5AB35'},
// 	    		   align:'center'
// 	    	   },
		    	{
		    		text: '이름',
		    		cls:'rfx-grid-header', 
		    		dataIndex: 'user_name_5',
		    		resizable: true,
		    		width: 100,
		    		autoSizeColumn : false,
		    		style: 'text-align:center',     
		    		align:'center'
		    	},
		    	{
		    		text: '부서명',
		    		cls:'rfx-grid-header', 
		    		dataIndex: 'ep_dept_name_5',
		    		resizable: true,
		    		width: 100,
		    		autoSizeColumn : false,
		    		style: 'text-align:center',     
		    		align:'center'
		    	},
		    	{
		    		text: '근태',
		    		cls:'rfx-grid-header', 
		    		dataIndex: 'ep_suborg_code_5',
		    		resizable: true,
		    		width: 100,
		    		autoSizeColumn : false,
		    		style: {background:'#F5AB35'},
		    		align:'center'
		    	}
 	    	],
 	    	this.columns = [
 	    			{
	    			   text: 'W/O 일',
	        		   cls:'rfx-grid-header', 
	        		   dataIndex: 'reserved2',
	        		   resizable: true,
	        		   autoSizeColumn : true,
	        		   style: 'text-align:center',
	        	       width : 150,
	        		   align:'center'
	    		   },
	    		   {
	    			   text: '수량',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'quan_HW',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   },
	    		   {
	    			   text: '생산수량',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'yquan',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   },
	    		   {
	    			   text: '미생산수량',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'pquan',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   }, 
	    		   {
	    			   text: '진행률',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'YPercent',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center',
	    		   },
	    		   { 
	    			   text: 'HE',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'HE',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'HE_1',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'HE_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'HE_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    				   ]
	    		   },
	    		   { 
	    			   text: 'NS',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'NS',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'NS_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'NS_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'NS_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'NH',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'NH',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'NH_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'NH_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'NH_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'HELO',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'HELO',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'HELO_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'HELO_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'HELO_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'LO',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'LO',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   height : 60,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'LO_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'LO_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'LO_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   ]
    		break;
    	case "HAEW01KR":
    		this.columns2 = [
    			{
    				text: '경영/관리팀',
    				cls:'rfx-grid-header', 
    				dataIndex: 'manage_Team',
    				resizable: true,
    				width: 150,
    				autoSizeColumn : false,
    				style: 'text-align:center',     
    				align:'center',
    				columns : [
    					{
    						text: '이름',
    						cls:'rfx-grid-header', 
    						dataIndex: 'user_name_2',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: 'text-align:center',     
    						align:'center'
    					},
    					{
    						text: '부서명',
    						cls:'rfx-grid-header', 
    						dataIndex: 'ep_dept_name_2',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: 'text-align:center',     
    						align:'center'
    					},
    					{
    						text: '근태',
    						cls:'rfx-grid-header', 
    						dataIndex: 'ep_suborg_code_2',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: {background:'#F5AB35'},
    						align:'center'
    					}
    				]
    			},
    			{
    				text: '생산1팀',
    				cls:'rfx-grid-header', 
    				dataIndex: 'manage_Team',
    				resizable: true,
    				width: 150,
    				autoSizeColumn : false,
    				style: 'text-align:center',     
    				align:'center',
    				columns : [
    					{
    						text: '이름',
    						cls:'rfx-grid-header', 
    						dataIndex: 'user_name_1',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: 'text-align:center',     
    						align:'center'
    					},
    					{
    						text: '부서명',
    						cls:'rfx-grid-header', 
    						dataIndex: 'ep_dept_name_1',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: 'text-align:center',     
    						align:'center'
    					},
    					{
    						text: '근태',
    						cls:'rfx-grid-header', 
    						dataIndex: 'ep_suborg_code_1',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: {background:'#F5AB35'},
    						align:'center'
    					}
    				]
    			},
    			{
    				text: '생산2팀',
    				cls:'rfx-grid-header', 
    				dataIndex: 'produce_Team',
    				resizable: true,
    				width: 150,
    				autoSizeColumn : false,
    				style: 'text-align:center',     
    				align:'center',
    				columns : [
    					{
    						text: '이름',
    						cls:'rfx-grid-header', 
    						dataIndex: 'user_name_3',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: 'text-align:center',     
    						align:'center'
    					},
    					{
    						text: '부서명',
    						cls:'rfx-grid-header', 
    						dataIndex: 'ep_dept_name_3',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: 'text-align:center',     
    						align:'center'
    					},
    					{
    						text: '근태',
    						cls:'rfx-grid-header', 
    						dataIndex: 'ep_suborg_code_3',
    						resizable: true,
    						width: 150,
    						autoSizeColumn : false,
    						style: {background:'#F5AB35'},
    						align:'center'
    					}
    					]
    				}
    	    	],
    	    	this.columns = [
 	    			{
	    			   text: 'W/O 일',
	        		   cls:'rfx-grid-header', 
	        		   dataIndex: 'h_reserved8',
	        		   resizable: true,
	        		   autoSizeColumn : true,
	        		   style: 'text-align:center',
	        	       width : 150,
	        		   align:'center'
	    		   },
	    		   {
	    			   text: '수량',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'quan_HW',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   },
	    		   {
	    			   text: '생산수량',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'yquan',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   },
	    		   {
	    			   text: '미생산수량',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'pquan',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   }, 
	    		   {
	    			   text: '진행률',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'YPercent',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 150,
	    			   align:'center'
	    		   },
	    		   { 
	    			   text: 'CN',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'CN',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'CN_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'CN_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'CN_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'CS',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'CS',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'CS_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'CS_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'CS_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'CU',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'CU',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'CU_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'CU_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'CU_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'DSS',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'DSS',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   height : 60,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'DSS_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'DSS_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'DSS_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'DSS_text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   {
	    			   text: 'SS ',
	    			   cls:'rfx-grid-header', 
	    			   dataIndex: 'SS',
	    			   resizable: true,
	    			   autoSizeColumn : true,
	    			   style: 'text-align:center',
	    			   width : 190,
	    			   align:'center',
	    			   style: {background:'#F5AB35'},
	    			   columns : [
	    				   {
	    					   text: '미배재 ',
	    	    			   cls:'rfx-grid-header', 
	    	    			   dataIndex: 'SS_1',
	    	    			   resizable: true,
	    	    			   autoSizeColumn : true,
	    	    			   style: 'text-align:center',
	    	    			   width : 60,
	    	    			   align:'center',
	    	    			   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '미제작 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'SS_2',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 60,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   },
	    				   {
	    					   text: '자재문제 ',
	    					   cls:'rfx-grid-header', 
	    					   dataIndex: 'SS_3',
	    					   resizable: true,
	    					   autoSizeColumn : true,
	    					   style: 'text-align:center',
	    					   width : 70,
	    					   align:'center',
	    					   style: {background:'#F5AB35'}
	    				   }
	    			   ]
	    		   },
	    		   ]
            break;
    	case "DOOS01KR":
    	case "KYNL01KR":
    	case "KWLM01KR":
    	case "HSGC01KR":
		case "SKNH01KR":
    		this.columns =  [
		    	   {
		   			text: '호선',
		   			cls:'rfx-grid-header', 
		   			dataIndex: 'pj_name',
		   			resizable: true,
		   			autoSizeColumn : true,
		   			style: 'text-align:center',
		   			width : 80,
		   			align:'center'
		   			}, 
     			{
     			text: '블록번호',
     			cls:'rfx-grid-header', 
     			dataIndex: 'area_code',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center',
     			width : 80,
     			align:'center'
     			}, 
     			{
     			text: '부재번호',
     			cls:'rfx-grid-header', 
     			dataIndex: 'class_code',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center',   
     			width : 80,
     			align:'center'
         		},
     			{
     			text: '중량',
     			cls:'rfx-grid-header', 
     			dataIndex: 'mass',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center', 
     			width : 80,
     			align:'center'
     			},
     			{
     			text: '수량',
     			cls:'rfx-grid-header', 
     			dataIndex: 'quan',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center',     
     			width : 80,
     			align:'center'
     			}
     			
     		];
    		break;
    	case "CHNG01KR":
    		this.columns =  [
	    	   {
	   			text: '호선',
	   			cls:'rfx-grid-header', 
	   			dataIndex: 'pj_name',
	   			resizable: true,
	   			autoSizeColumn : true,
	   			style: 'text-align:center',
	   			width : 100,
	   			align:'center'
	   			}, 
     			{
     			text: '블록번호',
     			cls:'rfx-grid-header', 
     			dataIndex: 'reserved_varchar2',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center',
     			width : 100,
     			align:'center'
     			}, 
     			{
     			text: '중량',
     			cls:'rfx-grid-header', 
     			dataIndex: 'mass',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center',     
     			align:'center'
     			},
     			{
     			text: '수량',
     			cls:'rfx-grid-header', 
     			dataIndex: 'quan',
     			resizable: true,
     			autoSizeColumn : true,
     			style: 'text-align:center',     
     			align:'center'
     			}
     			
     		];
    	}

       
			    	switch(vCompanyReserved4) {
					case "HAEW01KR":
					case "DAEH01KR":
					//case "HSGC01KR":
					//case "KYNL01KR":
						break;
					default:
   					for(var i=0 ; i<gUtil.mesTplProcessAll[big_pcs_code].length; i++) {
   					   	var o = gUtil.mesTplProcessAll[big_pcs_code][i];
   					   	
   					   	var dataIndex = (i+1) + '';
   					   	console_logs('====> dataIndex', dataIndex);
   					   	if(dataIndex.length==1) {
   					   		console_logs('in ====> dataIndex', dataIndex);
   					   		dataIndex = '0' + dataIndex;
   					   		console_logs('after ====> dataIndex', dataIndex);
   					   		
   					   	}
   					   	dataIndex = 'RATIO_' + dataIndex;
   					   	
   					   	console_logs('dataIndex', dataIndex);
   					   	console_logs('=== std process name o', o);
   					   	
   					   	this.columns.push({
   								text: o['name'],
   								cls:'rfx-grid-header', 
   								dataIndex: 'status_'+ (i+1),
   								resizable: true,
   								autoSizeColumn : true,
   								style: 'text-align:center',   
   								width : 120,
   								style: {background:'#F5AB35'},
   								align:'center'
   							});
   					   }
						break;
			    	}
       				
   					switch(vCompanyReserved4) {
   					case "HAEW01KR":
   					case "DAEH01KR":
   					//case "HSGC01KR":
					//case "KYNL01KR":
   						break;
   					default:
				   this.columns.push(
					    {
	            			text: '작업그룹',
	            			cls:'rfx-grid-header', 
	            			dataIndex: 'dept_name',
	            			resizable: true,
	            			autoSizeColumn : true,
	            			style: 'text-align:center',     
	            			align:'center'
	            		},
	            		{
	            			text: '납기일',
	            			cls:'rfx-grid-header', 
	            			dataIndex: 'reserved_timestamp1',
	            			resizable: true,
	            			autoSizeColumn : true,
	            			style: 'text-align:center',
	            			width: 120,
	            			align:'center'
	            		},
	            		{
	            			text: '작업지시일',
	            			cls:'rfx-grid-header', 
	            			dataIndex: 'aprv_date',
	            			resizable: true,
	            			autoSizeColumn : true,
	            			style: 'text-align:center',   
	            			width : 120,
	            			align:'center'
	            		},
	            		{
	            			text: '제작완료일',
	            			cls:'rfx-grid-header', 
	            			dataIndex: 'end_date',
	            			resizable: true,
	            			autoSizeColumn : true,
	            			style: 'text-align:center',   
	            			width : 120,
	            			align:'center'
	            		},
	            		{
	            			text: '최종출하일',
	            			cls:'rfx-grid-header', 
	            			dataIndex: 'shipment_day',
	            			resizable: true,
	            			autoSizeColumn : true,
	            			style: 'text-align:center',   
	            			width : 120,
	            			align:'center'
	            		}
					);
   					break;
      
                    console_logs('this.columns', this.columns + ' ' + big_pcs_code);
    }
    },

    initComponent: function() {

    	
    	//검색툴바 필드 초기화
    	//this.initSearchField();
    	
    	/*//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });
        
      //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);*/
    	
        console_logs('this', 'Rfx.view.ProduceStateHeavy');
        //this.dockedItems = [this.createToolbar()];

        this.SERIES_BUFFER_ORG_MAP = new Ext.util.HashMap();
        
        var produceModel = Ext.create('Rfx.model.TotalStateDoos', {});
        var produceDHModel = Ext.create('Rfx.model.TotalStateHeavy', {});
        var produceHWModel2 = Ext.create('Rfx.model.HEAVY4RecvPoSubViewModel_no', {});
        var produceDHModel2 = Ext.create('Rfx.model.HEAVY4RecvPoSubViewLot_no', {});
        
        console_logs('gUtil.mesTplProcessBig', gUtil.mesTplProcessBig );
        console_logs('Rfx.model.TotalStateDaeh', produceDHModel);
        
        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
        	processes = gUtil.mesTplProcessBig;
        } else {
        	processes = [{
        		code: 'PRD',
        		name: '생산현황'
        	}] ;
        }

        if(vCompanyReserved4 == 'HAEW01KR') {
        	processes.length = 1;
        }
        for(var i = 0; i < processes.length; i++) {
        	var o = processes[i];

        	var big_pcs_code = o['code'];
        	var title = '[' + o['code'] + ']' + o['name'];
        	console_logs('title', title);
        	console_logs('===o====//', o['pcsTemplate']);
        	
            this.defineColumns(big_pcs_code);
        	
            //produceStores
            switch(vCompanyReserved4){
            case 'HAEW01KR':
            	this.produceStores[i] = new Ext.data.Store({
                    pageSize: 100,
                    sorters: ['regist_date'],
                    model: produceHWModel2,
                    groupField: 'h_reserved8' 
                });
            	break;
            case 'DAEH01KR':
            	this.produceStores[i] = new Ext.data.Store({
                    pageSize: 100,
                    sorters: ['regist_date'],
                    model: produceDHModel2,
                    groupField: 'reserved2'
                });
            	break;
            default:
            this.produceStores[i] = new Ext.data.Store({
                pageSize: 50,
                sorters: ['regist_date'],
                model: produceModel,
                groupField: 'area_code'
            });
              break; 
            }
            console_logs('===dd===', this.produceStores[i]);
            var innerTable = '';
            
            for(var j = 0; j < gUtil.mesTplProcessAll[big_pcs_code].length; j++) {
            	innerTable += '<td style="width: 100px; height: 25px; background-color: #F5AB35; text-align:center; color: white; box-shadow: 0px 0px 5px #aaaaaa;">';
            	var o = gUtil.mesTplProcessAll[big_pcs_code][j];       	
            	innerTable += o['name'] + '</td>';
            	innerTable += '<td style="width: 110px; height: 25px; text-align:center; box-shadow: 0px 0px 5px #aaaaaa;">{[this.calPercentTest(values, ' + (j+1) + ')]}</td>';
            	innerTable += '<td style="width: 20px; height: 25px;"></td>';
            }
            
            this.groupingFeature[i] = Ext.create('Ext.grid.feature.Grouping', {
            	groupHeaderTpl: Ext.create('Ext.XTemplate', 
            		'<div><span style="color:red;"><b>{name}</b></span> (완료 {[this.calComplete(values)]} 종 / 전체 {rows.length} 종 ──────────── {[this.calPercent(values)]}% 진행율)</div>',
            		'<div>',
            			'<table style="border-collapse: collapse; margin-top: 10px">',
            				'<tr>',
            					innerTable,
    	    				'</tr>',
            			'</table>',
            		'</div>',
            		{
            			calPercentTest: function(val, proc_order) {
            				var count = 0;
            				for(var m = 0; m < val.rows.length; m++) {
            					switch(proc_order) {
            					case 1:
            						if(val.rows[m].data.status_1 != "대기" && val.rows[m].data.status_1 != "생산중") {
                						count++;
                					}
            						break;
            					case 2:
            						if(val.rows[m].data.status_2 != "대기" && val.rows[m].data.status_2 != "생산중") {
                						count++;
                					}
            						break;
            					case 3:
            						if(val.rows[m].data.status_3 != "대기" && val.rows[m].data.status_3 != "생산중") {
                						count++;
                					}
            						break;
            					case 4:
            						if(val.rows[m].data.status_4 != "대기" && val.rows[m].data.status_4 != "생산중") {
                						count++;
                					}
            						break;
            					case 5:
            						if(val.rows[m].data.status_5 != "대기" && val.rows[m].data.status_5 != "생산중") {
                						count++;
                					}
            						break;
            					}	
            				}
            				if(count == 0) {
            					return '0% (0 / ' + val.rows.length + '종)';
            				}
            				
            				return ((count / val.rows.length) * 100).toFixed(2) + '% (' + count + ' / ' + val.rows.length + '종)';
            			},
            			calPercent: function(val) {
            				var percent = 0;
            				var count = 0;
            				for(var m = 0; m < val.rows.length ; m++) {
            					if(val.rows[m].data.end_date != null && val.rows[m].data.end_date != undefined && 
            							val.rows[m].data.end_date != "") {
            						count++;
            					}
            				}
            				
            				if (count == 0) {
            					return 0;
            				}
            				percent = ((count / val.rows.length) * 100).toFixed(2);
            				
            				return percent;
            			},
            			calComplete: function(val) {
            				var count = 0;
            				for(var m = 0; m < val.rows.length ; m++) {
            					if(val.rows[m].data.end_date != null && val.rows[m].data.end_date != undefined && 
            							val.rows[m].data.end_date != "") {
            						count++;
            					}
            				}

            				return count;
            			}
            		}
            	),
            });
            console_logs('==this.produceStores[i]==',this.produceStores[i]);
            var text = null
            switch(vCompanyReserved4){
            case 'HAEW01KR':
            case 'DAEH01KR':
            	break;
            default:
            	text = this.groupingFeature[i];
            	break;
            }
            this.produceGrids[i] = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
                title: title,
                store: this.produceStores[i],
                scroll: true,
                frame: true,
                columnLines: true,
                columns : this.columns,
                bbar: getPageToolbar(this.produceStores[i], true, null, function() {
                        Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                    }),
                features: text
            });
            console_logs('==store==',this.produceStores[i]);
           // this.loadProduce(this.produceStores[i], big_pcs_code);

        }   
		
//		var exceed_msg = 
//        var exceed_day = new Array(20);

        switch(vCompanyReserved4){
        case "DAEH01KR":
        	var memberModel = Ext.create('Rfx.model.TotalStateDaeh', {});
            console_logs('==memberModel==',memberModel);
            this.memberStores = new Ext.data.Store({
            	pageSize: 30,
            	model: memberModel
            });

            console_logs('this.produceStores',this.produceStores);
            console_logs('this.memberStores',this.memberStores);
            
            this.produceGrids[2] = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
                title: '입력근태현황',
                store: this.memberStores,
                scroll: true,
                frame: true,
                columnLines: true,
                columns : this.columns2,
                bbar: getPageToolbar(this.memberStores, true, null, function() {
                        Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                    })
//                    features: this.groupingFeature[i]
            });
            	break;
        case "HAEW01KR":
        var memberModel = Ext.create('Rfx.model.TotalStateHaew', {});
        console_logs('==memberModel==',memberModel);
        this.memberStores = new Ext.data.Store({
        	pageSize: 30,
        	model: memberModel
        });

        console_logs('this.produceStores',this.produceStores);
        console_logs('this.memberStores',this.memberStores);
        
        this.produceGrids[2] = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
            title: '입력근태현황',
            store: this.memberStores,
            scroll: true,
            frame: true,
            columnLines: true,
            columns : this.columns2,
            bbar: getPageToolbar(this.memberStores, true, null, function() {
                    Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                })
//                features: this.groupingFeature[i]
        });
        	break;
        default :
        	break;
        }
        
        var tabItems = this.produceGrids;

        var list = gUtil.rack_list0;

        if (list != null) {

            var rackItems = [];

            for (var i = 0; i < list.length; i++) {
                var class_code = list[i]['class_code'];
                var class_name = list[i]['class_name'];
                var stockPanel = this.createStockPanel(class_code, class_name);
                rackItems.push(stockPanel);
            }

            var rackTab = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
                layout: 'border',
                title: 'Rack 재고현황',
                border: true,
                minWidth: 200,
                height: "100%",
                region: 'south',
                border: true,
                resizable: true,
                scroll: true,

                collapsible: false,
                items: rackItems
            });
            
            if(vCompanyReserved4 != 'HSGC01KR') {
                tabItems.push(rackTab);
            }

        }



        var south = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            minWidth: 200,
            height: "100%",
            region: 'south',
            border: true,
            resizable: true,
            scroll: true,

            collapsible: false,
            items: tabItems
        });

        Ext.apply(this, {
            layout: 'border',
            items: [south]
        });

        //this.relayEvents(this.produceGrid, ['rowdblclick']);
        this.callParent(arguments);
        this.redrawProduceAll();

    },

    redrawProduceAll: function() {
    	
        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
        	processes = gUtil.mesTplProcessBig;
        } else {
        	processes = [{
        		code: 'PRD',
        		name: '생산현황'
        	}] ;
        }
        
    	exceed_msg.this_msg = '납기일이 초과된 자재가 있습니다.<br>';     
    	exceed_msg.count = 0;
    	
        for(var i = 0; i < processes.length; i++) {
        	var o = processes[i];
        	var big_pcs_code = o['code'];
        	var big_pcs_name = o['name'];
        	console_logs('===processes222===', o);
            this.loadProduce(this.produceStores[i], big_pcs_code, big_pcs_name, o);
        }
        
        switch(vCompanyReserved4) {
        case 'DAEH01KR':
        case 'HAEW01KR':
        this.loadMember(this.memberStores);
        	break;
        default:
        	break;
        }
        
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
    loadFeed: function(url) {
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
    onOpenAllClick: function() {
        // this.fireEvent('openall', this);
    },

    loadProduce: function(store, big_pcs_code, big_pcs_name, o) {
    	
    	var area_codeDoos = Ext.getCmp('area_codeDoos');
    	var pj_nameDoos = Ext.getCmp('pj_nameDoos');
    	var s_dateDoos = Ext.getCmp('s_dateDoos');
    	var e_dateDoos = Ext.getCmp('e_dateDoos');
    	
    	if(area_codeDoos != undefined && area_codeDoos != "" && area_codeDoos != null) {
	    	area_codeDoos = area_codeDoos.getValue();  	
    	}
    	if(pj_nameDoos != undefined && pj_nameDoos != "" && pj_nameDoos != null) {
    		pj_nameDoos = pj_nameDoos.getValue();
    	}
    	s_dateDoos = s_dateDoos.getValue();
    	e_dateDoos = e_dateDoos.getValue();
    
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
    	store.getProxy().setExtraParam('comast_uid', vCOMAST_UID);
    	store.getProxy().setExtraParam('big_pcs_code', big_pcs_code);
    	store.getProxy().setExtraParam('area_code', area_codeDoos);
    	store.getProxy().setExtraParam('pj_name', pj_nameDoos);
    	store.getProxy().setExtraParam('s_date', s_dateDoos);
    	store.getProxy().setExtraParam('e_date', e_dateDoos);
    	
    	switch(vCompanyReserved4) {
    	case 'HAEW01KR':
    		store.getProxy().setExtraParam('pj_type', o['pcsTemplate']);
    		break;
    	default:
    		break;
    	}
    	
        store.load( {	
        	callback: function(records, options, success) {
        		switch(vCompanyReserved4) {
            	case 'DOOS01KR':
            		var exceed_day = 0;
                	
                	for(var k = 0; k < store.getTotalCount(); k++) {
                    	if(records[k].data.is_exceed_date == true) exceed_day++;
                    }   		
            		if(exceed_day > 0) {
            			exceed_msg.this_msg += '<br>' + big_pcs_name + ' : ' + exceed_day + '건';
            		}	
                    
            		if(exceed_msg.count == 4 && exceed_msg.this_msg != '납기일이 초과된 자재가 있습니다.<br>') {
            			Ext.toast({
        					html: exceed_msg.this_msg,
        					title: '경고',
        					align : 't'
            			});
            		}
            		
            		exceed_msg.count += 1;
            		
            		break;
            	default:
            		break;
            	
            	}
        	}
        	

    		//console_logs('TESTTEST', exceed_msg.this_msg);
        	
            /*for (var i = 0; i < 5;) {
                exceed_day[i] = 0;
            	this.produceStores[i].on('load', function(store, records, successful, eOpts){ 
            		for(var k = 0; k < store.getTotalCount(); k++) {
                    	if(records[k].data.is_exceed_date == true) exceed_day[i]++;
                    }   		
            		if(exceed_day[i] > 0) {
            			exceed_msg += '<br>' + title + ' : ' + exceed_day[i] + '건';
            		}
            		if(i == 4 && exceed_msg != '납기일이 초과된 자재가 있습니다.<br>') {
            	    	Ext.Msg.alert('경고', exceed_msg);
            		}
            		i++;
            	});
            }*/
        	
            //console_logs('==== storeLoadCallback records', records);

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
    
    loadMember: function(store) {
    	
    	switch(vCompanyReserved4) {
    	case 'DAEH01KR':
	    	store.getProxy().setExtraParam('comast_uid', vCOMAST_UID);
	    	store.getProxy().setExtraParam('wa_code', 'DAEH01KR');
	    	store.getProxy().setExtraParam('user_type', 'SPL');
	    	break;
    	case 'HAEW01KR':
    		store.getProxy().setExtraParam('comast_uid', vCOMAST_UID);
    		store.getProxy().setExtraParam('wa_code', 'HAEW01KR');
    		store.getProxy().setExtraParam('user_type', 'SPL');
    		break;
    	default:
    		break;
    	}
    	
    	 store.load(function(records) {
             console_logs('==== storeLoadCallback records', records);
         });
    },
    
    makeRackObject: function(items) {
    	var o = {
                xtype: 'panel',
                cls: 'split',
                flex: 2,
                margin: '0 2 0 2',
                padding: 0,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    xtype: 'taskcolumn',
                    flex: 1,
                    iconCls: '',
                    header: {
                        height: 18,
                        padding:  '0 0 0 0'
                    }
                },
                items: items
            };
    		
    	return o;
    	 
    },

    makeRackList : function(segmentCode) {

        var myRackList2 = gUtil.getMyList2(segmentCode);
        console_logs('myRackList2', myRackList2);
        
        var segmentItems = [];
        

        for(var j=0; j<myRackList2.length; j++) {
        	
        	var items = [];
        	
        	var o1 = myRackList2[j];
        	var state = ((j+1)<10) ? '0'+(j+1) : ''+(j+1);
        	var target = {
    	            state: state,
    	            title: o1['class_code'],
    	            cls: 'stock-rack-panel',
    	            border: false,
    	            bodyStyle: 'border-right:1px dashed #aaa !important'
    	        };
        	items.push(target); j++;
        	
        	if(j<myRackList2.length) {
            	o1 = myRackList2[j];
            	 state = ((j+1)<10) ? '0'+(j+1) : ''+(j+1);
            	target = {
        	            state: state,
        				title: o1['class_code'],
        	            cls: 'stock-rack-panel',
        	            border: false
        	        };
        		items.push(target);
        	}
        	
        	var o = this.makeRackObject(items);

        	segmentItems.push(o);
        }
        
        console_logs('------------------- segmentItems', segmentItems);
        
        return segmentItems;
    },
    createStockPanel: function(class_code, class_name) {


        var resourceStore = new Kanban.data.ResourceStore({
            //sorters: 'floor',
            autoLoad: true,
            proxy: {
                type: 'ajax',

                api: {
                    read: 'http://hosu.io/web_content75' + '/taskboard-2.0.9/taskboard/examples/configurations/users.js',
                    update: undefined,
                    destroy: undefined,
                    create: undefined
                }
            }
        });


        var model = Ext.create('Rfx.model.StockRackTask', {});


        var stockItems = [];
        
//        var pendingStore = new Kanban.data.TaskStore({
//            model: model
//        });
//        
//        var rackUnitList = gUtil.getRackunitList3(segmentCode);
//        pendingStore.add(rackUnitList);
//        
//        stockItems.push({
//            xtype: 'component',
//            html: '<div style="padding-left:3px;margin:5px;font-weight:bold;width:500px;text-align:left;">' + '미 적치 파레트' +  '</div>'
//        },{
//        	xtype: 'taskcolumn',
//            flex      : null,
//            height: 100,
//            zoomLevel : 'small',
//            state     : 'pending',
//            taskStore: pendingStore
//        });

        var myRackList1 = gUtil.getMyList1(class_code);

        for (var i = 0; i < myRackList1.length; i++) {
            var o = myRackList1[i]

            var segmentCode = o['class_code'];
            
            var taskStore = new Kanban.data.TaskStore({
                model: model
            });
            
            console_logs('segmentCode', segmentCode);
            var rackUnitList = gUtil.getRackunitList3(segmentCode);
            taskStore.add(rackUnitList);

            console_logs('rackUnitList', rackUnitList);

            var segmentItems = this.makeRackList(segmentCode);
            var segentColumn =  [{
                region: 'center',
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: 5,
                    flex: 1,
                    xtype: 'taskcolumn'
                },
                items: segmentItems
                
            }


        ];

            stockItems.push({
                    xtype: 'component',
                    html: '<div style="padding-left:3px;margin:5px;font-weight:bold;width:500px;text-align:left;">' + segmentCode + ' : ' + o['class_name'] 
							+'  '+'<span style="background:blue;color:#fff;">적치</span>'+ 
							'<span style="background: yellow">불출3일내</span>'+ 
							'<span style="background: red;color:#fff;">불출요청일</span>'+ 
							'<span style="background: orange;color:#fff;">불출일초과</span>'+ 
							'<span style="background: green;color:#fff;">적치60일초과</span>'+ 
							'</div>'
            }, {
                    height: 210,
                    margin: '0 0 2 0',
                    resourceStore: resourceStore,
                    userMenu: null/* {
                        xtype: 'kanban_usermenu',
                        resourceStore: resourceStore
                    }*/,
                    taskMenu: null,
                    xtype: 'taskboard',
                    layout: 'border',
                    cls: 'panel-3',
                    readOnly : true,
                    taskStore: taskStore,
//                    editor : {
//                    	store: taskStore,
//                        xtype : 'taskeditor'
//                    },
//                    editor : {
//                        xtype: 'kanban_simpleeditor',
//                        dataIndex: 'Name'
//                    },
                    columnConfigs : {
                        all : {
                            iconCls : 'sch-header-icon'
                        }
                    },
                    viewConfig: {

                        taskToolTpl: '<div class="sch-tool-ct">' +
                            '<div class="sch-tool sch-tool-edit"></div>' +
                            '<tpl if="NbrComments"><div class="sch-tool sch-tool-comment">&nbsp;</div><span class="sch-tool-text">{NbrComments}</span></tpl>' +
                            '<tpl if="Attachments"><div class="sch-tool sch-tool-attachment">&nbsp;</div><span class="sch-tool-text">{Attachments}</span></tpl>' +
                            '</div>',

                        taskRenderer: function(task, renderData) {
                            if (task.getName() === 'Uninstall IE5') {
                                renderData.style = 'background:red;color:#fff';
                            }
                        },
                        taskBodyTpl: '{N} {Name}',
                        onUpdate: function(store, record, operation, modifiedFieldNames) {
                        	console_logs('onUpdate record', record);
                        	console_logs('onUpdate modifiedFieldNames', modifiedFieldNames);
                        	
                        	//record.data.N = gUtil.floorDisp(record.data.Floor);
                            var fragment = document.createElement('div');
                            var currentNode = this.getNode(record);
                            var selModel = this.getSelectionModel();

                            this.tpl.overwrite(fragment, this.collectData([record]));
                            Ext.fly(currentNode).syncContent(fragment.firstChild);

                            selModel.onUpdate(record);
                            if (selModel.isSelected(record)) {
                                this.onItemSelect(record);
                            }
                            
                        	var name = record.getName();
                        	var id = record.getId();    	
                        	var rtgast_uid = record.data.rtgast_uid;
                        	
                        	
                    		Ext.Ajax.request({
                    			url: CONTEXT_PATH + '/admin/stdClass.do?method=updateEgcicode',
                    			params:{
                    				unique_id: id,
                    				egci_code: name,
                    				exUidRtgAst: rtgast_uid
                    			},
                    			success : function(result, request) {
                        	        var jsonData = Ext.JSON.decode(result.responseText);
                        	        console_logs('jsonData.result', jsonData.result);
                        	        record.data.rtgast_uid = jsonData.result;
                    			}
                    		});
                    		
                        }
                    },
                    columns: segentColumn,
                    listeners : {
                        select: function ( o , record, eOpts ) {
                        	console_logs('select record', record);
                        },
                        taskdblclick: function ( view, task, taskNode, event, eOpts ) {
                        	gUtil.editRackRecord(task);
                        },
                        
                        taskdrop: function( drop, tasks, eOpts ) {
                        	console_logs('aftertaskdrop tasks', tasks);
                        	
                        	for(var i=0; i < tasks.length; i++) {
                        		console_logs('tasks[' + i + '] = ', tasks[i]);
                        		//gUtil.editRackRecord(tasks[i]);
                        	}
	                    	
	                    }
                    }
                    
                }

            );
        }

        return Ext.create('Ext.panel.Panel', {
            title: class_name,
            border: true,
            resizable: true,
            autoScroll: true,
            collapsible: false,
            items: stockItems
        });



    },
    createSouth: function() {

        //        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
        //            groupHeaderTpl: '<b><font color=#003471>{name}</b></font> ({rows.length} 종)'
        //        });
        //
        //        var produceModel = Ext.create('Rfx.model.TotalStateHeavy', {});
        //        this.produceStore = new Ext.data.Store({
        //            pageSize: 50,
        //            //groupField: 'class_name',
        //            sorters: ['regist_date'],
        //            model: produceModel
        //        });
        //
        //        this.produceGrid = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
        //            title: 'LOT 별 생산현황',
        //            layout: 'fit',
        //            forceFit: true,
        //            store: this.produceStore,
        //            bbar: getPageToolbar(this.produceStore, true, null, function() {
        //                    Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
        //                })
        //                //features: [groupingFeature]
        //        });
        //
        //        this.loadProduce();
        //
        //        var tabItems = [this.produceGrid];
        //        
        //        var stockPanel = this.createStockPanel('제품 Rack');
        //        
        //        tabItems.push(stockPanel);
        // 
        //        this.south = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
        //            layout: 'border',
        //            border: true,
        //            minWidth: 200,
        //            height: "100%",
        //            region: 'south',
        //            border: true,
        //            resizable: true,
        //            scroll: true,
        //
        //            collapsible: false,
        //            items:  tabItems
        //        });
        //
        //        return this.south;

    }
});