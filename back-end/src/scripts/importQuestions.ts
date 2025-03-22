import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question";

dotenv.config();

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "who is the most handsome man in the world 2025?",
    options: [
      "Hoa Truong",
      "Chris Hemsworth",
      "Henry Cavill",
      "Timothée Chalamet",
    ],
    correctAnswer: "Hoa Truong",
  },
  {
    question:
      "If given the choice between me and Henry Cavill, who would you choose??",
    options: ["Me", "Henry Cavill"],
    correctAnswer: "Me",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au",
  },
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: "Pacific Ocean",
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Elephant", "Lion", "Bear"],
    correctAnswer: "Lion",
  },
  {
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correctAnswer: "12",
  },
  {
    question: "Which famous scientist developed the theory of relativity?",
    options: [
      "Isaac Newton",
      "Albert Einstein",
      "Galileo Galilei",
      "Stephen Hawking",
    ],
    correctAnswer: "Albert Einstein",
  },
  {
    question: "What is the largest desert in the world?",
    options: [
      "Sahara Desert",
      "Antarctic Polar Desert",
      "Arabian Desert",
      "Gobi Desert",
    ],
    correctAnswer: "Antarctic Polar Desert",
  },
  {
    question: "In which country is the Great Wall located?",
    options: ["India", "Japan", "China", "Vietnam"],
    correctAnswer: "China",
  },
];

const importQuestions = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/person-db";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("Cleared existing questions");

    // Insert new questions
    await Question.insertMany(sampleQuestions);
    console.log("Successfully imported questions");

    process.exit(0);
  } catch (error) {
    console.error("Error importing questions:", error);
    process.exit(1);
  }
};

importQuestions();
