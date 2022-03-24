var cartHistoryStore = null;

var fieldCarthistory = [];
var columnCarthistory = [];
var tooltipCarthistory = [];


function popupCarthistoryPlno(unique_uid, pl_no) {

	cartHistoryStore.proxy.extraParams.coord_key3 =unique_uid;
    
    cartHistoryStore.load( function(records, operation, success) {
    	
    	if(records.length==0) {
    		Ext.MessageBox.alert('알림', '현재 BOM내의 이 부품은 요청이력이 없습니다.');
    	} else {

        	if(win!=null) {
        		win.close();
        		win = null;
        	}

    	    
    	   myGrid = Ext.create('Ext.grid.Panel', {
    	        region: 'south',
    	        store: cartHistoryStore,
    	        height: '100%', 
    	        border: true,
    	        autoScroll : true,
    		    autoHeight: true,
    	        columns: columnCarthistory,
    	        collapsible: false,
    	        viewConfig: {
    	            stripeRows: true,
    	            enableTextSelection: false
    	        }
    	    });

        	
        	
        	win = Ext.create('widget.window', {
                title: pl_no + ': 구매요청/반출요청 이력',
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

        	
    	}// endofelse
    	

    });
}

(new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
    params: {
    	menuCode: 'DBM7_CART'
    },
    callback: function(records, operation, success) {
    	if(success ==true) {
    		for (var i=0; i<records.length; i++){
    			//console_log(records[i]);
    			inRec2Col(records[i], fieldCarthistory, columnCarthistory, tooltipCarthistory);
	        }//endoffor
    		

    		Ext.define('CartHistory', {
    		   	 extend: 'Ext.data.Model',
    		   	 fields: /*(G)*/fieldCarthistory,
    		   	    proxy: {
    						type: 'ajax',
    				        api: {
    				            read: CONTEXT_PATH + '/purchase/request.do?method=cartHistory'
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
    		
    	    cartHistoryStore = new Ext.data.Store({  
    			pageSize: 50,
    			model: 'CartHistory',
    			sorters: [{
    	            property: 'unique_uid',
    	            direction: 'DESC'
    	        }]
    		});

    	    

    	}//endof if(success..
    },//callback
    scope: this
});	