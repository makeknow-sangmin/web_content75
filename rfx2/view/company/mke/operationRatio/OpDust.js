Ext.define('Rfx2.view.company.mke.operationRatio.OpDust', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'op-dust',
    initComponent: function() {

        var component = new Ext.Component({
            id: 'OpDust-component',
            autoEl: {
                tag: 'iframe',
                style: 'height: 100%; width: 100%; border: none',
                src: 'http://211.240.57.17/dust1.asp'
            },
            height: 600,
            width: 600
        });

        //Ext.getCmp('OpWidingMachine-component').destroy();


        Ext.apply(this, {
            layout: 'border',
            //   items: [this.grid,  this.crudTab]  // 이거 지우고 밑에거 열면 iframe 로 링크 연결
            items: [component, this.crudTab]
        });

        this.callParent(arguments);

    }
});