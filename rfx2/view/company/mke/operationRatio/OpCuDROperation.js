/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.mke.operationRatio.OpCuDROperation', {
    extend: 'Rfx2.base.BaseView',
       xtype: 'op-cudr-operation',
   initComponent: function() {

       var component = new Ext.Component({
           id: 'OpCuDROperation-component',
           autoEl: {
               tag: 'iframe',
               style: 'height: 100%; width: 100%; border: none',
               src: 'http://211.240.57.17/CuDROperation.asp'
           },
           height: 600,
           width: 600
       });

       //Ext.getCmp('OpHeatTreatment-component').destroy();

       Ext.apply(this, {
           layout: 'border',
           //   items: [this.grid,  this.crudTab]  // 이거 지우고 밑에거 열면 iframe 로 링크 연결
           items: [component, this.crudTab]
       });

       this.callParent(arguments);

   }
   });