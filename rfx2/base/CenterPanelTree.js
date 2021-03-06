Ext.define('Rfx2.base.CenterPanelTree', {
    extend: 'Ext.tab.Panel', // 'Ext.panel.Panel',
    initComponent: function(){
    	this.callParent(arguments);
    },
    region: 'center',
    collapsible: false,
    //layout:'card',
    frame: false,
    addTab: function(className, viewId, link, title, fields, columns, tooltips, relationship, sortBy,
    		fields_map, columns_map, tooltips_map, sortBy_map, linkPath, flag1, flag2, flag3, flag4, flag5) {
		console_logs('CenterPanel, addTab title', title);
    	// console_logs('CenterPanel, addTab link', link);
    	//console_logs('viewId', viewId);
    	var active = null;
    	switch(link) {
	    	case 'calendar':
	        	var n =  Ext.create("Ext.calendar.App");
	        	var arr = (n["contents"])['items'];
	        	//console_logs(arr);
	        	
	        	var params = arr[0];
	        	if(gMain.checkPcHeight()) {
	        		params['title'] = makeGridTitle(title);
	        	}
	        	params['id'] = viewId;
	        	params['itemId'] = viewId;
	        	params['link'] = link;
	        	params['closable'] = false;
	        	params['fields'] = fields;
	        	params['columns'] = columns;
				params['tooltips'] = tooltips;
				params['flag1'] = flag1;
				params['flag2'] = flag2;
				params['flag3'] = flag3;
				params['flag4'] = flag4;
				params['flag5'] = flag5;

	        	active = Ext.create('Ext.panel.Panel',
	        			params
	        			);
	    		break;
			default:
				var myClass = (gu.checkLinkPath(linkPath)==false) ? 'Rfx.view.' + gMain.getGroupClassId() + '.' + className
				: linkPath;

    			var o = {
    				//title: makeGridTitle(title, link, className),
    	            id: viewId,
    	            itemId: viewId,
    	            link: link,
    	            closable: (vExtVersion > 5) ? true: false,
    	            fields: fields,
    	            columns: columns,
    	            tooltips: tooltips,
    	            sortBy: sortBy,
    	            fields_map: fields_map,
    	            columns_map: columns_map,
    	            tooltips_map: tooltips_map,
					sortBy_map: sortBy_map,
					myClass: myClass,
					flag1: flag1,
					flag2: flag2,
					flag3: flag3,
					flag4: flag4,
					flag5: flag5
    			};
    		
				var myClass = (gu.checkLinkPath(linkPath)==false) ? 'Rfx.view.' + gMain.getGroupClassId() + '.' + className
						: linkPath;
			
    			if(gMain.checkPcHeight() && gMain.checkPcWidth()) {
					if(vEDIT_MODE==true) {
						o['title'] = '????????????'
					} else {
						if(vExtVersion > 5) {
							o['title'] = title
						} else {
							o['title'] = makeGridTitle(title, link, myClass);
						}
					}

	        		
	        	}
    			
				// console_logs('myClass', myClass);
				// console_logs('o', o);

				if(vEDIT_MODE==true) {
					o.closable = false;
					o.flex = 100;
					o.height = '100%';
					var activeIn = Ext.create(myClass, o);
					try {
						if(activeIn!=null && relationship!=null) {
							activeIn.setRelationship(relationship);
						}

					} catch(e) {console.log(e);}


					Ext.define('Widget', {
						extend: 'Ext.data.Model',
						fields: [
							{name: 'text',     type: 'string'},
							{name: 'title',     type: 'string'},
							{name: 'class_name', type: 'string'},
							{name: 'value', type: 'string'}
						]
					});

					var widgetStore = Ext.create('Ext.data.TreeStore', {
						model: 'Widget',
						data : {},
						proxy: {
							type: 'ajax',
							//the store will get the content from the .json file
							url: '/web_content75/index/none.json'
						},
						folderSort: true
					});


					// var widgetPropGrid = Ext.create('Ext.grid.PropertyGrid', {
					// 	title: '??????',
					// 	frame: true,
					// 	collapsible: true,
					// 	region: 'south',
					// 	height: '50%',
					// 	source: {
					// 		"(unique_id)": '-1'
					// 	},
					// 	listeners: {
					// 		propertychange: function (source, recordId, value, oldValue) {
					// 			console_logs('Property Changed', Ext.String.format('From: [{0}], To: [{1}]', oldValue.toString(), value.toString()));
					// 		}
					// 	}
					// });

					var widgetTree = Ext.create('Ext.tree.Panel', {
						region: 'center',
						//height: '50%',
						store: widgetStore,
						useArrows: true,
						rootVisible: false,
						multiSelect: false,
						singleExpand: false,
						frame: false,
						border: true,
						fields: ['name', 'link'],
						collapsible: false,
						columns: [{
							xtype: 'treecolumn',
							text: '??????',
							dataIndex: 'text',
							flex: 2,
							sortable: false
						}, {
							text: '??????',
							dataIndex: 'type',
							flex: 1,
							sortable: true
						},{
							text: '???',
							dataIndex: 'value',
							width: 250,
							sortable: true
						}],
						root: {
							name: '??????',
							link: 'Root ??????',
							expanded: true
						}
					});


					var node = widgetStore.getRootNode();

					console_logs('node.appendChild o', o);

					node.appendChild({
						id: o.id,
						text: o.link,
						title: gm.selMainPanelName,
						value: myClass,
						type: 'class',
						expanded: true,
						children: [
							{
								text: "items",
								type: 'array',
								value: "{layout: 'border'}",
								expanded: true,
								children: [
									{
										text: "grid",
										type: 'panel',
										value: 'createGrid()',
										expanded: true,
										children: [
											{
												text: "(DEFAULT)",
												type: 'custom',
												expanded: true,
												children: [


												]
											},
											{
												text: "(SEARCH)",
												type: 'custom',
												expanded: true,
												children: [


												]
											},
											{
												text: "(COMMAND)",
												type: 'custom',
												expanded: true,
												children: [


												]
											}, {
												text: "dockedItems",
												type: 'array',
												expanded: false,
												children: [	]
											}
										]
									},
									 {
										text: "crudTab",
										type: 'panel',
										value: "createCrudTab()",
										leaf: true
									}
								]
							}, {
								text: "(PROPERTY)",
								type: 'custom',
								expanded: true,
								children: [

									{type: 'property', text: 'extend', value:'Rfx.base.BaseView', leaf: true }//,
									// {type: 'property', text: 'xtype', value:'board-view' , leaf: true },

								]
							}, {
								text: "(METHOD)",
								type: 'custom',
								expanded: true,
								children: [
									{type: 'method', text: 'itemdblclick',
									value:
										"function(view, record, htmlItem, index, eventObject, opts) {" +
											"Rfx.model.Board.load(record.get('unique_id'), {" +
											"	success: function(board) {" +
											"		console_logs('board', board);" +
											"		var form = gm.me().createViewForm(board);" +
											"		var win = Ext.create('ModalWindow', {" +
											"			title: gm.me().getMC('CMD_VIEW_DTL','????????????')," +
											"			width: 700," +
											"			height: 530," +
											"			minWidth: 250," +
											"			minHeight: 180," +
											"			layout: 'absolute'," +
											"			plain: true," +
											"			items: form," +
											"			buttons: [{" +
											"				text: CMD_OK," +
											"			handler: function() {" +
											"					if (win) {" +
											"						win.close();" +
											"					}" +
											"				}" +
											"				}]" +
											"		});" +
											"		win.show();" +
											"	}" +
											"});" +
										"}"
									 , leaf: true },
									{type: 'method', text: 'createViewForm',
									value:"function(view, record, htmlItem, index, eventObject, opts) {<br>\t//console_logs('boardview itemdblclick record', record);<br>\tRfx.model.Board.load(record.get('unique_id'), {<br>success: function(board) {<br>console_logs('board', board);<br>var form = gm.me().createViewForm(board);<br>var win = Ext.create('ModalWindow', {<br>title: gm.me().getMC('CMD_VIEW_DTL','????????????'),<br>width: 700,<br>height: 530,<br>minWidth: 250,<br>minHeight: 180,<br>layout: 'absolute',<br>plain: true,<br>items: form,<br>buttons: [{<br>text: CMD_OK,<br>handler: function() {<br>if (win) {<br>win.close();<br>}<br>}<br>}]<br>});<br>win.show();<br>}<br>});<br>}",
									leaf: true },
									{type: 'method', text: 'INIT_PAN1', value:'' , leaf: true },
									{type: 'method', text: 'initComponent1', value:'' , leaf: true }
								]
							}
						]
					});

                    widgetTree.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
                            var rec = selections[0];
                            if(rec!=null) {
                                console_logs('rec', rec);
                                var name = rec.get('text');
                                var type = rec.get('type');
                                var value = rec.get('value');
                                if(value!=null) {
                                    value = value.replace(/<br\s*\/?>/mg,"\n");
                                }

                                if(vEDIT_MODE==true) {
                                    Ext.getCmp(viewId + 'classContect_name').setValue(name);
                                    Ext.getCmp(viewId + 'classContect_type').setValue(type);
                                    Ext.getCmp(viewId + 'classContect_textarea').setValue(value);
                                }
                            }

                        }
                    });
                    var panel = Ext.create('Ext.panel.Panel', {
                        title: '',
                        region: 'center',
                        width: '50%',
                        frame: false,
                        collapsible: false,
                        layout :'border',
                        border: true,
                        defaults: {
                            split: true,
                            bodyPadding: 3,
                        },
                        border : false,
                        layoutConfig: {
                            columns: 1,
                            rows: 2
                        },
                        items: [widgetTree/*, widgetPropGrid*/]
                    });

                    // var buttonToolbar = Ext.create('widget.toolbar', {
                    // 	cls: 'my-x-toolbar-default2',
                    // 	items: {
                    // 		text: '??????'
                    // 	}
                    // });

                    active = new Ext.TabPanel({
                        id: viewId + '-editMode',
                        itemId: viewId + '-editMode',
                        title: title,
                        tabPosition: 'bottom',
                        closable: true,
                        items : [
                            {
                                title: '????????????',
                                xtype: 'panel',
                                layout: 'border',
                                layoutConfig: {columns: 2, rows:1},
                                defaults: {
                                    collapsible: true,
                                    split: true,
                                    cmargins: '5 0 0 0',
                                    margins: '0 0 0 0'
                                },
                                items: [
                                    panel,
                                    {
                                        frame: true,
                                        collapsible: true,
                                        title: '??????',
                                        width: '50%',
                                        region: 'east',
                                        // header: {
                                        // 	itemPosition: 1, // after title before collapse tool
                                        // 	items: [{
                                        // 		ui: 'default-toolbar',
                                        // 		xtype: 'button',
                                        // 		text: '??????',
                                        // 		iconCls: null,
                                        // 		glyph: 'f518@FontAwesome',
                                        // 		handler : function() {
                                        // 			Ext.Ajax.request({
                                        // 				url : CONTEXT_PATH
                                        // 						+ '/custom/veditor.do?method=getFileContent',
                                        // 				params : {
                                        // 					class_name : myClass
                                        // 				},
                                        // 				success : function(result, request) {
                                        // 					console_logs('classContect_textarea inserted', viewId + 'classContect_textarea');
                                        // 					Ext.getCmp(viewId + 'classContect_textarea').setValue(result.responseText);
                                        // 				}
                                        // 			});
                                        // 		}
                                        // 	}]
                                        // },
                                        items: [
                                            {
                                                bodyPadding: 5,
                                                defaults: {
                                                    border: false,

                                                    flex: 1,
                                                    labelWidth: 80,
                                                    labelAlign : 'right',
                                                    layout: 'anchor'
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'start',
                                                },
                                                items: [{
                                                    id: viewId + 'classContect_name',
                                                    fieldLabel: '??????',
                                                    xtype:  'textfield',
                                                },
                                                    {
                                                        id: viewId + 'classContect_type',
                                                        fieldLabel: '??????',
                                                        xtype:  'textfield',
                                                    }]

                                            },
                                            {
                                                id: viewId + 'classContect_textarea',
                                                flex: 1,
                                                width: '100%',
                                                height: '100%',
                                                xtype: 'textarea',
                                                emptyText: '\n\n\t(????????? ???????????????)'//,
                                                // readOnly: true,

                                            }
                                        ]
                                    }
                                ]
                            },

                            activeIn]
                    });

                } else {
                    active = Ext.create(myClass, o);
                    try {
                        if(active!=null && relationship!=null) {
                            active.setRelationship(relationship);
                        }

                    } catch(e) {console.log(e);}
                }
    			

    	}
    	
		this.add(active);
		
		gMain.selPanel = active;
    },
	//define all tabs, and after the ] from the tab panel JSON: 
	  listeners: {
		  'tabchange': function(tabPanel, tab) {
			//    console_logs('tab.id', tab.id);
			//    console_logs('tab', tab);
			//    console_logs('tab title', tab.title);
			//    console_logs('tab link', tab.link);
				var tabId = tab.id;

			    var myItems = gm.mainTabs.items.items;
				var parent = '';
				var child = '';
                var myClass = tab.myClass;
                console_logs('Rfx2.base.CenterPanelTree myClass', myClass);
				for(var i=0; i<myItems.length; i++) {
					var item = myItems[i];
					var itemId = item.id;
					// console_logs('item', item);
					// console_logs('tabId =', tabId);
					// console_logs('itemId =', itemId);
					if(tabId == itemId ) {
						parent = itemId;
						break;
					} else if(tabId.length>itemId.length) {
						if(tabId.substring(0, itemId.length) == itemId) {
							parent = itemId;
							child = tabId.substring(itemId.length+1);
							break;
						}
					}
				}
				// console_logs('parent', parent);
				// console_logs('child', child);


				gm.selMainPanelName = '';
				if(child!='') {
					var groupName = '';
					//Menu Group
					for(var i=0; i<gu.menuStruct.length; i++) {
						var o = gu.menuStruct[i];
						if(o.menu_key == parent) {
							groupName = o.display_name;
						}
					}
					gm.selectedMenuGroup = parent;
					gm.selectedMenuGroupName = groupName;
					gm.selMainPanelName = tab.title + '(' + child + ')';
				}

				gm.refreshToolbarPathCore8(myClass);
				var newTitle =  (gm.selMainPanelName==null || gm.selMainPanelName=='')? gm.selectedMenuGroupName : gm.selMainPanelName;
				document.title = newTitle;

		  }
	  }

});