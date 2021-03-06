/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.template.Task
 @extends Ext.XTemplate

 Template class used to render {@link Kanban.model.Task a task}.
 */
Ext.define('Kanban.template.Task', {
    extend         : 'Ext.XTemplate',

    model          : null, // the task model

    /**
     * @cfg {String} resourceImgTpl Resource image template.
     */

    /**
     * @cfg {String} taskBodyTpl Internal part of a task template.
     */

    /**
     * @cfg {String} taskToolTpl Extra template for optional task tools.
     */

    /**
     * @cfg {String} menuIconTpl Template for the taskmenu handler.
     */
    menuIconTpl : '<div class="sch-task-menu-handle"></div>',

    constructor : function (config) {
        var me = this;

        Ext.apply(me, config);

        var modelProt  = me.model.prototype;
        var idProperty = modelProt.idProperty;
        var nameField  = modelProt.nameField;

        if (typeof me.taskBodyTpl !== 'string') {
            me.taskBodyTpl =
                '<tpl if="' + modelProt.imageUrlField + '"><img class="sch-task-img" src="{taskImageUrl:htmlEncode}"/></tpl>' +
                '<span class="sch-task-id">{[ values.'+ idProperty +' ? "#" + values.'+ idProperty +' : "" ]}</span><span class="sch-task-name"> {'+ nameField +':htmlEncode}</span>';
        }

        if (typeof me.resourceImgTpl !== 'string') {
            me.resourceImgTpl = '<img src="{resourceImageUrl:htmlEncode}" class="sch-user-avatar {resourceImageCls:htmlEncode}" />';
        }
        
        me.callParent([
            '<tpl for=".">',
                '<div class="sch-task sch-task-state-{' + modelProt.stateField + ':htmlEncode} {' + modelProt.clsField + ':htmlEncode} {cls:htmlEncode}" style="{style}">' +
                '<div class="sch-task-inner">' +
                me.taskBodyTpl +
                me.resourceImgTpl +
                (me.taskToolTpl || '') +
                '</div>' +
                me.menuIconTpl +
                '</div>' +
                '</tpl>'
        ]);
    }
});