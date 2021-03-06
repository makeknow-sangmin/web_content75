Ext.define('Mplm.store.SpcChartColumnStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ 'code', 'name'
	],
	hasNull: false,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
    data : [
        {"code":"Line1_1", "name":"1 Line 1th"},
        {"code":"Line1_2", "name":"1 Line 2th"},
        {"code":"Defect1", "name":"1차 Defect"},
        {"code":"Tense1", "name":"1축"},
        {"code":"Line2_1", "name":"2 Line 1th"},
        {"code":"Line2_2", "name":"2 Line 2th"},
        {"code":"Tense2", "name":"2축"},
        {"code":"Line3_1", "name":"3 Line 1th"},
        {"code":"Line3_2", "name":"3 Line 2th"},
        {"code":"Tense3", "name":"3축"},
        {"code":"Line4_1", "name":"4 Line 1th"},
        {"code":"Line4_2", "name":"4 Line 2th"},
        {"code":"Tense4", "name":"4축"},
        {"code":"Line5_1", "name":"5 Line 1th"},
        {"code":"Line5_2", "name":"5 Line 2th"},
        {"code":"LineAg_1", "name":"Ag Line 1th"},
        {"code":"LineAg_2", "name":"Ag Line 2th"},
        {"code":"AirBlow", "name":"AIR BLOW 작동/접촉"},
        {"code":"BL", "name":"B/L"},
        {"code":"Bath", "name":"BATH WIRE 조각"},
        {"code":"Capstan", "name":"CAPSTAN이탈/회전"},
        {"code":"avgCuO", "name":"CuO 평균"},
        {"code":"avgCuO2", "name":"CuO2 평균"},
        {"code":"Curl", "name":"Curl"},
        {"code":"avgCuS", "name":"CuS 평균"},
        {"code":"Defect", "name":"Defect"},
        {"code":"DiesCode_Check", "name":"Dies Code확인"},
        {"code":"EL", "name":"E/L"},
        {"code":"FinalDies_Check", "name":"Final Dies 확인"},
        {"code":"Gas_Forming", "name":"Forming Gas"},
        {"code":"Gas_Cooling", "name":"Gas(냉각)"},
        {"code":"Gas_Heater", "name":"Gas(열처리)"},
        {"code":"Guide", "name":"Guide봉 (wire상태)"},
        {"code":"Mean", "name":"Mean"},
        {"code":"Reduction", "name":"Reduction"},
        {"code":"RMS_Check", "name":"RMS 센서"},
        {"code":"Roller_Check", "name":"Roller 이상"},
        {"code":"Surface", "name":"Wire Surface"},
        {"code":"WireVibration", "name":"Wire 떨림"},
        {"code":"WireContact", "name":"WIRE 접촉"},
        {"code":"DryTemper", "name":"건조로 온도"},
        {"code":"DryHeater", "name":"건조히터 온도"},
        {"code":"F_Length", "name":"길이"},
        {"code":"Dipping", "name":"냉각수 Dipping"},
        {"code":"AusDRCon", "name":"단독 농도(AusDR)"},
        {"code":"sDRCon", "name":"단독 농도(sDR)"},
        {"code":"AusDRTemper", "name":"단독 온도(AusDR)"},
        {"code":"sDRTemper", "name":"단독 온도(sDR)"},
        {"code":"Dipping", "name":"세척수 DIPPING"},
        {"code":"Speed", "name":"속도"},
        {"code":"Vertical", "name":"수직입사/처짐방지(WIRE 상태)"},
        {"code":"Humid", "name":"습도"},
        {"code":"AucDRCon", "name":"신선(1차) 농도(AucDR)"},
        {"code":"AgcDRCon", "name":"신선(1차) 농도(AgcDR)"},
        {"code":"cDRCon", "name":"신선(1차) 농도(cDR)"},
        {"code":"AucDRTemper", "name":"신선(1차) 온도(AucDR)"},
        {"code":"AgcDRTemper", "name":"신선(1차) 온도(AgcDR)"},
        {"code":"cDRCon", "name":"신선(1차) 온도(cDR)"},
        {"code":"cFAEDRCon", "name":"신선(FAE) 농도"},
        {"code":"cFAEDRTemper", "name":"신선(FAE) 온도"},
        {"code":"cDR2Con", "name":"신선(중앙) 농도"},
        {"code":"cDR2Temper", "name":"신선(중앙) 온도"},
        {"code":"DROil", "name":"신선유 (수직입사)"},
        {"code":"Temper", "name":"온도"},
        {"code":"Temper1", "name":"온도(상/좌)"},
        {"code":"Temper2", "name":"온도(중)"},
        {"code":"Temper3", "name":"온도(하/우)"},
        {"code":"Tense", "name":"장력"},
        {"code":"Size", "name":"직경"},
        {"code":"Curl", "name":"직진성 확인"},
        {"code":"UltraPure", "name":"초순수"},
        {"code":"UltraPureTemper", "name":"초순수 온도"}
    ]
});