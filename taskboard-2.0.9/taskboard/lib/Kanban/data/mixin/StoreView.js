/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Kanban.data.mixin.StoreView', {

    state               : null,
    masterStore         : null,

    bindToStore : function (store) {

        var listeners = {
            add     : this.onMasterAdd,
            clear   : this.onMasterClear,
            remove  : this.onMasterRemove,
            update  : this.onMasterUpdate,
            refresh : this.onMasterDataChanged,
            scope   : this
        };

        if (this.masterStore) {
            this.masterStore.un(listeners);
        }

        this.masterStore = store;

        if (store) {
            store.on(listeners);

            this.copyStoreContent();
        }
    },

    onMasterAdd : function (store, records) {

        for (var i = 0; i < records.length; i++) {
            if (records[i].getState() === this.state) {
                this.add(records[i]);
            }
        }
    },

    onMasterClear : function () {
        this.removeAll();
    },

    onMasterUpdate : function (store, record, operation, modifiedFieldNames) {
        if (modifiedFieldNames && Ext.Array.indexOf(modifiedFieldNames, store.model.prototype.stateField) >= 0) {
            // Insert into the new store
            if (this.state === record.getState()) {
                this.add(record);
            }

            // Remove from old state store
            if (this.state === record.previous[record.stateField]) {
                this.remove(record);
            }
        }
    },

    onMasterRemove : function (store, records) {
        Ext.Array.each(records, function (rec) {
            if (rec.getState() === this.state) {
                this.remove(rec);
            }
        }, this);
    },

    onMasterDataChanged : function (store) {
        this.copyStoreContent();
    },

    copyStoreContent : function () {
        var state = this.state;
        var data  = [];

        this.masterStore.each(function (rec) {
            if (rec.getState() === state) data[data.length] = rec;
        });

        this.suspendEvents();

        this.sort(this.masterStore.getSorters().items);
        // We don't want this to persist
        this.sorters.removeAll();

        this.resumeEvents();

        // Sorting will happen here anyway
        this.loadData(data);
    }
});
