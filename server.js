
const express = require('express');
const server = express();
const bodyParser = require("body-parser");
const cuentas = [
    {titular:"martin",nroCuenta:"0123123123",saldo:"0"},
    {titular:"franco",nroCuenta:"9999999999",saldo:"99999"},
    {titular:"manuel",nroCuenta:"5555555555",saldo:"55555"}
];

// Añadiendo la linea de conexion
const conexion = new sequelizer(
    "mysql://sebas:some_pass@192.168.64.2:3306/clase_sql"
  );


// TODO: MArtin hacer que el server funcione
server.listen(3000, ()=>{
    console.log("Servidor activo en puerto 3000");
});

server.use(bodyParser.json());

server.get("/cuentas", (req,res,err)=>{
    res.json(cuentas);
});

server.get("/cuentas/:id", (req, res, err) => {
    const indice = cuentas.findIndex((element) => {
        return element.nroCuenta == req.params.id;
    });

    res.json(cuentas[indice]);
})
//TODO: Crear los endpoints que faltan DELETE, HACER TRANSACION, CREAR CUENTA

//Borra el usuario con una funcion
server.delete("/cuentas/:id", (req, res, err) => {
    const indice = cuentas.findIndex((element) => {
        return element.nroCuenta == req.params.id;
    });

    if (indice >= 0) {
        borrarCuenta(indice);
        res.status(202).json({ok: true, mensaje:"Cuenta borrada numero : " + cuentas[indice].nroCuenta + " Usuario: " + cuentas[indice].titular});
    } else {
        res.status(500).json({ok: false, error:"Cuenta inexistente."})
    }
})

// Crear usuario con Form, y crea tanto usuario como cuenta
server.post("/usuarios",  (req, res, err) => {
    if (req.body.usuario.length>0) {
        const indice = usuarios.findIndex((element) => {
            return element.titular == req.body.usuario;
        });

        if (indice >= 0) {
            res.status(500).json({ok: false, error: "Nombre de usuario ya existe."});
        } else {
            let cuenta = {
                "nroCuenta": cuentas[cuentas.length-1].nroCuenta + 1,
                "titular": req.body.usuario,
                "saldo": 0
            };
            let usuario = {
                "nombre": req.body.usuario,
                "password": req.body.password,
                "admin": false
            }
        
            usuarios.push(usuario);
            cuentas.push(cuenta);

            guardarDatos();
            res.status(201).json({ok: true});
        };
    } else {
        res.status(500).json({ok: false, error: "Nombre de usuario vacío."});
    };
});

//Transferencia entre usuarios, valida que existan origen y destino, y que tenga el origen saldo suficiente.
server.put("/cuentas/transfer", (req, res, err) => {
    const indiceDestino = cuentas.findIndex((element) => {
        return element.nroCuenta == req.body.destino;
    });
    const indiceOrigen = cuentas.findIndex((element) => {
        return element.nroCuenta == req.body.cuenta;
    });

    if (indiceOrigen == -1 || indiceDestino == -1) {
        res.status(500).json({ok: false, error: "Cuenta Origen o Destino inexistentes"});
    } else if (cuentas[indiceOrigen].saldo >= req.body.saldo) {
        cuentas[indiceOrigen].saldo -= req.body.saldo;
        cuentas[indiceDestino].saldo += req.body.saldo;
        guardaDatos();
        res.status(200).json({ok: true});
    } else {
        res.status(400).json({ok: false, error: "Sin saldo suficiente"});
    };

});