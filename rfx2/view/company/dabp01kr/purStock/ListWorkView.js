//작업지시별 현황

var searchDatetypeStore  = Ext.create('Mplm.store.SearchDatetypeStore', {hasNull: false} );

Ext.define('Rfx2.view.company.dabp01kr.purStock.ListWorkView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-po-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		
    	
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'req_date',
            text:'작업지시일:',
            labelWidth: 70,
            edate: new Date(),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1)
    	});    
    	

		this.addSearchField('po_no');
		this.addSearchField('wa_name');
		this.addSearchField('product_name');

//		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');
//		this.addReadonlyField('user_id');
//		this.addReadonlyField('board_count');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.ListWork', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );

        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        
        //작업지시 수정 기능
        this.editWorkAction = Ext.create('Ext.Action',{
        	 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip:'작업지시서 수정',
            disabled: true,
            
            handler: function(widget, event) {
            	
            	gMain.selPanel.editWorkPaper();
            }
        });
        //버튼 추가.
        // buttonToolbar.insert(1, this.editWorkAction);
        // buttonToolbar.insert(1, '-');
        
        this.callParent(arguments);
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('grid rec', rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //po_no
            	gMain.selPanel.vSELECTED_Item_abst = rec.get('item_abst'); //po_no
            	//console_logs('item_abst', gMain.selPanel.vSELECTED_Item_abst);
            	gMain.selPanel.vSELECTED_reserved_varcharb = rec.get('reserved_varcharb');
            	gMain.selPanel.vSELECTED_project_double3 = rec.get('project_double3');
            	
            	gMain.selPanel.editWorkAction.enable();
            
            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.editWorkAction.disable();
            }
        	
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],
    
    editWorkPaper: function() {
    	
    	
    	var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
    	var next = gUtil.getNextday(0);
    	 
    	var request_date = gMain.selPanel.request_date;
    	var form = null;
    	
    	
    	var jsonStr = gMain.selPanel.vSELECTED_Item_abst;
    	
    	var jsonInfo = JSON.parse(jsonStr);
    	var rollInfo = (jsonInfo.datas[0])['ROLL'];
    	var sheetInfo =(jsonInfo.datas[0])['SHEET'];
    	var pur_type =rollInfo.pur_useYN;
    	if(pur_type =="Y"){
    		pur_type = "ROLL";
    	}else{
    		pur_type = "SHEET";
    	}
    	console_logs('for 전>>>>>>>>>>>>', jsonInfo);
    	console_logs('jsonInfo.data.ROLL>>>>>>>>>>>>', (jsonInfo.datas[0])['ROLL']);
    	console_logs('jsonInfo.data.SHEET>>>>>>>>>>>>', (jsonInfo.datas[0])['SHEET']);
    	console_logs('pur_org_quan', sheetInfo.pur_org_quan);
    	var commonMaker = rollInfo.commonMaker;
    	console_logs('commonMaker', commonMaker);
    	
    	var stock_org_comment1 = null;
    	/*for(var i = 0; i < 5; i++){
    		var stock_org_comment+[i] == rollInfo.stock_org_comment+i;
    		console_logs('person_name: ', rollInfo.stock_org_comment1);
    		
    	};*/
    	
    	
		 if(uniqueId == undefined || uniqueId < 0){
			
			alert('선택된 레코드가 없습니다.');
			 
		 }else {
	    	var pj_uid = uniqueId;
	    	
      	
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
	                title: '수주 정보',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 //fieldStyle: 'width:100%;',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                     labelWidth: 10,
	                     useThousandSeparator: false
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    //msgTarget: 'side',
							    layout: 'hbox',
							    defaults: {
							    	 labelWidth: 50,
							    	//width: 200
							    },
							    items: [{
							    	items: [{
						                xtype:'textfield',
						                fieldLabel: '지종',
						                id: 'orderPaperType',
						                value: rollInfo.commonPaperType,
						                readOnly: true,
						                width: 220
						            }, {
						                xtype:'textfield',
						                fieldLabel: '폭',
						                id: 'ordercomment',
						                name: 'ordercomment',
						                value: rollInfo.commoncomment,
						                readOnly: true,
						                width: 220
						            }]
						        }, {
						            items: [{
						                xtype:'textfield',
						                fieldLabel: '평량',
						                anchor: '100%',
						                id: 'orderdescription',
						                value: rollInfo.commondsecription,
						                readOnly: true,
						                width: 220
						            },{
						                xtype:'textfield',
						                fieldLabel: '장',
						                anchor: '100%',
						                id: 'orderremark',
						                name: 'orderremark',
						                value: rollInfo.commonremark,
						                readOnly: true,
						                width: 220
						            }]
							    },{
						            items: [{
						                xtype:'textfield',
						                fieldLabel: '칼날 Size',
						                anchor: '100%',
						                id: 'orderdescription1',
						                value: gMain.selPanel.vSELECTED_reserved_varcharb +' || ' + gMain.selPanel.vSELECTED_project_double3 +'개',
						                readOnly: true,
						                width: 220
						            },{
						                xtype:'textfield',
						                fieldLabel: '수량',
						                anchor: '100%',
						                id: 'orderquan1',
						                name: 'orderquan1',
						                value: rollInfo.commonquan,
						                readOnly: true,
						                width: 220
						            }]
							    }
							            
							    ]
							}
                      ]
	            },{

	            	xtype: 'fieldset',
	                 title: '재고',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    fieldLabel: '공통 규격',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 150,
							        useThousandSeparator: false
							    },
							    items: [
							            {
							        
							        flex : 1,
							        xtype: 'combo',
				            		//anchor: '100%',
				            		//width : 100,
				            		id: 'commonMaker',
				            		name: 'commonMaker',
				            		store: Ext.create('Mplm.store.SupastStore', {comboType: 'standard'}),
				            		//store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_MAKER'}),  // 제조원
				            		displayField:   'supplier_name',
				            		//valueField: 'unique_id',
				            		emptyText: '제조원',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    value : rollInfo.commonMaker,
				            	    readOnly: true,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{unique_id}">{supplier_name}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	  //var system_code = record.get('system_code');
				            	        	   var system_code = record.get('area_code');
				            	        	   
				            	        	   Ext.getCmp('paperMaker_code').setValue(system_code);
				            	           }
				            	      }
							        
							    },   
							    {
							        xtype: 'hiddenfield',
									id :'commonPaperType_code',
							        name : 'commonPaperType_code',
							        value: rollInfo.commonPaperType_code
								},
								{
							        xtype: 'hiddenfield',
									id :'paperMaker_code',
							        name : 'paperMaker_code',
							        value: rollInfo.commonMaker_code
										},
							    {
							    	fieldLabel: '지종',
			                    	xtype: 'combo',
				            		id: 'commonPaperType',
				            		name: 'commonPaperType',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_PAPER_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '지종',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 1,
				            	    value: rollInfo.commonPaperType,
				            	    readOnly: true,
					            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		//return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      		return '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>';
				            	      	}
				            		},
				            		listeners: {
				            	           select: function (combo, record) {
				            	        	   var system_code = record.get('system_code');
				            	        	   Ext.getCmp('commonPaperType_code').setValue(system_code);
				            	           }
				            	      }
							      
							    },
							    {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'commondsecription',
							        name : 'commondsecription',
							        value: rollInfo.commondsecription,
							        readOnly: true,
							        emptyText : '평량'
							      
							    }
							    ]
							}
                        ]
	               
	            },	
	            
	            
	            {
	            	xtype: 'fieldset',
	                 title: '롤 컷팅',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        anchor: '100%',
							        useThousandSeparator: false
							    },
							    items: [{
							    	
			                    	xtype: 'textfield',
				            		
				            		id: 'stock_type1',
				            		name: 'stock_type1',
				            		value: 'ROLL',
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_comment1',
							        name : 'stock_org_comment1',
							        emptyText : '폭',
							        value : rollInfo.stock_org_comment1
							       /* listeners: {
				                          change: function(field, value) {
				                        	  if(value == null){
				                        		  Ext.getCmp('stock_org_remark1').setValue('');
					                        	  Ext.getCmp('stock_org_quan1').setValue('');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment1').setValue('');
					                        	  Ext.getCmp('stock_aft_remark1').setValue('');
					                        	  Ext.getCmp('stock_aft_quan1').setValue('');
				                        	  }else{
				                        		  Ext.getCmp('stock_org_remark1').setValue('0');
					                        	  Ext.getCmp('stock_org_quan1').setValue('0');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment1').setValue(value);
					                        	  Ext.getCmp('stock_aft_remark1').setValue(gMain.selPanel.vSELECTED_remark);
					                        	  Ext.getCmp('stock_aft_quan1').setValue(gMain.selPanel.vSELECTED_quan);
				                        	  }
				                          }
				                      }*/
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_remark1',
							        name : 'stock_org_remark1',
							        emptyText : '장',
							        value : rollInfo.stock_org_remark1
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_org_quan1', 
							        name : 'stock_org_quan1',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : rollInfo.stock_org_quan1
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'textfield',
				            		id: 'stock_use1',
				            		name: 'stock_use1',
				            		value: '재단 있음',
				            		emptyText: '선택'
							    },{
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_comment1',
							        name : 'stock_aft_comment1',
							        //disabled : true,
							        emptyText : '폭',
							        value : rollInfo.stock_aft_comment1
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_remark1',
							        name : 'stock_aft_remark1',
							        emptyText : '장',
							        value : rollInfo.stock_aft_remark1
							    }, {
							        xtype: 'numberfield',
							        flex : 1,
							        id : 'stock_aft_quan1',
							        name : 'stock_aft_quan1',
							        emptyText : '수량',
							        value : rollInfo.stock_aft_quan1
							    }
							    ]
							},
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	
			                    	xtype: 'textfield',
				            		
				            		id: 'stock_type2',
				            		name: 'stock_type2',
				            		value: 'ROLL',
				            		
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_comment2',
							        name : 'stock_org_comment2',
							        emptyText : '폭',
							        value : rollInfo.stock_org_comment2
							       /* listeners: {
				                          change: function(field, value) {
				                        	  if(value == null){
				                        		  Ext.getCmp('stock_org_remark2').setValue('');
					                        	  Ext.getCmp('stock_org_quan2').setValue('');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment2').setValue('');
					                        	  Ext.getCmp('stock_aft_remark2').setValue('');
					                        	  Ext.getCmp('stock_aft_quan2').setValue('');
				                        	  }else{
				                        		  Ext.getCmp('stock_org_remark2').setValue('0');
					                        	  Ext.getCmp('stock_org_quan2').setValue('0');
					                        	  
					                        	  Ext.getCmp('stock_aft_comment2').setValue(gMain.selPanel.vSELECTED_comment);
					                        	  Ext.getCmp('stock_aft_remark2').setValue(gMain.selPanel.vSELECTED_remark);
					                        	  Ext.getCmp('stock_aft_quan2').setValue(gMain.selPanel.vSELECTED_quan);
					                        	  
					                        	  
				                        	  }
				                        	  
				                          }
				                      }*/
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_remark2',
							        name : 'stock_org_remark2',
							        emptyText : '장',
							        value : rollInfo.stock_org_remark2
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_org_quan2', 
							        name : 'stock_org_quan2',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : rollInfo.stock_org_quan2
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'textfield',
				            		id: 'stock_use2',
				            		name: 'stock_use2',
				            		value: '재단 있음',
				            		emptyText: '선택',
				            		
							    },{
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_comment2',
							        name : 'stock_aft_comment2',
							        //disabled : true,
							        emptyText : '폭',
							        value : rollInfo.stock_aft_comment2
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_remark2',
							        name : 'stock_aft_remark2',
							        emptyText : '장',
							        value : rollInfo.stock_aft_remark2
							    }, {
							        xtype: 'numberfield',
							        flex : 2,
							        id : 'stock_aft_quan2',
							        name : 'stock_aft_quan2',
							        emptyText : '수량',
							        value : rollInfo.stock_aft_quan2
							      
							    }
							    ]
							}
                         ]
	               
	            },{
	            	xtype: 'fieldset',
	                 title: 'Sheet 재단',
	                 boder: true,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     anchor: '100%',
	                     useThousandSeparator: false
	                 },

	                 items :[{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type3',
				            		name: 'stock_type3',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 3,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		value: sheetInfo.stock_type3
				            		/*listeners: {
				            	           select: function (combo, record) {
				            	           	if(record.get('system_code') == 'NO'){
				            	           	 Ext.getCmp('stock_org_remark3').setValue('');
				                        	  Ext.getCmp('stock_org_quan3').setValue('');
				                        	  
				                        	  Ext.getCmp('stock_use3').setValue('선택');
				                        	  Ext.getCmp('stock_aft_comment3').setValue('');
				                        	  Ext.getCmp('stock_aft_remark3').setValue('');
				                        	  Ext.getCmp('stock_aft_quan3').setValue('');
				            	           	}else{
				            	           		//Ext.getCmp('stock_org_remark3').setValue('0');
					                        	//Ext.getCmp('stock_org_quan3').setValue('0');
				            	           		Ext.getCmp('stock_use3').setValue('재단 있음');
					                        	Ext.getCmp('stock_aft_comment3').setValue(gMain.selPanel.vSELECTED_comment);
					                        	Ext.getCmp('stock_aft_remark3').setValue(gMain.selPanel.vSELECTED_remark);
					                        	console_logs('>>>>>>>', gMain.selPanel.vSELECTED_remark);
					                        	Ext.getCmp('stock_aft_quan3').setValue(gMain.selPanel.vSELECTED_quan);
					                        	  
				            	           	}
				            	           }
				            	      }*/
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_comment3',
							        name : 'stock_org_comment3',
							        emptyText : '폭',
							        value: sheetInfo.stock_org_comment3
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_remark3',
							        name : 'stock_org_remark3',
							        emptyText : '장',
							        value: sheetInfo.stock_org_remark3
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_org_quan3', 
							        name : 'stock_org_quan3',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        
							        value: sheetInfo.stock_org_quan3
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use3',
				            		name: 'stock_use3',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'ASC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 3,
				            	    value : sheetInfo.stock_use3,
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
							        flex : 3,
							        id : 'stock_aft_comment3',
							        name : 'stock_aft_comment3',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.stock_aft_comment3
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_remark3',
							        name : 'stock_aft_remark3',
							        emptyText : '장',
							        value : sheetInfo.stock_aft_remark3
							    }, {
							        xtype: 'numberfield',
							        flex : 3,
							        id : 'stock_aft_quan3',
							        name : 'stock_aft_quan3',
							        emptyText : '수량',
							        value : sheetInfo.stock_aft_quan3
							      
							    }
							    ]
							},{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type4',
				            		name: 'stock_type4',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 4,
				            	    value : sheetInfo.stock_type4,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		/*listeners: {
				            	           select: function (combo, record) {
				            	        	   if(record.get('system_code') == 'NO'){
						            	           	 Ext.getCmp('stock_org_remark4').setValue('');
						                        	  Ext.getCmp('stock_org_quan4').setValue('');
						                        	  
						                        	  Ext.getCmp('stock_use4').setValue('선택');
						                        	  Ext.getCmp('stock_aft_comment4').setValue('');
						                        	  Ext.getCmp('stock_aft_remark4').setValue('');
						                        	  Ext.getCmp('stock_aft_quan4').setValue('');
						            	           	}else{
						            	           		//Ext.getCmp('stock_org_remark3').setValue('0');
							                        	//Ext.getCmp('stock_org_quan3').setValue('0');
						            	           		Ext.getCmp('stock_use4').setValue('재단 있음');
							                        	Ext.getCmp('stock_aft_comment4').setValue(gMain.selPanel.vSELECTED_comment);
							                        	Ext.getCmp('stock_aft_remark4').setValue(gMain.selPanel.vSELECTED_remark);
							                        	Ext.getCmp('stock_aft_quan4').setValue(gMain.selPanel.vSELECTED_quan);
							                        	  
						            	           	}
				            	           }
				            	      }*/
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_comment4',
							        name : 'stock_org_comment4',
							        emptyText : '폭',
							        value : sheetInfo.stock_org_comment4
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_remark4',
							        name : 'stock_org_remark4',
							        emptyText : '장',
							        value : sheetInfo.stock_org_remark4
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_org_quan4', 
							        name : 'stock_org_quan4',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : sheetInfo.stock_org_quan4
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use4',
				            		name: 'stock_use4',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 4,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		value : sheetInfo.stock_use4
				            		/*listeners: {
				            	           select: function (combo, record) {
				            	           	var system_code = record.get('system_code');
				            	           	console_logs('systemcode', system_code);
				            	           	if(system_code == 'NO'){
				            	           		var hipon = '없음';
				            	           		Ext.getCmp('stock_aft_comment4').setValue('');
				            	           		Ext.getCmp('stock_aft_remark4').setValue('');
				            	           		Ext.getCmp('stock_aft_quan4').setValue('');
				            	           		
				            	           		
				            	           		
				            	           	}else{
				            	           		Ext.getCmp('stock_aft_comment4').setValue(gMain.selPanel.vSELECTED_comment);
					                        	Ext.getCmp('stock_aft_remark4').setValue(gMain.selPanel.vSELECTED_remark);
					                        	Ext.getCmp('stock_aft_quan4').setValue(gMain.selPanel.vSELECTED_quan);
				            	           	}
				            	           	
				            	           }
				            	      }*/
							    },{
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_comment4',
							        name : 'stock_aft_comment4',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.stock_aft_comment4
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_remark4',
							        name : 'stock_aft_remark4',
							        emptyText : '장',
							        value : sheetInfo.stock_aft_remark4
							    }, {
							        xtype: 'numberfield',
							        flex : 4,
							        id : 'stock_aft_quan4',
							        name : 'stock_aft_quan4',
							        emptyText : '수량',
							        value : sheetInfo.stock_aft_quan4
							      
							    }
							    ]
							},{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'combo',
				            		id: 'stock_type5',
				            		name: 'stock_type5',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_SHEET_TYPE'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		value : sheetInfo.stock_type5
				            		/*listeners: {
				            	           select: function (combo, record) {
				            	        	   if(record.get('system_code') == 'NO'){
						            	           	 Ext.getCmp('stock_org_remark5').setValue('');
						                        	  Ext.getCmp('stock_org_quan5').setValue('');
						                        	  
						                        	  Ext.getCmp('stock_use5').setValue('선택');
						                        	  Ext.getCmp('stock_aft_comment5').setValue('');
						                        	  Ext.getCmp('stock_aft_remark5').setValue('');
						                        	  Ext.getCmp('stock_aft_quan5').setValue('');
						            	           	}else{
						            	           		//Ext.getCmp('stock_org_remark3').setValue('0');
							                        	//Ext.getCmp('stock_org_quan3').setValue('0');
						            	           		Ext.getCmp('stock_use5').setValue('재단 있음');
							                        	Ext.getCmp('stock_aft_comment5').setValue(gMain.selPanel.vSELECTED_comment);
							                        	Ext.getCmp('stock_aft_remark5').setValue(gMain.selPanel.vSELECTED_remark);
							                        	Ext.getCmp('stock_aft_quan5').setValue(gMain.selPanel.vSELECTED_quan);
							                        	  
						            	           	}
				            	           }
				            	      }*/
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_comment5',
							        name : 'stock_org_comment5',
							        emptyText : '폭',
							        value : sheetInfo.stock_org_comment5
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_remark5',
							        name : 'stock_org_remark5',
							        emptyText : '장',
							        value : sheetInfo.stock_org_remark5
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_org_quan5', 
							        name : 'stock_org_quan5',
							        fieldLabel: 'Last',
							        emptyText : '수량',
							        value : sheetInfo.stock_org_quan5
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'stock_use5',
				            		name: 'stock_use5',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		valueField: 'system_code',
				            		emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		/*listeners: {
				            	           select: function (combo, record) {
				            	        	   var system_code = record.get('system_code');
					            	           	console_logs('systemcode', system_code);
					            	           	if(system_code == 'NO'){
					            	           		var hipon = '없음';
					            	           		Ext.getCmp('stock_aft_comment4').setValue('');
					            	           		Ext.getCmp('stock_aft_remark4').setValue('');
					            	           		Ext.getCmp('stock_aft_quan4').setValue('');
					            	           		
					            	           		
					            	           		
					            	           	}else{
					            	           		Ext.getCmp('stock_aft_comment4').setValue(gMain.selPanel.vSELECTED_comment);
						                        	Ext.getCmp('stock_aft_remark4').setValue(gMain.selPanel.vSELECTED_remark);
						                        	Ext.getCmp('stock_aft_quan4').setValue(gMain.selPanel.vSELECTED_quan);
					            	           	}
				            	           	
				            	           }
				            	      }*/
							    },{
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_comment5',
							        name : 'stock_aft_comment5',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.stock_aft_comment5
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_remark5',
							        name : 'stock_aft_remark5',
							        emptyText : '장',
							        value : sheetInfo.stock_aft_remark5
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'stock_aft_quan5',
							        name : 'stock_aft_quan5',
							        emptyText : '수량',
							        value : sheetInfo.stock_aft_quan5
							      
							    }
							    ]
							}
                        ]
	               
	            },
	            {

	            	xtype: 'fieldset',
	                 title: '구매 재단규격',
	                 boder: false,
	                 collapsible: true,
	                 margin: '5',
	                 width: '70%',
	                 defaults: {
	                     //anchor: '100%'
	                	 useThousandSeparator: false
	                 },

	                 items :[
							{
							    xtype : 'fieldcontainer',
							    combineErrors: true,
							    msgTarget: 'side',
							    //fieldLabel: '재고 사용',
							    layout: 'hbox',
							    defaults: {
							        hideLabel: true,
							        margin: '0 5 0 0',
							        width: 75,
							        useThousandSeparator: false
							    },
							    items: [{
							    	xtype: 'textfield',
				            		id: 'pur_type',
				            		name: 'pur_type',
				            		editable: false,
				            		value : pur_type
							    },							    
							    {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_comment',
							        name : 'pur_org_comment',
							        emptyText : '폭',
							        value : sheetInfo.pur_comment,
							        readOnly: true
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_remark',
							        name : 'pur_org_remark',
							        emptyText : '장',
							        value : sheetInfo.pur_remark,
							        readOnly: true
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_org_quan', 
							        name : 'pur_org_quan',
							        value : sheetInfo.pur_org_quan,
							        emptyText : '수량',
							        readOnly: true
							      
							    },{
							    	xtype : 'label',
							    	text: '-->',
							    		width :20
							    },{
							    	xtype: 'combo',
				            		id: 'pur_use',
				            		name: 'pur_use',
				            		store: Ext.create('Rfx.store.PurCodeStore', {parentCode: 'POP1_ROLL_CUTTING'}),  // 지종 
				            		displayField:   'code_name_kr',
				            		//valueField: 'system_code',
				            		//emptyText: '선택',
				            		sortInfo: { field: 'create_date', direction: 'DESC' },
				            	    typeAhead: false,
				            	    //hideLabel: true,
				            	    minChars: 5,
				            	    value : sheetInfo.pur_use,
				            		listConfig:{
				            			loadingText: '검색중...',
				            	        emptyText: '일치하는 항목 없음.',
				            	      	getInnerTpl: function(){
				            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
				            	      	}
				            		},
				            		/*listeners: {
				            	           select: function (combo, record) {
				            	           	var system_code = record.get('system_code');
				            	           	console_logs('systemcode', system_code);
				            	           	if(system_code == 'N'){
				            	           		Ext.getCmp('pur_aft_comment').setValue('0');
				            	           		Ext.getCmp('pur_aft_comment').setReadOnly(true);
				            	           		
				            	           		Ext.getCmp('pur_aft_remark').setValue('0');
				            	           		Ext.getCmp('pur_aft_remark').setReadOnly(true);
				            	           		
				            	           		Ext.getCmp('pur_aft_quan').setValue(gMain.selPanel.vSELECTED_quan);
				            	           		Ext.getCmp('pur_aft_quan').setReadOnly(true);

				            	           	}else{
				            	           		Ext.getCmp('pur_aft_comment').setValue('');
				            	           		Ext.getCmp('pur_aft_comment').setReadOnly(false);
				            	           		
				            	           		//Ext.getCmp('pur_aft_remark').setValue('0');
				            	           		Ext.getCmp('pur_aft_remark').setReadOnly(false);
				            	           	}
				            	           	
				            	           }
				            	      }*/
							    },{
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_comment',
							        name : 'pur_aft_comment',
							        //disabled : true,
							        emptyText : '폭',
							        value : sheetInfo.pur_aft_comment,
							        //readOnly: true
							       
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_remark',
							        name : 'pur_aft_remark',
							        emptyText : '장',
							        value : sheetInfo.pur_aft_remark
							        //readOnly: true
							    }, {
							        xtype: 'numberfield',
							        flex : 5,
							        id : 'pur_aft_quan',
							        name : 'pur_aft_quan',
							        emptyText : '수량',
							        value : sheetInfo.pur_aft_quan,
							        editable: true
							      
							    }
							    ]
							}
	                     ]
	            }
	            ] // items
	                    });//Panel end...
  				    myHeight = 540;
					myWidth = 750;

				prwin = this.prwinopen(form);
			
		 } // uniqueId if end
	   
    },
    
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '작업지시 수정',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '수정하시겠습니까?'
        		var myTitle = '주문 수정 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	
                    	if(btn == "no"){
                    		prWin.close();
                    	}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	//var form = gMain.selPanel.up('form').getForm();
                    	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                    	var rtgastuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    	var srcahduid = gMain.selPanel.vSELECTED_srcahduid;
                    	var coord_key1 = gMain.selPanel.vSELECTED_coord_key1;
                    	var coord_key2 = gMain.selPanel.vSELECTED_coord_key2;
                    	var coord_key3 = gMain.selPanel.vSELECTED_coord_key3;
                    	var ac_uid = gMain.selPanel.vSELECTED_PJ_UID;
                    	//var request_date = gMain.selPanel.request_date;
                    	
                    	var pur = '';
                    	var stock1 = '';
                    	var stock2 = '';
                    	var stock3 = '';
                    	var stock4 = '';
                    	var stock5 = '';
                    	
                    	var purUid = '';
                    	var stock1Uid = '';
                    	var stock2Uid = '';
                    	var stock3Uid = '';
                    	var stock4Uid = '';
                    	var stock5Uid = '';
                    	
                    	var datas = [];
                    	var srcahduids = [];
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	
                    	var check = val['commonPaperType_code'];
                    	
                    	if( check.length < 1 || check == 'undefined'){
                    		alert("지종을 다시 선택해주세요");
                    	}else{
                    	
                    	console_logs('val', val);
                    	
                    	var supplierinfo = val['supplier_information'];
                    	var comment = val['comment'];
                    	
                    	/*if(makercode.length < 1){
                    		makercode = 
                    	}*/
                    	/*if(supplierinfo.length < 1 || supplierinfo == 'undefined'){
                    		comment = '0000';
                    	}*/
                    	//pur = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['description'], val['comment'], val['remark']); //공급사, 지종, 평량, 폭, 장
                    	console_logs('1111111111', val);
                    	pur = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['pur_org_comment'], val['pur_org_remark']); //공급사, 지종, 평량, 폭, 장
                    	
                    	stock1 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment1'], val['stock_org_remark1']);
                    	stock2 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment2'], val['stock_org_remark2']);
                    	stock3 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment3'], val['stock_org_remark3']);
                    	stock4 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment4'], val['stock_org_remark4']);
                    	stock5 = gUtil.makeAutoCodePaper(val['paperMaker_code'], val['commonPaperType_code'], val['commondsecription'], val['stock_org_comment5'], val['stock_org_remark5']);
                    	
                    	datas.push(pur);
                    	datas.push(stock1);
                    	datas.push(stock2);
                    	datas.push(stock3);
                    	datas.push(stock4);
                    	datas.push(stock5);
                    	
                    	
                    		Ext.Ajax.request({
                    			url: CONTEXT_PATH + '/purchase/request.do?method=checkitemcode',				
                    			params:{
                    				datas : datas,
                    				rtgastuid: rtgastuid,
                    				srcahduid: srcahduid
                    			},
                    			
                    			success : function(response, request) {
                      					console_logs('response', response);
                      					var rec = Ext.JSON.decode(response.responseText);
                      					//console_logs('rec', rec);
                      					
                      				
                      					srcahduids = rec;
                      					
                      					form.submit({
                                			url : CONTEXT_PATH + '/purchase/request.do?method=editWorkOrder',
                                			params:{
                                				po_user_uid : po_user_uid,
                                				unique_uid: rtgastuid,
                                				coord_key3 : coord_key3,
                                				coord_key2 : coord_key2,
                                				coord_key1 : coord_key1,
                                				sancType : 'YES',
                                				ac_uid: ac_uid,
                                				srcahduids: srcahduids,
                                				srcahduid: srcahduid
                                				
                                			},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.store.load(function(){});
                                				
                                			},
                                			failure: function(val, action){
                                				
                                				 prWin.close();
                                				 
                                			}
                                		})
                      					
                      					
                    			},//Ajax success
                    			failure: function(result, request) {
                      					alert('재고가 없습니다. 그래도 진행하시겠습니까?');
                    			},//Ajax failure
                    		}); 
                    		
                    	}  // end of formvalid
                    	
                    	} // 지종 of end
                    	} // btnIf of end
                   }//fn function(btn)
                    
                });//show
        		
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

