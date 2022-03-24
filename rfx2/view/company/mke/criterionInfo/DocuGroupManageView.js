/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.mke.criterionInfo.DocuGroupManageView', {
    extend: 'Rfx2.view.criterionInfo.DocuGroupManageView',
    xtype: 'docuGroup-manage-view-mke',
    initComponent: function(){
        this.callOverridden();
        
    },
});
