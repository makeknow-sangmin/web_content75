
Ext.define('Rfx.view.projectTotal.ProjectTotalBase', {
    extend: 'Ext.panel.Panel',
	frame   : false,
    border: false,
	split: true,
	layoutConfig: {columns: 1, rows:1},
    defaults: {
        collapsible: false,
        split: true,
        cmargins: '2 0 0 0',
        margins: '0 0 0 0'
    },
	bodyPadding: 10,
	ORG_PARAMS: {},
	CAR_PARAMS: {},
	TECH_PARAMS: {},
	TEAM_PARAMS: {},
	COST_PARAMS: {},
	TOTAL_PARAMS: {},
	HISTORY_PARAMS: {},
	PRODUCT_PARAMS: {},
	createToolbar: function(){

	        var items = [],
	            config = {};
	        if (!this.inTab) {
	         
				items.push(					{
				    xtype:'tbtext',
				    text: "기준 월:",
				    style: 'color:white;'
				    
				 },{
				       emptyText: '',
				       //hidden: true,
				       fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		               xtype:          'combo',
		               id: 'projectTotal-Month',
		               mode:           'local',
		               editable:       false,
		               allowBlank: false,
		               queryMode: 'remote',
		               displayField:   'codeName',
		               triggerAction:  'all',
		               store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
		               width: 120,
		               cls : 'newCSS',
		               listConfig:{
		               getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}			                	
		                },
		 	            listeners: {
	     	                    select: function (combo, record) {
	     	                    	var systemCode = record.get('systemCode');
	     	                    	this.TOTAL_PARAMS[this.id] = combo.getValue();
	     	                    },
	     	                    change: function(sender, newValue, oldValue, opts) {
					                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
					            }
	     	               }
		            }, 
					{
					    xtype:'tbtext',
					    text: "조회기간:",
					    style: 'color:white;'
					    
					 },
					{ 
						 id: 'projectTotal-s_date',
			                name: 's_date',
			                format: 'Y-m-d',
			              fieldStyle: 'background-color: #D6E8F6; background-image: none;',
					    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	allowBlank: true,
						    	xtype: 'datefield',
						    	value: gUtil.getNextday(-31),
						    	width: 100,
								listeners: {
						            change: {
						                fn:function(field, newValue, oldValue){
						                	console_logs('change v', field);
						                	console_logs('change newValue', newValue);
						                	console_logs('change oldValue', oldValue);
						                }
						            }
						        }
						},
						{
							xtype:'label',
						    text: "~",
						    style: 'color:white;'
						    
						 },
						{ 
							 id: 'projectTotal-e_date',
			                name: 'e_date',
			                format: 'Y-m-d',
			                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
					    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	allowBlank: true,
						    	xtype: 'datefield',
						    	value: new Date(),
						    	width: 99,
								listeners: {
						            change: {
						                fn:function(field, newValue, oldValue){
						                	console_logs('change v', field);
						                	console_logs('change newValue', newValue);
						                	console_logs('change oldValue', oldValue);
						                }
						            }
						        }
						}, '-');

		        items.push({
		        	xtype: 'component',
		            html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTotalChartAll();"></button></span></div>'
		        });
		        items.push('->');
				if(vSYSTEM_TYPE != 'HANARO') {
					items.push({
						xtype : 'checkbox',
						id : 'chkAuto-project-total',
						boxLabel : '<font color=white>화면유지</font>',
						tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
						checked: gMain.getSaveAutoRefresh(),
						listeners: {
								change: function(field, newValue, oldValue, eOpts){
									gMain.checkRefresh(newValue);
								},
								render: function(c) {
									Ext.create('Ext.tip.ToolTip', {
										target: c.getEl(),
										html: c.tip
									});
								}
						}
					},
					
					'-');
				}

		        items.push({
					xtype : 'checkbox',
					id : 'chkOpenCrud-project-total',
					boxLabel : '<font color=white>자동 창열기</font>',
					tip: '상세보기 창을 자동으로 엽니다.',
					checked: gMain.getOpenCrudWindow(),
					listeners: {
				            change: function(field, newValue, oldValue, eOpts){
				            	console_logs('field', field);
				            	console_logs('oldValue', oldValue);
				            	console_logs('newValue', newValue);
				            	console_logs('eOpts', eOpts);
				            	
				            	gMain.checkOpenCrudWindow(newValue);
				            },
				            render: function(c) {
					            Ext.create('Ext.tip.ToolTip', {
					                target: c.getEl(),
					                html: c.tip
					            });
					        }
		               }
				}, '-');
		        
		        items.push({
		        	xtype: 'component',
		            html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
		        });
		        config.items = items;
	            
	        }
	        else {
	            config.cls = 'x-docked-border-bottom';
	        }
	        config.cls = 'my-x-toolbar-default';
	        return Ext.create('widget.toolbar', config);

	},
	
	defalutInit: function() {
        this.PRODUCT_PARAMS['projectProduct-SearchType'] = '공수';
        this.PRODUCT_PARAMS['projectProduct-Month'] = '2017년 01월';
        this.ORG_PARAMS['projectOrg-SearchType'] = '공수';
        this.ORG_PARAMS['projectOrg-Month'] = '2017년 01월';
        this.CAR_PARAMS['projectCar-SearchType'] = '공수';
        this.CAR_PARAMS['projectCar-Month'] = '2017년 01월';
        this.CAR_PARAMS['projectCar-SearchOem'] = 'HMC';
        this.TECH_PARAMS['projectTech-SearchType'] = '공수';
        this.TECH_PARAMS['projectTech-Month'] = '2016년 01월';
        this.TEAM_PARAMS['projectTeam-SearchType'] = '공수';
        this.TEAM_PARAMS['projectTeam-SearchOrg'] = '연구';
        this.TEAM_PARAMS['projectTeam-Month'] = '2017년 01월';
        this.COST_PARAMS['projectCost-Month'] = '2017년 01월';
        this.COST_PARAMS['projectCost-SearchOem'] = 'HMC';
        this.HISTORY_PARAMS['projectHistory-SearchOem'] = 'HMC';
        this.TOTAL_PARAMS['projectTotal-Month'] = '2017년 01월';
        
	},
	
	defaultSetvalue: function() {
        Ext.getCmp('projectTotal-Month').setValue(this.TOTAL_PARAMS['projectTotal-Month']);		
	},
	
    initComponent: function(){
        this.dockedItems = [this.createToolbar(this.id)];
        Ext.apply(this, {
        	contentEl: 'costPagelayout'
        });
        
        this.callParent(arguments);
        
        this.defalutInit();
        this.defaultSetvalue();
        
        Ext.getBody().mask('잠시만 기다려주세요.');
        
    },
    getMonthDay: function(d) {
    	var m = (d.getMonth()+1) + '';
    	var d = (d.getDate()) + '';
    	
    	return m + '/' + d;
    },
    progressCount: 0,
    beforerequest: function() {
        if(this.progressCount == 0) {
        	Ext.getBody().mask('잠시만 기다려주세요.');
        }
        this.progressCount++;
        console_logs('on this.progressCount', this.progressCount);
    },
    requestcomplete: function() {
    	this.progressCount--;
        console_logs('complete this.progressCount', this.progressCount);
        if(this.progressCount < 1) {
            Ext.getBody().unmask();
        }
    }
});