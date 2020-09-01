CREATE TABLE usuario (
    id int primary key autoincrement,
    user varchar(20) not null,
    pass varchar(40) not null,
    nombre varchar(60) not null,
    apellido varchar(60) not null,
    email varchar(40) not null,
)