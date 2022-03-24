Ext.define('Rfx.view.executiveInfo.SpcAnalysisView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'spc-analysis-view',
    initComponent: function(){

        var storeTemplate = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inst_name',
                type: 'string'
            }, {
                name: 'inst_date',
                type: 'string'
            }, {
                name: 'lot_no',
                type: 'string'
            }],
            data: [{
                inst_name: '내부 SPC 항목1'
            }, {
                inst_name: '내부 SPC 항목2'
            }]
        });

        var gridSpcItems = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            //title: '항목 목록',
            store: storeTemplate,
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            selModel: Ext.create('Ext.selection.CheckboxModel', {}),
            bbar: getPageToolbar(storeTemplate),
            //frame: true,
            layout: 'fit',
            forceFit: true,
            region : 'center',
            margin: '0 0 0 0',
            //width: 200,
            columns: [{
                text: '항목명',
                dataIndex: 'inst_name'
            }]
        });

        var panelTest = Ext.create('Ext.panel.Panel', {
            cls: 'rfx-panel',
            //title: '항목 구분',
            flex: 0.5,
            region: 'west',
            //frame: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: '구분',
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType'),
                            vertical: 'true',
                            items: [
                                { boxLabel: 'POP 데이터', name: 'radio1'},
                                { boxLabel: '측정 데이터', name: 'radio1'},
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: gm.getMC('CMD_Product', '제품군'),
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType2'),
                            vertical: 'true',
                            items: [
                                { boxLabel: 'Au', name: 'radio2'},
                                { boxLabel: 'Cu', name: 'radio2'},
                                { boxLabel: 'Ag', name: 'radio2'},
                                { boxLabel: 'SB', name: 'radio2'}
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '공정',
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType3'),
                            vertical: 'true',
                            items: [
                                { boxLabel: '신선', name: 'radio3'},
                                { boxLabel: '열처리', name: 'radio3'},
                                { boxLabel: '권선', name: 'radio3'}
                            ]
                        }
                    ]
                },
                gridSpcItems
            ]
        });


        //Chart 환경설정
        Highcharts.theme = {
            colors: ['#3493DF',  /*'#084695', '#FFD57E', '#979797', '#AA4643', */ '#FF9655', '#FFF263', '#6AF9C4']
            ,credits: {
                enabled: false
            },
            lang: {
                thousandsSep: ',',
                decimalPoint: '.',

            }
        };
        Highcharts.setOptions(Highcharts.theme);

        var storeTable = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [
                {  name: 'v001',       type: 'string'   }
                ,{  name: 'v002',       type: 'string'   }
                ,{  name: 'v003',       type: 'string'   }
                ,{  name: 'v004',       type: 'string'   }
                ,{  name: 'v005',       type: 'string'   }
                ,{  name: 'v006',       type: 'string'   }
                ,{  name: 'v007',       type: 'string'   }
                ,{  name: 'v008',       type: 'string'   }
                ,{  name: 'v009',       type: 'string'   }
                ,{  name: 'v010',       type: 'string'   }
                ,{  name: 'v011',       type: 'string'   }
                ,{  name: 'v012',       type: 'string'   }
                ,{  name: 'v013',       type: 'string'   }
                ,{  name: 'v014',       type: 'string'   }
                ,{  name: 'v015',       type: 'string'   }
            ],
            data: [
                {
                    v001 : '1',
                    v002 : 'Sn',
                    v003 : 'Balance',
                    v004 : '96.69',
                    v005 : 'Acc',
                    v006 : '96.72',
                    v007 : 'Acc',
                    v008 : '7.36',
                    v009 : 'Acc',
                    v010 : '217.4',
                    v011 : 'Acc'
                }
                ,{
                    v001 : '2',
                    v002 : 'Ag',
                    v003 : '2.6±0.1 %',
                    v004 : '2.6245',
                    v005 : 'Acc',
                    v006 : '2.6126',
                    v007 : 'Acc'
                },{
                    v001 : '3',
                    v002 : 'Cu',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '4',
                    v002 : 'Pb',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '5',
                    v002 : 'Sb',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '6',
                    v002 : 'Al',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '7',
                    v002 : 'Cd',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '8',
                    v002 : 'Fe',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '9',
                    v002 : 'Zn',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '10',
                    v002 : 'Bi',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '11',
                    v002 : 'As',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '12',
                    v002 : 'In',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '13',
                    v002 : 'Au',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '14',
                    v002 : 'Ni',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '15',
                    v002 : 'P',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '16',
                    v002 : 'Ge',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '17',
                    v002 : 'S',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                },{
                    v001 : '18',
                    v002 : 'Co',
                    v003 : '0.5±0.2 %',
                    v004 : '0.62',
                    v005 : 'Acc',
                    v006 : '0.60',
                    v007 : 'Acc'
                }

            ]
        });

        var storeData = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [
                {  name: 'lotNo',      type: 'string'   }
                ,{  name: 'v001',       type: 'float'   }
                ,{  name: 'v002',       type: 'float'   }
                ,{  name: 'v003',       type: 'float'   }
                ,{  name: 'v004',       type: 'float'   }
                ,{  name: 'v005',       type: 'float'   }
                ,{  name: 'v006',       type: 'float'   }
                ,{  name: 'v007',       type: 'float'   }
                ,{  name: 'v008',       type: 'float'   }
                ,{  name: 'v009',       type: 'float'   }
                ,{  name: 'v010',       type: 'float'   }
                ,{  name: 'v011',       type: 'float'   }
                ,{  name: 'v012',       type: 'float'   }
                ,{  name: 'v013',       type: 'float'   }
                ,{  name: 'v014',       type: 'float'   }
                ,{  name: 'v015',       type: 'float'   }
                ,{  name: 'v016',       type: 'float'   }
                ,{  name: 'v017',       type: 'float'   }
                ,{  name: 'v018',       type: 'float'   }
                ,{  name: 'v019',       type: 'float'   }
                ,{  name: 'v020',       type: 'float'   }
            ],
            data: [
                { lotNo: 'MI19061221001I', v001:0.1908, v002:3.84578570019534, v003:1.23, v004:0.52, v005:0.0053, v006:0.0004, v007:0.0005, v008:0.0058, v009:0.0023, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014: null, v015: null, v016: null, v017: null, v018: null},
                { lotNo: 'MI19061221002I', v001:0.1904, v002:2.02632547952224, v003:1.23, v004:0.52, v005:0.0064, v006:0.0002, v007:0.0004, v008:0.0054, v009:0.0029, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014: null, v015: null, v016: null, v017: null, v018: null},
                { lotNo: 'MI19061222003I', v001:0.1898, v002:3.57762924330864, v003:1.22, v004:0.52, v005:0.0062, v006:0.0003, v007:0.0007, v008:0.0055, v009:0.0031, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014: null, v015: null, v016: null, v017: null, v018: null},
                { lotNo: 'MI19061223004I', v001:0.1907, v002:3.38653372750138, v003:1.22, v004:0.52, v005:0.0063, v006:0.0002, v007:0.0006, v008:0.0048, v009:0.0030, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014: null, v015: null, v016: null, v017: null, v018: null},
                { lotNo: 'MI19061226005I', v001:0.1906, v002:3.87374328145435, v003:1.19, v004:0.53, v005:0.0061, v006:0.0002, v007:0.0004, v008:0.0046, v009:0.0030, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014: null, v015: null, v016: null, v017: null, v018: null},
                { lotNo: 'MI19061227006I', v001:0.1907, v002:1.99953102568942, v003:1.20, v004:0.52, v005:0.0061, v006:0.0002, v007:0.0004, v008:0.0047, v009:0.0029, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:219.1, v015:7.34, v016:73.2, v017:0, v018:2.97},
                { lotNo: 'MI19061227007I', v001:0.1903, v002:2.77455415510103, v003:1.18, v004:0.52, v005:0.0042, v006:0.0010, v007:0.0006, v008:0.0087, v009:0.0027, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:218.7, v015:7.33, v016:74.2, v017:0, v018:2.96},
                { lotNo: 'MI19070207008I', v001:0.1903, v002:3.99967012255795, v003:1.20, v004:0.50, v005:0.0042, v006:0.0010, v007:0.0005, v008:0.0087, v009:0.0024, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:218.7, v015:7.33, v016:74.26, v017:0, v018:3.02},
                { lotNo: 'MI19070207009I', v001:0.1898, v002:3.27702292312666, v003:1.20, v004:0.51, v005:0.0041, v006:0.0018, v007:0.0005, v008:0.0120, v009:0.0020, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:218.7, v015:7.33, v016:73.91, v017:0, v018:3.00},
                { lotNo: 'MI19070208010I', v001:0.1908, v002:2.67651838194317, v003:1.18, v004:0.52, v005:0.0040, v006:0.0011, v007:0.0005, v008:0.0083, v009:0.0017, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:217.7, v015:7.34, v016:74.32, v017:0, v018:2.93},
                { lotNo: 'MI19070227011I', v001:0.1901, v002:2.87703365845176, v003:1.17, v004:0.54, v005:0.0040, v006:0.0015, v007:0.0006, v008:0.0100, v009:0.0016, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.054, v014:217.7, v015:7.34, v016:74.64, v017:0, v018:2.90},
                { lotNo: 'MI19070228012I', v001:0.1906, v002:4.24164803243072, v003:1.17, v004:0.53, v005:0.0039, v006:0.0011, v007:0.0006, v008:0.0081, v009:0.0018, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:217.7, v015:7.34, v016:74.64, v017:0, v018:2.09},
                { lotNo: 'MI19070301013I', v001:0.1905, v002:3.69406692959241, v003:1.18, v004:0.54, v005:0.0040, v006:0.0009, v007:0.0008, v008:0.0073, v009:0.0021, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:217.7, v015:7.34, v016:74.64, v017:0, v018:2.90},
                { lotNo: 'MI19070301014I', v001:0.1904, v002:2.02883860971437, v003:1.18, v004:0.53, v005:0.0038, v006:0.0003, v007:0.0006, v008:0.0053, v009:0.0022, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:219.0, v015:7.33, v016:74.40, v017:0, v018:2.95},
                { lotNo: 'MI19070420015I', v001:0.1908, v002:3.08700942288111, v003:1.22, v004:0.51, v005:0.0047, v006:0.0013, v007:0.0005, v008:0.0091, v009:0.0040, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.049, v014:218.5, v015:7.33, v016:74.03, v017:0, v018:2.91},
                { lotNo: 'MI19070420016I', v001:0.1908, v002:3.21247946029965, v003:1.21, v004:0.52, v005:0.0046, v006:0.0013, v007:0.0006, v008:0.0089, v009:0.0033, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.049, v014:218.5, v015:7.33, v016:74.47, v017:0, v018:2.92},
                { lotNo: 'MI19070421017I', v001:0.1905, v002:3.13049964558516, v003:1.23, v004:0.51, v005:0.0045, v006:0.0015, v007:0.0005, v008:0.0091, v009:0.0041, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.049, v014:218.1, v015:7.34, v016:74.45, v017:0, v018:2.97},
                { lotNo: 'MI19070425018I', v001:0.1907, v002:2.20847825124538, v003:1.22, v004:0.52, v005:0.0050, v006:0.0015, v007:0.0006, v008:0.0075, v009:0.0040, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:218.1, v015:7.34, v016:74.48, v017:0, v018:3.06},
                { lotNo: 'MI19070426019I', v001:0.1904, v002:2.74714379448374, v003:1.19, v004:0.52, v005:0.0065, v006:0.0015, v007:0.0003, v008:0.0077, v009:0.0033, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:218.1, v015:7.34, v016:74.54, v017:0, v018:3.07},
                { lotNo: 'MI19070427020I', v001:0.1897, v002:2.28236030985983, v003:1.23, v004:0.52, v005:0.0063, v006:0.0015, v007:0.0003, v008:0.0074, v009:0.0032, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:218.1, v015:7.34, v016:73.48, v017:0, v018:3.01},
                { lotNo: 'MI19070515021I', v001:0.1898, v002:3.15350109038576, v003:1.21, v004:0.52, v005:0.0066, v006:0.0034, v007:0.0003, v008:0.0161, v009:0.0033, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:217.7, v015:7.33, v016:73.21, v017:0, v018:2.99},
                { lotNo: 'MI19070515022I', v001:0.1900, v002:4.33473563853185, v003:1.21, v004:0.52, v005:0.0067, v006:0.0040, v007:0.0003, v008:0.0162, v009:0.0030, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:217.7, v015:7.33, v016:73.88, v017:0, v018:3.02},
                { lotNo: 'MI19070516023I', v001:0.1896, v002:2.89809520377808, v003:1.20, v004:0.51, v005:0.0069, v006:0.0033, v007:0.0002, v008:0.0175, v009:0.0029, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.054, v014:217.7, v015:7.33, v016:74.54, v017:0, v018:3.04},
                { lotNo: 'MI19070517024I', v001:0.1905, v002:2.06329316699334, v003:1.22, v004:0.50, v005:0.0059, v006:0.0014, v007:0.0003, v008:0.0139, v009:0.0026, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:217.8, v015:7.33, v016:73.87, v017:0, v018:3.07},
                { lotNo: 'MI19070620025I', v001:0.1907, v002:2.51686295621928, v003:1.22, v004:0.51, v005:0.0060, v006:0.0015, v007:0.0005, v008:0.0150, v009:0.0039, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.050, v014:217.8, v015:7.33, v016:73.53, v017:0, v018:3.08},
                { lotNo: 'MI19070620026I', v001:0.1905, v002:2.19417239916182, v003:1.20, v004:0.53, v005:0.0056, v006:0.0014, v007:0.0004, v008:0.0097, v009:0.0025, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.049, v014:218.9, v015:7.33, v016:73.88, v017:0, v018:3.04},
                { lotNo: 'MI19070630027I', v001:0.1906, v002:2.21771441691283, v003:1.21, v004:0.54, v005:0.0053, v006:0.0018, v007:0.0004, v008:0.0114, v009:0.0035, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:218.8, v015:7.33, v016:73.41, v017:0, v018:3.04},
                { lotNo: 'MI19070731028I', v001:0.1904, v002:3.91038195783056, v003:1.22, v004:0.51, v005:0.0053, v006:0.0015, v007:0.0004, v008:0.0140, v009:0.0034, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:219.0, v015:7.33, v016:73.23, v017:0, v018:3.04},
                { lotNo: 'MI19070801029I', v001:0.1906, v002:3.96636787586808, v003:1.22, v004:0.51, v005:0.0053, v006:0.0017, v007:0.0004, v008:0.0179, v009:0.0034, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:219.0, v015:7.33, v016:73.88, v017:0, v018:3.07},
                { lotNo: 'MI19070801030I', v001:0.1902, v002:3.75445411335983, v003:1.24, v004:0.52, v005:0.0053, v006:0.0018, v007:0.0004, v008:0.0189, v009:0.0034, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:219.0, v015:7.33, v016:74.53, v017:0, v018:3.10},
                { lotNo: 'MI19070802031I', v001:0.1900, v002:3.29978282473606, v003:1.22, v004:0.51, v005:0.0070, v006:0.0022, v007:0.0004, v008:0.0169, v009:0.0019, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:218.0, v015:7.33, v016:74.54, v017:0, v018:3.08},
                { lotNo: 'MI19070828032I', v001:0.1902, v002:3.25848278761091, v003:1.22, v004:0.54, v005:0.0065, v006:0.0033, v007:0.0005, v008:0.0193, v009:0.0034, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.054, v014:218.5, v015:7.34, v016:74.54, v017:0, v018:3.07},
                { lotNo: 'MI19070829033I', v001:0.1899, v002:3.21783920507847, v003:1.21, v004:0.55, v005:0.0061, v006:0.0037, v007:0.0005, v008:0.0213, v009:0.0036, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.054, v014:218.5, v015:7.34, v016:74.54, v017:0, v018:3.07},
                { lotNo: 'MI19070830034I', v001:0.1905, v002:2.54935371712269, v003:1.21, v004:0.52, v005:0.0051, v006:0.0050, v007:0.0004, v008:0.0222, v009:0.0036, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:219.0, v015:7.33, v016:74.38, v017:0, v018:3.12},
                { lotNo: 'MI19070919035I', v001:0.1903, v002:3.01376714815827, v003:1.21, v004:0.51, v005:0.0052, v006:0.0049, v007:0.0005, v008:0.0226, v009:0.0040, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.050, v014:219.0, v015:7.33, v016:74.32, v017:0, v018:3.13},
                { lotNo: 'MI19070919036I', v001:0.1894, v002:2.94525353858148, v003:1.23, v004:0.49, v005:0.0051, v006:0.0050, v007:0.0006, v008:0.0224, v009:0.0043, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.050, v014:219.0, v015:7.33, v016:74.32, v017:0, v018:3.13},
                { lotNo: 'MI19070920037I', v001:0.1905, v002:2.09059939220919, v003:1.22, v004:0.50, v005:0.0054, v006:0.0027, v007:0.0007, v008:0.0159, v009:0.0036, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.050, v014:218.5, v015:7.33, v016:74.05, v017:0, v018:2.96},
                { lotNo: 'MI19071011038I', v001:0.1902, v002:4.22370927105482, v003:1.21, v004:0.52, v005:0.0054, v006:0.0032, v007:0.0006, v008:0.0212, v009:0.0025, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:219.1, v015:7.33, v016:73.89, v017:0, v018:2.89},
                { lotNo: 'MI19071019039I', v001:0.1897, v002:2.47283001238812, v003:1.21, v004:0.52, v005:0.0054, v006:0.0032, v007:0.0006, v008:0.0212, v009:0.0025, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:219.1, v015:7.33, v016:73.72, v017:0, v018:2.92},
                { lotNo: 'MI19071019040I', v001:0.1904, v002:3.84580834724063, v003:1.23, v004:0.53, v005:0.0054, v006:0.0032, v007:0.0007, v008:0.0214, v009:0.0026, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:219.1, v015:7.33, v016:73.63, v017:0, v018:2.96},
                { lotNo: 'MI19071020041I', v001:0.1900, v002:2.83869973792284, v003:1.21, v004:0.53, v005:0.0053, v006:0.0032, v007:0.0008, v008:0.0210, v009:0.0028, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.052, v014:219.1, v015:7.33, v016:73.63, v017:0, v018:2.96},
                { lotNo: 'MI19071024042I', v001:0.1904, v002:3.39018931038045, v003:1.22, v004:0.52, v005:0.0050, v006:0.0029, v007:0.0003, v008:0.0215, v009:0.0022, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.051, v014:219.1, v015:7.33, v016:74.20, v017:0, v018:2.97},
                { lotNo: 'MI19071024043I', v001:0.1910, v002:2.42432855794374, v003:1.21, v004:0.52, v005:0.0055, v006:0.0037, v007:0.0003, v008:0.0207, v009:0.0031, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:219.1, v015:7.33, v016:73.58, v017:0, v018:3.14},
                { lotNo: 'MI19071129044I', v001:0.1907, v002:2.86113988767110, v003:1.17, v004:0.51, v005:0.0053, v006:0.0039, v007:0.0003, v008:0.0210, v009:0.0029, v010:0.0001, v011:0.0005, v012:0.0001, v013:0.053, v014:219.1, v015:7.33, v016:73.35, v017:0, v018:3.18}

            ]
        });

        var authoFields = [
            {
                bodyPadding: 5,
                defaults: {
                    border: false,
                    labelWidth: 100,
                    labelAlign : 'right',
                    layout: 'anchor'
                },
                layout: {
                    type: 'hbox',
                    pack: 'start',
                },
                items: [{
                    xtype: 'radiofield',
                    name: 'radio1',
                    value: 'bw',
                    fieldLabel: '제품 구분',
                    boxLabel: 'Bonding Wire',
                    width: 230
                }, {
                    xtype: 'radiofield',
                    name: 'radio1',
                    value: 'sb',
                    fieldLabel: '',
                    labelSeparator: '',
                    hideEmptyLabel: false,
                    boxLabel: 'Solder Ball',
                    width: 230
                }
                ]
            },
            {
                bodyPadding: 5,
                defaults: {
                    border: false,
                    labelWidth: 100,
                    labelAlign : 'right',
                    layout: 'anchor'
                },
                layout: {
                    type: 'hbox',
                    pack: 'start',
                },
                items: [{
                    xtype: 'radiofield',
                    name: 'radio2',
                    value: 'size',
                    fieldLabel: '검사 유형',
                    boxLabel: 'SIZE',
                    width: 230
                }, {
                    xtype: 'radiofield',
                    name: 'radio2',
                    value: 'ingradient',
                    fieldLabel: '',
                    labelSeparator: '',
                    hideEmptyLabel: false,
                    boxLabel: '성분',
                    width: 230
                }
                ]
            },
            {
                bodyPadding: 5,
                defaults: {
                    border: false,

                    labelWidth: 100,
                    labelAlign : 'right',
                    layout: 'anchor'
                },
                layout: {
                    type: 'hbox',
                    pack: 'start',
                },

                items: [{
                    xtype: 'filefield',
                    name: 'file1',
                    width: 500,
                    fieldLabel: '파일 업로드'
                }
                ]
            }
        ];


        var storeTemplate = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'buyer_name',
                type: 'string'
            }, {
                name: 'template_name',
                type: 'string'
            }],
            data: [{
                buyer_name: '삼성전자',
                template_name: '기본성적서'
            },{
                buyer_name: 'Hitachi',
                template_name: '기본성적서'
            }]
        });

        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'inst_name',
                type: 'string'
            }, {
                name: 'inst_date',
                type: 'string'
            }, {
                name: 'lot_no',
                type: 'string'
            }, {
                name: 'buyer_name',
                type: 'string'
            }],
            data: [{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22222'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'

            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            },{
                inst_name: 'GH2018-01',
                inst_date: '2018-06-11', buyer_name: '삼성전자',
                lot_no: 'C22221'
            }]
        });

        var gridInspect = Ext.create('Ext.grid.Panel', {
            //title: 'LOT 선택',
            //frame: true,
            //border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            autoHeight: true,
            //region: 'west',
            //layout: 'fit',
            margin: '0 0 0 0',
            flex: 0.5,
            //width: '35%',
            //forceFit: true,
            store: storeInspect,
            cls : 'rfx-panel',
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                mode: 'multi',
                checkOnly:  false,
                allowDeselect: true
            }),
            // collapsible: false,
            multiSelect: true,
            autoScroll : true,
            //autoHeight: true,
            bbar: getPageToolbar(storeInspect),
            //frame: true,
            //layout          :'fit',
            forceFit: true,
            //margin: '5 0 0 0',
            flex:1,
            border: true,
            dockedItems : [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default',
                    margin: '0 0 0 0',
                    items: [
                        {
                            fieldLabel: "<font color=white>출하일자</font>",
                            xtype: "datefield",
                            labelWidth: 60,
                            width: 170,
                            value: new Date()
                        },
                        {
                            emptyText: "타입",
                            xtype: "textfield",
                            width: 80
                        },
                        {
                            emptyText: "LOT",
                            xtype: "textfield",
                            width: 80
                        },
                        {
                            emptyText: "품목명",
                            xtype: "textfield",
                            width: 80
                        },
                        {
                            iconCls: null,
                            glyph: 'f12d@FontAwesome',
                            text: CMD_SEARCH/*'검색'*/
                        }
                    ]
                })
            ],
            columns: [{
                text: '일자',
                dataIndex: 'inst_date'
            }, {
                text: '고객사',
                dataIndex: 'buyer_name'
            },{
                text: '출하오더',
                dataIndex: 'inst_name'
            }, {
                text: '제조LOT',
                dataIndex: 'lot_no'
            }]
            //title: '측정데이타 선택'
        });

        var gridTest = Ext.create('Ext.panel.Panel', {
            title: 'LOT 선택2',
            frame: true,
            border: true,
            //resizable: true,
            //scroll: true,
            multiSelect: true,
            region: 'west',
            layout: 'fit',
            margin: '5 0 0 0',
            width: '35%',
            //store: storeInspect,
            cls : 'rfx-panel',
            multiSelect: true,
            //autoScroll : true,
            //autoHeight: true,
            //bbar: getPageToolbar(storeInspect),
            //frame: true,
            layout          :'fit',
            forceFit: true,
            //margin: '5 0 0 0',
            flex:1,
            border: true,
            items: [
                gridInspect,
                {
                    xtype: 'fieldset',
                    title: '구분',
                    margin: '5 5 5 5',
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            id: gu.id('productType4'),
                            vertical: 'true',
                            items: [
                                { boxLabel: 'POP 데이터', name: 'radio1'},
                                { boxLabel: '측정 데이터', name: 'radio1'},
                            ]
                        }
                    ]
                }
            ]
        });

        if(gridInspect!=null) {
            gridInspect.getSelectionModel().on({
                selectionchange: function(sm, selections) {
                    var rec = (selections!=null && selections.length>0) ? selections[0] : null;
                    console_logs('rec', rec);
                    var buyer_name = rec.get('buyer_name');
                    var lot_no = rec.get('lot_no');
                    var t = buyer_name + ' - ' + lot_no;

                    var o = gu.getCmp('select_title');
                    if (o != null) {
                        o.setText( t);
                    }





                    //histogram
                    //chartHist1
                    //data = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3, 3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3, 2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3, 2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3, 2.5, 3, 3.4, 3];



                }
            });
        }


        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  false,
            allowDeselect: true

        });
        var tableGrid = Ext.create('Ext.grid.Panel', {
            title: 'S/B 원재료검사',
            store: storeTable,
            cls : 'rfx-panel',
            selModel: selModel,
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            //border: true,
            frame: false,
            //flex: 1,
            layout          :'fit',
            //region: 'center',
            forceFit: true,
            margin: '0 0 0 0',
            flex: 1,
            dockedItems : [

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: true
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [{
                        xtype: "combobox",
                        forceSelection: true,
                        store: [
                            [1, "생산결과 판정"],
                            [2, "QA 판정"],
                            [3, "비중 판정"],
                            [4, "M.P 판정"]
                        ],
                        queryMode: "local",
                        name: "Combo",
                        fieldLabel: "수정항목",
                        labelWidth: 90,
                        itemId: "Combo"
                    },
                        {
                            xtype: "textfield",
                            name: "Text",
                            itemId: "Text",
                            value: 'Acc'
                        },
                        {
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            text:'수정',
                            listeners : [{
                                click: function() {

                                    Ext.Msg.alert('결과', '수정 되었습니다.');

                                }
                            }]
                        }]
                })
            ],
            columns: [{
                text: '항목',
                dataIndex: 'v001'
            }, {
                text: '화학조성',
                dataIndex: 'v002'
            }, {
                text: 'Spec(%)',
                dataIndex: 'v003'
            }, {
                text: '생산결과(%)',
                dataIndex: 'v004'
            }, {
                text: '판 정',
                dataIndex: 'v005'
            }, {
                text: 'QA결과(%)',
                dataIndex: 'v006'
            }, {
                text: '판 정',
                dataIndex: 'v007'
            }, {
                text: '비중',
                dataIndex: 'v008'
            }, {
                text: '판 정',
                dataIndex: 'v009'
            }, {
                text: 'M.P',
                dataIndex: 'v010'
            }, {
                text: '판 정',
                dataIndex: 'v011'
            }

            ]

        });

        var tableGridGroup = Ext.create('Ext.tab.Panel', {
            title: '분석표',
            tabPosition: 'bottom',
            plain: true,
            items: [
                tableGrid,
                {
                    title: 'S/B DIAMETER'
                }
                ,
                {
                    title: 'S/B ROUNDNESS'
                }
            ]
        });


        var dataGrid = Ext.create('Ext.grid.Panel', {
            title: '그리드 뷰',
            store: storeData,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            //border: true,
            frame: false,
            //flex: 1,
            layout          :'fit',
            //region: 'center',
            forceFit: true,
            margin: '0 0 0 0',
            flex: 1,
            // dockedItems : [

            //     Ext.create('widget.toolbar', {
            //         plugins: {
            //             boxreorderer: true
            //         },
            //         cls: 'my-x-toolbar-default2',
            //         margin: '0 0 0 0',
            //         items: [{
            //             xtype: "combobox",
            //             forceSelection: true,
            //             store: [
            //                 [1, "생산결과 판정"],
            //                 [2, "QA 판정"],
            //                 [3, "비중 판정"],
            //                 [4, "M.P 판정"]
            //             ],
            //             queryMode: "local",
            //             name: "Combo",
            //             fieldLabel: "수정항목",
            //             labelWidth: 90,
            //             itemId: "Combo"
            //         },
            //             {
            //                 xtype: "textfield",
            //                 name: "Text",
            //                 itemId: "Text",
            //                 value: 'Acc'
            //             },
            //             {
            //                 iconCls: null,
            //                 glyph: 'f0c7@FontAwesome',
            //                 text:'수정',
            //                 listeners : [{
            //                     click: function() {

            //                         Ext.Msg.alert('결과', '수정 되었습니다.');

            //                     }
            //                 }]
            //             }]
            //         })
            // ],



            columns: [{
                text: 'LOTNO',
                dataIndex: 'lotNo',
                width: 200
            },{
                text: 'Size',
                dataIndex: 'v001',
                xtype: 'numbercolumn',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'CPK',
                dataIndex: 'v002',
                xtype: 'numbercolumn',
                format: '0,000.00',
                align: 'right'
            }, {
                text: 'Ag',
                dataIndex: 'v003',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Cu',
                dataIndex: 'v004',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Sb',
                dataIndex: 'v005',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Bi',
                dataIndex: 'v006',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Zn',
                dataIndex: 'v007',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Pb',
                dataIndex: 'v008',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Fe',
                dataIndex: 'v009',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Al',
                dataIndex: 'v010',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'As',
                dataIndex: 'v011',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Cd',
                dataIndex: 'v012',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'Ni',
                dataIndex: 'v013',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: 'M.P',
                dataIndex: 'v014',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: '비중',
                dataIndex: 'v015',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: '백색도',
                dataIndex: 'v016',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: '성형온도',
                dataIndex: 'v017',
                format: '0,000.0000',
                align: 'right'
            }, {
                text: '황색도',
                dataIndex: 'v018',
                format: '0,000.0000',
                align: 'right'
            }

            ]

        });

        var dataViewGroup = Ext.create('Ext.tab.Panel', {
            title: 'DATA',
            tabPosition: 'bottom',
            plain: true,
            items: [
                {
                    xtype: 'form',
                    title: 'Raw 데이타',
                    items: [
                        {
                            bodyPadding: 5,
                            defaults: {
                                border: true,
                                flex: 1,
                            },
                            layout: 'fit',
                            items: [
                                {
                                    xtype: "textarea",
                                    flex: 1,
                                    autoWidth: true,
                                    height: 500,
                                    autoScroll: true,
                                    emptyText: '엑셀에서 필드를 포함해서 [복사/붙여넣기] 하세요.',
                                    anchor: '100%',
                                    grow: true,
                                    scroll:'vertical',
                                    defaults: {
                                        scroll: 'vertical'
                                    },
                                    value: this.ingredientData,
                                    fieldStyle: "background: #FAE480 !important;"
                                }]
                        }

                    ]
                },
                dataGrid
            ]
        });

        var histoViewGroup = Ext.create('Ext.tab.Panel', {
            title: '히스토그램',
            tabPosition: 'bottom',
            plain: true,
            items: [
                {
                    title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
                    autoScroll: true,
                    id: gu.id('chartHist1')
                },
                {
                    title: '전체보기',
                    autoScroll: true,
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    border: false,
                    bodyPadding: 10,
                    defaults: {
                        frame: false,
                        bodyPadding: 10
                    },

                    items: [
                        {
                            xtype: 'form',
                            bodyPadding: 5,
                            height: 50,
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                            },
                            items: [{
                                xtype: "textfield",
                                fieldLabel: "목표값",
                                labelAlign: 'right',
                                value: '0.220'
                            },{
                                xtype: "textfield",
                                labelAlign: 'right',
                                labelWidth: 160,
                                fieldLabel: "허용오차(plus/minus)",
                                value: '0.005'
                            }, {
                                xtype: 'label',
                                style: 'margin-left: 10px;margin-top: 5px;',
                                text: 'mm'
                            }
                            ]
                        },
                        {
                            id: gu.id('chartHist2'),
                            flex: 1
                        }
                    ]

                },
            ],
            listeners: {
                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
                    gm.me().tabchangeHandlerHist(tabPanel, newTab, oldTab, eOpts);
                }
            }
        });

        var tabView = Ext.create('Ext.tab.Panel', {
            // frame: true,
            region: 'east',
            collapsible: false,
            border: true,
            // title: '성적서 작성',
            width: '45%',
            margin: '5 0 0 0',
            //bodyPadding: 5,

            items: [
                /*{
                    xtype: 'form',
                    title: gm.me().getMC('CMD_FILE_UPLOAD','파일 업로드'),
                    items: authoFields
                },
                dataViewGroup,*/
                histoViewGroup,
                {
                    title: '정규분포',
                    id: gu.id('chartDist1'),
                    autoScroll: true
                },
                {
                    title: 'Xbar-R 관리도',
                    autoScroll: true,
                    html: '<div style="height:200px;" id='
                    +  gu.id('chartSpc1') + '></div><hr><div style="height:200px;" id='
                    +  gu.id('chartSpc2') + '></div>'
                }/*,
                tableGridGroup*/
            ]
            ,
            listeners: {
                tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
                    gm.me().tabchangeHandlerDoc(tabPanel, newTab, oldTab, eOpts);
                }
            }
        });


        Ext.apply(this, {
            layout: 'border',
            //bodyBorder: true,
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    title: '항목',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: 'fit',
                    margin: '5 0 0 0',
                    width: '20%',
                    items: [panelTest]
                },
                {
                    title: '검색 및 차트 선택',
                    collapsible: true,
                    frame: true,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '20%',
                    items: [gridInspect,
                        {
                            xtype: 'fieldset',
                            title: '구분',
                            margin: '5 5 5 5',
                            flex: 0.5,
                            defaults: {
                                border: false,
                                labelWidth: 100,
                                labelAlign: 'right',
                                layout: 'anchor'
                            },
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    id: gu.id('productType4'),
                                    vertical: 'true',
                                    items: [
                                        { boxLabel: '히스토그램', name: 'radio1'},
                                        { boxLabel: '정규분포', name: 'radio1'},
                                        { boxLabel: 'Xbar-R 관리도', name: 'radio1'}
                                    ]
                                }
                            ]
                        }]
                },
                //gridTest,
                tabView

            ]
        });


        this.callParent(arguments);


    },

    bodyPadding: 3,

    // defaults: {
    //     frame: true,
    //     bodyPadding: 10
    // },

    // autoScroll: true,
    // fieldDefaults: {
    //     labelWidth: 300 //Only Support this
    //     //labelWidth: "100"     //Doesn't render with 100 Pixel Size
    //     //labelWidth: "100px"	//Suffix with px won't work
    //     //, height:20
    // },
    items: null,
    tabchangeHandlerDoc : function(tabPanel, newTab, oldTab, eOpts)  {
        // console_logs('tabpanel newTab', newTab);
        console_logs('tabpanel newTab newTab.title', newTab.title);
        gm.me().curTabname = newTab.title;
        gm.me().redrawContent();
    },
    tabchangeHandlerHist : function(tabPanel, newTab, oldTab, eOpts)  {
        gm.me().curHisname = newTab.title;
        console_logs('curHisname', this.curHisname);
        switch(this.curHisname) {
            case '상세보기':
                this.redrawHistDetail();
                break;
            case '전체보기':
                this.redrawHistOveral();
                break;
        }

    },
    curTabname : null,
    curHisname : null,
    redrawSpc: function() {
        $('#' + gu.id('chartSpc1')).highcharts({
            chart: {
                renderTo: 'control',
                defaultSeriesType: 'line',
                marginRight:25,
                marginLeft:60,
                backgroundColor:'#eee',
                borderWidth:1,
                borderColor:'#ccc',
                plotBackgroundColor:'#fff',
                plotBorderWidth:1,
                plotBorderColor:'#ccc',
            },
            credits:{
                enabled:false
            },
            title: {
                text: '표본 평균',
            },
            tooltip: {
                borderWidth:1,
                formatter: function() {
                    if(this.point.error){
                        var errorText = '<b>Flag: </b>' + this.point.error;
                    }
                    else{
                        var errorText = '';
                    }
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'days'+'<br/>'+
                        errorText;
                }
            },
            legend: {
                enabled:false
            },
            plotOptions:{
                series: {
                    shadow: false,
                    lineWidth:1,
                    states: {
                        hover: {
                            enabled:true,
                            lineWidth:1
                        }
                    },
                    marker: {
                        enabled:true,
                        symbol:'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    },
                }
            },
            xAxis: {
                lineWidth:0,
                tickColor:'#999',
            },
            yAxis: {
                tickPositions:[14.27,21.87,29.46,37.06,44.66,52.66,59.85],
                plotLines:[{
                    value:14.27,
                    color:'rgba(162,29,33,.75)',
                    width:1,
                    zIndex:3
                },{
                    value:37.06,
                    color:'rgba(24,90,169,.75)',
                    width:1,
                    zIndex:3
                },{
                    value:59.85,
                    color:'rgba(162,29,33,.75)',
                    width:1,
                    zIndex:3
                }],
                title: {text: ''},
                lineWidth:0,
                gridLineWidth:1,
                gridLineColor:'rgba(24,90,169,.25)',
                lineWidth:0,
                startOnTick:false,
                endOnTick:false,
                minPadding:0,
                maxPadding:0,
                min:6.6713193144352,
                max:67.451129665157,
            },
            series: [{
                name:'Measure',
                data:[36,30,30,39,33,42,33,33,38,31,23,31,40,25,28,29,
                    {y:29,error:'4 or more consecutive points below 1 sigma of mean',marker:{symbol:'diamond',fillColor:'#f00',lineColor:'#f00',radius:4,states:{hover:{fillColor:'#f00',lineColor:'#f00',radius:5}}}},
                    30,28,30,34,
                    {y:36,error:'9 or more consecutive points below mean',marker:{symbol:'diamond',fillColor:'#f00',lineColor:'#f00',radius:4,states:{hover:{fillColor:'#f00',lineColor:'#f00',radius:5}}}},
                    {y:30,error:'9 or more consecutive points below mean',marker:{symbol:'diamond',fillColor:'#f00',lineColor:'#f00',radius:4,states:{hover:{fillColor:'#f00',lineColor:'#f00',radius:5}}}}, 38,36,29,37,34,34,29,39,31,35,37,50,35,42,46,38,35,50,35,35,36,36,30,34,38,35,42,46],
            }]
        });

        $('#' + gu.id('chartSpc2')).highcharts({
            chart: {
                renderTo: 'control',
                defaultSeriesType: 'line',
                marginRight:25,
                marginLeft:60,
                backgroundColor:'#eee',
                borderWidth:1,
                borderColor:'#ccc',
                plotBackgroundColor:'#fff',
                plotBorderWidth:1,
                plotBorderColor:'#ccc',
            },
            credits:{
                enabled:false
            },
            title: {
                text: '표본 범위',
            },
            tooltip: {
                borderWidth:1,
                formatter: function() {
                    if(this.point.error){
                        var errorText = '<b>Flag: </b>' + this.point.error;
                    }
                    else{
                        var errorText = '';
                    }
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'days'+'<br/>'+
                        errorText;
                }
            },
            legend: {
                enabled:false
            },
            plotOptions:{
                series: {
                    shadow: false,
                    lineWidth:1,
                    states: {
                        hover: {
                            enabled:true,
                            lineWidth:1
                        }
                    },
                    marker: {
                        enabled:true,
                        symbol:'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    },
                }
            },
            xAxis: {
                lineWidth:0,
                tickColor:'#999',
            },
            yAxis: {
                tickPositions:[14.27,21.87,29.46,37.06,44.66,52.66,59.85],
                plotLines:[{
                    value:14.27,
                    color:'rgba(162,29,33,.75)',
                    width:1,
                    zIndex:3
                },{
                    value:37.06,
                    color:'rgba(24,90,169,.75)',
                    width:1,
                    zIndex:3
                },{
                    value:59.85,
                    color:'rgba(162,29,33,.75)',
                    width:1,
                    zIndex:3
                }],
                title: {text: ''},
                lineWidth:0,
                gridLineWidth:1,
                gridLineColor:'rgba(24,90,169,.25)',
                lineWidth:0,
                startOnTick:false,
                endOnTick:false,
                minPadding:0,
                maxPadding:0,
                min:6.6713193144352,
                max:67.451129665157,
            },
            series: [{
                name:'Measure',
                data:[36,30,30,39,33,42,33,33,38,31,23,31,40,25,28,29,
                    {y:29,error:'4 or more consecutive points below 1 sigma of mean',marker:{symbol:'diamond',fillColor:'#f00',lineColor:'#f00',radius:4,states:{hover:{fillColor:'#f00',lineColor:'#f00',radius:5}}}},
                    30,28,30,34,
                    {y:36,error:'9 or more consecutive points below mean',marker:{symbol:'diamond',fillColor:'#f00',lineColor:'#f00',radius:4,states:{hover:{fillColor:'#f00',lineColor:'#f00',radius:5}}}},
                    {y:30,error:'9 or more consecutive points below mean',marker:{symbol:'diamond',fillColor:'#f00',lineColor:'#f00',radius:4,states:{hover:{fillColor:'#f00',lineColor:'#f00',radius:5}}}}, 38,36,29,37,34,34,29,39,31,35,37,50,35,42,46,38,35,50,35,35,36,36,30,34,38,35,42,46],
            }]
        });

    },
    redrawDist: function() {

        var avr = this.getAver();

        $('#' + gu.id('chartDist1')).highcharts({
            chart: {

            },
            title: {
                text: '평균: ' + Ext.util.Format.number(avr, '0,00.0000/i')
            },

            xAxis: [{
                title: {
                    text: ''
                },
                alignTicks: false
            }, {
                title: {
                    text: ''
                },
                alignTicks: false,
                opposite: true
            }],

            yAxis: [{
                title: { text: '' }
            }, {
                title: { text: '' },
                opposite: true
            }],

            series: [{
                name: 'Bell curve',
                type: 'bellcurve',
                xAxis: 1,
                yAxis: 1,
                baseSeries: 1,
                zIndex: -1
            }, {
                name: 'Data',
                type: 'scatter',
                data: this.sizeData,
                marker: {
                    radius: 3
                }
            }]
        });
    },

    getAver: function() {
        var sum = 0;
        var cnt = 0;
        for(var i=0;i < this.sizeData.length; i++) {
            if(this.sizeData[i]>0) {
                sum = sum + this.sizeData[i];
                cnt++;
            }

        }
        return sum/cnt;
    },

    redrawHistDetail: function() {

        var avr = this.getAver();

        $('#' + gu.id('chartHist1')).highcharts({
            title: {
                text: '평균: ' + Ext.util.Format.number(avr, '0,00.0000/i')
            },

            xAxis: [{
                title: { text: '' },
                alignTicks: false
            }, {
                title: { text: '' },
                alignTicks: false,
                opposite: true
            }],

            xAxis: [{
                title: {
                    text: ''
                },
                alignTicks: false
            }, {
                title: {
                    text: ''
                },
                alignTicks: false,
                opposite: true
            }],

            yAxis: [{
                title: { text: '' }
            }, {
                title: { text: '' },
                opposite: true
            }],
            plotOptions: {
                series: {
                    // general options for all series
                },
                histogram: {
                    //binsNumber: 100,
                    cropThreshold:500,
                    depth:250
                },
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }

            },
            series: [{
                name: '히스토그램',
                type: 'histogram',
                xAxis: 1,
                yAxis: 1,
                baseSeries: gu.id('s1'),
                zIndex: -1
            }, {
                name: 'Data',
                type: 'scatter',
                data: this.sizeData,
                id: gu.id('s1'),
                marker: {
                    radius: 3
                }
            }]
        });
    },
    redrawHistOveral: function() {
        console_logs('redrawHistOveral', 'in');
        var avr = 'Average=0.2202, '
            + 'Max=0.2214, '
            + 'Min=0.2190, '
            + 'Std=0.0005, '
            + 'Cpk=3.25'

        $('#' + gu.id('chartHist2')).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: avr
            },
            xAxis: {
                categories: [
                    '0.212',
                    '0.213',
                    '0.214',
                    '0.215',
                    '0.216',
                    '0.217',
                    '0.218',
                    '0.219',
                    '0.220',
                    '0.221',
                    '0.222',
                    '0.223',
                    '0.224',
                    '0.225',
                    '0.226',
                    '0.227',
                    '0.228'
                ],
                // crosshair: true,
                // alignTicks: false
                //  ,
                plotLines: [{
                    value: 3,
                    color: 'red',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: '0.215 mm'
                    }
                }, {
                    value: 8.3,
                    color: 'black',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: '0.2202 mm'
                    }
                }, {
                    value: 13,
                    color: 'red',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: '0.225 mm'
                    }
                }]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Hit (개)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'SIZE',
                data: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    67,
                    125,
                    7,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ]

            }]
        });
    },
    redrawContent: function() {
        console_logs('curTabname', this.curTabname);
        switch(this.curTabname) {
            case 'DATA':
                break;
            case '히스토그램':
                this.redrawHistDetail();
                break;
            case '정규분포':
                this.redrawDist();
                break;
            case 'Xbar-R 관리도':
                this.redrawSpc();
                break;
            case '분석표':
                break;
            case '파일 업로드':
                break;
        }
    },
    ingredientData :
    'LOTNO	Size	CPK	Ag	Cu	Sb	Bi	Zn	Pb	Fe	Al	As	Cd	Ni	M.P	비중	백색도	성형온도	황색도\n'
    +'MI19061221001I	0.1908	3.85 	1.23	0.52	0.0053	0.0004	0.0005	0.0058	0.0023	0.0001	0.0005	0.0001 	0.053\n'
    +'MI19061221002I	0.1904	2.03 	1.23	0.52	0.0064	0.0002	0.0004	0.0054	0.0029	0.0001	0.0005	0.0001 	0.053\n'
    +'MI19061222003I	0.1898	3.58 	1.22	0.52	0.0062	0.0003	0.0007	0.0055	0.0031	0.0001	0.0005	0.0001 	0.052\n'
    +'MI19061223004I	0.1907	3.39 	1.22	0.52	0.0063	0.0002	0.0006	0.0048	0.0030	0.0001	0.0005	0.0001 	0.052\n'
    +'MI19061226005I	0.1906	3.87 	1.19	0.53	0.0061	0.0002	0.0004	0.0046	0.0030	0.0001	0.0005	0.0001 	0.052\n'
    +'MI19061227006I	0.1907	2.00 	1.20	0.52	0.0061	0.0002	0.0004	0.0047	0.0029	0.0001	0.0005	0.0001 	0.051	219.1	7.34	73.2	0	2.97\n'
    +'MI19061227007I	0.1903	2.77 	1.18	0.52	0.0042	0.0010	0.0006	0.0087	0.0027	0.0001	0.0005	0.0001 	0.051	218.7	7.33	74.2	0	2.96\n'
    +'MI19070207008I	0.1903	4.00 	1.20	0.50	0.0042	0.0010	0.0005	0.0087	0.0024	0.0001	0.0005	0.0001 	0.051	218.7	7.33	74.3	0	3.02\n'
    +'MI19070207009I	0.1898	3.28 	1.20	0.51	0.0041	0.0018	0.0005	0.0120	0.0020	0.0001	0.0005	0.0001 	0.053	218.7	7.33	73.9	0	3.00\n'
    +'MI19070208010I	0.1908	2.68 	1.18	0.52	0.0040	0.0011	0.0005	0.0083	0.0017	0.0001	0.0005	0.0001 	0.053	217.7	7.34	74.3	0	2.93\n'
    +'MI19070227011I	0.1901	2.88 	1.17	0.54	0.0040	0.0015	0.0006	0.0100	0.0016	0.0001	0.0005	0.0001 	0.054	217.7	7.34	74.6	0	2.90\n'
    +'MI19070228012I	0.1906	4.24 	1.17	0.53	0.0039	0.0011	0.0006	0.0081	0.0018	0.0001	0.0005	0.0001 	0.053	217.7	7.34	74.6	0	2.90\n'
    +'MI19070301013I	0.1905	3.69 	1.18	0.54	0.0040	0.0009	0.0008	0.0073	0.0021	0.0001	0.0005	0.0001 	0.053	217.7	7.34	74.6	0	2.90\n'
    +'MI19070301014I	0.1904	2.03 	1.18	0.53	0.0038	0.0003	0.0006	0.0053	0.0022	0.0001	0.0005	0.0001 	0.052	219.0	7.33	74.4	0	2.95\n'
    +'MI19070420015I	0.1908	3.09 	1.22	0.51	0.0047	0.0013	0.0005	0.0091	0.0040	0.0001	0.0005	0.0001 	0.049	218.5	7.33	74.0	0	2.91\n'
    +'MI19070420016I	0.1908	3.21 	1.21	0.52	0.0046	0.0013	0.0006	0.0089	0.0033	0.0001	0.0005	0.0001 	0.049	218.5	7.33	74.5	0	2.92\n'
    +'MI19070421017I	0.1905	3.13 	1.23	0.51	0.0045	0.0015	0.0005	0.0091	0.0041	0.0001	0.0005	0.0001 	0.049	218.1	7.34	74.5	0	2.97\n'
    +'MI19070425018I	0.1907	2.21 	1.22	0.52	0.0050	0.0015	0.0006	0.0075	0.0040	0.0001	0.0005	0.0001 	0.051	218.1	7.34	74.5	0	3.06\n'
    +'MI19070426019I	0.1904	2.75 	1.19	0.52	0.0065	0.0015	0.0003	0.0077	0.0033	0.0001	0.0005	0.0001 	0.053	218.1	7.34	74.5	0	3.07\n'
    +'MI19070427020I	0.1897	2.28 	1.23	0.52	0.0063	0.0015	0.0003	0.0074	0.0032	0.0001	0.0005	0.0001 	0.053	218.1	7.34	73.5	0	3.01\n'
    +'MI19070515021I	0.1898	3.15 	1.21	0.52	0.0066	0.0034	0.0003	0.0161	0.0033	0.0001	0.0005	0.0001 	0.052	217.7	7.33	73.2	0	2.99\n'
    +'MI19070515022I	0.1900	4.33 	1.21	0.52	0.0067	0.0040	0.0003	0.0162	0.0030	0.0001	0.0005	0.0001 	0.052	217.7	7.33	73.9	0	3.02\n'
    +'MI19070516023I	0.1896	2.90 	1.20	0.51	0.0069	0.0033	0.0002	0.0175	0.0029	0.0001	0.0005	0.0001 	0.054	217.7	7.33	74.5	0	3.04\n'
    +'MI19070517024I	0.1905	2.06 	1.22	0.50	0.0059	0.0014	0.0003	0.0139	0.0026	0.0001	0.0005	0.0001 	0.051	217.8	7.33	73.9	0	3.07\n'
    +'MI19070620025I	0.1907	2.52 	1.22	0.51	0.0060	0.0015	0.0005	0.0150	0.0039	0.0001	0.0005	0.0001 	0.050	217.8	7.33	73.5	0	3.08\n'
    +'MI19070620026I	0.1905	2.19 	1.20	0.53	0.0056	0.0014	0.0004	0.0097	0.0025	0.0001	0.0005	0.0001 	0.049	218.9	7.33	73.9	0	3.04\n'
    +'MI19070630027I	0.1906	2.22 	1.21	0.54	0.0053	0.0018	0.0004	0.0114	0.0035	0.0001	0.0005	0.0001 	0.052	218.8	7.33	73.4	0	3.04\n'
    +'MI19070731028I	0.1904	3.91 	1.22	0.51	0.0053	0.0015	0.0004	0.0140	0.0034	0.0001	0.0005	0.0001 	0.052	219.0	7.33	73.2	0	3.04\n'
    +'MI19070801029I	0.1906	3.97 	1.22	0.51	0.0053	0.0017	0.0004	0.0179	0.0034	0.0001	0.0005	0.0001 	0.052	219.0	7.33	73.9	0	3.07\n'
    +'MI19070801030I	0.1902	3.75 	1.24	0.52	0.0053	0.0018	0.0004	0.0189	0.0034	0.0001	0.0005	0.0001 	0.053	219.0	7.33	74.5	0	3.10\n'
    +'MI19070802031I	0.1900	3.30 	1.22	0.51	0.0070	0.0022	0.0004	0.0169	0.0019	0.0001	0.0005	0.0001 	0.053	218.0	7.33	74.5	0	3.08\n'
    +'MI19070828032I	0.1902	3.26 	1.22	0.54	0.0065	0.0033	0.0005	0.0193	0.0034	0.0001	0.0005	0.0001 	0.054	218.5	7.34	74.5	0	3.07\n'
    +'MI19070829033I	0.1899	3.22 	1.21	0.55	0.0061	0.0037	0.0005	0.0213	0.0036	0.0001	0.0005	0.0001 	0.054	218.5	7.34	74.5	0	3.07\n'
    +'MI19070830034I	0.1905	2.55 	1.21	0.52	0.0051	0.0050	0.0004	0.0222	0.0036	0.0001	0.0005	0.0001 	0.051	219.0	7.33	74.4	0	3.12\n'
    +'MI19070919035I	0.1903	3.01 	1.21	0.51	0.0052	0.0049	0.0005	0.0226	0.0040	0.0001	0.0005	0.0001 	0.050	219.0	7.33	74.3	0	3.13\n'
    +'MI19070919036I	0.1894	2.95 	1.23	0.49	0.0051	0.0050	0.0006	0.0224	0.0043	0.0001	0.0005	0.0001 	0.050	219.0	7.33	74.3	0	3.13\n'
    +'MI19070920037I	0.1905	2.09 	1.22	0.50	0.0054	0.0027	0.0007	0.0159	0.0036	0.0001	0.0005	0.0001 	0.050	218.5	7.33	74.1	0	2.96\n'
    +'MI19071011038I	0.1902	4.22 	1.21	0.52	0.0054	0.0032	0.0006	0.0212	0.0025	0.0001	0.0005	0.0001 	0.051	219.1	7.33	73.9	0	2.89\n'
    +'MI19071019039I	0.1897	2.47 	1.21	0.52	0.0054	0.0032	0.0006	0.0212	0.0025	0.0001	0.0005	0.0001 	0.051	219.1	7.33	73.7	0	2.92\n'
    +'MI19071019040I	0.1904	3.85 	1.23	0.53	0.0054	0.0032	0.0007	0.0214	0.0026	0.0001	0.0005	0.0001 	0.052	219.1	7.33	73.6	0	2.96\n'
    +'MI19071020041I	0.1900	2.84 	1.21	0.53	0.0053	0.0032	0.0008	0.0210	0.0028	0.0001	0.0005	0.0001 	0.052	219.1	7.33	73.6	0	2.96\n'
    +'MI19071024042I	0.1904	3.39 	1.22	0.52	0.0050	0.0029	0.0003	0.0215	0.0022	0.0001	0.0005	0.0001 	0.051	219.1	7.33	74.2	0	2.97\n'
    +'MI19071024043I	0.1910	2.42 	1.21	0.52	0.0055	0.0037	0.0003	0.0207	0.0031	0.0001	0.0005	0.0001 	0.053	219.1	7.33	73.6	0	3.14\n'
    +'MI19071129044I	0.1907	2.86 	1.17	0.51	0.0053	0.0039	0.0003	0.0210	0.0029	0.0001	0.0005	0.0001 	0.053	219.1	7.33	73.4	0	3.18\n'
    ,
    sizeData : [
        0.2204	,
        0.2204	,
        0.2205	,
        0.2214	,
        0.2203	,
        0.2191	,
        0.2199	,
        0.2203	,
        0.2208	,
        0.22	,
        0.2199	,
        0.22	,
        0.2204	,
        0.2207	,
        0.2196	,
        0.2207	,
        0.2208	,
        0.2206	,
        0.2208	,
        0.2207	,
        0.2202	,
        0.2197	,
        0.2202	,
        0.2204	,
        0.2204	,
        0.2195	,
        0.2206	,
        0.2197	,
        0.2206	,
        0.2213	,
        0.2204	,
        0.2214	,
        0.2202	,
        0.2211	,
        0.2205	,
        0.2201	,
        0.2207	,
        0.2208	,
        0.2206	,
        0.2201	,
        0.2211	,
        0.2205	,
        0.2201	,
        0.2198	,
        0.22	,
        0.2201	,
        0.2198	,
        0.2201	,
        0.2206	,
        0.2202	,
        0.2198	,
        0.2206	,
        0.22	,
        0.2204	,
        0.2198	,
        0.2199	,
        0.2201	,
        0.2199	,
        0.2203	,
        0.2199	,
        0.2202	,
        0.2203	,
        0.2198	,
        0.2198	,
        0.2208	,
        0.2206	,
        0.2204	,
        0.2199	,
        0.2204	,
        0.2201	,
        0.2205	,
        0.2208	,
        0.2193	,
        0.2203	,
        0.2207	,
        0.2199	,
        0.2194	,
        0.221	,
        0.2198	,
        0.2213	,
        0.2197	,
        0.2205	,
        0.2196	,
        0.2204	,
        0.22	,
        0.2206	,
        0.2204	,
        0.2207	,
        0.2203	,
        0.2199	,
        0.2209	,
        0.2198	,
        0.2202	,
        0.2193	,
        0.2204	,
        0.2198	,
        0.2199	,
        0.22	,
        0.2196	,
        0.2202	,
        0.2204	,
        0.2196	,
        0.221	,
        0.2196	,
        0.2203	,
        0.2197	,
        0.2193	,
        0.2203	,
        0.2204	,
        0.2197	,
        0.2196	,
        0.2203	,
        0.2209	,
        0.2196	,
        0.2207	,
        0.2204	,
        0.2197	,
        0.2205	,
        0.2191	,
        0.2207	,
        0.2197	,
        0.2195	,
        0.2205	,
        0.2202	,
        0.2199	,
        0.2198	,
        0.2208	,
        0.2206	,
        0.2199	,
        0.219	,
        0.2205	,
        0.2203	,
        0.2208	,
        0.2206	,
        0.2209	,
        0.2207	,
        0.2196	,
        0.2206	,
        0.2202	,
        0.2207	,
        0.2204	,
        0.221	,
        0.2207	,
        0.2196	,
        0.2204	,
        0.2204	,
        0.2198	,
        0.2196	,
        0.2198	,
        0.2197	,
        0.2199	,
        0.2206	,
        0.2202	,
        0.2208	,
        0.2199	,
        0.2201	,
        0.2207	,
        0.221	,
        0.2205	,
        0.221	,
        0.2207	,
        0.2203	,
        0.2204	,
        0.2203	,
        0.2199	,
        0.2196	,
        0.2203	,
        0.2209	,
        0.2201	,
        0.2201	,
        0.2197	,
        0.2204	,
        0.2207	,
        0.2191	,
        0.2193	,
        0.2206	,
        0.2204	,
        0.2207	,
        0.2201	,
        0.22	,
        0.2201	,
        0.2206	,
        0.2206	,
        0.2192	,
        0.2203	,
        0.2202	,
        0.2212	,
        0.2194	,
        0.2202	,
        0.2207	,
        0.2201	,
        0.2202	,
        0.2204	,
        0.2202	,
        0.2194	,
        0.2202	,
        0.2208	,
        0.2209	,
        0.2199	,
        0.2208
    ]

});
