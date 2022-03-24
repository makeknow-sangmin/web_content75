Ext.define('Rfx2.view.common.LotTraceView', {
    extend: 'Ext.panel.Panel',
    initComponent: function(){
        // var propGrid1 = Ext.create('Ext.grid.property.Grid', {
        //     border: true,
        //     width: '50%',
        //     enableColLock:true,
        //     enableColumnMove: false,
        //     autoExpandColumn:true,
        //     loadMask: true,
        //     stripeRows: true,
        //     autoScroll:false,
        //     clicksToEdit: 0/*,
        //     sourceConfig:{
        //         sortable: false
                                
        //     }*/
        // });    

        // propGrid1.getStore().sorters.items = [];
        // propGrid1.setSource({
        //     '(1)': '제품',
        //     '등록일자':   '' ,
        //     '모델번호': '',
        //     '모델명': '',
        //     'MES-srcahd': '',
        //     '(2)': '수주',
        //     '수주일자':   '' ,
        //     '고객사': '',
        //     '수주번호': '',
        //     'MES-pj_uid': '',
        //     '(3)': '구매',
        //     '수주일자':   '' ,
        //     '고객사': '',
        //     '수주번호': '',
        //     'MES-pj_uid': '',
            
        // }); // Now load data

        // var propGrid2 = Ext.create('Ext.grid.property.Grid', {
        //     border: true,
        //     width: '50%',
        //     enableColLock:true,
        //     enableColumnMove: false,
        //     autoExpandColumn:true,
        //     loadMask: true,
        //     stripeRows: true,
        //     autoScroll:false,
        //     clicksToEdit: 0/*,
        //     sourceConfig:{
        //         sortable: false
                                
        //     }*/
        // });    

        // propGrid2.getStore().sorters.items = [];
        // propGrid2.setSource({
        //     '(4)': '생산',
        //     'LINE번호':   '' ,
        //     '생산일자':   '' ,
        //     '생산로트': '',
        //     '생산 담당자': '',
        //     '검사 담당자': '',
        //     'MES-pcsstep': '',
        //     '(5)': '출하',
        //     '출하일자':   '' ,
        //     '출하 담당자': '',
        //     'PALLET 번호': '',
        //     'MES-pj_uid': '',
        // }); // Now load data

        // var me = this;
        // // Ext.apply(me, {
        // //     items: [propGrid1, propGrid2]
        // // });
        
    },
    // bodyPadding: 10,
    // defaults: {
    //     anchor: '100%',
    //     allowBlank: false,
    //     msgTarget: 'side',
    //     labelWidth: 80
    // },
    // layout: {
    //     type: 'hbox',
    //     align: 'stretch'  // Child items are stretched to full width
    // },
    // dockedItems: [{
    //     xtype: 'toolbar',
    //     dock: 'top',
    //     layout: {
    //         type: 'hbox',
    //         align: 'stretch'  // Child items are stretched to full width
    //     },
    //     items: [{
    //         labelWidth: 80,
    //         xtype: 'triggerfield',
    //         fieldLabel: 'UDI 바코드',
    //         empty: 'UDI barcode',
    //         id: 'UID_srchUnique_id',
    //         name: 'UID_srchUnique_id'
    //         ,
    //         listeners : {
    //                 specialkey : function(field, e) {
    //                 if (e.getKey() == Ext.EventObject.ENTER) {
    //                     console_logs('field', field);
    //                 }
    //             }
    //         },
    //         trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //         trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    //         'onTrigger1Click': function() {
    //             Ext.getCmp('UID_srchUnique_id').setValue('');
    //         },
    //         'onTrigger2Click': function() {
    //             var udiBarcode = Ext.getCmp('UID_srchUnique_id').getValue();

    //             doSearchBarcode(udiBarcode, 'UDI');
    //         }
    //     },{
    //         labelWidth: 80,
    //             xtype: 'triggerfield',
    //             fieldLabel: 'MES 바코드',
    //             empty: 'MES barcode',
    //             id: 'GEN_srchUnique_id'
    //             ,
    //             listeners : {
    //                         specialkey : function(field, e) {
    //                         if (e.getKey() == Ext.EventObject.ENTER) {
    //                             console_logs('field', field);
    //                         }
    //                     }
    //                 },
    //                 trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //                 trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    //                 'onTrigger1Click': function() {
    //                     Ext.getCmp('GEN_srchUnique_id').setValue('');
    //                 },
    //                 'onTrigger2Click': function() {
    //                     var genBarcode = Ext.getCmp('GEN_srchUnique_id').getValue();
    //                     doSearchBarcode(genBarcode, 'GEN');
    //                 }
    //         }]
        
        
    // }]

});