/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.model.Resource
 @extends Sch.model.Resource

 A data model class describing a resource in your Kanban board that can be assigned to any {@link Kanban.model.Task}.
 */
Ext.define('Kanban.model.Resource', {
    extend : 'Sch.model.Resource',

    customizableFields : [
        { name : 'ImageUrl' }
    ],

    /**
     * @cfg {String} imageUrlField The name of the field that defines the user image url. Defaults to "ImageUrl".
     */
    imageUrlField  : 'ImageUrl'
});