Ext.define('Rfx.base.CenterPanel', {
    extend: 'Ext.panel.Panel',
    initComponent: function(){
    	this.callParent(arguments);
    },
    region: 'center',
    collapsible: false,
    layout:'card',
    frame: false,
    addTab: function(className, viewId, link, title, fields, columns, tooltips, relationship, sortBy,
    		fields_map, columns_map, tooltips_map, sortBy_map, linkPath, flag1, flag2, flag3, flag4, flag5) {
		// console_logs('CenterPanel, addTab title', title);
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
    			var o = {
    				title: makeGridTitle(title, link, className),
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
					flag1: flag1,
					flag2: flag2,
					flag3: flag3,
					flag4: flag4,
					flag5: flag5
    			};
    		
				var myClass = (gu.checkLinkPath(linkPath)==false) ? 'Rfx.view.' + gMain.getGroupClassId() + '.' + className
						: linkPath;
				//console_logs('myClass', myClass);
				console_logs('link', link);
				if(vExtVersion > 5) {
					o['title'] = title + '(' + link + ')';
				} else {
    				if(gMain.checkPcHeight() && gMain.checkPcWidth()) {
						o['title'] = makeGridTitle(title, link, myClass);
					}
	        		
	        	}
    			
    			
    			active = Ext.create(myClass, o);
    			active.setRelationship(relationship);

    	}
    	
		this.add(active);
		
		gMain.selPanel = active;
    }

});