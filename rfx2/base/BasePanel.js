Ext.define('Rfx2.base.BasePanel', {
    extend: 'Ext.panel.Panel',
	frame   : false,
    border: false,
	split: true,
	bodyPadding: '1 0 0 0',
	groupId: '',
	createToolbar: function(groupId){
		console_logs('Rfx2.base.BasePanel groupId', groupId);
		this.groupId = groupId;
		var items = [],
            config = {};
        if (!this.inTab) {
	        items.push({
	        	id : gu.getToolbarId(groupId), //'toolbarPath-' + groupId,
	        	xtype: 'label',
	        	width: 600,
	        	style: 'color:white;',
	        	html:''
	        });
			items.push('->');

			if(vSYSTEM_TYPE == 'HANARO') {
				items.push({
					xtype: 'component',
					html: '<span style="font-size:9px; color:white;">' + vCompanySlogan + '</span>'
				});
			}

			var systemName = (vSYSTEM_TYPE == 'HANARO') ? '하나로MES' : 'RFxMES';
			var version = (vSYSTEM_TYPE == 'HANARO') ? 'v' + vMajor + '.' +vMinor   : 'v85';
			var color = (vSYSTEM_TYPE == 'HANARO') ? '#AAA' : '#5C98CD';
	        switch(vCompanyReserved4) {
				case 'SKNH01KR':
					break;
				default:
                    items.push({
                        xtype : 'component',
                        html: '<span style="font-size:9px; font-weight:normal;color:' + color + ';"><i>' + systemName + '</i> on '+ version + '</span>'
                    });
			}

			items.push('-');

			if(vSYSTEM_TYPE != 'HANARO') {
				items.push({
					xtype : 'checkbox',
					id : 'chkAuto-' + groupId,
					boxLabel : '<font color=white>화면유지</font>',
					cls: 'white-font', //style : 'color: #fafafa !important',
					tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
					checked: gMain.getSaveAutoRefresh(),
					listeners: {
							change: function(field, newValue, oldValue, eOpts){
								console_logs('field', field);
								console_logs('oldValue', oldValue);
								console_logs('newValue', newValue);
								console_logs('eOpts', eOpts);

								gMain.checkRefresh(newValue);
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
				xtype : 'checkbox',
				id : 'chkOpenCrud-' + groupId,
				boxLabel : '<font color=white>자동 창열기</font>',
				style : 'color: #fafafa',
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


	layoutConfig: {columns: 1, rows:1},
			    defaults: {
			        collapsible: false,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
	bodyPadding: 10,
    initComponent: function(){

        this.dockedItems = [this.createToolbar(this.id)];
        this.callParent(arguments);

    },
    createPaneMenu: function(paneName, listMenu, onSelect) {
		Ext.define('MenuModel', {
			extend: 'Ext.data.Model',
			fields: [
			{name: 'name'},
			{name: 'link'}
			]
		});

		this.store = Ext.create('Ext.data.Store', {
			model: 'MenuModel',
			data: listMenu
		});

		if(vExtVersion > 5) {

			this.west = this.getMenuTreePanel(paneName, listMenu);
			//this.south= this.createSouth();
				//gu.getMenuTreePanel();

		} else {

			this.west =   Ext.create('Ext.Panel', {
				id: this.id + '-menulist',
				frame: true,
				collapsible: true,
				region: 'west',
				width: 160,
				title: paneName,
				items: Ext.create('Ext.view.View', {
					store: this.store,
					tpl: '<tpl for="."><div class="feed-list-item">{name}</div></tpl>', //<span style="font-size:9px;color:#C1493B;font-weight:normal;">({link})</span>
					multiSelect: false,
					//height: 310,
					trackOver: true,
					itemSelector: '.feed-list-item',
					overItemCls: 'feed-list-item-hover',
					emptyText: 'No images to display',
					prepareData: function(data) {
						Ext.apply(data, {
							shortName: Ext.util.Format.ellipsis(data.name, 15),
							sizeString: Ext.util.Format.fileSize(data.size),
							dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
						});
						return data;
					},
					listeners: {
						selectionchange: function(dv, nodes ){
							//console_logs('nodes', nodes);
							if(nodes.length>0) {
								var rec = nodes[0];
								gMain.hashTo('#' + gMain.selectedMenuGroup + ':' + rec.get('link'));
								onSelect(rec);
							}//endof if
						}//endof selchange
					}
				})
			});
		}
        return this.west;
    },
    createCenter: function(centerId, arr){
		console_logs('createCenter centerId', centerId);
		console_logs('createCenter arr', arr);
    	this.center = Ext.create(
			(vExtVersion > 5) ? 'Rfx.base.CenterPanelTree' : 'Rfx.base.CenterPanel',  {
    		id: centerId,
            items : arr
        });

    	gMain.selMainPanelCenter = this.center;
        return this.center;
	},
	drawChart: function(target) {
		console_logs('drawChart', target);
		// Highcharts.chart(target, {
		// 	chart: {
		// 		type: 'line'
		// 	},
		// 	title: {
		// 		text: '목표대비 생산'
		// 	},
		// 	data: {
		// 		csvURL: 'https://demo-live-data.highcharts.com/time-data.csv',
		// 		enablePolling: true,
		// 		dataRefreshRate: 2
		// 	}
		// });

	},
	getTopHtml: function(id) {
		//alert('Rfx2.base.BasePanel: '+vExtVersion);
		console_logs('this.groupId', this.groupId);
		console_logs('getTopHtml id', this.id);
		var ret ='<table width="100%"><tr><th>classId</th><th>className</th><th>id</th><th>link</th><th>linkPath</th><th>name</th></tr>';

		for(var i=0; i<this.listMenu.length; i++) {
			var o = this.listMenu[i];
			ret = ret + '<tr><td>';
			ret = ret + o.classId + '</td><td>';
			ret = ret + o.className + '</td><td>';
			ret = ret + o.id + '</td><td>';
			ret = ret + o.link + '</td><td>';
			ret = ret + o.linkPath + '</td><td>';
			ret = ret + o.name + '</td></tr>';
		}

		ret =ret + '</table>';
		return ret;
	},
	createSouth: function() {
		console.log('createSouth', true);
		this.south = Ext.create('Ext.Panel', {
			id: this.id + '-southPain',
			frame: true,
			collapsible: false,
			region: 'south',
			height: 80,
			html: 'hello'
		});
		return this.south;
	}


});
