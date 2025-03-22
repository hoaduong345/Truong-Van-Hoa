import mongoose from "mongoose";
import dotenv from "dotenv";
import Person from "../models/Person";

dotenv.config();

const famousActors = [
  {
    name: "Liu Yifei",
    age: 37,
    gender: "female",
    avatar:
      "https://images2.thanhnien.vn/528068263637045248/2025/3/19/48491850312092327072275991397302392859918980n-17424013829922011554683.jpg",
    score: 1040501,
  },
  {
    name: "Angelina Jolie",
    age: 48,
    gender: "female",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhh6oURbnnnogoiYZ5j0L8197woE34ResjLg&s",
    score: 230580,
  },
  {
    name: "Rosé",
    age: 28,
    gender: "female",
    avatar:
      "https://media.vov.vn/sites/default/files/styles/large/public/2024-01/rose-1076012.jpeg.jpg",
    score: 120401,
  },
  {
    name: "Gal Gadot",
    age: 39,
    gender: "female",
    avatar:
      "https://images2.thanhnien.vn/528068263637045248/2025/3/19/1-17423463503851383350361.jpg",
    score: 945,
  },
  {
    name: "Ngọc Trinh",
    age: 35,
    gender: "female",
    avatar:
      "https://thanhnien.mediacdn.vn/Uploaded/haoph/2021_11_19/ngoctrinh-gejd-455.jpg",
    score: 120650,
  },
  {
    name: "Dilraba Dilmurat",
    age: 32,
    gender: "female",
    avatar:
      "https://kenh14cdn.com/203336854389633024/2025/2/2/dich-le-nhiet-ba7-1738490219389-1738490220325435791388.jpg",
    score: 1006508,
  },
  {
    name: "Lisa",
    age: 27,
    gender: "female",
    avatar:
      "https://cdn2.tuoitre.vn/471584752817336320/2023/10/6/lisa-2-1696563961009212872963.jpeg",
    score: 10101,
  },
  {
    name: "Nancy",
    age: 24,
    gender: "female",
    avatar:
      "https://image.thanhnien.vn/Uploaded/tuyenth/2022_12_28/3-4274.jpeg",
    score: 509311,
  },
  {
    name: "Mikami Yua",
    age: 31,
    gender: "female",
    avatar:
      "https://gamek.vn/bat-ngo-voi-hinh-anh-yua-mikami-o-viet-nam-fan-hao-hung-ru-nhau-di-san-idol-178250227092521302.chn",
    score: 3301311,
  },
  {
    name: "Kim Tae-hee",
    age: 44,
    gender: "female",
    avatar:
      "https://vcdn1-vnexpress.vnecdn.net/2022/02/09/kim-tae-hee-8489-1638354461-9957-1644397446.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=CkeSPXhCg20w_thXSroqCg",
    score: 101,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/person-db"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Person.deleteMany({});
    console.log("Cleared existing data");

    // Insert new data
    await Person.insertMany(famousActors);
    console.log("Seeded database with famous actors");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
