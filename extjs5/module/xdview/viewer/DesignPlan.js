
Ext.define('FeedViewer.DesignPlan', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.designPlan',
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
    //				id : 'chkAutorefresh6',
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
	            //html: '<div class="inputBT"><button type="button" onClick="openNewWindow();"><span class="search">새창으로 보기</span></button></div>'
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
        this.dockedItems = [this.createToolbar()];
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });
       // this.relayEvents(this.display, ['opentab']);
       // this.relayEvents(this.east, ['rowdblclick']);
        this.callParent(arguments);
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
    	
    	Ext.define('ImageModel', {
    	    extend: 'Ext.data.Model',
    	    fields: [
    	       {name: 'name'},
    	       {name: 'link'}
    	    ]
    	});
    	
        var dataView =   Ext.create('Ext.Panel', {
            //id: 'images-view',
            frame: true,
            collapsible: true,
            region: 'west',
            width: 200,
            title: '설계.디자인',
            items: Ext.create('Ext.view.View', {
            store: Ext.create('Ext.data.Store', {
	                model: 'ImageModel',
	                data: [
	                    { id: 1, name: '디자인 파일', link: 'design_file' },
	                    { id: 2, name: '설계 BOM',  link: 'bom' }
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
                prepareData: function(data) {
                    Ext.apply(data, {
                        shortName: Ext.util.Format.ellipsis(data.name, 15),
                        sizeString: Ext.util.Format.fileSize(data.size),
                        dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                    });
                    return data;
                },
                listeners: {
//                    selectionchange: function(dv, nodes ){
//                        var l = nodes.length,
//                            s = l !== 1 ? 's' : '';
//                        this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
//                    }
                }
            })
        });
        
        //this.east =  gridDesignPlanTable2;
        this.west = dataView;
        //redrawDesignPlanTable1();
        
//        Ext.create('widget.gridDesignPlan2', {
//           layout:'border',
//            region: 'west',
//            minWidth: 400,
//			collapsible: false,
//			width: '40%',
//            layout: 'fit'
//        });
        
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

    	var arr = [];
    	
    	var cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});
    	
    	var designTree =
        	Ext.create('Ext.tree.Panel', {
 		       rootVisible: false,
		       store: cloudProjectTreeStore,
                lines: false
             });
    	arr.push(designTree);
    	arr.push(
			{
	            html: '<h2>customer</h2><p>Step 1 of 3</p><p>Please click the "Next" button to continue...</p>'
	        },
	        {
	            html: '<p>주문</p><p>Almost there.  Please click the "Next" button to continue...</p>'
	        },
	        {
	            html: '<h1>출하</h1><p>Step 3 of 3 - Complete</p>'
	        }		
    	);
    	
    	this.center = Ext.create('Ext.panel.Panel', {
    		id: 'designPlanMain',
    		//title : "출하 달력",
    		 title: '디자인 파일',
            region: 'center',
            collapsible: false,
            layout:'card',
            frame: true,
            items : arr
        });
    	
    	cloudProjectTreeStore.getProxy().setExtraParam('pjuid', '79280000179');
    	cloudProjectTreeStore.getProxy().setExtraParam('callType', 'TOP');
    	cloudProjectTreeStore.load( {
    				
    		callback: function(records, operation, success) {
    			designTree.getRootNode().expand(true);
    		}
    	});
    	
        return this.center;
    }
});