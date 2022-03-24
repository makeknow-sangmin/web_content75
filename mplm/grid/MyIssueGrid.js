Ext.define('Mplm.grid.MyIssueGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'myIssueGrid',
    uses: [
        'Ext.data.ArrayStore'
    ],
    //height: 300,
	border: false,

    initComponent: function(params){
    	console_log('MyIssueGrid - initComponent');

    	var myUssueStore = Ext.create('Mplm.store.MyIssueStore', {} );
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: myUssueStore,
            stripeRows: true,
            columnLines: true,
            columns: [{
                text   : '제목',
                width    : 80,
                sortable : true,
                dataIndex: 'rqst_title'
            },{
                text   : '내용',
                 flex: 1,
                sortable : true,
                dataIndex: 'rqst_content'
            },{
                text   : '요청자',
                width    : 50,
                sortable : true,
                dataIndex: 'user_name'
            }]
        });
		myUssueStore.load(function(records){
			if(records.length==0) {
				try {		Ext.getCmp('portlet-issue').collapse();	} catch(e){}
			}
		});
        
        this.callParent(arguments);
    }
});
