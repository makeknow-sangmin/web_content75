Ext.define('Rfx.view.EquipManage', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.PurStock',
    centerId: 'purStockMain',
    initComponent: function(){
    

    	var arr = [Ext.create('Ext.panel.Panel', {
            title: this.title, 
            region: 'center',
            ////hidden: (vExtVersion > 5),
            autoScroll: true,
    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	})];
    	
        Ext.apply(this, {
            layout: 'border',
            items: [
                    this.createPaneMenu(this.title, this.listMenu, this.onSelect), 
                    this.createCenter(this.centerId, arr)
                    ]
        });
        this.callParent(arguments);
        this.drawChart('container' + this.centerId);
    },
    

    onSelect: function(rec) {
    	
    	console_logs('onSelect rec', rec);
    	
    }

});