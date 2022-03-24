
		
Ext.define('Mplm.grid.MyProcessGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'myProcessGrid',
    uses: [
        'Ext.data.ArrayStore'
    ],
    //height: 300,
	border: false,

    initComponent: function(params){
    	console_log('MyProcessGrid - initComponent');
//        var store = new Ext.data.Store({  
//			pageSize: 50,
//			model: 'MyProcess',
//			sorters: [{
//	            property: 'create_date'
//	        }]
//		});
    	var myProcessStore = Ext.create('Mplm.store.MyProcessStore', {} );
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: myProcessStore,
            stripeRows: true,
            columnLines: true,
            columns: [{
                text   : '프로젝트 코드',
                width    : 80,
                sortable : true,
                dataIndex: 'pj_code'
            },{
                text   : '품목코드',
                 width    : 80, 
                sortable : true,
                dataIndex: 'item_code'
            },{
                text   : '품목명',
                flex: 1,
                sortable : true,
                dataIndex: 'item_name'
            }],
            viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
//			                itemdblclick: function( view, rec, node, index, e, options ) {
//			                	doSanctiob(rec);	
//			                }
			            }
			        }
        });
		myProcessStore.load(function(o1, o2){
			console_log('>>>>>>>>>>>>>>>');
			console_log(o1);
			console_log(o2);
			console_log('<<<<<<<<<<<<<<<');
		});
        
        this.callParent(arguments);
    }
});
