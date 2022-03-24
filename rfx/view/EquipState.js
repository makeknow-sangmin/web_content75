//설비현황
Ext.define('Rfx.view.EquipState', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.equipState',
    centerId: 'equipStateMain',
    initComponent: function(){
    	

//    	var listMenu = [
//	                    		{id: 1, name: '설비현황', link: 'EMC1',	classId: 'machine-view', 	className: 'MachineView' },
//	                    		{id: 2, name: '수리현황', link: 'EMC5', 	classId: 'repair-view', 		className: 'RepairView'}
//    	            ];
//    	
    	var arr = [Ext.create('Ext.panel.Panel', {
            title: this.title, 
            region: 'center',
            ////hidden: (vExtVersion > 5),
    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	})];
    	
        Ext.apply(this, {
            layout: 'border',
            items: [
                    this.createPaneMenu(this.title, this.listMenu, this.onSelect), 
                    this.createCenter(this.centerId, arr)
                    ]
        });
//        
//        Ext.apply(this, {
//            layout: 'border',
//            items: [this.createPaneMenu('설비현황', listMenu, this.onSelect), this.createCenter()]
//        });
        this.callParent(arguments);
        this.drawChart('container' + this.centerId);
    },

    onSelect: function(rec) {
    	
    	console_logs('onSelect rec', rec);
    	
    }

});