drop database if exists fpcs_cslf;

create database fpcs_cslf;
use fpcs_cslf;

drop user if exists 'cslf-server'@'localhost';
create user 'cslf-server'@'localhost' identified with mysql_native_password by 'IS53007E!202223';
grant all privileges on fpcs_cslf.* to 'cslf-server'@'localhost';