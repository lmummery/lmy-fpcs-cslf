use fpcs_cslf;

# Delete tables in reverse order
drop table if exists activity_resource;
drop table if exists resource;
drop table if exists starred_activity;
drop table if exists lesson_activity;
drop table if exists lesson;
drop table if exists activity;
drop table if exists user;
drop table if exists school;

create table school (
	id int not null auto_increment,
	name varchar(150) not null,
	area varchar(50),
	address varchar(250),
	postcode varchar(8),
	contact_email varchar(100),
	contact_number varchar(20) not null,
	primary key (id)
);

create table user (
	id int not null auto_increment,
	email_address varchar(345) unique not null,
	title varchar(4) not null,
	first_name varchar(50) not null,
	surname varchar(100) not null,
	username varchar(100) unique not null,
	role varchar(50),
	phase varchar(4),
	school_id int,
	passwordHash varchar(250) not null,
	primary key (id),
	foreign key (school_id) references school (id)
);

create table activity (
	id int not null auto_increment,
	title varchar(100) not null,
	creator varchar(100) not null,
	description mediumtext,
	year1 boolean,
	year2 boolean,
	year3 boolean,
	year4 boolean,
	year5 boolean,
	year6 boolean,
	duration int,
	actzip varchar(300) default null,
	primary key (id),
	foreign key (creator) references user (username)
);

create table lesson (
	id int not null auto_increment,
	date_created date not null,
	time_created time not null,
	user_id int not null,
	duration int default 60,
	primary key (id),
	foreign key (user_id) references user (id)
);

create table lesson_activity (
	lesson_id int not null,
	activity_id int not null,
	num_in_lesson int not null,
	primary key (lesson_id, activity_id),
	foreign key (lesson_id) references lesson (id),
	foreign key (activity_id) references activity (id)
);

create table starred_activity (
	user_id int not null,
	activity_id int not null,
	primary key (user_id, activity_id),
	foreign key (user_id) references user (id),
	foreign key (activity_id) references activity (id)
);

create table resource (
	id int not null auto_increment,
	filetype varchar(100) not null,
	filename varchar(250) not null,
	originalname varchar(250) not null,
	filepath varchar(300) not null,
	extension varchar(10) not null,
	filesize int not null default 0,
	primary key (id)
);

create table activity_resource (
	activity_id int not null,
	resource_id int not null,
	primary key (activity_id, resource_id),
	foreign key (activity_id) references activity (id),
	foreign key (resource_id) references resource (id)
);