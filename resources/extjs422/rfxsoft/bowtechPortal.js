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
            }
        }];
    },

    initComponent: function(){
		        
		var loginForm = new Ext.form.FormPanel({
		    url: CONTEXT_PATH + '/index/login.do?method=login',
		   
		    items: [{
		        xtype: 'hiddenfield',
		        name: 'viewRange',
		        value: 'private'
		    },{
		    	xtype: 'hiddenfield',
		            value:          'APRO00KR',
		            id:				'waCode',
		            name:           'waCode'
		        },{
		        	xtype: 'hiddenfield',
		            name: 'userId',
		            id: 'userId',
		            value: 'aprobuy'
		        },{
		        	xtype: 'hiddenfield',
		            name: 'password',
		            value: '0000',
		            inputType: 'password'
		        },{
		        	xtype: 'hiddenfield',
		        	name: 'isSupplier',
		        	value: 'N'
		        }]
		});
		
		loginForm.render(Ext.get("loginForm"));
 

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
		                html: '<i>PowerPLM </i><span style="color:#E9E882;font-size:16px;font-family:맑은 고딕, tahoma">BowTech Company</span>'
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
						defaults:{margin:'0 5 5 5'},
						items: [{
	                                xtype:'button',
	                                text: '주요제품'
	                            },{
	                                xtype:'button',
	                                text: '회사연혁'
	                            },{
	                                xtype:'button',
	                                text: '회사소개'
	                            },{
	                                xtype:'button',
	                                text: '찾아오시는 길'
	                            }]
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
		                activeTab: 0,
		                border: false,
		                tabPosition: 'top',
		                items: [
		                    {
		                        title:'개인회원',
		                        height: 160,
		                        border: false,
		                        bodyStyle: 'padding: 10px 10px 10px 10px; background:#F3F4F3;',
		                        items : [{
		                        	style: 'margin-top:10px',
						            xtype: 'textfield',
						            name: 'wa_code1',
						            fieldLabel: '회사코드',
						            labelWidth: 65,
						            labelAlign: 'right',
						            allowBlank: false,
						            value: '-지정안함-',
						            readOnly : true,
						            minLength: 6
						            ,fieldStyle : 'background-color: #EAEAEA; background-image: none; text-align:center;'
						        }, {
						            xtype: 'textfield',
						            name: 'user_id1',
						            fieldLabel: '아이디',
						            labelWidth: 65,
						            labelAlign: 'right',
						            style: 'margin-top:7px',
						            allowBlank: false,
						            minLength: 8
						        }, {
						            xtype: 'textfield',
						            name: 'password1',
						            fieldLabel: '암호',
						            labelWidth: 65,
						            labelAlign: 'right',
						            inputType: 'password',
						            style: 'margin-top:7px',
						            allowBlank: false,
						            minLength: 8
						        }, {
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
						                    text: '확인',
						                    style: 'margin-right;17px',
								            handler: function() {
												loginForm.getForm().submit({
													onSuccess: function( pResponse ){
														lfn_gotoMain();
													}
												});
								            }
								        },{
								            xtype:'button',
								            text: '회원가입',
								            handler: function() {
												loginForm.getForm().submit({
													onSuccess: function( pResponse ){
														lfn_gotoMain();
													}
												});
								            }
								        }
						        ]}
						    ]},
		                    {
		                        //html: content,
		                        title:'기업회원',
		                        height: 160,
		                        //autoScroll: true, 
		                        border: false,
		                        bodyStyle: 'padding: 10px 10px 10px 10px; background:#F3F4F3;',
		                        items : [{
		                        	style: 'margin-top:10px',
						            xtype: 'textfield',
						            name: 'wa_code2',
						            fieldLabel: '회사코드',
						            labelWidth: 65,
						            labelAlign: 'right',
						            allowBlank: false,
						            minLength: 6
						        },{
		                        	style: 'margin-top:7px',
						            xtype: 'textfield',
						            name: 'user_id2',
						            fieldLabel: '아이디',
						            labelWidth: 65,
						            labelAlign: 'right',
						            allowBlank: false,
						            minLength: 6
						        }, {
						            xtype: 'textfield',
						            name: 'password2',
						            fieldLabel: '암호',
						            labelWidth: 65,
						            labelAlign: 'right',
						            inputType: 'password',
						            style: 'margin-top:7px',
						            allowBlank: false,
						            minLength: 8
						        }, {
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
						                    text: '확인',
						                    style: 'margin-right;7px',
								            handler: function() {
												loginForm.getForm().submit({
													onSuccess: function( pResponse ){
														lfn_gotoMain();
													}
												});
								            }
								        },{
								            xtype:'button',
								            text: '회원가입',
								            handler: function() {
												loginForm.getForm().submit({
													onSuccess: function( pResponse ){
														lfn_gotoMain();
													}
												});
								            }
								        }
						        ]}
						  	]}
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
                                        text: 'CADnPART'
                                    },{
                                        xtype:'button',
                                        text: 'MAKER'
                                    },{
                                        xtype:'button',
                                        text: '공급사'
                                    },{
                                        xtype:'button',
                                        text: '가공회사'
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
											  'url(http://hosu.io/web_content75/media/rfxsoft-mid-gery.png);' +
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
                            html: '<div class="portlet-content" style="margin-left:120px;border-left: #EAEAEA 1px solid;">기술정보입니다.<br>dqwdqwd<br>dqwdwq<br>dwqdqwd<br>2r3r23r<br>r23r32r2'+'</div>',
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
                            html: '<div class="portlet-content" style="margin-left:120px;border-left: #EAEAEA 1px solid;">상품소개입니다.<br>dqwdqwd<br>dqwdwq<br>dwqdqwd<br>2r3r23r<br>r23r32r2'+'</div>',
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                    },{
                        id: 'col-3',
                        items: [{
                            id: 'portlet-4',
                            title: '회사소개',
                            height: 300,
                            tools: this.getTools(),
                            html: '<div class="portlet-content">'+'회사정보입니다.'+'</div>',
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                  }]
                }]
            }
//            ,{
//            	region: 'south',
//            	html:'회사소개입니다.',
//            	bodyStyle: 'background:#EAEAEA;',
//            	border: false,
//            	height:60
//            }
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

