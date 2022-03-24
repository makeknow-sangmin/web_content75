Ext.define('Rfx.view.CriterionInfo', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.criterionInfo',
    centerId: 'criterionInfoMain',
    initComponent: function(){
    	
    	var arr = [Ext.create('Ext.panel.Panel', {
            title: this.title, 
            region: 'center',
            ////hidden: (vExtVersion > 5),
    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	})];
        
        var center = this.createCenter(this.centerId, arr);
        var wrapper  = Ext.create('Ext.panel.Panel', {
            title: makeGridTitle(this.title),
            id: 'criterionInfoMain' + 'wrapper',
			border: true,
			resizable: true,
			scroll: true,
			minWidth: 200,
			height: "100%",
			region: 'center',
			collapsible: false,
			layout: 'fit',
			forceFit: true,
			items: [
				center
			]
        });
        
        var menutitle = /*(vExtVersion > 5) ? '메뉴' :*/ this.title;

        Ext.apply(this, {
            layout: 'border',
            items: [
                    this.createPaneMenu(menutitle, this.listMenu, this.onSelect), 
                    (vExtVersion > 5) ? wrapper : center
                    ]
        });
        this.callParent(arguments);
        this.drawChart('container' + this.centerId);
    },
    

    onSelect: function(rec) {
    	
        console_logs('onSelect rec', rec);
        var display_name = rec.get('display_name');
        Ext.getCmp('criterionInfoMain' + 'wrapper').setTitle(makeGridTitle(display_name));

    	
    }

});