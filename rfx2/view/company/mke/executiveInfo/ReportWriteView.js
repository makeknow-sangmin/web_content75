Ext.define('Rfx2.view.company.mke.executiveInfo.ReportWriteView', {
    extend: 'Rfx2.view.executiveInfo.ReportWriteView',
    xtype: 'report-write-view-mke',
    initComponent: function() {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReportWrite', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            gm.pageSize
            ,{}
            ,[]
        );

        this.callOverridden();
    }
});
