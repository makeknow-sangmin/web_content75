Ext.define('Rfx.view.grid.ProduceTableGridHeavy', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    collapsible: true,
    initComponent: function() {

    	this.callParent();


    },
    autoScroll: true
//    ,
//      bbar: getPageToolbar(this.store, true, null, function () {
//                    	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                    }),
//	  listeners: {
//	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
//		 }//endof itemdblclick
//
//	  }//endof listeners
});
