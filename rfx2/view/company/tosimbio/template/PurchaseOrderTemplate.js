Ext.define('Rfx2.view.company.bioprotech.template.PurchaseOrderTemplate', {
        extend: 'Ext.Template',
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

    #nameTable td, #headerTable td {
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
            <table id="nameTable" style="margin: auto;">
                <tr>
                    <td width="300" style="font-size: 30px; text-align: center"><b><u>발 주 서</u></b></td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td class="outerCell">
            <table id="headerTable" style="margin: auto;">
                <colgroup>
                    <col width="70"/>
                    <col width="250"/>
                    <col width="50"/>
                    <col width="60"/>
                    <col width="140"/>
                    <col width="70"/>
                    <col width="110"/>
                </colgroup>
                <tr>
                    <td>발주번호</td>
                    <td>{po_no}</td>
                    <td></td>
                    <td colspan="4">강원도 원주시 문막읍 동화공단로 151-3</td>
                </tr>
                <tr>
                    <td>수신처</td>
                    <td class="centerValue">{supplier_name}</td>
                    <td>귀중</td>
                    <td colspan="4">동화첨단의료기기산업단지</td>
                </tr>
                <tr>
                    <td>Tel)</td>
                    <td class="centerValue">{sales_tel_no}</td>
                    <td></td>
                    <td colspan="4">(주)바이오프로테크 관 리 본 부</td>
                </tr>
                <tr>
                    <td>Fax)</td>
                    <td class="centerValue">{sales_fax_no}</td>
                    <td></td>
                    <td colspan="4">Tel) 033-735-7720 FAX) 033-735-7736</td>
                </tr>
                <tr>
                    <td>담당자</td>
                    <td>{sales_person_name}</td>
                    <td>귀하</td>
                    <td>담당자:</td>
                    <td>{po_user_name}</td>
                    <td>발주일:</td>
                    <td class="centerValue">{aprv_date}</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td class="outerCell">
            <table id="centerTable" border="1" style="border-collapse:collapse;">
                <colgroup>
                    <col width="50"/>
                    <col width="40"/>
                    <col width="80"/>
                    <col width="60"/>
                    <col width="40"/>
                    <col width="60"/>
                    <col width="40"/>
                    <col width="40"/>
                    <col width="60"/>
                    <col width="50"/>
                    <col width="50"/>
                    <col width="30"/>
                    <col width="30"/>
                    <col width="40"/>
                    <col width="110"/>
                </colgroup>
                <tr>
                    <th rowspan="2">No.</th>
                    <th rowspan="2" colspan="4">품명</th>
                    <th rowspan="2" colspan="3">규격</th>
                    <th rowspan="2">단위</th>
                    <th rowspan="2" colspan="2">수량</th>
                    <th colspan="4">가격</th>
                </tr>
                <tr>
                    <th colspan="3">단가</th>
                    <th>금액</th>
                </tr>
                <tr>
                    <td class="sequenceValue">1</td>
                    <td colspan="4">{item_name_01}</td>
                    <td colspan="3">{specification_01}</td>
                    <td>{unit_code_01}</td>
                    <td colspan="2" class="numberValue">{quan_01}</td>
                    <td colspan="3" class="numberValue">{sales_price_01}</td>
                    <td class="numberValue">{total_price_01}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">2</td>
                    <td colspan="4">{item_name_02}</td>
                    <td colspan="3">{specification_02}</td>
                    <td>{unit_code_02}</td>
                    <td colspan="2" class="numberValue">{quan_02}</td>
                    <td colspan="3" class="numberValue">{sales_price_02}</td>
                    <td class="numberValue">{total_price_02}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">3</td>
                    <td colspan="4">{item_name_03}</td>
                    <td colspan="3">{specification_03}</td>
                    <td>{unit_code_03}</td>
                    <td colspan="2" class="numberValue">{quan_03}</td>
                    <td colspan="3" class="numberValue">{sales_price_03}</td>
                    <td class="numberValue">{total_price_03}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">4</td>
                    <td colspan="4">{item_name_04}</td>
                    <td colspan="3">{specification_04}</td>
                    <td>{unit_code_04}</td>
                    <td colspan="2" class="numberValue">{quan_04}</td>
                    <td colspan="3" class="numberValue">{sales_price_04}</td>
                    <td class="numberValue">{total_price_04}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">5</td>
                    <td colspan="4">{item_name_05}</td>
                    <td colspan="3">{specification_05}</td>
                    <td>{unit_code_05}</td>
                    <td colspan="2" class="numberValue">{quan_05}</td>
                    <td colspan="3" class="numberValue">{sales_price_05}</td>
                    <td class="numberValue">{total_price_05}</td>
                </tr>
                <tr>
                <tr>
                    <td class="sequenceValue">6</td>
                    <td colspan="4">{item_name_06}</td>
                    <td colspan="3">{specification_06}</td>
                    <td>{unit_code_06}</td>
                    <td colspan="2" class="numberValue">{quan_06}</td>
                    <td colspan="3" class="numberValue">{sales_price_06}</td>
                    <td class="numberValue">{total_price_06}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">7</td>
                    <td colspan="4">{item_name_07}</td>
                    <td colspan="3">{specification_07}</td>
                    <td>{unit_code_07}</td>
                    <td colspan="2" class="numberValue">{quan_07}</td>
                    <td colspan="3" class="numberValue">{sales_price_07}</td>
                    <td class="numberValue">{total_price_07}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">8</td>
                    <td colspan="4">{item_name_08}</td>
                    <td colspan="3">{specification_08}</td>
                    <td>{unit_code_08}</td>
                    <td colspan="2" class="numberValue">{quan_08}</td>
                    <td colspan="3" class="numberValue">{sales_price_08}</td>
                    <td class="numberValue">{total_price_08}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">9</td>
                    <td colspan="4">{item_name_09}</td>
                    <td colspan="3">{specification_09}</td>
                    <td>{unit_code_09}</td>
                    <td colspan="2" class="numberValue">{quan_09}</td>
                    <td colspan="3" class="numberValue">{sales_price_09}</td>
                    <td class="numberValue">{total_price_09}</td>
                </tr>
                <tr>
                    <td class="sequenceValue">10</td>
                    <td colspan="4">{item_name_10}</td>
                    <td colspan="3">{specification_10}</td>
                    <td>{unit_code_10}</td>
                    <td colspan="2" class="numberValue">{quan_10}</td>
                    <td colspan="3" class="numberValue">{sales_price_10}</td>
                    <td class="numberValue">{total_price_10}</td>
                </tr>

                <tr>
                    <td colspan="8" class="centerValue" colspan="3">계</td>
                    <td></td>
                    <td colspan="2"></td>
                    <td colspan="3"></td>
                    <td class="numberValue">{total_sum}</td>
                </tr>
                <tr>
                    <td colspan="2" class="centerValue">납기</td>
                    <td class="centerValue" colspan="8">{payment_deadline}</td>
                    <td class="centerValue" colspan="2">물품대</td>
                    <td class="numberValue" colspan="3">{total_sum}</td>
                </tr>
                <tr>
                    <td colspan="2" class="centerValue">지불조건</td>
                    <td class="centerValue" colspan="8">{pay_condition}</td>
                    <td class="centerValue" colspan="2">VAT</td>
                    <td class="numberValue" colspan="3">{total_tax}</td>
                </tr>
                <tr>
                    <td colspan="2" class="centerValue">운송조건</td>
                    <td class="centerValue" colspan="8"></td>
                    <td class="centerValue" colspan="2">계</td>
                    <td class="numberValue" colspan="3">{total_sum_tax}</td>
                </tr>
                <tr>
                    <td colspan="3" class="centerValue">검사방식</td>
                    <td class="centerValue" colspan="12">□전수 검사 □체크 검사 □샘플링검사 □자체성적서첨부</td>
                </tr>
                <tr>
                    <td colspan="3" class="centerValue">검사부서 및 담당자</td>
                    <td class="centerValue" colspan="12">Q.C 제품 담당자</td>
                </tr>
                 <tr>
                    <td rowspan="5" class="centerValue">도면<br/>번호</td>
                    <td class="centerValue">1</td>
                    <td colspan="2">{des_01}</td>
                    <td class="centerValue">6</td>
                    <td colspan="3">{des_06}</td>
                    <td rowspan="5" class="centerValue">수입검사<br/>기준서<br/>번호</td>
                    <td class="centerValue">1</td>
                    <td colspan="3">{iis_01}</td>
                    <td class="centerValue">6</td>
                    <td>{iis_06}</td>
                </tr>
                <tr>
                    <td class="centerValue">2</td>
                    <td colspan="2">{des_02}</td>
                    <td class="centerValue">7</td>
                    <td colspan="3">{des_07}</td>
                    <td class="centerValue">2</td>
                    <td colspan="3">{iis_02}</td>
                    <td class="centerValue">7</td>
                    <td>{iis_07}</td>
                </tr>
                <tr>
                    <td class="centerValue">3</td>
                    <td colspan="2">{des_03}</td>
                    <td class="centerValue">8</td>
                    <td colspan="3">{des_08}</td>
                    <td class="centerValue">3</td>
                    <td colspan="3">{iis_03}</td>
                    <td class="centerValue">8</td>
                    <td>{iis_08}</td>
                </tr>
                <tr>
                    <td class="centerValue">4</td>
                    <td colspan="2">{des_04}</td>
                    <td class="centerValue">9</td>
                    <td colspan="3">{des_09}</td>
                    <td class="centerValue">4</td>
                    <td colspan="3">{iis_04}</td>
                    <td class="centerValue">9</td>
                    <td>{iis_09}</td>
                </tr>
                <tr>
                    <td class="centerValue">5</td>
                    <td colspan="2">{des_05}</td>
                    <td class="centerValue">10</td>
                    <td colspan="3">{des_10}</td>
                    <td class="centerValue">5</td>
                    <td colspan="3">{iis_05}</td>
                    <td class="centerValue">10</td>
                    <td>{iis_10}</td>
                </tr>
                <tr>
                    <td rowspan="2" colspan="2" class="centerValue">비고</td>
                    <td colspan="13">※ 만약 우리 생산공정 또는 완제품의 품질에 영향을 줄 수 있는 어떠한 변경이 있을 경우,
                        BIO PROTECH INC에 사전 통보 및 승인되어야 한다.
                    </td>
                </tr>
                <tr>
                    <td colspan="13" height="200"></td>
                </tr>
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