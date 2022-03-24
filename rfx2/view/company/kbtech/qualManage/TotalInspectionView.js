Ext.define('Rfx2.view.company.kbtech.qualManage.TotalInspectionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'total-inspection-view',
    initComponent: function() {

        var component = new Ext.Component({
            id: 'TotalInspection-component',
            autoEl: {
                style: 'overflow:scroll; border: none; margin-left: auto; margin-right: auto;',
                html: '<div style ="text-align: center;"><img src="http://59.16.225.8:17080/images/kbtech/05.jpg" width="100%"/></div>'
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
