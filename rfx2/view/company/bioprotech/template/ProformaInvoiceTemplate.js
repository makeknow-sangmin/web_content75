Ext.define('Rfx2.view.company.bioprotech.template.ProformaInvoiceTemplate', {
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
                    font-size: 11px;
                    padding: 1px !important;
                }
            
                #centerTable {
                    border-collapse: collapse;
                    border-spacing: 0;
                }
            
                #centerTable th, td {
                    border: 1px solid;
                    height: 20px;
                }
            
                #subject {
                    height: 40px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 24px;
                }
            
                .bgBlue {
                    background-color: #80D8FF;
                }
            
                .bgGreen {
                    background-color: #CCFF90;
                }
            
                .bgYellow {
                    background-color: #FFFF8D;
                }
            
                .fontBold {
                    font-weight: 600;
                }
            </style>
            <body>
            
            <table id="centerTable">
                <colgroup>
                    <col width="105"/>
                    <col width="115"/>
                    <col width="65"/>
                    <col width="45"/>
                    <col width="45"/>
                    <col width="40"/>
                    <col width="70"/>
                    <col width="75"/>
                    <col width="75"/>
                    <col width="195"/>
                </colgroup>
                <!-- 1 -->
                <tr>
                    <td id="subject" colspan="10">PROFORMA INVOICE</td>
                </tr>
                <!-- 2 -->
                <tr>
                    <td colspan="10">ISSUING COMPANY INFORMATION</td>
                </tr>
                <!-- 3 -->
                <tr>
                    <td>COMPANY NAME</td>
                    <td colspan="9">BIO PROTECH INC.</td>
                </tr>
                <!-- 4 -->
                <tr>
                    <td rowspan="2">ADDRESS</td>
                    <td colspan="9">BPH(BIO PROTECH Head Quarter):Donghwa Medical Instrument Complex, 1654-7 Donghwari, Munmak-eup, Wonju City, Gangwon-do,Korea</td>
                </tr>
                <!-- 5 -->
                <tr>
                    <td colspan="9">BPS(BIO PROTECH SEOUL) Branch. Office:Samye Bldg(4F)57-1 Samseong-dong Gangnam-gu Seoul Korea</td>
                </tr>
                <!-- 6 -->
                <tr>
                    <td>TEL NO</td>
                    <td colspan="5">HQ: 82-33-735-7720<br/>SEOUL Br: 82-2-548-7881</td>
                    <td>FAX NO</td>
                    <td colspan="3">HQ: 82-33-735-7736<br/>SEOUl Br:82-2-548-7881</td>
                </tr>
                <!-- 7 -->
                <tr>
                    <td rowspan="3">HOME PAGE</td>
                    <td rowspan="3" colspan="4">http://www.protechsite.com</td>
                    <td class="centerValue" rowspan="3">AT<br/>TN.</td>
                    <td rowspan="3"></td>
                    <td>TITLE</td>
                    <td colspan="2"></td>
                </tr>
                <!-- 8 -->
                <tr>
                    <td colspan="3">E-MAIL</td>
                </tr>
                <!-- 9 -->
                <tr>
                    <td>AMR</td>
                    <td colspan="2">(Ext.)</td>
                </tr>
                <!-- 10 -->
                <tr>
                    <td colspan="10"></td>
                </tr>
                <!-- 11 -->
                <tr class="bgBlue">
                    <td class="fontBold" colspan="4">Buying Company NAME</td>
                    <td colspan="3">{company_name}</td>
                    <td class="centerValue fontBold" colspan="2">COUNTRY</td>
                    <td class="centerValue">{country}</td>
                </tr>
                <!-- 12 -->
                <tr class="bgBlue">
                    <td class="fontBold">ADDRESS</td>
                    <td colspan="9">{address}</td>
                </tr>
                <!-- 13 -->
                <tr class="bgBlue">
                    <td class="fontBold">TEL NO</td>
                    <td colspan="3">{tel_no}</td>
                    <td class="centerValue fontBold">FAX<br/>NO</td>
                    <td colspan="2">{fax_no}</td>
                    <td class="fontBold">ATTN</td>
                    <td colspan="2">{attn}</td>
                </tr>
                <!-- 14 -->
                <tr>
                    <td colspan="10"></td>
                </tr>
                <!-- 15 -->
                <tr class="bgGreen">
                    <td class="fontBold" colspan="10">P/I INFORMATION</td>
                </tr>
                <!-- 16 -->
                <tr class="bgGreen">
                    <td>P/I NO</td>
                    <td colspan="3">{pi_no}</td>
                    <td class="centerValue" rowspan="3" colspan="2">CUSTOMER<br/>PO INFO.</td>
                    <td>Ref PO #</td>
                    <td class="centerValue" colspan="3">{ref_po}</td>
                </tr>
                <!-- 17 -->
                <tr class="bgGreen">
                    <td>P/I ISSUE DATE</td>
                    <td colspan="3">{pi_issue_date}</td>
                    <td>PO<br/>RECV.</td>
                    <td class="centerValue" colspan="3">{po_recv}</td>
                </tr>
                <!-- 18 -->
                <tr class="bgGreen">
                    <td>Date of Validity</td>
                    <td colspan="3">{validity}</td>
                    <td>PO<br/>ISSUED<br/>BY</td>
                    <td class="centerValue" colspan="3">{po_issued_by}</td>
                </tr>
                <!-- 19 -->
                <tr class="bgGreen">
                    <td class="centerValue" colspan="10">DESCRIPTION</td>
                </tr>
                <!-- 20 -->
                <tr class="bgGreen">
                    <td class="centerValue">ARTICLES</td>
                    <td class="centerValue">MODEL</td>
                    <td class="centerValue" colspan="2">QUANTITY</td>
                    <td class="centerValue" colspan="2">U/PRICE</td>
                    <td class="centerValue" colspan="2">Amount</td>
                    <td class="centerValue">SHIP BY</td>
                    <td class="centerValue">ESTIMATE TIME DEPARTURE</td>
                </tr>
                <!-- 21(??????) -->
                <tr class="bgGreen">
                    <td class="centerValue">{articles_01}</td>
                    <td class="centerValue">{model_01}</td>
                    <td class="numberValue">{quantity_01}</td>
                    <td class="centerValue">{unit_code_01}</td>
                    <td class="centerValue">{unit_currency_01}</td>
                    <td class="numberValue">{sales_price_01}</td>
                    <td class="centerValue">{unit_dollar_01}</td>
                    <td class="numberValue">{amount_01}</td>
                    <td class="centerValue">{ship_by_01}</td>
                    <td rowspan="10">{estimate_time_01}</td>
                </tr>
                <!-- 22(??????) -->
                <tr class="bgGreen">
                    <td class="centerValue">{articles_02}</td>
                    <td class="centerValue">{model_02}</td>
                    <td class="numberValue">{quantity_02}</td>
                    <td class="centerValue">{unit_code_02}</td>
                    <td class="centerValue">{unit_currency_02}</td>
                    <td class="centerValue">{sales_price_02}</td>
                    <td class="centerValue">{unit_dollar_02}</td>
                    <td class="numberValue">{amount_02}</td>
                    <td class="centerValue">{ship_by_02}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_03}</td>
                    <td class="centerValue">{model_03}</td>
                    <td class="numberValue">{quantity_03}</td>
                    <td class="centerValue">{unit_code_03}</td>
                    <td class="centerValue">{unit_currency_03}</td>
                    <td class="numberValue">{sales_price_03}</td>
                    <td class="centerValue">{unit_dollar_03}</td>
                    <td class="numberValue">{amount_03}</td>
                    <td class="centerValue">{ship_by_03}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_04}</td>
                    <td class="centerValue">{model_04}</td>
                    <td class="numberValue">{quantity_04}</td>
                    <td class="centerValue">{unit_code_04}</td>
                    <td class="centerValue">{unit_currency_04}</td>
                    <td class="numberValue">{sales_price_04}</td>
                    <td class="centerValue">{unit_dollar_04}</td>
                    <td class="numberValue">{amount_04}</td>
                    <td class="centerValue">{ship_by_04}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_05}</td>
                    <td class="centerValue">{model_05}</td>
                    <td class="numberValue">{quantity_05}</td>
                    <td class="centerValue">{unit_code_05}</td>
                    <td class="centerValue">{unit_currency_05}</td>
                    <td class="numberValue">{sales_price_05}</td>
                    <td class="centerValue">{unit_dollar_05}</td>
                    <td class="numberValue">{amount_05}</td>
                    <td class="centerValue">{ship_by_05}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_06}</td>
                    <td class="centerValue">{model_06}</td>
                    <td class="numberValue">{quantity_06}</td>
                    <td class="centerValue">{unit_code_06}</td>
                    <td class="centerValue">{unit_currency_06}</td>
                    <td class="centerValue">{sales_price_06}</td>
                    <td class="centerValue">{unit_dollar_06}</td>
                    <td class="centerValue">{amount_06}</td>
                    <td class="centerValue">{ship_by_06}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_07}</td>
                    <td class="centerValue">{model_07}</td>
                    <td class="numberValue">{quantity_07}</td>
                    <td class="centerValue">{unit_code_07}</td>
                    <td class="centerValue">{unit_currency_07}</td>
                    <td class="centerValue">{sales_price_07}</td>
                    <td class="centerValue">{unit_dollar_07}</td>
                    <td class="centerValue">{amount_07}</td>
                    <td class="centerValue">{ship_by_07}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_08}</td>
                    <td class="centerValue">{model_08}</td>
                    <td class="numberValue">{quantity_08}</td>
                    <td class="centerValue">{unit_code_08}</td>
                    <td class="centerValue">{unit_currency_08}</td>
                    <td class="centerValue">{sales_price_08}</td>
                    <td class="centerValue">{unit_dollar_08}</td>
                    <td class="centerValue">{amount_08}</td>
                    <td class="centerValue">{ship_by_08}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_09}</td>
                    <td class="centerValue">{model_09}</td>
                    <td class="numberValue">{quantity_09}</td>
                    <td class="centerValue">{unit_code_09}</td>
                    <td class="centerValue">{unit_currency_09}</td>
                    <td class="centerValue">{sales_price_09}</td>
                    <td class="centerValue">{unit_dollar_09}</td>
                    <td class="centerValue">{amount_09}</td>
                    <td class="centerValue">{ship_by_09}</td>
                </tr>
                <tr class="bgGreen">
                    <td class="centerValue">{articles_10}</td>
                    <td class="centerValue">{model_10}</td>
                    <td class="numberValue">{quantity_10}</td>
                    <td class="centerValue">{unit_code_10}</td>
                    <td class="centerValue">{unit_currency_10}</td>
                    <td class="numberValue">{sales_price_10}</td>
                    <td class="centerValue">{unit_dollar_10}</td>
                    <td class="numberValue">{amount_10}</td>
                    <td class="centerValue">{ship_by_10}</td>
                </tr>
                <!-- 23 -->
                <tr>
                    <td></td>
                    <td class="centerValue fontBold">TOTAL</td>
                    <td class="numberValue fontBold">{total}</td>
                    <td class="centerValue fontBold"></td>
                    <td colspan="6"></td>
                </tr>
                <!-- 24 -->
                <tr>
                    <td style="height: 2px;" colspan="10"></td>
                </tr>
                <!-- 25 -->
                <tr>
                    <td style="height: 5px;" colspan="10"></td>
                </tr>
                <!-- 26 -->
                <tr class="bgYellow">
                    <td class="fontBold" colspan="10">SHIPPING & PAYMENT CONDITION</td>
                </tr>
                <!-- 27 -->
                <tr class="bgYellow">
                    <td colspan="2">SHIPPING TERMS</td>
                    <td class="centerValue" colspan="2">{shpping_term}</td>
                    <td class="centerValue" colspan="2">PAYMENT<br/>CONDITION</td>
                    <td colspan="4">{payment_cond}</td>
                </tr>
                <!-- 28 -->
                <tr class="bgYellow">
                    <td colspan="2">PACKING</td>
                    <td colspan="8"></td>
                </tr>
                <!-- 29 -->
                <tr class="bgYellow">
                    <td colspan="2">COUNTRY OF ORIGIN</td>
                    <td class="centerValue" colspan="2">KOREA</td>
                    <td class="centerValue" rowspan="4" colspan="2">BANK INFO.</td>
                    <td class="centerValue" colspan="4">HANA BANK WONJU BRANCH.</td>
                </tr>
                <!-- 30 -->
                <tr class="bgYellow">
                    <td colspan="2">PORT OF DEPARTURE</td>
                    <td colspan="2">{departure}</td>
                    <td colspan="2">Acct.<br/>Holder.</td>
                    <td colspan="2">BIO PROTECH INC.</td>
                </tr>
                <!-- 31 -->
                <tr class="bgYellow">
                    <td colspan="2">PORT OF DESTINATION</td>
                    <td class="centerValue" colspan="2">{destination}</td>
                    <td colspan="2">Acct.<br/>Number.</td>
                    <td colspan="2">793-910001-20032</td>
                </tr>
                <!-- 32 -->
                <tr class="bgYellow">
                    <td colspan="2">VESSEL/FLIGHT</td>
                    <td colspan="2">{ves_flight}</td>
                    <td colspan="2">S.W.I.F.T.<br/>CODE</td>
                    <td colspan="2">HNBNKRSE</td>
                </tr>
                <tr>
                    <td colspan="10">
                        <span class="fontBold">NOTES</span><br/>
                        1.Payment amount which is deducted any type of charges must be the same as P/I amount.<br/>
                        2.All Banking charges outside Korea must be bore to the buyer side.
                    </td>
                </tr>
            
            
            </table>
            
            
            </body>
            </html>`], { compiled: true });
    }
}
)
    ;