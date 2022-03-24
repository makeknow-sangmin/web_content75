Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);


Ext.define('Rfx.view.designPlan.DesignBomView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'design-bom-view',
    initComponent: function(){
    	
    	this.commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
    	this.commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
    	this.commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: false} );
    	this.commonDescriptionStore = Ext.create('Mplm.store.CommonDescriptionStore', {hasNull: false} );
    	this.commonStandardStore2  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false} );
    	this.GubunStore  = Ext.create('Mplm.store.GubunStore', {hasNull: false} );
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField('pj_name');
		

		//검색툴바 생성
		//var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        //var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.PartLine', [{
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
//        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
//        	, ['assymap']
	        );
        
        
        //그리드 생성
        //var arr=[];
        //arr.push(buttonToolbar);
        //arr.push(dateToolbar);
        //arr.push(searchToolbar);
        //grid 생성.
      // this.createGrid(searchToolbar, dateToolbar,buttonToolbar);
      
        //작업지시 Action 생성
        this.addMyCartAction = Ext.create('Ext.Action', {
        	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '카트 담기',
			 tooltip: '',
			 disabled: true,
			 
			 handler: function() {
				 
				 	var my_child = new Array();
			    	var my_assymap_uid = new Array();
			    	var my_pl_no = new Array();
			    	var my_pr_quan = new Array();
			    	var my_item_code = new Array();
			    	var my_sales_price = new Array();
			    	
			    	var arrExist = [];
			    	
			    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
			    	for(var i=0; i< selections.length; i++) {
			    		var rec = selections[i];
			    		var unique_uid = rec.get('unique_uid');
			    		var item_code = rec.get('item_code');
			    		var item_name = rec.get('item_name');
			    		var pl_no = rec.get('pl_no');
			    		var sales_price = rec.get('sales_price');
			    		
			    		var bEx = gMain.selPanel.isExistMyCart(unique_uid) ;
			    		console_logs('bEx', bEx)
			    		if(bEx == false ) {
			        		my_child.push( rec.get('unique_id'));
			        		my_assymap_uid.push( unique_uid );
			        		my_pl_no.push( pl_no );
			        		my_pr_quan.push( rec.get('new_pr_quan'));
			        		my_item_code.push( item_code);
			        		my_sales_price.push(sales_price);
			    		} else {
			    			arrExist.push('[' +pl_no + '] \''+ item_name + '\'');
			    		}
			    		
			    	}
			    	
			    	if(arrExist.length>0) {
			        	Ext.MessageBox.alert('경고', arrExist[0] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');    		
			    	}

			    	
			    	if(my_assymap_uid.length>0) {
			        	var tab = this.center;
			        	tab.setLoading(true);
			        	Ext.Ajax.request({
			     			url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
			     			params:{
			     				childs : my_child,
			     				assymap_uids : my_assymap_uid,
			     				pl_nos : my_pl_no,
			     				pr_quans : my_pr_quan,
			     				item_codes: my_item_code,
		            			sales_prices: my_sales_price
			     			},
			     			success : function(result, request) {   
			     				gMain.selPanel.myCartStore.load(function() {
			     					var tab = Ext.getCmp("main2");
			     					tab.setActiveTab(Ext.getCmp("gridMycart"));
			     					tab.setLoading(false);
			     				});
			     			}
			       	    });    		
			    	}
			 }
		});
        
		this.removeAction = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: '삭제하기',
			 tooltip: '삭제하기',
			 disabled: true,
			 handler: function(widget, event) {
			    	Ext.MessageBox.show({
			            title: '삭제하기',
			            msg: '선택한 항목을 삭제하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn: gMain.selPanel.deleteConfirm,
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});
		
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            
            tooltip:'PartList 출력',
            disabled: false,
            
            handler: function(widget, event) {
            	var ac_uid = gMain.selPanel.vSELECTED_PROJECT_UID;
            	var item_code = gMain.selPanel.vSELECTED_PRODUCT_CODE;
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printPl',
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
		
        var buttonToolbar = Ext.create('widget.toolbar', {
    		cls: 'my-x-toolbar-default2',
    		items: [
					{
						id: 'target-routeTitlename-DBM7',
					    xtype:'component',
					    html: "Assembly를 선택하세요.",
					    width: 400,
					    style: ''
					    
					 },
					 
			          '->',
			          
			         this.addMyCartAction,'-',
					 this.removeAction,'-',
    		         this.printPDFAction, '-',
					 {
			        	   xtype: 'component',
				          // style: 'margin:5px;',
					 	   html: 'BOM 수량:'
			          },
			          {
			        	   xtype: 'component',
				           style: 'margin:5px;width:18px;text-align:right',
				           id: 'childCount-DBM7',
					 	   html: ''
			          }
    		        ]
    	});
        
        this.createGrid([ buttonToolbar ], {width: '70%'});
        
        
        this.setGridOnCallback(function(selections) {
        	if (selections.length) {
        		gUtil.enable(gMain.selPanel.addMyCartAction);
        	} else {
        		gUtil.disable(gMain.selPanel.addMyCartAction);
        	}
        });
        
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });
    	
        
	    this.commonStandardStore.load(function(records) {
    		for (var i=0; i<records.length; i++){ 
    	       	var obj = records[i];
    	       	//console_logs('commonStandardStore2['+i+']=', obj);
    	       	gMain.selPanel.standard_flag_datas.push(obj);
    		}
    	});
    	
    	this.callParent(arguments);

    },
    setRelationship: function (relationship) {},
    
    createCenter: function() {
	    this.inpuArea = Ext.widget({
	 	      title: 'Excel Form',
	 	      xtype: 'form',
	 	      disabled: true,
	 	      collapsible: false,
	 	      border: false,
	 	      layout: 'fit',
	 	      //fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
	 	      dockedItems: [{
	            dock: 'top',
	            xtype: 'toolbar',
	            items: [
	 	         {
		 	       	 iconCls: 'search',
			 	   	 text: CMD_INIT,
			 	   	 handler: function() {
				 	   	 Ext.MessageBox.show({
		                     title:'초기화 확인',
		                     msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
		                     buttons: Ext.MessageBox.YESNO,
		                     icon: Ext.MessageBox.QUESTION,
		                     fn: function(btn) {
		                         var result = MessageBox.msg('{0}', btn);
		                         if(result=='yes') {
		                        	 var o = Ext.getCmp('bom_content-DBM7');
		                        	 o.setValue(bomTableInfo);
		                         }
		                     }
		                 });
	            	 
		             }
	 	         },'-',
	 	        {
		 	       	 iconCls: 'textfield',
			 	   	 text: '모두 지우기',
			 	   	 handler: function() {
				 	   	 Ext.MessageBox.show({
		                     title:'모두 지우기',
		                     msg: '모두 지우시겠습니까?',
		                     buttons: Ext.MessageBox.YESNO,
		                     icon: Ext.MessageBox.QUESTION,
		                     fn: function(btn) {
		                         var result = MessageBox.msg('{0}', btn);
		                         if(result=='yes') {
		                        	 var o = Ext.getCmp('bom_content-DBM7');
		                        	 o.setValue('');
		                         }
		                     }
		                 });
	            	 
		             }
	 	         },'-', {
		 	       	 iconCls: 'application_view_tile',
			 	   	 text: '사전검증',
			 	   	 handler: function() {
			 	   		 var bom_content = Ext.getCmp('bom_content-DBM7');
			 	   		 
			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
					  	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
							params:{
								pj_code: gMain.selPanel.selectedPjCode,
								assy_code: gMain.selPanel.selectedAssyCode,
								pj_uid: gMain.selPanel.selectedPjUid,
								parent: gm.me().selectedparent,
								parent_uid: gm.me().selectedAssyUid,
								pj_name: Ext.JSON.encode(gMain.selPanel.selectedPjName),
								assy_name: Ext.JSON.encode(gMain.selPanel.selectedAssyName),
								htmlContent: htmlContent
							},
							success : function(result, request) {   
								var val = result.responseText;
								//console_logs("val", val);
								//var htmlData = Ext.decode(val);
								//console_logs("htmlData", val);
								
					 	   		//htmlContent=func_replaceall(htmlContent,'<table border="0"','<table border="1"');
					 	   		
					 	   		bom_content.setValue(val);
					
							},
							failure: extjsUtil.failureMessage
						});
			 	   		 
	            	 
		             }
	 	         },'-', {
		             text: '디플로이',
		             iconCls: 'save',
		             handler: function() {
			 	   		 var bom_content = Ext.getCmp('bom_content-DBM7');
			 	   		 
			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
			 	   		Ext.getCmp('bom_content-DBM7').setLoading(true);
			 	   		 
					  	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
							params:{
								pj_code: gMain.selPanel.selectedPjCode,
								assy_code: gMain.selPanel.selectedAssyCode,
								pj_uid: gMain.selPanel.selectedPjUid,
                                parent: gm.me().selectedparent,
                                parent_uid: gm.me().selectedAssyUid,
								pj_name: Ext.JSON.encode(gMain.selPanel.selectedPjName),
								assy_name: Ext.JSON.encode(gMain.selPanel.selectedAssyName),
								htmlContent: htmlContent
							},
							success : function(result, request) { 
			     				
		        				var jsonData = Ext.decode(result.responseText);
		        				console_logs('jsonData', jsonData);
		        				
		        				var result = jsonData['result'];
		        				
		        				if(result == 'true' || result  == true) {//정상이면 Reload.
						    		if(gMain.selPanel.selectedAssyDepth==1) {
						    			gMain.selPanel.editAssyAction.disable();
						    			gMain.selPanel.removeAssyAction.disable();
						    		} else {
						    			gMain.selPanel.editAssyAction.enable();
						    			gMain.selPanel.removeAssyAction.enable();		
						    		}
						    		gMain.selPanel.store.getProxy().setExtraParam('parent', gMain.selPanel.selectedparent);
						    		gMain.selPanel.store.getProxy().setExtraParam('parent_uid', gMain.selPanel.selectedAssyUid);
						    		gMain.selPanel.store.getProxy().setExtraParam('ac_uid', gMain.selPanel.selectedPjUid);
						    		gMain.selPanel.store.load(function(records){
					            		//insertStockStoreRecord(records);
					            		gMain.selPanel.routeTitlename = '[' + gMain.selPanel.selectedAssyCode  + '] ' + gMain.selPanel.selectedAssyName;
					            		gMain.selPanel.selectAssy(gMain.selPanel.selectedFolderName, gMain.selPanel.selectedAssyDepth);
					            		gMain.selPanel.setChildQuan(records.length);

					            		
					            		gMain.selPanel.setMakeTable(records);
					            		
					            	});
					            	
		        				} else {
		        					Ext.MessageBox.alert('오류','입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
		        				}
		        				Ext.getCmp('bom_content-DBM7').setLoading(false);
							},
							failure: extjsUtil.failureMessage
						});

		             }
	 	         }, '-',
		         '->'/*, addExcelWithProject,
		           '-',excel_sample*/]
	 	      }],
	 	      items: [
	 	      {
		             //fieldLabel: 'board_content.',
		             //x: 5,
		             //y: 0 + 2*lineGap,
	 	    	     id: 'bom_content-DBM7',
		             name: 'bom_content',
		             xtype: 'htmleditor',
		             width: '100%',
		             height: '100%',
		             border: false,
		             enableColors: false,
		             enableAlignments: false,
		             anchor: '100%',
		             listeners: {
		                 initialize: function(editor) {
		                	 console_logs('editor', editor);
		                     var styles = {
//                               backgroundColor : '#193568'
                              //,border          : '1px dashed yellow'
//                              ,color           : '#fff'
//                              ,cursor          : 'default'
//                              ,font            : 'bold '+ 10 +'px Trebuchet MS'
//                              ,height          : '10px'
//                              ,left            : '10'
//                              ,overflow        : 'hidden'
//                              ,position        : 'absolute'
//                              ,textAlign       : 'center'
//                              ,top             : '10'
//                              ,verticalAlign   : 'middle'
//                              ,width           : '10'
//                              ,zIndex          : 60
                          };
	
		                     
		                     Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
		                 }/*,
		                 afterrender: function() {
		     				this.wrap.setStyle('border', '0');
		     			}*/
		             },
		             value: this.initTableInfo
		            	
		             
		    	 }]
	 		});
  		
	    	var myCartColumn = [];
	    	var myCartFields = [];
	    	
	    	for(var i=0; i<this.columns.length; i++) {
	    		
	    		switch(this.columns[i]['dataIndex']) {
	    			case 'req_info':
	    			case 'statusHangul':
	    			case 'sales_price':
	    			case 'goodsout_quan':
	    				break;
	    			default:
	    				myCartColumn.push(this.columns[i]);
	    				myCartColumn.push(this.columns[i]);
	    		}
	    	}

	    	
	    	var selModelMycart = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

	    	var myCartModel = Ext.create('Rfx.model.MyCartLine', {
	        	fields: this.fields
	        });
	        
	    	this.myCartStore= new Ext.data.Store({  
	    		pageSize: 100,
	    		model: 'Rfx.model.MyCartLine'});
	    	
	    	
	    	this.myCartStore = new Ext.data.Store({  
	    		pageSize: 100,
	    		model: myCartModel,
	    		sorters: [
	            {
	                property: 'create_date',
	                direction: 'desc'
	            }
	            
	            ]
	    	});
	    	
	    	
	    	
		    this.gridMycart = Ext.create('Ext.grid.Panel', {
	    		title: 'My Cart',
		        store: this.myCartStore,
		        // /COOKIE//stateful: true,
		        collapsible: true,
		        multiSelect: true,
		        selModel: selModelMycart,
		        stateId: 'gridMycart'+ /* (G) */vCUR_MENU_CODE,
		       // height: getCenterPanelHeight(),       
		        
		        dockedItems: [
	      				{
	      					dock: 'top',
	      				    xtype: 'toolbar',
	      				    items: [
	      				           this.searchAction, '-', this.removeCartAction, '-', this.pasteAction, '-', this.purchase_requestAction, 
	      				           '-',
	      				           //process_requestAction,'-', 
	      				         '->'
	      				         ]
	      				}
	              
	              ],
		        columns: /* (G) */myCartColumn
		        ,
		        plugins: [this.cellEditing1]
		        ,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            getRowClass: function(record) { 
				              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
		            } ,
		            listeners: {
		        		'afterrender' : function(gridMycart) {
							var elments = Ext.select(".x-column-header",true);
							elments.each(function(el) {
											
										}, this);
								
							}
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenuCart.showAt(e.getXY());
		                    return false;
		                }
		            }
		        }
		    });
			this.gridMycart.getSelectionModel().on({
			    selectionchange: function(sm, selections) {
			    	selectionLength = selections.length;
			        if (selections.length) {
			        	// this.gridMycart info 켜기
			        	displayProperty(selections[0]);
			        	if(fPERM_DISABLING()==true) {
			        		removeCartAction.disable();
			        		pasteAction.disable();
			            	process_requestAction.disable();
			            	purchase_requestAction.disable();
			        	}else{
			        		removeCartAction.enable();
			        		pasteAction.enable();
			            	process_requestAction.enable();
			            	purchase_requestAction.enable();

			        	}
			        } else {
		            	if(gGridMycartSelects.length>1) {
		            		this.gridMycart.getView().select(gGridMycartSelects);
		            	}
		            	
			        	collapseProperty();
			        	removeCartAction.disable();
			        	pasteAction.disable();
			        	process_requestAction.disable();
			        	purchase_requestAction.disable();
			
			        }
			     
			        copyArrayMycartGrid(selections);	
			    }
			});
			
			
			this.gridMycart.on('edit', function(editor, e) {     
			  // commit the changes right after editing finished
				
			  var rec = e.record;
			  //console_logs('rec', rec);
			  var unique_uid = rec.get('unique_uid');
			  var reserved_double1 = rec.get('reserved_double1');
			  
			  	Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
					params:{
						assymap_uid: unique_uid,
						pr_qty: reserved_double1
					},
					success : function(result, request) {   
			
						var result = result.responseText;
						//console_logs("", result);
			
					},
					failure: extjsUtil.failureMessage
				});
			  	
			  rec.commit();
			});
	    		
	    	this.myCartStore.load(function() { });
/*****************************************************************************
* Mycart Grid End
*/
	    	this.grid.setTitle('List');
			this.bomTab =  Ext.widget('tabpanel', {
			    layout:'border',
			    title: 'BOM',
			    border: false,
			    tabPosition: 'bottom',
			    layoutConfig: {columns: 2, rows:1},
			    items: [this.grid, this.inpuArea]
			});
			this.center =  Ext.widget('tabpanel', {
			    layout:'border',
			    border: true,
			    region: 'center',
	            width: '70%',
			    items: [this.bomTab, this.gridMycart]
			});
			
			return this.center;

    },
    
    //----------------------- END OF CENTER --------------------
    
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
    	            fn: gMain.selPanel.deleteAssyConfirm,
    	            // animateTarget: 'mb4',
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
    	
    	this.expandAllTreeAction = Ext.create('Ext.Action', {
    		itemId: 'expandAllTreeAction',
    	    //iconCls: 'remove',
    	    text: '열기',
    	    disabled: false,
    	    handler: function(widget, event) {
    	    	gMain.selPanel.expandAllTree();
    	    }
    	});
    	
    	this.editAssyAction = Ext.create('Ext.Action', {
    		itemId:'editAssyAction',
    		iconCls: 'af-edit',
    		disabled: true,
    	    text: 'Assy수정',
    	    handler: function(widget, event) {
    	    	
    	    	var assyCode = 	gMain.selPanel.selectedAssyCode;
    	    	var record = 	gMain.selPanel.selectedAssyRecord;
    	    	var parent = 	gMain.selPanel.selectedparent;
    	    	var assyName = 	gMain.selPanel.selectedAssyName;
    	    	var quan = 		gMain.selPanel.selectedAssyQuan;
    	    	
    	    	if(assyCode==null || assyCode=='') {
    	    		Ext.MessageBox.alert('Error','수정할 Assembly를 선택하세요.', callBack);  
    	            function callBack(id){  
    	                return
    	            } 
    	            return;
    	    	}

    	    	
    	    	
    					var lineGap = 30;
    					var bHeight = 250;
    					
    			    	var inputItem= [];
    			    	inputItem.push(
    			    	{
    						xtype: 'textfield',
    						name: 'unique_uid',
    						fieldLabel: 'AssyUiD',
    						allowBlank:false,
    						value: record.data.unique_uid,
    						anchor: '-5',
    						//readOnly : true,
    						fieldStyle : 'background-color: #ddd; background-image: none;'
    					});
    			    	inputItem.push(
    					    	{
    								xtype: 'textfield',
    								name: 'unique_id',
    								fieldLabel: 'Child Uid',
    								allowBlank:false,
    								value: parent,
    								anchor: '-5',
    								readOnly : true,
    								fieldStyle : 'background-color: #ddd; background-image: none;'
    							});
    			    	inputItem.push(
    			    	{
    						xtype: 'textfield',
    						fieldLabel: 'Assembly 코드',
    						allowBlank:false,
    						value: assyCode,
    						anchor: '-5',
    						readOnly : true,
    						fieldStyle : 'background-color: #ddd; background-image: none;'
    					});
    			    	
    			    	inputItem.push(
    			    			{
    			                    fieldLabel: 'Assembly 명',
    			                    x: 5,
    			                    y: 0 + 3*lineGap,
    			                    name: 'item_name',
    			                    value: assyName,
    			                    readOnly : false,
    			                    allowBlank:false,
    			                    anchor: '-5'  // anchor width by percentage
    			                },{
    	                            xtype: 'numberfield',
    	                            minValue: 0,
    	                            width : 365,
    	                            name : 'bm_quan',
    	                            editable:true,
    	                            fieldLabel: '제작 대수',
    	                            allowBlank: true,
    	                            value: quan,
    	                            margins: '0'
    	                        });
    			
    			    	
    			    	var form = Ext.create('Ext.form.Panel', {
    			    		id: 'modformPanel-DBM7',
    			            defaultType: 'textfield',
    			            border: false,
    			            bodyPadding: 15,
    			            width: 400,
    			            height: bHeight,
    			            defaults: {
    			                // anchor: '100%',
    			                editable:false,
    			                allowBlank: false,
    			                msgTarget: 'side',
    			                labelWidth: 100
    			            },
    			             items: inputItem
    			        });
    			
    			        var win = Ext.create('ModalWindow', {
    			            title: 'Assy 수정',
    			            width: 400,
    			            height: bHeight,
    			            minWidth: 250,
    			            minHeight: 180,
    			            items: form,
    			            buttons: [{
    			                text: CMD_OK,
    			            	handler: function(){
    			                    var form = Ext.getCmp('modformPanel-DBM7').getForm();
    			                    if(form.isValid())
    			                    {
    			                	var val = form.getValues(false);

    			                	Ext.Ajax.request({
    			            			url: CONTEXT_PATH + '/design/bom.do?method=updateAssyName',
    			            			params:{
    			            				unique_id : val['unique_id'],
    			            				item_name : val['item_name'],
    			            				bm_quan : val['bm_quan'],
    			            				unique_uid : val['unique_uid']
    			            			},
    			            			success : function(result, request) {   
//    			            				mesProjectTreeStore.load({
//    		                           		    callback: function(records, operation, success) {
//    		                           		    	console_log('load tree store');
//    		                           		    	console_log('ok');
//    		                           		    	pjTreeGrid.setLoading(false);
//    		                           		        // treepanel.expandAll();
//    		                           		    }                               
//    		                           		});
    			            			},
    			            			failure: extjsUtil.failureMessage
    			            		});
    			                	 
    		                       	if(win) 
    		                       	{
    		                       		win.close();
    		                       	} 
    			                    } else {
    			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
    			                    }

    			                  }
    			            },{
    			                text: CMD_CANCEL,
    			            	handler: function(){
    			            		if(win) {
    			            			win.close();
    			            		}
    			            	}
    			            }]
    			        });
    			        win.show(/* this, function(){} */);
    	    } //endofhandler
    	});

    	this.addAssyAction = Ext.create('Ext.Action', {
    		itemId:'addAssyAction',
    		iconCls:'af-plus-circle',
    		disabled: true,
    	    text: 'Assy등록',
    	    handler: function(widget, event) {
    	    	
    	    	console_log('assy_pj_code Value : '+ gMain.selPanel.assy_pj_code);
    	    	
    	    	if(gMain.selPanel.assy_pj_code==null || gMain.selPanel.assy_pj_code=='') {
    	    		Ext.MessageBox.alert('Error','추가할 모 Assembly를 선택하세요.', callBack);  
    	            function callBack(id){  
    	                return
    	            } 
    	            return;
    	    	}

    	    	Ext.Ajax.request({
    				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
    				params:{
    					pj_code:gMain.selPanel.assy_pj_code
    				},
    				success : function(result, request) {   
    					var result = result.responseText;
    					var str = result;	// var str = '293';
    					var num = Number(str); 	

    					if(str.length==3){
    						num = num; 
    					}else if(str.length==2){
    						num = '0' + num;
    					}else if(str.length==1){
    						num = '00' + num;
    					}else{
    						num = num%1000;
    					}
    						Ext.getCmp('assy_pl_no-DBM7').setValue("A"+num);
    				},
    				failure: extjsUtil.failureMessage
    			});
    	    	
    	    	
    	    	
    					var lineGap = 30;
    					var bHeight = 300;
    			    	var form = Ext.create('Ext.form.Panel', {
    			    		id: 'addAssy-formPanel-DBM7',
    			            defaultType: 'textfield',
    			            border: false,
    			            bodyPadding: 15,
    			            bodyStyle : Ext.isIE
    	                    ? 'padding:5px 5px 5px 5px;'
    	                    : 'padding:5px 5px;',
    			            width: 400,
    			            height: bHeight,
    			            defaults: {
    			                // anchor: '100%',
//    			                editable:false,
//    			                allowBlank: false,
    			                msgTarget: 'side',
    			                labelWidth: 100,
    			                defaultMargins: {top: 0, right: 5, bottom: 5, left: 0},
    			                margin: '0 0 5 0',
    			            },
    			             items: [ // inputItem
    			                      new Ext.form.Hidden({
    			    	      		       name: 'parent',
    			    	      		       value: gMain.selPanel.selectedparent
    			    	      		    }),
    			    	      		  new Ext.form.Hidden({
    			    	      		       name: 'ac_uid',
    			    	      		       value: gMain.selPanel.selectedPjUid
    			    	      		    }),
    			    	      		  {
    			    					    xtype : 'container',
    			    					    combineErrors: true,
    			    					    layout:{
    			    					    	type:'hbox',
    			    					    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0},
		    			    					},
    			    					    msgTarget: 'side',
    			    					    fieldLabel: panelSRO1144,
    			    					    defaults: {
    			    					    	// anchor:'100%'
    			    					        // hideLabel: true
    			    					    },
    			    					    items : [
		    			    					{
		    			    						xtype: 'textfield',
		    			    						fieldLabel: '프로젝트',
		    			    						allowBlank:false,
		    			    						value:gMain.selPanel.assy_pj_code,
		    			    						width : 210,
		    			    						readOnly : true,
		    			    						fieldStyle : 'background-color: #ddd; background-image: none;',
		    			    						name:'pj_code'
		    			    						},
		    			    						{
		    			    							xtype: 'textfield',
		    			    							allowBlank:false,
		    			    							value: gMain.selPanel.selectedPjName,
		    			    							readOnly : true,
		    			    							fieldStyle : 'background-color: #ddd; background-image: none;',
		    			    							flex : 1,
		    			    							name: 'pj_name'
		    			    						}
    			    						]
    			    					},
    			    					{
    			    					    xtype : 'container',
    			    					    combineErrors: true,
    			    					    layout:{
    			    					    	type:'hbox',
    			    					    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0}
    			    					    },
    			    					    msgTarget: 'side',
    			    					    defaults: {
    			    					    	// anchor:'100%'
    			    					        // hideLabel: true
    			    					    },
    			    					    items : [
    			    							{
    			    								xtype: 'textfield',
    			    								fieldLabel: 'Assembly 코드',
    			    								allowBlank:false,
    			    								value:gMain.selPanel.assy_pj_code+ '-',
    			    								width : 210,
    			    								readOnly : true,
    			    								fieldStyle : 'background-color: #ddd; background-image: none;'
    			    							},
    			    							{
    			    								xtype: 'textfield',
    			    								allowBlank:false,
    			    								flex : 1,
    			    								name: 'pl_no',
    			    								id:'assy_pl_no-DBM7'
    			    							}
    			    						]
    			    					},
    			    					
    			    					{
    	    			                    fieldLabel: 'Assembly 명',
    	    			                    xtype: 'textfield',
    	    			                    allowBlank:false,
    	    			                    width: '100%',
    	    			                    name: 'item_name'//,
    	    			                    //anchor: '-5'  // anchor width by percentage
    	    			                },{
    	    	                            xtype: 'numberfield',
    	    	                            name : 'bm_quan',
    	    	                            width: '100%',
    	    	                            fieldLabel: '제작 대수',
    	    	                            value: '1',
    	    	                            margins: '0'
    	    	                        }
    
    			              ]
    			        });
    			
    			        var win = Ext.create('ModalWindow', {
    			            title: 'Assembly 추가',
    			            width: 400,
    			            height: bHeight,
    			            minWidth: 250,
    			            minHeight: 180,
    			            items: form,
    			            buttons: [{
    			                text: CMD_OK,
    			            	handler: function(){
    			                    var form = Ext.getCmp('addAssy-formPanel-DBM7').getForm();
    			                    if(form.isValid())
    			                    {
    			                    	var val = form.getValues(false);
    			                	
	    			       				 Ext.Ajax.request({
	    			 						url: CONTEXT_PATH + '/design/bom.do?method=cloudAssycreate',
	    			 						params : val,
	    			 					    method: 'POST',
	    			                		success : function() {
	    			                			gMain.selPanel.loadTreeAllDef();
	    			                           	if(win) 
	    			                           	{
	    			                           		win.close();
	    			                           	}   	
	    			                		},
	    			 		               failure: function (result, op)  {
	    			 		            	   var jsonData = Ext.util.JSON.decode(result.responseText);
	    			 		                   var resultMessage = jsonData.data.result;
	    			 		            	   Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function() {});
	    			 		               	
	    			 		               }
	    			 		        	 });

    			                	//var assyline = Ext.ModelManager.create(val, 'AssyLine');
    			            		// 저장 수정
//    			                	assyline.save({
//    			                		success : function() {
//    			                           	if(win) 
//    			                           	{
//    			                           		win.close();
////    			                           		// pjTreeGrid.setLoading(true);
////    			                           		mesProjectTreeStore.load({
////    			                           		    callback: function(records, operation, success) {
////    			                           		    	console_log('load tree store');
////    			                           		    	console_log('ok');
////    			                           		    	//pjTreeGrid.setLoading(false);
////    			                           		        // treepanel.expandAll();
////    			                           		    }                               
////    			                           		});
//    			                           	}   	
//    			                		} 
//    			                	 });
    			                	 
    			                       	if(win) 
    			                       	{
    			                       		win.close();
    			                       	} 
    			                    } else {
    			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
    			                    }

    			                  }
    			            },{
    			                text: CMD_CANCEL,
    			            	handler: function(){
    			            		if(win) {
    			            			win.close();
    			            		}
    			            	}
    			            }]
    			        });
    			        win.show(/* this, function(){} */);
    	     }
    	});



    	// Context Popup Menu
    	this.contextMenu = Ext.create('Ext.menu.Menu', {
    	    items: [ this.editAssyAction, this.removeAssyAction ]
    	});
    	
    	
	    Ext.define('SrcAhd', {
		   	 extend: 'Ext.data.Model',
		   	 fields: [     
		       		 { name: 'unique_id', type: "string" }
		     		,{ name: 'item_code', type: "string"  }
		     		,{ name: 'item_name', type: "string"  }
		     		,{ name: 'specification', type: "string"  }
		     		,{ name: 'maker_name', type: "string"  }
		     		,{ name: 'description', type: "string"  }
		     		,{ name: 'specification_query', type: "string"  }
		     	  	  ],
		   	    proxy: {
		   			type: 'ajax',
		   	        api: {
		   	            read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
		   	        },
		   			reader: {
		   				type: 'json',
		   				root: 'datas',
		   				totalProperty: 'count',
		   				successProperty: 'success'
		   			}
		   		}
		   });    	
    	this.searchStore = new Ext.data.Store({  
    		pageSize: 16,
    		model: 'SrcAhd',
    		// remoteSort: true,
    		sorters: [{
                property: 'specification',
                direction: 'ASC'
            },
            {
                property: 'item_name',
                direction: 'ASC'
            }]

    	});
    	

    	
		var myFormPanel = Ext.create('Ext.form.Panel', {
			id: 'addPartForm-DBM7',
			title: 'Part',
			xtype: 'form',
			frame: false,
	        border: false,
            bodyPadding: 10,
            autoScroll: true,
            disabled: true,
	        defaults: {
	            anchor: '100%',
	            allowBlank: true,
	            msgTarget: 'side',
	            labelWidth: 60
	        },
	        // border: 0,
            dockedItems: [
              {
			      dock: 'top',
			    xtype: 'toolbar',
				items: [this.resetAction, '-', this.modRegAction/*, '-', copyRevAction*/]
			  }],
	        items: [{
				id :'search_information-DBM7',
				field_id :'search_information-DBM7',
		        name : 'search_information-DBM7',
	            xtype: 'combo',
	            emptyText: '규격으로 검색',
	            store: this.searchStore,
	            displayField: 'specification',
	            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	            sortInfo: { field: 'specification', direction: 'ASC' },
	            minChars: 1,
	            typeAhead: false,
	            hideLabel: true,
	            hideTrigger:true,
	            anchor: '100%',

	            listConfig: {
	                loadingText: '검색중...',
	                emptyText: '일치하는 결과가 없습니다.',

	                // Custom rendering template for each item
	                getInnerTpl: function() {
	                    return '<div><a class="search-item" href="javascript:setBomData({id});">' +
	                        '<span style="color:#999;"><small>{item_code}</small></span> <span style="color:#999;">{item_name}</span><br />{specification_query} <span style="color:#999;"><small>{maker_name}</small></span>' +
	                    '</a></div>';
	                }
	            },
	            pageSize: 10
	        }, {
	            xtype: 'component',
	            style: 'margin-top:10px',
	            html: '먼저, 등록된 자재인지 검색하세요.<hr>'
	        }
	        ,
	        new Ext.form.Hidden({
        		name: 'parent'
        	}),
        	new Ext.form.Hidden({
        		name: 'ac_uid'
        	}),
        	new Ext.form.Hidden({
        		name: 'pj_code'
        	}),
        	new Ext.form.Hidden({
        		name: 'coord_key2'
        	}),
        	new Ext.form.Hidden({
        		id: 'standard_flag-DBM7',
        		name: 'standard_flag'
        	}),
        	new Ext.form.Hidden({
        		name: 'child'
        	}),
        	new Ext.form.Hidden({
        		name: 'sg_code',
        		value:'NSD'
        	}),
        	new Ext.form.Hidden({
        		name: 'hier_pos'
        	}),
			new Ext.form.Hidden({
				name: 'assy_name',
				value:this.selectedAssyName
				
			}),
			new Ext.form.Hidden({
				name: 'pj_name',
				value:this.selectedPjName
			}),
			new Ext.form.Hidden({
				id: 'isUpdateSpec-DBM7',
				name: 'isUpdateSpec',
				value: 'false'
			}),
	        {
          	   xtype: 'container',
          	   layout: 'hbox',
          	   margin: '10 0 5 0',
   		        defaults: {
		            allowBlank: true,
		            msgTarget: 'side',
		            labelWidth: 60
		        },
               items: [
        				{	
        					fieldLabel:    this.getColName('unique_id'),
        		   			xtype:  'textfield', 
        					id:'unique_id-DBM7',
        					name: 'unique_id',
        					emptyText: '자재 UID', 
        					flex:1,
        					readOnly: true,
        					width: 300,
        					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
        		        },
        				{	
        		   			xtype:  'textfield',
        					id:   'unique_uid-DBM7',
        					name: 'unique_uid',
        					emptyText: 'BOM UID', 
        					flex:1,
        					readOnly: true,
        					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
        		        }
               ]
	        },
	        {	
	        	xtype:  'triggerfield',
				fieldLabel:    this.getColName('item_code'),
				id:  'item_code-DBM7',
				name: 'item_code',
				emptyText: '자동 생성',
				listeners : {
	          		specialkey : function(field, e) {
	          		if (e.getKey() == Ext.EventObject.ENTER) {
	          		}
	          	}
		      	},
		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger', 'onTrigger1Click': function() {
		          	
		        	  
		        	  var val = Ext.getCmp('item_code-DBM7').getValue();
		        	  if(val!=null && val!='') {
		        	  

		        		Ext.Ajax.request({
		        			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
		        			params:{
		        				item_code :val
		        			},
		        			success : function(result, request) {  
		        				var jsonData = Ext.decode(result.responseText);
		        				var records = jsonData.datas;
		        				if(records!=null && records.length>0) {
					        		modRegAction.enable();
					        		resetPartForm();
			        				setPartFormObj(records[0]);
		        				} else {
		        					Ext.MessageBox.alert('알림','알 수없는 자재번호입니다.');
		        				}

		        			},
		        			failure: extjsUtil.failureMessage
		        		});  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  }//endofif
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		      	}
				//readOnly: true,
				//fieldStyle: 'background-color: #EAEAEA; background-image: none;'
	        },
	        {

                id:           'standard_flag_disp-DBM7',
                name:           'standard_flag_disp',
                xtype:          'combo',
                mode:           'local',
                editable:       false,
                allowBlank: false,
                queryMode: 'remote',
                displayField:   'codeName',
                value:          '',
                triggerAction:  'all',
                fieldLabel: this.getColName('sp_code')+'*',
                store: this.commonStandardStore2,
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{systemCode}">{codeName}</div>';
                	}			                	
                },
 	               listeners: {
     	                    select: function (combo, record) {
     	                    	console_log('Selected Value : ' + combo.getValue());
     	                    	console_logs('record : ', record);
     	                    	var systemCode = record.get('systemCode');
     	                    	var codeNameEn  = record.get('codeNameEn');
     	                    	var codeName  = record.get('codeName');
     	                    	console_log('systemCode : ' + systemCode 
     	                    			+ ', codeNameEn=' + codeNameEn
     	                    			+ ', codeName=' + codeName	);
     	                    	Ext.getCmp('standard_flag-DBM7').setValue(systemCode);
     	                    	
     	                    	gMain.selPanel.getPl_no(systemCode);
//							 	var prefix = systemCode;
     	                    	var oClass_code1 = Ext.getCmp('class_code1-DBM7');
							 	if(systemCode=='S') {
							 		oClass_code1.setDisabled(false);
							 	} else {
							 		oClass_code1.setDisabled(true);
							 	}

     	                    }
     	               }
            },
            {
                fieldLabel: this.getColName('class_code'),
                id: 'class_code1-DBM7',
                name: 'class_code1',
                emptyText: '분류체계',
                xtype: 'combo',
                mode: 'local',
                editable: false,
                allowBlank: false,
                disabled: true,
                queryMode: 'remote',
                displayField: 'class_name',
                valueField: 'class_code',
                hidden: true,
                store: this.materialClassStore,
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
                	}			                	
                },
	                listeners: {
	                    select: function (combo, record) {
	                    	console_log('Selected Value : ' + combo.getValue());
	                    	var class_code = record[0].get('class_code');
	                    	var class_name = record[0].get('class_name');
	                    	var rand = RandomString(10);
	                    	var item_code = class_code.substring(0,4) + '-' + rand.substring(0,7);
	                    	Ext.getCmp('item_code-DBM7').setValue(item_code);
	                    }
 	            }
            },
            {
	            xtype: 'fieldset',
	            title: '품번* | 품명*', //panelSRO1139,
	            collapsible: false,
	            defaults: {
	                labelWidth: 40,
	                anchor: '100%',
	                layout: {
	                    type: 'hbox',
	                    defaultMargins: {top: 0, right: 3, bottom: 0, left: 0}
	                }
	            },
	            items: [

	                {
	                    xtype : 'fieldcontainer',
	                    combineErrors: true,
	                    msgTarget: 'side',
	                    defaults: {
	                        hideLabel: true
	                    },
	                    items : [     
		                {
		                    xtype: 'textfield',
		                    width:      50,
		                    emptyText: '품번*', 
		                    name : 'pl_no',
		                    id : 'pl_no-DBM7',
		                    fieldLabel: '품번',
		                    readOnly : false,
		                    allowBlank: false
		                },
		                {
		                    xtype: 'textfield',
		                    flex : 1,
		                    emptyText: '품명'+'*', 
		                    name : 'item_name',
		                    id : 'item_name-DBM7',
		                    fieldLabel: this.getColName('item_name'),
		                    readOnly : false,
		                    allowBlank: false
		                }
		            ]
			        }
			    ]
			},
        {
        	xtype:  'textfield',
       	 	fieldLabel: this.getColName('specification')+'*',
       	 	id: 'specification-DBM7',
       	 	name: 'specification',
            allowBlank: false
       }
        ,{
        	xtype:  'textfield', 
        	fieldLabel: this.getColName('maker_name'),
            id: 'maker_name-DBM7',
            name: 'maker_name',
            allowBlank: true
		},{
		    id:           'model_no-DBM7',
		    name:           'model_no',
		    xtype:          'combo',
		    mode:           'local',
		    editable:       true,
		    allowBlank: true,
		    queryMode: 'remote',
		    displayField:   'codeName',
		    valueField:     'codeName',
		    triggerAction:  'all',
		    fieldLabel: this.getColName('model_no'),
		    store: this.commonModelStore,
		    listConfig:{
		    	getInnerTpl: function(){
		    		return '<div data-qtip="{systemCode}">{codeName}</div>';
		    	}			                	
		    },
		    listeners: {			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							systemCode:'',
							codeNameEn: '',
							codeName: ''
					};
					this.add(blank);
				}
			    },
		            select: function (combo, record) {
		            	console_log('Selected Value : ' + combo.getValue());
		            	var systemCode = record.get('systemCode');
		            	var codeNameEn  = record.get('codeNameEn');
		            	var codeName  = record.get('codeName');
		            	console_log('systemCode : ' + systemCode 
		            			+ ', codeNameEn=' + codeNameEn
		            			+ ', codeName=' + codeName	);
		            }
		       }
        }
		,{
		    id:           'description-DBM7',
		    name:           'description',
		    xtype:          'combo',
		    mode:           'local',
		    editable:       true,
		    allowBlank: true,
		    queryMode: 'remote',
		    displayField:   'codeName',
		    valueField:     'codeName',
		    triggerAction:  'all',
		    fieldLabel: this.getColName('description'),
		    store: this.commonDescriptionStore,
		    listConfig:{
		    	getInnerTpl: function(){
		    		return '<div data-qtip="{systemCode}">{codeName}</div>';
		    	}			                	
		    },
		    listeners: {			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							systemCode:'',
							codeNameEn: '',
							codeName: ''
					};
					
					this.add(blank);
				}
			    },
		            select: function (combo, record) {
		            	console_log('Selected Value : ' + combo.getValue());
		            	var systemCode = record.get('systemCode');
		            	var codeNameEn  = record.get('codeNameEn');
		            	var codeName  = record.get('codeName');
		            	console_log('systemCode : ' + systemCode 
		            			+ ', codeNameEn=' + codeNameEn
		            			+ ', codeName=' + codeName	);
		            }
		       }
        }
        ,{
			xtype:  'textfield', 
			fieldLabel: this.getColName('comment'),
		    id: 'comment-DBM7',
		    name: 'comment',
		    allowBlank: true
		}
		,{
		    xtype: 'fieldset',
		    border: true,
		    // style: 'border-width: 0px',
		    title: panelSRO1186+' | '+panelSRO1187+' | '+panelSRO1188+' | 통화',//panelSRO1174,
		    collapsible: false,
		    defaults: {
		        labelWidth: 40,
		        anchor: '100%',
		        layout: {
		            type: 'hbox',
		            defaultMargins: {top: 0, right: 0, bottom: 0, left: 0}
		        }
		    },
		    items: [
		
		        {
		            xtype : 'fieldcontainer',
		            combineErrors: true,
		            msgTarget: 'side',
		            defaults: {
		                hideLabel: true
		            },
		            items : [
                 {
                     xtype: 'numberfield',
                     minValue: 0,
                     width : 50,
                     id: 'bm_quan-DBM7',
                     name : 'bm_quan',
                     fieldLabel: this.getColName('bm_quan'),
                     allowBlank: true,
                     value: '1',
                     margins: '0'
                 },{
                    width:          50,
                    id:           'unit_code-DBM7',
                    name:           'unit_code',
                    xtype:          'combo',
                    mode:           'local',
                    editable:       false,
                    allowBlank: false,
                    queryMode: 'remote',
	                displayField:   'codeName',
	                valueField:     'codeName',
                    value:          'PC',
                    triggerAction:  'all',
                    fieldLabel: this.getColName('unit_code'),
                   store: this.commonUnitStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
     	               listeners: {
     	                    select: function (combo, record) {
     	                    	console_log('Selected Value : ' + combo.getValue());
     	                    	var systemCode = record.get('systemCode');
     	                    	var codeNameEn  = record.get('codeNameEn');
     	                    	var codeName  = record.get('codeName');
     	                    	console_log('systemCode : ' + systemCode 
     	                    			+ ', codeNameEn=' + codeNameEn
     	                    			+ ', codeName=' + codeName	);
     	                    }
     	               }
            },
            {
                xtype: 'numberfield',
                minValue: 0,
                flex: 1,
                id : 'sales_price-DBM7',
                name : 'sales_price',
                fieldLabel: this.getColName('sales_price'),
                allowBlank: true,
                value: '0',
                margins: '0'
            }, {
                width:         50,
                id:           'currency-DBM7',
                name:           'currency',
                xtype:          'combo',
                mode:           'local',
                editable:       false,
                allowBlank: false,
                queryMode: 'remote',
                displayField:   'codeName',
                valueField:     'codeName',
                value:          'KRW',
                triggerAction:  'all',
                fieldLabel: this.getColName('currency'),
                store: this.commonCurrencyStore,
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{systemCode}">{codeName}</div>';
                	}			                	
                },
                listeners: {
	                    select: function (combo, record) {
	                    	console_log('Selected Value : ' + combo.getValue());
	                    	var systemCode = record.get('systemCode');
	                    	var codeNameEn  = record.get('codeNameEn');
	                    	var codeName  = record.get('codeName');
	                    	console_log('systemCode : ' + systemCode 
	                    			+ ', codeNameEn=' + codeNameEn
	                    			+ ', codeName=' + codeName	);
	                    }
	               }
        }
        ]
        }
	    ]
	}
		,{
            xtype: 'container',
                                        type: 'hbox',
                                        padding:'5',
                                        pack:'end',
                                        align:'left',
            defaults: {
            },
            margin: '0 0 0 0',
            border:false,
            items: [
		        {
                    xtype:'button',
                    id: 'ok_btn_id-DBM7',
                    text: CMD_OK,
		            handler: function() {
		            	
		            	var item_code = Ext.getCmp('item_code-DBM7').getValue();
			    		if(item_code==null || item_code.length==0) {
			    			item_code = this.selectedPjCode + this.selectedAssyCode + Ext.getCmp('pl_no-DBM7').getValue();
			    			Ext.getCmp('item_code-DBM7').setValue(item_code);
			    		}

		            	
		                this.up('form').getForm().isValid();


		            	var isUpdateSpec = Ext.getCmp('isUpdateSpec-DBM7').getValue();
		            	var specification = Ext.getCmp('specification-DBM7').getValue();
		            	var unique_id = Ext.getCmp('unique_id-DBM7').getValue();
		            	var standard_flag = Ext.getCmp('standard_flag-DBM7').getValue();
		            	var idx = specification.search(gMain.selPanel.CHECK_DUP);
		            	if(idx>-1) {
		            		Ext.MessageBox.alert('경고','가공품이 아니면 규격 수정이 필요합니다. 다시 한번 확인하세요.');
		            	} else {
			            	if( (isUpdateSpec=='true' || unique_id.length < 3)
			            			
			            			&& standard_flag !='O'
			            	
			            	) {//중복체크 필요.
			            		Ext.Ajax.request({
			            			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialBySpecification',				
			            			params:{
			            				specification : specification
			            			},
			            			success : function(result, request) {
			            				var jsonData = Ext.decode(result.responseText);
			             				var found = jsonData['result'];
			             				var exist = Ext.getCmp('unique_id-DBM7').getValue();
			             				
			             				if(found.length>2 && exist != found ) {// 다른 중목자재 있음.
			             					Ext.MessageBox.alert('경고','표준 또는 메이커 자재에 이미 동일한 규격이 등록되어 있습니다.');
			             				} else {
			             					gMain.selPanel.addNewAction();
			    			                //resetPartForm();
			    			                //this.up('form').getForm().reset();
			             				}
			            			},// endof success for ajax
			            			failure: extjsUtil.failureMessage
			            		}); // endof Ajax
			            	} else {
			            		gMain.selPanel.addNewAction();
				                //resetPartForm();
				                //this.up('form').getForm().reset();	
			            	}
		            	}
		            }
		        },{
		            xtype:'button',
		            id: 'init_btn_id-DBM7',
		            text: '초기화',
		            handler: function() {
		            	gMain.selPanel.resetPartForm();
		                this.up('form').getForm().reset();
		            }
		        }
    		]
         }
    
	        ]
		});
		
		
		
		
		
		
		
		
		
		
		
		
		this.pjTreeGrid =
	    	Ext.create('Ext.tree.Panel', {
			// border: false,
			 title: 'Assembly',// cloud_product_class,
			 //region: 'center',
			 listeners: {
	             activate: function(tab){
	                 setTimeout(function() {
	                 	// Ext.getCmp('main-panel-center').setActiveTab(0);
	                     // alert(tab.title + ' was activated.');
	                 }, 1);
	             }
	         },

	         viewConfig: {
			    	listeners: {
						 itemcontextmenu: function(view, rec, node, index, e) {
							 console_logs('itemcontextmenu rec', rec);
							 selectedNodeId = rec.getId();
							 gMain.selPanel.treeSelectHandler(rec);
							
							 e.stopEvent();
							 gMain.selPanel.contextMenu.showAt(e.getXY());							 
							 
							 return false;
						 },
					    itemclick: function(view, record, item, index, e, eOpts) {                      
					    	gMain.selPanel.treeSelectHandler(record);
					    }// end itemclick
			    	}// end listeners
				},
		        // border: 0,
	            dockedItems: [
	            {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [this.addAssyAction, this.editAssyAction, this.removeAssyAction, '->', this.expandAllTreeAction ]
				},
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default5',
					items: [{
			    		id:'DBM7-level1',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'대분류',
				        displayField:   'class_name',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.ClaastStore', {level1: 1, identification_code: 'PD'} ),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">{class_code} <small><font color=blue>{class_name}</font></small></div>';
				            	}
				        },
				        listeners: {
					           select: function (combo, record) {
				                 	console_log('Selected Value : ' + combo.getValue());
				                 	console_logs('record : ', record);
				                 	var class_code = record.get('class_code');
				                 	var claastlevel2 = Ext.getCmp('DBM7-level2');
				                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
					           }
				        }
			    	
			    	},{
			    		id:'DBM7-level2',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'중분류',
				        displayField:   'class_name',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.ClaastStore', {level1: 2, identification_code: 'PD', parent_class_code:'A'}),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">{class_code} <small><font color=blue>{class_name}</font></small></div>';
				            	}
				           },
					        listeners: {
						           select: function (combo, record) {
					                 	console_log('Selected Value : ' + combo.getValue());
					                 	console_logs('record : ', record);
					                 	var class_code = record.get('class_code');
					                 	var claastlevel2 = Ext.getCmp('DBM7-level3');
					                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
						           }
					        }
			    	
			    	} ,{
			    		id:'DBM7-level3',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'소분류',
				        displayField:   'class_name',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.ClaastStore', {level1: 3, identification_code: 'PD'} ),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">{class_code} <small><font color=blue>{class_name}</font></small></div>';
				            	}
				           },
					        listeners: {
						           select: function (combo, record) {
					                 	console_log('Selected Value : ' + combo.getValue());
					                 	console_logs('record : ', record);
					                 	var class_code = record.get('class_code');
					                 	var claastlevel2 = Ext.getCmp('DBM7-level4');
					                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
						           }
					        }
			    	
			    	},{
			    		id:'DBM7-level4',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'상세분류',
				        displayField:   'class_name',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.ClaastStore', {level1: 4, identification_code: 'PD'} ),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">{class_code} <small><font color=blue>{class_name}</font></small></div>';
				            	}
				           }
			    	
			    	}  ]
				},
	            {
	                dock: 'top',
	                xtype: 'toolbar',
	                cls: 'my-x-toolbar-default5',
	                items: [
								{
									id:'projectcombo-DBM7',
								    	xtype: 'combo',
								    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								           mode: 'local',
								           editable:false,
								           // allowBlank: false,
								           width: '100%',
								           queryMode: 'remote',
								           emptyText:'프로젝트를 선택하세요.',
								           displayField:   'folder_name',
								           valueField:     'unique_id',
								           store: this.cloudprojectStore,
								           listConfig:{
								            	getInnerTpl: function(){
								            		return '<div data-qtip="{pj_name}">{pj_code} <small><font color=blue>{pj_name}</font></small></div>';
								            	}			                	
								           },
								           triggerAction: 'all',
								           listeners: {
								           select: function (combo, record) {
							                 	console_log('Selected Value : ' + combo.getValue());
							                 	console_logs('record : ', record);
							                 	var pjuid = record.get('unique_id');
							                 	ac_uid = pjuid;
							                 	var pj_name  = record.get('pj_name');
							                 	var pj_code  = record.get('pj_code');

							                 	gMain.selPanel.assy_pj_code ='';
							                 	gMain.selPanel.selectedAssyCode = '';
							                 	gMain.selPanel.selectedPjCode = pj_code;
							                 	gMain.selPanel.selectedPjName = pj_name;
							                 	gMain.selPanel.selectedPjUid = pjuid;
							                 	gMain.selPanel.order_com_unique = record.get('order_com_unique');
							                 	

							                 	gMain.selPanel.puchaseReqTitle = '[' + pj_code + '] ' + pj_name;
							                 	
							                 	gMain.selPanel.loadTreeAll(pjuid);
							                 	
							            	 
//							                 	gMain.selPanel.srchTreeHandler (/*this.pjTreeGrid, this.mesProjectTreeStore, */'projectcombo', 'pjuid', true);
//							                 	store.removeAll();
//							                 	unselectAssy();
//							                 	//Default Set
//								 				Ext.Ajax.request({
//								 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
//								 					params:{
//								 						paramName : 'CommonProjectAssy',
//								 						paramValue : pjuid + ';' + '-1'
//								 					},
//								 					
//								 					success : function(result, request) {
//								 						console_log('success defaultSet');
//								 					},
//								   	 				failure: function(result, request){
//								   	 					console_log('fail defaultSet');
//								   	 				}
//								 				});
//								 				
//								 			
//								 				stockStore.getProxy().setExtraParam('ac_uid', selectedPjUid);
//								 				stockStore.load();

							                 }
							            }
						    }
	                ]
	            }]
			 ,
			 
			 rootVisible: false,
			// cls: 'examples-list',
			 lines: true,
			 useArrows: true,
			 // margins: '0 0 0 5',
			 store: this.mesProjectTreeStore
			} );    	
//        var store = Ext.create('Ext.data.TreeStore', {
//            model: 'Task',
//            proxy: {
//                type: 'ajax',
//                url: 'treegrid.json'
//            },
//            folderSort: false
//        });
//        
//        
//        
//    	var pjTreeGrid = Ext.create('Ext.tree.Panel', {
//    		//width: '30%',
//            title: 'Assembly',
//            //width: 500,
//            collapsible: true,
//            useArrows: true,
//            rootVisible: true,
//            store: store,
//            multiSelect: true,
//            //region: 'west',
//            resizable: false
//            //forceFit: true,
////            columns: [{
////                xtype: 'treecolumn', //this is so we know which column will show the tree
////                text: 'Task',
////                width: 250,
////                sortable: false,
////                dataIndex: 'task',
////                locked: true
////            }, {
////                text: '등록자',
////                width: 100,
////                dataIndex: 'user',
////                sortable: false
////            }, {
////                //we must use the templateheader component so we can use a custom tpl
////                text: '수량',
////                width: 100,
////                sortable: true,
////                dataIndex: 'duration',
////                align: 'right'
////            }]
//        });
    	
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '30%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.pjTreeGrid, myFormPanel]
			});
    	
    	return this.west;
    },
    cellEditing : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    cellEditing1 : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    cellEditing2 : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    // *****************************GLOBAL VARIABLE**************************/
    grid : null,
    gridMycart : null,
    gridStock : null,
    store : null,
    myCartStore : null,
    stockStore : null,
    gItemGubunType : null,
    itemGubunType : null,
    inpuArea : null,

    sales_price : '',
    quan : '',
    selectedAssyRecord : null,
    lineGap : 35,

    selectedPjUid : '',
    selectedAssyUid : '',

    toPjUidAssy : '',	// parent
    toPjUid : '',	// ac_uid
    selectionLength : 0,

    commonUnitStore : null,
    commonCurrencyStore : null,
    commonModelStore : null,
    commonStandardStore2: null,
    GubunStore: null,

    assy_pj_code:'',
    selectedAssyCode:'',
    selectedPjCode:'',
    selectedPjName:'',
    selectedAssyDepth:0,
    selectedAssyName:'',
    selectedparent:'',
    ac_uid:'',
    selectedPjQuan : 1,
    selectedAssyQuan : 1,
    selectedMakingQuan : 1,

    addpj_code:'',
    is_complished : false,
    routeTitlename : '',
    puchaseReqTitle : '',

    CHECK_DUP : '-copied-',
    gGridMycartSelects: [],
    copyArrayMycartGrid: function(from) {

    	this.gGridMycartSelects = [];
    	if(from!=null && from.length>0) {	
    		for(var i=0; i<from.length; i++) {
    			this.gGridMycartSelects[i] = from[i];
    		}
    	}
    },
    gGridStockSelects:[],
    copyArrayStockGrid: function(from) {

    	this.gGridStockSelects = [];
    	if(from!=null && from.length>0) {	
    		for(var i=0; i<from.length; i++) {
    			this.gGridStockSelects[i] = from[i];
    		}
    	}
    },
    initTableInfo: '',
    INIT_TABLE_HEAD: function(){
    	var a =
    		'<style>'+
    		' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
    		' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
    		' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
    		' </style>' +
    		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
    	'<colgroup>'+
    		'<col width="80px">' +
    		'<col width="90px">' +
    		'<col width="*">' +
    		
    		'<col width="90px">' +
    		'<col width="90px">' +
    		'<col width="50px">' +
    		'<col width="90px">' +
    		
    		'<col width="60px">' +
    		'<col width="60px">' +
    		'<col width="40px">' +
    		
    		'<col width="110px">' +
    		'<col width="90px">' +
    	'</colgroup>' +
    		'<tbody>' +
    		'<tr  height="30" >' +
    		'	  <td class="xl66" align=center>프로젝트코드</td>' +
    		'	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
    		'	  <td class="xl66" align=center>프로젝트이름</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedPjName + '</td>' +
    		'<td colspan="8" rowspan="2">'+
    		'</td>' +
    		'	 </tr>' + 
    		'<tr  height="30" >' +
    		'	  <td class="xl66" align=center>Assy코드</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedAssyCode + '</td>' +
    		'	  <td class="xl66" align=center>Assy이름</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedAssyName + '</td>' +
    		'	 </tr>' + 
    		'<tr  height="25" >' +
    		'	  <td class="xl66" align=center>품번</td>' +
    		'	  <td class="xl66" align=center>품명</td>' +
    		'	  <td class="xl66" align=center>규격</td>' +
    		
    		'	  <td class="xl66" align=center>재질</td>' +
    		'	  <td class="xl66" align=center>후처리</td>' +
    		'	  <td class="xl66" align=center>열처리</td>' +
    		'	  <td class="xl66" align=center>제조원</td>' +
    		
    		'	  <td class="xl66" align=center>예상가격</td>' +
    		'	  <td class="xl66" align=center>수량</td>' +
    		'	  <td class="xl66" align=center>구분</td>' +
    		'	  <td class="xl66" align=center>품목코드</td>' +
    		'	  <td class="xl66" align=center>UID</td>' +
    	'	 </tr>';
    		
    		return a;
    	},
    	INIT_TABLE_TAIL: 
    		'</tbody></table><br><br>' +
    		'<div style="color:blue;font-size:11px;position:relative; "><ul>'+
    		'<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>'+
    		'<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>'+
    		'<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>'+
    		'</ul></div>',
    	makeInitTable : function() {
    		var initTableLine = 
    			'	 <tr height="25" style="height:12.75pt">' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl67">&nbsp;</td>' +
    			'	  <td class="xl67">&nbsp;</td>' +
    			'	 </tr>';

			this.initTableInfo = INIT_TABLE_HEAD();
			this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
    	},
    	bomTableInfo : '',
    	
    	createLine: function (val, align, background, style) {
    		return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>'+ val + '</td>' ;
    	},

    	setChildQuan : function (n) {
    		var o = Ext.getCmp('childCount-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},
    	
    	setAssyQuan : function(n) {
    		var o = Ext.getCmp('assy_quan-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},
    	setProjectQuan : function(n) {
    		var o = Ext.getCmp('pj_quan-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},

    	setMaking_quan : function(n) {
    		var o = Ext.getCmp('making_quan-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    		
    	},

    	createHtml : function(route_type, rqstType, catmapObj) {
    		var htmlItems =
    			'<style>'+
    			' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
    			' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
    			' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
    			' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
    		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
    		'<colgroup>'+
    			'<col width="10%">' +
    			'<col width="10%">' +
    			'<col width="10%">' +
    			'<col width="20%">' +
    			'<col width="40%">' +
    		'</colgroup>' +
    			'<tbody>' +
    			'<tr  height="25" >' +
    			'	  <td class="xl67" align=center>품목코드</td>' +
    			'	  <td class="xl67" align=center>필요수량</td>' +
    			'	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
    			'	  <td class="xl67" align=center>품명</td>' +
    			'	  <td class="xl67" align=center>규격</td>' +
    			'	 </tr>' ;
    		for(var i=0; i< catmapObj.length; i++) {
    			var rec = catmapObj[i];//grid.getSelectionModel().getSelection()[i];
    			var item_code = rec.get('item_code');
    			var quan = route_type=='P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
    			var new_pr_quan = rec.get('new_pr_quan');
    			var item_name = rec.get('item_name');
    			var specification = rec.get('specification');
    			
    			htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
    			htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + '</tr>';

    		}
    		htmlItems = htmlItems + '</tbody></table></div>';
    		return htmlItems;
    	},

    	setMakeTable : function(records) {
    		this.bomTableInfo = this.INIT_TABLE_HEAD();
    		if(records==null || records.length==0) {
    			//bomTableInfo = initTableInfo;
    		} else {
    			
    			for( var i=0; i<records.length; i++) {
    	          	var rec = records[i];
    	        	var unique_id =  rec.get('unique_id');
    	        	var unique_uid =  rec.get('unique_uid');
    	        	var item_code =  rec.get('item_code');
    	        	var item_name =  rec.get('item_name');
    	        	var specification =  rec.get('specification');
    	        	var standard_flag =  rec.get('standard_flag');
    	        	var sp_code =  rec.get('sp_code'); //표시는 고객사 선책톧로
    	        	
    	        	var model_no =  rec.get('model_no');	
    	        	var description =  rec.get('description');
    	        	var pl_no =  rec.get('pl_no');
    	        	var comment =  rec.get('comment');
    	        	var maker_name =  rec.get('maker_name');
    	        	var bm_quan =  rec.get('bm_quan');
    	        	var unit_code =  rec.get('unit_code');
    	        	var sales_price =  rec.get('sales_price');
    	        	
    	        	this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65');//품번
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65');//품명
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65');//규격
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65');//재질/모델
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65');//후처리
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65');//열처리
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65');//제조원
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65');//예상가(숫자)
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65');//수량(숫자)
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65');//구분기호
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67');//품목코드
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67');//UID
    	        	this.bomTableInfo = this.bomTableInfo + '	 </tr>';
    			}
    		}
    		this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
    		var o = Ext.getCmp('bom_content-DBM7');
    		o.setValue(this.bomTableInfo);
    	},

    	insertStockStoreRecord: function(records) {},
    	

    	cloudprojectStore : Ext.create('Mplm.store.cloudProjectStore', {} ),
	    mesProjectTreeStore : Ext.create('Mplm.store.MesProjectTreeStore', {}),
	    routeGubunTypeStore : Ext.create('Mplm.store.RouteGubunTypeStore', {} ),
	    routeGubunTypeStore_W : Ext.create('Mplm.store.RouteGubunTypeStore_W', {} ),
	    commonStandardStore : Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} ),
	    


    	renderCarthistoryPlno : function(value, p, record) {
    		var unique_uid = record.get('unique_uid');
    		
    	    return Ext.String.format(
    	            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
    	           unique_uid, value
    	        );
    	},


    	getPosStandard: function(id){

    		for (var i=0; i<this.standard_flag_datas.length; i++){
    			if(this.standard_flag_datas[i].get('systemCode') == id){
    				return this.standard_flag_datas[i];
    			}
    		}
    		return null;
    	},

    	selectAssy: function(routeTitlename, depth) {
    		console_logs('routeTitlename', routeTitlename);
    		//addAction.enable();
    		this.addAssyAction.enable();
    		this.inpuArea.enable();
    		Ext.getCmp('addPartForm-DBM7').enable();
    		Ext.getCmp('target-routeTitlename-DBM7').update('<b>'+routeTitlename+'</b>'); 
    		if(depth==1) {
    			this.editAssyAction.disable();
    			this.removeAssyAction.disable();
    		} else {
    			this.editAssyAction.enable();
    			this.removeAssyAction.enable();		
    		}


    	},

    	unselectAssy : function() {
    		//this.addAction.disable();
    		this.addAssyAction.disable();
    		this.editAssyAction.disable();
    		this.removeAssyAction.disable();
    		this.inpuArea.disable();
    		Ext.getCmp('bom_content-DBM7').setValue(initTableInfo);
    		Ext.getCmp('addPartForm-DBM7').disable();
    		Ext.getCmp('target-routeTitlename-DBM7').update('Assembly를 선택하세요.'); 
    	},


    	item_code_dash: function(item_code){
    		if(item_code==null || item_code.length<13) {
    			return item_code;
    		}else {
    			return item_code.substring(0,12);
    		}
    	},

    	setReadOnlyName: function(name, readonly) {
    		this.setReadOnly(Ext.getCmp(name), readonly);
    	},

    	setReadOnly: function(o, readonly) {
    		if(o!=undefined && o!=null) {
        	    o.setReadOnly(readonly);
        	    if (readonly) {
        	        o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
        	    } else {
        	        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
        	    }    			
    		}


    	},

    	getPl_no: function (systemCode) {
    	 	var prefix = systemCode;
    	 	if(systemCode=='S') {
    	 		prefix = 'K';
    	 	} else if(systemCode=='O') {
    	 		prefix = 'A';
    	 	}
    		   Ext.Ajax.request({
    			url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
    			params:{
    				first:prefix,
    				parent_uid:this.selectedparent
    			},
    			success : function(result, request) {   
    				var result = result.responseText;
    				var str = result;	// var str = '293';
    				Ext.getCmp('pl_no-DBM7').setValue(str);

    				
    			},
    			failure: extjsUtil.failureMessage
    		});
    	},



    	 fPERM_DISABLING_Complished: function() {
    		// 1. 권한있음.
    		if (fPERM_DISABLING() == false && is_complished == false) {
    			return false;
    		} else { // 2.권한 없음.
    			return true;
    		}
    	},

    	//Define reset Action
    	resetAction : Ext.create('Ext.Action', {
    		 itemId: 'resetButton',
    		 iconCls: 'af-remove',
    		 text: CMD_INIT,
    		 handler: function(widget, event) {
    			 resetPartForm();
    			 Ext.getCmp('addPartForm-DBM7').getForm().reset();
    			 //console_logs('getForm().reset()', 'ok');
    		 }
    	}),
    	
    	pasteAction : Ext.create('Ext.Action', {
    		 itemId: 'pasteActionButton',
    		 iconCls: 'paste_plain',
    		 text: '현재 Assy에 붙여넣기',
    		 disabled: true,
    		 handler: function(widget, event) {
    		    	if(this.selectedparent==null || this.selectedparent=='' || this.selectedPjUid==null || this.selectedPjUid=='') {
    		    		Ext.MessageBox.alert('오류','먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
    		    	} else {

    		    	    var fp = Ext.create('Ext.FormPanel', {
    		    	    	id: 'formPanelSelect-DBM7',
    		    	    	frame:true,
    		    	        border: false,
    		    	        fieldDefaults: {
    		    	            labelWidth: 80
    		    	        },
    		    	        width: 300,
    		    	        height: 220,
    		    	        bodyPadding: 10,
    		    	        items: [
    							{
    								xtype: 'component',
    								html:'복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
    							},
    		    	            {
    				    	        xtype: 'container',
    				    	        layout: 'hbox',
    				    	        margin: '10 10 10',
    				    	        items: [{
    						    	            xtype: 'fieldset',
    						    	            flex: 1,
    						    	            border: false,
    						    	            //title: '복사 수행시 수량을 1로 초기화하거나 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.',
    						    	            defaultType: 'checkbox', // each item will be a checkbox
    						    	            layout: 'anchor',
    						    	            defaults: {
    					    	                anchor: '100%',
    					    	                hideEmptyLabel: false
    					    	            },
    					    	            items: [
    				    	                {
    					    	                fieldLabel: '복사 옵션',
    					    	                boxLabel: '수량을 1로 초기화',
    					    	                name: 'resetQty',
    					    	                checked: true,
    					    	                inputValue: 'true'
    					    	            }, {
    					    	                boxLabel: '품번 재부여',
    					    	                name: 'resetPlno',
    					    	                checked: true,
    					    	                inputValue: 'true'
    					    	            },  new Ext.form.Hidden({
    					        	            name: 'hid_null_value'
    					        		        })]
    				    	        }]
    				    	    }]
    			    	    });
    		    	    
    		    	    w = Ext.create('ModalWindow', {
    			            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
    			            width: 300,
    			            height: 220,
    			            plain:true,
    			            items: fp,
    			            buttons: [{
    			                text: '복사 실행',
    			                disabled: false,
    			            	handler: function(btn){
    			            		var form = Ext.getCmp('formPanelSelect-DBM7').getForm();
    		            			var val = form.getValues(false);
    		            		    var selections = gridMycart.getSelectionModel().getSelection();
    		            		    if (selections) {
    		            		        	var uids = [];
    		            		        	for(var i=0; i< selections.length; i++) {
    		            		        		var rec = selections[i];
    		            		        		var unique_uid = rec.get('unique_uid');
    		            		        		uids.push(unique_uid);
    		            		        	}
    		            		      	   Ext.Ajax.request({
    		            		      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
    		            		      			params:{
    		            		      				project_uid: this.selectedPjUid,
    		            		      				parent_uid:  this.selectedparent,
    		            		      				unique_uids: uids,
    		            		      				resetQty: val['resetQty'],
    		            		      				resetPlno: val['resetPlno']
    		            		      			},
    		            		      			success : function(result, request) {   
    		            		            		if(w) {
    		            		            			w.close();
    		            		            		}
    		            		      				var result = result.responseText;
    	            		     					this.myCartStore.load(function() {});
    		            		      				//Ext.MessageBox.alert('결과','총 ' + result + '건을 복사하였습니다.');
    		            		     				store.load( function(records) {
    		            		     					gMain.selPanel.insertStockStoreRecord(records);
    		            		     					gMain.selPanel.setChildQuan(records.length);
    		            			     					
    		            			     			});
    		            		      			},
    		            		      			failure: extjsUtil.failureMessage
    		            		      		});

    		            		    }

    			            	}
    						},{
    			                text: CMD_CANCEL,
    			            	handler: function(){
    			            		if(w) {
    			            			w.close();
    			            		}
    			            	}
    						}]
    			        }); w.show();
    		    		
    		    		
    		    	}
    		 }
    	}),



    	//수정등록
    	modRegAction : Ext.create('Ext.Action', {
    		 itemId: 'modRegAction',
    		 iconCls: 'page_copy',
    		 text: '값 복사',
    		 disabled: true,
    		 handler: function(widget, event) {
    			 gMain.selPanel.unselectForm();
    			 grid.getSelectionModel().deselectAll();
    		 }
    	}),
    	cleanComboStore: function(cmpName)
    	{
    	    var component = Ext.getCmp(cmpName); 
    	    
    	    component.setValue('');
    	    component.setDisabled(false);
    		component.getStore().removeAll();
    		component.setValue(null)
    		component.getStore().commitChanges();
    		component.getStore().totalLength = 0;
    	},

    	resetParam: function() {
    		this.store.getProxy().setExtraParam('unique_id', '');
    		this.store.getProxy().setExtraParam('item_code', '');
    		this.store.getProxy().setExtraParam('item_name', '');
    		this.store.getProxy().setExtraParam('specification', '');
    	},

    	loadTreeAllDef: function(){
    		this.loadTreeAll(this.selectedPjUid);
    	},
    	loadTreeAll: function(pjuid) {
    		//this.pjTreeGrid.setLoading(true);
    		
    		this.mesProjectTreeStore.removeAll(true);
    		this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
    		this.mesProjectTreeStore.load( {		
    			callback: function(records, operation, success) {
//    				console_logs('tree callback', 'lading palse....');
//    				gMain.selPanel.pjTreeGrid.setLoading(false);
//    				
//	                 setTimeout(function() {
//	                	 console_logs('tree panel', 'expanding....');
//	     				gMain.selPanel.expandAllTree();
//		             }, 2);

    			}
    		});
    	},
//    	srchTreeHandler: function (/*my_treepanel, mesProjectTreeStore,*/ widName, parmName) {
//    		//this.pjTreeGrid, this.mesProjectTreeStore, 
//    		//console_info("srchSingleHandler");
////    		gMain.selPanel.pjTreeGrid.setLoading(true);
//    		
//    		this.resetParam(gMain.selPanel.mesProjectTreeStore, this.searchField);
//    		var val = Ext.getCmp(widName).getValue();
//    		console_log('val'+val);
//
////    		gMain.selPanel.mesProjectTreeStore.getProxy().setExtraParam(parmName, val);
////    		gMain.selPanel.mesProjectTreeStore.load( {
////    					
////    			callback: function(records, operation, success) {
////    				gMain.selPanel.pjTreeGrid.setLoading(false);
////    			}
////    		});
//
//    	},

    	setBomData: function(id) {

    		this.modRegAction.enable();
    		this.resetPartForm();
    		
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/material.do?method=read',
    			params:{
    				id :id
    			},
    			success : function(result, request) {   
    	       		
    				var jsonData = Ext.decode(result.responseText);
    				//console_logs('jsonData', jsonData);
    				var records = jsonData.datas;
    				//console_logs('records', records);
    				//console_logs('records[0]', records[0]);
    				setPartFormObj(records[0]);
    			},
    			failure: extjsUtil.failureMessage
    		});
    		
    	},
    	
    	setPartFormObj : function(o) {
    		
    		//규격 검색시 standard_flag를 sp_code로 사용하기
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
    			success : function(result) {
    				var text = result.responseText;
    				console_logs('text', text);
    				var o2 = JSON.parse(text, function (key, value) {
    						    return value;
    						});
    				
    			   //console_logs('o2', o2);
    	 		   gItemGubunType = o2['itemGubunType'];
    				//console_logs('itemGubun', itemGubunType);
    				//console_logs('itemGubun1', gItemGubunType);

    				
    				var standard_flag = null;
    				if(gItemGubunType=='standard_flag') {
    					standard_flag =  o['standard_flag'];
    				} else {
    					standard_flag =  o['sp_code'];
    				}
    				
    				Ext.getCmp('unique_id-DBM7').setValue( o['unique_id']);
    				Ext.getCmp('unique_uid-DBM7').setValue( o['unique_uid']);
    				Ext.getCmp('item_code-DBM7').setValue( o['item_code']);
    				Ext.getCmp('item_name-DBM7').setValue( o['item_name']);
    				Ext.getCmp('specification-DBM7').setValue( o['specification']);

    				Ext.getCmp('standard_flag-DBM7').setValue(standard_flag);
    				Ext.getCmp('standard_flag_disp-DBM7').select(getPosStandard(standard_flag));
    				Ext.getCmp('model_no-DBM7').setValue( o['model_no']);	
    				Ext.getCmp('description-DBM7').setValue( o['description']);
    				
    				Ext.getCmp('comment-DBM7').setValue( o['comment']);
    				Ext.getCmp('maker_name-DBM7').setValue( o['maker_name']);
    				Ext.getCmp('bm_quan-DBM7').setValue('1');
    				Ext.getCmp('unit_code-DBM7').setValue( o['unit_code']);
    				Ext.getCmp('sales_price-DBM7').setValue( o['sales_price']);
    				
    				
    				gMain.selPanel.getPl_no(standard_flag);
    				
    				var currency =  o['currency'];
    				if(currency==null || currency=='') {
    					currency = 'KRW';
    				}
    				Ext.getCmp('currency-DBM7').setValue(currency);
    				this.readOnlyPartForm(true);
    				
    				
    				
    			},
    			failure: extjsUtil.failureMessage
    		});
    		
    		
    		
    		
    		
    		
    	},
    	
    	setPartForm: function(record) {
    		//console_logs('record:', record);

    		Ext.getCmp('unique_id-DBM7').setValue( record.get('unique_id'));
    		Ext.getCmp('unique_uid-DBM7').setValue( record.get('unique_uid'));
    		Ext.getCmp('item_code-DBM7').setValue( record.get('item_code'));
    		Ext.getCmp('item_name-DBM7').setValue( record.get('item_name'));
    		Ext.getCmp('specification-DBM7').setValue( record.get('specification'));
    		
    		var standard_flag =  record.get('standard_flag');
    		Ext.getCmp('standard_flag-DBM7').setValue(standard_flag);
    		
    		Ext.getCmp('standard_flag_disp-DBM7').select(getPosStandard(standard_flag));
    		Ext.getCmp('model_no-DBM7').setValue( record.get('model_no'));	
    		Ext.getCmp('description-DBM7').setValue( record.get('description'));
    		Ext.getCmp('pl_no-DBM7').setValue( record.get('pl_no'));
    		Ext.getCmp('comment-DBM7').setValue( record.get('comment'));
    		Ext.getCmp('maker_name-DBM7').setValue( record.get('maker_name'));
    		Ext.getCmp('bm_quan-DBM7').setValue( record.get('bm_quan'));
    		Ext.getCmp('unit_code-DBM7').setValue( record.get('unit_code'));
    		Ext.getCmp('sales_price-DBM7').setValue( record.get('sales_price'));
    		
    		
    		var currency =  record.get('currency');
    		if(currency==null || currency=='') {
    			currency = 'KRW';
    		}
    		Ext.getCmp('currency-DBM7').setValue(currency);
    		
    		var ref_quan = record.get('ref_quan');
    		//console_logs('ref_quan', ref_quan);
    		if(ref_quan>1) {
    			this.readOnlyPartForm(true);
    			Ext.getCmp('isUpdateSpec-DBM7').setValue('false');
    		} else {
    			this.readOnlyPartForm(false);
    			this.setReadOnlyName('item_code-DBM7', true);
    			this.setReadOnlyName('standard_flag_disp-DBM7', true);
    			Ext.getCmp('isUpdateSpec-DBM7').setValue('true');
    		}

    	},

    	resetPartForm: function() {

    		Ext.getCmp('unique_id-DBM7').setValue( '');
    		Ext.getCmp('unique_uid-DBM7').setValue( '');
    		Ext.getCmp('item_code-DBM7').setValue( '');
    		Ext.getCmp('item_name-DBM7').setValue( '');
    		Ext.getCmp('specification-DBM7').setValue('');
    		Ext.getCmp('standard_flag-DBM7').setValue('');
    		Ext.getCmp('standard_flag_disp-DBM7').setValue('');

    		Ext.getCmp('model_no-DBM7').setValue('');
    		Ext.getCmp('description-DBM7').setValue('');
    		Ext.getCmp('pl_no-DBM7').setValue('');
    		Ext.getCmp('comment-DBM7').setValue('');
    		Ext.getCmp('maker_name-DBM7').setValue('');
    		Ext.getCmp('bm_quan-DBM7').setValue('1');
    		Ext.getCmp('unit_code-DBM7').setValue('');
    		Ext.getCmp('sales_price-DBM7').setValue( '0');

    		Ext.getCmp('currency-DBM7').setValue('KRW');
    		Ext.getCmp('unit_code-DBM7').setValue('PC');
    		this.readOnlyPartForm(false);
    	},

    	unselectForm: function(){

    		Ext.getCmp('unique_id-DBM7').setValue('');
    		Ext.getCmp('unique_uid-DBM7').setValue('');
    		Ext.getCmp('item_code-DBM7').setValue('');
    		
    		var cur_val = Ext.getCmp('specification-DBM7').getValue();
    		var cur_standard_flag = Ext.getCmp('standard_flag-DBM7').getValue();
    		
    		if(cur_standard_flag!='O') {
    			Ext.getCmp('specification-DBM7').setValue(cur_val + ' ' + this.CHECK_DUP);		
    		}
    		
    		Ext.getCmp('currency-DBM7').setValue('KRW');
    		
    		this.getPl_no(Ext.getCmp('standard_flag-DBM7').getValue());
    		this.readOnlyPartForm(false);
    	},

    	readOnlyPartForm :function(b) {

    		this.setReadOnlyName('item_code-DBM7', b);
    		this.setReadOnlyName('item_name-DBM7', b);
    		this.setReadOnlyName('specification-DBM7', b);
    		this.setReadOnlyName('standard_flag-DBM7', b);
    		this.setReadOnlyName('standard_flag_disp', b);

    		this.setReadOnlyName('model_no-DBM7', b);
    		this.setReadOnlyName('description-DBM7', b);
    		//this.setReadOnlyName('pl_no', b);
    		this.setReadOnlyName('comment-DBM7', b);
    		this.setReadOnlyName('maker_name-DBM7', b);

    		this.setReadOnlyName('currency-DBM7', b);
    		this.setReadOnlyName('unit_code-DBM7', b);
    		
    		Ext.getCmp('search_information-DBM7').setValue('');
    		
    	},

    	addNewAction: function() {

    		var form = Ext.getCmp('addPartForm-DBM7').getForm();
    	    if(form.isValid()) {
    	    	var val = form.getValues(false);
    	    	
    	    	val['parent'] = this.selectedparent;
    	    	val['ac_uid'] = this.selectedPjUid;
        	    val['pj_code'] = this.selectedPjCode;
        	    val['coord_key2'] = this.order_com_unique;
            	val['assy_name'] = this.selectedAssyName;
                val['pj_name'] = this.selectedPjName;
    	    	
    	    	
  				 Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=createNew',
					params : val,
				    method: 'POST',
				    success : function() {
           			
           			gMain.selPanel.store.load(function(records){
           				gMain.selPanel.unselectForm();
           				gMain.selPanel.setChildQuan(records.length);
           				gMain.selPanel.resetPartForm();
           			});
           			           			
           		},
	               failure: function (result, op)  {
	            	   var jsonData = Ext.util.JSON.decode(result.responseText);
	                   var resultMessage = jsonData.data.result;
	            	   Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function() {});
	               	
	               }
	        	 });   	

    	    }
    	},

    	searchAction : Ext.create('Ext.Action', {
    		itemId: 'searchButton',
    		iconCls: 'af-search',
    	    text: '새로 고침',
    	    disabled: false ,
    	    handler: function ()
    	    {
    	    	gMain.selPanel.myCartStore.load(function() {});
    	    }
    	}),


    	Item_code_dash: function(item_code){
    			return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
    					item_code.substring(9, 12);
    	},

    	getColName: function (key) {
    		return gMain.getColNameByField(this.fields, key);
    	},

    	getTextName: function (key) {
    		return gMain.getColNameByField(this.fields, key);
    	},
    	
    	
    	materialClassStore : new Ext.create('Ext.data.Store', {

    		fields:[     
    		        { name: 'class_code', type: "string"  }
    		        ,{ name: 'class_name', type: "string" }
    		        ,{ name: 'level', type: "string"  } 
    	    ],
    		sorters: [{
    	        property: 'display_order',
    	        direction: 'ASC'
    	    }],
    	    proxy: {
    	    	type: 'ajax',
    	    	url: CONTEXT_PATH + '/design/class.do?method=read',
    	    	reader: {
    	    		type:'json',
    	    		root: 'datas',
    	    		totalProperty: 'count',
    	    		successProperty: 'success'
    	    	},
    	    	extraParams : {
    	    		level: '2',
    	    		parent_class_code: ''
    	    	}
    	    	,autoLoad: true
    	    }
    	}),
    	fieldPohistory : [],
    	columnPohistory : [],
    	tooltipPohistory : [],
    	selectedFolderName : 'Assembly를 선택하세요.',
    	treeSelectHandler: function(record) {
    		console_logs('treeSelectHandler record', record);
    		// rec.get('leaf'); // 이렇게 데이터 가져올 수 있음
    		this.selectedAssyRecord = record;
//    		console_logs('record', record);
    		//Pat Form 초기화
    		this.resetPartForm();
    		Ext.getCmp('addPartForm-DBM7').getForm().reset();
    		var name = record.data.text;
    		var id = record.data.id;
    		var depth = record.data.depth;
//    		var leaf = record.data.leaf;
    		
    		this.selectedPjQuan= record.raw.pj_quan;
    		this.selectedAssyQuan= record.raw.bm_quan;
    		this.selectedMakingQuan = this.selectedPjQuan*this.selectedAssyQuan;

    		this.setProjectQuan(this.selectedPjQuan);
    		this.setAssyQuan(this.selectedAssyQuan);
    		this.setMaking_quan(this.selectedMakingQuan);
    		
    		var context = record.data.context;
    		
    		//var arr = name.split(']');
    		
    		this.selectedFolderName = record.data.folder;
    		this.selectedAssyName = record.data.assy_name;
    		this.selectedAssyDepth = depth;
    		this.selectedAssyCode = record.data.assy_code;
//    		//console_logs("assy_code", "(" +assy_code + ")");
//    		var sname = name.split(']');
//    		console_log(sname[1]);
//    		sname = sname[1].split('[');
//    		console_log(sname[0]);
//    		this.selectedAssyName = sname[0];
//    		this.gMain.selPanel.selectedAssyDepth = depth;
    		
    			this.selectedparent = id;
    			//selectedAssyhier_pos = '';
    			console_log('selectedparent='+this.selectedparent);

    			this.assy_pj_code = this.selectedPjCode;
    			
    			this.selectedAssyCode = this.selectedPjCode + '-' + this.selectedAssyCode;			    		
    			this.store.getProxy().setExtraParam('parent', this.selectedparent);
    			this.store.getProxy().setExtraParam('ac_uid', this.selectedPjUid);
    			
    			
    			if(this.selectedAssyDepth==1) {
    				this.editAssyAction.disable();
    				this.removeAssyAction.disable();
    			} else {
    				this.editAssyAction.enable();
    				this.removeAssyAction.enable();		
    			}
    			
    			
    	    	this.store.load(function(records){
//    	    		gMain.selPanel.insertStockStoreRecord(records);
    	    		gMain.selPanel.routeTitlename = gMain.selPanel.selectedFolderName;
    	    		gMain.selPanel.selectAssy(gMain.selPanel.selectedFolderName, gMain.selPanel.selectedAssyDepth);
    	    		gMain.selPanel.setChildQuan(records.length);

    	    		
    	    		gMain.selPanel.setMakeTable(records);
    	        	//tab select
    				//var tab = Ext.getCmp("main2");
    				//tab.setActiveTab(Ext.getCmp("bomTab"));
    				
    	    		
    	    	});

    	},
    	standard_flag_datas : [],
    	pjTreeGrid: null,
    	expandAllTree: function() {
    		if(this.pjTreeGrid!=null) {
    			this.pjTreeGrid.expandAll();
    		}
    	},
    	isExistMyCart: function(inId) {
    		var bEx = false;//Not Exist
    		this.myCartStore.data.each(function(item, index, totalItems) {
    	        console_logs('item', item);
    	        var uid = item.data['unique_uid'];
    	        console_logs('uid', uid);
    	        console_logs('inId', inId);
    	        if(inId == uid) {
    	        	bEx = true;//Found
    	        }
    	    });
    		
    		return bEx;
    	}


});
