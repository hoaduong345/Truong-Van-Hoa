import { Request, Response } from 'express';
import Person from '../models/Person';

export const getAllPeople = async (req: Request, res: Response) => {
  try {
    const { gender, sortBy = 'score', sortOrder = 'desc' } = req.query;
    let query: any = {};

    if (gender) {
      query.gender = gender;
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const people = await Person.find(query).sort(sortOptions);
    res.json(people);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching people', error });
  }
};

export const createPerson = async (req: Request, res: Response) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ message: 'Error creating person', error });
  }
};

export const deletePerson = async (req: Request, res: Response): Promise<Response> => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    return res.status(200).json({ message: 'Person deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting person', error });
  }
};

export const increaseScore = async (req: Request, res: Response): Promise<Response> => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    person.score += 100; // Increase score by 100
    await person.save();

    return res.status(200).json(person);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating score', error });
  }
};

export const updatePerson = async (req: Request, res: Response): Promise<Response> => {
  try {
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    return res.status(200).json(person);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating person', error });
  }
}; 