// TODO: Escribir el codigo para crear tres tablas cuentas, usuarios, transacciones


// Fran cuentas

CREATE TABLE cuentas(
   cuenta_id smallint(5)  not null auto_increment primary key,
   nombre varchar(50) not null,
   tipo varchar(50) not null,
   saldo INT(10) not null
);

// rodri usuarios

// transacciones Miguel