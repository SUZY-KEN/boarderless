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
lat double not null,
lng double not null,
user_id int not null,
imagefile_id varchar(255) ,
category_id int ,
name varchar (50) not null,
description varchar (255),
evalues int ,
evalues_double double,
price int,
enable BOOLEAN not null,
is_rejected BOOLEAN not null,
is_reported BOOLEAN ,
created_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
foreign key (category_id) references category (id),
foreign key (user_id) references user (id)


);

create table if not exists  review (
id int not null auto_increment primary key,
user_id int not null,
spot_id int not null,
evalues int ,
contents varchar (255),
created_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
foreign key (user_id) references user (id),
foreign key (spot_id) references spot (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_tokens (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL UNIQUE,
     token VARCHAR(255) NOT NULL,        
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES user (id) 
 );
 
 CREATE TABLE IF NOT EXISTS message_from_admin (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL ,
     title VARCHAR(255) NOT NULL, 
     contents VARCHAR(255) NOT NULL,
     already_read BOOLEAN not null,       
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES user (id) 
 );
 
 CREATE TABLE IF NOT EXISTS favorite (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL ,
      spot_id INT NOT NULL , 
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES user (id) ,
     FOREIGN KEY (spot_id) REFERENCES spot(id) ON DELETE CASCADE
 );
 
 CREATE TABLE IF NOT EXISTS report (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL ,
      spot_id INT NOT NULL , 
      contents VARCHAR (255),
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES user (id) ,
     FOREIGN KEY (spot_id) REFERENCES spot(id)  ON DELETE CASCADE
 );
 
  CREATE TABLE IF NOT EXISTS message_from_user_category (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL 
    
 );
CREATE TABLE IF NOT EXISTS message_from_user (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL ,
     message_category_id INT not null,
     spot_id INT ,
     title VARCHAR(255) NOT NULL, 
     contents VARCHAR(255) NOT NULL,
     already_read BOOLEAN not null,       
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES user (id) ,
     FOREIGN KEY (spot_id) REFERENCES spot (id) ON DELETE CASCADE ,
     FOREIGN KEY (message_category_id) REFERENCES message_from_user_category (id) 
     
 );
 
 CREATE TABLE IF NOT EXISTS persistent_logins (
    username VARCHAR(64) NOT NULL,
    series VARCHAR(64) PRIMARY KEY,
    token VARCHAR(64) NOT NULL,
    last_used TIMESTAMP NOT NULL
);
 

