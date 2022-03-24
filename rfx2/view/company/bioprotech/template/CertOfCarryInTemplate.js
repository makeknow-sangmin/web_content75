Ext.define('Rfx2.view.company.bioprotech.template.CertOfCarryInTemplate', {
        extend: 'Ext.XTemplate',
        constructor: function (config) {

            Ext.apply(this, config);

            this.callParent([`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
</head>
<style>
    .sequenceValue {
        text-align: center;
    }

    .numberValue {
        text-align: right;
    }

    .centerValue {
        text-align: center;
    }

    table, th, td {
        font-size: 12px;
    }

    #centerTable th, td {
        height: 20px;
    }

    #footerTable td {
        border: 0px !important;
    }

    #outerTable .outerCell {
        border: 0px !important;
    }
</style>
<body>

<table id="outerTable">
    <tr>
        <td class="outerCell">
            <table id="centerTable" border="1" style="border-collapse:collapse;">
                <colgroup>
                    <col width="80"/>
                    <col width="40"/>
                    <col width="40"/>
                    <col width="120"/>
                    <col width="120"/>
                    <col width="100"/>
                    <col width="60"/>
                    <col width="60"/>
                    <col width="80"/>
                    <col width="100"/>
                </colgroup>
                <tr>
                    <td colspan="3">반입일자</td>
                    <td colspan="2">{gr_date}</td>
                    <td class="centerValue">반입처</td>
                    <td colspan="4">{seller_name}</td>
                </tr>
                <tr class="centerValue">
                    <td>No</td>
                    <td colspan="2">Code</td>
                    <td>품명</td>
                    <td>규격</td>
                    <td>Lot No.</td>
                    <td>수량</td>
                    <td>단위</td>
                    <td>PO No.</td>
                    <td>비고</td>
                </tr>
                <!-- 반복시작 -->
                <tr>
                <tpl for="itemValues">
                    <tr>
                        <td class="sequenceValue">{num}</td>
                        <td colspan="2">{item_code}</td>
                        <td class="centerValue">{item_name}</td>
                        <td>{specification}</td>
                        <td class="centerValue">{lot_no}</td>
                        <td class="numberValue">{gr_quan}</td>
                        <td>{unit_code}</td>
                        <td>{po_no}</td>
                        <td></td>
                    </tr>
                </tpl>
                <!--반복종료-->
                <tr>
                    <td colspan="10">품질관리팀 검토사항</td>
                </tr>
                <tr>
                    <td colspan="2">검사 구분</td>
                    <td colspan="5">□전수 □샘플링 □무검사</td>
                    <td rowspan="2" class="centerValue">종<br/><br/>합<br/><br/>판<br/><br/>정</td>
                    <td rowspan="2" colspan="2">□합격<br/><br/>□불합격</td>
                </tr>
                <tr>
                    <td colspan="2">검사 방법 및 절차</td>
                    <td colspan="5">
                        1. 각 원자재 수입검사 기준서의 검사 수준을 반드시 확인하고 검사할 것<br/>
                        2. 검사 및 시험 절차서(BPP-Q-101)의 검사구분 절차에 의거하여 진행할 것<br/>
                        3. 부적합 발생 시, ISO 13485:2016의 부적합품 관리(BPP-Q-131)절차에 따를 것
                    </td>
                </tr>
                <tr>
                    <td colspan="2">요청 사항</td>
                    <td colspan="8"><!--(내용)--></td>
                </tr>
            </table>
            <table>
                <tr>
                    <td class="outerCell" >
                        <table id="footerTable">
                            <colgroup>
                                <col width="100"/>
                                <col width="700"/>
                                <col width="100"/>
                            </colgroup>
                            <tr>
                                <td>PQ-151-1</td>
                                <td class="centerValue">(주)바이오 프로테크</td>
                                <td>Rev.5</td>
                            </tr>
                        </table>
                    </td>
                <tr>
            </table>
        </td>
    </tr>
</table>


</body>
</html>`], {compiled: true});
        }
    }
)
;