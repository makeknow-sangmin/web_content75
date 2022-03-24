Ext.define('Rfx2.view.company.mke.executiveInfo.ReportWriteViewSB', {
    extend: 'Rfx2.view.executiveInfo.ReportWriteView',
    xtype: 'report-write-view-mke-sb',
    initComponent: function() {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReportWriteSB', [{
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
