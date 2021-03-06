// abre pagina web
// input de URL de web service para consultar reporte
// boton de carga de reporte
// barra de progreso / spinner
// habilitacion de boton de conexion a Tableau

(function () {

    function getConnectionUrl(url) {
        var yqlQueryBase = "http://query.yahooapis.com/v1/public/yql?q="
        var query = "select * from html where url='" + url + "'"
        var restOfQueryString = "&format=xml"
        var yqlUrl = yqlQueryBase + encodeURIComponent(query) + restOfQueryString
        return yqlUrl
    }

    var myConnector = tableau.makeConnector()

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            { id: "ticker", alias: "Ticker", dataType: tableau.dataTypeEnum.string },
            { id: "company", alias: "Company", dataType: tableau.dataTypeEnum.string },
            { id: "date", alias: "Date", dataType: tableau.dataTypeEnum.string },
            { id: "segment", alias: "Segment", dataType: tableau.dataTypeEnum.string },
            { id: "call", alias: "Call", dataType: tableau.dataTypeEnum.string },
            { id: "price", alias: "Price", dataType: tableau.dataTypeEnum.float }
        ]

        var tableInfo = {
            alias: "Stock Data for " + tableau.connectionData,
            id: 'stockData',
            columns: cols
        }

        schemaCallback([tableInfo])
    }

    myConnector.getData = function (table, doneCallback) {
        var connectionUrl = "http://madmoney.thestreet.com/screener/index.cfm?airdate=30&showrows=500"

        var xhr = $.ajax({
            url: getConnectionUrl(connectionUrl),
            success: function (response) {
                var stockTableRows = $(response).find('#stockTable tr')
                stockTableRows = stockTableRows.not(':first') // Removes the first row which is the header

                var tableData = []
                stockTableRows.each(function (i, row) {

                    var $stockTableColumnsInRow = $(row).find('td')

                    // Build a row from the parsed response
                    tableData.push({
                        'ticker': $($stockTableColumnsInRow[0]).find('a').text(),
                        'company': $($stockTableColumnsInRow[0]).text(),
                        'date': $($stockTableColumnsInRow[1]).text(),
                        'segment': SEGMENT_KEY[$($stockTableColumnsInRow[2]).find('img').attr('alt')],
                        'call': CALL_ICON[$($stockTableColumnsInRow[3]).find('img').attr('alt')],
                        'price': parseFloat($($stockTableColumnsInRow[4]).text().substring(1)) // remove currency, and convert to Float.
                    })
                })

                table.appendRows(tableData)
                doneCallback()
                // tableau.dataCallback(tableData, "", false);
            }
        })
    }

    tableau.registerConnector(myConnector)
})()

const URL_REPORTES = "https://mitct.mitrol.net/"

$(document).ready(function () {
    $("#btnReport").click(function () { // consulta reportes x web services

    })
    $("#btnTableau").click(function () { // conecta con Tableau
        tableau.connectionName = 'MitrolWDC'
        tableau.submit()
    })
})