//자재 관리
Ext.define('Rfx.view.designPlan.ProductMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'product-mgmt-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	//this.setDefComboValue('standard_flag', 'valueField', 'A');
    	
    	/*this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	*/
    	
    	this.addSearchField (
    			{
    				field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '{codeName}'
    					});
		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		this.addSearchField('maker_name');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });
        if(vCompanyReserved4!='SKNH01KR' && vCompanyReserved4 != 'KBTC01KR') {
	        this.addFormWidget('입력항목', {
	     	   tabTitle:"입력항목", 
	     	   	id:	'EPJ2_SEW_LV1',
	            xtype: 'combo',
	            text: '대구분',
	            name: 'level1',
	            storeClass: 'ClaastStorePD',
	            params:{level1: 1, identification_code: "PD"},
	            displayField: "class_name",
	            valueField: "class_code", 
	            innerTpl: "<div>[{class_code}] {class_name}</div>", 
	            listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	var claastlevel2 = Ext.getCmp('EPJ2_SEW_LV2');
		                 	var claastlevel3 = Ext.getCmp('EPJ2_SEW_LV3');
		                 	var claastlevel4 = Ext.getCmp('EPJ2_SEW_LV4');
		                 	
		                 	claastlevel2.clearValue();
		                 	claastlevel2.store.removeAll();
		                 	claastlevel3.clearValue();
		                 	claastlevel3.store.removeAll();
		                 	claastlevel4.clearValue();
		                 	claastlevel4.store.removeAll();
		                 	
		                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
		                 	claastlevel2.store.load();
		                 	gMain.selPanel.reflashClassCode(class_code);
	
			           }
		        },
	            canCreate:   true,
	            canEdit:     true,
	            canView:     true,
	            position: 'center',
	            setNumber:1, 
	            setName:"분류코드", 
	            setCols:2
	        }); 
	        
	        this.addFormWidget('입력항목', {
	      	   tabTitle:"입력항목", 
	      	   	id:	'EPJ2_SEW_LV2',
	             xtype: 'combo',
	             text: '품명구분',
	             name: 'level2',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 2, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>", 
	             listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	var claastlevel3 = Ext.getCmp('EPJ2_SEW_LV3');
		                 	var claastlevel4 = Ext.getCmp('EPJ2_SEW_LV4');
		                 	
		                 	claastlevel3.clearValue();
		                 	claastlevel3.store.removeAll();
		                 	claastlevel4.clearValue();
		                 	claastlevel4.store.removeAll();
		                 	
		                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
		                 	claastlevel3.store.load();
		                 	
		                 	gMain.selPanel.reflashClassCode(class_code);
		                 	
		                 	var class_name = record.get('class_name');
		                 	var target_item_name = gm.me().getInputJust('srcahd|item_name');
		                	target_item_name.setValue(class_name);
	
			           }
		        },
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center',
	             setNumber:1, 
	             setName:"분류코드", 
	             setCols:2
	            	 
	         });        
	        this.addFormWidget('입력항목', {
	      	   tabTitle:"입력항목", 
	      	   	id:	'EPJ2_SEW_LV3',
	             xtype: 'combo',
	             text: 'TYPE구분',
	             name: 'level3',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 3, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>",
	             listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	var claastlevel4 = Ext.getCmp('EPJ2_SEW_LV4');
		                 	
		                 	claastlevel4.clearValue();
		                 	claastlevel4.store.removeAll();
		                 	
		                 	claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
		                 	claastlevel4.store.load();
		                 	
		                 	gMain.selPanel.reflashClassCode(class_code);
		                 	
		                 	var class_name = record.get('class_name');
		                 	var target_specification = gm.me().getInputJust('srcahd|description');
		                	target_specification.setValue(class_name);
	
			           }
		        },
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center',
	             setNumber:1, 
	             setName:"분류코드", 
	             setCols:2
	         });        
	        this.addFormWidget('입력항목', {
	      	   tabTitle:"입력항목",
	      	   	id:	'EPJ2_SEW_LV4',
	             xtype: 'combo',
	             text: '사양구분',
	             name: 'level4',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 4, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>", 
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center',
	             setNumber:1, 
	             setName:"분류코드", 
	             setCols:2,
	             listeners: {
			           select: function (combo, record) {
		                 	console_log('Selected Value : ' + combo.getValue());
		                 	console_logs('record : ', record);
		                 	var class_code = record.get('class_code');
		                 	
		                 	gMain.selPanel.reflashClassCode(class_code);
		                 	
		                 	var class_name = record.get('class_name');
		                 	var target_specification = gm.me().getInputJust('srcahd|specification');
		                 	target_specification.setValue(class_name);
	
			           }
		        }
	         });        
        } else if(vCompanyReserved4 == 'KBTC01KR') {
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV1',
                xtype: 'combo',
                text: gm.getMC('CMD_Product', '제품군'),
                name: 'level1',
                storeClass: 'ClaastStorePD',
                params:{level1: 1, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');
                        var claastlevel2 = Ext.getCmp('EPJ2_SEW_LV2');
                        var claastlevel3 = Ext.getCmp('EPJ2_SEW_LV3');
                        var claastlevel4 = Ext.getCmp('EPJ2_SEW_LV4');
                        var claastlevel5 = Ext.getCmp('EPJ2_SEW_LV5');
                        var claastlevel6 = Ext.getCmp('EPJ2_SEW_LV6');
                        var claastlevel7 = Ext.getCmp('EPJ2_SEW_LV7');
                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel2.clearValue();
                        claastlevel2.store.removeAll();
                        claastlevel3.clearValue();
                        claastlevel3.store.removeAll();
                        claastlevel4.clearValue();
                        claastlevel4.store.removeAll();
                        claastlevel5.clearValue();
                        claastlevel5.store.removeAll();
                        claastlevel6.clearValue();
                        claastlevel6.store.removeAll();
                        claastlevel7.clearValue();
                        claastlevel7.store.removeAll();
                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
                        claastlevel2.store.load();
                        gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(class_code);

                    }
                },
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2
            });

            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV2',
                xtype: 'combo',
                text: '정격출력',
                name: 'level2',
                storeClass: 'ClaastStorePD',
                params:{level1: 2, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        var claastlevel3 = Ext.getCmp('EPJ2_SEW_LV3');
                        var claastlevel4 = Ext.getCmp('EPJ2_SEW_LV4');
                        var claastlevel5 = Ext.getCmp('EPJ2_SEW_LV5');
                        var claastlevel6 = Ext.getCmp('EPJ2_SEW_LV6');
                        var claastlevel7 = Ext.getCmp('EPJ2_SEW_LV7');
                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel3.clearValue();
                        claastlevel3.store.removeAll();
                        claastlevel4.clearValue();
                        claastlevel4.store.removeAll();
                        claastlevel5.clearValue();
                        claastlevel5.store.removeAll();
                        claastlevel6.clearValue();
                        claastlevel6.store.removeAll();
                        claastlevel7.clearValue();
                        claastlevel7.store.removeAll();
                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
                        claastlevel3.store.load();

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);

                    }
                },
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2

            });
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV3',
                xtype: 'combo',
                text: 'Case',
                name: 'level3',
                storeClass: 'ClaastStorePD',
                params:{level1: 3, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        var claastlevel4 = Ext.getCmp('EPJ2_SEW_LV4');
                        var claastlevel5 = Ext.getCmp('EPJ2_SEW_LV5');
                        var claastlevel6 = Ext.getCmp('EPJ2_SEW_LV6');
                        var claastlevel7 = Ext.getCmp('EPJ2_SEW_LV7');
                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel4.clearValue();
                        claastlevel4.store.removeAll();
                        claastlevel5.clearValue();
                        claastlevel5.store.removeAll();
                        claastlevel6.clearValue();
                        claastlevel6.store.removeAll();
                        claastlevel7.clearValue();
                        claastlevel7.store.removeAll();
                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);

                    }
                },
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2
            });
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV4',
                xtype: 'combo',
                text: 'Circuit',
                name: 'level4',
                storeClass: 'ClaastStorePD',
                params:{level1: 4, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2,
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        var claastlevel5 = Ext.getCmp('EPJ2_SEW_LV5');
                        var claastlevel6 = Ext.getCmp('EPJ2_SEW_LV6');
                        var claastlevel7 = Ext.getCmp('EPJ2_SEW_LV7');
                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel5.clearValue();
                        claastlevel5.store.removeAll();
                        claastlevel6.clearValue();
                        claastlevel6.store.removeAll();
                        claastlevel7.clearValue();
                        claastlevel7.store.removeAll();
                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);

                    }
                }
            });
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV5',
                xtype: 'combo',
                text: '전압',
                name: 'level5',
                storeClass: 'ClaastStorePD',
                params:{level1: 5, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2,
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        var claastlevel6 = Ext.getCmp('EPJ2_SEW_LV6');
                        var claastlevel7 = Ext.getCmp('EPJ2_SEW_LV7');
                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel6.clearValue();
                        claastlevel6.store.removeAll();
                        claastlevel7.clearValue();
                        claastlevel7.store.removeAll();
                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);

                    }
                }
            });
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV6',
                xtype: 'combo',
                text: 'TYPE',
                name: 'level6',
                storeClass: 'ClaastStorePD',
                params:{level1: 6, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2,
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        var claastlevel7 = Ext.getCmp('EPJ2_SEW_LV7');
                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel7.clearValue();
                        claastlevel7.store.removeAll();
                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);

                    }
                }
            });
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV7',
                xtype: 'combo',
                text: '연결구분',
                name: 'level7',
                storeClass: 'ClaastStorePD',
                params:{level1: 7, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2,
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        var claastlevel8 = Ext.getCmp('EPJ2_SEW_LV8');

                        claastlevel8.clearValue();
                        claastlevel8.store.removeAll();

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);

                    }
                }
            });
            this.addFormWidget('입력항목', {
                tabTitle:"입력항목",
                id:	'EPJ2_SEW_LV8',
                xtype: 'combo',
                text: '파생번호',
                name: 'level8',
                storeClass: 'ClaastStorePD',
                params:{level1: 8, identification_code: "PD"},
                displayField: "class_code",
                valueField: "class_code",
                innerTpl: "<div>[{class_code}] {class_name}</div>",
                canCreate:   true,
                canEdit:     true,
                canView:     true,
                position: 'center',
                setNumber:1,
                setName:"분류코드",
                setCols:2,
                listeners: {
                    select: function (combo, record) {
                        console_log('Selected Value : ' + combo.getValue());
                        console_logs('record : ', record);
                        var class_code = record.get('class_code');

                        //gMain.selPanel.reflashClassCode(class_code);

                        var target_item_code = gm.me().getInputJust('srcahd|item_code');
                        target_item_code.setValue(target_item_code.getValue() + class_code);
                    }
                }
            });
        }
        
        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Heavy4ProductMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['srcahd']
	        );
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
       
       this.createPoAction = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	 	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '주문카트 ',
			 tooltip: '주문카트 담기',
			 disabled: true,
			 handler: function() {
				 
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 
				 console_logs('selections', selections);
			    if (selections) {
			    	var uids = [];
		        	for(var i=0; i< selections.length; i++) {
		        		var rec = selections[i];
		        		var unique_id = rec.get('unique_id');
		        		uids.push(unique_id);
		        	}
		        	
		        	
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
	            		params: {
	            			srcahd_uids: uids
	            		},
	            		success : function(result, request){
	            			var resultText = result.responseText;

	            			Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
	            			
	            		},
	            		failure: extjsUtil.failureMessage
	            	}); //end of ajax
		        	
			    }
				 
				 
//				 switch(gMain.selPanel.stockviewType) {
//				 case 'ALL':
//					 alert("자재를 먼저 선택해 주세요");
//					 break;
//				 default:
//					 break;
//				 }
			 }
		});
       
       // 출고 버튼
       this.outGoAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 	 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
  			 text: '자재출고 ',
  			 tooltip: '자재출고',
  			 disabled: true,
  			 handler: function() {
  				 
  				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
  				 
  				 console_logs('selections', selections);
  			    if (selections) {
  			    	var uids = [];
  		        	for(var i=0; i< selections.length; i++) {
  		        		var rec = selections[i];
  		        		var unique_id = rec.get('unique_id');
  		        		uids.push(unique_id);
  		        	}
  		        	
  		        	
  	        		Ext.Ajax.request({
  	            		url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
  	            		params: {
  	            			srcahd_uids: uids
  	            		},
  	            		success : function(result, request){
  	            			var resultText = result.responseText;

  	            			Ext.Msg.alert('안내', '자재 출고 완료.', function() {});
  	            			
  	            		},
  	            		failure: extjsUtil.failureMessage
  	            	}); //end of ajax
  		        	
  			    }
  				 
  				 
//  				 switch(gMain.selPanel.stockviewType) {
//  				 case 'ALL':
//  					 alert("자재를 먼저 선택해 주세요");
//  					 break;
//  				 default:
//  					 break;
//  				 }
  			 }
  		});
       
       
    // 바코드 출력 버튼
       this.barcodePrintAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 iconCls: 'barcode',
  			 text: '바코드 출력',
  			 tooltip: '바코드를 바코드 프린터로 출력합니다',
  			 disabled: true,
  			 handler: function() {
  				 
  				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
  				 
  				 console_logs('selections', selections);
  			    if (selections) {
  			    	var uids = [];
  		        	for(var i=0; i< selections.length; i++) {
  		        		var rec = selections[i];
  		        		var unique_id = rec.get('unique_id');
  		        		uids.push(unique_id);
  		        	}
  		        	
  		        	
  	        		Ext.Ajax.request({
  	            		url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
  	            		params: {
  	            			srcahd_uids: uids
  	            		},
  	            		success : function(result, request){
  	            			var resultText = result.responseText;

  	            			Ext.Msg.alert('안내', '자재 출고 완료.', function() {});
  	            			
  	            		},
  	            		failure: extjsUtil.failureMessage
  	            	}); //end of ajax
  		        	
  			    }
  			 }

  		});
       
       
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       switch(vCompanyReserved4){
       case "SWON01KR":
			break;
       case "SKNH01KR":
    	   buttonToolbar.insert(6, this.outGoAction);
	       buttonToolbar.insert(6, this.createPoAction);
    	   buttonToolbar.insert(8, this.barcodePrintAction);
	       buttonToolbar.insert(6, '-');
    		 break;
		default :
		   buttonToolbar.insert(6, this.outGoAction);
	       buttonToolbar.insert(6, this.createPoAction);
	       buttonToolbar.insert(6, '-');
       }

        
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
       	
        	var rec = selections[0];
        	
            if (selections.length) {
          		gMain.selPanel.createPoAction.enable();
   
           		var copy_uid = gm.me().getInputJust('srcahd|copy_uid');

           		if(copy_uid != null) {
                    copy_uid.setValue(rec.get('id'));
                }
             } else {
            	 gMain.selPanel.createPoAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        
        
        switch(vCompanyReserved4){
       	case "SKNH01KR":
       		console_logs('vCompanyReserved4==SKNH01KR', vCompanyReserved4);
       		this.store.getProxy().setExtraParam('sg_code', 'BOM');
    	   break;
        }
        this.store.load(function(records){});
    },
    selectedClassCode: '',
    reflashClassCode : function(o){
    	this.selectedClassCode = o;
    	var target_class_code = gm.me().getInputJust('srcahd|class_code');
		var target_item_code = gm.me().getInputJust('srcahd|item_code');

    	target_class_code.setValue(o);
    	target_item_code.setValue(o);
    	
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

