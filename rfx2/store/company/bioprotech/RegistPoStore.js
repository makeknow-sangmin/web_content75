Ext.define('Rfx2.store.company.bioprotech.RegistPoStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull
        });

    },
    fields : [],
    sorters: [
    // {
    //     property: 'lv',
    //     direction: 'ASC'
    // },
    // {
    //     property: 'reserved_integer3',
    //     direction: 'ASC'
    // }
],
    hasNull: false,
    srchNull : true,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/production/schdule.do?method=readAssyTopVer&not_restart=Y&sortCond=p.pj_code DESC',
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

            if(this.hasNull) {

                var blank ={
                    systemCode: '',
                    codeName: '',
                    codeNameEn: ''
                };

                this.add(blank);
            }

        },
        beforeload: function(){

        }
    }
});