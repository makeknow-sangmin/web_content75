//수주관리 메뉴
Ext.define('Rfx.view.salesDelivery.RecvPoHSGView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'received-mgmt-hsg-view',
    inputBuyer : null,
    initComponent: function(){
    	
    	this.setDefValue('regist_date', new Date());
    	
    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.defOnlyCreate = true;
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');//세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');//목형유형
    	//this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');//목형유형
    	
    	//this.setDefValue('pj_code', 'test');
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	useMultitoolbar = true;
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: gm.getMC('CMD_Order_Date', '등록일자'),
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});	
		
		this.addSearchField (
		{
			type: 'combo'
			,field_id: 'status'
			,store: "RecevedStateStore"
			,displayField: 'codeName'
			,emptyText: '상 태'
			,valueField: 'systemCode'
			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});

		switch(vCompanyReserved4) {
			case 'HSGC01KR':
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'reserved_varchar3',
                    fieldName: 'reserved_varchar3'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'pj_name',
                    fieldName: 'pj_name'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'reserved_varchar2',
                    fieldName: 'reserved_varchar2'
                });
                this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
                    field_id: 'reserved_varchard',
                    fieldName: 'reserved_varchard'
                });
				break;
			default:
            this.addSearchField ({
                type: 'distinct',
                width: 140,
                tableName: 'project',
                field_id: 'reserved_varchar3',
                fieldName: 'reserved_varchar3'
            });
			this.addSearchField ({
				type: 'distinct',
				width: 140,
				tableName: 'combst',
				field_id: 'wa_name',
				fieldName: 'wa_name'
			});
        }
		
		/*this.addSearchField('pm_name');
		this.addSearchField('wa_name');
		this.addSearchField('item_spec'); */
//		this.addSearchField('pj_code');
		
		//Function Callback 정의
		//재고수량 확인
		this.addCallback('CHECK_STOCK', function(o){
			
			//console_logs('CHECK_STOCK o', o);
			
			var target = gMain.selPanel.getInputTarget('stock_qty_useful');
			var target1 = gMain.selPanel.getInputTarget('item_code');
			
			if(target==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'stock_qty_useful'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			if(target1==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'item_code'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			
			var item_code = target1.getValue();
			if(item_code==null || item_code=='') {
				Ext.Msg.alert('안내', '먼저 품번을 입력하세요.'
						, function() {});
				return;
			}
			
			
			
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/sps1.do?method=getUsefulQtyBycode',
				params:{
					item_code: item_code
				},
				
				success : function(result, request) {   	
					var oStr = result.responseText;
					
					var o = Ext.decode(oStr);
                    
                    var stock_qty_useful = 0;
                    var item_name = '';
                    var specification = '';
                    if(o!=null) {
                    	console_logs('/sales/sps1.do o', o);
                        stock_qty_useful = o['stock_qty_useful'];// ==> o.getStock_qty_useful(); o.get('stock_qty_useful');
                        item_name = o['item_name'];
                        specification = o['specification'];
                        
                        //console_logs('item_name', item_name);
                        //console_logs('specification', specification);	
                    }
                    
					gMain.setCrPaneToolbarMsg('사용가능한 재고수량은 ' + stock_qty_useful + '입니다.');
//					console_logs('stockUseful', stockUseful);
//					Ext.Msg.alert('재고수량', '재고수량은 ' + stockUseful + '입니다.'
//							, function() {});
					
					gMain.selPanel.getInputTarget('item_name').setValue(item_name);
					gMain.selPanel.getInputTarget('specification').setValue(specification);
					
					target.setValue(stock_qty_useful);

					var target_quan = gMain.selPanel.getInputTarget('quan');
					var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
					
					var val = target_quan.getValue() - stock_qty_useful;
					if(val<0) {
						val = 0;
					}
					target_bmquan.setValue(val);
					

					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
			

		});
		//재고수량 리셋
		this.addCallback('RESET_STOCK', function(o){
			//console_logs('RESET_STOCK o', o);
			
			var target_useful = gMain.selPanel.getInputTarget('stock_qty_useful');
			target_useful.setValue(0);
		});
		
		//수주번호 자동생성
		this.addCallback('AUTO_PJCODE', function(o){
			
			//console_logs('AUTO_PJCODE o', o);
			
			var target = gMain.selPanel.getInputTarget('pj_code');
			var target1 = gMain.selPanel.getInputTarget('class_code');
			
			if(target==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'pj_code'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			if(target1==null) {
				Ext.Msg.alert('안내', '목적 Widget ' + 'class_code'
						+ '을 찾을 수 없습니다.'
						, function() {});				
			}
			
			if(gMain.selPanel.inputBuyer==null) {
				Ext.Msg.alert('안내', '먼저 고객사를 선택하세요.'
						, function() {});
				return;
			}
			
			if(gMain.selPanel.inputClassCode==null) {
				Ext.Msg.alert('안내', '먼저제품구분을선택하세요.'
						, function() {});
				return;
			}
			
			
			var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
			if(target!=null && wa_code!=null && wa_code.length>2) {
				target.setValue(wa_code.substring(0,1));
			}
						
			//var pj_code = target.getValue();

			var fullYear = gUtil.getFullYear()+'';
			var month = gUtil.getMonth()+'';
			if(month.length==1) {
				month = '0' + month;
			}
			
			console_logs('fullYear', fullYear);
			console_logs('month', month);
			
			console_logs('pj_code', pj_code);
			var pj_code = fullYear.substring(2,4) + month;
			console_logs('pj_code', pj_code);
			
			
			
			//gMain.selPanel.getInputTarget('item_name').setValue('');
			//gMain.selPanel.getInputTarget('specification').setValue('');
			gMain.selPanel.getInputTarget('stock_qty_useful').setValue(0);
			
			//마지막 수주번호 가져오기
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
				params:{
					pj_first: pj_code,
					codeLength: 5
				},
				success : function(result, request) {   	
					var result = result.responseText;
					
					
					console_logs('result', result);
					
					target.setValue(result);
					
					
					//var class_code = gMain.selPanel.inputClassCode.get('class_code');
					//var target2 = gMain.selPanel.getInputTarget('item_code');
					//target2.setValue(result.substring(0,1) + class_code.substring(0,1) +  result.substring(2) + '01');
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
		   
			//마지막 자재번호 가져오기
		   var target2 = gMain.selPanel.getInputTarget('item_code');
		   
		   var class_code = gMain.selPanel.inputClassCode.get('class_code');
		   var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
		   
		   var item_first = wa_code.substring(0,1)+ class_code.substring(0,1);
		   
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
				params:{
					item_first: item_first,
					codeLength: 6
				},
				success : function(result, request) {   	
					var result = result.responseText;
					
					
					console_logs('result 2', result);
					
					target2.setValue(result);
					
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax

		});
		
		//프로젝트 선택, 수주번호 HEAD 만들기
		this.addCallback('GET-CODE-HEAD', function(combo, record){
			
			//console_logs('GET-CODE-HEAD record', record);
			//console_logs('combo', combo);
			
			gMain.selPanel.inputBuyer = record;
			//gMain.selPanel.doReset();
			
			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var wa_code = record.get('wa_code');
			if(target_item_code!=null && wa_code!=null && wa_code.length>2) {
				target_item_code.setValue(wa_code.substring(0,1));
			}
			
			//var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
			//target_bmquan.setValue(0);
			
				
			var address_1 = record.get('address_1');
			var target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
			target_address_1.setValue(address_1);
			
			combo.select(record);
			//gMain.selPanel.computeProduceQty(50000);
		});
		
		this.copyCallback = function() {
			
			var quanW = gMain.selPanel.getInputTarget('quan');
			var bm_quanW = gMain.selPanel.getInputTarget('bm_quan');
			
			//quanW.setValue(0);
			//bm_quanW.setValue(0);
			
			console_logs('copyCallback', '수주 복사등록');
			var target = gMain.selPanel.getInputTarget('pj_code');
			
			var fullYear = gUtil.getFullYear()+'';
			var month = gUtil.getMonth()+'';
			if(month.length==1) {
				month = '0' + month;
			}
			
			console_logs('fullYear', fullYear);
			console_logs('month', month);
			
			console_logs('pj_code', pj_code);
			var pj_code = fullYear.substring(2,4) + month;
			console_logs('pj_code', pj_code);
			
		
			//마지막 수주번호 가져오기
		   Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
				params:{
					pj_first: pj_code,
					codeLength: 5
				},
				success : function(result, request) {   	
					var result = result.responseText;
					
					
					console_logs('result', result);
					
					target.setValue(result);
					
					
					//var class_code = gMain.selPanel.inputClassCode.get('class_code');
					//var target2 = gMain.selPanel.getInputTarget('item_code');
					//target2.setValue(result.substring(0,1) + class_code.substring(0,1) +  result.substring(2) + '01');
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax
		};
		
		
		this.addCallback('GET-SRCAHD-CODE', function(combo, record){
			
			/*Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=getChildList',
				params:{
					srcahd_uid: record.id
				},
				success : function(result, request) {   	
					var result = result.responseText;
					console_logs('result', result);					
					target.setValue(result);
				},//endofsuccess
				failure: extjsUtil.failureMessage
			});//endofajax */
		
			/*gMain.scanagrid.getStore().add(
			        { pl_no: 'A001', class_code:'ACT', item_name: 'ACTUATOR',  bm_quan: '1'},
			        { pl_no: 'A002', class_code:'POW', item_name: 'HYDRAURIC POWER UNIT',  bm_quan: '1'},
			        { pl_no: 'A003', class_code:'CAB', item_name: 'SOL. VALVE CABINET',  bm_quan: '1'},
			        { pl_no: 'A004', class_code:'CON', item_name: 'CONTROL CONSOLE',  bm_quan: '1'},
			        { pl_no: 'A005', class_code:'SPT', item_name: 'SPARE PARTS',  bm_quan: '1'},
			        { pl_no: 'A006', class_code:'LPT', item_name: 'LOOSE PARTS',  bm_quan: '1'}
			);*/
			
			//gMain.scanagrid.getStore().sync();
			
			console_logs('GET-SRCAHD-CODE record', record);
			console_logs('combo', combo);
			
			gMain.selPanel.selectedTemplate = record;

//			var target_item_code = gMain.selPanel.getInputTarget('item_code');
//			var class_code = gMain.selPanel.inputClassCode.get('class_code');
//			target_item_code.setValue(target_item_code.getValue() + class_code.substring(0,1));

		});
		
		
		//재고확인 --> 생산수량 계산
		this.addCallback('CHECK_STOCK_QTY', function(o, cur, prev){
			//console_logs('CHECK_STOCK_QTY cur', cur);
			
			gMain.selPanel.computeProduceQty(cur);
		});
		
		
		
		//판걸이 수량변경
		this.addCallback('CHECK_PAN_QTY', function(o, cur, prev){
			//console_logs('CHECK_PRODUCE_QTY', cur);
			gMain.selPanel.handlerChangePanQty();

		});
		//생산 수량 변경
		this.addCallback('CHECK_PRODUCE_QTY', function(o, cur, prev){
			//console_logs('CHECK_PRODUCE_QTY', cur);
			
			var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan');
			var target_reserved_double3 = gMain.selPanel.getInputTarget('reserved_double3');
			var target_reserved_double4 = gMain.selPanel.getInputTarget('reserved_double4');
			
			var qty = Number(target_bm_quan.getValue()) / Number(target_reserved_double3.getValue());
			target_reserved_double4.setValue(qty);
		});
		this.addCallback('CHECK_PAPER_QTY', function(o, cur, prev){
			
			gMain.selPanel.refreshBmquan(cur);
			
		});

		this.addCallback('CHECK_BLADE_SIZE', function(o, cur, prev){
			console_logs('CHECK_BLADE_SIZE cur', cur);
			gMain.selPanel.refreshBladeInfo();
			gMain.selPanel.refreshBladeInfoAll();
		});

        //redirect
    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
    		if(selectOn==true) {
    			this.propertyPane.setSource(source); // Now load data
    			this.selectedUid = unique_id;
    			gUtil.enable(this.removeAction);
    			gUtil.enable(this.editAction);
    			gUtil.enable(this.copyAction);
    			gUtil.enable(this.viewAction);
    			//gUtil.disable(this.registAction);
    			
    		} else {//not selected
            	this.propertyPane.setSource(source);
            	this.selectedUid = '-1';
            	gUtil.disable(this.removeAction);
            	gUtil.disable(this.editAction);
            	gUtil.disable(this.copyAction);
            	gUtil.disable(this.viewAction);
            	gUtil.enable(this.registAction);
            	this.crudTab.collapse();
    		}

    		console_logs('this.crudMode', this.crudMode);
    		this.setActiveCrudPanel(this.crudMode);
    	};
        
		//Readonly Field 정의 --> 사용하지 않음.
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.RecvPoViewHSGModel', [{
	            property: 'unique_id',
	            direction: 'ASC'
	        }],
	        [100]/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        , {
	        	wa_name: 'combst.wa_name',
	        	wa_code: 'combst.wa_name'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['project']
	     );
        
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            //console_logs('tabpanel newTab', newTab);
            //console_logs('tabpanel newTab newTab.title', newTab.title);
        	
            switch(newTab.title) {
            case '상세정보':
            	console_logs('tab selected', newTab.title);
            	
            	gUtil.enable(gMain.selPanel.createAction);
            	
            	/*if(this.vSELECTED_RECORD!=null) {
                	var bm_quan1 = this.vSELECTED_RECORD.get('bm_quan1');
                	if(bm_quan1!=null) {
                    	if(bm_quan1>0){
                    		gMain.selPanel.refreshReqBom();
                    	}else{
                    		
                    	}                		
                	} */
            		
            	/*}
            	
            	gMain.selPanel.refreshBladeInfoAll();
            	gMain.selPanel.prchHistory(gMain.selPanel.vSELECTED_AC_UID); */
                
                break;
            case '공정설계':
            	gMain.selPanel.refreshProcess();
            	break;
            }
            
            
        };
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
//        arr.push(searchToolbar);

		 //검색툴바 생성
   	if(	useMultitoolbar == true ) {
   		var multiToolbar =  this.createMultiSearchToolbar({first:9, length:11});
   		console_logs('multiToolbar', multiToolbar);
           for(var i=0; i<multiToolbar.length; i++) {
       		arr.push(multiToolbar[i]);
           }
   	} else {
   		var searchToolbar =  this.createSearchToolbar();
   		arr.push(searchToolbar);
   	}
        this.createGrid(arr);
        //작업지시 Action 생성
        /*this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '제작 의뢰',
			 tooltip: '생산 요청',
			 disabled: true,
			 
			 handler: function() {
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 if(selections) {
					 
					var assymap_uids = [];
		    		var rec = selections[0];

		    		var inputItem= [];
		    		
					var lineGap = 30;
					var bHeight = 350;
					
					var is_complished = rec.get('is_complished');
					if(is_complished!='N') {
						 Ext.MessageBox.alert('알림','이미 제작의뢰 되었습니다');
					} else {

						
				    	inputItem.push(
				    	{
							xtype: 'textfield',
							name: 'unique_id',
							fieldLabel: '수주 UID',
							allowBlank:false,
							value: rec.get('unique_id'),
							anchor: '-5',
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						});
				    	inputItem.push(
					    	{
								xtype: 'textfield',
								name: 'reserved_numbere',
								fieldLabel: '제품 UID',
								allowBlank:false,
								value: rec.get('reserved_numbere'),
								anchor: '-5',
								readOnly : true,
								fieldStyle : 'background-color: #ddd; background-image: none;'
							});
				    	inputItem.push({
							xtype: 'textfield',
							name: 'wa_name',
							fieldLabel: '수주업체',
							allowBlank:false,
							value: rec.get('wa_name'),
							anchor: '-5',
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						});
				    	inputItem.push({
							xtype: 'textfield',
							fieldLabel: '수주 번호',
							allowBlank:false,
							value: rec.get('pj_code'),
							anchor: '-5',
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						});
				    	
				    	inputItem.push({
				    		xtype: 'textfield',
		                    fieldLabel: '수주 요약',
							allowBlank:false,
		                    value: rec.get('pj_name'),
							anchor: '-5',
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						});
				    	
				    	inputItem.push({
	                        xtype: 'textarea',
	                        fieldLabel: '요청 내용',
	                        name : 'request_comment',
	                        readOnly : false,
	                        editable:true,
	                        height: 80,
	                        anchor: '-5'
	                    });
			    		
			    		
				    	var form = Ext.create('Ext.form.Panel', {
				    		id: gu.id('formPanel'),
				            defaultType: 'textfield',
				            border: false,
				            bodyPadding: 15,
				            width: 500,
				            height: bHeight,
				            defaults: {
				                // anchor: '100%',
				                editable:false,
				                //allowBlank: false,
				                msgTarget: 'side',
				                labelWidth: 100
				            },
				             items: inputItem
				        });
				

			    	    	var prWin =	Ext.create('Ext.Window', {
			    				modal : true,
			    	        title: '제작  의뢰',
				            width: 500,
				            height: bHeight,
				            minWidth: 250,
				            minHeight: 180,
			    	        
			    	        //height: myHeight,	
			    	        plain:true,
			    	        items: form,
			    	        buttons: [{
			    	            text: CMD_OK,
			    	        	handler: function(){
			    	        		var form = gu.getCmp('formPanel').getForm();
			    	        		console_logs('prWin.items', form);
			    	        		var val = form.getValues(false);
			    	        		console_logs('val', val);
			    	        		gMain.selPanel.doRequest(val);
			    	        		prWin.close();
			    	        	}},{
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
					
				 } else {
					 Ext.MessageBox.alert('알림','선택한 자재가 없습니다.');
				 }
			    	
			 }
		});
        //버튼 추가.
        buttonToolbar.insert(4, this.requestAction);
        buttonToolbar.insert(4, '-');*/
        
        this.setRowClass(function(record, index) {
        	
        	//console_logs('record', record);
            var c = record.get('status');
            //console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	return 'green-row';
            }

        });
        
        //작업지시 Action 생성
       /* this.checkCycleAction = Ext.create('Ext.Action', {
			 iconCls: 'fa-subscript_14_0_5395c4_none',
			 text: '발주 주기',
			 tooltip: '발주주기 확인',
			 disabled: true,
			 
			 handler: function() {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '준비중인기능입니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		}); */
        //버튼 추가.
        buttonToolbar.insert(4, this.checkCycleAction);
        buttonToolbar.insert(4, '-');
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('selections', selections);
//        	this.copyCallback();  	
//        	var processGrid = Ext.getCmp('recvPoPcsGrid');
//        	var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );

            if (selections.length) {
            	
//            	gMain.scanagrid.getStore().removeAll();
//            	gMain.scanagrid.getStore().add(
//    			        { pl_no: 'A001', class_code:'ACT', item_name: 'ACTUATOR',  bm_quan: '1'},
//    			        { pl_no: 'A002', class_code:'POW', item_name: 'HYDRAURIC POWER UNIT',  bm_quan: '1'},
//    			        { pl_no: 'A003', class_code:'CAB', item_name: 'SOL. VALVE CABINET',  bm_quan: '1'},
//    			        { pl_no: 'A004', class_code:'CON', item_name: 'CONTROL CONSOLE',  bm_quan: '1'},
//    			        { pl_no: 'A005', class_code:'SPT', item_name: 'SPARE PARTS',  bm_quan: '1'},
//    			        { pl_no: 'A006', class_code:'LPT', item_name: 'LOOSE PARTS',  bm_quan: '1'}
//    			);
            	
            	var rec = selections[0];
            	console_logs('selections.length', selections.length);
				gUtil.enable(gMain.selPanel.removeAction);
				gUtil.enable(gMain.selPanel.editAction);    
				gUtil.enable(gMain.selPanel.requestAction);
            	
                //gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid'); //assymap의 child
            	//gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); //assymap의 child
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
            	gMain.selPanel.vSELECTED_PJ_CODE = gUtil.stripHighlight(gMain.selPanel.vSELECTED_PJ_CODE); 
                gMain.selPanel.pj_code = gMain.selPanel.vSELECTED_PJ_CODE+"-" ;
    			var status = rec.get('status');
    			
    			//gMain.selPanel.prchHistory(rec.get('ac_uid'));
    			//console_logs('status', status);           
    			//mainmenu.disable();
    			console_logs('activite', gMain.selPanel.vSELECTED_ACTIVITY);
                
            } else {
            	
            	gUtil.disable(gMain.selPanel.removeAction);
				gUtil.disable(gMain.selPanel.editAction);   
				gUtil.disable(gMain.selPanel.requestAction);
                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
            	//gMain.selPanel.requestAction.disable();
            	//mainmenu.enable();
            }
/*        	processGrid.getStore().getProxy().setExtraParam('assymap_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
        	processGrid.getStore().load();*/
        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
		/*this.preCreateCallback = function() {
			console_logs('this.crudMode;', this.crudMode);

	    	if(this.crudMode=='EDIT') { //EDIT
	    		gm.me().doCreateCore();
	    		return true;
	    	} else {//CREATE,COPY
	    		
	    		var target_pj_code = this.getInputTarget('pj_code');
	        	var pj_code = target_pj_code.getValue();
	        	
	        	//var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
	        	//console_log=('pj_code', gMain.selPanel.vSELECTED_PJ_CODE);
	        	console_log('pj_code', target_pj_code.getValue());
	        	
	        	var crudMode = this.crudMode;
	        	Ext.Ajax.request({
	    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
	    			params:{  				pj_code : pj_code  			},
	    			success : function(result, request) {	

	    				//console_logs('-------------------->success', 'success goto doCreate()');
	    				if(result.responseText+''=='0'){
	    					
	                		if(crudMode=='COPY'){// 공정복사
	                			Ext.MessageBox.show({
	        			            title:'확인',
	        			            msg: '복사등록을 위한 공정복사를 진행하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
	        			            buttons: Ext.MessageBox.YESNO,
	        			            fn:  function(result) {
	        	            	        if(result=='yes') {
	        	            	        	Ext.Msg.alert('안내', '복사등록을 위한 공정복사를 진행합니다.',  function() {
	        									Ext.Ajax.request({
	        										url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
	        										params:{
	        											fromUid: gMain.selPanel.vSELECTED_UNIQUE_ID ,
	        											toUid: vCUR_USER_UID*(-100)
	        										},
	        										
	        										success : function(result, request) { 
	        											//console_logs('-------------------->gMain.selPanel.doCreateCore()', result);
	        											gm.me().doCreateCore();
	        											
	        										},// endofsuccess
	        										failure: function(a,b,c,d){console_logs('-----------------a', a), console_log('b', b), console_log('c', c),console_log('d', d)}
	        									});// endofajax
	        								});
	        	            	        }
	        			            },
	        			            //animateTarget: 'mb4',
	        			            icon: Ext.MessageBox.QUESTION
	        			        });
								
	                		} else {
	                			//console_logs('-------------------->else ', '신규등록');
	                			gm.me().doCreateCore();
	                		}
	    				} else {//end of if
	    					failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {})
	    				}
				
	    			},// Ajax success
	    			//failure: function(a,b,c,d){console_logs('a', a), console_log('b', b), console_log('c', c),console_log('d', d)}
	    			 
	    			//failure:Ext.Msg.alert('안내', '알수없는 오류입니다. </br>관리자에게 문의하세요.', function() {})
	    		}); 
	        	console_logs('preCreateCallback', 'return false');
	           	return false;    		
	    	}
		}*/

       /* //공정설계 gridPcsStd Tab 추가.
		gMain.addTabGridPanelSKN('상세정보',  {  
				pageSize: 100,
				model: 'Rfx.model.Partlist',
		        dockedItems: [
			        {
			            dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			            	{
			            		id: this.link + '-' + 'beautiful',
			            		xtype:'tbtext',
			            		text:'테스트'
			            	}
			            ]
				        }
			        ],
					sorters: [{
			           property: 'serial_no',
			           direction: 'ASC'
			       }]
			}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	//console_logs(rec);
	            	gMain.selPanel.selectPcsRecord = rec;
	            } else {
	            	
	            }
	        },
	        'recvPoPcsGrid'//toolbar
		);
		*/
        this.callParent(arguments);
  		this.pcsTemplateStore = Ext.create('Mplm.store.PcsTemplateStore', {} );
        this.pcsTemplateStore.load( function(records) {
			console_logs('pcsTemplateStore', records);
			
			var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );
			
			for(var i=0; i<records.length; i++ ) {	
				var o = records[i];
				var o1 = {
						text: o.get('systemCode') + ' - ' + o.get('codeName'),
						dataIndex: o.get('unique_id'),
						handler: function(o) {
							var selectedTemplate = this['dataIndex'];
							var oTemplate = Ext.getCmp('splitbuttonTemplate' +gMain.selPanel.link);
							
							oTemplate.setText(this['text']);
							oTemplate['selectedTemplate'] = this['dataIndex'];
							
							console_logs('menu this', selectedTemplate);
							
						    Ext.Ajax.request({
								url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
								params:{
									fromUid: selectedTemplate ,
									toUid: gMain.selPanel.vSELECTED_UNIQUE_ID
								},
								
								success : function(result, request) { 
							          //gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
							          var processGrid = Ext.getCmp('recvPoPcsGrid'/*gMain.getGridId()*/);
							          processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
							          processGrid.getStore().load();
									
								},//endofsuccess
								failure: extjsUtil.failureMessage
							});//endofajax
							
						}
				}
				//mainmenu.add(o1);

			}
			
        });

        //디폴트 로딩
        gMain.setCenterLoading(false);
        
//        this.storeLoad = function() {
//            this.store.load(function(records) {
//
//            	for(var i=0; records!=null && i<records.length; i++) {
//            		var rec = records[i];
//            		var class_code = rec.get("class_code");
//            		
//            		var item_name_r1 = rec.get('item_name_r1'); 
//            		var item_name_r2 = rec.get('item_name_r2');
//            		var item_name_u = rec.get('item_name_u');
//
//            		var specification_r1 = rec.get('specification_r1');
//            		var specification_r2 = rec.get('specification_r2');
//            		var specification_u = rec.get('specification_u');
//            		
//            		var description_r1 = rec.get('description_r1');
//            		var description_r2 = rec.get('description_r2');
//            		var description_u = rec.get('description_u');
//            		
//            		var comment_r1 = rec.get('comment_r1');
//            		var comment_r2 = rec.get('comment_r2');
//            		var comment_u = rec.get('comment_u');
//
//            		var remark_r1 = rec.get('remark_r1');
//            		var remark_r2 = rec.get('remark_r2');
//            		var remark_u = rec.get('remark_u');
//            		
//            		var bm_quan_r1 = rec.get('bm_quan_r1');
//            		var bm_quan_r2 = rec.get('bm_quan_r2');
//            		var bm_quan_u = rec.get('bm_quan_u');
//
//            		var request_comment1 = rec.get('request_comment1');
//            		var request_comment2 = rec.get('request_comment2');
//            		var delivery_info = rec.get('delivery_info');
//            		var reserved_varchare = rec.get('reserved_varchare');
//            		var order_com_unique = rec.get('order_com_unique');
//            		
//            		var pm_uid=rec.get('pm_uid');
//            		var req_info1=rec.get('req_info1');
//            		var req_info2=rec.get('req_info2');
//            		
//            		rec.set('item_name|1', item_name_r1);
//            		rec.set('item_name|2', item_name_r2);
//            		rec.set('item_name|3', item_name_u);
//            		
//            		rec.set('specification|1', specification_r1);
//            		rec.set('specification|2', specification_r2);
//            		rec.set('specification|3', specification_u);
//            		
//            		rec.set('description|1', description_r1.replace(/,/gi,""));
//            		rec.set('description|2', description_r2);
//            		rec.set('description|3', description_u);
//            		
//            		rec.set('comment|1', comment_r1.replace(/,/gi,""));
//            		rec.set('comment|2', comment_r2.replace(/,/gi,""));
//            		rec.set('comment|3', comment_u);
//            		
//            		rec.set('remark|1', remark_r1.replace(/,/gi,""));
//            		rec.set('remark|2', remark_r2.replace(/,/gi,""));
//            		rec.set('remark|3', remark_u);
//            		
//            		rec.set('bm_quan|1', bm_quan_r1);
//            		rec.set('bm_quan|2', bm_quan_r2);
//            		rec.set('bm_quan|3', bm_quan_u);
//            		
//            		rec.set('req_info|1', req_info1);
//            		rec.set('req_info|2', req_info2);
//            		
//            		rec.set('request_comment|1', request_comment1);
//            		rec.set('request_comment|2', request_comment2);
//            		
//            		rec.set('delivery_info', delivery_info);
//            		rec.set('reserved_varchare', reserved_varchare);
//            		rec.set('pm_uid', pm_uid);
//            		rec.set('order_com_unique', order_com_unique);
//            		
//            		rec.set('class_code', class_code);
//            		//console_logs('rec', rec);
//            	}
//                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
//                var processGrid = Ext.getCmp('recvPoPcsGrid'/*gMain.getGridId()*/);
//                //processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_UNIQUE_ID);//사용자 UID로 임시생성
//                //processGrid.getStore().load();
//              });
//        };
        
        this.storeLoad();
    },
    
    
    selectPcsRecord: null,
    items : [],
    computeProduceQty: function(cur) {
		//console_logs('computeProduceQty cur', cur);
		var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
		var target_bm_quan = this.getInputTarget('bm_quan');
		
		var val = cur - target_stock_qty_useful.getValue();
		if(val<0) {
			val = 0;
		}
		target_bm_quan.setValue(val);
    },
    
    //구매/제작요청
    doRequest: function(values) {
    	
    	console_logs('values', values);
    	values['big_pcs_code'] = 'PRD';
    	values['parent_code'] = this.link;
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/index/process.do?method=addRequestMakeSkana',
			params:values,
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '의뢰 하였습니다.', function() {});
				
			},//endofsuccess
			
			failure: extjsUtil.failureMessage
		});//endofajax	

    },
    
    /*preCreateCallback: function() {
    	
    	console_logs('crudMode', this.crudMode);
    	if(this.crudMode!='CREATE') {
    		return true;
    	} else {
        	console_log=('pj_code',gMain.selPanel.vSELECTED_PJ_CODE);
        	var pj_code = gMain.selPanel.vSELECTED_PJ_CODE;
           	Ext.Ajax.request({
    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
    			params:{
    				pj_code : pj_code
    			},
    			
    			success : function(result, request) {
                   	projectmold.save({
                		success : function(result, request) {		                			
                			gm.me().doCreateCore();

                		}//success
                	 });//save    					
    				console_log('requested ajax...');
    				this.preCreateCallback = function() {
    					gm.me().doCreateCore();
    					return true;
    				};
    			},//Ajax success
    			//failure: extjsUtil.failureMessage
    			 failure:Ext.Msg.alert('안내', '입력된 수주번호가 중복되었습니다. </br>자동생성버튼을 눌러주세요.', function() {
     				this.preCreateCallback = function() {
     					gm.me().doCreateCore();
    					return true;
    				};
    			 })
    		}); 
           	
           	return false;    		
    	}
    },*/
   /* doReset: function() {
    	gMain.scanagrid.getStore().removeAll();
		//console_logs('reset', gm.me().formItems);
		if(gm.me().formItems!=null) {
			 for(var i=0; i<gm.me().formItems.length; i++) {
				 var form = gm.me().formItems[i];
				 //console_logs('reset', form);
				 form.reset();
			 }	
		}
		 gUtil.disable(gm.me().createAction);
		 gUtil.disable(gm.me().resetAction);
   	
	},*/
    selMode : 'SINGLE',
    selCheckOnly: false,
    selAllowDeselect: true
});