
function clearThisLoading()
{
	if(cenerLoadingPln!=null) {
		cenerLoadingPln.setLoading(false);
	}
}
	
Ext.onReady(function() {
	//Machine 정의
	Ext.define('PcsMchn', {
		extend: 'Ext.data.Model',
		fields: /*(G)*/vCENTER_FIELDS,
		proxy: {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/production/machine.do?method=read',
				create : CONTEXT_PATH + '/production/machine.do?method=create',
				update : CONTEXT_PATH + '/production/machine.do?method=update',
				destroy : CONTEXT_PATH + '/production/machine.do?method=destroy'
			},
			reader : {
				type : 'json',
				root : 'datas',
				 totalProperty: 'count',
				successProperty : 'success'
			},
			writer : {
				type : 'singlepost',
				writeAllFields : false,
				root : 'datas'
			}
		}
	});
	// PcsMchn Store 정의
	store = new Ext.data.Store({
		pageSize : getPageSize(),
		model : 'PcsMchn',
		sorters : [ {
			property : 'unique_id',
			direction : 'DESC'
		} ]
	});

	store.load({
		callback: function (records, options, success) {
        	if (success) {
        		
        		console_log(records);
				var panel = Ext.create('Ext.Panel', {
									        id:'tempport',
									     	height: getCenterPanelHeight(),
									        title: getMenuTitle(),
									        layout:'fit',
									        autoScroll:true,
											split: true,
									        items: [{
				 			        xtype : "component",
						            id: "iframeGantt",
				 	                height:getCenterPanelHeight()-55,
					            	autoEl : {
					 			            tag : "iframe",
					 			            height: 300,
					 			    	    background: "#EAEAEA",
					 			    	    border: 0,
					 			    	    scrolling: 'no',
					 				        frameBorder: 0,
											src: CONTEXT_PATH + '/view/scheduler2225/process/machineProcess.do?method=view'
					 				        ,onLoad: "clearThisLoading()"
					 				     }
				 					}] /*,
					        	      dockedItems: [{
					 			            xtype: 'toolbar',
					 			            items: projectToolBar
									}]*/
								    });    
				//fileupload window close
				try {		Ext.getCmp('multifileDia').destroy();	} catch(e){}
				
				var target = Ext.getCmp('mainview-content-panel');
				target.removeAll();
				
				try {
					viewport.remove('tempport');
				} catch(e){}
				
				target.add(panel);
				target.doLayout();
    		}//endofif
    		else {
    			Ext.MessageBox.alert('설비정보 Loading','Failed');
    		}
	    }//endofcallback
	});//endofstoreload
//	if(cenerLoadingPln!=null) {
//		cenerLoadingPln.setLoading(false);
//	}
});

