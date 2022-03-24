/**
 * User Store
 */
Ext.define('Rfx2.store.company.sejun.UsrAstStore', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'unique_id', type: "string"}
        , {name: 'user_id', type: "string"}
        , {name: 'user_name', type: "string"}
        , {name: 'dept_name', type: "string"}
        , {name: 'dept_code', type: "string"}
        , {name: 'email', type: "string"}
        , {name: 'hp_no', type: "string"}
        , {name: 'tel_no', type: "string"}
        , {name: 'limit', type: "int"}
    ],
    initComponent: function(params) {
        Ext.apply(this, {
        	limit: params.hasNull,
            deptCode : params.hasNull,  
            sr_admin_flag : params.hasNull,       
        });
    },
    sorters: [{
        property: 'user_name',
        direction: 'ASC'
    }],
    cmpName: 'userUid',
    hasNull: false,
    limit: 25,
    deptCode : 'NULL',
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/userMgmt/user.do?method=read',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
        , autoLoad: true
    },
    listeners: {

        load: function (store, records, successful, operation, options) {
            if (this.hasNull) {

                var blank = {
                    unique_id: '',
                    user_id: '',
                    user_name: '',
                    dept_name: '',
                    dept_code: '',
                    email: '',
                    hp_no: '',
                    limit: ''
                };

                this.add(blank);
            }//endofif

        },//endofload
        beforeload: function () {
//				console_log('this:');
//				console_log(this.cmpName);
            var obj = Ext.getCmp(this.cmpName);
            if (obj != null) {
                var val = obj.getValue();
                console_log(val);
                if (val != null) {
                    var enValue = Ext.JSON.encode(val);
                    console_log(enValue);
                    this.getProxy().setExtraParam('queryUtf8', enValue);
                } else {
                    this.getProxy().setExtraParam('queryUtf8', '');
                }
            }
            this.proxy.setExtraParam('limit', this.limit);
            this.proxy.setExtraParam('sr_admin_flag', this.sr_admin_flag);
            this.proxy.setExtraParam('dept_code', this.deptCode);
            
        }
    }//endoflistner
});