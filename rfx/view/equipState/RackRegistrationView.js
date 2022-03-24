Ext.define('Rfx.view.equipState.RackRegistrationView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'rack-registration-view',
    //items: [{html: 'Rfx.view.criterionInfo.ProductClassificationCodeView'}],
    initComponent: function(){
    	
    	//this.initDefValue();
		
		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('identification_code','valueField', 'RC');
    	
		this.addSearchField (
				{
					//type: 'combo',
					field_id: 'level1'
					,store: 'CommonCodeStore' 
					,displayField: 'codeName'
					,valueField: 'code_name_en'
					,params:{parentCode: 'CLAAST_LEVEL_MAT'}
		    		,innerTpl	: '{codeName}'	
				});
    	
//		this.addSearchField (
//		{
//			type: 'combo',
//			field_id: 'class_code1'
//			,store: 'ClaastStorePD' 
//			,displayField: 'class_name'
//			,valueField: 'class_code'
//			,params:{identification_code: 'MT', level1: 1}
//			,innerTpl	: '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>'
//		});
		
//		this.addSearchField (
//				{
//					type: 'combo',
//					field_id: 'class_code2'
//					,store: 'ClaastStorePD' 
//					,displayField: 'class_name'
//					,valueField: 'class_code'
//					,params:{identification_code: 'MT', level1: 2}
//					,innerTpl	: '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>'
//				});
//
//		this.addSearchField (
//				{
//					type: 'combo',
//					field_id: 'class_code3'
//					,store: 'ClaastStorePD' 
//					,displayField: 'class_name'
//					,valueField: 'class_code'
//					,params:{identification_code: 'MT', level1: 3, parent_class_code: '0A1'}
//					,innerTpl	: '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>'
//				});
		this.addSearchField('class_code');
		this.addSearchField('class_name');
		
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();
		

		// 바코드 프린트
		this.barcodePrintAction = Ext.create('Ext.Action', {
			iconCls: 'barcode',
			text: 'RACK 바코드',
			tooltip: 'RACK 바코드를 출력합니다.',
			disabled: true,
			handler: function() {
				gm.me().printBarcode();
			}
	   });

	   buttonToolbar.insert(6, this.barcodePrintAction);

	   /*
	   this.printBarcodeAction = Ext.create('Ext.Action', {
			iconCls: 'barcode',
			text: '바코드 출력',
			tooltip: '바코드를 출력합니다.',
			disabled: true,
			handler: function() {		 	
			  gMain.selPanel.printBarcode();
			}
		});

		buttonToolbar.insert(6, this.printBarcodeAction);
		*/		
	       this.addCallback('CHECK_CODE', function(o){
	        	var target = gMain.selPanel.getInputTarget('class_code');
	        	
	        	var code = target.getValue();
	        	
	        	var uppercode = code.toUpperCase();
	        	
	        	//if(code == null || code == ""){
	        	if(code.length < 1){
	        		Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function() {});
	        	}else {
	        		
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/admin/stdClass.do?method=checkCode',
	            		params: {
	            			code: code,
	            			identification_code: 'MT'
	            		},
	            		success : function(result, request){
	            			var resultText = result.responseText;
	            			console_logs('uppercode', uppercode)
	            			if(resultText=='0') {
	            				Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
//	            				gMain.selPanel.getInputTarget('checkCode').setValue(uppercode);
	            				target.setValue(uppercode);
	        				}else {
	        					Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
//	        					gMain.selPanel.getInputTarget('checkCode').setValue('');
	        					target.setValue('');
	        				}
	            		},
	            		failure: extjsUtil.failureMessage
	            	}); //end of ajax
	       	}
	        	
	        	
	        });  // end of addCallback
	       
	       
	       switch(vCompanyReserved4){
			case "SWON01KR":   
		        this.addFormWidget('입력항목', {
		       	   tabTitle:"입력항목", 
		       	   	id:	'AMC4_SEW2_LV1',
		              xtype: 'combo',
		              text: '대분류코드',
		              name: 'level1',
		              storeClass: 'ClaastStorePD',
		              params:{level1: 1, identification_code: "MT"},
		              displayField: "class_name",
		              valueField: "class_code", 
		              innerTpl: "<div>[{class_code}] {class_name}</div>", 
		              setNumber:1, 
		              setName:"분류코드", 
		              setCols:2,
		              listeners: {
		  		           select: function (combo, record) {
		  	                 	console_log('Selected Value : ' + combo.getValue());
		  	                 	console_logs('record : ', record);
		  	                 	var class_code = record.get('class_code');
		  	                 	var claastlevel2 = Ext.getCmp('AMC4_SEW2_LV2');
		  	                 	var claastlevel3 = Ext.getCmp('AMC4_SEW2_LV3');
		  	                 	
		  	                 	claastlevel2.clearValue();
		  	                 	claastlevel2.store.removeAll();
		  	                 	claastlevel3.clearValue();
		  	                 	claastlevel3.store.removeAll();
		  	                 	
		  	                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
		  	                 	claastlevel2.store.load();
		  	                 	gMain.selPanel.reflashClassCode(class_code);
		
		  		           }
		  	        },
		              canCreate:   true,
		              canEdit:     true,
		              canView:     true,
		              position: 'center'
		          }); 
		          
		          this.addFormWidget('입력항목', {
		        	   tabTitle:"입력항목", 
		        	   	id:	'AMC4_SEW2_LV2',
		               xtype: 'combo',
		               text: '중분류코드',
		               name: 'level2',
		               storeClass: 'ClaastStorePD',
		               params:{level1: 2, identification_code: "MT"},
		               displayField: "class_name",
		               valueField: "class_code", 
		               innerTpl: "<div>[{class_code}] {class_name}</div>", 
		               setNumber:1, 
		               setName:"분류코드", 
		               setCols:2,
		               listeners: {
		  		           select: function (combo, record) {
		  	                 	console_log('Selected Value : ' + combo.getValue());
		  	                 	console_logs('record : ', record);
		  	                 	var class_code = record.get('class_code');
		  	                 	var claastlevel3 = Ext.getCmp('AMC4_SEW2_LV3');
		  	                 	
		  	                 	claastlevel3.clearValue();
		  	                 	claastlevel3.store.removeAll();
		  	                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
		  	                 	claastlevel3.store.load();
		  	                 	
		  	                 	gMain.selPanel.reflashClassCode(class_code);
		
		  		           }
		  	        },
		               canCreate:   true,
		               canEdit:     true,
		               canView:     true,
		               position: 'center'
		              	 
		           });        
		          this.addFormWidget('입력항목', {
		        	   tabTitle:"입력항목", 
		        	   	id:	'AMC4_SEW2_LV3',
		               xtype: 'combo',
		               text: '소분류코드',
		               name: 'level3',
		               storeClass: 'ClaastStorePD',
		               params:{level1: 3, identification_code: "MT"},
		               displayField: "class_name",
		               valueField: "class_code", 
		               innerTpl: "<div>[{class_code}] {class_name}</div>",
		               setNumber:1, 
		               setName:"분류코드", 
		               setCols:2,
		               listeners: {
		  		           select: function (combo, record) {
		  	                 	console_log('Selected Value : ' + combo.getValue());
		  	                 	console_logs('record : ', record);
		  	                 	var class_code = record.get('class_code');
		  	                 	
		  	                 	
		  	                 	gMain.selPanel.reflashClassCode(class_code);
		
		  		           }
		  	        },
		               canCreate:   true,
		               canEdit:     true,
		               canView:     true,
		               position: 'center'
		           });        
		          break;
	       }
		
        //모델 정의
        this.createStore('Rfx.model.RackRegistration', [{
            property: 'level1',
            direction: 'asc'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['claast']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        var stockMtrlStore = Ext.create('Rfx.store.StockMtrlStore');
		var stockMtrlSubStore = Ext.create('Rfx.store.StockMtrlSubStore');
        stockMtrlStore.getProxy().setExtraParam('stock_pos', 'ND');

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        this.addMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '자재 추가',
            tooltip: 'Rack에 자재를 추가 합니다',
            disabled: false,
            handler: function(widget, event) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=updateStockpos',
                    params:{
                        stoqty_uids: gu.getCmp('stock_pos').value,
                        claast_uid: gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long')
                    },
                    success : function(result, request) {
                        stockMtrlSubStore.load({
                            callback: function(records) {
                                gu.getCmp('valve_quan').update('총수량 : ' + records.length);
                            }
                        });
                    },
                    failure: function(val, action){

                    }
                });
            }
        });

        this.removeMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '자재 삭제',
            tooltip: 'Rack에 자재를 삭제 합니다',
            disabled: false,
            handler: function(widget, event) {
                var stoqty_uids = [];

                var selected_rec = gm.me().gridRackSubList.getSelectionModel().getSelection();

                if(selected_rec != null && selected_rec.length > 0) {
                    for(var i = 0; i < selected_rec.length; i++) {
                        stoqty_uids.push(selected_rec[i].data.id);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/process.do?method=updateStockpos',
                            params:{
                                stoqty_uids: stoqty_uids
                            },
                            success : function(result, request) {
                                stockMtrlSubStore.load({
                                    callback: function(records) {
                                        gu.getCmp('valve_quan').update('총수량 : ' + records.length);
                                    }
                                });
                            },
                            failure: function(val, action){

                            }
                        });
                    }
                }
            }
        });

        this.gridRackSubList = Ext.create('Ext.grid.Panel', {
            title: '재고 리스트',
            store: stockMtrlSubStore,
            // /COOKIE//stateful: true,
            collapsible: true,
            multiSelect: true,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            stateId: 'gridValve' + /* (G) */ vCUR_MENU_CODE,
            //disabled: true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        id: gu.id('stock_pos'),
                        fieldLabel: '재고선택',
                        width: '50%',
                        field_id:  'unique_id_long',
                        allowBlank: true,
                        name: 'stock_pos',
                        xtype: 'combo',
                        emptyText: '자재 검색',
                        anchor: '-5',
                        store: stockMtrlStore,
                        displayField: 'item_code',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        sortInfo: {
                            field: 'item_code',
                            direction: 'ASC'
                        },
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: true,
                        hideTrigger: true,
                        anchor: '100%',
                        valueField: 'unique_id_long',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function() {
                                return '<div><a class="search-item">' +
                                    '<font color=#999><small>{item_code}</small></font> <font color=#333>{item_name}</font><br />' +
                                    '</a></div>';
                            }
                        },
                        pageSize: 10
                    },
                    this.addMtrlAction,
                    this.removeMtrlAction, '->',
                    {
                        xtype: 'component',
                        id: gu.id('valve_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '총수량 : 0'
                    }
                ]
            }

            ],
            columns: [
                {
                    text     : '품목코드',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'item_code'
                },
                {
                    text     : '품명',
                    flex     : 100,
                    sortable : true,
                    dataIndex: 'item_name'
                },
                {
                    text     : '규격',
                    width     : 200,
                    sortable : true,
                    dataIndex: 'specification'
                },
                {
                    text     : '재고위치',
                    width     : 80,
                    sortable : true,
                    dataIndex: 'stock_pos'
                },
            ]
        });
        /*this.gridValve.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gm.me().ongridValveSelection(selections);
            }
        });


*/

		// grid 선택했을 때 callback
        this.setGridOnCallback(function(selections) {
            if(selections.length > 0) {
				this.barcodePrintAction.enable();
				// this.printBarcodeAction.enable();
                stockMtrlSubStore.getProxy().setExtraParam('stock_pos', selections[0].data.class_code);
                stockMtrlSubStore.load({
					callback: function(records) {
                        gu.getCmp('valve_quan').update('총수량 : ' + records.length);
					}
                });
			} else {
				this.barcodePrintAction.disable();
				// this.printBarcodeAction.disable();
			}
        });

        tabPanel.add(this.gridRackSubList);

        this.callParent(arguments);
      //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('orderBy', 'level1');
        this.store.getProxy().setExtraParam('ascDesc', 'ASC');
        this.store.load(function(records){

		});
    },
    
    printBarcode: function() {
    	
    	var form = null;
		
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
	                    labelWidth: 60,
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
	                       {
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '출력매수',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true,
	                           },
	                           items: [
	                               {
	                                   xtype     : 'numberfield',
	                                   name      : 'print_qty',
	                                   fieldLabel: '출력매수',
	                                   margin: '0 5 0 0',
	                                   width: 200,
	                                   allowBlank: false,
	                                   value : 1,
	                                   maxlength: '1',
	                               }  // end of xtype
	                           ]  // end of itmes
	                       }  // end of fieldcontainer
	                    ]
	            }
	   ]
			
	});//Panel end...

       	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
       	var counts = 0;
       	
       	var uniqueIdArr =[];
       	
       	for(var i=0; i< selections.length; i++) {
       		var rec = selections[i];
       		var uid =  rec.get('unique_id');  //Srcahd unique_id
       		uniqueIdArr.push(uid);
        }
       	
       	if(uniqueIdArr.length > 0) {
    		prwin = gMain.selPanel.prbarcodeopen(form);       	
       	}
    },
    
    prbarcodeopen: function(form) {

    	prWin =	Ext.create('Ext.Window', {
		modal : true,
        title: '바코드 출력 매수',
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
        		
				var selections = gm.me().grid.getSelectionModel().getSelection();
				
				var rackUidArr = [];
				var rackNameArr = [];
				var rackCodeArr = [];

				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];
					var rack_uid = rec.get('unique_id_long');
					var rack_name = rec.get('class_name');
					var rack_code = rec.get('class_code');

					rackUidArr.push(rack_uid);
					rackNameArr.push(rack_name);
					rackCodeArr.push(rack_code);
				}

               	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
               	
               	var uniqueIdArr =[];
               	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var uid =  rec.get('unique_id');  //Product unique_id
            		uniqueIdArr.push('C'+uid);
                }
        		
               	var form = gu.getCmp('formPanel').getForm();
				var val = form.getValues(false);
                  	
					form.submit({
					 url : CONTEXT_PATH + '/sales/productStock.do?method=printDataMatrixBarcode',
                    //  url : CONTEXT_PATH + '/sales/productStock.do?method=printAutoBarcode',
                     params:{ 
						// barcodes: uniqueIdArr
						 barcodeUidArr : rackUidArr,
						 print_type : 'RACK',
						 print_qty : val.print_qty,
						 itemNameArr : rackNameArr,
						 itemCodeArr : rackCodeArr
						},
                        	success: function(val, action){
                        		prWin.close();
                        		gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                        		gMain.selPanel.store.load(function(){});
                        	    	},
                       			failure: function(val, action){
                       				 prWin.close();
                       				Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                       				gMain.selPanel.store.load(function(){});
                        			}
            		}); 
    			
        	
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
    },
    
    selectedClassCode: '',
    reflashClassCode : function(o){
    	this.selectedClassCode = o;
    	var target_class_code = gMain.selPanel.getInputTarget('class_code');
    	target_class_code.setValue(o);
    	var target_parent_class_code = gMain.selPanel.getInputTarget('parent_class_code');
    	target_parent_class_code.setValue(o);
    	
    },
    items : []
});
