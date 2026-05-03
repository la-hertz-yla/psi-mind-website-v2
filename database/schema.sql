create Table users(
    user_id int primary key auto_increment,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    phone varchar(20),
    prepas varchar(255),
    filiere varchar(255),
    created_at timestamp default current_timestamp
)
 create table pdfs(
    pdf_id int primary key auto_increment,
    pdf_name varchar(255) not null,
    pdf_link varchar(255) not null,
 )

 create table favorites(
    user_id int,
    pdf_id int,
    primary key(user_id, pdf_id),
      foreign key (pdf_id) references pdfs(pdf_id) on delete cascade
    foreign key (user_id) references users(user_id) on delete cascade
 )