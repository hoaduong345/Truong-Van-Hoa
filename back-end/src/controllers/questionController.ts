import { Request, Response } from 'express';
import Question from '../models/Question';
import Person from '../models/Person';

// Get a random question
export const getRandomQuestion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const count = await Question.countDocuments();
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne().skip(random);

    if (!question) {
      return res.status(404).json({ message: 'No questions found' });
    }

    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching question', error });
  }
};

// Check answer and update score
export const checkAnswer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { questionId, answer, userId } = req.body;

    if (!questionId || !answer || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === answer;
    
    if (isCorrect) {
      // Update person's score by adding 100 points
      const person = await Person.findByIdAndUpdate(
        userId,
        { $inc: { score: 100 } },
        { new: true }
      );

      if (!person) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        correct: true,
        message: 'Correct answer!',
        updatedScore: person.score
      });
    }

    return res.status(200).json({
      correct: false,
      message: 'Wrong answer, try again!'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking answer', error });
  }
}; 