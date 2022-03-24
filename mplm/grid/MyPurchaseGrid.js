
		
Ext.define('Mplm.grid.MyPurchaseGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'myPurchaseGrid',
    uses: [
        'Ext.data.ArrayStore'
    ],
    //height: 300,
	border: false,

    initComponent: function(params){
    	console_log('MyPurchaseGrid - initComponent');

    	var myPurchaseStore = Ext.create('Mplm.store.MyPurchaseStore', {trayType: 'PENDING'} );
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: myPurchaseStore,
            stripeRows: true,
            columnLines: true,
            columns: [{
                text   : '제목',
                width    : 80,
                sortable : true,
                dataIndex: 'name'
            },{
                text   : '내용',
                flex: 1,
                sortable : true,
                dataIndex: 'content'
            },{
                text   : '요청자',
                width    : 50,
                sortable : true,
                dataIndex: 'user_name'
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
		myPurchaseStore.load(function(records){
			if(records.length==0) {
				try {		Ext.getCmp('portlet-purchase').collapse();	} catch(e){}
			}
		});
        
        this.callParent(arguments);
    }
});
