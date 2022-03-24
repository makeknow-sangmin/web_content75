/*
SQT1_CLD - 제안견적관리
*/

var grid = null;
var store = null;
var itemStore = null;

var fieldItem = [], columnItem = [], tooltipItem = [];
var cellEditingItem = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var combst_uid = '';

var gTabState = 'REGIST';
var selectTedQuota = null;

var printPDFAction = Ext.create('Ext.Action',{
    iconCls: 'PDF',
    text: 'PDF',
    disabled: true,
    handler: function(widget, event) {
    	var rec = grid.getSelectionModel().getSelection()[0];
     	var rtgast_uid = rec.get('unique_id');//rtgast_uid
    	var po_no = rec.get('po_no');//po_no
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printPo',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {
    			store.load({
        	    scope: this,
        	    callback: function(records, operation, success) {
        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;
        	        console_log(pdfPath);
//        	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}
        	    }
        	});
    		},
    		failure: extjsUtil.failureMessage
    	});
    	
    	
    }
});



function addActionNew ()
{
	var jsonArr = [];
	itemStore.each( function (model) {
		var o = model.data;
		console_log(o);
		var item_name  = o['item_name'];
		var quan  = o['quan'];
		var source_price = o['source_price'];
		
		if(item_name!=null && quan!=null) {
			if(item_name!='' && Number(quan) > 0)  {
				jsonArr.push(model.data);
			}
		}
	});
	
	var detailPartlist = Ext.JSON.encode(jsonArr);
	console_log(detailPartlist);
	Ext.getCmp('detailPartlist').setValue(detailPartlist);
	
	var form = Ext.getCmp('innerTabsForm').getForm();
	form.submit({
                url: CONTEXT_PATH + '/sales/quota.do?method=createQuota', /*1recoed, search by cond, search */
                waitMsg: '실행중...',
                method: 'POST',
                success: function (form, action) {
                   store.load({});
                   //console.log(action.response.responseText);
                   Ext.MessageBox.alert('Success','성공하였습니다.');
                   Ext.getCmp('project-tab-panel').setActiveTab(0);
                },
                failure: function(form, action) {
                	console_log(form);
                	console_log(action);
                	Ext.MessageBox.alert('Erro',action.result.data.msg);
			        if (action.result.status == true) {
			            //console.log('success!');
			            //console.log(action.response.responseText);
			            Ext.MessageBox.alert('Success','성공하였습니다.');
			        }else {
			        	Ext.MessageBox.alert('Fail','실패하였습니다.');
			        }
			    }
            });
	
}

function setTabState(state, rec) {
	gTabState = state;
	selectTedQuota = rec;

	switch(state) {
		case 'REGIST':
			Ext.getCmp('projectadd-form-panel-div').setTitle('견적서 등록');
			break;
		case 'MODIFY':
			Ext.getCmp('projectadd-form-panel-div').setTitle('견적서 수정');
			break;
	}
	console_log(selectTedQuota);
}

var srchUserStore = Ext.create('Mplm.store.SrchUserStore', {hasNull:true} );
var cloudbuyerStore = Ext.create('Mplm.store.cloudbuyerStore', {} );

Ext.define('RtgAst', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
		            read: CONTEXT_PATH + '/sales/quota.do?method=readQuota'
	        },
	        reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});

function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
    	record = selections[0];
    	var parent = record.get('uid_srcahd');
    	var unique_id = record.get('unique_id');
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
//        	Ext.Ajax.request({
//        		url: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy', /*delete*/
//        		params:{
//        			uid_srcahd : parent,
//        			unique_id  : unique_id
//        		},
//        		success : function(result, request) {
//        			var result = result.responseText;
//					var str = result;	
//    				var num = Number(str); 
//					if(num == '0'){
//						Ext.MessageBox.alert('No','It has children');
//					}else{
//						for(var i=0; i< selections.length; i++) {
//	                		var rec = selections[i];
//	                		var unique_id = rec.get('unique_id');
//	        	           	 var projectmold = Ext.ModelManager.create({
//	        	           		unique_id : unique_id
//	        	        	 }, 'RfqMapPartLine');
//	                		
////	        	           	projectmold.destroy( {
////	        	           		 success: function() {}
////	        	           	});
//	                   	
//	                	}
//	                	grid.store.remove(selections);
//					}
//        		}
//        	});
        	
        }
    }
};

var unique_id = new Array();
//완료

//Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});


//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [  removeAction  ]
});

var searchField = 
[
	'unique_id',
	'po_no',
	'name',
	'content'
];

Ext.onReady(function() {  

//	LoadJs('/js/util/buyerStore.js');

	searchField.push(
	{
		type:'combo',
		field_id :'order_com_unique',
        store: 'BuyerStore',
        displayField:   'wa_name',
        valueField:     'unique_id',
        innerTpl	: '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>',
        listeners: {
        	select: function (combo, record) {
        		combst_uid = record[0].get('unique_id');
        	}
        }
	});

	
	makeSrchToolbar(searchField);
	console_log('makeSrchToolbar OK');

	var removeItemAction = Ext.create('Ext.Action', {
		itemId: 'removeItemAction',
	    iconCls: 'remove',
	    text: CMD_DELETE,
	    disabled: false,
	    handler: function(widget, event) {
	    }
	});
	var addItemAction = Ext.create('Ext.Action', {
		iconCls:'save',
		text: CMD_OK,
	    handler: function(widget, event){
	    	Ext.MessageBox.show({
	            title:'삭제',
	            msg: 'You are modify records. <br />Are you sure?',
	            buttons: Ext.MessageBox.YESNO,
	            fn: function(){alert('ok');},
	            icon: Ext.MessageBox.QUESTION
	        });
	 	 }//end handler
	});
	//var selModelDetail = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgAst',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	  
 	store.load(function() {

 		var selModelItem = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

 		var tabProjectDetail = Ext.widget({
        xtype: 'form',
        id: 'innerTabsForm',
        collapsible: false,
        border: false,
        bodyPadding: 15,
        width: '100%',
        
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [
        {
            xtype: 'container',
            layout: {
                    type: 'hbox',
                    padding:'0',
                    pack:'end',
                    align:'top'
            },
            items:[  	
            {
                xtype: 'container',
                width: '50%',
                margin: '0 0 0 0',
                border:true,
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {labelAlign: 'right' },
                items: [
                
           {
                xtype: 'fieldset',
                title: '고객사',
                defaultType: 'textfield',
                layout: 'anchor',
                margin: '0 5 0 0',
                defaults: {
                    anchor: '100%'
                },
                items: [
                	{//고객사
                    	   fieldLabel: '회사선택',
                    	   id:'order_com_unique',
                    	   name:'order_com_unique',
                    	   xtype: 'combo',
                    	   fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    	                   mode: 'local',
    	                   editable:false,
    	                   allowBlank: false,
    	                   queryMode: 'remote',
    	                   emptyText:'고객사',
    	                   displayField:   'wa_name',
    	                   valueField:     'unique_id',
    	                   labelWidth: 80,
    	                   store: cloudbuyerStore,
    		                listConfig:{
    		                	
    		                	getInnerTpl: function(){
    		                		return '<div data-qtip="{unique_id}">{wa_name}</div>';
    		                	}			                	
    		                },
    		               triggerAction: 'all',
    	 	               listeners: {
    	 	                    select: function (combo, record) {
    	 	                    	
    	 	                    	console_log(record[0]);
    	 	                    	var buyeruid 	= record[0].get('unique_id');
    	 	                    	var buyername  	= record[0].get('wa_name');
    	 	                    	var buyercode  	= record[0].get('wa_code');
    	 	                    	
    	 	                    	var sales_name1 = record[0].get('sales_name1');
									var sales_email1= record[0].get('sales_email1');
									var sales_tel1 	= record[0].get('sales_tel1');
									var sales_fax1 	= record[0].get('sales_fax1');
									var def_rep_uid = record[0].get('def_rep_uid'); //담당자의 suphst uid

    	 	                    	Ext.getCmp('reserved_varchar1').setValue(buyercode);
    	 	                    	Ext.getCmp('reserved_varchar2').setValue(buyername);
    	 	                    	Ext.getCmp('reserved_number1').setValue(buyeruid);
    	 	                    	Ext.getCmp('def_rep_uid').setValue(def_rep_uid);
    	 	                    	
    	 	                    	Ext.getCmp('ref_name').setValue(sales_name1);
    	 	                    	Ext.getCmp('ref_email').setValue(sales_email1);
    	 	                    	Ext.getCmp('ref_hp').setValue(sales_tel1);
    	 	                    	Ext.getCmp('ref_fax').setValue(sales_fax1);
    	 	                    	
    	 	                    }
    	 	               }
		         }//endofbuyer
    	        ,
    	        {
            		xtype: 'textfield',
            		labelWidth: 80, 
            		flex:3,
            		allowBlank: false,
        			fieldLabel: '담당자 이름*',
        			name: 'ref_name',
        			id:'ref_name'
                }
                ,{
            		xtype: 'textfield',
            		labelWidth: 80, 
            		flex:3,
        			fieldLabel: '담당자 E-Mail',
        			name: 'ref_email',
        			id:'ref_email'
                }
                ,{
            		xtype: 'textfield',
            		labelWidth: 80, 
            		flex:3,
        			fieldLabel: '담당자 TEL',
        			name: 'ref_hp',
        			id:'ref_hp'
                }
                ,{
            		xtype: 'textfield',
            		labelWidth: 80, 
            		flex:3,
        			fieldLabel: '담당자 FAX',
        			name: 'ref_fax',
        			id:'ref_fax'
                }    		        
                ,{
            		xtype: 'textfield',
        	    	fieldLabel:    '견적요청번호',
        	    	id:          'reserved_varchar3',
        		    name:          'reserved_varchar3',
        		    labelWidth: 80,
        		    allowBlank: true
                }
                ,{ 
                	xtype: 'textfield',
        	    	fieldLabel:    '참조프로젝트',
        	    	id:          'reserved_varchar4',
        		    name:          'reserved_varchar4',
        		    labelWidth: 80,
        		    allowBlank: true
                }
               ]}   
           ]},//endofcontainer
           {
                xtype: 'container',
                border:false,
                layout: 'anchor',
                width: '50%',
                margin: '0 0 0 0',
                defaultType: 'textfield',
                defaults: {labelAlign: 'right' },
                items: [
                new Ext.form.Hidden({
        		    	id: 'reserved_varchar1',
         		       name: 'reserved_varchar1'
         		    }),
         		    new Ext.form.Hidden({
         		    	id: 'reserved_varchar2',
         		    	name: 'reserved_varchar2'
         		    }),
         		    new Ext.form.Hidden({
         		    	id: 'reserved_number1',
         		    	name: 'reserved_number1'
         		    }),
         		    new Ext.form.Hidden({
         		    	id: 'detailPartlist',
         		    	name: 'detailPartlist'
         		    }),
         		    new Ext.form.Hidden({
         		    	id: 'def_rep_uid',
         		    	name: 'def_rep_uid'
         		    }),
         		   new Ext.form.Hidden({
         			   id: 'po_type',
        		       name: 'po_type',
        		       value: 'PY'//Y: Estimate, N:Quotation, PY,제안견적
        		    })
        		    ,
        		{
                xtype: 'fieldset',
                title: '견적조건',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
         		    { 
                    	xtype: 'textfield',
            	    	fieldLabel:    '견적 유효기간(제출일기준, 일)',
            	    	id:          'use_period',
            		    name:          'use_period',
            		    value: '10',
            		    xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
            		    minValue: 1,
            		    //margin: '0 0 0 20',
            		    labelWidth: 180,
            		    allowBlank: true
                    },{ 
                    	xtype: 'textfield',
            	    	fieldLabel:    '납기(주문일 기준, 일)',
            	    	id:          'all_del',
            		    name:          'all_del',
            		    value: '30',
            		    xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
            		    minValue: 1,
            		    //margin: '0 0 0 20',
            		    labelWidth: 180,
            		    allowBlank: true
                    },{ 
            	    	xtype: 'textfield',
            	    	fieldLabel:    '대금지불조건',
            	    	id:          'ac_condition',
            		    name:          'ac_condition',
            		    //margin: '0 0 0 20',
            		    labelWidth: 80,
            		    allowBlank: true
                    },{ 
            	    	xtype: 'textfield',
            	    	fieldLabel:    '납품장소',
            	    	id:          'reserved_varchar51',
            		    name:          'reserved_varchar51',
            		    //margin: '0 0 0 20',
            		    labelWidth: 80,
            		    allowBlank: true
                    },
             		{ 
                    	xtype: 'textfield',
            	    	fieldLabel:    '보증기간',
            	    	id:          'reserved_varchar52',
            		    name:          'reserved_varchar52',
            		    value: '납품일로부터 1년',
            		    //margin: '0 0 0 20',
            		    labelWidth: 80,
            		    allowBlank: true
                    }
                    ,{ 
            	    	xtype: 'textarea',
            	    	fieldLabel:    '기타 견적조건',
            	    	labelAlign: 'top',
            	    	id:          'reserved_varchar53',
            		    name:          'reserved_varchar53',
            		    margin: '8 0 0 0',
		    		    rows: 2,
		    		    //height: 20,
            		    allowBlank: true
                    }
            		]}
                ]
            }//endofcontainer
         ]}
         ,{ xtype: 'textfield',
    	    	emptyText:    '대표 견적 항목',
    	    	id:          'name',
    		    name:          'name',
    			margin: '5 0 0 0',
    			allowBlank: false
		},{ 
    			xtype: 'textarea',
    			margin: '5 0 0 0',
    	    	emptyText:    '대표 견적 규격',
    	    	id:          'content',
    		    name:          'content',
    		    rows: 3,
    		    height: 60,
				labelAlign: 'top',
    		    allowBlank: false
			}
		,{
            xtype: 'container',
            layout: {
                    type: 'hbox',
                    padding:'0',
                    pack:'end',
                    align:'top'
            },
            margin: '5 0 5 0',
            defaults: {
            	labelAlign: 'top',
            	margin: '0 3 0 0'
            },
            items: [{
				fieldLabel: '단가',
				name: 'total_unit_price',
				id: 'total_unit_price',
				allowBlank: false,
				editable:true,
				minValue:0,
				flex:1,
				xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
				useThousandSeparator: true,
				baseChars: '0123456789,.' ,
				thousandSeparator:',',
				listeners: {
	        		expand: function(){
	        		},
	        		collapse: function(){
	        		},
	        		change: function(d, newVal, oldVal) {
	        			var form = Ext.getCmp('innerTabsForm').getForm();
	        			var qty = Ext.getCmp('total_qty').getValue();
	        			var sum = Number(qty) * Number(newVal);
	        			var tax = Ext.getCmp('total_taxratio').getValue();
	        			console_log(sum);
	        			form.findField('total_price').setValue(sum);
	        			form.findField('total_price_tax').setValue(sum + sum*Number(tax)/100.0);

	        		}
	        	}
			},{
				fieldLabel: '단위',
				name: 'total_unit',
				id: 'total_unit',
				allowBlank: false,
				editable:true,
				width: 50,
				xtype: 'textfield',
				value: 'SET'

			},{
				fieldLabel: '수량',
				name: 'total_qty',
				id: 'total_qty',
				allowBlank: false,
				editable:true,
				minValue:1,
				width: 50,
				xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
				useThousandSeparator: true,
				baseChars: '0123456789,.' ,
				thousandSeparator:',',
				value: '1',
				listeners: {
	        		expand: function(){
	        		},
	        		collapse: function(){
	        		},
	        		change: function(d, newVal, oldVal) {
	        			var form = Ext.getCmp('innerTabsForm').getForm();
	        			var total_unit_price = Ext.getCmp('total_unit_price').getValue();
	        			var sum = Number(total_unit_price) * Number(newVal);
	        			var tax = Ext.getCmp('total_taxratio').getValue();
	        			console_log(sum);
	        			form.findField('total_price').setValue(sum);
	        			form.findField('total_price_tax').setValue(sum + sum*Number(tax)/100.0);

	        		}
				}
			},{
				fieldLabel: '합계',
				name: 'total_price',
				id: 'total_price',
				//allowBlank: false,
				editable:false,
				minValue:0,
				flex:1,
				readOnly : true,
				fieldStyle : 'background-color: #EAEAEA; background-image: none;text-align:right;',
				xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
				useThousandSeparator: true,
				baseChars: '0123456789,.' ,
				thousandSeparator:','
			},{
				fieldLabel: '부가세(%)',
				name: 'total_taxratio',
				id: 'total_taxratio',
				allowBlank: false,
				editable:false,
				minValue:0,
				width: 80,
				xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
				useThousandSeparator: true,
				baseChars: '0123456789,.' ,
				thousandSeparator:',',
				value: '10'
			},{
				fieldLabel: '부가세포함가',
				name: 'total_price_tax',
				id: 'total_price_tax',
				//allowBlank: false,
				editable:true,
				minValue:0,
				flex:1,
				readOnly : true,
				fieldStyle : 'background-color: #EAEAEA; background-image: none;text-align:right;',
				xtype:  'numberfield'/*CHANGED*/,hideTrigger: true,
				useThousandSeparator: true,
				baseChars: '0123456789,.' ,
				thousandSeparator:','
			}]
		}     ,{
            xtype: 'container',
                                        type: 'hbox',
                                        padding:'5',
                                        pack:'end',
                                        align:'middle',
            defaults: {
            },
            margin: '20 0 0 0',
            border:false,
            items: [
		        {
                    xtype:'button',
                    text: CMD_OK,
		            handler: function() {
		               if(this.up('form').getForm().isValid()) {
		                addActionNew();
		               }else {
		               	Ext.MessageBox.alert('입력 오류', '필수 입력 필드를 확인하세요.');
		               }
		            }
		        },{
		            xtype:'button',
		            text: '초기화',
		            handler: function() {
		                this.up('form').getForm().reset();
		            }
		        }
    		]
         }
		]}
	);
	
	
 
			var tabPanelListAdd = new Ext.TabPanel({
	    		id:'project-tab-panel',
	    	    collapsible: true,
				xtype: 'tabpanel',
				title:getMenuTitle(),
		        activeTab: 0,
		        tabPosition: 'top',
		        items: [{	            
		        	id: 'projectview-grid-panel-div',
		            title: '제안견적 현황',
		            border: false,
		            autoScroll:true
		        },{	            
		        	id: 'projectadd-form-panel-div',
		            title: '제안견적 등록',
		            disabled : fPERM_DISABLING(),
		            border: false,
		            autoScroll:true
		        }]
	    });
			
			
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        multiSelect: true,
			        stateId: 'stateGrid',
			        selModel: selModelItem, 
			        autoScroll : true,
			        height: getCenterPanelHeight()-53,
			        border: false,
			        bbar: getPageToolbar(store),
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    ,  '-', removeAction
			                    , '-', printPDFAction
	      				          ]
			        },
			        
			        {
			            xtype: 'toolbar',
			            items: /*(G)*/vSRCH_TOOLBAR/*vSRCH_TOOLBAR*/
			        }
			        
			        ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
// 			            getRowClass: function(record) { 
//   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
//			            } ,
			            listeners: {
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
												//el.setStyle("color", 'black');
												//el.setStyle("background", '#ff0000');
												//el.setStyle("font-size", '12px');
												//el.setStyle("font-weight", 'bold');
						
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                }/*,
			                itemdblclick: viewHandler */
			            }
			        }
//			,
//			        title: getMenuTitle()
//			        renderTo: 'MAIN_DIV_TARGET'
			    });
	
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	var rec = grid.getSelectionModel().getSelection()[0];
		            if (selections.length) {
		            	
		            	setTabState('MODIFY', selections[0]);
						//grid info 켜기
		            	displayProperty(selections[0]);
												
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();	
			            	printPDFAction.disable();	

						}else{
							if(rec.get('creator_uid')!=vCUR_USER_UID){
				            	removeAction.enable(); 
				            	printPDFAction.enable();	
				            }else{
				            	removeAction.enable();	
				            	printPDFAction.enable();	
				            }

						}

		            } else {
		            	setTabState('REGIST', null);
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable(); 
			            	printPDFAction.disable();	
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable(); 
			            	printPDFAction.disable();	
		            	}

		            }
		           
		        }
		    });
		    
	   
		
		
		var main =  Ext.create('Ext.panel.Panel', {
			id : 'tempmainport',
            width: '100%',
            height: getCenterPanelHeight()-53,
		    layout:'hbox',
	        border: false,
	        bodyPadding: 5, 
	        //layoutConfig: {columns: 1, rows:2},
//			    defaults: {
//			        collapsible: true,
//			        split: true,
//			        cmargins: '5 0 0 0',
//			        margins: '0 0 0 0'
//			    },
		   items: [
		   	{
                id: 'col-1',
                width:600,
                border: false,
                bodyPadding: 5,
                items: [
			   		tabProjectDetail
			   	]},{
	                id: 'item_detail_grid',
	                flex:1,
	                border: false,
	                layout: {
                        type:'vbox',
                        padding:'0',
                        align:'stretch'
                    }
//                        items: [
//			   	{
//			   		id: 'item_detail_grid',
//			   		title:'세부 항목',
//			   		xtype: 'panel',
//			   		border: true,
//			   		height: '100%',
//                                    layout: {
//                                        type:'vbox',
//                                        padding:'0',
//                                        align:'stretch'
//                                    },
//			   		flex: 1
//			   	}]
		   }]
		});
	

		//아이템 필드 로드
		   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'SQT2_SUB'
			    },
			    callback: function(records, operation, success) {
			    	console_log('come IN SQT2_SUB');
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], fieldItem, columnItem, tooltipItem);
				        }//endoffor
		    		 	
			    		//var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    		Ext.each(/*(G)*/columnItem, function(columnObj, index) {
			    			var dataIndex = columnObj["dataIndex"];
						//columnObj["flex"] =1;
						if(dataIndex!='no' && dataIndex!='total_price') {
							
							columnObj["editor"] = {};
							columnObj["css"] = 'edit-cell';
						} else {
									columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						        	p.tdAttr = 'style="background-color: #EAEAEA;"';
						        	return value;
					        	};
						}
//						switch(dataIndex) {
//							case 'source_price':
//							case 'delivery_date': 
//							case 'tax_ratio100':
//							case 'comment':
//								columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
//								columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
//						        	p.tdAttr = 'style="background-color: #FFE4E4;"';
//						        	return value;
//					        	};
//								break;
//						}
			    		});  		

			    	console_log(fieldItem);
			    	console_log(columnItem);
			    	
					Ext.define('RfqMapPartLine', {
				   	 extend: 'Ext.data.Model',
				   	 fields: /*(G)*/fieldItem,
				   	    proxy: {
								type: 'ajax',
						        api: {
						            read: CONTEXT_PATH + '/sales/quota.do?method=readDetail', /*1recoed, search by cond, search */
						            create: CONTEXT_PATH + '/sales/quota.do?method=createDetail', /*create record, update*/
						            update: CONTEXT_PATH + '/sales/quota.do?method=createDetail'
						        },
								reader: {
									type: 'json',
									root: 'datas',
									totalProperty: 'count',
									successProperty: 'success',
									excelPath: 'excelPath'
								},
								writer: {
						            type: 'singlepost',
						            writeAllFields: false,
						            root: 'datas'
						        } 
							}
						});
					
						console_log('RfqMapPartLine defined');
						
						itemStore = new Ext.data.Store({  
							pageSize: getPageSize(),
							model: 'RfqMapPartLine',
							sorters: [{
					            property: 'unique_id',
					            direction: 'DESC'
					        }]
						});
						
						for(var i=0; i<10; i++) {
							var o = {};
							o['no'] = i+1;
							o['item_name'] = '';
							o['full_spec'] = '';
							//o['quan'] = '';
							o['unit_code'] = 'PC';
							o['source_price'] = 0;
							o['tax_ratio100'] = 10;
							o['total_price'] = 0;
							itemStore.add(o);
						}
						
			    		
			    		itemGrid  = Ext.create('Ext.grid.Panel', {
			    			title: '세부 항목',
			    			store: itemStore,
			    			border: true,
			    			//selModel: selModel,
					        collapsible: false,
					        multiSelect: false,
					        stateId: 'itemGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        autoHeight: true,
					        flex:1,
					        columns: columnItem,
					        plugins: [cellEditingItem]
//					        ,
//					        dockedItems: [
//								{
//						     		dock: 'top',
//						             xtype: 'toolbar',
//						     		items: [removeItemAction, addItemAction]
//								}]
					    });
						console_log('created_grid Human');
			    		itemGrid.getSelectionModel().on({
			    			selectionchange: function(sm, selections) {
			    				if (selections.length) {
			    					
			    				}else {

			    				}
			    			}
			    		});
			    		
			    		var ptargetDrid = Ext.getCmp('projectview-grid-panel-div');
			    		ptargetDrid.removeAll();
			    		ptargetDrid.add(grid);
			    		ptargetDrid.doLayout();
			    		
			    		var ptargetbasicadd = Ext.getCmp('projectadd-form-panel-div');
			    		ptargetbasicadd.removeAll();
			    		ptargetbasicadd.add(main/*tabProjectDetail*/);
			    		ptargetbasicadd.doLayout();
			    			
			    		var ptarget = Ext.getCmp('item_detail_grid');
			    		ptarget.removeAll();
			    		ptarget.add(itemGrid);
			    		
			    		ptarget.add({ 
								title: '일반 견적조건',
								xtype: 'panel',
								border:true,
								layout: {
									type: 'hbox',
                                    padding: '0',
                                    align:'stretch'
                                },
                                margin: '10 0 10 0',
								items: [ 
								{
									xtype: 'textarea',
					    			margin: '0 0 0 0',
					    	    	id:          'general_cond',
					    		    name:          'general_cond',
					    		    rows: 10,
					    		    height: 200,
					    		    width: '100%',
									labelAlign: 'top',
									border:false,
					                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-size: 11px;'
							        ,value: 'General Terms and conditions\n* Prices and delevery \n\n.....\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
					    		    allowBlank: true
								}]
			    		});
			    		
			    		ptarget.doLayout();
			    		
			    	    fLAYOUT_CONTENT(tabPanelListAdd);
			    	}//endof if(success..
			    },//callback
			    scope: this
			});	
	    	

		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	 	
});	//OnReady
