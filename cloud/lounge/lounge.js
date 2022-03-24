var grid = null;
var productStore = null;
var productcheck = true;
var companycheck = true;
var peoplecheck = true;
var peopleClass_code = '';
var peopleDesc = '';
var productClass_code ='';
var productDesc = '';
var menucode = 'Cloud';

var com_peo = true;

function srchSingleHandler (store, widName, parmName, isWild) {
	
	console_info("srchSingleHandler");
	console_log(widName + ':' + parmName + ':' + isWild);
	
	resetParam(store, searchField);
	var val = Ext.getCmp(widName).getValue();
	//Ext.MessageBox.alert('val',val);
	var enValue = Ext.JSON.encode(val);
	//Ext.MessageBox.alert('enValue',enValue);
	
	var enValue1 = MyUtf8.encode(val);
	//Ext.MessageBox.alert('enValue1',enValue1);
	console_log(val);
	console_log(enValue);
	console_log(enValue1);
	
	//store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
//		val = '%' + enValue + '%';
	}
	console_info(val);
	store.getProxy().setExtraParam(parmName, enValue);
	store.getProxy().setExtraParam('limit', getPageSize());
//	store.setPageSize(20);
//	store.loaddata(data);
	store.load(function() {});
	store.load(function() {});
	
};




function getPageSize() {
	var o1 = Ext.getCmp('main-panel-center');
	if(o1==undefined){
		return 13;
	}
	var height = o1.getEl().getHeight();
	console_log('getPageSize()'+ Math.floor( (height -130 ) / 21 ));
	return Math.floor( (height -130 ) / 21 ) ;
}
function getPageToolbar(store) {
 	// add a paging toolbar to the grid's footer
	   var paging = Ext.create('Ext.PagingToolbar', {
//		 pageSize:getPageSize(),
         store: store,
         displayInfo: true,
         displayMsg: 'display',//display_page_msg,
         emptyMsg: 'empty_page'//empty_page_msg
     });
     
	    // add the detailed view button
	    paging.add('-', {
	        text: 'download',//download_text,
	        iconCls: 'MSExcelX',
	        menu: {
	            items: [
	                {
	                    text: 'current_view',//current_view_text,//'Major Fields | Current Rows',
	    		        handler: printExcelHandler
	                },
	                {
	                    text: 'all_rows_text',//'Major Fields | All Rows',
	    		        handler: printExcelHandlerAll
	                }
	            ]
	        }
	    });
	    return paging;
}
var printExcelHandler = function() {
	
	resetParam(store, GsearchField);	

	store.getProxy().setExtraParam("srch_type", 'excelPrint');
	store.getProxy().setExtraParam("srch_fields", 'major');
	store.getProxy().setExtraParam("srch_rows", 'current');
	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );
	excelPrintFc (GsearchField);
};
var printExcelHandlerAll = function() {
	
	store.getProxy().setExtraParam("srch_type", 'excelPrint');
	store.getProxy().setExtraParam("srch_fields", 'major');
	store.getProxy().setExtraParam("srch_rows", 'all');
	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );  
    
	var count = Number(store.getProxy().getReader().rawData.count);
	if(count > 255) {
	    Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
	    function callBack(id) {
			excelPrintFc (GsearchField);
		}		
	} else {
		excelPrintFc (GsearchField);
	}
	
};

//function checkAction() {
//	var supplier_information = Ext.getCmp('supplier_information').getValue();
//	if( (selectionLength>0) && supplier_information !='' && supplier_information !=null) {
//		addAction.enable();
//	} else{
//		addAction.disable();
//	}	
//}

function fcInstall (lang) {
	console_log(lang);
	var myLang = lang;
	if(lang!=null) {
		myLang=lang;
	}
	lfn_gotoPage('/newUserMgmt/newUser.do?method=registCloud&selectedLanguage=' + myLang);
}


function processFindIdPass(findType) {
	lfn_gotoPage('/newUserMgmt/newUser.do?method=findIdPassCloud&selectedLanguage=' + vLANG + '&findType=' + findType);
}

function removeMask() {
	try {
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({remove:true});
	} catch(e){}
}


function openLoginWindow(lang, viewRange) {

	if(viewRange == 'join') {
	
			if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
			
				Ext.MessageBox.show({
		            title: GET_MULTILANG('EXIT_TITLE', lang),
		            msg: GET_MULTILANG('EXIT_MESG', lang),
		            buttons: Ext.MessageBox.YESNO,
		            
		            fn: function(btn) {
		            	var result = MessageBox.msg('{0}', btn);
		        	        if(result=='yes') {
		        	        	logout();
		            	    }
		            },
		            //animateTarget: 'mb4',
		            icon: Ext.MessageBox.QUESTION
		        });
		} else {
			fcInstall(lang);
		}
		return;
	}

	
	var logTitle = GET_MULTILANG('logTitleB2b', lang);
	
	if(viewRange == 'private') {
		logTitle = GET_MULTILANG('logTitleWs', lang);
	}
	
	if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
		if(viewRange=='public') {
			goRfxB2B(lang);	
		} else {
			goHomePrivate(lang);
		}
	} else{
	
		var nationStore = Ext.create('B2bLounge.store.NationStore', {lang: lang});
	
		var langTitle = GET_MULTILANG('pp_language', lang);
		var langIcon = null;
		if(lang=='ko') {
			//langTitle = '한국어';
			langIcon = 'flag-south_korea';
		} else if(lang=='zh') {
			//langTitle = '汉语简体';
			langIcon = 'flag-china';
		}else if(lang=='jp') {
			//langTitle = '日本語';
			langIcon = 'flag-japan';
		}else if(lang=='de') {
			//langTitle = 'Deutsch';
			langIcon = 'flag-german';
		}else {
			//langTitle = 'English';
			langIcon = 'flag-usa';
		}
		
		
		console_log('language end...');
		//Default Value.
		var defNationcode =  getCookie('CLOUD_NATION_CODE');
		if(defNationcode==null || defNationcode=='') {
			defNationcode = vNATION_CODE;
		}
		var defWacode =  getCookie('CLOUD_WA_CODE');
		var defUserId =  getCookie('CLOUD_USER_ID');
		var defUserPasswd = '';// getCookie('CLOUD_USER_PASS');
		
		if(defWacode!=null && defWacode!='') {
			saveAccount = true;
		}
		
		
		var items = [];
		items.push({
	        xtype: 'combo',
	        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	        store: nationStore,
	        triggerAction:  'all',
	        displayField:   'text',
	        valueField:     'value',
	        forceSelection: true,
	        editable:       false,
	        allowBlank: false,
	        value: defNationcode,
	        //width: 160,
	        queryMode: 'local',
	        listConfig:{
	            getInnerTpl: function() {
	                return '<div  class="nationCombo" data-qtip="{text}"><img src="' + CONTEXT_PATH + '/extjs/shared/icons/flag/16/{value}.png" align="left" /><font color=blue>{value}</font> {text}</div>';
	            }			                	
	        },
	        listeners: {
	        	select: function (combo, record) {
	        		Ext.getCmp('nation_code').setValue(this.getValue());
	        	}
	        }
	    });
		items.push({
			xtype: 'textfield',
			fieldStyle: 'text-transform:uppercase',
			emptyText:  GET_MULTILANG('pp_companyCode', lang),
	        width: 70,
	        id: 'waCode',
	        name: 'waCode',
	       	listeners : {
	    		
	    		keydown: function(field, e){
	    			//alert(e.keyCode);
				},
	        		specialkey : function(field, e) {
	        		if (e.getKey() == 9) {
	        			Ext.getCmp('userId').focus(false, 200);
	        		}
	        	}
	    	}            	
	    });
		items.push({
			xtype: 'textfield',
			fieldStyle: 'background-color: #E3E9EF; background-image: none; color:blue;',
			emptyText:  GET_MULTILANG('cloud_nation', lang),
	        width: 30,
	        id: 'nation_code',
	        name: 'nation_code',
	        value: vNATION_CODE,
	        readOnly: true
	    });
		items.push({
			xtype: 'textfield',
			emptyText:  GET_MULTILANG('pp_id', lang),
	        width: 70,
	        id: 'userId',
	        name: 'userId'
	    });
		items.push({
	    	xtype: 'textfield',
	    	emptyText:  GET_MULTILANG('pp_password', lang),
	        width: 70,
	        id: 'password',
	        name: 'password',
	        inputType: 'password'
	        	,
	        	listeners : {
	        		
	        		keyup: function(){
	        			console_log( Ext.getCmp('password').getValue());
	        			console_log( Ext.getDom('password'));
						if( Ext.getCmp('password').getValue().length > 0 ){
							Ext.getDom('password').type = "password";
						} else {
							Ext.getDom('password').type = "text";
						}
					},
	            		specialkey : function(field, e) {
	            		if (e.getKey() == Ext.EventObject.ENTER) {
	            			Ext.getCmp('enterBtn').disable();
	            			var nationCode =Ext.getCmp('nation_code').getValue() ;
		        			var waCode = Ext.getCmp('waCode').getValue() ;
		        			var userId = Ext.getCmp('userId').getValue();
		        			var password = Ext.getCmp('password').getValue();
		        			
		        			
		        			doLogin(nationCode, waCode, userId, password, null, null);
	            		}
	            	}
	        	}            	
	    });						            

	
		items.push({
	    	xtype: 'checkbox', 
	    	id: 'saveAccount', 
	    	name: 'saveAccount', 
	    	boxLabel: GET_MULTILANG('pp_saveAccount', lang), 
	    	style: 'margin-left: 10px; font-size:11px;color:#333333;vertical-align:middle;',
	    	checked: saveAccount,
	        handler: function() {
	        	saveAccount = this.getValue();
	        }
	    });

		items.push({ 
		 	xtype : "button",
		 	text: GET_MULTILANG('pp_register', lang),
		 	scale: 'small'
			,handler:
			function(){
				fcInstall(vLANG);
			}

		});
		
		
		// Custom rendering Template
		var codeTpl = '<tpl for="."><img src="' + CONTEXT_PATH + '/extjs/shared/icons/flag/16/{value}.png" align="left" />{text}</tpl>';
		var resultTpl = new Ext.XTemplate(
		    codeTpl
		);
		
		var form = Ext.create('Ext.form.Panel', {
			id: 'formPanel',
	        layout: {
	            type: 'vbox',
	            align: 'stretch'
	        },
	        border: false,
	        bodyPadding: 20,
	
	        fieldDefaults: {
	           labelAlign: 'top',
	            labelWidth: 70,
	            labelStyle: 'font-weight:normal; text-align:left;'
	        },
	
	        items: [
	                
				{
					fieldLabel: GET_MULTILANG('cloud_nation', lang),
				    xtype: 'combo',
				    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				    store: nationStore,
				    triggerAction:  'all',
				    displayField:   'text',
				    valueField:     'value',
				    forceSelection: true,
				    editable:       false,
				    allowBlank: false,
				    value: defNationcode,
				    width: 160,
				    queryMode: 'local',
				    listConfig:{
				        getInnerTpl: function() {
				            return '<div  class="nationCombo" data-qtip="{text}"><img src="' + CONTEXT_PATH + '/extjs/shared/icons/flag/16/{value}.png" align="left" /><font color=blue>{value}</font> {text}</div>';
				        }			                	
				    },
				    listeners: {
				    	select: function (combo, record) {
				    		Ext.getCmp('nation_code').setValue(this.getValue());
				    	}
				    }
				},
	                
	            {
	            xtype: 'fieldcontainer',
	            fieldLabel: GET_MULTILANG('pp_companyCode', lang),
	            //labelStyle: 'font-weight:bold;padding:0;text-align:left;',
	            layout: 'hbox',
	            defaultType: 'textfield',
	
	            fieldDefaults: {
	                labelAlign: 'top'
	            },
	
	            items: [{
	                flex: 1,
	                id: 'waCode',
	                name: 'waCode',
	                fieldStyle: 'text-transform:uppercase',
	                //emptyText: 'Alpabet 2 + Number 4',
	                allowBlank: false,
	               	listeners : {
	            		keydown: function(field, e){
	            			//alert(e.keyCode);
	        			},
	                		specialkey : function(field, e) {
	                		if (e.getKey() == 9) {
	                			Ext.getCmp('userId').focus(false, 200);
	                		}
	                	}
	            	}
	
	            }, {
	                width: 50,
	                id: 'nation_code',
	                name: 'nation_code',
	                value: vNATION_CODE,
	                readOnly: true,
	                fieldStyle: 'background-color: #E3E9EF; background-image: none; color:blue; text-align:center;',
	                margins: '0 0 0 5'
	            }]
	        },
	        
	        {
	            xtype: 'fieldcontainer',
	            fieldLabel: GET_MULTILANG('pp_id', lang),
	            //labelStyle: 'font-weight:bold;padding:0;text-align:left;',
	            layout: 'hbox',
	            defaultType: 'textfield',
	            fieldDefaults: {
	                labelAlign: 'top'
	            },
	
	            items: [
				        {
				            xtype: 'textfield',
				            id: 'userId',
				            name: 'userId',
				            flex: 1,
				            allowBlank: false
				        }
				      
				        ]
	        }
	        , {
	            xtype: 'textfield',
	            fieldLabel: GET_MULTILANG('pp_password', lang),
	            //afterLabelTextTpl: required,
	            allowBlank: false,
	            id: 'password',
	            name: 'password',
	            inputType: 'password'
	            	,
	            	listeners : {
	            		
	            		keyup: function(){
	            			console_log( Ext.getCmp('password').getValue());
	            			console_log( Ext.getDom('password'));
	    					if( Ext.getCmp('password').getValue().length > 0 ){
	    						Ext.getDom('password').type = "password";
	    					} else {
	    						Ext.getDom('password').type = "text";
	    					}
	    				},
	                		specialkey : function(field, e) {
	                		if (e.getKey() == Ext.EventObject.ENTER) {
	                			//Ext.getCmp('enterBtn').disable();
	                			var nationCode =Ext.getCmp('nation_code').getValue() ;
	    	        			var waCode = Ext.getCmp('waCode').getValue() ;
	    	        			var userId = Ext.getCmp('userId').getValue();
	    	        			var password = Ext.getCmp('password').getValue();
	    	        			
	    	        			form.setLoading(true);
	    	        			doLogin(nationCode, waCode, userId, password, form, viewRange);
	                		}
	                	}
	            	}
	        },
	        
	        {
	            xtype: 'fieldcontainer',
	            layout: 'hbox',
	            fieldDefaults: {
	                labelAlign: 'top'
	            },
	
	            items: [
	                    /*
				        { 
				        	xtype: 'button',
				      	 	text: pp_id
				      		,handler: function(){
				      			processFindIdPass('ID');
				      		}
				          },
				        { 
				        	xtype: 'button',
				      	 	text: pp_password + ' ' + pp_find
				      		,handler: function(){
				      			processFindIdPass('PASS');
				      		}
				          },*/
	                    {
	                    	xtype: 'label',
	                    	flex: 1
	                    },
				        {
				        	width: 80,
				        	xtype: 'checkbox', 
				        	id: 'saveAccount', 
				        	name: 'saveAccount', 	
				        	boxLabel: GET_MULTILANG('pp_saveAccount', lang), 
				        	checked: saveAccount,
				            handler: function() {
				            	saveAccount = this.getValue();
				            }
				        }

				        ]
	        }
	        
	        
	        
	 
	        ]

	    });
		
		Ext.getCmp('nation_code').setValue(defNationcode);
	    Ext.getCmp('waCode').setValue(defWacode);
	    Ext.getCmp('userId').setValue(defUserId);
	    Ext.getCmp('password').setValue(defUserPasswd);
	    
	    if(defWacode==null || defWacode =='') {
	    	Ext.getCmp('waCode').focus(false, 200);
	    } else {
	    	if(defUserId==null || defUserId =='') {
	    		Ext.getCmp('userId').focus(false, 200);
	    	} else {
	    		if(defUserPasswd==null || defUserPasswd=='') {
	    			Ext.getCmp('password').focus(false, 200);
	    		}
	    	}
	    }
	
	    var win = Ext.create('ModalWindow', {
	        title: logTitle,
	        width: 280,
	        height: 330,
	        layout: 'fit',
	        items: form,
	        resizable: false,
	        draggable: false,
	        buttons: [ 
	            {
	            text: GET_MULTILANG('CMD_OK', lang),
	        	handler: function(){
        			var nationCode =Ext.getCmp('nation_code').getValue() ;
        			var waCode = Ext.getCmp('waCode').getValue() ;
        			var userId = Ext.getCmp('userId').getValue();
        			var password = Ext.getCmp('password').getValue();
        			
        			form.setLoading(true);
        			doLogin(nationCode, waCode, userId, password, form, viewRange);
	              }
	        },{
	            text: GET_MULTILANG('CMD_CANCEL', lang),
	        	handler: function(){
	        		if(win) {
	        			win.close();
	        		}
	        	}
	        }]
	    });
	
	    win.show();
	}//endof else
 }


var searchField = [];

function resetParam(store, searchField) {
//	Ext.each(searchField, function(fieldObj, index) {
//
//		if(typeof fieldObj == 'string') { 
//			try {
//				store.getProxy().setExtraParam(fieldObj, null);	
//			} catch(e) {}
//			
//		} else {//object
//			field_id = fieldObj['field_id'];
//			try {
//				store.getProxy().setExtraParam(field_id, null);	
//			} catch(e) {}
//			/*
//			try {
//				store.getProxy().setExtraParam(field_id+ '_', null);	
//			} catch(e) {}
//			*/
//		}
//
//		
//	});
}


function srchTextHandler(greedpanel, store, widName, parmName) {
	
}

function srchTreeHandler (treepanel, store, widName, parmName) {
	
	console_info("srchSingleHandler");
	treepanel.setLoading(true);
	
	resetParam(store, searchField);
	var val = Ext.getCmp(widName).getValue();
	console_log(val);

	var enValue = null;
	if(val!=null && val != '') {
		enValue = Ext.JSON.encode(val);
		console_log(enValue);
	} else {	}
	store.getProxy().setExtraParam(parmName, enValue);
	
	store.load({
	    callback: function(records, operation, success) {
	    	console_log('load tree store');
	    	console_log('ok');
	    	treepanel.setLoading(false);
	        //treepanel.expandAll();
	    }                               
	});
};

// functions to display feedback
function onButtonClick(btn){
	alert('onItemClick' + btn.text);
}

function onItemClick(item){

    top.location.href= CONTEXT_PATH + '/index/main.do?viewRange=public&selectedLanguage=' + item.id
    + '&publicType=' + vPUBLIC_TYPE
    ;
    
}

var saveAccount = false;
var expdate = new Date();

function doLogin(nationCode, waCode, userId, password, form, viewRange) {

	Ext.Ajax.request({
		url: CONTEXT_PATH + '/index/login.do?method=login&isAjax=1',
		params:{
			waCode : waCode + nationCode,
			userId : userId,
			password : password,
			viewRange : 'private'
		},
		
		success : function(result, request) {

			var resultText = result.responseText;
			console_log('result:' + resultText);
			if(resultText != 'OK'){
				alert(resultText);
				//Ext.getCmp('enterBtn').enable();
				Ext.getCmp('password').focus(false, 200);
				if(form!=null) {
					form.setLoading(false);
				}
			}else{ //true...
				if(saveAccount==true) {
	    			setCookie('CLOUD_NATION_CODE', nationCode, expdate);
	    			setCookie('CLOUD_WA_CODE', waCode, expdate);
	    			setCookie('CLOUD_USER_ID', userId, expdate);
	    			//setCookie('CLOUD_USER_PASS', password, expdate);
				}else {
	    			setCookie('CLOUD_NATION_CODE', nationCode, expdate);
	    			setCookie('CLOUD_WA_CODE', '', expdate);
	    			setCookie('CLOUD_USER_ID', '', expdate);
				}
				
				if(viewRange=='public') {
					goRfxB2B();
				} else if(viewRange=='private'){
					goHomePrivate();	
				} else {
					
					if(vPUBLIC_TYPE=='exchange') {
						goRfxB2B();
					} else {
						goHome();	
					}
				}
				
			}
		},
		failure: function(result, request) {
			alert('call error');
			if(form!=null) {
				form.setLoading(false);
			}
			Ext.getCmp('enterBtn').enable();
		}
	});
}

function setIframeUrl(url) {
	var frame = Ext.getCmp('mainview-content-panel');
	if(frame && frame.rendered ){
	     frame.getEl().dom.src = url;
	}
}

function searchHandler() {
	alert('searchHandler');
}

//writer define
Ext.define('CodeStructure.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});



Ext.define('Board', {
  	 extend: 'Ext.data.Model',
  	 fields: [
  	          {name: 'unique_id', type:'string'},
  	          {name: 'htmlFileNames', type:'string'},
  	          {name: 'file_itemcode', type:'string'},
  	          ],
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/design/upload.do?method=exceldown&group_code=3030001246'
//		            create: CONTEXT_PATH + '/admin/board.do?method=create',
//		            update: CONTEXT_PATH + '/admin/board.do?method=create',
//		            destroy: CONTEXT_PATH + '/admin/board.do?method=destroy'
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

Ext.define('Catalog', {
	extend: 'Ext.data.Model',
	fields:[
	        {name: 'item_name', type:'string'},
	        {name: 'spec_model_desc', type:'string'},
	        {name: 'maker_name', type:'string'},
	        {name: 'unique_id', type:'string'},
	        {name: 'item_code', type:'string'}
	],
	proxy:{
        type:'ajax',
        api:{
            read:CONTEXT_PATH + '/b2b/lounge.do?method=readcatalog'
        },
        reader:{
            type:'json',
            root:'datas',
			totalProperty: 'count',
			successProperty: 'success'
        },
        writer:{
            type:'json',
            writeAllFields:true,
            encode:false,
            root:'data'
        }
        ,
        autoLoad:true
    }
});


Ext.define('NxExcel', {
	 extend: 'Ext.data.Model',
	 fields:  [ {name:'file_itemcode', type:'string'},
	            { name: 'menu', 	type: "string"    }],
	    proxy: {
			type: 'ajax',
	        api: {
//	        	read: CONTEXT_PATH + '/design/upload.do?method=exceldown', /*1recoed, search by cond, search */
	        	create: CONTEXT_PATH + '/design/upload.do?method=excelCatalog' /*1recoed, search by cond, search */
	        },
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});



Ext.define('SupAst', {
	extend: 'Ext.data.Model',
	fields:[
	        {name: 'supplier_code', type:'string'},
	        {name: 'supplier_name', type:'string'},
	        //{name: 'supplier_eng_name', type:'string'},
	        {name: 'business_registration_no', type:'string'},
	        {name: 'company_info', type:'string'}
	],
	proxy:{
        type:'ajax',
        api:{
            read:CONTEXT_PATH + '/b2b/lounge.do?method=readCompany'
        },
        reader:{
            type:'json',
            root:'datas',
			totalProperty: 'count',
			successProperty: 'success'
        },
        writer:{
            type:'json',
            writeAllFields:true,
            encode:false,
            root:'data'
        }
    }
});

var srccstFields =
	 ['id', 'object_name', 'file_size', 'status', 'progress', 'fileobject_uid', 'file_ext', 'item_code', 'group_code'];

Ext.define('SrcCst', {
 	 extend: 'Ext.data.Model',
 	 fields: srccstFields,
 	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/fileObject.do?method=readFileList',
		            create: CONTEXT_PATH + '/fileObject.do?method=create',
		            update: CONTEXT_PATH + '/fileObject.do?method=create',
		            destroy: CONTEXT_PATH + '/fileObject.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: true,
		            root: 'datas'
		        } ,
	            listeners: {
	                exception: function(proxy, response, operation){
	                	console_log('fileUpload SrcCst Model listen..');
	                    Ext.MessageBox.show({
	                        title: 'REMOTE EXCEPTION',
	                        msg: operation.getError(),
	                        icon: Ext.MessageBox.ERROR,
	                        buttons: Ext.Msg.OK
	                    });
	                }
	            }
			}
});

var uploadStore =
	new Ext.data.Store({  
	fields: srccstFields,
	model: 'SrcCst',
	sorters: [{
        property: 'id',
        direction: 'ASC'
    }] 
});
function createViewForm(board) {

	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
        defaultType: 'textfield',
        border: false,
        bodyPadding: 15,
        region: 'center',
        encType: 'multipart/form-data',
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
         items: inputItem
    });
	
}



var excelAddAction =	 Ext.create('Ext.Action', {
	itemId:'excelAddAction',
	iconCls:'add',
//	disabled: fPERM_DISABLING(),
    text: CMD_ADD,
    handler: function(widget, event) {
    	var unique_id='3030001246';
    		Board.load(unique_id ,{
				 success: function(board) {
				var htmlFileNames = board.get('htmlFileNames' );
				var lineGap = 30;
				var bHeight = 200;
				
		    	var inputItem= [];
		    	
		    	
//		    	inputItem.push(
//		    			{
//		    				xtype:'displayfield',
//		    				fieldLabel: '매뉴얼',
//					    	value: '템플리트 엑셀업로드샘플.xlsx  엑셀파일에 맞게 데이타 입력.',
//				//	    	x: 5,
//				//	    	y: 0 + 9*lineGap,
//					    	width: 60,
//					    	name: '매뉴얼',
//					    	labelWidth: 40,
//					    	anchor: '-5',  // anchor width by percentage
//					    	
//		    			});
		    	inputItem.push(
		    			{
		                 	   xtype: 'container',
		                       //width: 280,
		                       layout: 'hbox',
		                       margin: '5 5 5 0',
		                    items: [{//프로젝트코드
		                    		xtype: 'displayfield',
		                    		labelWidth: 40, 
		                    		labelAlign: 'right',
		                    		//width: 310,
		                    		value: '템플리트   Excel_Catalog_Format.xls  엑셀파일에 맞게 데이타 입력.',
		                    		anchor:'95%',
		                			fieldLabel: '매뉴얼',
		                            readOnly : true,
		                            allowBlank: false,
//		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		                            //readOnly : true,
//		                            value: description,
		                            fieldStyle: 'font-weight:normal; font-size: 13px;'
		                		},
		                		{
		                       xtype:'button',
		                       text: 'Excel샘플',
		                       //width:   40,
		                       handler: function(widget, event) {
		                       	var lang = vLANG;
		                       	switch(lang) {
		                   			case 'ko':
		                   				path='cab/Excel_Catalog_Format.xls'; //상대경로 사용
		                   				break;
		                   			case 'zh':
		                   				path='cab/Excel_Catalog_Format.xls';
		                   				break;
		                   			case 'en':
		                   				path='cab/Excel_Catalog_Format.xls';
		                   				break;
		                   			}
		                       	window.location = CONTEXT_PATH + '/filedown.do?method=direct&path='+path;
		                       }
		                    }]
		                  });
		    	
		    	
		    	inputItem.push(
		    	        {
		    	            //y: 0 + 4*lineGap,
		    	            xtype: 'filefield',
		    	            emptyText: panelSRO1149,
		    	            buttonText: 'upload',
		    	            allowBlank: true,
		    	            buttonConfig: {
		    	                iconCls: 'upload-icon'
		    	            },
		    	            anchor: '100%'
		    	        });
		
		    	
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            width: 700,
		            height: bHeight,
//		            region: 'center',
//		            encType: 'multipart/form-data',
		            defaults: {
		                anchor: '100%',
		                editable:false,
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		             items: inputItem
		        });
		
		        var win = Ext.create('ModalWindow', {
		            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 700,
		            height: bHeight,
		            minWidth: 250,
		            minHeight: 180,
		            items: form,
//		            plain:true,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    
		                    if(form.isValid())
		                     {
		                     	if(win)
		                     	{
		 		                	var val = form.getValues(false);
		 		                	
		 		///********************파일첨부시 추가(Only for FileAttachment)**************
		 		                	//alert('add Handler:' + /*(G)*/vFILE_ITEM_CODE);
		 		                	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
		 		                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
		 		                	val["menu"] = menucode;
		 		                	var nxExcel = Ext.ModelManager.create(val, 'NxExcel');
		 		                	form.submit({
		 		                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
		 		                        waitMsg: 'Uploading Files...',
		 		                        success: function(fp, o) {
		 		                        	console_log('success');
		 		                        	
		 	        	                	nxExcel.save( {	             	                	
		 	              	           		 success: function() {
		 	              	           			 if(win){
		 	              	           				 win.close();
		 	              	           			 }
		 	   	           	           		 },
		 	   	           	           		 failure : function(rec, op){
		 	   	           	           			 Ext.MessageBox.alert('Error','파일형식이 잘못되어있습니다.');
		 		                               	 console_log(rec);
		 		                               	 console_log(op);
//		 		                               	 msg('Fail', rec);
		 		                                }
		 	   	           	           	});
		 	        	                	},
		 			                    	failure : function(){
		 			                    		console_log('failure');
		 			                    		Ext.MessageBox.alert('Error','Failed');
		 			                    	}
		 			                 });
		
		                     	}
		                     }
		
		                  }
		            },{
		                text: CMD_CANCEL,
		            	handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		//            		 lfn_gotoHome();
		 
		
		            	}
		            }]
		        });
		        win.show(/*this, function(){}*/);
		    }//endofsuccess
	    });//endofboardload
     }
});



var productColumn = [];
productColumn.push(
				{ header:product_unique_id, dataIndex: 'unique_id', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:product_item_name, dataIndex: 'item_name', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:product_spec_model_desc, dataIndex: 'spec_model_desc', width : 500,  align: 'center',resizable:true,sortable : false},
				{ header:product_maker_name, dataIndex: 'maker_name', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'아이템코드', dataIndex: 'item_code', width : 120,  align: 'center',resizable:true,sortable : false}
);
var companyColumn = [];
companyColumn.push(
				{ header:'공급사코드', dataIndex: 'supplier_code', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'공급사명', dataIndex: 'supplier_name', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'사업자번호', dataIndex: 'business_registration_no', width : 120,  align: 'center',resizable:true,sortable : false},
				{ header:'회사소개', dataIndex: 'company_info', width : 120,  align: 'center',resizable:true,sortable : false}
);




Ext.onReady(function() {
	
	
//    excelStore= new Ext.data.Store({
//		model : 'NxExcel'
//	});
    
    productStore = new Ext.data.Store({
//    	pageSize : 10,
    	pageSize : getPageSize(),
		model:'Catalog',
		sorters : [ {
			property : 'unique_id',
			direction : 'ASC'
		} ]
	});
    
    companyStore = new Ext.data.Store({
//    	pageSize : 10,
    	pageSize : getPageSize(),
		model:'SupAst',
		sorters : [ {
			property : 'unique_id',
			direction : 'ASC'
		} ]
	});
//	store.load(function(records) {
	
	

	

	var langTitle = pp_language;
	var langIcon = null;
	if(selectedLanguage=='ko') {
		langTitle = '한국어';
		langIcon = 'flag-south_korea';
	} else if(selectedLanguage=='zh') {
		langTitle = '汉语简体';
		langIcon = 'flag-china';
	}else if(selectedLanguage=='jp') {
		langTitle = '日本語';
		langIcon = 'flag-japan';
	}else if(selectedLanguage=='de') {
		langTitle = 'Deutsch';
		langIcon = 'flag-german';
	}else {
		langTitle = 'English';
		langIcon = 'flag-usa';
	}
	
	
	var objLang = 
	 {
	        text: langTitle,
	        iconCls: langIcon,
	        menu: {
	            items: [
	                {
	                	iconCls: 'flag-south_korea', id:'ko', text: '한국어', handler: onItemClick
	                },
	                {
	                	iconCls: 'flag-china', id:'zh', text: '汉语简体', handler: onItemClick
	                },
	                {
	                	iconCls: 'flag-japan', id:'jp', text: '日本語', handler: onItemClick
	                },
	                {
	                	iconCls: 'flag-usa', id:'en', text: 'English', handler: onItemClick
	                },
	                {
	                	iconCls: 'flag-german', id:'de', text: 'Deutsch', handler: onItemClick
	                }
	                
	                
	            ]
	        }
	    };
	
	console_log('language end...');
	

	console_log('peooples start...');
	/**
	 * Data View
	 */
    //data to be loaded into the ArrayStore
    var data = [
      //[hasemail,hascamara,id,name   ,price  ,screen, camera,color,type,reviews,screen-size]        
        [true,  false, 1,  "dance_fever", 54, "홍길동", "2 Megapixel", "Pink", "Slider", 359, 2.400000],
        [true,  true,  2,  "gangster_zack", 180, "주윤발", "3.2 Megapixel", "Future black", "Candy bar", 11, 0.000000],
        [true,  true,  3,  "kids_hug", 155, "박연우", "2 Megapixel", "Black", "Candy bar", 113, 0.000000],
        [true,  true,  4,  "kids_hug2", 499, "엄기동", "5 Megapixel", "( the image of the product displayed may be of a different color )", "Slider", 320, 3.500000],
        [true,  false, 5,  "sara_pink", 65, "탕웨이", "0.3 Megapixel", "Silver", "Folder type phone", 5, 2.200000],
        [true,  true,  6,  "sara_pumpkin", 242, "James Dean", "8 Megapixel", "Black", "Candy bar", 79, 0.000000],
        [true,  true,  7,  "sara_smile", 299, "Mark Willberg", "2 Megapixel", "Frost", "Candy bar", 320, 2.640000],
        [true,  true,  8,  "up_to_something", 120, "오규원", "2 Megapixel", "Urban gray", "Slider", 1, 0.000000],
        [true,  true,  9,  "zack", 170, "Stteven Speelverg", "2 Megapixel", "Ultramarine blue", "Candy bar", 319, 2.360000],
        [true,  true,  10, "zack_dress", 274, "유미애", "3.2 Megapixel", "Luxury silver", "Slider", 5, 0.000000],
        [false, false, 11, "zack_hat", 140, "김만수", "2 Megapixel", "Blue", "Candy bar", 344, 2.000000],
        [false, true,  12, "zack_sink", 50, "anfldo", "", "Black", "Candy bar"																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																								, 38, 0.000000],
        [false, true,  13, "zacks_grill", 75, "하지원", "1.3 Megapixel", "", "Sidekick", 115, 0.000000],
        [false, true,  13, "zacks_grill", 75, "하지원", "1.3 Megapixel", "", "Sidekick", 115, 0.000000],
        [false, true,  13, "zacks_grill", 75, "하지원", "1.3 Megapixel", "", "Sidekick", 115, 0.000000],
        [false, true,  13, "LG-KS360", 75, "하지원", "1.3 Megapixel", "", "Sidekick", 115, 0.000000]

    ];
    
//    var peopledata = [];
//    peopledata.push(
//    				{header:'hasEmail', dataIndex: 'user_id', width : 120,  align: 'center',resizable:true,sortable : false},
//    				{header:'hasCamera', dataIndex: 'unique_id', width : 120,  align: 'center',resizable:true,sortable : false},
//    				{header:'id', dataIndex: 'user_name', width : 120,  align: 'center',resizable:true,sortable : false},
//    				{header:'회사소개', dataIndex: 'tel_no', width : 120,  align: 'center',resizable:true,sortable : false},
//    				{header:'회사소개', dataIndex: 'id', width : 120,  align: 'center',resizable:true,sortable : false}
//    );
    
    var peoplefields = [{name: 'user_id', type: 'string'},
        				{name: 'unique_id', type: 'string'},
        				{name: 'company_name', type: 'string'},
        				{name: 'user_name', type: 'string'},
        				{name: 'tel_no', type: 'string'}];
    



    Ext.define('People', {
        extend: 'Ext.data.Model',
        fields: peoplefields,

        proxy:{
            type:'ajax',
            api:{
                read:CONTEXT_PATH + '/b2b/lounge.do?method=loadPeople'
            },
            reader:{
                type:'json',
                root:'datas',
    			totalProperty: 'count',
    			successProperty: 'success'
            },
            writer:{
                type:'json',
                writeAllFields:true,
                encode:false,
                root:'data'
            }
        }
    });
    
    

    peopleStore = new Ext.data.Store({
        model: 'People',
        pageSize:10,
//        data:data,
        sorters : [ {
			property : 'unique_id',
			direction : 'ASC'
		} ]
        
    });
  

    var unspscStore = Ext.create('B2bLounge.store.UnspscStore', {lang: vLANG});
    var categoryStore = Ext.create('B2bLounge.store.CatalogStore', {lang: vLANG});


    var dataview = Ext.create('Ext.view.View', {
        deferInitialRefresh: false,
        store: peopleStore,
        tpl  : Ext.create('Ext.XTemplate',
            '<tpl for=".">',
                '<div class="phone">',
                    (!Ext.isIE6? '<img width="64" height="64" src="'+ CONTEXT_PATH + '/extjs/examples/view/images/{[values.user_id.replace(/ /g, "-")]}.jpg" />' :
                     '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + CONTEXT_PATH + '/extjs/examples/view/images/{[values.user_id.replace(/ /g, "-")]}.jpg\',sizingMethod=\'scale\')"></div>'),
                    '<strong>{user_name}</strong>',
                    '<li>아이디:{user_id}</li>',
//                    '<li>회원번호:{unique_id}</li>',
                    '<li>소속:{company_name}</li>',
                    '<li>연락처:{tel_no}</li>',
//                    '<span>{type}({tel_no} Review{[values.reviews == 1 ? "" : "s"]})</span>',
                '</div>',
            '</tpl>'
        ),
        plugins : [
            Ext.create('Ext.ux.DataView.Animated', {
                duration  : 550,
                idProperty: 'unique_id'
            })
        ],
        id: 'phones',

        itemSelector: 'div.phone',
        overItemCls : 'phone-hover',
        multiSelect : true,
        autoScroll  : true
    });
    
    console_log('peooples end...');
	expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
	
	var objCenter = null;
	var objSouth = null;
	var objEast = null;
	var objWest = null;

	var searchAction = Ext.create('Ext.Action', {
		itemId: 'searchButton',
	    iconCls: 'search',
	    text: CMD_SEARCH,
	    disabled: false ,
	    handler: searchHandler
	});
	var addAction =	 Ext.create('Ext.Action', {
		iconCls:'add',
	    text: CMD_ADD,
		disabled: false,
	    handler: function(widget, event) {
	    	
	    }
	});
	
	
	
	
	
	
	
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
	
	
	
	var productPanel = Ext.create('Ext.grid.Panel',{
			id:'main-productPanel',
			store:productStore,
            //contentEl: 'center1',
			stateful : true,
			collapsible : true,
			multiSelect : true,
			//height : getCenterPanelHeight(),
			autoHeight : true,
            autoScroll: true,
			bbar: getPageToolbar(productStore),
            title: 'Product',
            iconCls: 'App-package-utilities-icon',
            listeners: {
                activate: function(tab){
                	productStore.getProxy().setExtraParam('checked',productcheck);
//                    	var o = Ext.getCmp('main-productPanel');
    				productStore.getProxy().setExtraParam('limit', getPageSize());
//	    				productStore.proxy.setPageSize(getPageSize());
                	productStore.load(function() {});
              	  
//                	    //Tree를 가린다.
//                	    //Ext.getCmp('west-panel-tree').expand();
//                	    var w = Ext.getCmp('west-panel-tree');
//                	    w.expand();

                    setTimeout(function() {
                    	Ext.getCmp('west-panel-tree').setActiveTab(0);
                        //alert(tab.title + ' was activated.');
                    }, 1);
                }
            },
            dockedItems: [
      					{
      					    dock: 'top',
      					    xtype: 'toolbar',
      					    items: [ searchAction, '-',  excelAddAction,  '-', removeAction,
      					             '->',
      					           {
										xtype: 'checkboxfield',
									    id: 'productswitch',
									    checked: true,
									    inputValue: '-1',
									    listeners:{
									           change:function(checkbox, checked){
									        	   console_log(checked);
									        	   if(checked == false){
									        		   //combotree.disable();
									        		    productcheck = false;
											    		Ext.getCmp('srchClass_code').setValue('');
											    		Ext.getCmp('classDesc').setValue('');
									        		    productStore.getProxy().setExtraParam('checked',checked);
									        		    productStore.getProxy().setExtraParam('limit', getPageSize());
									        		    productStore.load(function() {});
									        	   }else{
									        		   //combotree.enable();
									        		    productcheck = true;
									        		    Ext.getCmp('srchClass_code').setValue(productClass_code);
											    		Ext.getCmp('classDesc').setValue(productDesc);
									        		    productStore.getProxy().setExtraParam('checked',checked);
									        		    productStore.getProxy().setExtraParam('limit', getPageSize());
									        		    productStore.load(function() {});
									        	   }
									           }
									       }
									},
        					       {
       					       			xtype: 'textfield',
       					       			fieldStyle: 'background-color: #E3E9EF; background-image: none; color:#5F6DA3;',
       					       			value:  '',
          					          width: 80,
    			                        emptyText: 'class_code',
      			                        id: 'srchClass_code',
          					          readOnly: true
       					           },
      					           {
      					       			xtype: 'textfield',
      					       			fieldStyle: 'background-color: #E3E9EF; background-image: none; color:#5F6DA3;',
      					       			emptyText:  'Path',
      					       		 id: 'classDesc',
          					          //width: 425,
      					       		 	width: 550,
          					          readOnly: true
      					           }
      					             
      					             
      					             
      					             
      					             ]
      					},
      					
      			        {
      			            xtype: 'toolbar',
      			            items: [
//          			                    {
//          			                        xtype: 'triggerfield',
//          			                        emptyText: 'class_code',
//          			                        id: 'srchClass_code',
//          			                    	listeners : {
//          				    	            		specialkey : function(field, e) {
//          				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
//          				    	            			srchSingleHandler ('srchClass_code', 'class_code', true);
//          				    	            		}
//          				    	            	}
//          				                	},
//          			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
//          			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
//          			                        'onTrigger1Click': function() {
//          			                        	Ext.getCmp('srchClass_code').setValue('');
//          			                    	},
//          			                        'onTrigger2Click': function() {
//          			                        	srchSingleHandler ('srchClass_code', 'class_code', true);
//          			                    	}
//          			                    },
//          			                    '-',
      								{
      			                        xtype: 'triggerfield',
      			                        emptyText: product_unique_id,
      			                        id: 'srchUnique_id',
      			                    	listeners : {
      				    	            		specialkey : function(field, e) {
      				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
//          							    				productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//          							    				console_log(Ext.getCmp('srchUnique_id').getValue());
//          							    				productStore.load(function() {});
      				    	            			srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
      				    	            		}
      				    	            	}
      				                	},
      			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
      			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
      			                        'onTrigger1Click': function() {
      			                        	Ext.getCmp('srchUnique_id').setValue('');
      			                        	srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
//          			                        	productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//          			                        	productStore.load(function() {});
      			                    	},
      			                        'onTrigger2Click': function() {
      			                        	srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
//          			                        	productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//          			                        	productStore.load(function() {});
      			                        	//srchSingleHandler ('srchUnique_id', 'unique_id', false);
      			                        	/*
      			                        	var unique_id = Ext.getCmp('srchUnique_id').getValue();
      			                        	store.getProxy().setExtraParam("srch_type", 'single');
      			                        	store.getProxy().setExtraParam("unique_id", unique_id);
      			                        	store.load(function() {});
      			                        	*/
      			                    	}

      								},
      			                    '-',
      			                    {
      			                        xtype: 'triggerfield',
      			                        emptyText: product_item_name,
      			                        id: 'srchItem_name',
      			                        listeners : {
      				    	            		specialkey : function(field, e) {
      				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
      				    	            			srchSingleHandler (productStore,'srchItem_name', 'item_name', true);
//          				    	            			var enValue = Ext.JSON.encode(Ext.getCmp('srchItem_name').getValue());
//          				    	            			productStore.getProxy().setExtraParam('item_name', enValue);
////          				    	            			console_log(enValue);
//          							    				productStore.load(function() {});
//          				    	            			srchSingleHandler ('srchItem_name', 'item_name', true);
      				    	            			
      				    	            		}
      				    	            	}
      				                	},
      			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
      			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
      			                        'onTrigger1Click': function() {
      			                        	Ext.getCmp('srchItem_name').setValue('');
      			                        	srchSingleHandler (productStore,'srchItem_name', 'item_name', false);
      			                    	},
      			                        'onTrigger2Click': function() {
      			                        	srchSingleHandler (productStore,'srchItem_name', 'item_name', true);
//          			                        	srchSingleHandler ('srchItem_name', 'item_name', true);
      			                    	}
      			                    	
      			                    },
      								'-',
      			                    {
      			                        xtype: 'triggerfield',
      			                        emptyText: product_spec_model_desc,
      			                        id: 'srchSpecification',
      			                        listeners : {
      				    	            		specialkey : function(field, e) {
      				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
      				    	            			srchSingleHandler (productStore,'srchSpecification', 'desc', true);
//          				    	            			var enValue = Ext.JSON.encode(Ext.getCmp('srchSpecification').getValue());
//          				    	            			productStore.getProxy().setExtraParam('desc', enValue);
//          							    				productStore.load(function() {});
//          				    	            			srchSingleHandler ('srchSpecification', 'specification', true);
      				    	            		}
      				    	            	}
      				                	},
      			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
      			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
      			                        'onTrigger1Click': function() {
      			                        	Ext.getCmp('srchSpecification').setValue('');
      			                        	srchSingleHandler (productStore,'srchSpecification', 'desc', false);
      			                    	},
      			                        'onTrigger2Click': function() {
      			                        	srchSingleHandler (productStore,'srchSpecification', 'desc', true);
//          			                        	srchSingleHandler ('srchSpecification', 'specification', true);
      			                    	}
      			                    	
      			                    },
      			                    '->', 

      			                    {
      			                        text: 'All',
      			                        iconCls: 'number03',
      			                        menu: {
      			                            items: [
      			                                {
      			                                    text: 'All',
      			                                    iconCls: 'number03'
      			                                },
      			                                {
      			                                    text:  'Company',
      			                                    iconCls: 'number02'
      			                                },
      			                                {
      			                                    text:  'Mine',
      			                                   iconCls: 'number01'
      			                                }
      			                            ]
      			                        }
      			                    }

      			                 ]
      			        }
      					
      			],
      			columns : productColumn
    		});

	var peoplePanel =  Ext.create('Ext.panel.Panel',{
            //contentEl: 'center1',
            title: 'Biz People',
            iconCls: 'Person-Male-Light-icon',
            listeners: {
                activate: function(tab){
                	com_peo = false;
                    setTimeout(function() {
                    	Ext.getCmp('west-panel-tree').setActiveTab(2);
                    }, 1);
                }
            },
            dockedItems: [
                          
						{
							    dock: 'top',
							    xtype: 'toolbar',
							    items: [ searchAction, '-',  addAction,  '-', removeAction,
							             '->',
							             {
	 											xtype: 'checkboxfield',
	 										    id: 'peopleswitch',
	 										    checked: true,
	 										    inputValue: '-1',
	 										    listeners:{
	 										           change:function(checkbox, checked){
	 										        	   console_log(checked);
	 										        	   if(checked == false){
	 										        		   //combotree.disable();
	 										        		 peoplecheck = false;
	 										        		 Ext.getCmp('peopleClass_code').setValue('');
												    		 Ext.getCmp('peopleDesc').setValue('');
	 										        		 peopleStore.getProxy().setExtraParam('checked',checked);
	 										        		 peopleStore.getProxy().setExtraParam('limit', getPageSize());
	 										        		 peopleStore.load(function() {});
	 										        	   }else{
	 										        		   //combotree.enable();
	 										        		 peoplecheck = true;
	 										        		 Ext.getCmp('peopleClass_code').setValue(peopleClass_code);
												    		 Ext.getCmp('peopleDesc').setValue(peopleDesc);
	 										        		 peopleStore.getProxy().setExtraParam('checked',checked);
	 										        		 peopleStore.getProxy().setExtraParam('limit', getPageSize());
	 										        		 peopleStore.load(function() {});
	 										        	   }
	 										           }
	 										       }
	 									},
	 									{
							       			xtype: 'textfield',
							       			fieldStyle: 'background-color: #E3E9EF; background-image: none; color:blue;',
							       			value:  '',
								          width: 80,
						                emptyText: 'class_code',
						                  id: 'peopleClass_code',
								          readOnly: true
							           },
							           {
							       			xtype: 'textfield',
							       			fieldStyle: 'background-color: #E3E9EF; background-image: none; color:blue;',
							       			emptyText:  'Path',
							       		 id: 'peopleDesc',
								          //width: 425,
							       		 	width: 550,
								          readOnly: true
							           }
							             
							             
							             
							             
							             ]
							},
        					
        			        {
        			            xtype: 'toolbar',
        			            items: [
        								{
        			                        xtype: 'triggerfield',
        			                        emptyText: '아이디',
        			                        id: 'srch_User_id',
        			                    	listeners : {
        				    	            		specialkey : function(field, e) {
        				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
        				    	            			srchSingleHandler (peopleStore,'srch_User_id', 'user_id', false);
        				    	            		}
        				    	            	}
        				                	},
        			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
        			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
        			                        'onTrigger1Click': function() {
        			                        	Ext.getCmp('srch_User_id').setValue('');
        			                        	srchSingleHandler (peopleStore,'srch_User_name', 'user_id', true);
        			                    	},
        			                        'onTrigger2Click': function() {
        			                        	srchSingleHandler (peopleStore,'srch_User_id', 'user_id', false);
        			                        	/*
        			                        	var unique_id = Ext.getCmp('srchUnique_id').getValue();
        			                        	store.getProxy().setExtraParam("srch_type", 'single');
        			                        	store.getProxy().setExtraParam("unique_id", unique_id);
        			                        	store.load(function() {});
        			                        	*/
        			                    	}

        								},
        								'-',
        			                    {
        			                        xtype: 'triggerfield',
        			                        emptyText: '이름',
        			                        id: 'srch_User_name',
        			                    	listeners : {
        				    	            		specialkey : function(field, e) {
        				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
        				    	            			srchSingleHandler (peopleStore,'srch_User_name', 'user_name', true);
        				    	            			
        				    	            		}
        				    	            	}
        				                	},
        			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
        			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
        			                        'onTrigger1Click': function() {
        			                        	Ext.getCmp('srch_User_name').setValue('');
        			                        	srchSingleHandler (peopleStore,'srch_User_name', 'user_name', true);
        			                    	},
        			                        'onTrigger2Click': function() {
        			                        	srchSingleHandler (peopleStore,'srch_User_name', 'user_name', true);
        			                        	/*
        			                        	var board_name = Ext.getCmp('srchName').getValue();
        			                        	store.getProxy().setExtraParam("srch_type", 'single');
        			                        	store.getProxy().setExtraParam("board_name", '%' + board_name + '%');
        			                        	store.load(function() {});
        			                        	*/
        			                    	}
        			                    },
        			                    '-',
        			                    {
        			                        xtype: 'triggerfield',
        			                        emptyText: '회사명',
        			                        id: 'srch_Company_name',
        			                        listeners : {
        				    	            		specialkey : function(field, e) {
        				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
        				    	            			srchSingleHandler (peopleStore,'srch_Company_name', 'supplier_name', true);
        				    	            		}
        				    	            	}
        				                	},
        			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
        			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
        			                        'onTrigger1Click': function() {
        			                        	Ext.getCmp('srch_Company_name').setValue('');
        			                        	srchSingleHandler (peopleStore,'srch_Company_name', 'supplier_name', true);
        			                    	},
        			                        'onTrigger2Click': function() {
        			                        	srchSingleHandler (peopleStore,'srch_Company_name', 'supplier_name', true);
        			                        	/*
        			                        	var board_content = Ext.getCmp('srchContents').getValue();
        			                        	store.getProxy().setExtraParam("srch_type", 'single');
        			                        	store.getProxy().setExtraParam("board_content", '%' +board_content + '%');
        			                            //store.reload();
        			                        	store.load(function() {});
        			                        	*/
        			                    	}
        			                    	
        			                    },			                    ,
        			                    '->', 

        			                    {
        			                        text: 'First Division',
        			                        iconCls: 'number01',
        			                        menu: {
        			                            items: [
        			                                {
        			                                    text: 'First Division',
        			                                    iconCls: 'number01'
        			                                },
        			                                {
        			                                    text:  'Second Division',
        			                                    iconCls: 'number02'
        			                                },
        			                                {
        			                                    text:  'Third Division',
        			                                   iconCls: 'number03'
        			                                },
        			                                {
        			                                    text:  'Fourth Division',
        			                                   iconCls: 'number04'
        			                                }
        			                            ]
        			                        }
        			                    }

        			                 ]
        			        }
        					
        			],
              autoScroll: true,
              layout: 'fit',
              items : dataview
              
        });

	var companyPanel = Ext.create('Ext.grid.Panel',{
			id:'main-companyPanel',
			store:companyStore,
            //contentEl: 'center1',
			stateful : true,
			collapsible : true,
			multiSelect : true,
			//height : getCenterPanelHeight(),
			autoHeight : true,
            autoScroll: true,
			bbar: getPageToolbar(companyStore),
            title: 'Company',
            iconCls: 'office-building-icon',
            loader: {
                url: 'ajax1.htm',
                contentType: 'html',
                loadMask: true
            },
            listeners: {
                activate: function(tab){
                	com_peo = true;
                	companyStore.getProxy().setExtraParam('checked',companycheck);
//                    	var o = Ext.getCmp('main-panel-center');
                	companyStore.getProxy().setExtraParam('limit', getPageSize());
                	companyStore.load(function() {});
//                  	  
//                	    var w = Ext.getCmp('west-panel-tree');
//                	    //w.collapse();
//                	    
                    setTimeout(function() {
                    	Ext.getCmp('west-panel-tree').setActiveTab(2);
                    }, 1);
                }
            },
            dockedItems: [
      					
      			        {
      			            xtype: 'toolbar',
      			            items: [
									{
										xtype: 'checkboxfield',
									    id: 'companyswitch',
									    checked: true,
									    inputValue: '-1',
									    listeners:{
									           change:function(checkbox, checked){
									        	   console_log(checked);
									        	   if(checked == false){
									        		   //combotree.disable();
									        		   companycheck = false;
									        		   companyStore.getProxy().setExtraParam('checked',checked);
									        		   companyStore.load(function() {});
									        	   }else{
									        		   //combotree.enable();
									        		   companycheck = true;
									        		   companyStore.getProxy().setExtraParam('checked',checked);
									        		   companyStore.load(function() {});
									        	   }
									           }
									       }
									},
      								{
      			                        xtype: 'triggerfield',
      			                        emptyText: 'supplier_code',
      			                        id: 'srchUnique_id12',
      			                    	listeners : {
      				    	            		specialkey : function(field, e) {
      				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
//          				    	            			companyStore.getProxy().setExtraParam('supplier_code', Ext.getCmp('srchUnique_id12').getValue());
//          							    				console_log(Ext.getCmp('srchUnique_id12').getValue());
//          							    				companyStore.load(function() {});
      				    	            			srchSingleHandler (companyStore,'srchUnique_id12', 'supplier_code', true);
      				    	            		}
      				    	            	}
      				                	},
      			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
      			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
      			                        'onTrigger1Click': function() {
      			                        	Ext.getCmp('srchUnique_id12').setValue('');
      			                        	srchSingleHandler (companyStore,'srchUnique_id12', 'supplier_code', false);
      			                    	},
      			                        'onTrigger2Click': function() {
      			                        	srchSingleHandler (companyStore,'srchUnique_id12', 'supplier_code', true);
      			                        	/*
      			                        	var unique_id = Ext.getCmp('srchUnique_id').getValue();
      			                        	store.getProxy().setExtraParam("srch_type", 'single');
      			                        	store.getProxy().setExtraParam("unique_id", unique_id);
      			                        	store.load(function() {});
      			                        	*/
      			                    	}

      								},
      								'-',
      			                    {
      			                        xtype: 'triggerfield',
      			                        emptyText: 'supplier_name',
      			                        id: 'srchName12',
      			                    	listeners : {
      				    	            		specialkey : function(field, e) {
      				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
      				    	            			srchSingleHandler (companyStore,'srchName12', 'supplier_name', true);
      				    	            		}
      				    	            	}
      				                	},
      			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
      			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
      			                        'onTrigger1Click': function() {
      			                        	Ext.getCmp('srchName12').setValue('');
      			                        	srchSingleHandler (companyStore,'srchName12', 'supplier_name', false);
      			                    	},
      			                        'onTrigger2Click': function() {
      			                        	srchSingleHandler (companyStore,'srchName12', 'supplier_name', true);
      			                        	/*
      			                        	var board_name = Ext.getCmp('srchName').getValue();
      			                        	store.getProxy().setExtraParam("srch_type", 'single');
      			                        	store.getProxy().setExtraParam("board_name", '%' + board_name + '%');
      			                        	store.load(function() {});
      			                        	*/
      			                    	}
      			                    },
      			                    '-',
      			                    {
      			                        xtype: 'triggerfield',
      			                        emptyText: 'company_info',
      			                        id: 'srchCode12',
      			                        listeners : {
      				    	            		specialkey : function(field, e) {
      				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
      				    	            			srchSingleHandler (companyStore,'srchCode12', 'company_info', true);
      				    	            		}
      				    	            	}
      				                	},
      			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
      			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
      			                        'onTrigger1Click': function() {
      			                        	Ext.getCmp('srchCode12').setValue('');
      			                        	srchSingleHandler (companyStore,'srchCode12', 'company_info', false);
      			                    	},
      			                        'onTrigger2Click': function() {
      			                        	srchSingleHandler (companyStore,'srchCode12', 'company_info', true);
      			                        	/*
      			                        	var board_content = Ext.getCmp('srchContents').getValue();
      			                        	store.getProxy().setExtraParam("srch_type", 'single');
      			                        	store.getProxy().setExtraParam("board_content", '%' +board_content + '%');
      			                            //store.reload();
      			                        	store.load(function() {});
      			                        	*/
      			                    	}
      			                    	
      			                    },			                    ,
      			                    '->', 

      			                    {
      			                        text: 'First Division',
      			                        iconCls: 'number01',
      			                        menu: {
      			                            items: [
      			                                {
      			                                    text: 'First Division',
      			                                    iconCls: 'number01'
      			                                },
      			                                {
      			                                    text:  'Second Division',
      			                                    iconCls: 'number02'
      			                                },
      			                                {
      			                                    text:  'Third Division',
      			                                   iconCls: 'number03'
      			                                },
      			                                {
      			                                    text:  'Fourth Division',
      			                                   iconCls: 'number04'
      			                                }
      			                            ]
      			                        }
      			                    }

      			                 ]
      			        }
      					
      			],
      			columns : companyColumn
    });
	objCenter = {
			id: 'main-panel-center', 
			//title:'B 2 B H o w',
			xtype: 'tabpanel',
            region: 'center',
            //padding: '0 5 5 5',
            //plain: true,
        activeTab: 0,
        tabPosition: 'top',
        items: [ productPanel, companyPanel, peoplePanel
        /*, {
            //contentEl: 'center2',
            title: '사용안내',
            html: '다음과 같이 사용하세여.'
        }*/]
    };
	
	objSouth = {
            // lazily created panel (xtype:'panel' is default)
            region: 'south',
            //contentEl: 'south',
            split: true,
            height: 100,
            minSize: 500,
            maxSize: 100,
            collapsible: true,
            collapsed: true,
            title: cloud_statistics,
            //iconCls:'statistics',
            margins: '0 0 0 0',
            layout:'column',
            border: false,
            items: [{
                //title: 'My Catalog',
            	border: false,
                columnWidth: .5,
                html: 'My Info'
            },{
                //title: 'My Supplier',
                columnWidth: .5,
                border: false,
                html: 'My Company'
            }]
        };
	objEast =  {
            xtype: 'tabpanel',
            region: 'east',
            title: cloud_property,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                items: [ '->', {
                   xtype: 'button',
                   text: 'test',
                   tooltip: 'Test Button'
                }]
            }],
            animCollapse: true,
            collapsible: true,
            split: true,
            width: 225, // give east and west regions a width
            minSize: 175,
            maxSize: 400,
            margins: '0 5 0 0',
            activeTab: 0,
            tabPosition: 'bottom',
            items: [{
                html: '<p>A TabPanel component can be a region.</p>',
                title: 'Detail',
                autoScroll: true
            }, Ext.create('Ext.grid.PropertyGrid', {
                    title: 'My Info',
                    //closable: true,
                    source: {
                        "(name)": "Properties Grid",
                        "grouping": false,
                        "autoFitColumns": true,
                        "productionQuality": false,
                        "created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
                        "tested": false,
                        "version": 0.01,
                        "borderWidth": 1
                    }
                })]
        };
    
    var treepanelUnspsc =
    	Ext.create('Ext.tree.Panel', {
		//border: false,
		 title: cloud_product_class,
         
		 listeners: {
             activate: function(tab){
                 setTimeout(function() {
                 	Ext.getCmp('main-panel-center').setActiveTab(0);
                     //alert(tab.title + ' was activated.');
                 }, 1);
             }
         },

         viewConfig: {
		    	listeners: {
//				    	itemcontextmenu: function(view, rec, node, index, e) {
//					    	selectedNodeId = rec.getId();
//					    	e.stopEvent();
//					    	contextMenu.showAt(e.getXY());
//					    	return false;
//					    },
				    itemclick: function(view, record, item, index, e, eOpts) {                      
//					    	rec.get('leaf'); // 이렇게 데이터 가져올 수 있음
				    	console_log(record.data);
				    	var name = record.data.text;
				    	var id = record.data.id;
				    	var depth = record.data.depth;
				    	console_log(name);
				    	console_log(id);
				    	console_log(id.substring(6,8));
				    	console_log(depth);
				    	
				    	
				    	
				    	
				    	
				    	if(depth==4) {
				    		productClass_code = id;
				    		Ext.getCmp('srchClass_code').setValue(id);
				    		Ext.Ajax.request({
				    			url: CONTEXT_PATH + '/b2b/lounge.do?method=unspscPath',
				    			params:{
				    				class_code : id,
				    				lang: vLANG
				    			},
				    			
				    			success : function(result, request) {
				    				var resultText = result.responseText;
				    				productDesc = resultText;
				    				Ext.getCmp('classDesc').setValue(resultText);
				    				productStore.getProxy().setExtraParam('class_code', id);
				    				productStore.getProxy().setExtraParam('limit', getPageSize());					    				
				    				productStore.load(function() {});
				    			},
				    			failure: function(result, request) {
				    				alert('call error');
				    			}
				    		});

				    	}
				    	else if(id.substring(6,8)!='00') {
				    		productClass_code = id;
				    		Ext.getCmp('srchClass_code').setValue(id);
				    		Ext.Ajax.request({
				    			url: CONTEXT_PATH + '/b2b/lounge.do?method=unspscPath',
				    			params:{
				    				class_code : id,
				    				lang: vLANG
				    			},
				    			
				    			success : function(result, request) {
				    				var resultText = result.responseText;
				    				productDesc = resultText;
				    				Ext.getCmp('classDesc').setValue(resultText);
				    				productStore.getProxy().setExtraParam('class_code', id);
				    				productStore.getProxy().setExtraParam('limit', getPageSize());			
				    				productStore.load(function() {});
				    			},
				    			failure: function(result, request) {
				    				alert('call error');
				    			}
				    		});

				    	}
				    	
				    }//end itemclick
		    	}//end listeners
			},
		        //border: 0,
	            dockedItems: [{
	                dock: 'top',
	                xtype: 'toolbar',
	                items: [
	                 	                    {
	          			                        xtype: 'triggerfield',
	          			                        emptyText: 'Class name',
	          			                        id: 'srchClass_name',
	          			                      width: '100%',
	          			                    	listeners : {
	          				    	            		specialkey : function(field, e) {
	          				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
	          				    	            			srchTreeHandler (treepanelUnspsc, unspscStore, 'srchClass_name', 'name', true);
	          				    	            		}
	          				    	            	}
	          				                	},
	          			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
	          			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
	          			                        'onTrigger1Click': function() {
	          			                        	Ext.getCmp('srchClass_name').setValue('');
	          			                        	srchTreeHandler (treepanelUnspsc, unspscStore, 'srchClass_name', 'name', true);
	          			                        	//alert("1");
	          			                    	},
	          			                        'onTrigger2Click': function() {
	          			                        	srchTreeHandler (treepanelUnspsc, unspscStore, 'srchClass_name', 'name', true);
	          			                        	//alert("2");
	          			                    	}
	          			                    }/* '->', { xtype: 'button', text: 'Code', pressed: false, toggleGroup: 'togTreeSort',tooltip: 'Sort by Code' }, {xtype: 'button', text: 'Name',  pressed: true, toggleGroup: 'togTreeSort', tooltip: 'Sort by Name'  } */
	                
	                ]
	            }]
			 ,
		 
		 rootVisible: false,
		//	  cls: 'examples-list',
		 lines: true,
		 useArrows: true,
		 //margins: '0 0 0 5',
		 store: unspscStore
		} );
    var treepanelBizcategory =
    	Ext.create('Ext.tree.Panel', {
             
			 listeners: {
                 activate: function(tab){
                	 if(com_peo==true){
	                	 setTimeout(function() {
	                     	Ext.getCmp('main-panel-center').setActiveTab(2);
	                         //alert(tab.title + ' was activated.');
	                     }, 1);
                	 }else{
                		 setTimeout(function() {
		                     	Ext.getCmp('main-panel-center').setActiveTab(3);
		                         //alert(tab.title + ' was activated.');
		                     }, 1);
                	 }
                 }
             },

		 title: cloud_biz_category,
		    viewConfig: {
		    	listeners: {

				    itemclick: function(view, record, item, index, e, eOpts) {
				    	console_log(record.data);
				    	var name = record.data.text;
				    	var id = record.data.id;
				    	var depth = record.data.depth;
				    	console_log(name);
				    	console_log(id);
				    	console_log(depth);
				    	
				    	if(depth==2) {
				    		peopleClass_code = id;
				    		Ext.getCmp('peopleClass_code').setValue(id);
				    		Ext.Ajax.request({
				    			url: CONTEXT_PATH + '/b2b/lounge.do?method=unspscPath',
				    			params:{
				    				class_code : id,
				    				lang: vLANG
				    			},
				    			
				    			success : function(result, request) {
				    				var resultText = result.responseText;
				    				peopleDesc = resultText;
				    				Ext.getCmp('peopleDesc').setValue(resultText);
				    				peopleStore.getProxy().setExtraParam('limit', getPageSize());
						    		peopleStore.getProxy().setExtraParam('supplier_classification_code', id);					    				
						    		peopleStore.load(function() {});
				    			},
				    			failure: function(result, request) {
				    				alert('call error');
				    			}
				    		});
				    	}
				    	
				    }//end itemclick
		    	}//end listeners
			},
		        //border: 0,
	            dockedItems: [{
	                dock: 'top',
	                xtype: 'toolbar',
	                items: [
	                 	                    {
	          			                        xtype: 'triggerfield',
	          			                        emptyText: 'Category name',
	          			                        id: 'srchCategory_name',
	          			                      width: '100%',
	          			                    	listeners : {
	          				    	            		specialkey : function(field, e) {
	          				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
	          				    	            			srchTreeHandler (treepanelBizcategory, categoryStore, 'srchCategory_name', 'name', true);
	          				    	            		}
	          				    	            	}
	          				                	},
	          			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
	          			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
	          			                        'onTrigger1Click': function() {
	          			                        	Ext.getCmp('srchCategory_name').setValue('');
	          			                        	srchTreeHandler (treepanelBizcategory, categoryStore, 'srchCategory_name', 'name', true);
	          			                    	},
	          			                        'onTrigger2Click': function() {
	          			                        	srchTreeHandler (treepanelBizcategory, categoryStore, 'srchCategory_name', 'name', true);
	          			                    	}
	          			                    }
	                
	                ]
	            }]
			 ,
		 
		 rootVisible: false,
		//	  cls: 'examples-list',
		 lines: true,
		 useArrows: true,
		 //margins: '0 0 0 5',
		 store: categoryStore
		} );

    objWest = new Ext.TabPanel({
    	//속성
    	id: 'west-panel-tree', // see Ext.getCmp() below
        xtype: 'tabpanel',
        region: 'west',
        //title: cloud_hierarchy,
        //animCollapse: false,
        //collapsible: true,
        split: true,
          width: 260,
          minWidth: 175,
          maxWidth: 400,
          margins: '0 0 0 5',
        activeTab: 0,
        tabPosition: 'top',
        items: [ treepanelUnspsc , treepanelBizcategory]
    });
	   
	
	//Default Value.
	var defNationcode =  getCookie('CLOUD_NATION_CODE');
	if(defNationcode==null || defNationcode=='') {
		defNationcode = vNATION_CODE;
	}
	var defWacode =  getCookie('CLOUD_WA_CODE');
	var defUserId =  getCookie('CLOUD_USER_ID');
	var defUserPasswd = '';// getCookie('CLOUD_USER_PASS');
	
	if(defWacode!=null && defWacode!='') {
		saveAccount = true;
	}
	
	console_log('language, wa_code end...');
	
	var itemHeader = null;
	var padding = '15 5 5 5';
	if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
		itemHeader = getLoginedToolbar(objLang);
	} else {
		itemHeader = getLoggingToolbar(objLang, defNationcode);
	}

	var objNorth = { //헤더
			id: 'mainview-head-panel',
		    region: 'north',
		    bodyStyle: {
		    	"background-color":"#D2E0F0"
		    }, 
		    padding: padding,
		    border: false,
		    height:  55,
		    items : itemHeader
		};

	
	
	var itemList = [];
	
	if(vPUBLIC_TYPE=='exchange') {
		itemList.push(objNorth);
		itemList.push(objCenter);
		itemList.push(objSouth);
		itemList.push(objEast);
		itemList.push(objWest);
	} else {
		itemList.push(objCenter);
		
		Ext.get('floatDiv').setStyle('display', 'block');

	}
	
	//View Create.
	Ext.create('Ext.Viewport', {
        id: 'mplmMainViewPort',
        layout: 'border',
        border: false,
	    items : itemList
	});
	
	
	if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
		if(vPUBLIC_TYPE=='exchange') {
		}
		
	} else {	//Not Loginned User --> tooltip생성
	
		try {
			Ext.getCmp('nation_code').setValue(defNationcode);
		    Ext.getCmp('waCode').setValue(defWacode);
		    Ext.getCmp('userId').setValue(defUserId);
		    Ext.getCmp('password').setValue(defUserPasswd);
		    
		    if(defWacode==null || defWacode =='') {
		    	Ext.getCmp('waCode').focus(false, 200);
		    } else {
		    	if(defUserId==null || defUserId =='') {
		    		Ext.getCmp('userId').focus(false, 200);
		    	} else {
		    		if(defUserPasswd==null || defUserPasswd=='') {
		    			Ext.getCmp('password').focus(false, 200);
		    		}
		    	}
		    }
		    
			var tooltipObj = {};
			
			tooltipObj["target"] = 'nation_code';
			tooltipObj["html"] = pp_nationCode;
			tooltipObj["anchor"] = 'bottom';
			tooltipObj["trackMouse"] = false;
			tooltipObj["anchorOffset"] = 0;
			Ext.create('Ext.tip.ToolTip', tooltipObj);
			
			tooltipObj["target"] = 'waCode';
			tooltipObj["html"] = pp_companyCode;
			tooltipObj["anchor"] = 'bottom';
			tooltipObj["trackMouse"] = false;
			tooltipObj["anchorOffset"] = 0;
			Ext.create('Ext.tip.ToolTip', tooltipObj);
			
			tooltipObj["target"] = 'userId';
			tooltipObj["html"] = pp_id;
			tooltipObj["anchor"] = 'bottom';
			tooltipObj["trackMouse"] = false;
			tooltipObj["anchorOffset"] = 0;
			Ext.create('Ext.tip.ToolTip', tooltipObj);
			
			tooltipObj["target"] = 'password';
			tooltipObj["html"] = pp_password;
			tooltipObj["anchor"] = 'bottom';
			tooltipObj["trackMouse"] = false;
			tooltipObj["anchorOffset"] = 0;
			Ext.create('Ext.tip.ToolTip', tooltipObj);
		} catch (noError){}
	}
	
	
	if(vPUBLIC_TYPE=='exchange') {
		removeMask();

	}

	

function isHome() {
	if(vPUBLIC_TYPE=='home'){
		return true;
	} else {
		return false;
	}
}

function isExchange() {
	if(vPUBLIC_TYPE=='exchange'){
		return true;
	} else {
		return false;
	}
}


function getCommonToolbarBtn(icon) {
	
	var arr = [];
	
//	if( icon ) {
//		arr.push(
//                {
//  					xtype: 'component',
//  					width: 92,
//  					height: 25,
//  					html : '<img src="' + CONTEXT_PATH +  '/media/magicplm2mid.png" style="margin-right:5px;"></img>'
//               }		
//		);
//		arr.push(	'-' );
//	}

	arr.push(	{ 
	 	xtype : "button",
	 	toggleGroup: 'topMenus',
	 	pressed: isHome(),
	 	iconCls: 'house',
	 	text: 'Home',
	 	scale: 'small'
		,handler: function(){
			goHome();
		}
	} );
	
	return arr;
}

function getLoginedToolbar(objLang) {
	
	var items = getCommonToolbarBtn(true);
	
	items.push({ 
	 	xtype : "button",
	 	iconCls: 'cloud_login',
	 	text: 'Workspace',// 'Workspace',
	 	scale: 'small'
		,handler: function(){
			goHomePrivate();
		}
	});
	items.push('-');
	items.push({ 
	 	xtype : "component",
	 	html : '<span style="margin-left: 120px; font-size:15px; font-weight:bold;font-color:#333333"><i>B2BHow :: Take your Biz Change !!!</i></span>'
	});
	
	items.push('->');
	items.push(objLang);
	items.push('-');
	items.push({
		xtype: 'label',
    	style: 'margin-left: 10px; font-size:11px;color:#333333;vertical-align:middle; margin-right: 10px; ',
		html: '<span title="' + vCUR_USER_UID +  '">' + vCUR_USER_NAME + '(' + vCUR_USER_ID  + ')</span>'
	});
	items.push('-');
	items.push({
		xtype : "button",
		iconAlign: 'right', 
		iconCls:'flag' + vNATION_CODE,
    	style: 'margin-left: 10px; font-size:11px;color:#333333;vertical-align:middle; margin-right: 10px; ',
    	html: '<span title="' + vWA_CODE +  '">' + vWA_NAME + '</span>'
	});
	
	items.push('-');
	items.push({ 
	 	xtype : "button",
	 	iconCls: 'door_out',
	 	text: 'Logout',
	 	scale: 'small'
		,handler: function(){
			Ext.MessageBox.show({
	            title: EXIT_TITLE,
	            msg: EXIT_MESG,
	            buttons: Ext.MessageBox.YESNO,
	            
	            fn: function(btn) {
	            	var result = MessageBox.msg('{0}', btn);
            	        if(result=='yes') {
            	        	logout();
	            	    }
	            },
	            //animateTarget: 'mb4',
	            icon: Ext.MessageBox.QUESTION
	        });
		}
	});


	var objToolbar = {
			xtype: 'toolbar',
			 border: false,
			 items: items
		};
	
	var itemHeader = [ objToolbar ];
	
//	if(publicType=='exchange') {
//		itemHeader.push(
//				{
//					xtype: 'component',
//					html : '<hr/>환영합니다.'
//				}
//		
//		);
//	}
//	
	return itemHeader;
}


function getLoggingToolbar(objLang, defNationcode) {
	var nationStore = Ext.create('B2bLounge.store.NationStore', {lang: vLANG});

	var items = getCommonToolbarBtn(false);
	items.push({
        xtype: 'combo',
        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
        store: nationStore,
        triggerAction:  'all',
        displayField:   'text',
        valueField:     'value',
         forceSelection: true,
         editable:       false,
         allowBlank: false,
        value: defNationcode,
        width: 160,
        queryMode: 'local',
        listConfig:{
            getInnerTpl: function() {
                return '<div  class="nationCombo" data-qtip="{text}"><img src="' + CONTEXT_PATH + '/extjs/shared/icons/flag/16/{value}.png" align="left" /><font color=blue>{value}</font> {text}</div>';
            }			                	
        },
        listeners: {
        	select: function (combo, record) {
        		Ext.getCmp('nation_code').setValue(this.getValue());
        	}
        }
    });
	items.push({
		xtype: 'textfield',
		fieldStyle: 'text-transform:uppercase',
		emptyText:  pp_companyCode,
        width: 70,
        id: 'waCode',
        name: 'waCode',
       	listeners : {
    		
    		keydown: function(field, e){
    			//alert(e.keyCode);
			},
        		specialkey : function(field, e) {
        		if (e.getKey() == 9) {
        			Ext.getCmp('userId').focus(false, 200);
        		}
        	}
    	}            	
    });
	items.push({
		xtype: 'textfield',
		fieldStyle: 'background-color: #E3E9EF; background-image: none; color:blue;',
		emptyText:  cloud_nation,
        width: 30,
        id: 'nation_code',
        name: 'nation_code',
        value: vNATION_CODE,
        readOnly: true
    });
	items.push('-');
	items.push({
		xtype: 'textfield',
		emptyText:  pp_id,
        width: 70,
        id: 'userId',
        name: 'userId'
    });
	items.push({
    	xtype: 'textfield',
    	emptyText:  pp_password,
        width: 70,
        id: 'password',
        name: 'password',
        inputType: 'password'
        	,
        	listeners : {
        		
        		keyup: function(){
        			console_log( Ext.getCmp('password').getValue());
        			console_log( Ext.getDom('password'));
					if( Ext.getCmp('password').getValue().length > 0 ){
						Ext.getDom('password').type = "password";
					} else {
						Ext.getDom('password').type = "text";
					}
				},
            		specialkey : function(field, e) {
            		if (e.getKey() == Ext.EventObject.ENTER) {
            			Ext.getCmp('enterBtn').disable();
            			var nationCode =Ext.getCmp('nation_code').getValue() ;
	        			var waCode = Ext.getCmp('waCode').getValue() ;
	        			var userId = Ext.getCmp('userId').getValue();
	        			var password = Ext.getCmp('password').getValue();
	        			
	        			
	        			doLogin(nationCode, waCode, userId, password, null, null);
            		}
            	}
        	}            	
    });						            
	items.push({ 
    	id : 'enterBtn',
    	name : 'enterBtn',
	 	xtype : "button",
	 	iconCls: 'cloud_login',
	 	text: pp_logIn,// 'Workspace',
	 	scale: 'small'
		,handler: function(){
			Ext.getCmp('enterBtn').disable();
			var nationCode =Ext.getCmp('nation_code').getValue() ;
			var waCode = Ext.getCmp('waCode').getValue() ;
			var userId = Ext.getCmp('userId').getValue();
			var password = Ext.getCmp('password').getValue();
			doLogin(nationCode, waCode, userId, password, null, null);
			
		}
	});
	items.push('-');
	items.push({
    	xtype: 'checkbox', 
    	id: 'saveAccount', 
    	name: 'saveAccount', 
    	boxLabel: pp_saveAccount, 
    	style: 'margin-left: 10px; font-size:11px;color:#333333;vertical-align:middle;',
    	//labelStyle: 'font-size:20px;',
    	//labelCls:'mylabel',
    	//hideLabel: true, 
    	checked: saveAccount,
        handler: function() {
        	saveAccount = this.getValue();
        }
    });
	items.push('->');
	items.push(objLang);
	items.push('-');
	items.push({ 
	 	xtype : "button",
	 	//iconCls: 'door_in',
	 	text: pp_register,
	 	scale: 'small'
		,handler:
			function(){
				fcInstall(vLANG);
			}
	});
	items.push('-');
	items.push({ 
	 	xtype : "button",
	 	//iconCls: 'door_in',
	 	text: pp_id + ' ' + pp_find,
	 	scale: 'small'
		,handler: function(){
			processFindIdPass('ID');
		}
	});
	items.push({ 
	 	xtype : "button",
	 	//iconCls: 'door_in',
	 	text: pp_password + ' ' + pp_find,
	 	scale: 'small'
		,handler: function(){
			processFindIdPass('PASS');
		}
	});
	
	var objToolbar = {
			xtype: 'toolbar',
			 border: false,
			 items: items
	};
	
	var itemHeader = [ objToolbar ];
	
//	if(publicType=='exchange') {
//		itemHeader.push(
//				{
//					xtype: 'component',
//					html : '<div>로그인해야 모든 기능을 활용할 수 있습니다.</div>'
//				}
//		
//		);
//	}	
	return itemHeader;
}
});

