Ext.define('Rfx.view.Lab', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.Lab',
    centerId: 'labMain',
    initComponent: function(){
 
    	
    	var arr = [Ext.create('Ext.panel.Panel', {
            title: this.title, 
    		region: 'center',
    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	})];
    	
        Ext.apply(this, {
            layout: 'border',
            ////hidden: (vExtVersion > 5),
            items: [
                    this.createPaneMenu(this.title, this.listMenu, this.onSelect), 
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