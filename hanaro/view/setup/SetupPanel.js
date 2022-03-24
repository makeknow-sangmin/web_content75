Ext.define('Hanaro.view.setup.SetupPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.Card'
    ],
    xtype: 'layout-card',
    layout: 'card',
    width: 700,
    height: 600,

    bodyPadding: 25,

    defaults: {
        border:false
    },

    defaultListenerScope: true,

    bbar: ['->',
        {
            itemId: 'card-prev',
            text: '&laquo; 이전',
            handler: 'showPrevious',
            scale: 'medium',
            disabled: true
        },
        {
            itemId: 'card-next',
            text: '다음 &raquo;',
            scale: 'medium',
            handler: 'showNext',
            disabled: true
        }
    ],

    items: [
        Ext.create('Hanaro.view.setup.form.SetupFormcard01', {
            id: 'card-0'
        }),
        Ext.create('Hanaro.view.setup.form.SetupFormcard02', {
            id: 'card-1'
        }),
        Ext.create('Hanaro.view.setup.form.SetupFormcard03', {
            id: 'card-2'
        }),
        Ext.create('Hanaro.view.setup.form.SetupFormcard04', {
            id: 'card-3'
        })
    ],

    showNext: function () {
        this.doCardNavigation(1);
    },

    showPrevious: function (btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function (incr) {
        var me = this;
        var l = me.getLayout();
        var i = l.activeItem.id.split('card-')[1];
        var next = parseInt(i, 10) + incr;
        l.setActiveItem(next);

        me.down('#card-prev').setDisabled(next===0);
        me.down('#card-next').setDisabled(next===3);

        console_logs('i', i);
        console_logs('next', next);

        switch(next) {
            case 0:
            me.down('#card-next').setDisabled(true);
            break;
            case 2:
            if(i==1) {
                this.validateCompany();
            }
            break;
            case 3:
            if(i==2) {
                this.validateSystem();
            }
            break;
        }
        // if(i==1) {
        //     var card0 = Ext.getCmp('card-0');
        //     console_logs('card0.biz_no', card0.biz_no);       
        //     console_logs('card0.wa_code', card0.wa_code);
            
        //     me.down('#card-next').setDisabled(true);
        // }
    },
    validateSystem: function() {
        var card2 = Ext.getCmp('card-2');

        if(card2.isValid()) {
            var values = card2.getValues();
            console_logs('values', values);
            this.systemInfo = values;

            this.down('#card-prev').setDisabled(true);

            var card3 = Ext.getCmp('card-3');
            card3.doSetup();
        }
        else {
            this.doCardNavigation(-1);
        }
    },
    validateCompany: function() {
        var card1 = Ext.getCmp('card-1');

        if(card1.isValid()) {
            var values = card1.getValues();
            console_logs('values', values);
            if(values.password!=values.password1) {
                Ext.MessageBox.alert('오류', '입력한 암호값이 일치하지 않습니다.');
                this.doCardNavigation(-1);
            } else {
                this.companyInfo = values;
            }
        }
        else {
            this.doCardNavigation(-1);
        }
    },
    bizNoFormatter: function (num, type) {

        var formatNum = '';
   
        try{
   
             if (num.length == 10) {
   
                  if (type == 0) {
   
                       formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
   
                  } else {
   
                        formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
   
                  }
   
             }
   
        } catch(e) {
   
             formatNum = num;
   
             console.log(e);
   
        }
   
        return formatNum;
   
   },
   companyInfo : null,
   systemInfo: null

});