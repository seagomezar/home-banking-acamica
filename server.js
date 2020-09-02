const sequelizer = require("sequelize");
const express = require("express");
const server = new express();
const bodyParser = require("body-parser");

// Añadiendo la linea de conexion
//const url_desarrollo = require("./credenciales");

//const conexion = new sequelizer(
//    url_desarrollo.db
//);

const conexion = new sequelizer('home_banking', 'root', 'acamicaDWFS24', {
  host: 'localhost',
  dialect: 'mysql'
});

conexion
  .authenticate()
  .then(() => {
    console.log('mySQL conexion realizada en puerto 3306');
  })
  .catch(err => {
    console.error('Error de conexión a DB:', err.original.sqlMessage);
  });


// TODO: Martin hacer que el server funcione
server.listen(3000, ()=>{
    console.log("Servidor activo en puerto 3000");
});

server.use(bodyParser.json());

//Initializo arrays
cuentas = listarCuentas();
usuarios = listarUsuarios();

//RUTAS
server.get("/cuentas", (req,res)=>{
  res.json(cuentas);
});

server.get("/cuentas/:id", (req, res) => {
    const indice = cuentas.findIndex((element) => {
        return element.cuenta_id == req.params.id;
    });
    
    res.json(cuentas[indice]);
})

server.get("/usuarios", (req,res)=>{
  res.json(usuarios);
});

server.get("/usuarios/:id", (req, res) => {
    const indice = usuarios.findIndex((element) => {
        return element.id == req.params.id;
    });
    
    res.json(usuarios[indice]);
})

//TODO: Crear los endpoints que faltan DELETE, HACER TRANSACION, CREAR CUENTA

//Borra el usuario con una funcion TODO: persistir borrado en SQL
server.delete("/cuentas/:id", (req, res) => {
    const indice = cuentas.findIndex((element) => {
        return element.cuenta_id == req.params.id;
    });

    if (indice >= 0) {
        borrarCuenta(indice);
        res.status(202).json({ok: true, mensaje:"Cuenta borrada numero : " + cuentas[indice].cuenta_id + " Usuario: " + cuentas[indice].nombre});
    } else {
        res.status(500).json({ok: false, error:"Cuenta inexistente."})
    }
})

// Crear usuario con Form, y crea tanto usuario como cuenta TODO: persistir usuario en SQL
server.post("/usuarios",  (req, res) => {
    if (req.body.usuario.length>0) {
        const indice = usuarios.findIndex((element) => {
            return element.nombre == req.body.usuario;
        });

        if (indice >= 0) {
            res.status(500).json({ok: false, error: "Nombre de usuario ya existe."});
        } else {
            let cuenta = {
                "nombre": req.body.usuario,
                "tipo": req.body.tipo,
                "saldo": req.body.saldo
            };
            let usuario = {
                "user": req.body.usuario,
                "nombre": req.body.nombre,
                "apellido": req.body.apellido,
                "pass": req.body.password,
                "email": req.body.email
            }
        
            usuarios.push(usuario);
            cuentas.push(cuenta);

            hacerInsertCuenta(cuenta).then( (id) => {
              cuenta.id = id;
              hacerInsertUsuario(usuario).then( (id) => {
                usuario.id = id;
                res.status(201).json({ok: true, cuenta: cuenta, usuario: usuario});
              })
              .catch( () => {
                res.status(500).json({ok: false, error: "No se pudo insertar usuario"});
              });
            })
            .catch( () => {
              res.status(500).json({ok: false, error: "No se pudo insertar cuenta"});
            });
        };
    } else {
        res.status(500).json({ok: false, error: "Nombre de usuario vacío."});
    };
});

//Transferencia entre usuarios, valida que existan origen y destino, y que tenga el origen saldo suficiente.
// TODO: persistir transferencia en SQL
server.put("/cuentas/transfer", (req, res) => {
    const indiceDestino = cuentas.findIndex((element) => {
        return element.cuenta_id == req.body.destino;
    });
    const indiceOrigen = cuentas.findIndex((element) => {
        return element.cuenta_id == req.body.cuenta;
    });

    if (indiceOrigen == -1 || indiceDestino == -1) {
        res.status(500).json({ok: false, error: "Cuenta Origen o Destino inexistentes"});
    } else if (cuentas[indiceOrigen].saldo >= req.body.saldo) {
        cuentas[indiceOrigen].saldo -= req.body.saldo;
        cuentas[indiceDestino].saldo += req.body.saldo;
        //guardaEnTransacciones();
        res.status(200).json({ok: true});
    } else {
        res.status(400).json({ok: false, error: "Sin saldo suficiente"});
    };

});

/*
async function hacerUpdateCuenta(cuenta) {
  try {
    const resultado = await conexion.query(
      "UPDATE cuentas SET nombre = :nombre , tipo = :tipo , saldo = :saldo WHERE cuenta_id = :id",
      {
        replacements: { nombre: cuenta.nombre, tipo: cuenta.tipo, saldo: cuenta.saldo},
      }
    );
    console.log("# UPDATE SUCCESSFULL", resultado);
  } catch (e) {
    console.log("# ERROR UPDATE", e);
  }
}

async function hacerUpdateUsuario(usuario) {
  try {
    const resultado = await conexion.query(
      "UPDATE usuarios SET user = :user , pass = :pass , nombre = :nombre , apellido = :apellido , email = :email WHERE cuenta_id = :id",
      {
        replacements: { user: usuario.user, pass: usuario.pass, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email},
      }
    );
    console.log("# UPDATE SUCCESSFULL", resultado);
  } catch (e) {
    console.log("# ERROR UPDATE", e);
  }
}
*/
async function hacerDelete(id) {
  try {
    const resultado = await conexion.query("DELETE usuario WHERE id = :id", {
      replacements: { id: id },
    });
    console.log("# DELETE usuarios SUCCESSFULL", resultado);
  } catch (e) {
    console.log("# ERROR DELETE usuario", e);
    return false;
  }
  try {
    const resultado = await conexion.query("DELETE cuenta WHERE cuenta_id = :id", {
      replacements: { id: id },
    });
    console.log("# DELETE cuentas SUCCESSFULL", resultado);
  } catch (e) {
    console.log("# ERROR DELETE cuenta", e);
    return false;
  }

  return true;
}

async function hacerInsertCuenta(cuenta) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO cuentas (nombre, tipo, saldo) VALUES (:nombre, :tipo, :saldo)",
      {
        replacements: {nombre: cuenta.nombre, tipo: cuenta.tipo, saldo: cuenta.saldo},
      }
    );
    console.log("# INSERT cuenta SUCCESSFULL", resultado);
    return resultado[0];
  } catch (e) {
    console.log("#ERROR INSERT", e);
  }
}
async function hacerInsertUsuario(usuario) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO usuarios (user, nombre, apellido, pass, email) VALUES (:user, :nombre, :apellido, :password, :email)",
      {
        replacements: {user: usuario.user, nombre: usuario.nombre, apellido: usuario.apellido, password: usuario.pass, email: usuario.email},
      }
    );
    console.log("# INSERT usuario SUCCESSFULL", resultado);
    return resultado[0];
  } catch (e) {
    console.log("#ERROR INSERT", e);
  }
}

async function listarCuentas(id = "%") {
  try {
    cuentas = await conexion.query("SELECT * FROM cuentas WHERE cuenta_id LIKE :id", {
      replacements: { id: id },
    });
    cuentas = cuentas[0];
    console.log("Cuentas: ", cuentas);
    return true;
  } catch (e) {
    console.log("#ERROR SELECT", e);
  }
}

async function listarUsuarios(id = "%") {
  try {
    usuarios = await conexion.query("SELECT * FROM usuarios WHERE id LIKE :id", {
      replacements: { id: id },
    });
    usuarios = usuarios[0];
    console.log("Usuarios: ", usuarios);
    return true;
  } catch (e) {
    console.log("#ERROR SELECT", e);
  }
}
