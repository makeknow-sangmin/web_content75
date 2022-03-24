//Assy 품질관리

Ext.define('Hanaro.view.qualityInfo.ProductTestHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'product-test-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	this.setDefComboValue('standard_flag', 'valueField', 'R');
    	
    	// this.addSearchField (
		// 		{
		// 				field_id: 'standard_flag'
		// 				,store: "StandardFlagStore"
	    // 			    ,displayField:   'code_name_kr'
	    // 			    ,valueField:   'system_code'
		// 				,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
		// });

    	// this.addSearchField (
    	// 		{
    	// 			field_id: 'stock_check'
    	// 			,store: "CodeYnStore"
    	// 			,displayField: 'codeName'
    	// 			,valueField: 'systemCode'
    	// 			,innerTpl	: '{codeName}'
    	// });
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
		
		// 불량입력
		this.defectInputAction = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: '제품불량입력',
			tooltip: '제품 불량입력',
			disabled: true,
			handler: function() {
				var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

				var rec = selections[0];

				if(rec!=null) {
						//gMain.selPanel.returnValue(o);
						gMain.selPanel.treatPcsInfo(rec);
				}
	
			}
		});

        console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.company.hanaro.StockLineHanaroRawAssy', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['stoqty']
			);
		
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

		this.setRawMatView = Ext.create('Ext.Action', {
				xtype : 'button',
				text: '원자재',
				tooltip: '원자재 재고',
			pressed: true,
			toggleGroup: 'stockviewType',
				handler: function() {
					this.matType = 'RAW';
				}
		});
		this.setSubMatView = Ext.create('Ext.Action', {
			xtype : 'button',
				text: '부자재',
				tooltip: '부자재 재고',
			toggleGroup: 'stockviewType',
				handler: function() {
					this.matType = 'SUB';
				}
		});

        

       //버튼 추가.
       buttonToolbar.insert(6, this.defectInputAction);
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==2||index==3||index==4||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
	    });
       
		this.callParent(arguments);
		
		this.setGridOnCallback(function (selections) {
            if (selections.length>0) {
                var rec = selections[0];
                selected_records = selections;
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('uid_srcahd'); //srcahd_uid
                gMain.selPanel.vSELECTED_PO_NO = rec.get('unique_id'); //stoqty_uid
                
                gMain.selPanel.defectInputAction.enable();
            } else {
                gMain.selPanel.defectInputAction.disable();
            }
        });
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],
	matType: 'RAW',

	// returnValue: function(o){
    //     lot_no =  o['popLotNo'];// ==> o.getStock_qty_useful(); o.get('stock_qty_useful');
    //     operator_name = o['operator_name'];
    //     item_code = o[0];
    //     item_name = o[1];
    //     specification = o[2];
	// 	maker_name = o[3];
	// 	model_no = o[4];
	// 	stock_qty = o[5];
	// 	stock_qty_useful = o[6];
		
	// 	console_logs('returnValue_1>',item_code);
	// 	console_logs('returnValue_2>',item_name);
	// 	console_logs('returnValue_3>',specification);
	// 	console_logs('returnValue_4>',maker_name);
	// 	console_logs('returnValue_5>',model_no);
	// 	console_logs('returnValue_6>',stock_qty);
	// 	console_logs('returnValue_7>',stock_qty_useful);
	// },
	treatPcsInfo: function(rec) {
    	//console_logs('treatPcsInfo', operator_name);
    	var form = null;
	    form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanel'),
	    	xtype: 'form',
	    	//xtype: 'form-multicolumn',
	    	frame: true ,
	    	border: false,
	    	bodyPadding: 10,
	    	region: 'center',
	    	layout: 'column',
	        fieldDefaults: {
	        	labelAlign: 'right',
	        	msgTarget: 'side'
	        },
	        defaults: {
	        	layout: 'form',
	            xtype: 'container',
	            defaultType: 'textfield',
	            style: 'width: 50%'
	        },
	        items: [{
	        	xtype: 'fieldset',
	            title: '제품 정보',
	            boder: true,
	            collapsible: true,
	            margin: '5',
	            //fieldStyle: 'width:100%;',
	            width: '100%',
	            defaults: {
	            	anchor: '100%',
	                labelWidth: 10,
	                useThousandSeparator: false
	            },
                 items :[{
                	 xtype : 'fieldcontainer',
					 combineErrors: true,
					 //msgTarget: 'side',
					 layout: 'hbox',
					 defaults: {
					  	 labelWidth: 50,
					 },
					 items: [{
						 items: [{
							 xtype:'textfield',
						     fieldLabel: '품목코드',
						     id: gu.id('pcsPjcode'),
							 value: rec.get('item_code'),
							 fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
						     readOnly: true,
						     width: 270
						  },{
								xtype:'textfield',
								fieldLabel: '품명',
								anchor: '100%',
								id: gu.id('pcsWaname'),
								value: rec.get('item_name'),
								fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
								readOnly: true,
								width: 270
							},
							{
								xtype:'textfield',
								fieldLabel: '재질',
								anchor: '100%',
								id: gu.id('mateiral'),
								value: rec.get('model_no'),
								fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
								readOnly: true,
								width: 270
							}]
					},{
						items: [{
							xtype:'textfield',
							fieldLabel: '규격',
							anchor: '100%',
							id: gu.id('pcsItemname'),
							value: rec.get('specification'),
							fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
							readOnly: true,
							width: 400
						},{
							xtype:'textfield',
						    fieldLabel: '메이커',
						    anchor: '100%',
						    id: gu.id('pcsProjectQuan'),
						    name: 'pcsProjectQuan',
							value: rec.get('maker_name'),
							fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
						    readOnly: true,
						    width: 400
						},{
							xtype:'textfield',
						    fieldLabel: '재고수량',
						    anchor: '100%',
						    id: gu.id('stock_qty'),
						    name: 'stock_qty',
							value: rec.get('stock_qty'),
							fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
						    readOnly: true,
						    width: 400
						}/*,{
							xtype:'textfield',
						    fieldLabel: '안전재고수량',
						    anchor: '100%',
						    id: gu.id('stock_qty_useful'),
						    name: 'stock_qty_useful',
						    value: rec.get('stock_qty_useful'),
						    readOnly: true,
						    width: 400
						}*/]
					}]
                 }]
	        },{
				items:[{
					xtype: 'fieldset',
					title: '불량 입력',
					margin: '5',
					width: '100%',
					//height : 250,
					collapsible: true,
					defaults: {
						anchor: '100%',
						style: 'width: 50%',
						labelWidth: 10,
						useThousandSeparator: false
					},
					layout: 'vbox',
					items : [{
						xtype : 'fieldcontainer',
						layout: 'hbox',
						items :[{
								xtype: 'combo',
								id : gu.id('defect_code1'),
								name : 'defect_code1',
								margin : '5 5 0 15',
								emptyText : '불량원인',
								allowBlank: false, 
								//anchor: '40%',
								width: 250,
								mode: 'local',
								//value: 'supplier_name',
								store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
								displayField:   'code_name_kr',
								valueField: 'system_code',
								sortInfo: { field: 'code_name_kr', direction: 'DESC' },
								typeAhead: false,
								//hideLabel: true,
								minChars: 1,
								fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								listConfig:{
									loadingText: '검색중...',
									emptyText: '일치하는 항목 없음.',
									  getInnerTpl: function(){
										  return '<div data-qtip="{system_code}">{code_name_kr}</div>';
									  }
								},
								listeners: {
									   select: function (combo, record) {
										   
									   }
								  }
							},{
								xtype: 'numberfield',
								id : gu.id('qty1'),
								name : 'qty1',
								margin : '5 0 0 0',
								emptyText : '수량',
								allowBlank: false, 
								minValue: 1,
								maxValue: rec.get('stock_qty'),
								value: 1,
								width: 100,
								fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								listeners: {
									  change: function(field, value) {
										  gMain.selPanel.sumDefectQty();
									  }
								  }
						}]
					}]
				}]	
	        	}] // items
	    	});//Panel end...
	    myHeight = 400;
	    myWidth = 745;
	    prwin = this.prwinopen_defect(form);
    },
	prwinopen_defect: function(form) {
    	prWin =	Ext.create('Ext.Window', {
		modal : true,
        title: '제품불량입력',
        width: myWidth,
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
				if(form.isValid()) {
					var msg = '불량정보를 입력하시겠습니까?'
					var myTitle = '제품불량입력';
					Ext.MessageBox.show({
						title: myTitle,
						msg: msg,
						buttons: Ext.MessageBox.YESNO,
						icon: Ext.MessageBox.QUESTION,
						fn: function(btn) {
							var form = gu.getCmp('formPanel').getForm();
							if(btn == "no"){
								MessageBox.close();
							}else{
							if(form.isValid()){	
							var val = form.getValues(false);
							console_logs('val', val);
							Ext.Ajax.request({
								url: CONTEXT_PATH + '/index/process.do?method=checkDefect',
								params:{
									uid_srcahd : gMain.selPanel.vSELECTED_UNIQUE_ID, // uid_srcahd
									unique_id : gMain.selPanel.vSELECTED_PO_NO, //stoqty_uid
									defect_qty : gMain.selPanel.sumDefectQty(),
									defect_code : gMain.selPanel.sumDefectDetail(),
								},
								success : function(result, request) {
									if(prWin) {
										prWin.close();
									}
									gMain.selPanel.store.load();
								},
								failure: extjsUtil.failureMessage
							});	
							}  // end of formvalid 
						}
					   }//fn function(btn)
					});//show	
				} //endof form valid
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
	sumDefectQty : function(){
        var q1 = gu.getCmp('qty1').getValue();
		var sum = q1;
		return sum;
	},
	selMode: 'SINGLE',
    sumDefectDetail : function() {
        var defect_detail = '';
        var defect_code1 = gu.getCmp('defect_code1').getValue();
        var q1 = gu.getCmp('qty1').getValue();
        if(q1==undefined || q1==null) {
            q1=0;
        } else{
            defect_detail = defect_code1;
        }
        return defect_detail;
    }
});