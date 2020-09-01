const sequelizer = require("sequelize");
const express = require("express");
const server = new express();
const bodyParser = require("body-parser");
server.listen(3000, () => {
    console.log("Estamos listos");
});

// Añadiendo la linea de conexion
const url_desarrollo = requiere(credenciales);
const conexion = new sequelizer(
    urls.server.url_desarrollo
);

// TODO: Martin hacer que el server funcione
server.listen(3000, ()=>{
    console.log("Servidor activo en puerto 3000");
});

server.use(bodyParser.json());

server.get("/cuentas", (req,res,err)=>{
    res.json(cuentas);
});

server.get("/cuentas/:id", (req, res, err) => {
    const indice = cuentas.findIndex((element) => {
        return element.cuenta == req.params.id;
    });

    res.json(cuentas[indice]);
})
//TODO: Crear los endpoints que faltan DELETE, HACER TRANSACION, CREAR CUENTA


//TO
async function hacerUpdate(id, nuevoPrecio) {
  try {
    const resultado = await conexion.query(
      "UPDATE panes SET precio = :nuevoPrecio WHERE id = :id",
      {
        replacements: { id: id, nuevoPrecio: nuevoPrecio },
      }
    );
    console.log("# UPDATE SUCCESSFULL", resultado);
  } catch (e) {
    console.log("# ERROR UPDATE", e);
  }
}
async function hacerDelete(id) {
  try {
    const resultado = await conexion.query("DELETE panes WHERE id = :id", {
      replacements: { id: id },
    });
    console.log("# DELETE SUCCESSFULL", resultado);
  } catch (e) {
    console.log("# ERROR DELETE", e);
  }
}
async function hacerInsert(pan) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO panes (id, nombre, precio) VALUES (?, ?, ?)",
      {
        replacements: [pan.id, pan.nombre, pan.precio],
      }
    );
    console.log("# INSERT SUCCESSFULL", resultado);
  } catch (e) {
    console.log("#ERROR INSERT", e);
  }
}
