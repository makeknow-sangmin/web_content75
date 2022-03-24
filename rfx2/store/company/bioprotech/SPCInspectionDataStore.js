Ext.define('Rfx2.store.company.bioprotech.SPCInspectionDataStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
            hasNull: params.hasNull,
            srchNull: params.srchNull
        });

    },
    fields: [
        {
            name: 'average',
            convert: function (value, record) {
                var sum = 0,
                    sampleCnt = record.get('v029');
                for (let index = 0; index < sampleCnt; index++) {
                    // index를 문자열로 활용하기 위해 자리수 맞추기
                    var indexSample = index + '';
                    while (indexSample.length < 2) {
                        indexSample = '0' + indexSample;
                    }
                    sum += record.get('v0'+indexSample)*1;
                }
                return sum / sampleCnt;
            }
        },
        {
            name: 'range',
            convert: function (value, record) {
                var max = record.get('v000'), 
                    min = max;
                for (let index = 0; index < record.get('v029'); index++) {
                    // index를 문자열로 활용하기 위해 자리수 맞추기
                    var indexSample = index + '';
                    while (indexSample.length < 2) {
                        indexSample = '0' + indexSample;
                    }

                    const sample = record.get('v0'+indexSample);

                    max = max < sample ? sample : max;
                    min = min > sample ? sample : min;
                }
                return max - min;
            }
        }
    ],
    hasNull: false,
    srchNull : true,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/xdview/spcMgmt.do?method=readMabufferForSpcChart',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : false
    },
    listeners: {
        load: function(store, records, successful,operation, options) {
            
            if(this.hasNull) {

                var blank ={
                    systemCode: '',
                    codeName: '',
                    codeNameEn: ''
                };

                this.add(blank);
            }

        },
        beforeload: function(){
        }
    }
});