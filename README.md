# Movie-App
Recommends movies and stores them in user history


sequelize model:create --name user --attributes name:string,email:text,password:text
sequelize model:create --name review --attributes userId:integer,movieID:integer,review:text
sequelize model:create --name movie --attributes title:string 