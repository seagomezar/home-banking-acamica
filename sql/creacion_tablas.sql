-- TODO: Escribir el codigo para crear tres tablas cuentas, usuarios, transacciones


--Fran cuentas

CREATE TABLE cuentas(
   cuenta_id smallint(5)  not null auto_increment primary key,
   nombre varchar(50) not null,
   tipo varchar(50) not null,
   saldo int(10) not null
);

-- rodri usuarios
CREATE TABLE usuarios (
    id smallint(5) auto_increment primary key,
    user varchar(20) not null,
    pass varchar(40) not null,
    nombre varchar(60) not null,
    apellido varchar(60) not null,
    email varchar(40) not null
)

--transacciones Miguel