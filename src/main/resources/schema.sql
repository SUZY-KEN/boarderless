create table if not exists roles(
id int not null auto_increment primary key,
role_name varchar (50) not null

);

create table if not exists user(
id int not null auto_increment primary key,
name varchar (50) not null,
email varchar(255)  not null unique ,
password varchar(255) not null,
role_id int not null,
enabled BOOLEAN NOT NULL,
created_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
foreign key (role_id) references roles (id)


);

create table if not exists category(
id int not null auto_increment primary key,
name varchar (50)not null

);

create table if not exists imagefile(
id int not null auto_increment primary key,
spot_id int not null,
image_url varchar (255)not null

);

create table if not exists spot(
id int not null auto_increment primary key,
lat float not null,
lng float not null,
user_id int not null,
imagefile_id int ,
category_id int ,
name varchar (50) not null,
description varchar (255),
evalues int ,
evalues_double double,
price int not null,
created_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
foreign key (category_id) references category (id),
foreign key (user_id) references user (id)


);

