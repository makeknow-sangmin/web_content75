Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.HEAVY4_PaintPlanView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produceplan-view',
    initComponent: function(){

       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	
		this.addSearchField ('buyer_pj_code');	
		this.addSearchField('paint_spec');
		this.addSearchField('lot_no');

      
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1 | index==3 | index==4) {
            	buttonToolbar.items.remove(item);        		
        	}

        });      
        this.editAction.setText('상세보기');
        // remove the items
        /*(buttonToolbar.items).each(function(item,index,length){
        	if(index==2 | index==3 | index==4) {
            	buttonToolbar.items.remove(item);        		
        	}

        });*/

        //모델 정의
        //this.createStore('Rfx.model.HEAVY4ProducePlan', [{
        this.createStore('Rfx.model.HEAVY4PaintPlan', [{
            property: 'item_code',
            direction: 'DESC'
        }],
        gMain.pageSize/*pageSize*/

    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'a.item_code',
        	unique_id: 'a.unique_id'
        }
    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['cartmap']
        );


        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
       
        //grid 생성.
        this.createGrid(arr, function(){});
        
        this.removeAction.setText('반려');
        //Action Button 이름 변경.
        //this.editAction.setText('계획수립');
       // 
        //this.setEditPanelTitle('계획수립');
        
       
      //Lot 구성 Action 생성
        this.addLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: 'Lot 구성',
			 tooltip: '작업 그룹 구성',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatLotOp();
			 }
		});
        //버튼 추가.
        
        buttonToolbar.insert(2, this.addLotAction);
        buttonToolbar.insert(2, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	this.rtgast_uids = [];
            	for(var i=0; i<selections.length; i++){
            		var rec1 = selections[i];
            		var uids = rec1.get("unique_uid");
            		this.rtgast_uids.push(uids);
            		console_logs('rec1', rec1);
            	}
            	console_logs('그리드온 uid', this.rtgast_uids);
            	
            	var rec = selections[0];
            	
            	console_logs('rec',rec)
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id'); //assymap의 child
            	gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('lot_no'); 
            	gMain.selPanel.addLotAction.enable();
            	
	       		 this.workListStore.getProxy().setExtraParam('po_no', gMain.selPanel.vSELECTED_PO_NO);
	       		 this.workListStore.getProxy().setExtraParam('po_type', 'PND');
	       		 this.workListStore.getProxy().setExtraParam('group_by', 'N');
	       		 this.workListStore.load();
          	
            } else {
            	
            	gMain.selPanel.addLotAction.disable();
            }
        	
        });

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
	

        
        this.addTabworkOrderGridPanel('구분자 목록', 'EPC5_SHNH', {  
			pageSize: 100,
			model: 'Rfx.model.HEAVY4PaintPlanDetail',
//			model: 'Rfx.store.HeavyWorkListStore',
	        dockedItems: [
		     
		        {
		            dock: 'top',
		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
		            cls: 'my-x-toolbar-default3',
		            items: [
//		                    printpdf_min,
//		                    '-',
//		 	   		    	addMinPo
		                    ]
			        }
		        ],
				sorters: [{
		           property: 'serial_no',
		           direction: 'ASC'
		       }]
		}, 
		function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
            	gMain.selPanel.selectPcsRecord = rec;
            	gMain.selPanel.selectSpecification = rec.get('specification');
            	gMain.selPanel.parent = rec.get('parent');
            	
            } else {
            	
            }
        },
        'workOrderGrid'//toolbar
	);
        
        this.callParent(arguments);
        
        //디폴트 로딩
        gMain.setCenterLoading(false);
        /*this.storeLoad = function() {
            this.store.load(function(records) {
            	
              });	
        };*/
        this.grid.getStore().getProxy().setExtraParam('po_type', 'PND');
        
        this.storeLoad();
        
    },
    addTabworkOrderGridPanel: function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	console_logs('records>>>>>>>>>>', records);
		    	if(success ==true) {
		    		this.callBackWorkList(title, records, arg, fc, id);
		    	} else {//endof if(success..
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {

			            }
			        });
		    	}
		    },
		    scope: this
		});	
        	
	},
	
	callBackWorkList: function(title, records, arg, fc, id) {
		var gridId = id== null? this.getGridId() : id;
		
		var o = gMain.parseGridRecord(records, gridId);		
		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		
		var modelClass = arg['model'];
		var pageSize = arg['pageSize'];
		var sorters = arg['sorters'];
		var dockedItems = arg['dockedItems'];
		var model = Ext.create(modelClass, {
        	fields: fields
        });
		/*var workListStore = new Ext.data.Store({  
			pageSize: pageSize,
			model: model,
			sorters: sorters
		});*/
		
		/*var mySorters = [{
	           property: 'p.serial_no',
	           direction: 'ASC'
	       }];*/
		
		//store.getProxy().setExtraParam('sort', JSON.stringify(mySorters));
		
		
		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
		
		 this.workListStore = Ext.create('Mplm.store.PaintPlanDetailStore');
		
		this.workListStore.getProxy().setExtraParam('po_no', gMain.selPanel.vSELECTED_PO_NO);
		this.workListStore.getProxy().setExtraParam('po_type', 'PND');
		this.workListStore.getProxy().setExtraParam('group_by', 'N');
		this.workListStore.load();
		//this.workListStore.getProxy().setExtraParam('pcs_code', 'PNT');
		/*workListStore.load( function(records) {
			console_log('작업리스트>>>>>>>>>>', records); 
			if(records != undefined ) {

                 for (var i=0; i<records.length; i++){ 
	                	var obj = records[i];

	                	var system_code = obj.get('systemCode');
	                	
                   }
			 }
	    });*/
		
		//var workOrderGrid =null;
		
		
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		this.workOrderGrid = Ext.create('Ext.grid.Panel', {
        	//id: gridId,
            store: this.workListStore,
            //store: store,
            title: title,
        	cls : 'rfx-panel',
        	border: true,
        	resizable: true,
        	scroll: true,
        	multiSelect: true,
            collapsible: false,
            layout          :'fit',
            forceFit: false,
            //flex : 1,
            dockedItems: dockedItems,
            plugins: [cellEditing],
        	listeners: {
        		 itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    contextMenu.showAt(e.getXY());
	                    return false;
	                },
	                select: function(selModel, record, index, options){
	                    
	                },
        	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        	
        	     }, //endof itemdblclick
        	     cellkeydown:function (workOrderGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }


 	            }
        	},//endof listeners
            columns: columns
        });
		this.workOrderGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });
        var view = this.workOrderGrid.getView();
        
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function(e) {
                var selectionModel = this.workOrderGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.workOrderGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);
               
            },
            up: function(e) {
                var selectionModel = this.workOrderGrid.getSelectionModel();
                var select = this.workOrderGrid.store.totalCount - 1; // select last element if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.workOrderGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);
             
            }
        });
        
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        
        tabPanel.add(this.workOrderGrid);
	},
    

    selectPcsRecord: null,
    items : [],
    rtgast_uids : [],
    checkname: false,
    
    treatLotOp: function(){
    	var form = null;
		//var checkname = false;
		 form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                labelWidth: 60,
	                margins: 10,
	            },
	            items   : [
	            {
	                xtype: 'fieldset',
	                title: '입력',
	                collapsible: true,
	                defaults: {
	                    labelWidth: 40,
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
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
	                                   id : 'po_no',
	                                   name      : 'po_no',
	                                   fieldLabel: 'LOT 명',
	                                   margin: '0 5 0 0',
	                                   width: 300,
	                                   allowBlank: false,
	                                   maxlength: '1',
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                	  /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
//	                                		   console_logs('입력 제한 >>>>', v);
//	                                		   v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
//	                                	   }*/
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }
	                               },
	                               {
	                            	   id: 'dupCheckButton',
	                                   xtype:'button',
	                                   text: '중복'+CMD_CONFIRM,
	                                   //style : "width : 50px;",
	                                   handler : function(){
	                                	   
	                                	   var po_no = Ext.getCmp('po_no').getValue();
	                                      	
	                                       //중복 코드 체크
	                                       	Ext.Ajax.request({
	                                			url: CONTEXT_PATH + '/index/process.do?method=checkName',				
	                                			params:{
	                                				po_no : po_no
	                                			},
	                                			
	                                			success : function(result, request) {
	                                				var resultText = result.responseText;
	                                				if(resultText=='0') {
	                                					Ext.MessageBox.alert('정상', '사용가능합니다.');
	                                					//alert('사용가능합니다.');
	                                				}else {
	                                					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
	                                					//alert('코드를 확인하세요.');
	                                				}
	                                				gMain.selPanel.checkname = true;
	                                				console_log('resultText', gMain.selPanel.checkname);
	                        
	                                			},//Ajax success
	                                			failure: extjsUtil.failureMessage
	                                		}); 
	                                	   
	                                	   
	                   						
	                                   }//endofhandler
	                                }
	                           ]
	                       },
	            
	                               
	                           ]
	            }
	                   ]
			
	                    });//Panel end...
			myHeight = 120;
			myWidth = 390;
			
			
				prwin = gMain.selPanel.prwinopen(form);
		
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
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gMain.selPanel.checkname);
        		if(gMain.selPanel.checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	var rtgastUids = [];
                    	gMain.selPanel.po_quan = 0;
                    	gMain.selPanel.reserved_double4 = 0;
                    	
                    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid = rec.get('unique_id');
                    		rtgastUids.push(uid);
                    		console_logs('pnt_rec>>>>>>>>', rec);
                    		var po_quan_unit = rec.get('item_quan');
                    		gMain.selPanel.po_quan = gMain.selPanel.po_quan + po_quan_unit;
                    		
                    		var tmp_weight = rec.get('reserved_double4');
                    		gMain.selPanel.reserved_double4 = gMain.selPanel.reserved_double4 + tmp_weight;
                    		
                    	}
                    	
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombinePntLotHeavy',
                             params:{
                            	 				rtgastUids: rtgastUids,
                                				reserved_varchar3: 'PNT',
                                				po_quan : gMain.selPanel.po_quan,
                                				reserved_double4 : gMain.selPanel.reserved_double4,
                                				join_type : 'srcahd'
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.pcstype = 'P';
                                				gMain.selPanel.grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PND');
                                				gMain.selPanel.store.load(function(){});
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
    }
 
});