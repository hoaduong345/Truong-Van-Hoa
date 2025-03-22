import express, { Router, Request, Response } from 'express';
import Person from '../models/Person';
import { upload } from '../middleware/upload';
import path from 'path';
import fs from 'fs';
import { 
  getAllPeople, 
  createPerson, 
  deletePerson, 
  increaseScore,
  updatePerson 
} from '../controllers/person.controller';

const router = Router();

// Create a new person with file upload
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : '';
    
    const person = new Person({
      name,
      age: Number(age),
      gender,
      avatar,
      score: 0
    });

    await person.save();
    res.status(201).json(person);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all people with filters
router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { gender, sortBy = 'score', sortOrder = 'desc' } = req.query;
    const query = gender ? { gender } : {};
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const people = await Person.find(query).sort({ [sortBy as string]: sortDirection });
    return res.status(200).json(people);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching people', error });
  }
});

// Get person by ID
router.get('/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    return res.status(200).json(person);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching person', error });
  }
});

// Update person
router.put('/:id', async (req: Request, res: Response): Promise<Response> => {
  return updatePerson(req, res);
});

// Delete person
router.delete('/:id', async (req: Request, res: Response): Promise<Response> => {
  return deletePerson(req, res);
});

// Increase score
router.post('/:id/increase-score', async (req: Request, res: Response): Promise<Response> => {
  return increaseScore(req, res);
});

router.get('/', getAllPeople);
router.post('/', createPerson);

export default router; 