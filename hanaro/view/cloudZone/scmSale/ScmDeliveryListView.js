//이클래스는 시스템에서 자동생성된 클래스 입니다. 수정하지 마세요
//this class is automatically created. DO NOT Edit!!!

Ext.define('Hanaro.view.cloudZone.scmSale.ScmDeliveryListView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'scm-delivery-list-view',
    initComponent: function(){
        this.initSearchField();
        var searchToolbar =  this.createSearchToolbar();
        var buttonToolbar = this.createCommandToolbar();
        var loadUrl = CONTEXT_PATH + '/DynaHanaro/view/cloudZone/scmSale/ScmDeliveryListView.do';
        
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
        
        this.createGrid([buttonToolbar, searchToolbar]);
        
        this.createCrudTab();
        
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        this.callParent(arguments);
            
        gMain.setCenterLoading(false);
        this.store.load(function(records){
        	
        });
    }
});
