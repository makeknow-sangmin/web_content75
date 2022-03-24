Ext.define('Rfx2.view.company.sejun.equipState.MachineChartView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-chart-view',
    initComponent: function() {

        // var component = new Ext.Component({
        //     id: 'ProcessInspectionRs-component',
        //     autoEl: {
        //         style: 'overflow:scroll; border: none; margin-left: auto; margin-right: auto;',
        //         html: '<div style ="text-align: center;"></div>'
        //     },
        //     height: 600,
        //     width: 600
        // });


        $.ajax({
            url: "http://sjfb01kr.hosu.io:13000/d/rIsPF8E7z/seolbihyeonhwang?orgId=1&from=1647823868700&to=1647845468700&viewPanel=123125",
            type: "GET",
            beforeSend: function(xhr){
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer eyJrIjoiOUJnaHByVk11T05FMFBEY3BwYWVzSzkzOGUzSGdYd0IiLCJuIjoibG9naW4iLCJpZCI6MX0=');
            },
        });


        var component = new Ext.Component({
            id: 'BwProductSubul-component',
            autoEl: {
                tag: 'iframe',
                style: 'height: 100%; width: 100%; border: none',
                src: 'http://sjfb01kr.hosu.io:13000/d/rIsPF8E7z/seolbihyeonhwang?orgId=1&from=1647823868700&to=1647845468700&viewPanel=123125'
            
            },
            height: 600,
            width: 600
        });

        //Ext.getCmp('OpHeatTreatment-component').destroy();

        Ext.apply(this, {
            layout: 'border',
            //   items: [this.grid,  this.crudTab]  // 이거 지우고 밑에거 열면 iframe 로 링크 연결
            items: [component]
        });

        this.callParent(arguments);

    }
});
