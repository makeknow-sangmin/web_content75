//자재 관리
Ext.define('Rfx.view.designPlan.MaterialMgmtbuyView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'material-mgmt-buy-view',
    initComponent: function(){
    	this.orderbyAutoTable = false;
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	//this.setDefComboValue('standard_flag', 'valueField', 'R');
    	this.addSearchField('parent_uid_assymap');
 		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
		this.addCallback('GET-SG-CODE', function(combo, record){
			
			// console_logs('GET-CODE-HEAD record', record);
			// console_logs('combo', combo);
			
			gMain.selPanel.inputClassCode = record;

			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var class_code = gMain.selPanel.inputClassCode.get('system_code');
			target_item_code.setValue(target_item_code.getValue() + class_code.substring(0,1)+'-');

		});
		
		
		this.addCallback('GET-CODE-HEAD', function(combo, record){
			
			gMain.selPanel.inputBuyer = record;
			
			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var wa_code = record.get('wa_code');
			if(target_item_code!=null && wa_code!=null && wa_code.length>2) {
				target_item_code.setValue(wa_code.substring(0,1));
			}
			
			// var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
			// target_bmquan.setValue(0);
			
				
			var address_1 = record.get('address_1');
			var target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
			target_address_1.setValue(address_1);
			
			combo.select(record);
		});

		// 품목번호 자동생성
		this.addCallback('AUTO_ITEMCODE', function(o){
			if(this.crudMode=='EDIT') { // EDIT
	    		console_logs('preCreateCallback', 'IN EDIT');
	    	} else {// CREATE,COPY
				// 마지막 자재번호 가져오기
			   var target2 = gMain.selPanel.getInputTarget('item_code');
			   
			   var class_code = gMain.selPanel.inputClassCode.get('system_code');
			   var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
			   
			   var item_first = wa_code.substring(0,1)+ class_code.substring(0,1)+'-';
			   
			   Ext.Ajax.request({
					url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
					params:{
						item_first: item_first,
						codeLength: 3
					},
					success : function(result, request) {   	
						var result = result.responseText;
						
						
						console_logs('result 2', result);
						
						target2.setValue(result);
						
					},// endofsuccess
					failure: extjsUtil.failureMessage
				});// endofajax
	    		
	    		
	    		
	    	}

		});
		
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });
        
        
        // 분류코드로 품번 HEAD 만들기
		this.addCallback('GET-CLASS-CODE', function(combo,record){
			
			console_logs('GET-CLASS-CODE record>>>>>>>>>>>>>>>', record);
			gm.me().inputClassCode = record;
			console_logs('gm.me().inputClassCode>>>>>>>>>>>>>>>', gm.me().inputClassCode);
			var target_item_code = gm.me().getInputJust('srcahd|item_code');


			if(target_item_code!=null) {
				target_item_code.setValue(gm.me().inputSpCode.data.system_code + gm.me().inputClassCode);
			}

			});
		
		this.addCallback('GET-SP-CODE', function(combo, record){
			console_logs('GET-SP-CODE record>>>>>>>>>>>>>>>', record);
			gm.me().inputSpCode = record;
			gm.me().refreshItemCode();
			});
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('MTRL_FLAG_SEW', function(o){
        	console_logs('addCallback_MTRL_FLAG_SEW>>>>>>>>>', o);
        });
        
        
		 this.createStore('Rfx.model.MtrlBuyMgmt', [{
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
       
       //주문작성 Action 생성
       this.createPoAction = Ext.create('Ext.Action', {
           iconCls: 'mfglabs-retweet_14_0_5395c4_none',
           text: '주문 작성',
           tooltip: '주문 작성',
           disabled: true,
           handler: function() {

               //OR17060001
               var fullYear = gUtil.getFullYear() + '';
               var month = gUtil.getMonth() + '';
               if (month.length == 1) {
                   month = '0' + month;
               }

               var first = "OR" + fullYear.substring(2, 4) + month;
               console_logs('first', first);

               // 마지막 수주번호 가져오기
               Ext.Ajax.request({
                   url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                   params: {
                       first: first,
                       codeLength: 4
                   },
                   success: function(result, request) {
                       var po_no = result.responseText;

                       gm.me().treatPo(po_no);

                   }, // endofsuccess
                   failure: extjsUtil.failureMessage
               }); // endofajax


           } //handler end...

       });
       
     //주문작성 Action 생성
       this.catonReleaseAction = Ext.create('Ext.Action', {
           iconCls: 'af-copy',
           text: '카톤 마감',
           tooltip: '카톤 마감',
           disabled: false,
           handler: function() {
               // 카톤 전체 list 이월하기
               Ext.Ajax.request({
                   url: CONTEXT_PATH + '/index/process.do?method=catonReleaseAction',
                   params: {
                	   
                   },
                   success: function(result, request) {


                   }, // endofsuccess
                   failure: extjsUtil.failureMessage
               }); // endofajax


           } //handler end...

       });
       //버튼 추가.
       buttonToolbar.insert(6, this.createPoAction);
       buttonToolbar.insert(6, '-');
       buttonToolbar.insert(7, this.catonReleaseAction);
       //결재사용인 경우 결재 경로 store 생성
       if(this.useRouting==true) {

           this.rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});

       }
       
       this.carton_store = Ext.create('Mplm.store.CatonBuyListStore', {});
       
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
           		gm.me().createPoAction.enable();
           		var scrahd_uids = [];
           		for(var i=0; i<selections.length; i++){
           			var rec = selections[i];
           			scrahd_uids.push(rec.get('unique_id'));
           		}
           		
           		var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                if (month.length == 1) {
                    month = '0' + month;
                }
                gMain.selPanel.yearmont=fullYear+month;
           		this.carton_store.getProxy().setExtraParam('srcahd_uids', scrahd_uids);
           		this.carton_store.getProxy().setExtraParam('parent_uid', fullYear+month);
           		this.carton_store.load(function(records){
           			console_logs('carton_store',records);
           		});
             } else {
            	 gm.me().createPoAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        var fullYear = gUtil.getFullYear() + '';
        var month = gUtil.getMonth() + '';
        if (month.length == 1) {
            month = '0' + month;
        }

        var CurDate = fullYear+ month;
        this.culNextYM(fullYear, month);
        
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        this.store.getProxy().setExtraParam('parent_uid_assymap', CurDate);
        this.store.load(function(records){});
    },
    
    selectedClassCode: '',
    
    reflashClassCode : function(class_code){
    	console_logs('reflashClassCode class_code', class_code);
    	this.selectedClassCode = class_code;
		var target_class_code = gm.me().getInputJust('srcahd|class_code');
		console_logs('target_class_code', target_class_code);
    	target_class_code.setValue(class_code);
    	
    	gm.me().refreshItemCode();
    	
    },
    refreshItemCodeInner : function(sp_code, cuClass_Code) {
    	var target_item_code = gm.me().getInputJust('srcahd|item_code');
    	
    	var item_code_pre = sp_code==null? '' : sp_code;
		if(cuClass_Code!=null && cuClass_Code.length>0) {
			item_code_pre = item_code_pre + cuClass_Code;
		}
    	
    	target_item_code.setValue(item_code_pre);
    	
    },
    
    refreshItemCode : function() {
    	var sp_code = null;
    	
		//console_logs('gm.me().inputSpCode>>>>>>>>>>>>>>>', gm.me().inputSpCode);
    	var o = gm.me().inputSpCode;
    	
    	if(o!=null) {
    		sp_code = o.get('systemCode');
    	} else {
    		var o1 = gm.me().getInputJust('srcahd|sp_code');
    		sp_code = o1.getValue();
    	}

		var target_class_code = gm.me().getInputJust('srcahd|class_code');
		var cuClass_Code = target_class_code.getValue();
		
		this.refreshItemCodeInner(sp_code, cuClass_Code);
		
    },
    
	copyCallback: function() {
		this.refreshItemCode();
	},
    
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
    treatPo: function(po_no) {

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;


        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
            return;
        } else {

            var form = null;
//            var pjArr = [];
//            var supArr = [];
            var assymapUids = [];
            var childs = [];
            var parent_uid=null;
            var notDefinedSup = false;
            
            var price_is_zero = 0;
            var qty_is_zero = 0;


            
            parent_uid= gMain.selPanel.yearmont;
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                
                assymapUids.push(rec.get('assymap_uid'));
                console_logs('srcahd_uid', rec.get('unique_id'));
                childs.push(rec.get('unique_id'));
                console_logs('childs', childs);
                var quan = rec.get('quan');
                var static_sales_price = rec.get('static_sales_price');
                if(quan<0.0000001) {
                	qty_is_zero++;
                }
                if(static_sales_price<0.0000001) {
                	price_is_zero++;
                }
                
            }
            
//            var reserved_number2 = selections[0].get('reserved_number2');

            //중복제거
//            pjArr = gu.removeDupArray(pjArr);
//            supArr = gu.removeDupArray(supArr);
//            console_logs('pjArr', pjArr);
//            console_logs('supArr', supArr);
//            console_logs('assymapUids', assymapUids);

            if(qty_is_zero>0) {
            	Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero +'건 있습니다.', function() {});
            	return;
           }

            
//            if (pjArr.length > 1 && gm.me().canDupProject == false) {
//                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function() {});
//            } 
//            else if (supArr.length > 1 && gm.me().changeSupplier == false) {
//                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function() {});
//            } 
//            else if (notDefinedSup == true && gm.me().changeSupplier == false) {
//                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function() {});
//            } 
            else {
                var next = gUtil.getNextday(0);

//                var total = 0;
//                for (var i = 0; i < selections.length; i++) {
//                    var rec = selections[i];
//                    var total_price = rec.get('sales_price');
//                    total = total + total_price;
//
//                }

                var supplierStore = Ext.create('Mplm.store.SupastStore', {
                    supplierType: gm.me().suplier_type
                });
                
                var this_date = Ext.Date.add (new Date(),Ext.Date.DAY,14);

                this_date = Ext.Date.format(this_date, 'Y-m-d');

                var formItems = [{
                            	xtype: 'fieldset',
                            	title: '주문 내역',
                            	collapsible: false,
                            	width: '100%',
                            	style: 'padding:10px',
                            	defaults: {
                                width: '100%',
                                layout: {
                                    type: 'hbox'
                                }
                            },
                            items: [/*{
                                fieldLabel: '프로젝트',
                                xtype: 'combo',
                                id: gu.id('target_pj_name'),
                                anchor: '100%',
                                name:'pj_name',
//                                store: supplierStore,-partlineStore
                                store: gm.me().partlineStore,
                                displayField: 'pj_name',
                                valueField: 'unique_id',
                                emptyText: '선택',
                                allowBlank: false,
                                sortInfo: {
                                    field: 'pj_code',
                                    direction: 'DESC'
                                },
                                typeAhead: false,
//                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                //hideLabel: true,
                                minChars: 2,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{unique_id}">{pj_code}|{pj_name}</div>';
                                    }
                                }
//                              
//                              xtype: 'textfield',
//                              value: selections[0].get('pj_name'),
//                              fieldStyle: 'background-color: #ddd; background-image: none;'
//                              readOnly: true
                            },*/
                               
                                {
                                    fieldLabel: '요약',
                                    xtype: 'textfield',
                                    name: 'item_abst',
                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                                    readOnly: true
                                }, 
//                                {
//                                    fieldLabel: '합계금액',
//                                    name:'total_price',
//                                    id: gu.id('target_total_price'),
//                                    xtype: 'textfield',
//                                    fieldStyle: 'background-color: #ddd; background-image: none;',
//                                    value: 0,
//                                    readOnly: true
//                                },
                                {
                                    fieldLabel: '주문처',
                                    xtype: 'combo',
                                    id: gu.id('target_supplier'),
                                    anchor: '100%',
                                    name: 'coord_key1',
                                    store: supplierStore,
                                    displayField: 'supplier_name',
                                    valueField: 'unique_id',
                                    emptyText: '선택',
                                    allowBlank: true,
                                    sortInfo: {
                                        field: 'create_date',
                                        direction: 'DESC'
                                    },
                                    typeAhead: false,
//                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    //hideLabel: true,
                                    minChars: 2,
                                    queryMode: 'remote',
//						            hideLabel: true,
//						            hideTrigger:true,
						            anchor: '100%',
						            pageSize: 25,
						            triggerAction: 'all',
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            //    			            	        	   var reccode = record.get('area_code');
                                            coord_key1 = record.get('unique_id');
                                            //    			            	        	   Ext.getCmp('maker_code').setValue(reccode);
                                        }
                                    }
                                },{
                                    fieldLabel: '주문번호',
                                    xtype: 'textfield',
                                    rows: 4,
                                    anchor: '100%',
                                    name: 'po_no',
                                    value: po_no
                                },
                                {
                                    fieldLabel: '납기일',
                                    xtype: 'datefield',
                                    name: 'req_date',
//                                    fieldStyle: 'background-color: #ddd; background-image: none;',
//                                    value: new Date()+7,
                                },
                                {
                                    fieldLabel: '납품장소',
                                    xtype: 'textfield',
                                    rows: 4,
                                    anchor: '100%',
                                    name: 'reserved_varchar1',
                                    value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                                },
                                {
                                    fieldLabel: '요청사항',
                                    xtype: 'textarea',
                                    rows: 4,
                                    anchor: '100%',
                                    name: 'reserved_varchar2'
                                }, {
                                    fieldLabel: '결제 조건',
                                    xtype: 'combo',
                                    anchor: '100%',
                                    name: 'pay_condition',
                                    store: gm.me().payConditionStore,
                                    displayField: 'codeName',
                                    valueField: 'codeName',
                                    emptyText: '선택',
                                    allowBlank: true,
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {}
                                    }
                                },
                                new Ext.form.Hidden({
                                    name: 'unique_uids',
                                    value: assymapUids
                                }), new Ext.form.Hidden({
                                    name: 'coord_key3',
                                    value: -1
                                }), new Ext.form.Hidden({
                                    name: 'ac_uid',
                                    value: -1
                                }),
//                                new Ext.form.Hidden({
//                                    name: 'req_date',
//                                    value: selections[0].get('req_date')  == null ? this_date : selections[0].get('req_date'),
//                                }), 
                                new Ext.form.Hidden({
                                    name: 'sales_price',
                                    value: 0
                                }), new Ext.form.Hidden({
                                    name: 'childs',
                                    value: childs
                                })
                                , new Ext.form.Hidden({
                                    name: 'parent_uid', //사업부
                                    value: parent_uid
                                })
                            ]
                        }];
                    
                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: formItems
                })
                var myHeight = (this.useRouting==true) ? 750: 480;
                var myWidth = 800;

                var items = [form];
                if(this.useRouting==true) {
                    
                    this.rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId: 'removeRtgapp',
                        glyph: 'xf00d@FontAwesome',
                        text: CMD_DELETE,
                        disabled: true,
                        handler: function(widget, event) {
                            Ext.MessageBox.show({
                                title:delete_msg_title,
                                msg: delete_msg_content,
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().deleteRtgappConfirm,
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });

                    var updown =
                    {
                        text: '이동',
                        menuDisabled: true,
                        sortable: false,
                        xtype: 'actioncolumn',
                        width: 70,
                        align: 'center',
                        items: [{
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/up.png',
                            tooltip: 'Up',
                            handler: function(agridV, rowIndex, colIndex) {
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
//                                console_log(record);
                                var unique_id = record.get('unique_id');
//                                console_log(unique_id);
                                var direcition = -15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {   
                                        gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                                    
                                }
                
                
                        },'-',
                        {
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/down.png',
                            tooltip: 'Down',
                            handler: function(agridV, rowIndex, colIndex) {
                
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
//                                console_log(record);
                                var unique_id = record.get('unique_id');
//                                console_log(unique_id);
                                var direcition = 15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {   
                                         gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                            }
                
                        }]
                    };
                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
                    var selModel2 = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
                    
                    this.prgrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                    	id:'pr_caton_grid',
                        store: this.carton_store,
                        border: true,
                        frame: true,
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        height: 200,
//                        layout: 'fit',
                        scroll: true,                        
                        selModel: selModel2,
                        plugins: [Ext.create('Ext.grid.plugin.CellEditing',{clicksToEdit:1})],
                        columns : [
                        	
                            { dataIndex : 'pj_code', text : '수주번호', width:90,  sortable : false	}
                            ,{ dataIndex : 'item_code', text : '품번',  width:80,sortable : false	}
                            ,{ dataIndex : 'item_name', text : '품명', flex : 1, sortable : false	}
                            ,{ dataIndex : 'description', text : '제품사이즈', width:100,/*flex : 1, */ sortable : false	}
                            ,{ dataIndex : 'cost_qty', text : '필요수량', width:80	,  sortable : false}
                            ,{ dataIndex : 'po_qty', text : '요청수량', width:80	,  sortable : false, editor:{xtype:'numberfield'}}
                        ],
                        border: false,
                        multiSelect: true,
                        frame: false ,
                        dockedItems: [{
                        	xtype: 'toolbar',
                        	cls: 'my-x-toolbar-default2',
                        	items: [{
                                    xtype:'label',
                                    labelWidth: 20,
                                    text: '구매 요청 List'//,
                        	}]// endofitems
                        }] // endofdockeditems 
                    }); // endof Ext.create('Ext.grid.Panel',

//                    this.prgrid.on('edit', function(a,b) {
//						gm.me().total_price=0
//						console_logs('gm.me().carton_store.data.items.length',gm.me().carton_store.data.items.length);
//						for(var j=0;j<gm.me().carton_store.data.items.length; j++){
//							var rec = gm.me().carton_store.data.items[j];
//							
//							var sales_price = rec.get('sales_price');
//							var po_qty = rec.get('po_qty');
//							console_logs('gm.me().sales_price',sales_price);
//							console_logs('gm.me().po_qty',po_qty);
//							gm.me().total_price = gm.me().total_price +Number(sales_price)*Number(po_qty);
//							console_logs('gm.me().total_price',gm.me().total_price);
//						}
////						gu.id('target_total_price')
//						var total_price =  gu.getCmp('target_total_price');
//						total_price.setValue(gm.me().total_price);
//						
//					})
					
                    this.prgrid.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
//                            if (selections.length) {
//                                removeRtgapp.enable();
//                            } else {
//                                removeRtgapp.disable();
//                            }
                        }
                    });

                    items.push(this.prgrid);
                    
                    this.agrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                        store: this.rtgapp_store,
                        border: true,
                        frame: true,
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        //layout: 'fit',
                        scroll: true,                        
                        selModel: selModel,
                        columns : [
                            { dataIndex : 'seq_no', text : '순서', width:70,  sortable : false	}
                            ,{ dataIndex : 'user_id', text : '아이디',  sortable : false	}
                            ,{ dataIndex : 'user_name', text : '이름', flex : 1,  sortable : false	}
                            ,{ dataIndex : 'dept_name', text : '부서 명', width:90	,  sortable : false}
                            ,{ dataIndex : 'gubun', text : '구분', width:50	,  sortable : false}
                            ,updown
                        ],
                        border: false,
                        multiSelect: true,
                        frame: false ,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default2',
                            items: [
                               {
                                    xtype:'label',
                                    labelWidth: 20,
                                    text: '결재 권한자 추가'//,
                    
                            },{
                                id :'user_name',
                                name : 'user_name',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: userStore,
                                labelSeparator: ':',
                                emptyText:   dbm1_name_input,
                                displayField:   'user_name',
                                valueField:   'unique_id',
                                sortInfo: { field: 'user_name', direction: 'ASC' },
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 2,
                                width: 200,
                                listConfig:{
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }			                	
                                },
                                listeners: {
                                    select: function (combo, record) {
//                                        console_logs('Selected combo : ', combo);
//                                        console_logs('Selected record : ', record);
//                                        console_logs('Selected Value : ', record.get('unique_id'));
                                        
                                        var unique_id = record.get('unique_id');
                                        var user_id = record.get('user_id');
                                        Ext.Ajax.request({
                                             url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                             params:{
                                                 useruid : unique_id,
                                                 userid : user_id
                                                 ,gubun    : 'D'
                                             },
                                             success : function(result, request) {   
                                                 var result = result.responseText;
//                                                console_log('result:' + result);
                                                if(result == 'false'){
                                                    Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                }else{
                                                    gm.me().rtgapp_store.load(function() {});
                                                }
                                             },
                                             failure: extjsUtil.failureMessage
                                         });
                                    }// endofselect
                                }
                            },
                            '->',removeRtgapp
                            
                            ]// endofitems
                        }] // endofdockeditems 
                        
                    }); // endof Ext.create('Ext.grid.Panel',

                    this.agrid.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
                            if (selections.length) {
                                removeRtgapp.enable();
                            } else {
                                removeRtgapp.disable();
                            }
                        }
                    });

                    items.push(this.agrid);
                }

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '주문 작성',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    //결재사용인 경우 결재 경로 확인
                                    if(gm.me().useRouting==true) {

                                        var items = gm.me().rtgapp_store.data.items;
//                                        console_logs('rtgapp_store items.length', items.length);
                                        if(items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }
                                        
                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for(var i=0; i<items.length; i++) {
                                            var rec = items[i];
//                                            console_logs('ffffff', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] =  ahid_userlist;
                                        val['hid_userlist_role'] =  ahid_userlist_role;
                                        
                                        
                                    }
                                   
//                                    console_logs('val', val);
                                    var PrCatonGrid = Ext.getCmp('pr_caton_grid');
                    		    	var ac_uids =[];
                    		    	var srcahd_uids =[];
                    		    	var po_qtys =[];
                    		    	var pj_codes =[];
                    		    	var item_codes=[];
                                    for (var i = 0; i <PrCatonGrid.store.data.items.length; i++){
                		    	        
                    		    		var record = PrCatonGrid.store.data.items [i];
                    		    		var ac_uid =  record.get('unique_id'); //수주uid
                    		           	var pj_code = record.get('pj_code'); // 수주번호
                    		           	var srcahd_uid = record.get('srcahd_uid'); //카톤 uid
                    		           	var po_qty = record.get('po_qty'); //구매수량
                    		           	var item_code = record.get('item_code'); //품번
                    		           	 	ac_uids.push(ac_uid);
                    		           	 	srcahd_uids.push(srcahd_uid);
                    			    	 	po_qtys.push(po_qty);
                    			    	 	pj_codes.push(pj_code);
                    			    	 	item_codes.push(item_code);
                    		    	  }
                                    
                                    var fullYear = gUtil.getFullYear() + '';
                                    var month = gUtil.getMonth() + '';
                                    if (month.length == 1) {
                                        month = '0' + month;
                                    }
                                    gMain.selPanel.yearmont=fullYear+month;
                                    
//                                    console_logs('val@@@@@@@@@@@@@@@',val);
//                                    return;
                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontractCaton',
                                        params: {
//                                        	val,
                                            parent_uid: gMain.selPanel.yearmonth, //현재년월 YYYYMM
                                            srcahd_uids: srcahd_uids,//카톤구매리스트 카톤 srcahd_uid
                                            ac_uids:   ac_uids,//카톤구매리스트 프로젝트 uid 
                                            po_qtys:	po_qtys,	//구매요청 수량
                                            item_codes: item_codes,
                                            hid_userlist_role : val['hid_userlist_role'],
                                			hid_userlist : val['hid_userlist']
                	                    },
                                        success: function(val, action) {
                                            prWin.close();
                                            gm.me().store.load(function() {});
                                        },
                                        failure: function(val, action) {

                                            prWin.close();
                                            gm.me().store.load(function() {});

                                        }
                                    });

                                } // end of formvalid 
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function(btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show(undefined, function(){
                    var combo = gu.getCmp('target_supplier');
//                    console_logs('combo', combo);
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    if(selections==null || selections.length==0) {
                        return;
                    }
                    var rec = selections[0];
//                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if(combo!=null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function(records) {
//                            console_logs('combo.store.load records', records);

                            if(records!=null) {
                                  for (var i=0; i<records.length; i++){
//                                    console_logs('obj', records[i]);

                                         var obj = records[i];
                                         try {
                                              if(obj.get(combo.valueField)==supplier_uid ) {
                                                  combo.select(obj);
                                              }
                                         } catch(e){}
                                  }
                            }//endofif

                          });


                    }//endof if(combo!=null) {
                });
            }

        }

    },
    treatInPo: function() {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gm.me().request_date;
        var pj_name = gm.me().vSELECTED_pj_name;
        var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;

        var form = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {
            if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                Ext.Msg.alert("알림", "가용재고가 없습니다. 확인해주세요.");
            } else {
                this.treatPaperAddInPoRoll();
            }
        }

    },

    editRedord: function(field, rec) {
//        console_logs('====> edited field', field);
//        console_logs('====> edited record', rec);

        switch (field) {
            case 'quan':
            case 'static_sales_price':
            case 'req_date':
            case 'cart_currency':
                this.updateDesinComment(rec);
                switch(vCompanyReserved4) {
                    case 'KYNL01KR':
                        this.storeLoad();
                        break;
                    default:
                        break;
                }
                break;
        }
    },
    updateDesinComment: function(rec) {

        var child = rec.get('child');
//        console_logs('child>>>', child);
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = Ext.Date.format(rec.get('req_date'), 'Y-m-d');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
//        console_logs('====> unique_id', unique_id);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
                quan: quan,
                child: child,
                static_sales_price: static_sales_price,
                cart_currency: cart_currency,
                req_date: req_date,
                unique_id: unique_id
            },
            success: function(result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },


    calcAge: function(quan, sales_price) {
        return quan * sales_price;


    },
    getPrice: function(total_price) {
        console_logs('total_price++++++++', total_price);
        var uniqueId = gm.me().vSELECTED_PJ_UID;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
            params: {
                cartmapUids: this.cartmap_uids,
                total_price: total_price
            },

            success: function(result, request) {
                gm.me().store.load();
                //				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

            }, //endofsuccess
            failure: extjsUtil.failureMessage
        }); //endofajax
    },

    getTableName: function(field_name) {
        //		console_logs('getTableName field_name', field_name);
        var fields = this.getFields();
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
            //			console_logs('getTableName o', o);
            if (field_name == o['name']) {
                return o['tableName'];
            }
        }
        return null;
    },

    checkEqualPjNames: function(rec) {
        console_logs('rec+++++++++++++in check' + rec);
    },
    rtgapp_store: null,
    carton_store: null,
    //결재조건
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {
        hasNull: false
    }),

    deleteRtgappConfirm: function (result){
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if(result=='yes') {

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');
                    
                    if(user_id==vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function() {});
                        return;
                    }
                }

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');
                    
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp',
                            params: {
                                unique_id: unique_id
                            },
                            success: function(result, request) {
                                gm.me().agrid.store.load();
                            }, // endofsuccess
                            failure: extjsUtil.failureMessage
                        }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },

    // 공급사 유형 필터
    suplier_type: (vCompanyReserved4 == 'KWLM01KR') ? null : 'R',

    //프로젝트 중복 혀용 여부
    canDupProject: (vCompanyReserved4 == 'DABP01KR') ? true : false,

    //주문시 공급사 지정
    changeSupplier:  (vCompanyReserved4 == 'SKNH01KR') ? false : true,

    //결재 기능 사용
    useRouting:  (vCompanyReserved4 == 'DABP01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,

    buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),
    partlineStore : Ext.create('Mplm.store.PartLineStore', {
//        reserved16: gm.me().srcahd_uid
    }),
    yearmonth:null,
    culNextYM : function(fullYear,month){
    	switch(month){
    		case 12 : 
    			this.nextYM = fullYear+'01';
    		break;
    		default :
    			this.nextYM = Number(fullYear+month)+1;
    	}
    },
    nextYM : null,
    total_price:0
    
//	, calcParentDate : function(){
//    	var fullYear = gUtil.getFullYear() + '';
//        var month = gUtil.getMonth() + '';
//        if (month.length == 1) {
//            month = '0' + month;
//        }
//
//        var CurDate = fullYear+ month;
//        
//        return CurDate;
//    }
});

