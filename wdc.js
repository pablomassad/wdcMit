var app = new Vue({
    el: '#app',
    data: {
        url: '',
        connectionName: '',
        aliasName: '',
        tableData: [],
        tableSchema: {},
        list: [],
        myConnector: tableau.makeConnector()
    },
    created: function ()
    {
        this.list.push('constructor')
        this.myConnector.getSchema = function (schemaCallback)
        {
            console.log('getSchema call')
            console.log(this.tableSchema)
            schemaCallback([this.tableSchema])
        }
        this.myConnector.getData = function (table, doneCallback) 
        {
            console.log('getData call')
            table.appendRows(this.tableData)
            doneCallback()
        }
        tableau.registerConnector(this.myConnector)
    },
    computed: {
        wrongConnectionName()
        {
            return (this.connectionName == '')
        },
        wrongAliasName()
        {
            return (this.aliasName == '')
        }
    },
    methods: {
        async callService()
        {
            try {
                var options = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({url:this.url})
                }
                const response = await fetch('http://localhost:8000/api/callws', options)
                let data = await response.json()
                this.list.push('raw data incomming!!')
                console.log('data: ', data)
                const keys = Object.keys(data['Table2'])
                let cols = []
                keys.forEach(key =>
                {
                    let o = {
                        id: key,
                        alias: data[key],
                        dataType: tableau.dataTypeEnum.string
                    }
                    cols.push(o)
                })
                this.tableSchema = {
                    id: this.connectionName, //"detalleLlamadas",
                    alias: this.aliasName, //"Detalle de llamadas por lote",
                    columns: cols
                }
                this.list.push('Schema OK: '+this.tableSchema.id + ' ' + this.tableSchema.alias)
                const arr = data['Table1']

                for (var i = 0, len = arr.length; i < len; i++) {
                    let o = {}
                    keys.forEach(key =>
                    {
                        o[key] = arr[i][key]
                    })
                    this.tableData.push(o)
                }
                this.list.push('Data OK')
            } catch (error) {
                this.list.push(error)
            }
        },
        connectToTableau()
        {
            this.list.push('connect to Tableau')
            tableau.connectionName = this.connectionName //"Detalle de llamadas";
            tableau.submit(); // This sends the connector object to Tableau
        }
    }
})



                // "https://mitct.mitrol.net/reportes/ws.asmx/MitrolWS_UserPassJson?Username=ADMIN&Password=ADMIN&wsparameter=store%3dREP_RDL_DetalleLlamadasCampLote%23%23idPermiso%3dREPORTES_Interacciones_Detalle+Interacciones+(Campa%c3%b1a+-+Lote)%23%23Version%3d10%23%23col%3d%23%23Idioma%3des%23%23SizeWeb%3d300%23%23SizePrint%3d29.7%7c%7c21%7c%7ccm%23%23Orientacion%3dH%23%23Ocultar%3d4%7c%7c%23%23OrderBy%3dNombreEmpresa%23A%7c%7cNombreCampania%23A%7c%7cNombreLote%23A%7c%7c%23%23UserId%3d1%23%23PEXT_TipoSalidaRep%3d0%23%23PEXT_Query%3d%23%23PEXT_WS%3d1%7c%7c%23%23RDLC_RowsByPage%3d-1%23%23PEXT_MaxRow%3d100%23%23RDLC_FormInt%3d0%23%23RDLC_Culture%3des-AR%23%23RDLC_strDateFormat%3ddd%2fMM%2fyyyy%23%23PEXT_FechaRango%3d-5%23%23PEXT_HIni%3d08%3a00%23%23PEXT_HFin%3d20%3a00%23%23PEXT_MinDuracion%3d00%3a00%3a00%23%23PEXT_MaxDuracion%3d00%3a00%3a00%23%23PEXT_TalkingTime_Min%3d00%3a00%3a00%23%23PEXT_TalkingTime_Max%3d00%3a00%3a00%23%23PEXT_idEmpresa%3d-1%23%23PEXT_idCamp%3d-1%23%23PEXT_idLote%3d-1%23%23PEXT_idGrupo%3d-1%23%23PEXT_idAgente%3d-1%23%23PEXT_Linea%3d%23%23PEXT_idCRM%3d%23%23PEXT_TipoAgente%3d-1%23%23PEXT_idTarea%3d%23%23PEXT_DigitosMin%3d0%23%23PEXT_DigitosMax%3d0%23%23PEXT_Prefijo%3d%23%23PEXT_Sentido%3d-1%23%23PEXT_idInteraccion%3d%23%23RDLC_EstiloRep%3d0%23%23RDLC_newTabExcel%3d%23%23RDLC_DocumentMap%3d%23%23HIDD_fromExecuteSQL%3d%23%23brw%3dChrome%23%23brwver%3d79%23%23"
                // $.getJSON(this.url,
                //     (data) =>
                //     {
                //         this.list.push('raw data incomming!!')
                //         if (data.length == 0) return
                //         const keys = Object.keys(data[0])
                //         let cols = []
                //         keys.forEach(key =>
                //         {
                //             let o = {
                //                 id: key,
                //                 alias: key,
                //                 dataType: tableau.dataTypeEnum.string
                //             }
                //             cols.push(o)
                //         })

                //         this.tableSchema = {
                //             id: this.connectionName, //"detalleLlamadas",
                //             alias: this.aliasName, //"Detalle de llamadas por lote",
                //             columns: cols
                //         }
                //         this.list.push('Schema OK')
                //         for (var i = 0, len = data.length; i < len; i++) {
                //             let o = {}

                //             keys.forEach(key =>
                //             {
                //                 o[key] = data[i][key]
                //             })
                //             this.tableData.push(o)
                //         }
                //         this.list.push('Data OK')
                //     })







