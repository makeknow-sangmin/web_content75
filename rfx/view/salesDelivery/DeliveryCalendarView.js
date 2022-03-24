//출하 캘린더
Ext.define('Rfx.view.salesDelivery.DeliveryCalendarView', {
    extend: 'Ext.panel.Panel',
    xtype: 'delivery-calendar-view',
    id: 'salesDeliveryMain',
    items: [],
    initComponent: function(){
    	
    	
    	var n =  Ext.create("Ext.calendar.App");
    	this.items.push( (n["contents"])['items'] );
    	console_logs('DeliveryCalendarView this.items', this.items);

    	this.callParent(arguments);
    }
});