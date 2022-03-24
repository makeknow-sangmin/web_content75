/**
 * @class Ext.app.Portal
 * @extends Object
 * A sample portal layout application class.
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
                
            	//portlet.setHeight(portlet.getHeight()+50);
                
                
            }
        }];
    },

    initComponent: function(){
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
            	style: 'margin-top:10px',
	            xtype: 'textfield',
	            value:          'APRO00KR',
	            id:				'waCode',
	            name:           'waCode',
	            fieldLabel: '회사코드',
	            labelWidth: 65,
	            labelAlign: 'right',
	            allowBlank: false,
	            readOnly : true,
	            minLength: 6,
	            fieldStyle : 'background-color: #EAEAEA; background-image: none; text-align:center;'
	        }, {
	            xtype: 'textfield',
	            name: 'userId',
	            id: 'userId',
	            fieldLabel: '아이디',
	            labelWidth: 65,
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
            ui:'blue-panel',
            layout: {
                type: 'border',
                padding: '0 0 0 0' // pad the layout from the window edges
            },
            items: [{
                id: 'app-header',
                region: 'north',
                border: false,
                ui:'blue-panel',
                height: 80,
                items:[{
                	xtype: 'container',
					id: 'topBg',
					height: 70,
                	layout: {
	                    type:'hbox',
	                    padding:'0 15 20 10',
	                    align:'bottom' 
	                },
		            items: [{
		                xtype: 'component',
		                style: 'padding:0px;margin-bottom:20px;margin-left:10px;font-weight: bold;font-family:"verdana";',
		                html: '<i>RFxSoft </i><span style="color:#EAEAEA;font-size:16px;font-family:맑은 고딕;text-shadow: 0 0 0 #fff;">CAD에서 B2B까지</span>'
		             },{
                            xtype:'tbspacer',
                            flex:1 
                     },{ 
		                height: 35,
		                border: false, 
		                bodyStyle: 'background:#1979CA;margin:0px;', /*#28588A*/
		                margin: '0 0 0 0',
						layout: {
                                type:'hbox',
                                pack:'end',
                                align:'middle',
                                padding:'3 0 0 0'
                            },
						defaults:{margin:'0 3 3 3'},
						items: [{
	                                xtype:'button',
	                                ui:'black-button',
	                                toggleGroup: 'portalTopMenus',
	                                pressed: true,
	                                text: 'MagicPLM' 
	                            },{
	                                xtype:'button',
	                                ui:'black-button',
	                                toggleGroup: 'portalTopMenus',
	                                text: 'TeamCUBE'
	                            },{
	                                xtype:'button',
	                                ui:'black-button',
	                                toggleGroup: 'portalTopMenus',
	                                text: 'Company'
	                            },{
	                                xtype:'button',
	                                ui:'black-button',
	                                toggleGroup: 'portalTopMenus',
	                                text: 'Contact Us'
	                            }]
	                	}]
                }]//endofitems
            },{
                xtype: 'container',
                region: 'center',
                ui:'blue-panel',
                layout: 'border',
                items: [{
                    id: 'app-options',
                    region: 'west',
                    ui:'blue-panel',
                    width: 200,
                    minWidth: 150,
                    maxWidth: 400,
                    border: false,
                    split: true,
					splitterResize: false,
//					bodyStyle:
//                    		'background-image: url(' + CONTEXT_PATH + '/media/Cotton-Spinning-393.png);' +
//                    		'background-repeat:no-repeat;background-position:93% 98%;', 
                    layout:{
                        type:'vbox',
                        padding:'0',
                        align:'stretch'
                    },
                    items: [{
		                xtype: 'tabpanel',
		                //title:'로그인', 
		                id: 'tabs',
		                ui: 'blue-tab',
		                activeTab: 0,
		                border: false,
		                tabPosition: 'top',
		                items: [
		                	loginForm
		                    ]}
                ,{
                    title:'데모사이트 링크',
                    flex: 1,
                    border: true,
                    autoScroll: true,
                    ui:'blue-panel',
                    iconCls: 'settings',
                    layout: {
                        type:'vbox',
                        padding:'7',
                        align:'stretch'
                    },
                    margin: '0 0 0 0', // top right ? ? 
                    //bodyStyle: 'background:#D0D0D0',  
                    defaults:{margin:'0 0 5 0'},
                    items: [
                    				{
                                        xtype:'button',
                                        ui:'black-button',
                                        text: 'MagicPLM All-in-One'
                                    },{
                                        xtype:'button',
                                        ui:'black-button',
                                        text: 'MagicPLM Lite'
                                    },{
                                        xtype:'button',
                                        ui:'black-button',
                                        text: 'MagicPLM Mold'
                                    }/*,{
                                        xtype:'button',
                                        ui:'blue-button',
                                        text: 'TeamCUBE'
                                    },{
                                        xtype:'button',
                                        ui:'orange-button',
                                        text: 'PowerPLM'
                                    },{
                                        xtype:'button',
                                        ui:'red-button',
                                        text: 'QMS'
                                    }*/
                    ]
                },
                {
                	border: false,
                	height: 40,
                	bodyStyle: 'padding: 10px 0px 10px 10px; background:#DFE8F6;margin-bottom:0px;vertical-align:bottom;',
                	html: 'Copyright © 2014' +
                			'<br>RFxSoft ' +
                			'All rights reserved.'
                	
                }]
               },
    			{
    				border: false,
    				region: 'center',
                    id: 'app-portal',
                	layout: {
	                    type:'hbox',
	                    padding:'0 20 0 0',
	                    align:'top' 
	                },
					autoScroll:true, 
                    //xtype: 'portalpanel',
                    items: [{
                        id: 'col-1',
                        width:320,
                        border: false,
                        items: [{
	                            id: 'portlet-1',
	                            title: '공지사항',
	                            height: 250,
	                            width: 310,
	                            ui:'blue-panel',
	                            //tools: this.getTools(),
	                            items: Ext.create('Ext.app.GridPortlet', {gubun: 'I'}),
	                            //bodyStyle: 'margin:10px;',
	                            listeners: {
	                                'close': Ext.bind(this.onPortletClose, this)
	                            }
	                        },{
	                        	border:false,
	                        	height: 5
	                        	
	                        },{
	                            id: 'portlet-2',
	                            title: '제품구매/상담신청',
	                            ui:'black-panel',
	                            width: 310,
	                            height: 190,
	                            //tools: this.getTools(),
	                    		bodyStyle:
	                    			'background:white;'+
		                    		'background-image: url(../../../media/telephone_icon.png);' +
		                    		'background-repeat:no-repeat;background-position:0% 50%;line-height:180%;',
	                            html: '<div class="portlet-content" style="margin-left:120px;border-left: #EAEAEA 1px solid;">영업팀: 민현경 차장<br>tel: (+82) 02-573-8603<BR>hp: (+82) 010-3168-9777<br>e-mail: auto6642@gmail.com' +
	                            		'<hr>CAD,도면관리,PLM 등 기업 합리화 시스템 구축 상담.'
	                            
	                            		+'</div>',
	                            listeners: {
	                                'close': Ext.bind(this.onPortletClose, this) 
	                            }
	                        }]//endofcol1items
                    },{
                        id: 'col-2',
                        flex:1,
                        border: false,
                        items: [{
				                xtype: 'tabpanel',
				                //title:'로그인', 
				                id: 'tabs-magicplm',
				                ui: 'blue-tab',
				                activeTab: 0,
	                            flex: 1,
	                            height: '100%',
	                            border: false,
				                tabPosition: 'top',
				                margin: '0 0 10 10', 
				                items: [
				                	{
				                		title: 'MagicPLM은?',
				                		height: 400,
				                		width: 500,
	                            		border: false,

	                            		//height: 580,
//				                		bodyStyle: 'padding:70px;font-size:32px;line-height:180%;font-color:#AAAAAA;font-weight:bold;text-align:center;'+
//								            		'background-image: url(' +  CONTEXT_PATH + '/view/b2b/resources/images/common/pic_comp.jpg);' +
//								            		'background-repeat:	no-repeat;'+
//								            		'background-position: 100% 100%;',
				                		//html: 'MagicPLM으로 <br>영업, 설계, 제작, 구매 까지<br> 일련의 업무 프로세스를 <br>통합/전산화 할 수 있습니다.<br><br><br><br>'
								        items: [{
									        	xtype: 'container',
													layout: {
								                    type:'hbox',
								                    //padding:'20 20 20 20',
								                    flex: 'ratio',
								                    align: 'stretch'
								                },
									        	items: [{
										        	xtype:'button',
										        	//width:'100%',
										        	//height: '100%',
										        	html: '합리화'
										        	},
										        {
										        	xtype:'button',
										        	//width:'100%',
										        	//height: '100%',
										        	html: '합리화'
										        },{
										        	xtype:'button',
										        	//width:'100%',
										        	//height: '100%',
										        	html: '합리화'
										        
										        }]
								        }]
				                	},{
				                		title: 'CEO view'
				                	},{
				                		title: '영업/수주'
				                	},{
				                		title: '프로젝트/일정'
				                	},{
				                		title: '생산/제작'
				                	},{
				                		title: '구매/재고'
				                	},{
				                		title: '도면 관리'
				                	},{
				                		title: 'CAD IF'
				                	}
				                ]
				                
				            
				            }]//endofcol1items
                    }]//endorregionitems
                }]
            }/*,{
            	xtype: 'portalpanel',
            	region: 'east',
            	flex: 1,
            	border: false
            	,bodyStyle: 
            		'background-image: url(../../../media/rfxsoft-mid-gery.png),' + 
									  'url(../../../media/Beebe_Windmill.png);' +
            		'background-repeat:	no-repeat,no-repeat;' +
            		'background-position: 95% 40%, 99% 99%;'
            	//ui:'blue-panel'
            	,items: [{
                        id: 'col-2',
                        items: [{
                            id: 'portlet-4',
                            //title: 'MagicPLM',
                            //ui:'blue-panel',
                             //layout: 'fit',
                            //height: 600,
                            //width:500,
                            tools: this.getTools(),
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            },
                            items:[{
				                xtype: 'tabpanel',
				                //title:'로그인', 
				                id: 'tabs-magicplm',
				                ui: 'blue-tab',
				                activeTab: 0,
				                border: false,
				                tabPosition: 'top',
				                items: [
				                	{
				                		title: '개요'
				                	},{
				                		title: 'CEO view'
				                	},{
				                		title: '영업/수주'
				                	},{
				                		title: '프로젝트/일정'
				                	},{
				                		title: '생산/제작'
				                	},{
				                		title: '구매/재고'
				                	},{
				                		title: '도면 관리'
				                	},{
				                		title: 'CAD IF'
				                	}
				                ]
				                
				            
				            }]
                            
                            
                            
                            
                        }]
            	}]
            }*/
            ,{
            	region: 'south',
            	ui:'blue-panel',
            	html: REMOTE_ADDR,
            	bodyStyle: 'background:#DFE8F6;text-align:right;font-size:10px;vertical-align:middle; ',
            	border: false,
            	height:15
            }
            ]
        });
        this.callParent(arguments);
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

