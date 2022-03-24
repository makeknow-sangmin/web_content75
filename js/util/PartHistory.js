var poHistoryStore = null;


var fieldPohistory = [];
var columnPohistory = [];
var tooltipPohistory = [];


function popupPohistory(uid_srcahd, item_code/*, fromAssyMap*/) {

	poHistoryStore.proxy.extraParams.coord_key3 = -1;
	poHistoryStore.proxy.extraParams.uid_srcahd = uid_srcahd;
    
    poHistoryStore.load( function(records, operation, success) {
    	
    	if(records.length==0) {
    		Ext.MessageBox.alert('알림', '주문이력이 없습니다.');
    	} else {
    		if(win!=null) {
        		win.close();
        		win = null;
        	}

    	    
    	   myGrid = Ext.create('Ext.grid.Panel', {
    	        region: 'south',
    	        store: poHistoryStore,
    	        height: '100%', 
    	        border: true,
    	        autoScroll : true,
    		    autoHeight: true,
    	        columns: columnPohistory,
    	        collapsible: false,
    	        viewConfig: {
    	            stripeRows: true,
    	            enableTextSelection: false
    	        }
    	    });

        	
        	win = Ext.create('widget.window', {
                title: item_code + ': 주문 P/O 이력',
                width: 800,
                height: 300,
                layout: 'absolute',
                plain:true,
                items: [myGrid],
                buttons: [{
                    text: CMD_OK,
                	handler: function(){
                		if(win) {
                			win.close();
                		}
                		win = null;
                      }
                }]
            });
        	win.show();
    	} //endofelse
    	

    });
}

//Load Pohistory
	    (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    params: {
		    	menuCode: 'PPO1_CLD_SUB'
		    },
		    callback: function(records, operation, success) {
		    	if(success ==true) {
		    		for (var i=0; i<records.length; i++){
		    			//console_log(records[i]);
		    			inRec2Col(records[i], fieldPohistory, columnPohistory, tooltipPohistory);
			        }//endoffor
		    		

		        	
		    		//console.log('fieldPohistory', fieldPohistory);
		    		//console.log('columnPohistory', columnPohistory);
		    		Ext.define('XpoAstHistory', {
		    		   	 extend: 'Ext.data.Model',
		    		   	 fields: /*(G)*/fieldPohistory,
		    		   	    proxy: {
		    						type: 'ajax',
		    				        api: {
		    				            read: CONTEXT_PATH + '/purchase/request.do?method=readPohistory'
		    				        },
		    						reader: {
		    							type: 'json',
		    							root: 'datas',
		    							totalProperty: 'count',
		    							successProperty: 'success',
		    							excelPath: 'excelPath'
		    						},
		    						writer: {
		    				            type: 'singlepost',
		    				            writeAllFields: false,
		    				            root: 'datas'
		    				        } 
		    					}
		    		});
		    		
		    	    poHistoryStore = new Ext.data.Store({  
		    			pageSize: 50,
		    			model: 'XpoAstHistory',
		    			sorters: [{
		    	            property: 'po_date',
		    	            direction: 'DESC'
		    	        }]
		    		});

		    	    

		    	}//endof if(success..
		    },//callback
		    scope: this
		});	
	    
