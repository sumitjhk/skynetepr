import { Request, Response } from 'express';
import peopleService from '../services/people.service';

export class PeopleController {
  async getPeople(req: Request, res: Response) {
    try {
      const { role, search } = req.query;
      
      const people = await peopleService.getPeopleList(
        role as string | undefined,
        search as string | undefined
      );

      res.json(people);
    } catch (error) {
      console.error('Error fetching people:', error);
      res.status(500).json({ 
        error: 'Failed to fetch people',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getPersonById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const person = await peopleService.getPersonById(id);

      if (!person) {
        return res.status(404).json({ error: 'Person not found' });
      }

      res.json(person);
    } catch (error) {
      console.error('Error fetching person:', error);
      res.status(500).json({ 
        error: 'Failed to fetch person',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new PeopleController();