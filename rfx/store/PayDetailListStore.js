/**
 * Process Name Store
 */
Ext.define('Rfx.store.PayDetailListStore', {
    extend : 'Ext.data.Store',
    async: false,
    initComponent: function(params) {
        Ext.apply(this, {
        });

    },
    fields : [ /*{
        name : 'specification',  //자재코드(번호)   srcahd
        type : "string"
    }, {
        name : 'alter_item_code',   //설계자재번호 srcahd
        type : "string"
    }, {
        name : 'moldid',    //도장외부스펙1 pjdetail
        type : "string"
    },  {
        name : 'reserved_timestampd',    //납품기준일 project
        type : "string"
    }*/

    ],
    hasNull: false,
    sorters: [{
        property: 'unique_id',
        direction: 'DESC'
    }],
    proxy : {
        type : 'ajax',
        url: CONTEXT_PATH + '/account/attitude.do?method=readPaySystemDetail',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : false
    },
    listeners: {
        load: function(store, records, successful,operation, options) {
            console_logs('store');
            if(this.hasNull) {

                var blank ={
                    systemCode: '',
                    codeName: '[]',
                    codeNameEn: ''
                };

                this.add(blank);
            }

        },
        beforeload: function(){
        }
    }
});