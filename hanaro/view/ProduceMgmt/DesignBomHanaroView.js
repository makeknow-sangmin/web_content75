/***
 * 사용안함
 * 
 */
// // Ext.require([
// //     'Ext.data.*',
// //     'Ext.grid.*',
// //     'Ext.tree.*',
// //     'Ext.tip.*',
// //     'Ext.ux.CheckColumn'
// // ]);


// Ext.define('Hanaro.view.produceMgmt.DesignBomHanaroView', {
//     extend: 'Rfx.base.BaseView',
//     xtype: 'design-bom-view',
//     selected_product : null,

//     initComponent: function(){
    	
//     	this.multiSortHidden = true;
    	
//     	this.commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
//     	this.commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
//     	this.commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: false} );
//     	this.commonDescriptionStore = Ext.create('Mplm.store.CommonDescriptionStore', {hasNull: false} );
//     	this.commonStandardStore2  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false} );
//     	this.GubunStore  = Ext.create('Mplm.store.GubunStore', {hasNull: false} );
    	
//     	// 검색툴바 필드 초기화
//     	this.initSearchField();
    	
// 		this.addSearchField('pj_name');
		

// 		// 검색툴바 생성
// 		// var searchToolbar = this.createSearchToolbar();

// 		// 명령툴바 생성
//         // var commandToolbar = this.createCommandToolbar();

//         // console_logs('this.fields', this.fields);

//         this.createStore('Rfx2.model.company.hanaro.PartLine', [{
// 	            property: 'pl_no',
// 	            direction: 'ASC'
// 	        }],
// 	        gMain.pageSize/* pageSize */
// 	        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
//         	// Orderby list key change
//         	// ordery create_date -> p.create로 변경.
// 	        ,{
// 	        	creator: 'a.creator',
// 	        	unique_id: 'a.unique_uid'
// 	        }
// // //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
//          	, ['assymap']
         	
// 	        );
        
//         this.addPcsPlanAction = Ext.create('Ext.Action', {
// 			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
// 			 text: '공정 설계',
// 			 tooltip: '',
// 			 disabled: true,
			 
// 			 handler: function() {
				 
				 
// 			 }
// 		});
        
// 		this.removeAction = Ext.create('Ext.Action', {
// 			 iconCls: 'af-remove',
// 			 text: 'BOM 삭제',
// 			 tooltip: '삭제하기',
// 			 disabled: true,
// 			 handler: function(widget, event) {
// 			    	Ext.MessageBox.show({
// 			            title: '삭제하기',
// 			            msg: '선택한 항목을 삭제하시겠습니까?',
// 			            buttons: Ext.MessageBox.YESNO,
// 			            fn: gm.me().deleteConfirm,
// 			            icon: Ext.MessageBox.QUESTION
// 			        });
// 			 }
// 		});
// 		this.bomAddAction =Ext.create('Ext.Action', {
//             itemId: 'addPartAction',
//             iconCls: 'af-plus-circle',
//             disabled: false,
//             text: CMD_ADD,
//             handler: function(widget, event) {

//             	if(vCompanyReserved4 ==  'SKNH01KR') {
//             		gm.me().searchStore.getProxy().setExtraParam('standard_flag', 'R');
//             	}

//                 if (gm.me().selected_product == null) {
//                     Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
//                         return
//                     });
//                     return;
//                 }
				
				
           
//                 var totalCount = gm.me().productStore.totalCount;
//                 var pl_no = '';
//                 if (totalCount >= 9) {
//                 	pl_no = totalCount + 1;
//                 } else{
//                 	pl_no = '0' + (totalCount + 1);
//                 }
//                 var parent = gm.me().selected_product.get('parent');
//                 var parent_uid = gm.me().selected_product.get('parent_uid');
//                 var ac_uid = gm.me().selected_product.get('ac_uid');
//                 Ext.Ajax.request({
//                     url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
//                     params: {
//                         pj_code: gm.me().selectedPjCode
//                     },
//                     success: function(result, request) {
//                         var result = result.responseText;
//                         var str = result;
//                         var num = Number(str);

//                         if (str.length == 3) {
//                             num = num;
//                         } else if (str.length == 2) {
//                             num = '' + num;
//                         } else if (str.length == 1) {
//                             num = '0' + num;
//                         } else {
//                             num = num % 1000;
//                         }
//                         // var pl_no = 'A' + num + '0';

//                         var lineGap = 30;
//                         var bHeight = 300;
//                         var bWidth = 500;


//                         gm.me().createPartForm = Ext.create('Ext.form.Panel', {
//                             xtype: 'form',
//                             width: bWidth,
//                             height: bHeight,
//                             bodyPadding: 15,
//                             layout: {
//                                 type: 'vbox',
//                                 align: 'stretch' // Child items are stretched
// 													// to full width
//                             },
//                             defaults: {
//                                 allowBlank: true,
//                                 msgTarget: 'side',
//                                 labelWidth: 100
//                             },
                            
//                             items: [
//                                 new Ext.form.Hidden({
//                                     name: 'parent',
//                                     value: parent
//                                 }),
//                                 new Ext.form.Hidden({
//                                     name: 'parent_uid',
//                                     value: parent_uid
//                                 }),
//                                 new Ext.form.Hidden({
//                                     name: 'ac_uid',
//                                     value: gm.me().selectedPjUid
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('pj_code'),
//                                     name: 'pj_code'
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('coord_key2'),
//                                     name: 'coord_key2'
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('standard_flag'),
//                                     name: 'standard_flag',
//                                     value: 'R'
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('child'),
//                                     name: 'child'
//                                 }),
//                                 new Ext.form.Hidden({
//                                 	id: gu.id('remark'),
//                                 	name: 'remark'
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('sg_code'),
//                                     name: 'sg_code',
//                                     value: 'NSD'
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('hier_pos'),
//                                     name: 'hier_pos'
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('assy_name'),
//                                     name: 'assy_name',
//                                     value: this.selectedAssyName
//                                 }),
//                                 new Ext.form.Hidden({
//                                 	id: gu.id('pl_no'),
//                                 	name: 'pl_no',
//                                 	value: pl_no
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('pj_name'),
//                                     name: 'pj_name',
//                                     value: this.selectedPjName
//                                 }),
//                                 new Ext.form.Hidden({
//                                     id: gu.id('isUpdateSpec'),
//                                     name: 'isUpdateSpec',
//                                     value: 'false'
//                                 }),
                                
//                                 {
//                                     xtype: 'triggerfield',
//                                     fieldLabel: gm.me().getColName('item_code'),
//                                     id: gu.id('item_code'),
//                                     name: 'item_code',
//                                     allowBlank : false,
//                                     emptyText: '입력하시고 유효한 값인지 확인을 위해 옆에 검색 아이콘을 누르시기 바랍니다.',
//                                     listeners: {
//                                         specialkey: function(field, e) {
//                                             if (e.getKey() == Ext.EventObject.ENTER) {}
//                                         }
//                                     },
//                                     trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
//                                     'onTrigger1Click': function() {
                                    	
//                                         var val = gu.getCmp( 'item_code').getValue();
//                                         if (val != null && val != '') {

//                                             Ext.Ajax.request({
//                                                 url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
//                                                 params: {
//                                                     item_code: val
//                                                 },
//                                                 success: function(result, request) {
//                                                     var jsonData = Ext.decode(result.responseText);
//                                                     var records = jsonData.datas;
//                                                     if (records != null && records.length > 0) {
//                                                         // modRegAction.enable();
//                                                         // resetPartForm();
//                                                         gm.me().setPartFormObj(records[0]);
//                                                     } else {
//                                                         Ext.MessageBox.alert('알림', '알 수없는 자재번호입니다.');
//                                                     }

//                                                 },
//                                                 failure: extjsUtil.failureMessage
//                                             });
//                                         } // endofif
//                                     }

//                                 },
//                                 {
//                                     xtype: 'textfield',
//                                     emptyText: '품명',
//                                     name: 'item_name',
//                                     id: gu.id('item_name'),
//                                     fieldLabel: gm.me().getColName('item_name'),
//                                     readOnly: false,
//                                     allowBlank: false
// 								}, {
//                                     xtype: 'textfield',
//                                     fieldLabel: gm.me().getColName('pl_no'),
//                                     id: gu.id('pl_no'),
//                                     name: 'pl_no',
//                                     allowBlank: false
//                                 },{
//                                     xtype: 'textfield',
//                                     fieldLabel: gm.me().getColName('specification'),
//                                     id: gu.id('specification'),
//                                     name: 'specification',
//                                     allowBlank: false
//                                 }, {
//                                     xtype: 'numberfield',
//                                     minValue: 0,
//                                     width: 100,
//                                     id: gu.id('bm_quan'),
//                                     name: 'bm_quan',
//                                     fieldLabel: gm.me().getColName('bm_quan'),
//                                     allowBlank: true,
//                                     value: '1',
// 									margins: '0'
// 								},{
//                                 }, {
//                                     width: 100,
//                                     id: gu.id('unit_code'),
//                                     name: 'unit_code',
//                                     xtype: 'combo',
//                                     mode: 'local',
//                                     editable: false,
//                                     allowBlank: false,
//                                     queryMode: 'remote',
//                                     displayField: 'codeName',
//                                     valueField: 'codeName',
//                                     value: 'EA',
//                                     triggerAction: 'all',
//                                     fieldLabel: gm.me().getColName('unit_code'),
//                                     store: gm.me().commonUnitStore,
//                                     listConfig: {
//                                         getInnerTpl: function() {
//                                             return '<div data-qtip="{systemCode}">{codeName}</div>';
//                                         }
//                                     },
//                                     listeners: {
//                                         select: function(combo, record) {
//                                             console_log('Selected Value : ' + combo.getValue());
//                                             var systemCode = record.get('systemCode');
//                                             var codeNameEn = record.get('codeNameEn');
//                                             var codeName = record.get('codeName');
//                                             console_log('systemCode : ' + systemCode +
//                                                 ', codeNameEn=' + codeNameEn +
//                                                 ', codeName=' + codeName);
//                                         }
//                                     }

// 								}
//                                 ]
//                         });
//                         var winPart = Ext.create('ModalWindow', {
//                             title: 'Part 추가',
//                             width: bWidth,
//                             height: bHeight,
//                             minWidth: 250,
//                             minHeight: 180,
//                             items: gm.me().createPartForm,
//                             buttons: [{
//                                 text: CMD_OK,
//                                 handler: function() {
// 									var form = gm.me().createPartForm;
//                                     if (form.isValid()) {
// 										var val = form.getValues(false);	
//                                         console_logs('form val', val);
//                                         gm.me().registPartFc(val);
//                                         if (winPart) {
//                                             winPart.close();
// 										}
										
//                                     } else {
//                                     	Ext.Msg.alert('오류', '해당 정보가 입력되지 않았습니다.');
//                                     }

//                                 }
//                             }, {
//                                 text: CMD_CANCEL,
//                                 handler: function() {
//                                     if (winPart) {
//                                         winPart.close();
//                                     }
//                                 }
//                             }]
//                         });
//                         winPart.show( /* this, function(){} */ );
//                     } // endofhandler
//                 });


//             },
//             failure: extjsUtil.failureMessage
//         }),
		
// 		this.bomEditAction = Ext.create('Ext.Action', {
// 			 iconCls: 'af-edit',
// 			 text: 'BOM 수정',
// 			 tooltip: '수정하기',
// 			 disabled: true,
// 			 handler: function(widget, event) {

// 	    	    	var uniqueId = gm.me().assymapUidbom;
// 	    	    	var pcr_div = gm.me().assymapPcr_div;
// 	    	    	var bm_quan = gm.me().assymapBmQuan;
// 	    	    	var hier_pos = gm.me().assyId;
// 	    	    	var child = gm.me().child;
// 	    	    	var reserved_integer1 = gm.me().assylevel;
// 	    	    	var pl_no = rec.get('pl_no');
// 	    	    	var item_code = rec.get('item_code');
// 	    	    	var item_name = rec.get('item_name');
// 	    	    	var full_spec_nomaker = rec.get('full_spec_nomaker');
// 	    	    	var quan = rec.get('quan');
// 	    	    	 console_logs('quan+++++++++++++++++', quan);
// 	    	    	var unit_code = rec.get('unit_code');
// 	    	    	var remark = rec.get('remark');

// 	    					var lineGap = 30;
// 	    					var bHeight = 250;
	    					
// 	    			    	var inputItem= [];

// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'pl_no',
// 	    								fieldLabel: '순번',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								value:pl_no,
// 	    								editable:true
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;'
// 	    							});
// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'item_code',
// 	    								fieldLabel: 'STOCK_NO',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								value:item_code,
// 	    								editable:true
// 	    							});
// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'item_name',
// 	    								fieldLabel: 'DESCRIPTION',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								// editable:true,
// 	    								value:item_name,
// 	    								fieldStyle : 'background-color: #ddd; background-image: none;'
// 	    							});
// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'full_spec_nomaker',
// 	    								fieldLabel: 'MATERIAL/DESIGNATION-STD.',
// 	    								labelSize:'2',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								// editable:true,
// 	    								value:full_spec_nomaker,
// 	    								fieldStyle : 'background-color: #ddd; background-image: none;'
// 	    							});
// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'quan',
// 	    								fieldLabel: 'QTY',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								editable:true,
// 	    								value:quan
// 	    							});
// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'unit_code',
// 	    								fieldLabel: '단위',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								value:unit_code,
// 	    								// editable:true,
// 	    								fieldStyle : 'background-color: #ddd; background-image: none;'
// 	    							});
// 	    			    	inputItem.push(
// 	    					    	{
// 	    								xtype: 'textfield',
// 	    								name: 'remark',
// 	    								fieldLabel: 'REMARK',
// 	    								anchor: '-5',
// 	    								// readOnly : true,
// 	    								// fieldStyle : 'background-color: #ddd;
// 										// background-image: none;',
// 	    								allowBlank:true,
// 	    								value:remark,
// 	    								// editable:true,
// 	    								fieldStyle : 'background-color: #ddd; background-image: none;'
// 	    							});
	    			 
// 	    			    	var form = Ext.create('Ext.form.Panel', {
// 	    			    		id: 'BomEditPanel-DBM7',
// 	    			            defaultType: 'textfield',
// 	    			            border: false,
// 	    			            bodyPadding: 15,
// 	    			            width: 400,
// 	    			            height: bHeight,
// 	    			            defaults: {
// 	    			                // anchor: '100%',
// 	    			                editable:false,
// 	    			                allowBlank: false,
// 	    			                msgTarget: 'side',
// 	    			                labelWidth: 100
// 	    			            },
// 	    			             items: inputItem
// 	    			        });
// 	    			        var win = Ext.create('ModalWindow', {
// 	    			            title: 'BOM 수정',
// 	    			            width: 400,
// 	    			            height: bHeight,
// 	    			            minWidth: 400,
// 	    			            minHeight: 400,
// 	    			            items: form,
// 	    			            buttons: [{
// 	    			                text: CMD_OK,
// 	    			            	handler: function(){
// 	    			                    var form = Ext.getCmp('BomEditPanel-DBM7').getForm();
// 	    			                    if(form.isValid())
// 	    			                    {
// 	    			                	var val = form.getValues(false);
// 	    			                	Ext.Ajax.request({
//                                             url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
//                                             params: {
//                                                 item_code: val['item_code']
//                                             },
//                                             success: function(result, request) {
//                                                 var jsonData = Ext.decode(result.responseText);
//                                                 var records = jsonData.datas;
//                                                 if (records != null && records.length > 0) {
                                                	
//                                                 	var child = records[0].unique_id;
                                                	
//                                                 	Ext.Ajax.request({
//             	    			            			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
//             	    			            			params:{
//             	    			            				child:child,
//             	    			            				unique_id : uniqueId, // 유니크아이디
//             	    			            				quan  : val['quan']
            	    			            				
//             	    			            			},
//             	    			            			success : function(result, request) {   
              
//             	    			            				gm.me().store.load();
//             	    			            			},
//             	    			            			failure: extjsUtil.failureMessage
//             	    			            		});
                                                	
//                                                     // gm.me().setPartFormObj(records[0]);
                                                    
                                                    
//                                                 } else {
//                                                     Ext.MessageBox.alert('알림', '알 수없는 자재번호입니다.');
//                                                 }

//                                             },
//                                             failure: extjsUtil.failureMessage
//                                         });
	    			                	
	    			                	
	    			                	
	    			                	 
// 	    		                       	if(win) 
// 	    		                       	{
// 	    		                       		win.close();
// 	    		                       	} 
// 	    			                    } else {
// 	    			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
// 	    			                    }

// 	    			                  }
// 	    			            },{
// 	    			                text: CMD_CANCEL,
// 	    			            	handler: function(){
// 	    			            		if(win) {
// 	    			            			win.close();
// 	    			            		}
// 	    			            	}
// 	    			            }]
// 	    			        });
// 	    			        win.show(/* this, function(){} */); 
// 			 } // endofhandler
// 		});
		
//         // PDF 파일 출력기능
//         this.printPDFAction = Ext.create('Ext.Action',{
//             iconCls: 'af-pdf',
//             text: 'PDF',
            
//             tooltip:'PartList 출력',
//             disabled: false,
            
//             handler: function(widget, event) {
//             	var ac_uid = gm.me().vSELECTED_PROJECT_UID;
//             	var item_code = gm.me().vSELECTED_PRODUCT_CODE;
            	
//             	Ext.Ajax.request({
//             		url: CONTEXT_PATH + '/pdf.do?method=printPl',
//             		params:{
//             			item_code : item_code,
//             			rtgast_uid: gm.me().selectedAssyUid,
//             			parent_uid: gm.me().selectedAssyUid,
//             			ac_uid : ac_uid,
//             			pdfPrint : 'pdfPrint',
//             			is_rotate : 'N'
//             		},
//             		reader: {
//             			pdfPath: 'pdfPath'
//             		},
//             		success : function(result, request) {
//                 	        var jsonData = Ext.JSON.decode(result.responseText);
//                 	        var pdfPath = jsonData.pdfPath;
//                 	        console_logs(pdfPath);      	        
//                 	    	if(pdfPath.length > 0) {
//                 	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
//                 	    		top.location.href=url;	
//                 	    	}
//             		},
//             		failure: extjsUtil.failureMessage
//             	});
            	
            	
//             }
//         });
      
//         var buttonToolbar = Ext.create('widget.toolbar', {
//     		cls: 'my-x-toolbar-default2',
//     		items: [
// 					{
// 						id: 'target-routeTitlename-DBM7',
// 					    xtype:'component',
// 					    html: "BOM List을 선택하세요.",
// 					    width: 370,
// 					    style: ''
					    
// 					 },
					 
// 			          '->',
// 			         this.bomAddAction,
// 			         this.bomEditAction,
// // '-',
// // '-',
// 					 this.removeAction,
// // '-',
					 
// // this.printPDFAction, '-',
// // {
// // xtype: 'component',
// // // style: 'margin:5px;',
// // //html: 'BOM 수량:'
// // },
// // {
// // xtype: 'component',
// // style: 'margin:5px;width:18px;text-align:right',
// // id: 'childCount-DBM7',
// // html: ''
// // }
//     		        ]
//     	});
        
//         this.createGrid([ buttonToolbar ], {width: '60%'});
        
        
//         this.setGridOnCallback(function(selections) {
//         	if (selections.length) {
//         		rec = selections[0];
//         		console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>',rec.get('request_comment'));
//         		gm.me().assymapUidbom=rec.get('unique_uid');
//         		gm.me().assymapPcr_div=rec.get('request_comment');
//         		gm.me().assymapBmQuan=rec.get('bm_quan');
//         		gm.me().assyId=rec.get('hier_pos');
//         		gm.me().assylevel=rec.get('reserved_integer1');
//         		gm.me().child=rec.get('unique_id');
//         		gUtil.enable(gm.me().addPcsPlanAction);
//         		gUtil.enable(gm.me().bomEditAction);
//         		gUtil.enable(gm.me().bomaAddction);
        		
//         	} else {
//         		gUtil.disable(gm.me().addPcsPlanAction);
//         		gUtil.disable(gm.me().bomEditAction);
//         		// gUtil.disable(gm.me().bomAddAction);
//         	}
        	
        	
//         });
        
    	
//         Ext.apply(this, {
//             layout: 'border',
//             items: [this.createWest(), this.createCenter()]
//         });
    	
        
// 	    this.commonStandardStore.load(function(records) {
//     		for (var i=0; i<records.length; i++){ 
//     	       	var obj = records[i];
//     	       	// console_logs('commonStandardStore2['+i+']=', obj);
//     	       	gm.me().standard_flag_datas.push(obj);
//     		}
//     	});
	    

// 		console_logs('this.productStore.load', 'start');
// 		this.productStore.load(function(records) {
// 			console_logs('this.productStore.load records', records);
//     		for (var i=0; i<records.length; i++){ 
//     	       	var obj = records[i];
//     	       	// console_logs('commonStandardStore2['+i+']=', obj);
//     		}
//     	});
    	
//     	this.callParent(arguments);
    	
//     },
//     setRelationship: function (relationship) {},
    
//     createCenter: function() {
// 	    this.inpuArea = Ext.widget({
// 	 	      title: 'Excel Form',
// 	 	      xtype: 'form',
// 	 	      disabled: true,
// 	 	      collapsible: false,
// 	 	      border: false,
// 	 	      layout: 'fit',
// 	 	      dockedItems: [{
// 	            dock: 'top',
// 	            xtype: 'toolbar',
// 	            items: [
// 	 	         {
// 		 	       	 iconCls: 'search',
// 			 	   	 text: CMD_INIT,
// 			 	   	 handler: function() {
// 				 	   	 Ext.MessageBox.show({
// 		                     title:'초기화 확인',
// 		                     msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
// 		                     buttons: Ext.MessageBox.YESNO,
// 		                     icon: Ext.MessageBox.QUESTION,
// 		                     fn: function(btn) {
// 		                         var result = MessageBox.msg('{0}', btn);
// 		                         if(result=='yes') {
// 		                        	 var o = Ext.getCmp('bom_content-DBM7');
// 		                        	 o.setValue(bomTableInfo);
// 		                         }
// 		                     }
// 		                 });
	            	 
// 		             }
// 	 	         },'-',
// 	 	        {
// 		 	       	 iconCls: 'textfield',
// 			 	   	 text: '모두 지우기',
// 			 	   	 handler: function() {
// 				 	   	 Ext.MessageBox.show({
// 		                     title:'모두 지우기',
// 		                     msg: '모두 지우시겠습니까?',
// 		                     buttons: Ext.MessageBox.YESNO,
// 		                     icon: Ext.MessageBox.QUESTION,
// 		                     fn: function(btn) {
// 		                         var result = MessageBox.msg('{0}', btn);
// 		                         if(result=='yes') {
// 		                        	 var o = Ext.getCmp('bom_content-DBM7');
// 		                        	 o.setValue('');
// 		                         }
// 		                     }
// 		                 });
	            	 
// 		             }
// 	 	         },'-', {
// 		 	       	 iconCls: 'application_view_tile',
// 			 	   	 text: '사전검증',
// 			 	   	 handler: function() {
// 			 	   		 var bom_content = Ext.getCmp('bom_content-DBM7');
			 	   		 
// 			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
// 					  	Ext.Ajax.request({
// 							url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
// 							params:{
// 								pj_code: gm.me().selectedPjCode,
// 								assy_code: gm.me().selectedAssyCode,
// 								pj_uid: gm.me().selectedPjUid,
// 								parentUid: gm.me().selectedparent,
// 								parent: gm.me().selectedparent,
// 								parent_uid: gm.me().selectedAssyUid,
// 								pj_name: Ext.JSON.encode(gm.me().selectedPjName),
// 								assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
// 								htmlContent: htmlContent
// 							},
// 							success : function(result, request) {   
// 								var val = result.responseText;
// 								// console_logs("val", val);
// 								// var htmlData = Ext.decode(val);
// 								// console_logs("htmlData", val);
								
// 					 	   		// htmlContent=func_replaceall(htmlContent,'<table
// 								// border="0"','<table border="1"');
					 	   		
// 					 	   		bom_content.setValue(val);
					
// 							},
// 							failure: extjsUtil.failureMessage
// 						});
			 	   		 
	            	 
// 		             }
// 	 	         },'-', {
// 		             text: '디플로이',
// 		             iconCls: 'save',
// 		             handler: function() {
// 			 	   		 var bom_content = Ext.getCmp('bom_content-DBM7');
			 	   		 
// 			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
// 			 	   		Ext.getCmp('bom_content-DBM7').setLoading(true);
			 	   		 
// 					  	Ext.Ajax.request({
// 							url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
// 							params:{
// 								pj_code: gm.me().selectedPjCode,
// 								assy_code: gm.me().selectedAssyCode,
// 								pj_uid: gm.me().selectedPjUid,
// 								parentUid: gm.me().selectedparent,
// 								pj_name: Ext.JSON.encode(gm.me().selectedPjName),
// 								assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
// 								htmlContent: htmlContent
// 							},
// 							success : function(result, request) { 
			     				
// 		        				var jsonData = Ext.decode(result.responseText);
// 		        				console_logs('jsonData', jsonData);
		        				
// 		        				var result = jsonData['result'];
		        				
// 		        				if(result == 'true' || result  == true) {// 정상이면
// 																			// Reload.
// 						    		if(gm.me().selectedAssyDepth==1) {
// 						    			gm.me().editAssyAction.disable();
// 						    			gm.me().removeAssyAction.disable();
// 						    		} else {
// 						    			gm.me().editAssyAction.enable();
// 						    			gm.me().removeAssyAction.enable();		
// 						    		}
// 						    		gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedparent);
// 						    		gm.me().store.getProxy().setExtraParam('ac_uid', gm.me().selectedPjUid);
// 						    		gm.me().store.load(function(records){
// 					            		// insertStockStoreRecord(records);
// 					            		gm.me().routeTitlename = '[' + gm.me().selectedAssyCode  + '] ' + gm.me().selectedAssyName;
// 					            		gm.me().selectAssy(gm.me().selectedFolderName, gm.me().selectedAssyDepth);
// 					            		gm.me().setChildQuan(records.length);

					            		
// 					            		gm.me().setMakeTable(records);
					            		
// 					            	});
					            	
// 		        				} else {
// 		        					Ext.MessageBox.alert('오류','입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
// 		        				}
// 		        				Ext.getCmp('bom_content-DBM7').setLoading(false);
// 							},
// 							failure: extjsUtil.failureMessage
// 						});

// 		             }
// 	 	         }, '-',
// 		         '->'/*
// 						 * , addExcelWithProject, '-',excel_sample
// 						 */]
// 	 	      }],
// 	 	      items: [
// 	 	      {
// 	 	    	     id: 'bom_content-DBM7',
// 		             name: 'bom_content',
// 		             xtype: 'htmleditor',
// 		             width: '100%',
// 		             height: '100%',
// 		             border: false,
// 		             enableColors: false,
// 		             enableAlignments: false,
// 		             anchor: '100%',
// 		             listeners: {
// 		                 initialize: function(editor) {
// 		                	 console_logs('editor', editor);
// 		                     var styles = {
//                           };
  
// 		                     Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
// 		                 }
// 		             },
// 		             value: this.initTableInfo
		            	
		             
// 		    	 }]
// 	 		});

//     		this.grid.setTitle('BOM');
// 			this.center =  Ext.widget('tabpanel', {
// 				layout:'border',
// 			    border: true,
// 			    region: 'center',
// 	            width: '75%',
// 			    items: [this.grid]
// 			});
			
// 			return this.center;

//     },
    
//     // ----------------------- END OF CENTER --------------------
    
//     createWest: function() {
    	
//     	this.removeAssyAction = Ext.create('Ext.Action', {
//     		itemId: 'removeAssyAction',
//     	    iconCls: 'af-remove',
//     	    text: '제품 삭제',
//     	    disabled: true,
//     	    handler: function(widget, event) {
//     	    	Ext.MessageBox.show({
//     	            title:'삭제하기',
//     	            msg: '선택한 항목을 삭제하시겠습니까?',
//     	            buttons: Ext.MessageBox.YESNO,
//     	            fn: gm.me().deleteAssyConfirm,
//     	            // animateTarget: 'mb4',
//     	            icon: Ext.MessageBox.QUESTION
//     	        });
//     	    }
//     	});
    	  	
//     	this.editAssyAction = Ext.create('Ext.Action', {
//     		itemId:'editAssyAction',
//     		iconCls: 'af-edit',
//     		disabled: true,
//     	    text: '제품 수정',
//     	    handler: function(widget, event) {
    	    	
    	    	
//     	    	var uniqueId = parent;
//     	    	var classCode = gm.me().classCode;
//     	    	var itemCode = gm.me().itemCode;
//     	    	var modelNo = gm.me().modelNo;
//     	    	var description = gm.me().description;	
//     			var lineGap = 30;
//     			var bHeight = 250;
    					
//     			    	var inputItem= [];
//     			    	inputItem.push(
//     			    	{
//     						xtype: 'textfield',
//     						name: 'classCode',
//     						fieldLabel: '분류코드',
//     						allowBlank:false,
//     						value: classCode,
//     						anchor: '-5',
//     						// readOnly : true,
//     						fieldStyle : 'background-color: #ddd; background-image: none;'
//     					});
//     			    	inputItem.push(
//     					    	{
//     								xtype: 'textfield',
//     								name: 'itemCode',
//     								fieldLabel: '품목코드',
//     								allowBlank:false,
//     								value: itemCode,
//     								anchor: '-5',
//     								readOnly : true,
//     								fieldStyle : 'background-color: #ddd; background-image: none;'
//     							});
//     			    	inputItem.push(
//     			    	{
//     						xtype: 'textfield',
//     						name: 'modelNo',
//     						fieldLabel: '자재',
//     						allowBlank:true,
//     						value: modelNo,
//     						anchor: '-5',
//     						editable:true// ,
//     						// readOnly : false
//     						// ,
//     						// fieldStyle : 'background-color: #ddd;
// 							// background-image: none;'
//     					});
    			    	
//     			    	inputItem.push(
//     			    			{
//     			                    fieldLabel: '상세사양',
//     			                    x: 5,
//     			                    y: 0 + 3*lineGap,
//     			                    name: 'description',
//     			                    value: description,
//     			                    // readOnly : false,
//     			                    allowBlank:true,
//     			                    editable:true,
//     			                    anchor: '-5'  // anchor width by
// 													// percentage
//     			                }
//     			    			);
    			
    			    	
//     			    	var form = Ext.create('Ext.form.Panel', {
//     			    		id: 'modformPanel-DBM7',
//     			            defaultType: 'textfield',
//     			            border: false,
//     			            bodyPadding: 15,
//     			            width: 400,
//     			            height: bHeight,
//     			            defaults: {
//     			                // anchor: '100%',
//     			                editable:false,
//     			                allowBlank: false,
//     			                msgTarget: 'side',
//     			                labelWidth: 100
//     			            },
//     			             items: inputItem
//     			        });
//     			        var win = Ext.create('ModalWindow', {
//     			            title: '제품정보수정',
//     			            width: 400,
//     			            height: bHeight,
//     			            minWidth: 250,
//     			            minHeight: 180,
//     			            items: form,
//     			            buttons: [{
//     			                text: CMD_OK,
//     			            	handler: function(){
//     			                    var form = Ext.getCmp('modformPanel-DBM7').getForm();
//     			                    if(form.isValid())
//     			                    {
//     			                	var val = form.getValues(false);

//     			                	Ext.Ajax.request({
//     			            			url: CONTEXT_PATH + '/purchase/material.do?method=update',
//     			            			params:{
			            				
//     			            				id : uniqueId,
//     			            				model_no : val['modelNo'],
//     			            				description : val['description'],
//     			                			standard_flag : 'A'

//     			            			},
//     			            			success : function(result, request) {                	
//     					                 	productlist.store.getProxy().setExtraParam('class_code', gm.me().classCode);
//     					                 	productlist.store.load();
//     			            			},
//     			            			failure: extjsUtil.failureMessage
//     			            		});
    			                	 
//     		                       	if(win) 
//     		                       	{
//     		                       		win.close();
//     		                       	} 
//     			                    } else {
//     			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
//     			                    }

//     			                  }
//     			            },{
//     			                text: CMD_CANCEL,
//     			            	handler: function(){
//     			            		if(win) {
//     			            			win.close();
//     			            		}
//     			            	}
//     			            }]
//     			        });
//     			        win.show(/* this, function(){} */);
//     	    } // endofhandler
//     	});

// //    	this.addAssyAction = Ext.create('Ext.Action', {
// //    		itemId:'addAssyAction',
// //    		iconCls:'af-plus-circle',
// //    		disabled: true,
// //    	    text: CMD_ADD,
// //    	    handler: function(widget, event) {
// //    	    	
// //    	    	console_log('assy_pj_code Value : '+ gm.me().assy_pj_code);
// //  	    	    	    	
// //    	    	var myCellEditor = Ext.create('Ext.grid.plugin.CellEditing', {
// //		    	        	clicksToEdit: 2
// //		    	        });	
// //    	    	var mtrlSelModel = Ext.create("Ext.selection.CheckboxModel", {} );
// //    			gm.me().addMtrlGrid =
// //    		    	Ext.create('Rfx.view.grid.MaterialTableGridHeavySub', {
// //    		    	 // id:'DBM7-Mtrl',
// //    				 title: '자재',// cloud_product_class,
// //    				 border: true,
// //    		         resizable: true,
// //    		         collapsible: true,
// //    			     multiSelect: true,
// //    			     plugins: [myCellEditor],
// //    			     // scroll:true,
// //    			     // overflowY: true,
// // 					 // autoScroll: true,
// //    			     height: "100%",
// //    			     selModel: mtrlSelModel,
// //    		         store: gm.me().materialStore,
// //    		         // layout :'fit',
// //    		         // forceFit: true,
// //    		            dockedItems: [
// //    		            {
// //    					    dock: 'top',
// //    					    xtype: 'toolbar',
// //    					    cls: 'my-x-toolbar-default2',
// //    						items: [
// //    						        this.addAssyAction, 
// //    						        this.editAssyAction// ,
// //    						        // this.removeAssyAction//,
// //    						        // '->',
// //    						        // this.expandAllTreeAction
// //    						        ]
// //    					},
// //    					{
// //    					    dock: 'top',
// //    					    xtype: 'toolbar',
// //    					    cls: 'my-x-toolbar-default5',
// //    						items: [{
// //    				    		id:'DBM7-MrtlLV1',
// //    					    	xtype: 'combo',
// //    					    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    					        mode: 'local',
// //    					        editable:false,
// //    					        // allowBlank: false,
// //    					        width: '25%',
// //    					        queryMode: 'remote',
// //    					        emptyText:'대분류',
// //    					        displayField:   'class_name',
// //    					        valueField:     'class_code',
// //    					        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 1, identification_code: 'MT'} ),
// //    					        listConfig:{
// //    					            	getInnerTpl: function(){
// //    					            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    					            	}
// //    					        },
// //    					        listeners: {
// //    						           select: function (combo, record) {
// //    					                 	console_log('Selected Value : ' + combo.getValue());
// //    					                 	console_logs('record : ', record);
// //    					                 	var class_code = record.get('class_code');
// //    					                 	console_logs('class_code : ', class_code);
// //    					                 	var claastlevel2 = Ext.getCmp('DBM7-MrtlLV2');
// //    					                 	var claastlevel3 = Ext.getCmp('DBM7-MrtlLV3');
// //    					                 	claastlevel2.clearValue();
// //    					                 	claastlevel2.store.removeAll();
// //    					                 	claastlevel3.clearValue();
// //    					                 	claastlevel3.store.removeAll();
// //    					                 	
// //    					                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
// //    					                 	claastlevel2.store.load();
// //    					                 	
// //    					                 	gm.me().materialStore.getProxy().setExtraParam('class_code', class_code);
// //    					                 	gm.me().materialStore.load();
// //
// //    						           }
// //    					        }
// //    				    	
// //    				    	},{
// //    				    		id:'DBM7-MrtlLV2',
// //    					    	xtype: 'combo',
// //    					    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    					        mode: 'local',
// //    					        editable:false,
// //    					        // allowBlank: false,
// //    					        width: '25%',
// //    					        queryMode: 'remote',
// //    					        emptyText:'중분류',
// //    					        displayField:   'class_name',
// //    					        valueField:     'class_code',
// //    					        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 2, identification_code: 'MT'}),
// //    					        listConfig:{
// //    					            	getInnerTpl: function(){
// //    					            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    					            	}
// //    					           },
// //    						        listeners: {
// //    							           select: function (combo, record) {
// //    						                 	console_log('Selected Value : ' + combo.getValue());
// //    						                 	console_logs('record : ', record);
// //    						                 	var class_code = record.get('class_code');
// //    						                 	var claastlevel3 = Ext.getCmp('DBM7-MrtlLV3');
// //    						                 	var materiallist = Ext.getCmp('DBM7-Mtrl');
// //    						                 	
// //    						                 	claastlevel3.clearValue();
// //    						                 	claastlevel3.store.removeAll();
// //    						                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
// //    					 	                 	claastlevel3.store.load();
// //    						                 	// materiallist.store.getProxy().setExtraParam('class_code2',
// //												// class_code);
// //    						                 	// materiallist.store.load();
// //    					 	                 	gm.me().materialStore.getProxy().setExtraParam('class_code', class_code);
// //        					                 	gm.me().materialStore.load();
// //    						                 	
// //    							           }
// //    						        }
// //    				    	
// //    				    	},{
// //    				    		id:'DBM7-MrtlLV3',
// //    					    	xtype: 'combo',
// //    					    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    					        mode: 'local',
// //    					        editable:false,
// //    					        // allowBlank: false,
// //    					        width: '25%',
// //    					        queryMode: 'remote',
// //    					        emptyText:'소분류',
// //    					        displayField:   'class_name',
// //    					        valueField:     'class_code',
// //    					        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 3, identification_code: 'MT'} ),
// //    					        listConfig:{
// //    					            	getInnerTpl: function(){
// //    					            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    					            	}
// //    					           },listeners: {
// //    						           select: function (combo, record) {
// //    					                 	console_log('Selected Value : ' + combo.getValue());
// //    					                 	console_logs('record : ', record);
// //    					                 	var class_code = record.get('class_code');
// //    					                 	var materiallist = Ext.getCmp('DBM7-Mtrl');
// //    					                 	
// //    					                 	gm.me().materialStore.getProxy().setExtraParam('class_code', class_code);
// //    					                 	gm.me().materialStore.load();
// //    						           }
// //    					        }
// //    				    	
// //    				    	}  ]
// //    					}
// //    		    	] // dockedItems of End
// //    				
// //    			
// //    			});// productGrid of End
// //
// //    			var myCellEditor2 = Ext.create('Ext.grid.plugin.CellEditing', {
// //    	        	clicksToEdit: 1
// //    	        });
// //    			gm.me().addPrdGrid =
// //    		    	Ext.create('Rfx.view.company.hanaro.ProduceMgmt.ProductTableGridHeavyHanaro', {
// //    		    	 id:'DBM7-PRD',
// //    				 title: '제품',// cloud_product_class,
// //    				 border: true,
// //    		         resizable: true,
// //    		         collapsible: true,
// //    			     multiSelect: true,
// //    			     height: "100%",
// //    			     plugins: [myCellEditor2],
// //    			     selModel: Ext.create("Ext.selection.CheckboxModel", {} ),
// //    		         store: gm.me().productSubStore,
// //// layout :'fit',
// //// forceFit: true,
// //    		         dockedItems: [{
// //    		       				    dock: 'top',
// //    		       				    xtype: 'toolbar',
// //    		       				    cls: 'my-x-toolbar-default2',
// //    		       					items: [
// //    		       					        this.addAssyAction, 
// //    		       					        this.editAssyAction, 
// //    		       					        // this.removeAssyAction,
// //    		       					        '->', 
// //    		       					        // this.expandAllTreeAction
// //    		       					        ]
// //    		       				},
// //    		       				{
// //    		       				    dock: 'top',
// //    		       				    xtype: 'toolbar',
// //    		       				    cls: 'my-x-toolbar-default5',
// //    		       					items: [{
// //    		       			    		id:'DBM7-PRDLV1',
// //    		       				    	xtype: 'combo',
// //    		       				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    		       				        mode: 'local',
// //    		       				        editable:false,
// //    		       				        // allowBlank: false,
// //    		       				        width: '15%',
// //    		       				        queryMode: 'remote',
// //    		       				        emptyText:'대분류',
// //    		       				        displayField:   'class_name',
// //    		       				        valueField:     'class_code',
// //    		       				        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 1, identification_code: 'PD'} ),
// //    		       				        listConfig:{
// //    		       				            	getInnerTpl: function(){
// //    		       				            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    		       				            	}
// //    		       				        },
// //    		       				        listeners: {
// //    		       					           select: function (combo, record) {
// //    		       				                 	console_log('Selected Value : ' + combo.getValue());
// //    		       				                 	console_logs('여기+++++++++++++++++++++++++++++ : ', record);
// //    		       				                 	console_logs('record : ', record);
// //    		       				                 	var class_code = record.get('class_code');
// //    		       				                 	var claastlevel2 = Ext.getCmp('DBM7-PRDLV2');
// //    		       				                 	var claastlevel3 = Ext.getCmp('DBM7-PRDLV3');
// //    		       				                 	var claastlevel4 = Ext.getCmp('DBM7-PRDLV4');
// //    		       				                 	var productlist = Ext.getCmp('DBM7-PRD');
// //    		       				                 	
// //    		       				                 	claastlevel2.clearValue();
// //    		       				                 	claastlevel2.store.removeAll();
// //    		       				                 	claastlevel3.clearValue();
// //    		       				                 	claastlevel3.store.removeAll();
// //    		       				                 	claastlevel4.clearValue();
// //    		       				                 	claastlevel4.store.removeAll();
// //    		       				                 	
// //    		       				                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
// //    		       				                 	claastlevel2.store.load();
// //    		       				                 	
// //    		       				                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
// //    		       				                 	productlist.store.load();
// //
// //    		       					           }
// //    		       				        }
// //    		       			    	
// //    		       			    	},{
// //    		       			    		id:'DBM7-PRDLV2',
// //    		       				    	xtype: 'combo',
// //    		       				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    		       				        mode: 'local',
// //    		       				        editable:false,
// //    		       				        // allowBlank: false,
// //    		       				        width: '15%',
// //    		       				        queryMode: 'remote',
// //    		       				        emptyText:'중분류',
// //    		       				        displayField:   'class_name',
// //    		       				        valueField:     'class_code',
// //    		       				        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 2, identification_code: 'PD'}),
// //    		       				        listConfig:{
// //    		       				            	getInnerTpl: function(){
// //    		       				            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    		       				            	}
// //    		       				           },
// //    		       					        listeners: {
// //    		       						           select: function (combo, record) {
// //    		       					                 	console_log('Selected Value : ' + combo.getValue());
// //    		       					                 	console_logs('record : ', record);
// //    		       					                 	var class_code = record.get('class_code');
// //    		       					                 	var claastlevel3 = Ext.getCmp('DBM7-PRDLV3');
// //    		       					                 	var claastlevel4 = Ext.getCmp('DBM7-PRDLV4');
// //    		       					                 	var productlist = Ext.getCmp('DBM7-PRD');
// //    		       					                 	
// //    		       					                 	claastlevel3.clearValue();
// //    		       					                 	claastlevel3.store.removeAll();
// //    		       					                 	claastlevel4.clearValue();
// //    		       					                 	claastlevel4.store.removeAll();
// //    		       					                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
// //    		       					                 	claastlevel3.store.load();
// //    		       					                 	
// //    		       					                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
// //    		       					                 	productlist.store.load();
// //    		       					                 	
// //    		       						           }
// //    		       					        }
// //    		       			    	
// //    		       			    	} ,{
// //    		       			    		id:'DBM7-PRDLV3',
// //    		       				    	xtype: 'combo',
// //    		       				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    		       				        mode: 'local',
// //    		       				        editable:false,
// //    		       				        // allowBlank: false,
// //    		       				        width: '15%',
// //    		       				        queryMode: 'remote',
// //    		       				        emptyText:'소분류',
// //    		       				        displayField:   'class_name',
// //    		       				        valueField:     'class_code',
// //    		       				        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 3, identification_code: 'PD'} ),
// //    		       				        listConfig:{
// //    		       				            	getInnerTpl: function(){
// //    		       				            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    		       				            	}
// //    		       				           },
// //    		       					        listeners: {
// //    		       						           select: function (combo, record) {
// //    		       					                 	console_log('Selected Value : ' + combo.getValue());
// //    		       					                 	console_logs('record : ', record);
// //    		       					                 	var class_code = record.get('class_code');
// //    		       					                 	var claastlevel4 = Ext.getCmp('DBM7-PRDLV4');
// //    		       					                 	var productlist = Ext.getCmp('DBM7-PRD');
// //    		       					                 	
// //    		       					                 	claastlevel4.clearValue();
// //    		       					                 	claastlevel4.store.removeAll();
// //    		       					                 	claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
// //    		       					                 	claastlevel4.store.load();
// //    		       					                 	
// //    		       					                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
// //    		       					                 	productlist.store.load();
// //    		       					                 	
// //    		       						           }
// //    		       					        }
// //    		       			    	
// //    		       			    	},{
// //    		       			    		id:'DBM7-PRDLV4',
// //    		       				    	xtype: 'combo',
// //    		       				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// //    		       				        mode: 'local',
// //    		       				        editable:false,
// //    		       				        // allowBlank: false,
// //    		       				        width: '15%',
// //    		       				        queryMode: 'remote',
// //    		       				        emptyText:'상세분류',
// //    		       				        displayField:   'class_name',
// //    		       				        valueField:     'class_code',
// //    		       				        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 4, identification_code: 'PD'} ),
// //    		       				        listConfig:{
// //    		       				            	getInnerTpl: function(){
// //    		       				            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
// //    		       				            	}
// //    		       				           },listeners: {
// //    		       					           select: function (combo, record) {
// //    		       				                 	console_log('Selected Value : ' + combo.getValue());
// //    		       				                 	console_logs('record : ', record);
// //    		       				                 	var class_code = record.get('class_code');
// //    		       				                 	var productlist = Ext.getCmp('DBM7-PRD');
// //    		       				                 	
// //    		       				                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
// //    		       				                 	productlist.store.load();
// //    		       					           }
// //    		       				        }
// //    		       			    	
// //    		       			    	}  ]
// //    		       				}
// //    		       	    	] // dockedItems of End
// //    				
// //    			
// //    			});// productGrid of End
// //    			 			
// //				var lineGap = 30;
// //				var bHeight = 480;
// //				
// //		    	var inputItem= [];
// //		    	
// //		    	var tabItems = [];
// //		    	inputItem.push(
// //		    	{
// //					xtype: 'textfield',
// //					name: 'classCode',
// //					fieldLabel: '분류코드',
// //					allowBlank:false,
// //					anchor: '-5',
// //					// readOnly : true,
// //					fieldStyle : 'background-color: #ddd; background-image: none;'
// //				});
// //		    	
// //		    	var mtrltabs = new Ext.TabPanel({
// //		    		layout: 'border',
// //		    	    xtype:'tabpanel',
// //		    	    activeTab: 0,
// //		    	    items: [gm.me().addMtrlGrid, gm.me().addPrdGrid]
// //		    	});
// //
// //		    	var form = Ext.create('Ext.panel.Panel', {
// //		    		// id: 'modformPanel-DBM7',
// //		            defaultType: 'textfield',
// //		            border: false,
// //		            // bodyPadding: 15,
// //		            width: 1024,
// //		            height: bHeight,
// //		            layout:'fit',
// //		            // margins: '0 0 10 0',
// //		            scroll: true,
// //					autoScroll: true,
// //		            defaults: {
// //		                // anchor: '100%',
// //		                editable:false,
// //		                allowBlank: false,
// //		                msgTarget: 'side',
// //		                labelWidth: 100
// //		            },
// //		             items: [mtrltabs]
// //		        });
// //		    	
// //		    	
// //		        var win = Ext.create('ModalWindow', {
// //		            title: '하위자재등록',
// //		            width: 1024,
// //		            height: 550,// bHeight+30,
// //// minWidth: 250,
// //// minHeight: 180,
// //		            items: form,
// //		            buttons: [{
// //		                text: gm.getMC('CMD_Enrollment', '등록'),
// //		            	handler: function(){
// //		            					
// //		            		console_logs('gm.me().addMtrlGrid', gm.me().addMtrlGrid);
// //		            		console_logs('gm.me().addMtrlGrid.getSelectionModel()', gm.me().addMtrlGrid.getSelectionModel());
// //		            		console_logs('gm.me().addMtrlGrid.getSelectionModel().selected()', gm.me().addMtrlGrid.getSelectionModel().selected.items);
// //
// //		            		
// //		            		// console_logs();
// //
// //		            		
// //		            		var selections = gm.me().addMtrlGrid.getSelectionModel().selected.items;
// //		            		
// //		            		if(selections==null || selections.length==0) {
// //		            			console_logs('자재 selections', selections);
// //		            		} else {
// //	    		        		 var mtrlChilds = [];
// //	    		        		 var bmQuans = []; 
// //	    		        		 var itemCodes = [];
// //	    		        		 var spCode=null;
// //	    		        		 
// //	    		        		 var ids = [];
// //	    		        		 var levels = []; 
// //	    		        		 var bomYNs = [];
// //	    		        		 var pcr_divs = [];
// //		                		for(var i=0; i<selections.length; i++) {
// //	    		        		 console_logs('rec>>>>>>>>>>>>>',rec);
// //		    		        		 
// //	    	                          var rec = selections[i];
// //	    	                          var uid =  rec.get('unique_id');  // CARTMAP
// //																		// unique_id
// //	    	                          mtrlChilds.push(uid);
// //	    	                          var bm_quan = rec.get('bm_quan');  
// //	    	                          if(bm_quan==null||bm_quan==0){
// //	    	                        	  bmQuans.push(1);
// //	    	                          }else{
// //	    	                        	  bmQuans.push(bm_quan);
// //	    	                          }
// //	    	                          var item_code = rec.get('item_code');
// //	    	                          itemCodes.push(item_code);	
// //	    	                          spCode='M';
// //	    	                          
// //	    	                          var id = rec.get('hier_pos');  
// //	    	                          if(id==null||id==0){
// //	    	                        	  ids.push('');
// //	    	                          }else{
// //	    	                        	  ids.push(id);
// //	    	                          }
// //	    	                          
// //	    	                          var level = rec.get('reserved_integer1');  
// //	    	                          if(level==null||level==0){
// //	    	                        	  levels.push('');
// //	    	                          }else{
// //	    	                        	  levels.push(level);
// //	    	                          }
// //	    	                          var bomYN = rec.get('reserved6');  
// //	    	                          if(bomYN==null||bomYN==0){
// //	    	                        	  bomYNs.push('');
// //	    	                          }else{
// //	    	                        	  bomYNs.push(bomYN);
// //	    	                          }
// //	    	                          
// //	    	                          var pcr_div = rec.get('request_comment');  
// //	    	                          if(pcr_div==null||pcr_div==0){
// //	    	                        	  pcr_divs.push('');
// //	    	                          }else{
// //	    	                        	  pcr_divs.push(pcr_div);
// //	    	                          }
// //	    		        		 gm.me().arrAssyInfo(mtrlChilds, bmQuans, itemCodes, spCode, ids, levels, bomYNs, pcr_divs);
// //		                		}      
// //		                			
// //		            		}
// //			            		var selections2 = gm.me().addPrdGrid.getSelectionModel().selected.items;
// //			            		
// //			            		console_logs('gm.me().addPrdGrid', gm.me().addPrdGrid);
// //			            		console_logs('gm.me().addPrdGrid.getSelectionModel()', gm.me().addPrdGrid.getSelectionModel());
// //			            		console_logs('gm.me().addPrdGrid.getSelectionModel().selected()', gm.me().addPrdGrid.getSelectionModel().selected.items);
// //			            		
// //			            		if(selections2==null || selections2.length==0) {
// //			            			
// //			            		} else {
// //		    	        				var mtrlChilds = [];
// //		    	        				var bmQuans = []; 
// //		    	        				var itemCodes = [];
// //		    	        				var spCode=null;
// //		    	        				
// //		    	        				var ids = [];
// //			    		        		 var levels = []; 
// //			    		        		 var bomYNs = [];
// //			    		        		 var pcr_divs = [];
// //		    	        				for(var i=0; i< selections2.length; i++) {
// //		    	        					var rec = selections2[i];
// //		    	        					var uid =  rec.get('unique_id');  // CARTMAP
// //																				// unique_id
// //		    	        					mtrlChilds.push(uid);
// //		    	        					var bm_quan = rec.get('bm_quan');
// //		    	        					if(bm_quan==null||bm_quan==0){
// //		    	        						bmQuans.push(1);
// //		    	        					}else{
// //		    	        						bmQuans.push(bm_quan);
// //		    	        					}
// //		    	        					var item_code = rec.get('item_code');
// //			   	                          	itemCodes.push(item_code);
// //		    	        				}
// //		    	        				spCode='P';
// //		    	        				 var id = rec.get('hier_pos');  
// //		    	                          if(id==null||id==0){
// //		    	                        	  ids.push(1);
// //		    	                          }else{
// //		    	                        	  ids.push(id);
// //		    	                          }
// //		    	                          
// //		    	                          var level = rec.get('reserved_integer1');  
// //		    	                          if(level==null||level==0){
// //		    	                        	  levels.push(1);
// //		    	                          }else{
// //		    	                        	  levels.push(level);
// //		    	                          }
// //		    	                          var bomYN = rec.get('reserved6');  
// //		    	                          if(bomYN==null||bomYN==0){
// //		    	                        	  bomYNs.push(1);
// //		    	                          }else{
// //		    	                        	  bomYNs.push(bomYN);
// //		    	                          }
// //		    	                          var pcr_div = rec.get('request_comment');  
// //		    	                          if(pcr_div==null||pcr_div==0){
// //		    	                        	  pcr_divs.push('');
// //		    	                          }else{
// //		    	                        	  pcr_divs.push(pcr_div);
// //		    	                          }
// //		    		        		 gm.me().arrAssyInfo(mtrlChilds, bmQuans, itemCodes, spCode, ids, levels, bomYNs, pcr_divs);
// //			                			
// //			            		}
// //		            		
// //		                		console_logs('child_uid/child_item_code',gm.me().mtrlChilds+'/'+gm.me().itemCodes);
// //		                		console_logs('parent_uid/parent_item_code',gm.me().parent+'/'+gm.me().itemCode);
// //		                		console_logs('pcr_div', gm.me().pcr_divs);
// //		                	Ext.Ajax.request({
// //		            			url: CONTEXT_PATH + '/purchase/material.do?method=addChildBOM',
// //		            			params:{
// //		            				parent : gm.me().parent,
// //		            				child : gm.me().mtrlChilds,
// //		            				reserved_varchar1 : gm.me().reserved_varchar1,
// //		            				bm_quans : gm.me().bmQuans,
// //		                    		item_codes : gm.me().itemCodes,
// //		                    		sp_code : gm.me().spCode, 
// //		                    		ids : gm.me().ids, 
// //		                    		levels : gm.me().levels, 
// //		                    		// bomYNs : gm.me().bomYNs,
// //		                    		pcr_divs : gm.me().pcr_divs
// //		            			},
// //
// //		                		success : function(result, request) {   
// //// mesProjectTreeStore.load({
// //// callback: function(records, operation, success) {
// //// console_log('load tree store');
// //// console_log('ok');
// //// pjTreeGrid.setLoading(false);
// //// // treepanel.expandAll();
// //// }
// //// });
// //		                			gm.me().arrAssyInfo(null, null, null);
// //		                			gm.me().addMtrlGrid.selModel.deselectAll();
// //		                			gm.me().addPrdGrid.selModel.deselectAll();
// //		                			gm.me().store.getProxy().setExtraParam('parent', gm.me().parent);
// //			   	        		 	gm.me().store.load();				                 	
// //		            				Ext.MessageBox.alert('성공','하위자재가 정상적으로 등록 되었습니다.');
// //		            				
// //		            			},
// //		            			failure: extjsUtil.failureMessage
// //		            		});
// //		                	 
// //// if(win)
// //// {
// //// win.close();
// //// }
// //// } else {
// //// Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
// //// }
// //
// //		                  }
// //		            },{
// //		                text: CMD_CANCEL,
// //		            	handler: function(){
// //		            		if(win) {
// //		            			win.close();
// //		            			// assymap 로딩 추가해야됨.
// //		            		}
// //		            	}
// //		            }]
// //		        });
// //		        win.show(/* this, function(){} */);
// //    	     }
// //    	});
    	
//         this.addAssyAction = Ext.create('Ext.Action', {
//             itemId: 'addAssyAction',
//             iconCls: 'af-plus-circle',
//             disabled: false,
//             text: '제품 등록',
//             handler: function(widget, event) {

//                 console_logs('gm.me().selected_tree_record', gm.me().selected_tree_record);

//                 var pre_item_code = '0100000002-' + gu.yyyymmdd(new Date(), '');
//                 var child = -1;
//                 var ac_uid = -1;
//                 var unique_uid = -1;
//                 var assy_name = '제품등록';
//                 Ext.Ajax.request({
//                     url: CONTEXT_PATH + '/purchase/material.do?method=getNextItemcode',
//                     params: {
//                     	pre_item_code: pre_item_code
//                     },
//                     success: function(result, request) {
//                         console_logs('result.responseText', result);
//                         var vItemcode = result.responseText;

//                         var lineGap = 30;
//                         var bHeight = 300;
//                         var inputItem = [];
//                         inputItem.push(new Ext.form.Hidden({
//                         	value: child,
//                             name: 'child'
//                         })); 
//                         inputItem.push(new Ext.form.Hidden({
//                         	value: ac_uid,
//                             name: 'ac_uid'
//                         })); 
//                         inputItem.push(new Ext.form.Hidden({
//                         	value: gm.me().selectedPjCode,
//                             name: 'pj_code'
//                         })); 
//                       inputItem.push({
// 	                      xtype: 'textfield',
// 	                      	id: gu.id('target_item_code'),
// 	                    	name: 'target_item_code',
// 	                    	emptyText: '자동 생성',
// 	                      fieldLabel: '제품 코드',
//                           readOnly: true,
//                           fieldStyle: 'background-color: #EAEAEA; background-image: none;',
// 	                      anchor: '-5',
// 	                      value: vItemcode
// 	                  });
//                       inputItem.push({
//                           xtype: 'textfield',
//                           id: gu.id('target_assy_name'),
//                           name: 'assy_name',
//                           fieldLabel: '제품 명',
//                           allowBlank: false,
//                           anchor: '-5'
//                       });
                      
//                       inputItem.push({
//                           xtype: 'textfield',
//                           id: gu.id('target_assy_specification'),
//                           name: 'assy_specification',
//                           fieldLabel: '제품 규격',
//                           allowBlank: false,
//                           anchor: '-5'
//                       });
                      
//                       inputItem.push(new Ext.form.Hidden({
//                     	  id: gu.id('target_child'),
//                           name: 'target_child',
//                           value: -1
//                       })); 
                      
//                       inputItem.push(new Ext.form.Hidden({
//                           name: 'unique_uid',
//                           value: -1
//                       }));
                        
//                         inputItem.push({
//                             xtype: 'numberfield',
//                             name: 'alter_reason',
//                             fieldLabel: 'REV.',
//                             allowBlank: false,
//                             value: 1,
//                             anchor: '-5'
//                         });
//                       inputItem.push({
// 	                      xtype: 'textfield',
// 	                      name: 'comment',
// 	                      fieldLabel: '등록자',
// 	                      value: vCUR_USER_NAME,
// 	                      allowBlank: false,
// 	                      fieldStyle: 'text-align: right;',
// 	                      anchor: '-5'
// 	                  });
//                       inputItem.push({
// 	                      xtype: 'textfield',
// 	                      name: 'model_no',
// 	                      fieldLabel: '등록일자',
// 	                      value: gu.yyyymmdd(new Date(), '-') + ' ' + gu.hhmmss(new Date()),
// 	                      allowBlank: false,
// 	                      fieldStyle: 'text-align: right;',
// 	                      anchor: '-5'
// 	                  });
//                         gm.me().createAssyForm = Ext.create('Ext.form.Panel', {
//                             defaultType: 'textfield',
//                             border: false,
//                             bodyPadding: 15,
//                             width: 400,
//                             height: bHeight,
//                             bodyPadding: 15,
//                             defaults: {
//                                 // anchor: '100%',
//                                 editable: true,
//                                 allowBlank: false,
//                                 msgTarget: 'side',
//                                 labelWidth: 100
//                             },
//                             items: inputItem
//                         });
                        
                        
//                         var win = Ext.create('ModalWindow', {
//                             title: '제품 추가 등록',
// //                            header: {
// //                                titlePosition: 2//,
// //                                //titleAlign: 'center'
// //                            },
//                             width: 400,
//                             height: bHeight,
//                             minWidth: 250,
//                             minHeight: 180,
//                             //maximizable: true,
//                             items:gm.me().createAssyForm,
                            
//                             buttons: [{
//                                 text: CMD_OK,
//                                 handler: function() {
//                                     var form = gm.me().createAssyForm;
//                                     if (form.isValid()) {
//                                         var val = form.getValues(false);
                                        
//                                         Ext.Ajax.request({
//                                             url: CONTEXT_PATH + '/design/bom.do?method=createTemplateAssy',
//                                             params: {
//                                             	parent_uid: -1,
//                                                 parent: -1,
//                                                 ac_uid: -1,
//                                                 pl_no: '---',
//                                                 bm_quan: 1,
//                                                 item_name: val['assy_name'],
//                                                 item_code: val['target_item_code'],
//                                                 alter_reason: 'R' + val['alter_reason'],
//                                                 comment: val['comment'],
//                                                 model_no: val['model_no'],
//                                                 pj_code: '',
//                                                 child: -1,
//                                                 sg_code:'BOM',
//                                                 bom_flag : 'T'
                                                	
//                                             },
//                                             success: function(result, request) {
                                            	
//                                             	gm.me().productStore.load();
//                                             },
//                                             failure: extjsUtil.failureMessage
//                                         });

//                                         if (win) {
//                                             win.close();
//                                         }
//                                     } else {
//                                         Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
//                                     }

//                                 }
//                             }, {
//                                 text: CMD_CANCEL,
//                                 handler: function() {
//                                     if (win) {
//                                         win.close();
//                                     }
//                                 }
//                             }]
//                         });
//                         win.show( /* this, function(){} */ );
//                     } // endofhandler
//                 });


//             },
//             failure: extjsUtil.failureMessage
//         });



//     	// Context Popup Menu
//     	this.contextMenu = Ext.create('Ext.menu.Menu', {
//     	    items: [ this.addAssyAction ,this.editAssyAction, this.removeAssyAction ]
//     	});
    	
    	
// 	    Ext.define('SrcAhd', {
// 		   	 extend: 'Ext.data.Model',
// 		   	 fields: [     
// 		       		 { name: 'unique_id', type: "string" }
// 		     		,{ name: 'item_code', type: "string"  }
// 		     		,{ name: 'item_name', type: "string"  }
// 		     		,{ name: 'specification', type: "string"  }
// 		     		,{ name: 'maker_name', type: "string"  }
// 		     		,{ name: 'description', type: "string"  }
// 		     		,{ name: 'specification_query', type: "string"  }
// 		     	  	  ],
// 		   	    proxy: {
// 		   			type: 'ajax',
// 		   	        api: {
// 		   	            read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
// 		   	        },
// 		   			reader: {
// 		   				type: 'json',
// 		   				root: 'datas',
// 		   				totalProperty: 'count',
// 		   				successProperty: 'success'
// 		   			}
// 		   		}
// 		   });    	
//     	this.searchStore = new Ext.data.Store({  
//     		pageSize: 16,
//     		model: 'SrcAhd',
//     		// remoteSort: true,
//     		sorters: [{
//                 property: 'specification',
//                 direction: 'ASC'
//             },
//             {
//                 property: 'item_name',
//                 direction: 'ASC'
//             }]

//     	});
    	

    	
// 		var myFormPanel = Ext.create('Ext.form.Panel', {
// 			id: 'addPartForm-DBM7',
// 			title: 'Part',
// 			xtype: 'form',
// 			frame: false,
// 	        border: false,
//             bodyPadding: 10,
//             autoScroll: true,
//             disabled: true,
// 	        defaults: {
// 	            anchor: '100%',
// 	            allowBlank: true,
// 	            msgTarget: 'side',
// 	            labelWidth: 60
// 	        },
// 	        // border: 0,
//             dockedItems: [
//               {
// 			      dock: 'top',
// 			    xtype: 'toolbar',
// 				items: [this.resetAction, '-', this.modRegAction/*
// 																 * , '-',
// 																 * copyRevAction
// 																 */]
// 			  }],
// 	        items: [{
// 				id :'search_information-DBM7',
// 				field_id :'search_information-DBM7',
// 		        name : 'search_information-DBM7',
// 	            xtype: 'combo',
// 	            emptyText: '규격으로 검색',
// 	            store: this.searchStore,
// 	            displayField: 'specification',
// 	            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
// 	            sortInfo: { field: 'specification', direction: 'ASC' },
// 	            minChars: 1,
// 	            typeAhead: false,
// 	            hideLabel: true,
// 	            hideTrigger:true,
// 	            anchor: '100%',

// 	            listConfig: {
// 	                loadingText: '검색중...',
// 	                emptyText: '일치하는 결과가 없습니다.',

// 	                // Custom rendering template for each item
// 	                getInnerTpl: function() {
// 	                    return '<div><a class="search-item" href="javascript:setBomData({id});">' +
// 	                        '<span style="color:#999;"><small>{item_code}</small></span> <span style="color:#999;">{item_name}</span><br />{specification_query} <span style="color:#999;"><small>{maker_name}</small></span>' +
// 	                    '</a></div>';
// 	                }
// 	            },
// 	            pageSize: 10
// 	        }, {
// 	            xtype: 'component',
// 	            style: 'margin-top:10px',
// 	            html: '먼저, 등록된 자재인지 검색하세요.<hr>'
// 	        }
// 	        ,
// 	        new Ext.form.Hidden({
//         		name: 'parent'
//         	}),
//         	new Ext.form.Hidden({
//         		name: 'ac_uid'
//         	}),
//         	new Ext.form.Hidden({
//         		name: 'pj_code'
//         	}),
//         	new Ext.form.Hidden({
//         		name: 'coord_key2'
//         	}),
//         	new Ext.form.Hidden({
//         		id: 'standard_flag-DBM7',
//         		name: 'standard_flag'
//         	}),
//         	new Ext.form.Hidden({
//         		name: 'child'
//         	}),
//         	new Ext.form.Hidden({
//         		name: 'sg_code',
//         		value:'NSD'
//         	}),
//         	new Ext.form.Hidden({
//         		name: 'hier_pos'
//         	}),
// 			new Ext.form.Hidden({
// 				name: 'assy_name',
// 				value:this.selectedAssyName
				
// 			}),
// 			new Ext.form.Hidden({
// 				name: 'pj_name',
// 				value:this.selectedPjName
// 			}),
// 			new Ext.form.Hidden({
// 				id: 'isUpdateSpec-DBM7',
// 				name: 'isUpdateSpec',
// 				value: 'false'
// 			}),
// 	        {
//           	   xtype: 'container',
//           	   layout: 'hbox',
//           	   margin: '10 0 5 0',
//    		        defaults: {
// 		            allowBlank: true,
// 		            msgTarget: 'side',
// 		            labelWidth: 60
// 		        },
//                items: [
//         				{	
//         					fieldLabel:    this.getColName('unique_id'),
//         		   			xtype:  'textfield', 
//         					id:'unique_id-DBM7',
//         					name: 'unique_id',
//         					emptyText: '자재 UID', 
//         					flex:1,
//         					readOnly: true,
//         					width: 300,
//         					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
//         		        },
//         				{	
//         		   			xtype:  'textfield',
//         					id:   'unique_uid-DBM7',
//         					name: 'unique_uid',
//         					emptyText: 'BOM UID', 
//         					flex:1,
//         					readOnly: true,
//         					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
//         		        }
//                ]
// 	        },
// 	        {	
// 	        	xtype:  'triggerfield',
// 				fieldLabel:    this.getColName('item_code'),
// 				id:  'item_code-DBM7',
// 				name: 'item_code',
// 				emptyText: '자동 생성',
// 				listeners : {
// 	          		specialkey : function(field, e) {
// 	          		if (e.getKey() == Ext.EventObject.ENTER) {
// 	          		}
// 	          	}
// 		      	},
// 		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger', 'onTrigger1Click': function() {
		          	
		        	  
// 		        	  var val = Ext.getCmp('item_code-DBM7').getValue();
// 		        	  if(val!=null && val!='') {
		        	  

// 		        		Ext.Ajax.request({
// 		        			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
// 		        			params:{
// 		        				item_code :val
// 		        			},
// 		        			success : function(result, request) {  
// 		        				var jsonData = Ext.decode(result.responseText);
// 		        				var records = jsonData.datas;
// 		        				if(records!=null && records.length>0) {
// 					        		modRegAction.enable();
// 					        		resetPartForm();
// 			        				setPartFormObj(records[0]);
// 		        				} else {
// 		        					Ext.MessageBox.alert('알림','알 수없는 자재번호입니다.');
// 		        				}

// 		        			},
// 		        			failure: extjsUtil.failureMessage
// 		        		});  
		        	  
		        	  
		        	  
		        	  
		        	  
// 		        	  }// endofif
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
// 		      	}
// 				// readOnly: true,
// 				// fieldStyle: 'background-color: #EAEAEA; background-image:
// 				// none;'
// 	        },
// 	        {

//                 id:           'standard_flag_disp-DBM7',
//                 name:           'standard_flag_disp',
//                 xtype:          'combo',
//                 mode:           'local',
//                 editable:       false,
//                 allowBlank: false,
//                 queryMode: 'remote',
//                 displayField:   'codeName',
//                 value:          '',
//                 triggerAction:  'all',
//                 fieldLabel: this.getColName('sp_code')+'*',
//                 store: this.commonStandardStore2,
//                 listConfig:{
//                 	getInnerTpl: function(){
//                 		return '<div data-qtip="{systemCode}">{codeName}</div>';
//                 	}			                	
//                 },
//  	               listeners: {
//      	                    select: function (combo, record) {
//      	                    	console_log('Selected Value : ' + combo.getValue());
//      	                    	console_logs('record : ', record);
//      	                    	var systemCode = record.get('systemCode');
//      	                    	var codeNameEn  = record.get('codeNameEn');
//      	                    	var codeName  = record.get('codeName');
//      	                    	console_log('systemCode : ' + systemCode 
//      	                    			+ ', codeNameEn=' + codeNameEn
//      	                    			+ ', codeName=' + codeName	);
//      	                    	Ext.getCmp('standard_flag-DBM7').setValue(systemCode);
     	                    	
//      	                    	gm.me().getPl_no(systemCode);
// // var prefix = systemCode;
//      	                    	var oClass_code1 = Ext.getCmp('class_code1-DBM7');
// 							 	if(systemCode=='S') {
// 							 		oClass_code1.setDisabled(false);
// 							 	} else {
// 							 		oClass_code1.setDisabled(true);
// 							 	}

//      	                    }
//      	               }
//             },
//             {
//                 fieldLabel: this.getColName('class_code'),
//                 id: 'class_code1-DBM7',
//                 name: 'class_code1',
//                 emptyText: '분류체계',
//                 xtype: 'combo',
//                 mode: 'local',
//                 editable: false,
//                 allowBlank: false,
//                 disabled: true,
//                 queryMode: 'remote',
//                 displayField: 'class_name',
//                 valueField: 'class_code',
//                 hidden: true,
//                 store: this.materialClassStore,
//                 listConfig:{
//                 	getInnerTpl: function(){
//                 		return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
//                 	}			                	
//                 },
// 	                listeners: {
// 	                    select: function (combo, record) {
// 	                    	console_log('Selected Value : ' + combo.getValue());
// 	                    	var class_code = record[0].get('class_code');
// 	                    	var class_name = record[0].get('class_name');
// 	                    	var rand = RandomString(10);
// 	                    	var item_code = class_code.substring(0,4) + '-' + rand.substring(0,7);
// 	                    	Ext.getCmp('item_code-DBM7').setValue(item_code);
// 	                    }
//  	            }
//             },
//             {
// 	            xtype: 'fieldset',
// 	            title: '품번* | 품명*', // panelSRO1139,
// 	            collapsible: false,
// 	            defaults: {
// 	                labelWidth: 40,
// 	                anchor: '100%',
// 	                layout: {
// 	                    type: 'hbox',
// 	                    defaultMargins: {top: 0, right: 3, bottom: 0, left: 0}
// 	                }
// 	            },
// 	            items: [

// 	                {
// 	                    xtype : 'fieldcontainer',
// 	                    combineErrors: true,
// 	                    msgTarget: 'side',
// 	                    defaults: {
// 	                        hideLabel: true
// 	                    },
// 	                    items : [     
// 		                {
// 		                    xtype: 'textfield',
// 		                    width:      50,
// 		                    emptyText: '품번*', 
// 		                    name : 'pl_no',
// 		                    id : 'pl_no-DBM7',
// 		                    fieldLabel: '품번',
// 		                    readOnly : false,
// 		                    allowBlank: false
// 		                },
// 		                {
// 		                    xtype: 'textfield',
// 		                    flex : 1,
// 		                    emptyText: '품명'+'*', 
// 		                    name : 'item_name',
// 		                    id : 'item_name-DBM7',
// 		                    fieldLabel: this.getColName('item_name'),
// 		                    readOnly : false,
// 		                    allowBlank: false
// 		                }
// 		            ]
// 			        }
// 			    ]
// 			},
//         {
//         	xtype:  'textfield',
//        	 	fieldLabel: this.getColName('specification')+'*',
//        	 	id: 'specification-DBM7',
//        	 	name: 'specification',
//             allowBlank: false
//        }
//         ,{
//         	xtype:  'textfield', 
//         	fieldLabel: this.getColName('maker_name'),
//             id: 'maker_name-DBM7',
//             name: 'maker_name',
//             allowBlank: true
// 		},{
// 		    id:           'model_no-DBM7',
// 		    name:           'model_no',
// 		    xtype:          'combo',
// 		    mode:           'local',
// 		    editable:       true,
// 		    allowBlank: true,
// 		    queryMode: 'remote',
// 		    displayField:   'codeName',
// 		    valueField:     'codeName',
// 		    triggerAction:  'all',
// 		    fieldLabel: this.getColName('model_no'),
// 		    store: this.commonModelStore,
// 		    listConfig:{
// 		    	getInnerTpl: function(){
// 		    		return '<div data-qtip="{systemCode}">{codeName}</div>';
// 		    	}			                	
// 		    },
// 		    listeners: {			load: function(store, records, successful,operation, options) {
// 				if(this.hasNull) {
// 					var blank ={
// 							systemCode:'',
// 							codeNameEn: '',
// 							codeName: ''
// 					};
// 					this.add(blank);
// 				}
// 			    },
// 		            select: function (combo, record) {
// 		            	console_log('Selected Value : ' + combo.getValue());
// 		            	var systemCode = record.get('systemCode');
// 		            	var codeNameEn  = record.get('codeNameEn');
// 		            	var codeName  = record.get('codeName');
// 		            	console_log('systemCode : ' + systemCode 
// 		            			+ ', codeNameEn=' + codeNameEn
// 		            			+ ', codeName=' + codeName	);
// 		            }
// 		       }
//         }
// 		,{
// 		    id:           'description-DBM7',
// 		    name:           'description',
// 		    xtype:          'combo',
// 		    mode:           'local',
// 		    editable:       true,
// 		    allowBlank: true,
// 		    queryMode: 'remote',
// 		    displayField:   'codeName',
// 		    valueField:     'codeName',
// 		    triggerAction:  'all',
// 		    fieldLabel: this.getColName('description'),
// 		    store: this.commonDescriptionStore,
// 		    listConfig:{
// 		    	getInnerTpl: function(){
// 		    		return '<div data-qtip="{systemCode}">{codeName}</div>';
// 		    	}			                	
// 		    },
// 		    listeners: {			load: function(store, records, successful,operation, options) {
// 				if(this.hasNull) {
// 					var blank ={
// 							systemCode:'',
// 							codeNameEn: '',
// 							codeName: ''
// 					};
					
// 					this.add(blank);
// 				}
// 			    },
// 		            select: function (combo, record) {
// 		            	console_log('Selected Value : ' + combo.getValue());
// 		            	var systemCode = record.get('systemCode');
// 		            	var codeNameEn  = record.get('codeNameEn');
// 		            	var codeName  = record.get('codeName');
// 		            	console_log('systemCode : ' + systemCode 
// 		            			+ ', codeNameEn=' + codeNameEn
// 		            			+ ', codeName=' + codeName	);
// 		            }
// 		       }
//         }
//         ,{
// 			xtype:  'textfield', 
// 			fieldLabel: this.getColName('comment'),
// 		    id: 'comment-DBM7',
// 		    name: 'comment',
// 		    allowBlank: true
// 		}
// 		,{
// 		    xtype: 'fieldset',
// 		    border: true,
// 		    // style: 'border-width: 0px',
// 		    // title: panelSRO1186+' | '+panelSRO1187+' | '+panelSRO1188+' |
// 			// 통화',//panelSRO1174,
// 		    collapsible: false,
// 		    defaults: {
// 		        labelWidth: 40,
// 		        anchor: '100%',
// 		        layout: {
// 		            type: 'hbox',
// 		            defaultMargins: {top: 0, right: 0, bottom: 0, left: 0}
// 		        }
// 		    },
// 		    items: [
		
// 		        {
// 		            xtype : 'fieldcontainer',
// 		            combineErrors: true,
// 		            msgTarget: 'side',
// 		            defaults: {
// 		                hideLabel: true
// 		            },
// 		            items : [
//                  {
//                      xtype: 'numberfield',
//                      minValue: 0,
//                      width : 50,
//                      id: 'bm_quan-DBM7',
//                      name : 'bm_quan',
//                      fieldLabel: this.getColName('bm_quan'),
//                      allowBlank: true,
//                      value: '1',
//                      margins: '0'
//                  },{
//                     width:          50,
//                     id:           'unit_code-DBM7',
//                     name:           'unit_code',
//                     xtype:          'combo',
//                     mode:           'local',
//                     editable:       false,
//                     allowBlank: false,
//                     queryMode: 'remote',
// 	                displayField:   'codeName',
// 	                valueField:     'codeName',
//                     value:          'PC',
//                     triggerAction:  'all',
//                     fieldLabel: this.getColName('unit_code'),
//                    store: this.commonUnitStore,
// 	                listConfig:{
// 	                	getInnerTpl: function(){
// 	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
// 	                	}			                	
// 	                },
//      	               listeners: {
//      	                    select: function (combo, record) {
//      	                    	console_log('Selected Value : ' + combo.getValue());
//      	                    	var systemCode = record.get('systemCode');
//      	                    	var codeNameEn  = record.get('codeNameEn');
//      	                    	var codeName  = record.get('codeName');
//      	                    	console_log('systemCode : ' + systemCode 
//      	                    			+ ', codeNameEn=' + codeNameEn
//      	                    			+ ', codeName=' + codeName	);
//      	                    }
//      	               }
//             },
//             {
//                 xtype: 'numberfield',
//                 minValue: 0,
//                 flex: 1,
//                 id : 'sales_price-DBM7',
//                 name : 'sales_price',
//                 fieldLabel: this.getColName('sales_price'),
//                 allowBlank: true,
//                 value: '0',
//                 margins: '0'
//             }, {
//                 width:         50,
//                 id:           'currency-DBM7',
//                 name:           'currency',
//                 xtype:          'combo',
//                 mode:           'local',
//                 editable:       false,
//                 allowBlank: false,
//                 queryMode: 'remote',
//                 displayField:   'codeName',
//                 valueField:     'codeName',
//                 value:          'KRW',
//                 triggerAction:  'all',
//                 fieldLabel: this.getColName('currency'),
//                 store: this.commonCurrencyStore,
//                 listConfig:{
//                 	getInnerTpl: function(){
//                 		return '<div data-qtip="{systemCode}">{codeName}</div>';
//                 	}			                	
//                 },
//                 listeners: {
// 	                    select: function (combo, record) {
// 	                    	console_log('Selected Value : ' + combo.getValue());
// 	                    	var systemCode = record.get('systemCode');
// 	                    	var codeNameEn  = record.get('codeNameEn');
// 	                    	var codeName  = record.get('codeName');
// 	                    	console_log('systemCode : ' + systemCode 
// 	                    			+ ', codeNameEn=' + codeNameEn
// 	                    			+ ', codeName=' + codeName	);
// 	                    }
// 	               }
//         }
//         ]
//         }
// 	    ]
// 	}
// 		,{
//             xtype: 'container',
//                                         type: 'hbox',
//                                         padding:'5',
//                                         pack:'end',
//                                         align:'left',
//             defaults: {
//             },
//             margin: '0 0 0 0',
//             border:false,
//             items: [
// 		        {
//                     xtype:'button',
//                     id: 'ok_btn_id-DBM7',
//                     text: CMD_OK,
// 		            handler: function() {
		            	
// 		            	var item_code = Ext.getCmp('item_code-DBM7').getValue();
// 			    		if(item_code==null || item_code.length==0) {
// 			    			item_code = this.selectedPjCode + this.selectedAssyCode + Ext.getCmp('pl_no-DBM7').getValue();
// 			    			Ext.getCmp('item_code-DBM7').setValue(item_code);
// 			    		}

		            	
// 		                this.up('form').getForm().isValid();


// 		            	var isUpdateSpec = Ext.getCmp('isUpdateSpec-DBM7').getValue();
// 		            	var specification = Ext.getCmp('specification-DBM7').getValue();
// 		            	var unique_id = Ext.getCmp('unique_id-DBM7').getValue();
// 		            	var standard_flag = Ext.getCmp('standard_flag-DBM7').getValue();
// 		            	var idx = specification.search(gm.me().CHECK_DUP);
// 		            	if(idx>-1) {
// 		            		Ext.MessageBox.alert('경고','가공품이 아니면 규격 수정이 필요합니다. 다시 한번 확인하세요.');
// 		            	} else {
// 			            	if( (isUpdateSpec=='true' || unique_id.length < 3)
			            			
// 			            			&& standard_flag !='O'
			            	
// 			            	) {// 중복체크 필요.
// 			            		Ext.Ajax.request({
// 			            			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialBySpecification',				
// 			            			params:{
// 			            				specification : specification
// 			            			},
// 			            			success : function(result, request) {
// 			            				var jsonData = Ext.decode(result.responseText);
// 			             				var found = jsonData['result'];
// 			             				var exist = Ext.getCmp('unique_id-DBM7').getValue();
			             				
// 			             				if(found.length>2 && exist != found ) {// 다른
// 																				// 중목자재
// 																				// 있음.
// 			             					Ext.MessageBox.alert('경고','표준 또는 메이커 자재에 이미 동일한 규격이 등록되어 있습니다.');
// 			             				} else {
// 			             					gm.me().addNewAction();
// 			    			                // resetPartForm();
// 			    			                // this.up('form').getForm().reset();
// 			             				}
// 			            			},// endof success for ajax
// 			            			failure: extjsUtil.failureMessage
// 			            		}); // endof Ajax
// 			            	} else {
// 			            		gm.me().addNewAction();
// 				                // resetPartForm();
// 				                // this.up('form').getForm().reset();
// 			            	}
// 		            	}
// 		            }
// 		        },{
// 		            xtype:'button',
// 		            id: 'init_btn_id-DBM7',
// 		            text: '초기화',
// 		            handler: function() {
// 		            	gm.me().resetPartForm();
// 		                this.up('form').getForm().reset();
// 		            }
// 		        }
//     		]
//          }
    
// 	        ]
// 		});
		

//     	this.productStore = /*
// 							 * Ext.create('Mplm.store.AssemblySearchStore', {
// 							 * }); //
// 							 */  Ext.create('Mplm.store.ProductStore');
    	
//     	this.productStore.getProxy().setExtraParam('bom_flag', 'T');
//     	this.productStore.getProxy().setExtraParam('sg_code', 'BOM');
    	
//     	var productItems = [
//             {
// 			    dock: 'top',
// 			    xtype: 'toolbar',
// 			    cls: 'my-x-toolbar-default2',
// 				items: [
// 				        this.addAssyAction, 
// 				        this.editAssyAction, 
// 				        this.removeAssyAction
// 				       ]
// 			}

//             ];
//     	this.productGrid =
//             Ext.create('Rfx.view.grid.StandardProduct', {
//                 id: this.link + '-Assembly',
//                 title: '표준제품', // cloud_product_class,
//                 border: true,
//                 resizable: true,
//                 scroll: true,
//                 collapsible: false,
//                 store: this.productStore,
//                 layout: 'fit',
//                 forceFit: true,
//                 dockedItems: productItems


//             }); //productGrid of End
    	
    	
// 		/*this.productGrid =
// 	    	Ext.create('Hanaro.view.produceMgmt.ProductTableGridHeavyHanaro', {
// 	    	 id:'DBM7-Assembly',
// 			 title: '제품',// cloud_product_class,
// 			 border: true,
// 	         resizable: true,
// 	         scroll: true,
// 	         collapsible: false,
// 	         store: this.productStore,
// 	         layout          :'fit',
// 	         forceFit: true,
// 	         bbar: Ext.create('Ext.PagingToolbar', {
// 		            store: this.productStore,
// 		            displayInfo: true,
// 		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
// 		            emptyMsg: MSG_NO_ITEM,
// 	                listeners: {
// 	                    beforechange: function (page, currentPage) {
// 	                    	// console_logs('여기++++++++++++++++++++++++++++++++++++++++
// 							// : ', record);
// 	                    }
// 	                }
		         
// 		        })
		        
// 	            ,dockedItems: [
// 	            {
// 				    dock: 'top',
// 				    xtype: 'toolbar',
// 				    cls: 'my-x-toolbar-default2',
// 					items: [
// 							this.addAssyAction,
// 					        this.editAssyAction, 
// 					        this.removeAssyAction// ,
// 					        // '->',
// 					        // this.expandAllTreeAction
// 					        ]
// 				}

// 	    	] // dockedItems of End
			
		
// 		});// productGrid of End
// */		
//         this.productGrid.getSelectionModel().on({
//         	selectionchange: function(sm, selections) {
//         		console_logs('여기>>>>>>>>>>>>>');
//         		console_logs('BOM등록현황');
//         		// try{
//         		if(selections!=null && selections.length > 0){
// 					 var rec = selections[0];
// 	        		 gm.me().selected_product = rec;
// 	        		 console_logs('rec>>>>>>>>>>>>>',rec);
// 	        		 gm.me().classCode = rec.get('class_code');
// 	        		 gm.me().itemCode = rec.get('item_code');
// 	        		 gm.me().modelNo = rec.get('model_no');
// 	        		 gm.me().description = rec.get('description');
// 	        		 gm.me().parent = rec.get('unique_id_long');
// 	        		 gm.me().reserved_varchar1 = rec.get('item_code');
	        		 
// 	         		 gUtil.enable(gm.me().removeAssyAction);
// 					 gUtil.enable(gm.me().editAssyAction);
// 					 gUtil.enable(gm.me().bomEditAction);
// 					 gUtil.enable(gm.me().removeAction);
// 	        		 parent = rec.get('unique_id_long');
// 	        		 // parent_uid=rec.get('parent_uid');
// 	        		 // assy_parent_uid=rec.get('assy_parent_uid');
// 	        		 gm.me().store.getProxy().setExtraParam('parent', parent);
// 	        		 gm.me().store.getProxy().setExtraParam('ac_uid', -1);
// 	        		 // gm.me().store.getProxy().setExtraParam('parent_uid',
// 						// parent_uid);
// 	        		 // gm.me().store.getProxy().setExtraParam('assy_parent_uid',
// 						// assy_parent_uid);
// 	        		 gm.me().store.getProxy().setExtraParam('orderBy', "pl_no");
// 	        		 gm.me().store.getProxy().setExtraParam('ascDesc', "ASC");  
// 	        		 gm.me().store.load();
// 	        		 //bom_store = gm.me().store;
	        		
//         	}
//         		// }catch(e){
//     			// console_logs('e',e);
//     			// }
//     		}
//         });
		
// 		 this.west =  Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
// 												// {
// 			    layout:'border',
// 			    border: true,
// 			    region: 'west',
// 	            width: '40%',
// 			    layoutConfig: {columns: 2, rows:1},

// 			    items: [this.productGrid/* , myFormPanel */]
// 			});
    	
//     	return this.west;
//     },
//     cellEditing : Ext.create('Ext.grid.plugin.CellEditing', {
//     	clicksToEdit: 1
//     }),
//     cellEditing1 : Ext.create('Ext.grid.plugin.CellEditing', {
//     	clicksToEdit: 1
//     }),
//     cellEditing2 : Ext.create('Ext.grid.plugin.CellEditing', {
//     	clicksToEdit: 1
//     }),
//     // *****************************GLOBAL VARIABLE**************************/
//     grid : null,
//     gridMycart : null,
//     gridStock : null,
//     store : null,
//     myCartStore : null,
//     stockStore : null,
//     gItemGubunType : null,
//     itemGubunType : null,
//     inpuArea : null,

//     sales_price : '',
//     quan : '',
//     selectedAssyRecord : null,
//     lineGap : 35,

//     selectedPjUid : '',
//     selectedAssyUid : '',

//     toPjUidAssy : '',	// parent
//     toPjUid : '',	// ac_uid
//     selectionLength : 0,

//     commonUnitStore : null,
//     commonCurrencyStore : null,
//     commonModelStore : null,
//     commonStandardStore2: null,
//     GubunStore: null,

//     assy_pj_code:'',
//     selectedAssyCode:'',
//     selectedPjCode:'',
//     selectedPjName:'',
//     selectedAssyDepth:0,
//     selectedAssyName:'',
//     selectedparent:'',
//     ac_uid:'',
//     selectedPjQuan : 1,
//     selectedAssyQuan : 1,
//     selectedMakingQuan : 1,

//     addpj_code:'',
//     is_complished : false,
//     routeTitlename : '',
//     puchaseReqTitle : '',

//     CHECK_DUP : '-copied-',
//     gGridMycartSelects: [],
//     copyArrayMycartGrid: function(from) {

//     	this.gGridMycartSelects = [];
//     	if(from!=null && from.length>0) {	
//     		for(var i=0; i<from.length; i++) {
//     			this.gGridMycartSelects[i] = from[i];
//     		}
//     	}
//     },
//     gGridStockSelects:[],
//     copyArrayStockGrid: function(from) {

//     	this.gGridStockSelects = [];
//     	if(from!=null && from.length>0) {	
//     		for(var i=0; i<from.length; i++) {
//     			this.gGridStockSelects[i] = from[i];
//     		}
//     	}
//     },
//     initTableInfo: '',
//     INIT_TABLE_HEAD: function(){
//     	var a =
//     		'<style>'+
//     		' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
//     		' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
//     		' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
//     		' </style>' +
//     		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
//     	'<colgroup>'+
//     		'<col width="80px">' +
//     		'<col width="90px">' +
//     		'<col width="*">' +
    		
//     		'<col width="90px">' +
//     		'<col width="90px">' +
//     		'<col width="50px">' +
//     		'<col width="90px">' +
    		
//     		'<col width="60px">' +
//     		'<col width="60px">' +
//     		'<col width="40px">' +
    		
//     		'<col width="110px">' +
//     		'<col width="90px">' +
//     	'</colgroup>' +
//     		'<tbody>' +
//     		'<tr  height="30" >' +
//     		'	  <td class="xl66" align=center>프로젝트코드</td>' +
//     		'	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
//     		'	  <td class="xl66" align=center>프로젝트이름</td>' +
//     		'	  <td class="xl67" align=center>'+ this.selectedPjName + '</td>' +
//     		'<td colspan="8" rowspan="2">'+
//     		'</td>' +
//     		'	 </tr>' + 
//     		'<tr  height="30" >' +
//     		'	  <td class="xl66" align=center>Assy코드</td>' +
//     		'	  <td class="xl67" align=center>'+ this.selectedAssyCode + '</td>' +
//     		'	  <td class="xl66" align=center>Assy이름</td>' +
//     		'	  <td class="xl67" align=center>'+ this.selectedAssyName + '</td>' +
//     		'	 </tr>' + 
//     		'<tr  height="25" >' +
//     		'	  <td class="xl66" align=center>품번</td>' +
//     		'	  <td class="xl66" align=center>품명</td>' +
//     		'	  <td class="xl66" align=center>규격</td>' +
    		
//     		'	  <td class="xl66" align=center>재질</td>' +
//     		'	  <td class="xl66" align=center>후처리</td>' +
//     		'	  <td class="xl66" align=center>열처리</td>' +
//     		'	  <td class="xl66" align=center>제조원</td>' +
    		
//     		'	  <td class="xl66" align=center>예상가격</td>' +
//     		'	  <td class="xl66" align=center>수량</td>' +
//     		'	  <td class="xl66" align=center>구분</td>' +
//     		'	  <td class="xl66" align=center>품목코드</td>' +
//     		'	  <td class="xl66" align=center>UID</td>' +
//     	'	 </tr>';
    		
//     		return a;
//     	},
//     	INIT_TABLE_TAIL: 
//     		'</tbody></table><br><br>' +
//     		'<div style="color:blue;font-size:11px;position:relative; "><ul>'+
//     		'<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>'+
//     		'<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>'+
//     		'<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>'+
//     		'</ul></div>',
//     	makeInitTable : function() {
//     		var initTableLine = 
//     			'	 <tr height="25" style="height:12.75pt">' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl65">&nbsp;</td>' +
//     			'	  <td class="xl67">&nbsp;</td>' +
//     			'	  <td class="xl67">&nbsp;</td>' +
//     			'	 </tr>';

// 			this.initTableInfo = INIT_TABLE_HEAD();
// 			this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
//     	},
//     	bomTableInfo : '',
    	
//     	createLine: function (val, align, background, style) {
//     		return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>'+ val + '</td>' ;
//     	},

//     	setChildQuan : function (n) {
//     		var o = Ext.getCmp('childCount-DBM7');
//     		if(o!=null) {
//     			o.update(''+ n);	
//     		}
//     	},
    	
//     	setAssyQuan : function(n) {
//     		var o = Ext.getCmp('assy_quan-DBM7');
//     		if(o!=null) {
//     			o.update(''+ n);	
//     		}
//     	},
//     	setProjectQuan : function(n) {
//     		var o = Ext.getCmp('pj_quan-DBM7');
//     		if(o!=null) {
//     			o.update(''+ n);	
//     		}
//     	},

//     	setMaking_quan : function(n) {
//     		var o = Ext.getCmp('making_quan-DBM7');
//     		if(o!=null) {
//     			o.update(''+ n);	
//     		}
    		
//     	},

//     	createHtml : function(route_type, rqstType, catmapObj) {
//     		var htmlItems =
//     			'<style>'+
//     			' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
//     			' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
//     			' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
//     			' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
//     		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
//     		'<colgroup>'+
//     			'<col width="10%">' +
//     			'<col width="10%">' +
//     			'<col width="10%">' +
//     			'<col width="20%">' +
//     			'<col width="40%">' +
//     		'</colgroup>' +
//     			'<tbody>' +
//     			'<tr  height="25" >' +
//     			'	  <td class="xl67" align=center>품목코드</td>' +
//     			'	  <td class="xl67" align=center>필요수량</td>' +
//     			'	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
//     			'	  <td class="xl67" align=center>품명</td>' +
//     			'	  <td class="xl67" align=center>규격</td>' +
//     			'	 </tr>' ;
//     		for(var i=0; i< catmapObj.length; i++) {
//     			var rec = catmapObj[i];// grid.getSelectionModel().getSelection()[i];
//     			var item_code = rec.get('item_code');
//     			var quan = route_type=='P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
//     			var new_pr_quan = rec.get('new_pr_quan');
//     			var item_name = rec.get('item_name');
//     			var specification = rec.get('specification');
    			
//     			htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
//     			htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65');// 품번
//     			htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65');// 품번
//     			htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65');// 품번
//     			htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65');// 품번
//     			htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65');// 품번
//     			htmlItems = htmlItems + '</tr>';

//     		}
//     		htmlItems = htmlItems + '</tbody></table></div>';
//     		return htmlItems;
//     	},

//     	setMakeTable : function(records) {
//     		this.bomTableInfo = this.INIT_TABLE_HEAD();
//     		if(records==null || records.length==0) {
//     			// bomTableInfo = initTableInfo;
//     		} else {
    			
//     			for( var i=0; i<records.length; i++) {
//     	          	var rec = records[i];
//     	        	var unique_id =  rec.get('unique_id');
//     	        	var unique_uid =  rec.get('unique_uid');
//     	        	var item_code =  rec.get('item_code');
//     	        	var item_name =  rec.get('item_name');
//     	        	var specification =  rec.get('specification');
//     	        	var standard_flag =  rec.get('standard_flag');
//     	        	var sp_code =  rec.get('sp_code'); // 표시는 고객사 선책톧로
    	        	
//     	        	var model_no =  rec.get('model_no');	
//     	        	var description =  rec.get('description');
//     	        	var pl_no =  rec.get('pl_no');
//     	        	var comment =  rec.get('comment');
//     	        	var maker_name =  rec.get('maker_name');
//     	        	var bm_quan =  rec.get('bm_quan');
//     	        	var unit_code =  rec.get('unit_code');
//     	        	var sales_price =  rec.get('sales_price');
    	        	
//     	        	this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65');// 품번
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65');// 품명
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65');// 규격
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65');// 재질/모델
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65');// 후처리
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65');// 열처리
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65');// 제조원
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65');// 예상가(숫자)
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65');// 수량(숫자)
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65');// 구분기호
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67');// 품목코드
//     	        	this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67');// UID
//     	        	this.bomTableInfo = this.bomTableInfo + '	 </tr>';
//     			}
//     		}
//     		this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
//     		var o = Ext.getCmp('bom_content-DBM7');
//     		o.setValue(this.bomTableInfo);
//     	},

//     	insertStockStoreRecord: function(records) {},
    	

//     	cloudprojectStore : Ext.create('Mplm.store.cloudProjectStore', {} ),
// 	    mesProjectTreeStore : Ext.create('Mplm.store.MesProjectTreeStore', {}),
// 	    routeGubunTypeStore : Ext.create('Mplm.store.RouteGubunTypeStore', {} ),
// 	    routeGubunTypeStore_W : Ext.create('Mplm.store.RouteGubunTypeStore_W', {} ),
// 	    commonStandardStore : Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} ),
	    


//     	renderCarthistoryPlno : function(value, p, record) {
//     		var unique_uid = record.get('unique_uid');
    		
//     	    return Ext.String.format(
//     	            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
//     	           unique_uid, value
//     	        );
//     	},


//     	getPosStandard: function(id){

//     		for (var i=0; i<this.standard_flag_datas.length; i++){
//     			if(this.standard_flag_datas[i].get('systemCode') == id){
//     				return this.standard_flag_datas[i];
//     			}
//     		}
//     		return null;
//     	},

//     	selectAssy: function(routeTitlename, depth) {
//     		console_logs('routeTitlename', routeTitlename);
//     		// addAction.enable();
//     		this.addAssyAction.enable();
//     		this.inpuArea.enable();
//     		Ext.getCmp('addPartForm-DBM7').enable();
//     		Ext.getCmp('target-routeTitlename-DBM7').update('<b>'+routeTitlename+'</b>'); 
//     		if(depth==1) {
//     			this.editAssyAction.disable();
//     			this.removeAssyAction.disable();
//     		} else {
//     			this.editAssyAction.enable();
//     			this.removeAssyAction.enable();		
//     		}


//     	},

//     	unselectAssy : function() {
//     		// this.addAction.disable();
//     		this.addAssyAction.disable();
//     		this.editAssyAction.disable();
//     		this.removeAssyAction.disable();
//     		this.inpuArea.disable();
//     		Ext.getCmp('bom_content-DBM7').setValue(initTableInfo);
//     		Ext.getCmp('addPartForm-DBM7').disable();
//     		Ext.getCmp('target-routeTitlename-DBM7').update('Assembly를 선택하세요.'); 
//     	},


//     	item_code_dash: function(item_code){
//     		if(item_code==null || item_code.length<13) {
//     			return item_code;
//     		}else {
//     			return item_code.substring(0,12);
//     		}
//     	},

//     	setReadOnlyName: function(name, readonly) {
//     		this.setReadOnly(Ext.getCmp(name), readonly);
//     	},

//     	setReadOnly: function(o, readonly) {
//     		if(o!=undefined && o!=null) {
//         	    o.setReadOnly(readonly);
//         	    if (readonly) {
//         	        o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
//         	    } else {
//         	        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
//         	    }    			
//     		}


//     	},

//     	getPl_no: function (systemCode) {
//     	 	var prefix = systemCode;
//     	 	if(systemCode=='S') {
//     	 		prefix = 'K';
//     	 	} else if(systemCode=='O') {
//     	 		prefix = 'A';
//     	 	}
//     		   Ext.Ajax.request({
//     			url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
//     			params:{
//     				first:prefix,
//     				parent_uid:this.selectedparent
//     			},
//     			success : function(result, request) {   
//     				var result = result.responseText;
//     				var str = result;	// var str = '293';
//     				Ext.getCmp('pl_no-DBM7').setValue(str);

    				
//     			},
//     			failure: extjsUtil.failureMessage
//     		});
//     	},



//     	 fPERM_DISABLING_Complished: function() {
//     		// 1. 권한있음.
//     		if (fPERM_DISABLING() == false && is_complished == false) {
//     			return false;
//     		} else { // 2.권한 없음.
//     			return true;
//     		}
//     	},

//     	// Define reset Action
//     	resetAction : Ext.create('Ext.Action', {
//     		 itemId: 'resetButton',
//     		 iconCls: 'af-remove',
//     		 text: CMD_INIT,
//     		 handler: function(widget, event) {
//     			 resetPartForm();
//     			 Ext.getCmp('addPartForm-DBM7').getForm().reset();
//     			 // console_logs('getForm().reset()', 'ok');
//     		 }
//     	}),
    	
//     	pasteAction : Ext.create('Ext.Action', {
//     		 itemId: 'pasteActionButton',
//     		 iconCls: 'paste_plain',
//     		 text: '현재 Assy에 붙여넣기',
//     		 disabled: true,
//     		 handler: function(widget, event) {
//     		    	if(this.selectedparent==null || this.selectedparent=='' || this.selectedPjUid==null || this.selectedPjUid=='') {
//     		    		Ext.MessageBox.alert('오류','먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
//     		    	} else {

//     		    	    var fp = Ext.create('Ext.FormPanel', {
//     		    	    	id: 'formPanelSelect-DBM7',
//     		    	    	frame:true,
//     		    	        border: false,
//     		    	        fieldDefaults: {
//     		    	            labelWidth: 80
//     		    	        },
//     		    	        width: 300,
//     		    	        height: 220,
//     		    	        bodyPadding: 10,
//     		    	        items: [
//     							{
//     								xtype: 'component',
//     								html:'복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
//     							},
//     		    	            {
//     				    	        xtype: 'container',
//     				    	        layout: 'hbox',
//     				    	        margin: '10 10 10',
//     				    	        items: [{
//     						    	            xtype: 'fieldset',
//     						    	            flex: 1,
//     						    	            border: false,
//     						    	            // title: '복사 수행시 수량을 1로 초기화하거나
// 												// 품번을 대상 Assy에 맞게 재 부여할 수
// 												// 있습니다.',
//     						    	            defaultType: 'checkbox', // each
// 																			// item
// 																			// will
// 																			// be a
// 																			// checkbox
//     						    	            layout: 'anchor',
//     						    	            defaults: {
//     					    	                anchor: '100%',
//     					    	                hideEmptyLabel: false
//     					    	            },
//     					    	            items: [
//     				    	                {
//     					    	                fieldLabel: '복사 옵션',
//     					    	                boxLabel: '수량을 1로 초기화',
//     					    	                name: 'resetQty',
//     					    	                checked: true,
//     					    	                inputValue: 'true'
//     					    	            }, {
//     					    	                boxLabel: '품번 재부여',
//     					    	                name: 'resetPlno',
//     					    	                checked: true,
//     					    	                inputValue: 'true'
//     					    	            },  new Ext.form.Hidden({
//     					        	            name: 'hid_null_value'
//     					        		        })]
//     				    	        }]
//     				    	    }]
//     			    	    });
    		    	    
//     		    	    w = Ext.create('ModalWindow', {
//     			            title:CMD_ADD  + ' :: ' + /* (G) */vCUR_MENU_NAME,
//     			            width: 300,
//     			            height: 220,
//     			            plain:true,
//     			            items: fp,
//     			            buttons: [{
//     			                text: '복사 실행',
//     			                disabled: false,
//     			            	handler: function(btn){
//     			            		var form = Ext.getCmp('formPanelSelect-DBM7').getForm();
//     		            			var val = form.getValues(false);
//     		            		    var selections = gridMycart.getSelectionModel().getSelection();
//     		            		    if (selections) {
//     		            		        	var uids = [];
//     		            		        	for(var i=0; i< selections.length; i++) {
//     		            		        		var rec = selections[i];
//     		            		        		var unique_uid = rec.get('unique_uid');
//     		            		        		uids.push(unique_uid);
//     		            		        	}
//     		            		      	   Ext.Ajax.request({
//     		            		      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
//     		            		      			params:{
//     		            		      				project_uid: this.selectedPjUid,
//     		            		      				parent_uid:  this.selectedparent,
//     		            		      				unique_uids: uids,
//     		            		      				resetQty: val['resetQty'],
//     		            		      				resetPlno: val['resetPlno']
//     		            		      			},
//     		            		      			success : function(result, request) {   
//     		            		            		if(w) {
//     		            		            			w.close();
//     		            		            		}
//     		            		      				var result = result.responseText;
//     	            		     					this.myCartStore.load(function() {});
//     		            		      				// Ext.MessageBox.alert('결과','총
// 													// ' + result + '건을
// 													// 복사하였습니다.');
//     		            		     				store.load( function(records) {
//     		            		     					gm.me().insertStockStoreRecord(records);
//     		            		     					gm.me().setChildQuan(records.length);
    		            			     					
//     		            			     			});
//     		            		      			},
//     		            		      			failure: extjsUtil.failureMessage
//     		            		      		});

//     		            		    }

//     			            	}
//     						},{
//     			                text: CMD_CANCEL,
//     			            	handler: function(){
//     			            		if(w) {
//     			            			w.close();
//     			            		}
//     			            	}
//     						}]
//     			        }); w.show();
    		    		
    		    		
//     		    	}
//     		 }
//     	}),



//     	// 수정등록
//     	modRegAction : Ext.create('Ext.Action', {
//     		 itemId: 'modRegAction',
//     		 iconCls: 'page_copy',
//     		 text: '값 복사',
//     		 disabled: true,
//     		 handler: function(widget, event) {
//     			 gm.me().unselectForm();
//     			 grid.getSelectionModel().deselectAll();
//     		 }
//     	}),
//     	cleanComboStore: function(cmpName)
//     	{
//     	    var component = Ext.getCmp(cmpName); 
    	    
//     	    component.setValue('');
//     	    component.setDisabled(false);
//     		component.getStore().removeAll();
//     		component.setValue(null)
//     		component.getStore().commitChanges();
//     		component.getStore().totalLength = 0;
//     	},

//     	resetParam: function() {
//     		this.store.getProxy().setExtraParam('unique_id', '');
//     		this.store.getProxy().setExtraParam('item_code', '');
//     		this.store.getProxy().setExtraParam('item_name', '');
//     		this.store.getProxy().setExtraParam('specification', '');
//     	},

//     	loadTreeAllDef: function(){
//     		this.loadTreeAll(this.selectedPjUid);
//     	},
//     	loadTreeAll: function(pjuid) {
//     		// this.pjTreeGrid.setLoading(true);
    		
//     		this.mesProjectTreeStore.removeAll(true);
//     		this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
//     		this.mesProjectTreeStore.load( {		
//     			callback: function(records, operation, success) {

//     			}
//     		});
//     	},
    	
//     	setBomData: function(id) {

//     		this.modRegAction.enable();
//     		this.resetPartForm();
    		
//     		Ext.Ajax.request({
//     			url: CONTEXT_PATH + '/purchase/material.do?method=read',
//     			params:{
//     				id :id
//     			},
//     			success : function(result, request) {   
    	       		
//     				var jsonData = Ext.decode(result.responseText);
//     				// console_logs('jsonData', jsonData);
//     				var records = jsonData.datas;
//     				// console_logs('records', records);
//     				// console_logs('records[0]', records[0]);
//     				setPartFormObj(records[0]);
//     			},
//     			failure: extjsUtil.failureMessage
//     		});
    		
//     	},
    	
//     	setPartFormObj : function(o) {

//     		// 규격 검색시 standard_flag를 sp_code로 사용하기
//     		Ext.Ajax.request({
//     			url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
//     			success : function(result) {
//     				var text = result.responseText;
//     				console_logs('text', text);
//     				var o2 = JSON.parse(text, function (key, value) {
//     						    return value;
//     						});
    				
//     			   console_logs('o>>>>>>', o);
//     	 		   gItemGubunType = o2['itemGubunType'];
//     				// console_logs('itemGubun', itemGubunType);
//     				// console_logs('itemGubun1', gItemGubunType);

    				
//     				var standard_flag = null;
//     				if(gItemGubunType=='standard_flag') {
//     					standard_flag =  o['standard_flag'];
//     				} else {
//     					standard_flag =  o['sp_code'];
//     				}
    				
//     				Ext.getCmp('unique_id-DBM7').setValue( o['unique_id']);
//     				Ext.getCmp('unique_uid-DBM7').setValue( o['unique_uid']);
//     				Ext.getCmp('item_code-DBM7').setValue( o['item_code']);
//     				Ext.getCmp(gu.id('item_name')).setValue( o['item_name']);
//     				Ext.getCmp(gu.id('specification')).setValue( o['specification']);
//     				Ext.getCmp(gu.id('remark')).setValue( o['remark']);
//     				Ext.getCmp(gu.id('child')).setValue(o['unique_id_long']);

//     				Ext.getCmp('standard_flag-DBM7').setValue(standard_flag);
//     				// Ext.getCmp('standard_flag_disp-DBM7').select(getPosStandard(standard_flag));
//     				Ext.getCmp('model_no-DBM7').setValue( o['model_no']);	
//     				Ext.getCmp('description-DBM7').setValue( o['description']);
    				
//     				Ext.getCmp('comment-DBM7').setValue( o['comment']);
//     				Ext.getCmp('maker_name-DBM7').setValue( o['maker_name']);
//     				Ext.getCmp('bm_quan-DBM7').setValue('1');
//     				Ext.getCmp('unit_code-DBM7').setValue( o['unit_code']);
//     				Ext.getCmp('sales_price-DBM7').setValue( o['sales_price']);
    				
    				
//     				gm.me().getPl_no(standard_flag);
    				
//     				var currency =  o['currency'];
//     				if(currency==null || currency=='') {
//     					currency = 'KRW';
//     				}
//     				Ext.getCmp('currency-DBM7').setValue(currency);
//     				// this.readOnlyPartForm(true);
    				
    				
    				
//     			},
//     			failure: extjsUtil.failureMessage
//     		});
//     	},
    	
//     	setPartForm: function(record) {
//     		// console_logs('record:', record);

//     		Ext.getCmp('unique_id-DBM7').setValue( record.get('unique_id'));
//     		Ext.getCmp('unique_uid-DBM7').setValue( record.get('unique_uid'));
//     		Ext.getCmp('item_code-DBM7').setValue( record.get('item_code'));

//     		Ext.getCmp('item_name-DBM7').setValue( record.get('item_name'));
//     		Ext.getCmp('specification-DBM7').setValue( record.get('specification'));
    		
//     		var standard_flag =  record.get('standard_flag');
//     		Ext.getCmp('standard_flag-DBM7').setValue(standard_flag);
    		
//     		Ext.getCmp('standard_flag_disp-DBM7').select(getPosStandard(standard_flag));
//     		Ext.getCmp('model_no-DBM7').setValue( record.get('model_no'));	
//     		Ext.getCmp('description-DBM7').setValue( record.get('description'));
//     		Ext.getCmp('pl_no-DBM7').setValue( record.get('pl_no'));
//     		Ext.getCmp('comment-DBM7').setValue( record.get('comment'));
//     		Ext.getCmp('maker_name-DBM7').setValue( record.get('maker_name'));
//     		Ext.getCmp('bm_quan-DBM7').setValue( record.get('bm_quan'));
//     		Ext.getCmp('unit_code-DBM7').setValue( record.get('unit_code'));
//     		Ext.getCmp('sales_price-DBM7').setValue( record.get('sales_price'));
    		
    		
//     		var currency =  record.get('currency');
//     		if(currency==null || currency=='') {
//     			currency = 'KRW';
//     		}
//     		Ext.getCmp('currency-DBM7').setValue(currency);
    		
//     		var ref_quan = record.get('ref_quan');
//     		// console_logs('ref_quan', ref_quan);
//     		if(ref_quan>1) {
//     			this.readOnlyPartForm(true);
//     			Ext.getCmp('isUpdateSpec-DBM7').setValue('false');
//     		} else {
//     			this.readOnlyPartForm(false);
//     			this.setReadOnlyName('item_code-DBM7', true);
//     			this.setReadOnlyName('standard_flag_disp-DBM7', true);
//     			Ext.getCmp('isUpdateSpec-DBM7').setValue('true');
//     		}

//     	},

//     	resetPartForm: function() {

//     		Ext.getCmp('unique_id-DBM7').setValue( '');
//     		Ext.getCmp('unique_uid-DBM7').setValue( '');
//     		Ext.getCmp('item_code-DBM7').setValue( '');
//     		Ext.getCmp('item_name-DBM7').setValue( '');
//     		Ext.getCmp('specification-DBM7').setValue('');
//     		Ext.getCmp('standard_flag-DBM7').setValue('');
//     		Ext.getCmp('standard_flag_disp-DBM7').setValue('');

//     		Ext.getCmp('model_no-DBM7').setValue('');
//     		Ext.getCmp('description-DBM7').setValue('');
//     		Ext.getCmp('pl_no-DBM7').setValue('');
//     		Ext.getCmp('comment-DBM7').setValue('');
//     		Ext.getCmp('maker_name-DBM7').setValue('');
//     		Ext.getCmp('bm_quan-DBM7').setValue('1');
//     		Ext.getCmp('unit_code-DBM7').setValue('');
//     		Ext.getCmp('sales_price-DBM7').setValue( '0');

//     		Ext.getCmp('currency-DBM7').setValue('KRW');
//     		Ext.getCmp('unit_code-DBM7').setValue('PC');
//     		this.readOnlyPartForm(false);
//     	},

//     	unselectForm: function(){

//     		Ext.getCmp('unique_id-DBM7').setValue('');
//     		Ext.getCmp('unique_uid-DBM7').setValue('');
//     		Ext.getCmp('item_code-DBM7').setValue('');
    		
//     		var cur_val = Ext.getCmp('specification-DBM7').getValue();
//     		var cur_standard_flag = Ext.getCmp('standard_flag-DBM7').getValue();
    		
//     		if(cur_standard_flag!='O') {
//     			Ext.getCmp('specification-DBM7').setValue(cur_val + ' ' + this.CHECK_DUP);		
//     		}
    		
//     		Ext.getCmp('currency-DBM7').setValue('KRW');
    		
//     		this.getPl_no(Ext.getCmp('standard_flag-DBM7').getValue());
//     		this.readOnlyPartForm(false);
//     	},

//     	readOnlyPartForm :function(b) {

//     		this.setReadOnlyName('item_code-DBM7', b);
//     		this.setReadOnlyName('item_name-DBM7', b);
//     		this.setReadOnlyName('specification-DBM7', b);
//     		this.setReadOnlyName('standard_flag-DBM7', b);
//     		this.setReadOnlyName('standard_flag_disp', b);

//     		this.setReadOnlyName('model_no-DBM7', b);
//     		this.setReadOnlyName('description-DBM7', b);
//     		// this.setReadOnlyName('pl_no', b);
//     		this.setReadOnlyName('comment-DBM7', b);
//     		this.setReadOnlyName('maker_name-DBM7', b);

//     		this.setReadOnlyName('currency-DBM7', b);
//     		this.setReadOnlyName('unit_code-DBM7', b);
    		
//     		Ext.getCmp('search_information-DBM7').setValue('');
    		
//     	},

//     	addNewAction: function() {

//     		var form = Ext.getCmp('addPartForm-DBM7').getForm();
//     	    if(form.isValid()) {
//     	    	var val = form.getValues(false);
    	    	
//     	    	val['parent'] = this.selectedparent;
//     	    	val['ac_uid'] = this.selectedPjUid;
//         	    val['pj_code'] = this.selectedPjCode;
//         	    val['coord_key2'] = this.order_com_unique;
//             	val['assy_name'] = this.selectedAssyName;
//                 val['pj_name'] = this.selectedPjName;
    	    	
    	    	
//   				 Ext.Ajax.request({
// 					url: CONTEXT_PATH + '/design/bom.do?method=createNew',
// 					params : val,
// 				    method: 'POST',
// 				    success : function() {
           			
//            			gm.me().store.load(function(records){
//            				gm.me().unselectForm();
//            				gm.me().setChildQuan(records.length);
//            				gm.me().resetPartForm();
//            			});
           			           			
//            		},
// 	               failure: function (result, op)  {
// 	            	   var jsonData = Ext.util.JSON.decode(result.responseText);
// 	                   var resultMessage = jsonData.data.result;
// 	            	   Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function() {});
	               	
// 	               }
// 	        	 });   	

//     	    }
//     	},

//     	searchAction : Ext.create('Ext.Action', {
//     		itemId: 'searchButton',
//     		iconCls: 'af-search',
//     	    text: CMD_REFRESH,
//     	    disabled: false ,
//     	    handler: function ()
//     	    {
//     	    	gm.me().myCartStore.load(function() {});
//     	    }
//     	}),


//     	Item_code_dash: function(item_code){
//     			return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
//     					item_code.substring(9, 12);
//     	},

//     	getColName: function (key) {
//     		return gMain.getColNameByField(this.fields, key);
//     	},

//     	getTextName: function (key) {
//     		return gMain.getColNameByField(this.fields, key);
//     	},
    	
    	
//     	materialClassStore : new Ext.create('Ext.data.Store', {

//     		fields:[     
//     		        { name: 'class_code', type: "string"  }
//     		        ,{ name: 'class_name', type: "string" }
//     		        ,{ name: 'level', type: "string"  } 
//     	    ],
//     		sorters: [{
//     	        property: 'display_order',
//     	        direction: 'ASC'
//     	    }],
//     	    proxy: {
//     	    	type: 'ajax',
//     	    	url: CONTEXT_PATH + '/design/class.do?method=read',
//     	    	reader: {
//     	    		type:'json',
//     	    		root: 'datas',
//     	    		totalProperty: 'count',
//     	    		successProperty: 'success'
//     	    	},
//     	    	extraParams : {
//     	    		level: '2',
//     	    		parent_class_code: ''
//     	    	}
//     	    	,autoLoad: true
//     	    }
//     	}),
//     	standard_flag_datas : [],
//     	pjTreeGrid: null,
//     	expandAllTree: function() {
//     		if(this.pjTreeGrid!=null) {
//     			this.pjTreeGrid.expandAll();
//     		}
//     	},
//     	isExistMyCart: function(inId) {
//     		var bEx = false;// Not Exist
//     		this.myCartStore.data.each(function(item, index, totalItems) {
//     	        console_logs('item', item);
//     	        var uid = item.data['unique_uid'];
//     	        console_logs('uid', uid);
//     	        console_logs('inId', inId);
//     	        if(inId == uid) {
//     	        	bEx = true;// Found
//     	        }
//     	    });
    		
//     		return bEx;
//     	},
//         loadStore: function(child) {
        	
//         	this.store.getProxy().setExtraParam('child', child);
        	
//     	    this.store.load( function(records){
//     	     	console_logs('==== storeLoadCallback records', records);
//             	console_logs('==== storeLoadCallback store', store);

//             });
    	    
//         },
//         arrAssyInfo: function(o1, o2, o3, o4, o5, o6, o7, o8){
//         	gm.me().mtrlChilds = o1;
//         	gm.me().bmQuans = o2;
//         	gm.me().itemCodes = o3;
//         	gm.me().spCode = o4;
//         	gm.me().ids = o5;
//         	gm.me().levels = o6;
//         	gm.me().bomYNs = o7;
//         	gm.me().pcr_divs= o8;
//         },
// // selectedClass1 : '',
// // selectedClass2 : '',
// // selectedClass3 : '',
//         selectedClassCode: '',
//         materialStore: Ext.create('Mplm.store.MtrlSubStore'),
//         productSubStore:Ext.create('Mplm.store.ProductSubStore')
//         // makeClassCode : function() {
//         // this.selectedClassCode = this.selectedClass1 + this.selectedClass2 +
// 		// this.selectedClass3
//         // }
        
        
//         ,
//         addMtrlGrid : null,
//         addPrdGrid : null,
//         deleteConfirm: function(result) {
//             if (result == 'yes') {
//                 var arr = gm.me().selectionedUids;
//                 // console_logs('deleteConfirm arr', arr);
//                 if (arr.length > 0) {

//                     var CLASS_ALIAS = gm.me().deleteClass;
//                     // console_logs('deleteConfirm CLASS_ALIAS', CLASS_ALIAS);
//                     // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
//                     if (CLASS_ALIAS == null) {
//                         CLASS_ALIAS = [];
//                         for (var i = 0; i < gm.me().fields.length; i++) {
//                             var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
//                             if (tableName != 'map') {
//                                 CLASS_ALIAS.push(tableName);
//                             }

//                         }
//                         CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
//                     }
//                     // console_logs('deleteConfirm CLASS_ALIAS 2', CLASS_ALIAS);

//                     Ext.Ajax.request({
//                         url: CONTEXT_PATH + '/index/generalData.do?method=delete',
//                         params: {
//                             DELETE_CLASS: CLASS_ALIAS,
//                             uids: arr
//                         },
//                         method: 'POST',
//                         success: function(rec, op) {
//                             // console_logs('success rec', rec);
//                             // console_logs('success op', op);
//                             // gm.me().redrawStore();
//                             gm.me().store.load()

//                         },
//                         failure: function(rec, op) {
//                             Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

//                         }
//                     });

//                 }
//             }

//     	},
//     	deleteAssyConfirm: function(result) {
//     		if(result=='yes') {
//             	if(gm.me().parent == null) {
//         			Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
//         			return;
//             	} else {
//     		    	var id = gm.me().parent;
    		    		
//     	        		    		Ext.Ajax.request({
//     	        		     			url: CONTEXT_PATH + '/design/bom.do?method=deleteSrcAhd',
//     	        		     			params:{
//     	        		     				srcahd_uid : id
//     	        		     			},
//     	        		     			success : function(result, request) {   
//     	        		     				console_logs('result', result);
//     	        	        				var jsonData = Ext.decode(result.responseText);
//     	        	        				console_logs('jsonData', jsonData);
// // gm.me().reSelect();
//     	        	        				gm.me().productStore.load();
//     	        		     			},
//     	        		     			failure: function(rec, op) {
//     	        	                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

//     	        	                    }
//     	        		       	    });
//     		    	}
//             	}

//     	},
//     	registPartFc: function(val) {
//             console_logs('registPartFc val', val);
// // gm.me().addNewAction(val);
//         	Ext.Ajax.request({
//     			url: CONTEXT_PATH + '/purchase/material.do?method=addChildBOMTree',
//     			params:{
//     				parent_uid: -1,
//                     parent: val['parent_uid'],
// 					bm_quan: val['bm_quan'],
//                     child: val['child'],
//                     item_code: val['item_code'],
//                     item_name: val['item_name'],
//                     pl_no:val['pl_no'],
//                     level:val['reserved_integer1'],
// 					assytop_uid:val['reserved_integer2'],
// 					specification:val['specification']
//     			},

//         		success : function(result, request) {   
//         			gm.me().store.getProxy().setExtraParam('parent', gm.me().parent);
//                     gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
//                     gm.me().store.getProxy().setExtraParam('ac_uid', -1);
//            		 	gm.me().store.load();
//     				Ext.MessageBox.alert('성공','자재가 정상적으로 등록 되었습니다.');
    				
//     			},
//     			failure: extjsUtil.failureMessage
//     		});
//         }
    	
// });
