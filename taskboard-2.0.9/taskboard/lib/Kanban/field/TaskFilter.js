/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.field.TaskFilter
 @extends Ext.form.field.Text

 A text field that allows you to filter for tasks by Name in the TaskBoard view. You can filter for another field by setting the {@link #field} config.
 */
Ext.define('Kanban.field.TaskFilter', {
    extend          : 'Ext.form.TextField',
    alias           : 'widget.filterfield',
    requires        : ['Ext.util.Filter'],
    enableKeyEvents : true,
    height          : 26,
    minLength       : 2,

    /**
     * @cfg {Kanban.data.TaskStore/String} store (required) The store containing the tasks or a store identifier (storeId) identifying a store
     */
    store           : null,

    /**
     * @cfg {String} field The {@link Kanban.model.Task} field that should be used for filtering.
     */

    /**
     * @cfg {Boolean} caseSensitive True to use case sensitive filtering
     */
    caseSensitive   : false,

    initComponent : function () {
        this.on('change', this.onMyChange, this);

        this.store = Ext.data.StoreManager.lookup(this.store);

        this.field = this.field || this.store.getModel().prototype.nameField;

        this.filter = new Ext.util.Filter({
            id            : this.getId() + '-filter',
            property      : this.field,
            value         : '',
            caseSensitive : this.caseSensitive,
            anyMatch      : true
        });

        this.callParent(arguments);
    },

    onMyChange : function () {
        var val = this.getValue();

        if (val && val.length >= this.minLength) {
            this.filter.setValue(val);
            this.store.addFilter(this.filter);
        } else {
            this.store.removeFilter(this.filter);
        }
    }
});
