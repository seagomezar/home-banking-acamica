
const express = require('express');
const server = express();
const bodyParser = require("body-parser");
const cuentas = [
    {titular:"martin",nroCuenta:"0123123123",saldo:"0"},
    {titular:"franco",nroCuenta:"9999999999",saldo:"99999"},
    {titular:"manuel",nroCuenta:"5555555555",saldo:"55555"}
];

const conexion = new sequelizer(
    "mysql://sebas:some_pass@192.168.64.2:3306/clase_sql"
  );


server.listen(3000, ()=>{
    console.log("Servidor activo en puerto 3000");
});

server.use(bodyParser.json());

server.get("/cuentas", (req,res,err)=>{
    res.json(cuentas);
});

//Hola a todos