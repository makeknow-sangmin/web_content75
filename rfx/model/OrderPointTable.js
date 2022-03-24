Ext.define('Rfx.model.OrderPointTable', {
    extend: 'Rfx.model.Base',
    fields: [ 
             'id',
             'creator',
             'item_code',
             'item_name',
             'specification',
             'quan',
             'unit_code',
             'supplier_name',
             'req_date',
             'static_sales_price',
             'start_date',
             'assy_final_date',
             'man_lead_time',
             'ord_handling_time',
             'pur_lead_time'
    ]
});