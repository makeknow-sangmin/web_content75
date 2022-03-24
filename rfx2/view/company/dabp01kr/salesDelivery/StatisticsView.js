Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.StatisticsView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'statistics-view',
    initComponent: function () {

        this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'COPY', 'REMOVE']
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        var factorialForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '계승',
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                width: 400,
                allowBlank: false,
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {xtype:'component', html: '계승(Factorial)'},
                {xtype:'component', html: '<b>n!</b> : n(n-1)(n-2)...3*2*1<hr>'},
                {
                    xtype: 'numberfield',
                    fieldLabel: 'n',
                    id: 'factorial1'
                }
            ]
        });

        var permutationForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '순열',
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                width: 400,
                allowBlank: false,
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {xtype:'component', html: '순열(Permutation)'},
                {xtype:'component', html: '<b>nPr</b> : 순서가 있는경우	n(n-1)(n-2)....(n-r+1)      <hr>'},
                {
                    xtype: 'numberfield',
                    fieldLabel: 'n',
                    id: 'permutation1'
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'r',
                    id: 'permutation2'
                }
            ]
        });

        var combinationForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '조합',
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                width: 400,
                allowBlank: false,
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {xtype:'component', html: '조합(Combination)'},
                {xtype:'component', html: '<b>nCr</b> : 순서가 없는 경우	nPr / ri <hr>'},
                {
                    fieldLabel: 'n',
                    id: 'combination1',
                    xtype: 'numberfield'
                }, {
                    fieldLabel: 'r',
                    id: 'combination2',
                    xtype: 'numberfield'
                }
            ]
        });

        
        var variance_probForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '분산(확률)',
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                width: 400,
                allowBlank: false,
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {xtype:'component', html: '분산(Variance)'},
                {xtype:'component', html: 'p*(1-p)^2 + (1-p)*(0-p)^2  ,   N*p*(1-p)<hr>'},
                {
                    fieldLabel: 'N',
                    id: 'variance_prob1',
                    xtype: 'numberfield'
                },
                {
                    fieldLabel: 'p',
                    id: 'variance_prob2',
                    xtype: 'numberfield'
                }
            ]
        });

        // var variance_valForm = Ext.create('Ext.form.Panel', {
        //     xtype: 'form',
        //     title: '분산(값)',
        //     bodyPadding: '3 3 0',
        //     region: 'center',
        //     fieldDefaults: {
        //         width: 400,
        //         allowBlank: false,
        //         labelAlign: 'right',
        //         msgTarget: 'side'
        //     },
        //     items: [
        //         {xtype:'component', html: '분산(Variance) <img src="/math/variance.png"></img>'},
        //         {
        //             fieldLabel: '값(,로 구분)',
        //             id: 'variance_val1',
        //             xtype: 'textfield'
        //         }
        //     ]
        // });

        var standard_deviationForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '표준편차',
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                width: 400,
                allowBlank: false,
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {xtype:'component', html: '표준편차(Standard Deviation) <img src="/math/standard_deviation.png"></img>'},
                {
                    fieldLabel: '값(,로 구분)',
                    id: 'standard_deviation1',
                    rows: 50,
                    xtype: 'textarea'
                }
            ]
        });

        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [factorialForm,permutationForm, combinationForm, variance_probForm, standard_deviationForm]
        });

        this.formResult = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '계산 결과',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'south',
            items: [
               {
                   width: 400,
                    xtype: 'button',
                    text: '계산',
                    handler: function () {
                        // var left_side = Ext.getCmp('left_side').getValue();
                        // var right_side = Ext.getCmp('right_side').getValue();
                        // Ext.getCmp('result').setValue('n! / ((n - r)! * r!) = ' + gm.me().combinations(left_side, right_side));
                    }
                },{xtype: 'component', html: '<br>결과'},{
                    xtype: 'textarea',
                    id: 'result',
                    name: 'result',
                    fieldLabel: '',
                    text: '',
                    width: 400,
                    //readOnly: true,
                },{xtype: 'component', html: '<br>'}
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.center,
                this.formResult]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            console_logs('setGridOnCallback selections', selections);
            var rec = selections[0];
            if (rec != undefined && rec != null) {
                gUtil.enable(this.labEditAction);
            } else {
                gUtil.disable(this.labEditAction);
            }

        });

        //디폴트 로드
        gMain.setCenterLoading(false);

    },
    combinations: function (n, r) {
        if (n == r) {
            return 1;
        }
        else {
            r = (r < n - r) ? n - r : r;
            return gm.me().product_Range(r + 1, n) / gm.me().product_Range(1, n - r);
        }
    },
    product_Range: function (a, b) {
        var prd = a, i = a;

        while (i++ < b) {
            prd *= i;
        }
        return prd;
    }


});
