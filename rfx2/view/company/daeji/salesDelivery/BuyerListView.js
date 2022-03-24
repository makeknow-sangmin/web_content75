Ext.define('Rfx2.view.company.daeji.salesDelivery.BuyerListView', {
    extend: 'Rfx2.base.company.daeji.BaseView',
    xtype: 'buyer-list-view',
    initComponent: function () {

        this.initSearchField();

        let searchToolbar = this.createSearchToolbar();
        let buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.BuyerList', [{
                property: 'create_date',
                direction: 'DESC'
            }], gm.pageSize, {}, ['combst']
        );

        this.createGrid([buttonToolbar, searchToolbar]);

        this.propertyGridLefts = [];
        this.propertyGridRights = [];
        let propertyLefts = [];
        let propertyRights = [];
        this.infos = [];
        let infosName = ['업체정보', '거래정보', '정산정보'];

        let tabPanel = Ext.create('Ext.tab.Panel', {
            width: 400,
            height: 400,
            renderTo: document.body,
            items: []
        });

        propertyLefts.push({
            "업체구분": "매출",
            "사업자등록번호": "396-48-00238",
            "소속코드": "A0",
            "고유코드": "1001",
            "업체코드": "A01001",
            "대표자명": "홍길동",
            "업태": "제조업",
            "전화번호": "033-000-0000",
            "본사주소": "강원도 홍천군 사면",
            "지점주소": "강원도 홍천군 사면",
            "이메일1": "hello@pkgns.com",
            "웹주소": "www.pkgns.com"
        });

        propertyLefts.push({
            "영업구분": "농업법인",
            "주거래품목": "박스",
            "거래시작일": "44470",
            "거래담당자": "김길자",
            "핸드폰번호": "010-000-0000",
            "입사연도": "41642",
            "이메일주소": "jang4798@pkgns.com",
            "근무지주소": "강원도 홍천구 서면",
            "영업담당자": "박세웅",
            "영업시작일": "44440",
            "물류구분": "납품",
            "물류지역": "강원홍천"
        });

        propertyLefts.push({
            "자료구분": "과세",
            "결제일수": "5일",
            "증빙서류": "전자세금계산서",
            "선수금액": "0원",
            "거래액/월": "50000원",
            "거래량/월": "10000m2",
            "박스비중": "0.7",
            "거래관리등급": "B"
        });

        propertyRights.push({
            "사업자등록증": "URL",
            "소속명": "없음",
            "고유명": "법인",
            "업체명": "김길영농장",
            "주민등록번호": "871223-2121152",
            "종목": "과수재배",
            "팩스번호": "033-000-0000",
            "우편번호": "11111",
            "우편번호": "11111",
            "이메일2": "jang4798@pkgns.com",
            "업체사진": "URL"
        });

        propertyRights.push({
            "0": "0",
            "부거래품목": "쇼핑백",
            "거래종료일": "-",
            "직책": "전무",
            "사무실번호": "033-000-0000",
            "퇴사연도": "-",
            "0": "0",
            "상세주소": "1층",
            "직책": "차장",
            "나무파렛가능": "유",
            "물류코드": "15",
            "차량진입톤수": "5톤불가"
        });

        propertyRights.push({
            "마감일자": "익월말일",
            "수신메일": "jang4798@pkgns.com",
            "미수금액": "0원",
            "거래액/연": "5000000원",
            "거래량/연": "120000m2",
            "기타비중": "0.3",
            "제품마진율": "0.2"
        });

        for (let i = 0; i < 3; i++) {
            this.propertyGridLefts.push(
                Ext.create('Ext.grid.property.Grid', {
                    width: '50%',
                    hideHeaders: true,
                    frame: false,
                    source: propertyLefts[i]
                })
            );

            this.propertyGridRights.push(
                Ext.create('Ext.grid.property.Grid', {
                    width: '50%',
                    hideHeaders: true,
                    frame: false,
                    source: propertyRights[i]
                })
            );
        }

        for (let i = 0; i < 3; i++) {
            tabPanel.insert(
                i,
                {
                    title: infosName[i],
                    collapsible: false,
                    frame: true,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    items: [this.propertyGridLefts[i], this.propertyGridRights[i]]
                }
            );
        }

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    autoScroll: true,
                    layout: {
                        type: 'fit'
                    },
                    margin: '5 0 0 0',
                    width: '65%',
                    items: [this.grid]
                },
                // this.crudTab,
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    autoScroll: true,
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '45%',
                    items: tabPanel
                }
            ]
        });

        this.callParent(arguments);

        gm.setCenterLoading(false);

        this.store.load();
    }
});
