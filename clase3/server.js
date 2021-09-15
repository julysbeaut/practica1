console.log('HOLA DESDE SERVER.js');
//IMPORTACIÓN DE PAQUETES REQUERIDOS PARA EJECUCIÓN DE PROGRAMA
const express = require('express');
const http = require('http');
const app = express();
const axios = require('axios');

app.set('view engine', 'ejs')
//DEFINICIÓN PARA VALIDAR POR PARÁMETRO INGRESADO 
//NOTA: SE HACE VALIDACIÓN SOBRE LOS PRIMEROS 20 REGISTROS SEGÚN REGISTROS
app.get('/Pochemon/:id?', (req,res) =>{    
    axios.get('https://pokeapi.co/api/v2/pokemon').then(
    (respuestaApi) => {
        //DEFINICIÓN DEL ARREGLO, TOMANDO EL ATRIBUTO RESULTS
        let results = [...respuestaApi.data.results];       
        // SE RECORRE EL ARREGLO CON EL FIN DE OBTENER EL ID DE CADA POCKEMON Y ADICIONALMENTE AGREGARSELO AL ARREGLO COMO NUEVO ATRIBUTO
        for(let i=0; i<results.length; i++){
            let splitCad = (results[i].url).split('/');
            let posId = splitCad.length-1;
            results[i] = {...results[i],...{id: splitCad[posId-1]}}
        }
        //VALIDACIÓN PARA SABER SI EL PARÁMETRO FUE INGRESADO O NO DESDE LA URL
        if(req.params.id){ 
            const searchResultById = results.find( ({id}) => id == req.params.id );            
            if(searchResultById){ //VALIDACIÓN SI EL PARAMETRO INGRESADO POR URL EXISTE DENTRO DEL ARRELGO DE RESULTS
                results = [results[req.params.id-1]];
                res.status(200).render('index',{pokemons: results});         
            } else {    // ID PASADO POR URL NO EXISTE, MOSTRARÍA MENSAJE DE QUE NO EXISTE
                res.status(200).render('indexValorNoEncontrado',{id: req.params.id});
            }            
        } else { // PARAMETRO ID NO FUE INGRESADO, PARA EL EJEMPLO MUESTRA TODOS
            res.status(200).render('index',{pokemons: results});         
        }                                
    }
    ).catch(
        (err) => {
            console.error(err);
        }
    ).finally(
        () => {
            console.log('termino')
        }
    );   
})

//LEVANTAR SERVICIO
http.createServer(app).listen(8001,() => {
    console.log("INICIANDO POR EL PUERTO 8001");
})

