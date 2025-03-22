import { Router, Request, Response } from 'express';
import Question from '../models/Question';
import Person from '../models/Person';
import { getRandomQuestion, checkAnswer } from '../controllers/questionController';

const router = Router();

// Get random question
router.get('/random', async (req: Request, res: Response): Promise<Response> => {
  return getRandomQuestion(req, res);
});

// Check answer
router.post('/check-answer', async (req: Request, res: Response): Promise<Response> => {
  return checkAnswer(req, res);
});

export default router; 