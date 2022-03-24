Ext.define('Mplm.grid.MyProjectGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'myProjectGrid',
    uses: [
        'Ext.data.ArrayStore'
    ],
    //height: 300,
	border: false,

    initComponent: function(params){
    	console_log('MyProjectGrid - initComponent');

    	var myProjectStore = Ext.create('Mplm.store.MyProjectStore', {} );
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: myProjectStore,
            stripeRows: true,
            columnLines: true,
            columns: [{
                text   : '코드',
                width    : 50,
                sortable : true,
                dataIndex: 'pj_code'
            },{
                text   : '프로젝트명',
                 flex: 1,
                sortable : true,
                dataIndex: 'pj_name'
            },{
                text   : '납품예정일',
                width    : 80,
                sortable : true,
                dataIndex: 'delivery_plan'
            }]
        });
		myProjectStore.load(function(o1, o2){
		});
        
        this.callParent(arguments);
    }
});
