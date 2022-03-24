
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

	
	var logTitle = '';
	
	console_log('viewRange=' + viewRange);
	var publicType = null;
	if(viewRange == 'private' || viewRange == 'private-workspace') {
		logTitle = GET_MULTILANG('logTitleWs', lang);
	} else if( viewRange == 'public-cadnpart') {
		logTitle = GET_MULTILANG('logTitleCad', lang);
		viewRange = 'public';
		publicType = 'cadnpart';
	} else {
		logTitle = GET_MULTILANG('logTitleB2b', lang);
		viewRange = 'public';
		publicType = 'exchange';
	}
	console_log('publicType:' + publicType);
    console_log('ModalWindow logTitle:' + logTitle);
	
	if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
		if(viewRange=='public') {
			goRfxB2B(lang, publicType);	
		} else {
			goHomePrivate(lang);
		}
	} else{
	
		var nationStore = Ext.create('B2bLounge.store.NationStore', {lang: lang});
	
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
		        			
		        			
		        			doLogin(nationCode, waCode, userId, password, null, null, null);
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
	    	        			doLogin(nationCode, waCode, userId, password, form, viewRange, publicType);
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
        			doLogin(nationCode, waCode, userId, password, form, viewRange, publicType);
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

function doLogin(nationCode, waCode, userId, password, form, viewRange, publicType) {
	
	if(publicType==null) {
		publicType = vPUBLIC_TYPE;
	}

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
					goRfxB2B(vLANG, publicType);
				} else {
					goHomePrivate();	
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






Ext.onReady(function() {
	
	

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
	


	expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
	
	var objCenter = null;
	var objSouth = null;
	var objEast = null;
	var objWest = null;

	var src = "/wordpress/?lang=" + vLANG;
	if(THIS_HOST!=null && THIS_HOST!='magicplm.com' && THIS_HOST!='b2bhow.com') {
		src = "http://magicplm.com" + src;
	}
	objCenter = 
	    {
			id: 'mainview-content-panel',
			region: 'center',
	        xtype : "component",
	        autoEl : {
	            tag : "iframe",
	            height: '100%',
	    	    width: '100%',
	    	    border: 0,
	    	    //scrolling: 'no',
	            src : src,
	            onload : 'removeMask()',
		        frameBorder: 0
		     }
	};	
	
    // The default dockedItem weights have TLRB order, but TBLR matches border layout:
    Ext.panel.AbstractPanel.prototype.defaultDockWeights = { top: 1, bottom: 3, left: 5, right: 7 };
	
    //var labelStr = '<b><i>login to...</i></b>';
    var tHeight =145;
    
    var 			tailObj = { 
    		iconCls: 'user_edit',
		 	text: pp_register,
		 	scale: 'small'
			,handler:
				function(){
					fcInstall(vLANG);
				}
		};
    
	if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
		labelStr = '<b><i>go to...</i></b>';
		tHeight =145;
		//labelStr = '<span title="' + vCUR_USER_UID +  '">' + vCUR_USER_NAME + '(' + vCUR_USER_ID  + ')</span>'	
		tailObj = { 
        	 	iconCls: 'door_out',
        	 	text: 'Logout',
        		handler: function(){
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
	        	};

	}
	
	if(THIS_HOST!=null && THIS_HOST!='magicplm.com' && THIS_HOST!='b2bhow.com') {
		
		var SamplePanel = Ext.extend(Ext.Panel, {
	        width    : 89,
	        height   : tHeight,
	        style    : 'margin-top:2px;margin-left:2px;',
	        bodyStyle: 'padding:10px',
	        renderTo : 'floatDiv',
	        autoScroll: true
	    });
	
		new SamplePanel({
			lbar: [
				objLang,
               '-',
	            {
	            	iconCls: 'bricks',
	                text: 'CADnPART',
	                tooltip:'CADnPART'
        			,handler: function(){
        				openLoginWindow(vLANG, 'public-cadnpart');
        			}
	            },
               {
	                iconCls: 'exchange',
	                text: 'B2BHow',
	                tooltip: 'Exchange'
        			,handler: function(){
        				openLoginWindow(vLANG, 'public-exchange');
        			}
	            },
	            {
	            	iconCls: 'cloud_login',
	                text: 'Workspace',
	                tooltip:'Workspace'
        			,handler: function(){
        				openLoginWindow(vLANG, 'private-workspace');
        			}
	            },
	            '-',     tailObj
		        ]
       });
	}

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
	        			
	        			
	        			doLogin(nationCode, waCode, userId, password, null, null, null);
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
			doLogin(nationCode, waCode, userId, password, null, null, null);
			
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

	return itemHeader;
}
});

