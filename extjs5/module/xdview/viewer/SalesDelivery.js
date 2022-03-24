function getColName(code) {
	return code;
}
var CMD_CONFIRM = '확인';


Ext.define('SalesDeliveryTable', {
    extend: 'Ext.data.Model',
    fields: [ 
              'org1', 
              'org2', 
              'org3', 
              'org4', 
              'team_code',
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' },
              {    name: 'v4',   type: 'float' },
              {    name: 'v5',   type: 'float' },
              {    name: 'v6',   type: 'float' },
              {    name: 'v7',   type: 'float' },
              {    name: 'v8',   type: 'float' },
              {    name: 'v9',   type: 'float' },
              {    name: 'v10',   type: 'float' },
              {    name: 'v11',   type: 'float' },
              {    name: 'v12',   type: 'float' }
              ],
        proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/xdview/chart.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});

var storeSalesDeliveryTable = new Ext.data.Store({  
	pageSize: 15,
	model: 'SalesDeliveryTable'
});



var gridSalesDeliveryTable = Ext.create('Ext.grid.Panel', {
	cls : 'rfx-panel',
	title: makeGridTitle('고객사 관리'),
	border: true,
	resizable: true,
	scroll: true,
	//width: '70%',
	store: storeSalesDeliveryTable,
    region: 'center',
    collapsible: false,
  //  layout          :'fit',
    columns: [{
            	dataIndex: 'id', text: 'ID',
            	hidden:true
            },{
	            text: '회사코드',
	            dataIndex: 'org1',
	            width:100,
	            cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
	            text: '회사명',
	            width: 160,
	            dataIndex: 'org2',
	            cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
	        	text: '법인등록번호',
	        	width: 100,
	            dataIndex: 'org3',
	           cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
				text: '회사주소',
				width: 200,
	            dataIndex: 'org4',
	
	           cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
				text: '사업자번호',
				width: 100,
	           cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
				text: '대표자명',
				width: 100,
		           cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
				text: '업태',
				width: 100,
	           cls:'rfx-grid-header', 
	            style: 'text-align:center',     align:'center'
	        }, {
				text: '종목',
				width: 100,
		           cls:'rfx-grid-header', 
		            style: 'text-align:center',     align:'center'
		        }
            ],
          bbar: getPageToolbar(storeSalesDeliveryTable, true, null, function () {
                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                        }),
		  listeners: {
		     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			 }//endof itemdblclick



	  }//endof listeners
});

Ext.define('FeedViewer.SalesDelivery', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.salesDelivery',
	frame   : false,
    border: false,
	split: true,
//	style: {
//		borderColor: '#EAEAEA'
//	},
	bodyPadding: '1 0 0 0',
	createToolbar: function(){
        var items = [],
            config = {};
        if (!this.inTab) {
         

	        items.push('->');
			if(vSYSTEM_TYPE != 'HANARO') {
				items.push({
					xtype : 'checkbox',
					boxLabel : '<font color=white>화면유지</font>',
					tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
					checked: true,
					listeners: {
							change: function(field, newValue, oldValue, eOpts){
								AUTO_REFRESH = newValue;
								refreshCheckBoxAll();
							},
							render: function(c) {
								Ext.create('Ext.tip.ToolTip', {
									target: c.getEl(),
									html: c.tip
								});
							}
					}
				}, '-');
			}
	        
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

	
	layoutConfig: {columns: 1, rows:1},
			    defaults: {
			        collapsible: false,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
	bodyPadding: 10,
	
    initComponent: function(){
       // this.display = Ext.create('widget.feedpost', {});
    	this.center=null;
        this.dockedItems = [this.createToolbar()];
        this.createWest();
        this.createCenter();

        Ext.apply(this, {
            layout: 'border',
            items: [ this.west, this.center]
        });  
        this.callParent(arguments);
        // this.relayEvents(this.display, ['opentab']);
       // this.relayEvents(this.east, ['rowdblclick']);
        
    },
    
    redrawLayout: function() {   	
//    	this.removeAll();
//    	this.add(this.west);
//    	this.add(this.center);
//    	this.doLayout();

    },

    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url){
        //this.grid.loadFeed(url);
       // this.display.loadFeed(url);
    },

    /**
     * Creates the feed grid
     * @private
     * @return {FeedViewer.FeedGrid} feedGrid
     */
    createWest: function(){
    	
    	Ext.define('MenuModel', {
    	    extend: 'Ext.data.Model',
    	    fields: [
    	       {name: 'name'},
    	       {name: 'link'}
    	    ]
    	});
    	
        this.west = Ext.create('Ext.Panel', {
            frame: true,
            collapsible: true,
            region: 'west',
            width: 200,
            title: '영업.출하',
            //main: this.parent,
            items: Ext.create('Ext.view.View', {
	            store: Ext.create('Ext.data.Store', {
		                model: 'MenuModel',
		                data: [
		                    { id: 1, name: '고객사 관리', link: 'customer' },
		                    { id: 2, name: '수주 관리', link: 'spo' },
		                    { id: 3, name:' 출하 캘린더', link: 'calendar'},
		                    { id: 4, name:' 출하 관리', link: 'delivery'}
		                ]
		            }),
	            tpl: '<tpl for="."><div class="feed-list-item">{name}</div></tpl>',
	            multiSelect: false,
	            //height: 310,
	            trackOver: true,
	            itemSelector: '.feed-list-item',
	            overItemCls: 'feed-list-item-hover',
	            emptyText: 'No images to display',
	//                plugins: [
	//                    Ext.create('Ext.ux.DataView.DragSelector', {}),
	//                    Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
	//                ],
	            prepareData: function(data, a, b, c) {
	                Ext.apply(data, {
	                    //shortName: Ext.util.Format.ellipsis(data.name, 15),
	                    //sizeString: Ext.util.Format.fileSize(data.size),
	                    //dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
	                });
	                return data;
	            },
	            listeners: {
	                selectionchange: function(dv, nodes ){
	                	console_logs('dv', dv);
	                	console_logs('nodes', nodes);
	                    
	                    if(nodes.length>0) {
	                    	
	                    	var menuKey = nodes[0].get('link');
	                    	var main = Ext.getCmp('salesDeliveryMain'/*'sales-delivery'*/);
	                    	//main.setTitle(nodes[0].get('name'));
	                    	var pos = 0;
	                    	
	                    	switch(menuKey) {
	            			case 'customer':
	            				pos = 1;
	            				break;
	            			case 'spo':
	            				pos = 2;
	            				break;
	            			case 'delivery':
	            				pos = 3;
	            				break;
	                		case 'calendar':
//	                			var calendarPane = Ext.getCmp('calendarTitle');
//	                			calendarPane.setTitle(nodes[0].get('name'));
	                			pos = 0;
	                			break;
	                	}
	                    	
	                    main.setActiveItem(pos);

	                    	
	                    	//main.createCenter(nodes[0].get('link'));
	                    	//main.redrawLayout();
	                    	
	                    	//main.callParent(arguments);
	                    }
	//                            s = l !== 1 ? 's' : '';
	//                        this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
	                }
	            }
            })
        });
        
        
        return this.west;

    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
    	console_logs('onSelect', rec);
       // this.display.setActive(rec);
    },

    
    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function(){
       // this.fireEvent('openall', this);
    },

    /**
     * Create the center region container
     * @private
     * @return {Ext.panel.Panel} center
     */
    createCenter: function(){
    	var n =  Ext.create("Ext.calendar.App");
    	var arr = (n["contents"])['items'];
    	
    	var items = [];
    	var config = {};
    	
		items.push({
	       emptyText: '조회구분',
        xtype:          'combo',
        mode:           'local',
        editable:       false,
        allowBlank: false,
        queryMode: 'remote',
        displayField:   'codeName',
        triggerAction:  'all',
        store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false}),
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
                     TEAM_PARAMS[this.id] = combo.getValue();
                  },
                  change: function(sender, newValue, oldValue, opts) {
		                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
		                //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
		            }
             }
     }, '-');
	
			
	 items.push({
	     emptyText: '조직구분',
	     xtype: 'combo',
	     mode: 'local',
	     editable: false,
	     allowBlank: false,
	     queryMode: 'remote',
	     displayField: 'codeName',
	     value: '',
	     triggerAction: 'all',
	     store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'531'}),
	     width: 120,
	     cls: 'newCSS',
	     listConfig: {
	         getInnerTpl: function() {
	             return '<div data-qtip="{systemCode}">{codeName}</div>';
	         }
	     },
	     listeners: {
	         select: function(combo, record) {
	             var systemCode = record.get('systemCode');
	             TEAM_PARAMS[this.id] = combo.getValue();
	
	             console_logs('systemCode', systemCode);
	             //searcTeamStore.getProxy().setExtraParam('parentCode', systemCode);
	             //searcTeamStore.load();
	             
	             Ext.getCmp('projectTeam-SearchTeam').setValue('');
	
	         },
	         change: function(sender, newValue, oldValue, opts) {
	             this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
	             //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
	         }
	     }
	 }, '-');
	
	 items.push({
	     emptyText: '',
	     xtype: 'combo',
	     mode: 'local',
	     editable: false,
	     allowBlank: false,
	     queryMode: 'remote',
	     displayField: 'codeName',
	     triggerAction: 'all',
	     //store: searcTeamStore,
	     width: 180,
	     cls: 'newCSS',
	     listConfig: {
	         getInnerTpl: function() {
	             return '<div data-qtip="{systemCode}">{codeName}</div>';
	         }
	     },
	     listeners: {
	         select: function(combo, record) {
	             var systemCode = record.get('systemCode');
	             TEAM_PARAMS[this.id] = combo.getValue();
	
	         },
	         change: function(sender, newValue, oldValue, opts) {
	             this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
	             //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
	         }
	     }
	 }, '-');
	 
	 
	 items.push({
	     emptyText: '',
	     xtype: 'combo',
	     mode: 'local',
	     editable: false,
	     allowBlank: false,
	     queryMode: 'remote',
	     displayField: 'codeName',
	     triggerAction: 'all',
	     store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
	     width: 120,
	     cls: 'newCSS',
	     listConfig: {
	         getInnerTpl: function() {
	             return '<div data-qtip="{systemCode}">{codeName}</div>';
	         }
	     },
	     listeners: {
	         select: function(combo, record) {
	             var systemCode = record.get('systemCode');
	             //TEAM_PARAMS[this.id] = combo.getValue();
	         },
	         change: function(sender, newValue, oldValue, opts) {
	             this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
	             //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
	         }
	     }
	 }, '-');
	 
	 items.push({
	 	xtype: 'component',
	     //html: '<div class="inputBT"><button type="button" onClick="redrawTeamTable1();"><span class="search">검색</span></button></div>'
	 	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTeamTable();"></button></span></div>'
	 });
	 items.push('->');
	
	 config.items = items;
	
	
	config.cls = 'my-x-toolbar-default1';
	var toolbar =  Ext.create('widget.toolbar', config);
    	

	var items = [];
	var config = {};
	
	items.push({
       emptyText: '조회구분',
    xtype:          'combo',
    mode:           'local',
    editable:       false,
    allowBlank: false,
    queryMode: 'remote',
    displayField:   'codeName',
    triggerAction:  'all',
    store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false}),
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
                 TEAM_PARAMS[this.id] = combo.getValue();
              },
              change: function(sender, newValue, oldValue, opts) {
	                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
	                //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
	            }
         }
 }, '-');

	
items.push({
 emptyText: '조직구분',
 xtype: 'combo',
 mode: 'local',
 editable: false,
 allowBlank: false,
 queryMode: 'remote',
 displayField: 'codeName',
 value: '',
 triggerAction: 'all',
 store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'531'}),
 width: 120,
 cls: 'newCSS',
 listConfig: {
     getInnerTpl: function() {
         return '<div data-qtip="{systemCode}">{codeName}</div>';
     }
 },
 listeners: {
     select: function(combo, record) {
         var systemCode = record.get('systemCode');
         TEAM_PARAMS[this.id] = combo.getValue();

         console_logs('systemCode', systemCode);
         //searcTeamStore.getProxy().setExtraParam('parentCode', systemCode);
         //searcTeamStore.load();
         
         Ext.getCmp('projectTeam-SearchTeam').setValue('');

     },
     change: function(sender, newValue, oldValue, opts) {
         this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
         //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
     }
 }
}, '-');

items.push({
 emptyText: '',
 xtype: 'combo',
 mode: 'local',
 editable: false,
 allowBlank: false,
 queryMode: 'remote',
 displayField: 'codeName',
 triggerAction: 'all',
 //store: searcTeamStore,
 width: 180,
 cls: 'newCSS',
 listConfig: {
     getInnerTpl: function() {
         return '<div data-qtip="{systemCode}">{codeName}</div>';
     }
 },
 listeners: {
     select: function(combo, record) {
         var systemCode = record.get('systemCode');
         TEAM_PARAMS[this.id] = combo.getValue();

     },
     change: function(sender, newValue, oldValue, opts) {
         this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
         //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
     }
 }
}, '-');


items.push({
	xtype: 'component',
 //html: '<div class="inputBT"><button type="button" onClick="redrawTeamTable1();"><span class="search">검색</span></button></div>'
	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTeamTable();"></button></span></div>'
});


config.items = items;


config.cls = 'my-x-toolbar-default1';
var toolbar =  Ext.create('widget.toolbar', config);



var registAction = Ext.create('Ext.Action', {
 iconCls: 'af-plus',
 text: gm.getMC('CMD_Enrollment', '등록'),
 toggleGroup: 'toolbarcmd',
 handler: function(widget, event) {

 }
});

var editAction = Ext.create('Ext.Action', {
	 iconCls: 'af-edit',
	 text: gm.getMC('CMD_MODIFY', '수정'),
	 toggleGroup: 'toolbarcmd',
	 disabled: true,
	 handler: function(widget, event) {

 }
});

var copyAction = Ext.create('Ext.Action', {
	 iconCls: 'af-copy',
	 text: '복사등록',
	 toggleGroup: 'toolbarcmd',
	 disabled: true,
	 handler: function(widget, event) {

 }
});


var viewAction = Ext.create('Ext.Action', {
	 iconCls: 'af-columns',
	 text: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
	 toggleGroup: 'toolbarcmd',
	 pressed: true,
	 handler: function(widget, event) {

 }
});


var removeAction = Ext.create('Ext.Action', {
 iconCls: 'af-remove',
 text: gm.getMC('CMD_DELETE', '삭제'),
 disabled: true,
 handler: function(widget, event) {

 }
});

	
var excelAction = Ext.create('Ext.Action', {
 iconCls: 'af-download',
 text: 'Excel',
 handler: function(widget, event) {

 }
});


var toolbar2 = Ext.create('widget.toolbar', {
cls: 'my-x-toolbar-default2',
items: [
          registAction
		 ,editAction
		 ,copyAction
		 ,'-'
		 ,removeAction
		 
//		 ,
//		 {
//        	  xtype: 'component',
//        	  html:'<i class="fa fa-arrows-h"></i>hello'
//		 }
		 ,'->'
		 ,excelAction
		 ,viewAction
        ]
});
gridSalesDeliveryTable.addDocked(toolbar2);
gridSalesDeliveryTable.addDocked(toolbar);


var card1 = {
		//title: '등록',
    	
    	//resizable: true,
    	//scroll: true,
        //layout   :'fit',
        //forceFit: true,
        //collapsible: true,
    	//width: '30%',
    	//region:'east',
    	layout: 'form',
    	bodyPadding: 10,
        items: [{
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '회사코드',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '회사명',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '법인등록번호',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '회사주소',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '사업자등록번호',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '대표자명',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '업태',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '종목',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '담당자이름',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '담당자 이메일',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '담당자 전화',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '담당자 FAX',
            value: ''
        }, {
            xtype: 'textfield',
            //name: 'textfield1',
            fieldLabel: '담당자 핸드폰',
            value: ''
        }, {
            xtype: 'textareafield',
            fieldLabel: '설명',
            value: ''
        },
        {
            xtype: 'hiddenfield',
            name: 'hidden1',
            value: ''
        },{
            xtype: 'textfield',
            name: 'password1',
            inputType: 'password',
            fieldLabel: 'Password field'
        },
        {
            xtype: 'filefield',
            name: 'file1',
            fieldLabel: 'File upload'
        }, 
        
        {
            xtype: 'textareafield',
            name: 'textarea1',
            fieldLabel: 'TextArea',
            value: 'Textarea value'
        }, {
            xtype: 'displayfield',
            name: 'displayfield1',
            fieldLabel: 'Display field',
            value: 'Display field <span style="color:green;">value</span>'
        }, {
            xtype: 'numberfield',
            name: 'numberfield1',
            fieldLabel: 'Number field',
            value: 5,
            minValue: 0,
            maxValue: 50
        }, {
            xtype: 'checkboxfield',
            name: 'checkbox1',
            fieldLabel: 'Checkbox',
            boxLabel: 'box label'
        }, {
            xtype: 'radiofield',
            name: 'radio1',
            value: 'radiovalue1',
            fieldLabel: 'Radio buttons',
            boxLabel: 'radio 1'
        }, {
            xtype: 'radiofield',
            name: 'radio1',
            value: 'radiovalue2',
            fieldLabel: '',
            labelSeparator: '',
            hideEmptyLabel: false,
            boxLabel: 'radio 2'
        }, {
            xtype: 'datefield',
            name: 'date1',
            fieldLabel: 'Date Field'
        }, {
            xtype: 'timefield',
            name: 'time1',
            fieldLabel: 'Time Field',
            minValue: '1:30 AM',
            maxValue: '9:15 PM'
        }]
}

	var crudTab = Ext.create('Ext.panel.Panel', {
	    	frame: true,
	        activeTab: 0,
	        region:'east',
	        width: 600,
	        collapsible: true,
	        collapsed: true,
	        scroll: true,
	        title:  '상세보기',//makeGridTitle('<span style="color:#003471">조직/제품별</span> 투입현황'),
	        layout: 'card',
	        items: [
	            	card1
	    	        , {
	    	        	title: '수정',
	    	        	html: '수정'
	    	        }, {
	    	        	title: '복사등록',
	    	        	html: '복사등록'
	    	        }
	        ]
	    });

    	var customerPane = Ext.create('Ext.panel.Panel', {
    		frame : false,
    	    border: false,
    		split: true,
    		layout:'border',
    		scroll: true,
    		layoutConfig: {columns: 2, rows: 1},
		    defaults: {
		        split: true,
		        cmargins: '2 0 0 0',
		        margins: '0 0 0 0'
		    },
            items : [gridSalesDeliveryTable, crudTab  ]
        });
    	
    	
    	
    	arr.push(
    			customerPane,
    	        {
    	            html: '<p>주문</p><p>Almost there.  Please click the "Next" button to continue...</p>'
    	        },
    	        {
    	            html: '<h1>출하</h1><p>Step 3 of 3 - Complete</p>'
    	        }		
    	);
    	
    	this.center = Ext.create('Ext.panel.Panel', {
    		id: 'salesDeliveryMain',
    		//title : "출하 달력",
    		// title: '...',
            region: 'center',
            collapsible: false,
            layout:'card',
            frame: false,
            //dockedItems : toolbar,
            items : arr
        });
    	
//    	if(this.center!=null) {
//    		this.center.destroy();
//    		this.center = null;
//    	}
//    	console_logs('menuKey', menuKey);
//    	switch(menuKey) {
//			case 'customer':
//				break;
//			case 'spo':
//				break;
//			case 'delivery':
//				break;
//    		case 'calendar':
//    			console_logs('create', menuKey);
//			{
//    	    	var n =  Ext.create("Ext.calendar.App");
//    	    	this.center = Ext.create('Ext.panel.Panel', {
//    	    		id: 'app-center',
//    	    		//title : "출하 달력",
//    	    		 title: '...',
//    	            region: 'center',
//    	            collapsible: false,
//    	            layout:'border',
//    	            frame: true,
//    	            items : (n["contents"])['items'] 
//    	        });
// 
//			}
//			break;
//    	}
//    	console_logs('this.center', this.center);
        return this.center;
    }
});