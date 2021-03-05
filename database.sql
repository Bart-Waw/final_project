create database finalProject;

create table users (
    ID serial primary key,
    name varchar(20) not null,
    email varchar(50) not null unique,
    password varchar(20) not null,
    goal int not null default(1),
    isAdmin boolean default false
);

create table excercises (
    userID int not null,
    week_day varchar(10) not null,
    excercise varchar(30) not null,
    sets int not null,
    reps int not null,
    foreign key (userID) references users(ID)
);

create table completed_excercises (
    userID int not null,
  	excerciseID int not null,
    sets int not null,
    reps int not null,
    week_number int not null,
  	weight varchar(10) default ('none'),
    foreign key (userID) references users(ID),
  	foreign key (excerciseID) references excercises(ID)
);