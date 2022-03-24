Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.purStock.HEAVY5_MyCart', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'my-cart-view',
    
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	//this.addSearchField('unique_id');
    	this.setDefComboValue('standard_flag', 'valueField', 'R');
    	
        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
				case 'pr_quan':
					console_logs('=>check', columnObj);
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                      
                        return value;
                    };
                    break;
            }

        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '전체',
            tooltip: '전체',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                gMain.selPanel.stockviewType = 'ALL';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function(){});
            }
        });


        this.setRawMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '원자재',
            tooltip: '원자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'RAW';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
                gMain.selPanel.store.load(function(){});
            }
        });

		this.setPaintMatView = Ext.create('Ext.Action', {
			xtype : 'button',
			text: 'PAINT자재',
			tooltip: 'PAINT자재 재고',
			//pressed: true,
			toggleGroup: 'stockviewType',
			handler: function() {
				this.matType = 'PNT';
				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
				gMain.selPanel.store.load(function(){});
			}
		});

        this.setSaMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '공구',
            tooltip: '공구 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'SUB';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                gMain.selPanel.store.load(function(){});
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류' : '기타소모품',
            tooltip: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류 재고' : '기타소모품 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function() {
                this.matType = 'MRO';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
                gMain.selPanel.store.load(function(){});
            }
        });
        
    	/*this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	*/
    	
    	/*this.addSearchField (
    			{
    				field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '{codeName}'
    					});*/
    	switch(vCompanyReserved4) {
			case 'KYNL01KR':
                this.addSearchField('item_code');
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'getMycartBySrcahd',
                    tableName: 'srcahd',
                    emptyText: '품명',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'getMycartBySrcahd',
                    tableName: 'srcahd',
                    emptyText: '규격',
                    field_id: 'specification',
                    fieldName: 'specification',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'getMycartBySrcahd',
                    tableName: 'srcahd',
                    emptyText: '제조원',
                    field_id: 'maker_name',
                    fieldName: 'maker_name',
                    params: {
                    }
                });
				break;
			default:
                this.addSearchField('item_code');
                this.addSearchField('item_name');
                this.addSearchField('specification');
                this.addSearchField (
                    {
                        type: 'combo'
                        ,width:175
                        ,field_id: 'supplier_information'
                        ,store: "SupastStore"
                        ,displayField: 'supplier_name'
                        ,valueField: 'supplier_code'
                        ,emptyText: '공급사'
                        ,innerTpl	: '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>'

                    });
		}


		this.addCallback('CHECK_SP_CODE', function(combo, record){
			
			gMain.selPanel.refreshStandard_flag(record);
			
		});
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==3||index==1||index==2) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); 

        
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.MyCartLineSrcahd', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['mycart']
            );
                
            this.store.getProxy().setExtraParam('cart_flag', 'Y');
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


       //구매요청 Action 생성
       this.reReceiveAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '구매 요청',
			 tooltip: '구매 요청',
			 disabled: true,
			 handler: function() {
				 var my_child = new Array();
				 
				 var selections = gm.me().grid.getSelectionModel().getSelection();
				 
				 console_logs('selections', selections);
				 if (selections.length) {
		            	var rec = selections[0];
		            	gMain.selPanel.rec = rec;
		          	    console_logs('rec data------------------구매요청 in', rec);
		          	    uids=[];
		          	    var mycart_uids=[];
		          	    var q=[];
	          	    	var q1=[];
	          	    	var q2=[];
	          	    	var my_child=[];
		          	    for(var i=0;i<selections.length;i++){
		          	    	var o = selections[i];
		          	    	var srcahd_uid = o.get('unique_id');
		          	    	var mycart_uid = o.get('id');
		          	    	var pr_quans = o.get('pr_quan');
		          	    	var child = o.get('child');
		          	    	var item_name = o.get('item_name');
		          	    	var src_currencies = o.get('currency');
		          	    	console_logs('src_currencies------------------', src_currencies);
		          	    	uids.push(srcahd_uid);
		          	    	my_child.push(child);
		          	    	mycart_uids.push(mycart_uid);
		          	    	q.push(pr_quans);
		          	    	q1.push(item_name);
		          	    	q2.push(src_currencies);
		          	    	console_logs('q------------------', q);
		          	    	console_logs('q2------------------', q2);
		          	    	console_logs('uids------------------', uids);
		          	    }
		          
		          	//구매요청시 note 팝업 기능 추가
		          	  
		          	    gm.me().requestform = Ext.create('Ext.form.Panel', {

                            xtype: 'form',
                            // title:'공정 선택',
                            frame: false ,
                            border: false,
                            bodyPadding: 10,
                            region: 'center',
                            layout: 'column',
                            layout: 'form',
                            fieldDefaults: {
                                labelAlign: 'right',
                                msgTarget: 'side'
                            },
                            items: []
						});

                        var height = 130;

                        switch(vCompanyReserved4) {
                            case 'SKNH01KR':
                                gm.me().requestform.add(
                                    {
                                        html: '요구납기를 지정하시고 확인 버튼을 누르시면 구매 요청이 진행 됩니다.',
                                        items : {
                                            fieldLabel: '요구납기',
                                            xtype: 'datefield',
                                            rows: 1,
                                            format: 'Y-m-d',
                                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                            anchor: '100%',
                                            labelWidth: 70,
                                            id: 'request_date',
                                            name: 'request_date',
                                            style: 'width: 100%',
                                            value: new Date()
                                        }
                                    }
                                    );
                                height = 170;
                                break;
                            case 'KWLM01KR':
                                gm.me().requestform.add(
                                    {
                                    xtype: 'combo',
                                    id: 'pj_uid',
									name : 'pj_uid',
									fieldLabel: '호선',
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    store: Ext.create('Mplm.store.PjNameStore', {}),
                                    displayField:   'pj_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'sort_seq', direction: 'ASC' },
                                    typeAhead: false,
                                    // hideLabel: true,
                                    minChars:1,
                                    emptyText: '호선',
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{pj_code}">{pj_name}</div>';
                                        }			                	
                                    },
                                    // listeners: {
                                    //     afterrender: function(t,o) {
                                    //         t.value = t.store.data.items;   
                                    //         Ext.getCmp('reserved_number2').setValue(t.value);
                                    //     }
                                    // }
                                });
                                gm.me().requestform.add(
                                    {
                                        fieldLabel: '청구서명',
                                        xtype: 'textarea',
                                        rows: 4,
                                        anchor: '100%',
                                        name: 'reserved_varcharb',
                                        id:'reserved_varcharb'
                                    }
                                );
                                gm.me().requestform.add(
                                    {
                                    xtype: 'combo',
                                    id: 'reserved_number2',  // 사업부
									name : 'reserved_number2',
									fieldLabel: '사업부',
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    store: Ext.create('Mplm.store.DivisionStore2', {}),
                                    displayField:   'wa_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'sort_seq', direction: 'ASC' },
                                    typeAhead: false,
                                    // hideLabel: true,
                                    emptyText: '사업부(기본값 본사)',
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{wa_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        afterrender: function(t,o) {
                                            t.value = t.store.data.items;   
                                            Ext.getCmp('reserved_number2').setValue(t.value);
                                        }
                                    }
                                 });
                                height = 250;
                                break;
                            default:
                                gm.me().requestform.add(
                                    {
                                        xtype: 'label',
                                        text: '구매요청 하시겠습니까?'
                                    }
                                );
                                break;
                        }

                        						
						var prWin =	Ext.create('Ext.Window', {
                            modal : true,
                            title: '구매요청',
                            width: 300,
                            height: height,
                            items: gm.me().requestform,
                            buttons: [
                                {text: CMD_OK,
                                    //scope:this,
                                    handler:function(){
                                        var reserved_number2 = 
                                        (Ext.getCmp('reserved_number2') == undefined || Ext.getCmp('reserved_number2') == null)
                                        ? null : Ext.getCmp('reserved_number2').getValue();

                                        var request_date = (Ext.getCmp('request_date') == undefined || Ext.getCmp('request_date') == null)
                                            ? null : Ext.getCmp('request_date').getValue();

                                        var reserved_varcharb = null
                                        var pj_uid = null;
                                        var is_bom = null;

                                        if(vCompanyReserved4 != 'KWLM01KR') {
                                            reserved_varcharb = null;
                                        } else {
                                            reserved_varcharb = Ext.getCmp('reserved_varcharb').getValue() == null ? null : Ext.getCmp('reserved_varcharb').getValue();
                                            pj_uid = Ext.getCmp('pj_uid').getValue() == null ? null : Ext.getCmp('pj_uid').getValue();
                                            if(pj_uid != null && pj_uid > 1) {
                                                is_bom = 'BOM';
                                            }
                                        }

                                        if(pr_quans>0){
												Ext.Ajax.request({
				//	            					url: CONTEXT_PATH + '/purchase/prch.do?method=create',
				//	            	        		url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
													url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
													params:{
														mycart_uids:mycart_uids,
														unique_uids: uids,
														child:my_child,
														pr_quan:q,
														src_currencies:q2,
														item_name:q1,
														reserved_number2:reserved_number2,
                                                        request_date: Ext.Date.format(request_date,'Y-m-d H:i:s'),
                                                        reserved_varcharb : reserved_varcharb,
                                                        companyCode:vCompanyReserved4,
                                                        pj_uid:pj_uid,
                                                        type:is_bom
													},
													
													success : function(result, request) { 
														prWin.close();
														gm.me().requestform.close();
														gMain.selPanel.store.load();
														Ext.Msg.alert('안내', '요청하었습니다.', function() {});
														
													},//endofsuccess
													failure: extjsUtil.failureMessage
												});//endofajax
												}else{
													Ext.Msg.alert('다시 입력','요청수량을 입력해주세요.');
												}
                                        

				// 						Ext.MessageBox.show({
				// 						title:'확인',
				// 						msg: '요청 하시겠습니까?',
				// 						buttons: Ext.MessageBox.YESNO,
				// 						fn:  function(result) {
				// 							if(result=='yes') {
				// 								if(pr_quans>0){
				// 								Ext.Ajax.request({
				// //	            					url: CONTEXT_PATH + '/purchase/prch.do?method=create',
				// //	            	        		url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
				// 									url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
				// 									params:{
				// 										mycart_uids:mycart_uids,
				// 										unique_uids: uids,
				// 										child:my_child,
				// 										pr_quan:q,
				// 										src_currencies:q2,
				// 										item_name:q1,
				// 										reserved_number2:reserved_number2
				// 									},
													
				// 									success : function(result, request) { 
				// 										prWin.close();
				// 										gm.me().requestform.close();
				// 										gMain.selPanel.store.load();
				// 										Ext.Msg.alert('안내', '요청하었습니다.', function() {});
														
				// 									},//endofsuccess
				// 									failure: extjsUtil.failureMessage
				// 								});//endofajax
				// 								}else{
				// 									Ext.Msg.alert('다시 입력','요청수량을 입력해주세요.');
				// 								}
												
				// 							}
				// 						},
				// 						//animateTarget: 'mb4',
				// 						icon: Ext.MessageBox.QUESTION
				// 					});

                                        /*if(prWin){
                                            prWin.close();
                                        }*/

                                    }},

                                {text: CMD_CANCEL,
                                    scope:this,
                                    handler:function(){
                                        if(prWin){
                                            prWin.close();
                                        }
                                    }}
                            ]
						});
						prWin.show();
		          	  
// 			    	var prWin =	Ext.create('Ext.Window', {
//                             modal : true,
//                             title: '발주요청',
//                             width: 210,
//                             height: 210,
//                             items: gm.me().requestform,

//                             buttons: [
//                                 {text: CMD_OK,
//                                     //scope:this,
//                                     handler:function(){
// 										//구매요청팝업
// 			    	Ext.MessageBox.show({
// 			            title:'확인',
// 			            msg: '요청 하시겠습니까?',
// 			            buttons: Ext.MessageBox.YESNO,
// 			            fn:  function(result) {
// 	            	        if(result=='yes') {
// 	            	        	if(pr_quans>0){
// 	            	        	Ext.Ajax.request({
// //	            					url: CONTEXT_PATH + '/purchase/prch.do?method=create',
// //	            	        		url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
// 	            					url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
// 	            					params:{
// 	            						mycart_uids:mycart_uids,
// 	            						unique_uids: uids,
// 	            						child:my_child,
// 	            						pr_quan:q,
// 	            						src_currencies:q2,
// 	            						item_name:q1
// 	            					},
	            					
// 	            					success : function(result, request) { 
// 	            						gMain.selPanel.store.load();
// 	            						Ext.Msg.alert('안내', '요청하었습니다.', function() {});
	            						
// 	            					},//endofsuccess
// 	            					failure: extjsUtil.failureMessage
// 	            				});//endofajax
// 	            	        	}else{
// 	            	        		Ext.Msg.alert('다시 입력','요청수량을 입력해주세요.');
// 	            	        	}
	            	        	
// 	            	        }
// 			            },
// 			            //animateTarget: 'mb4',
// 			            icon: Ext.MessageBox.QUESTION
// 			        });
// 									}
// 								}
// 							]
// 					});
		
			    }//endof if selectios
			 }
		});

  		        	
  		        	

       
       //버튼 추가.
      // buttonToolbar.insert(6, this.outGoAction);
       //buttonToolbar.insert(6, this.createPoAction);
       //buttonToolbar.insert(6, '-');
       buttonToolbar.insert(3,'-');
       buttonToolbar.insert(3,this.reReceiveAction);
        if(vCompanyReserved4 == 'KYNL01KR') {
        buttonToolbar.insert(7, this.setSubMatView);
        buttonToolbar.insert(7, this.setSaMatView);

            buttonToolbar.insert(7, this.setPaintMatView);

        buttonToolbar.insert(7, this.setRawMatView);
        buttonToolbar.insert(7, this.setAllMatView);
        }

        this.callParent(arguments);
        
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	gMain.selPanel.rec = rec;
          	    console_logs('rec data------------------', rec);
          	    uids=[];
          	    var q=[];
    	    	var q1=[];
    	    	var q2=[];
    	    	var my_child=[];
          	    for(var i=0;i<selections.length;i++){
          	    	var o = selections[i];
          	    	
          	    	var srcahd_uid = o.get('unique_id');
          	    	var pr_quans = o.get('pr_quan');
          	    	var item_name = o.get('item_name');
          	    	var child = o.get('child');
          	    	uids.push(srcahd_uid);
          	    	q.push(pr_quans);
          	    	q1.push(item_name);
          	    	my_child.push(child);
          	    	console_logs('q------------------', q);
          	    	console_logs('q1------------------', q1);
          	    	console_logs('uids------------------', uids);
          	    }
          	    gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');
          		gMain.selPanel.vSELECTED_item_code = rec.get('item_code');    // 품번
          		gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 품명
           		gMain.selPanel.reReceiveAction.enable();
             } else {

            	 gMain.selPanel.reReceiveAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        this.store.load(function(records){});
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
    refreshStandard_flag: function(record) {
    	console_logs('val', record);
    		var spcode = record.get('systemCode');
    		var s_flag = spcode.substring(0,1);
    		console_logs('spcode', s_flag);
    	
    	
    		var target = this.getInputTarget('standard_flag');
    		target.setValue(s_flag);
    		
        },
        treatPo: function() {
        	var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
        	console_logs('uniqueId>>>', uniqueId);
        	
        	var next = gUtil.getNextday(0);
        	 
        	var request_date = gMain.selPanel.request_date;
        	var form = null;
        	
        	if(uniqueId == undefined || uniqueId < 0){
        		alert("선택된 자재가 없습니다.");
        	}else{
        		this.treatPaperAddPoRoll();
        	}
        },
        editRedord: function(field, rec) {
            console_logs('====> edited field', field);
            console_logs('====> edited record', rec);

            switch (field) {
                case 'pr_quan':
                    this.updateDesinComment(rec);
                    
                    break;
            }
        },
        updateDesinComment: function(rec) {
        	var child = gMain.selPanel.vSELECTED_UNIQUE_ID;
        	var item_name = rec.get('item_name');
        	console_logs('child>>>', child);
            var child = rec.get('child');
            var pr_quan = rec.get('pr_quan');
            var assymap_uid = rec.get('assymap_uid');
            console_logs('====> assymap_uid', assymap_uid);
            
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=updateMyCartQty',
                params: {
                	child: child,
                    assymap_uid:assymap_uid,
                    pr_quan : pr_quan
                },
                success: function(result, request) {

                    var result = result.responseText;
                    //console_logs("", result);
                    gm.me().showToast('결과','[ ' + item_name +' ]'+ ' 의 요청 수량이  '+ pr_quan + ' 으로 변경되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
        },
        treatPaperAddPoRoll: function() {
        	form = Ext.create('Ext.form.Panel', {
        		id: gu.id('formPanel'),
        		 xtype: 'form',
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
 	           items:[{
	            	xtype: 'fieldset',
                title: '마이 카트',
                width : 400,
                height : 400,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                    }
                },
                items: [{
                	fieldLabel: '품번',
                    xtype : 'textfield',
                    id : 'item_code',
                    name : 'item_code',
                    value : gMain.selPanel.vSELECTED_item_code,
                    readOnly: true
                	
                
                	},
                	{
                    	fieldLabel: '품명',
                        xtype : 'textfield',
                        id : 'item_code',
                        name : 'item_code',
                        value : gMain.selPanel.vSELECTED_item_name,
                        readOnly: true
                    	
                    
                    	}
                	
                	]
                
                       
                      
        	
        	}]
        	})
        	
        	 myHeight = 500;
			myWidth = 420;

		prwin = this.prwinopen(form);
        },
        // 구매요청 submit
        prwinopen: function(form) {
        	prWin =	Ext.create('Ext.Window', {
    			modal : true,
            title: '구매요청',
            width: myWidth,
            height: myHeight,	
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(btn){
            		var msg = '구매 요청하시겠습니까?'
            		var myTitle = '구매요청 확인';
            		Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {
                        	if(btn == "yes"){
                        		var form = gu.getCmp('formPanel').getForm();
                            	//var form = gMain.selPanel.up('form').getForm();
                            	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                            	console_logs('po_user_uid>>>>>>>>>>>>>', po_user_uid);
                            	//var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                            	var cartmaparr = [];
                            	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                            	for(var i=0; i< selections.length; i++) {
                            		var rec = selections[i];
                            		var uid = rec.get('id');
                            		console_logs('uid>>>>>>>>>>>>>', uid);
                            		cartmaparr.push(uid);
                            	   	console_logs('cartmaparr>>>>>>>>>>>>>', cartmaparr);
                            	}
                            	if(form.isValid()){	
                                	var val = form.getValues(false);
                                	
                                	console_logs('val', val);
                                	form.submit({
                            			url : CONTEXT_PATH + '/purchase/request.do?method=createheavy',
                            			params:{
                            				sancType : 'YES',
                            				//cartmapUid: catmapuid,
                            				cartmaparr: cartmaparr
                            			},
                            			success: function(val, action){
                            				prWin.close();
                            				gMain.selPanel.store.load(function(){});
                            				
                            			},
                            			failure: function(val, action){
                            				
                            				 prWin.close();
                            				 
                            			}
                            		})
                                	}  // end of formvalid 
                        	}else{
                            	
                            	prWin.close();} // btnIf of end
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
        },
});



