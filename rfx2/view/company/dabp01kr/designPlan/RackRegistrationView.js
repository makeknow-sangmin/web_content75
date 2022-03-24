Ext.define('Rfx2.view.company.dabp01kr.designPlan.RackRegistrationView', {
    extend: 'Rfx2.base.BaseView',
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
		
		this.printBarcodeAction = Ext.create('Ext.Action', {
	       	iconCls: 'barcode',
	       	text: '바코드 출력',
	       	tooltip: '바코드를 출력합니다.',
	       	disabled: true,
	       	handler: function() {		 	
				 	gMain.selPanel.printBarcode();
	       	}
	    });
		
		//grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	rec = selections[0];
                this.printBarcodeAction.enable();
             } else {
            	 this.printBarcodeAction.disable();
             }
        });	
		
		buttonToolbar.insert(6, this.printBarcodeAction);
		
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
          
        this.callParent(arguments);
      //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('orderBy', 'level1');
        this.store.getProxy().setExtraParam('ascDesc', 'ASC');
        this.store.load(function(records){});
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
        		
               	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
               	
               	var uniqueIdArr =[];
               	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var uid =  rec.get('unique_id');  //Product unique_id
            		uniqueIdArr.push('C'+uid);
                }
        		
               	var form = gu.getCmp('formPanel').getForm();
                  	
					form.submit({
                     url : CONTEXT_PATH + '/sales/productStock.do?method=printAutoBarcode',
                     params:{
                    	 barcodes: uniqueIdArr
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
