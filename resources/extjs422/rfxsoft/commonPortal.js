/**
 * @class Ext.app.Portal
 * @extends Object
 * 로그인 전 포탈 화면
 */

Ext.define('Ext.app.Portal', {

    extend: 'Ext.container.Viewport',
    requires: ['Ext.app.PortalPanel', 'Ext.app.PortalColumn', 'Ext.app.GridPortlet', 'Ext.app.ChartPortlet'],

    getTools: function(){
        return [{
            xtype: 'tool',
            type: 'gear',
            handler: function(e, target, header, tool){
                var portlet = header.ownerCt;
                portlet.setLoading('Loading...');
                Ext.defer(function() {
                    portlet.setLoading(false);
                }, 2000);
            }
        }];
    },

    initComponent: function(){
    	var expdate = new Date();
    	expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
    	var userId = getCookie('userId');

    	console_logs('url', CONTEXT_PATH + '/index/login.do?method=login&isAjax=1');
		var loginForm = new Ext.form.FormPanel({
		    url: CONTEXT_PATH + '/index/login.do?method=login&isAjax=1',
            waitMsg: '실행중...',
            method: 'POST',
            title:'임직원',
            height: 160,
            border: false,
            bodyStyle: 'padding: 10px 10px 10px 10px; background:#F3F4F3;',

		    items: [{
		        xtype: 'hiddenfield',
		        name: 'viewRange',
		        value: 'private'
		    },
		    {
		        xtype: 'hiddenfield',
		        name: 'hashLink',
		        value: vHashLink
		    },
		    {
            	style: 'margin-top:10px',
	            xtype: 'textfield',
	            value:          vCompanyReserved4,
	            id:				'waCode',
	            name:           'waCode',
	            fieldLabel: '회사코드',
	            labelWidth: 65,
	            labelAlign: 'right',
	            allowBlank: false,
	            //readOnly : true,
	            minLength: 6,
	            fieldStyle : 'background-image: none; text-align:center;'
	            //fieldStyle : 'background-color: #EAEAEA; background-image: none; text-align:center;'
	        }, {
	            xtype: 'textfield',
	            name: 'userId',
	            id: 'userId',
	            fieldLabel: '아이디',
	            labelWidth: 65,
	            value:userId,
	            labelAlign: 'right'//,
	        }, {
	            xtype: 'textfield',
	            name: 'password',
	            id: 'password',
	            fieldLabel: '암호',
	            labelWidth: 65,
	            labelAlign: 'right',
	            inputType: 'password'//,
	            	,
	            	listeners : {
		            		specialkey : function(field, e) {
		            		if (e.getKey() == Ext.EventObject.ENTER) {
				            	loginForm.setLoading(true);
				            	Ext.getCmp('enterBtn').disable();
								loginForm.getForm().submit({
									onSuccess: function( pResponse){
										console_log(pResponse);
														            			
				            			var msg = pResponse['responseText'];
				            			
				            			if( msg == "OK") {
					            			var wa_code = Ext.getCmp('waCode').getValue();
					            			var userId = Ext.getCmp('userId').getValue();
					            			setCookie('waCode', wa_code.toUpperCase(), expdate);
					            			setCookie('userId', userId, expdate);
				            				lfn_gotoMain();
				            			} else {
				            				Ext.getCmp('enterBtn').enable();
					            			loginForm.setLoading(false);
				            				Ext.MessageBox.alert('로그인 실패', msg,
				            						function()
				            						{
					            					Ext.getCmp('userId').focus(false, 200);
					            					});
				            			}
				            			
				            			//
									},
					                failure: function (formPanel, action) {
										Ext.getCmp('enterBtn').enable();
				            			loginForm.setLoading(false);
					                    var data = Ext.decode(action.response.responseText);
					                    console_log("Failure: " + data.msg);
					                    Ext.MessageBox.alert('오류',  data.msg,
			            						function()
			            						{
				            					Ext.getCmp('userId').focus(false, 200);
				            					});
					                }
								});
		            		}
		            	}
	            	} 
	        },{
		        	xtype: 'hiddenfield',
		        	name: 'isSupplier',
		        	value: 'N'
		        },
		        {
		            xtype: 'container',
					layout: {
                            type:'hbox',
                            padding:'5',
                            pack:'end',
                            align:'middle'
                        },
                    defaults:{margin:'0 5 0 0'},
		            items:[
				        {
		                    xtype:'button',
		                    id: 'enterBtn',
		                    text: '확인',
		                    style: 'margin-right;17px',
				            handler: function() {
				            	loginForm.setLoading(true);
				            	Ext.getCmp('enterBtn').disable();
								loginForm.getForm().submit({
									onSuccess: function( pResponse){
										console_log(pResponse);
														            			
				            			var msg = pResponse['responseText'];
				            			
				            			if( msg == "OK") {
					            			var wa_code = Ext.getCmp('waCode').getValue();
					            			var userId = Ext.getCmp('userId').getValue();
					            			setCookie('waCode', wa_code.toUpperCase(), expdate);
					            			setCookie('userId', userId, expdate);
				            				lfn_gotoMain();
				            			} else {
				            				Ext.getCmp('enterBtn').enable();
					            			loginForm.setLoading(false);
				            				Ext.MessageBox.alert('로그인 실패', msg, 
			            						function()
			            						{
				            					Ext.getCmp('userId').focus(false, 200);
				            					});
				            			}
				            			
				            			//
									},
					                failure: function (formPanel, action) {
										Ext.getCmp('enterBtn').enable();
				            			loginForm.setLoading(false);
					                    var data = Ext.decode(action.response.responseText);
					                    console_log("Failure: " + data.msg);
					                    Ext.MessageBox.alert('오류',  data.msg,
			            						function()
			            						{
				            					Ext.getCmp('userId').focus(false, 200);
				            					});
					                }
								});
				            }
				        }
		        ]}//endofcontainer
		     ]
		});
		
        Ext.apply(this, {
            id: 'app-viewport',
            layout: {
                type: 'border',
                padding: '0 0 0 0' // pad the layout from the window edges
            },
            items: [{
                id: 'app-header',
                region: 'north',
                border: false,
                height: 65,
                items:[{
                	xtype: 'container',
					id: 'topBg',
					height: 65,
                	layout: {
	                    type:'hbox',
	                    padding:'16 15 0 10',
	                    align:'middle'
	                },
		            items: [{
		                xtype: 'component',
		                style: 'padding:3px;margin:0px',
		                html:  vCompanyBrand + ' <span style="color:#E9E882;font-size:16px;font-family:맑은 고딕, tahoma">' + vCompanySlogan  + '</span>'
		             },{
                            xtype:'tbspacer',
                            flex:1
                     },{
		                height: 35,
		                border: false,
		                bodyStyle: 'background: #0685B2;',
		                margin: '0 0 0 0',
						layout: {
                                type:'hbox',
                                pack:'end',
                                align:'middle'
                            },
						defaults:{margin:'0 5 5 5'}
	                	}]
                }]//endofitems
            },{
                xtype: 'container',
                region: 'center',
                layout: 'border',
                items: [{
                    id: 'app-options',
                    region: 'west',
                    width: 200,
                    minWidth: 150,
                    maxWidth: 400,
                    split: true,
					splitterResize: false,
                    layout:{
                        type:'vbox',
                        padding:'0',
                        align:'stretch'
                    },
                    items: [{
		                xtype: 'tabpanel',
		                //title:'로그인', 
		                id: 'tabs',
		                activeTab: 0,
		                border: false,
		                tabPosition: 'top',
		                items: [
		                        loginForm

		                 ]}
                ,{
                    title:'Site Link',
                    flex: 1,
                    border: false,
                    autoScroll: true,
                    iconCls: 'settings',
                    layout: {
                        type:'vbox',
                        padding:'7',
                        align:'stretch'
                    },
                    margin: '0 0 0 0', // top right ? ?
                    defaults:{margin:'0 0 5 0'},
                    items: [
                    {
                                        xtype:'button',
                                        text: 'Homepage'
                                    },{
                                        xtype:'button',
                                        text: 'google.com'
                                    },{
                                        xtype:'button',
                                        text: 'Daum.net'
                                    },{
                                        xtype:'button',
                                        text: 'Naver.com'
                                    }
                    ]
                },
                {
                	border: false,
                	height: 80,
                	bodyStyle: 'padding: 10px 10px 10px 10px; background:#F3F4F3;',
                	html: '<hr>Copyright 2014' +
                			'<hr>RFxSoft ' +
                			'All Rights Reserved.'
                	
                }]
               },
    			{
    				border: false,
    				region: 'center',
                    id: 'app-portal',
                    xtype: 'portalpanel',
                    flex:1,
                    bodyStyle: 
                    		'background-image: url(http://hosu.io/web_content75/media/Beebe_Windmill.png),' +
											  'url(' +  CONTEXT_PATH + vCompanyBackImage + ');' +
                    		'background-repeat:	no-repeat,no-repeat;' +
                    		'background-position: 99% 99%,50% 50%;',
                    items: [{
                        id: 'col-1',
                        items: [{
                            id: 'portlet-1',
                            title: '공지사항',
                            height: 250,
                            tools: this.getTools(),
                            items: Ext.create('Ext.app.GridPortlet', {gubun: 'I'}),
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        },{
                            id: 'portlet-2',
                            title: '기술정보',
                            tools: this.getTools(),
                    		bodyStyle: 
	                    		'background-image: url(../../../media/b2b/3030000663.png);' +
	                    		'background-repeat:no-repeat;background-position:1% 50%;',
                            html: '<div class="portlet-content" style="margin-left:120px;border-left: #EAEAEA 1px solid;">기술정보입니다.<br><br><br><br><br>'+'</div>',
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                    },{
                        id: 'col-2',
                        items: [{
                            id: 'portlet-3',
                            title: '상품소개',
                            tools: this.getTools(),
							bodyStyle: 
	                    		'background-image: url(../../../media/b2b/3030000662.png);' +
	                    		'background-repeat:no-repeat;background-position:1% 50%;',
                            html: '<div class="portlet-content" style="margin-left:120px;border-left: #EAEAEA 1px solid;">상품소개입니다.<br><br><br><br><br>'+'</div>',
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                    },{
                        id: 'col-3',
                        items: [{
                            id: 'portlet-4',
                            title: '회사소개',
                            height: 400,
                            tools: this.getTools(),
                            
							bodyStyle: 
                    		'background-image: url(../../../media/willscreen_company.png);' +
                    		'background-repeat:	no-repeat;' +
                    		'background-position: 99% 99%;',
                            
                            
                            html: '<div class="portlet-content">'+'회사정보입니다.'+'</div>',
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                  }]
                }]
            }]
        });
        this.callParent(arguments);

        var o = Ext.getCmp('userId');
        console_log(o);
        if(o!=null) {
        	o.focus(false, 200);
        }
        
    },

    onPortletClose: function(portlet) {
        this.showMsg('"' + portlet.title + '" was removed');
    },

    showMsg: function(msg) {
        var el = Ext.get('app-msg'),
            msgId = Ext.id();

        this.msgId = msgId;
        el.update(msg).show();

        Ext.defer(this.clearMsg, 3000, this, [msgId]);
    },

    clearMsg: function(msgId) {
        if (msgId === this.msgId) {
            Ext.get('app-msg').hide();
        }
    }
});
