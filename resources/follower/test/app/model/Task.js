Ext.define('DEMO.model.Task', {
    extend: 'Gnt.model.Task',
    fields: [
        {
        	name: "Resizable",
        	type: "boolean"
        },
        {
        	name: "Draggable",
        	type: "boolean"
        },
        {
        	name: "pj_uid"
        },
        {
        	name: "creator"
        },
        {
        	name: "creator_uid"
        }
    ]
});