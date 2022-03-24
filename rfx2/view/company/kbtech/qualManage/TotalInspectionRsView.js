Ext.define('Rfx2.view.company.kbtech.qualManage.TotalInspectionRsView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'total-inspection-rs-view',
    initComponent: function() {

        var component = new Ext.Component({
            id: 'TotalInspectionRs-component',
            autoEl: {
                style: 'overflow:scroll; border: none; margin-left: auto; margin-right: auto;',
                html: '<div style ="text-align: center;"><img src="http://59.16.225.8:17080/images/kbtech/06.jpg" width="100%"/></div>'
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
