/**
 * 개인별 그리드 속성 저장
 */
Ext.define('Hanaro.util.HanaroStorgeProvider', {

    extend : 'Ext.state.Provider',
    alias : 'state.hanarostorage',
 
    config: {
       user_uid : vCUR_USER_UID,
       url : CONTEXT_PATH +  + '/dispField.do',
       timeout: 30000
    },
 
    constructor : function(config) {
        this.initConfig(config);
        var me = this;
        // console_logs('constructor me.getUser_uid()', me.getUser_uid());
        // console_logs('constructor me.getUrl()', me.getUrl());
        me.restoreState();
        me.callParent(arguments);
    },
    get: function(name, defaultValue) { 

        // console_logs('=====> set name', name);
        // console_logs('=====> set defaultValue', defaultValue);

        // var me = this;

        // // console_logs('me.getUser_uid()', me.getUser_uid());
        // // console_logs('me.getUrl()', me.getUrl());

        // Ext.Ajax.request({
        //     url : me.getUrl(),
        //     params:{
        //         method : 'restoreState',
        //         user_uid: me.getUser_uid(),
        //         name: name
        //     },
        //     success : function(result, request) {

        //         var jsonData = Ext.util.JSON.decode(result.responseText);

        //         console_logs('name', name);
        //         console_logs('jsonData', jsonData);
        //         // var o = {columns:[{id:"h7"},{id:"system_code", width: 500},{id:"code_name_kr"},
        //         // {id:"role_code"},{id:"creator"},{id:"create_date"},{id:"unique_id"}],"weight":0};
        //         // console_logs('=======> results o', o);

        //         // //for(var i in o) {
        //         //     me.state[name] = o;
        //         // //}
        //     },
        //     failure : function() {
        //         console.log('failed', arguments);
        //     },
        //     scope : this
        // });


        // var pos, row; 

        // if ((pos = this.store.find('name', name)) > -1) { 

        //     row = this.store.getAt(pos); 
        //     return this.decodeValue(row.get('value')); 

        // } else { 

       //    return defaultValue; 

        // } 

    }, 
    set : function(name, value) {
        // console_logs('set name', name);
        // console_logs('set value', value);
        var me = this;
 
        if( typeof value == "undefined" || value === null) {
            me.clear(name);
            return;
        }
        me.persist(name, value);
        me.callParent(arguments);
    },
    // // private
    restoreState : function() {
        // var me = this;

        // var o = {columns:[{id:"h7"},{id:"system_code", width: 500},{id:"code_name_kr"},
        // {id:"role_code"},{id:"creator"},{id:"create_date"},{id:"unique_id"}],"weight":0};
        // console_logs('=======> results o', o);

        // console_logs('m', me);
        // console_logs('m.state', me.state);
        // me.state['criterion-info:AMC7'] = o;
    },
    // private
    clear : function(name) {
        this.clearKey(name);
        this.callParent(arguments);
    },
    // private
    persist : function(name, value) {
        var me = this;
        console_logs(name, value);

        var columns = value.columns;
        var weight = value.weight;
        var sorts = [];
        var hiddens = [];
        var widths = [];
        for(var i=0;i<columns.length; i++) {
            var o = columns[i];
            sorts.push(o.id);
            var hidden = o.hidden;
            if(hidden!=null) {
                hiddens.push(o.id + ':' + hidden);
            }
            var width = o.width;
            if(width!=null) {
                widths.push(o.id + ':' + width);
            }
        }

        var enValue = Ext.JSON.encode(value);
        //enValue = enValue.split('"').join('\"');
        console_logs('enValue', enValue);
        Ext.Ajax.request({
            url : me.getUrl(),
            params : {
                user_uid: me.getUser_uid(),
                method : 'saveState',
                name : name,
                sorts : sorts,
                hiddens : hiddens,
                widths : widths,
                weight : weight
            },
            disableCaching : true,
            success : function() {
                // console.log('success');
            },
            failure : function() {
                console.log('failed', arguments);
            }
        });
    },
    // private
    clearKey : function(name) {
        var me = this;
        Ext.Ajax.request({
            url : me.getUrl(),
            params : {
                user_uid: me.getUser_uid(),
                method : 'clearState',
                name : name
            },
            disableCaching : true,
            success : function() {
                console.log('success');
            },
            failure : function() {
                console.log('failed', arguments);
            }
        });
    }
});