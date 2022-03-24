Ext.define('Rfx2.view.criterionInfo.CompanyView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'company-view',
    //items: [{html: 'Rfx.view.criterionInfo.CompanyView'}],
    initComponent: function(){
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        
        //console_logs('this.fields', this.fields);
        var loadUrl = CONTEXT_PATH + '/userMgmt/combst.do?method=read';
        console_logs('loadUrl', loadUrl);
        
        
        
        // remove the items
           (buttonToolbar.items).each(function(item,index,length){
         	  if(index==0||index==1||index==3||index==4||index==5) {
               	buttonToolbar.items.remove(item);
         	  }
           });
           
        this.store = new Ext.data.Store({
            pageSize: 100,
            fields: this.fields,
            proxy: {
                type: 'ajax',
                url: loadUrl,
                reader : {
    				type : 'json',
    				root : 'datas',
    				successProperty : 'success'
    			},
                autoLoad: false
            }
            
        });
        
        //grid 생성.
        this.createGrid(buttonToolbar);
        
        this.createCrudTab('company-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        this.callParent(arguments);

        gMain.setCenterLoading(false);
        this.store.load(function(records){
        	if(records!=null && records.length>0) {
        		var rec = records[0];
        		gMain.selPanel.grid.getSelectionModel().select(  rec );
        		//gMain.selPanel.setActiveCrudPanel('EDIT');
        	}
        });
    },
    items : []
});