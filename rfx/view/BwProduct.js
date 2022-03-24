Ext.define('Rfx.view.BwProduct', {
    extend: 'Rfx.base.BasePanel',
    alias: 'widget.BwProduct',
    centerId: 'BwProductInfoMain',
    initComponent: function(){
 
    	
    	var arr = [Ext.create('Ext.panel.Panel', {
            title: this.title, 
            region: 'center',
            ////hidden: (vExtVersion > 5),
    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	})];

        Ext.apply(this, {
            layout: 'border',
            ////hidden: (vExtVersion > 5),
            items: [
                    //this.createPaneMenu(this.title, this.listMenu, this.onSelect),
                    this.createCenter(this.centerId, arr)
                    ]
        });
        this.callParent(arguments);
        this.drawChart('container' + this.centerId);
    },

    onSelect: function(rec) {
    	
    	//console_logs('onSelect rec', rec);
    	
    }
});