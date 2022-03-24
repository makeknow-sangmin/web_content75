Ext.define('Rfx2.base.BaseGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.filters.Filters',
        'Ext.grid.column.Action',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager'
    ],
    cls: 'rfx-panel',
    border: true,
    resizable: true,
    scroll: true,
    multiSelect: true,
    region: 'center',
    collapsible: false,
    listeners: {
        resize: function () {
            var properties = this.getState();
        },
        itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
            gm.me().itemdblclick(view, record, htmlItem, index, eventObject, opts);
        },//endof itemdblclick
        edit: function (editor, e, eOpts) {
            this.editBaseGrid(editor, e, eOpts);
        },
        cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
            if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                var tempTextArea = document.createElement("textarea");
                document.body.appendChild(tempTextArea);
                tempTextArea.value = eOpts.target.innerText;
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
            }
        }
    },
    editBaseGrid: function (editor, e, eOpts) {

        console_logs('====> editor', editor);
        console_logs('====> e', e);
        console_logs('====> eOpts', eOpts);
        console_logs('gMain.selectedMenuId', gMain.selectedMenuId);
        var r = e.record;
        var column = e.column;

        if (r.dirty == true) {
            console_logs('listeners r.dirty field', e.field);
            console_logs('listeners r.dirty record', r);
            console_logs('listeners r.dirty column', column);

            var columnType = column['dataType'] == null ? 'sting' : column['dataType']; //gm.getColumnType(e.field);
            console_logs('listeners r.dirty columnType', columnType);

            gm.me().editRedord(e.field, r, columnType);
        }
    }
});
