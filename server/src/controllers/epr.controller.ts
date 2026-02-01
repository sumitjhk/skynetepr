import { Request, Response } from 'express';
import eprService from '../services/epr.service';
import { CreateEPRRequest, UpdateEPRRequest, AssistRequest } from '../types/index';

export class EPRController {
  async getEPRs(req: Request, res: Response) {
    try {
      const { personId } = req.query;

      if (!personId) {
        return res.status(400).json({ error: 'personId query parameter is required' });
      }

      const eprs = await eprService.getEPRsByPersonId(personId as string);
      res.json(eprs);
    } catch (error) {
      console.error('Error fetching EPRs:', error);
      res.status(500).json({ 
        error: 'Failed to fetch EPRs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getEPRById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const epr = await eprService.getEPRById(id);

      if (!epr) {
        return res.status(404).json({ error: 'EPR not found' });
      }

      res.json(epr);
    } catch (error) {
      console.error('Error fetching EPR:', error);
      res.status(500).json({ 
        error: 'Failed to fetch EPR',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createEPR(req: Request, res: Response) {
    try {
      const data: CreateEPRRequest = {
        personId: req.body.personId,
        evaluatorId: req.body.evaluatorId,
        roleType: req.body.roleType,
        periodStart: req.body.periodStart,
        periodEnd: req.body.periodEnd,
        overallRating: parseInt(req.body.overallRating),
        technicalSkillsRating: parseInt(req.body.technicalSkillsRating),
        nonTechnicalSkillsRating: parseInt(req.body.nonTechnicalSkillsRating),
        remarks: req.body.remarks || '',
        status: req.body.status || 'draft'
      };

      const epr = await eprService.createEPR(data);
      res.status(201).json(epr);
    } catch (error) {
      console.error('Error creating EPR:', error);
      res.status(400).json({ 
        error: 'Failed to create EPR',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateEPR(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateEPRRequest = {};

      if (req.body.overallRating !== undefined) {
        data.overallRating = parseInt(req.body.overallRating);
      }
      if (req.body.technicalSkillsRating !== undefined) {
        data.technicalSkillsRating = parseInt(req.body.technicalSkillsRating);
      }
      if (req.body.nonTechnicalSkillsRating !== undefined) {
        data.nonTechnicalSkillsRating = parseInt(req.body.nonTechnicalSkillsRating);
      }
      if (req.body.remarks !== undefined) {
        data.remarks = req.body.remarks;
      }
      if (req.body.status !== undefined) {
        data.status = req.body.status;
      }

      const epr = await eprService.updateEPR(id, data);
      res.json(epr);
    } catch (error) {
      console.error('Error updating EPR:', error);
      res.status(400).json({ 
        error: 'Failed to update EPR',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async assistEPR(req: Request, res: Response) {
    try {
      const data: AssistRequest = {
        overallRating: parseInt(req.body.overallRating),
        technicalSkillsRating: parseInt(req.body.technicalSkillsRating),
        nonTechnicalSkillsRating: parseInt(req.body.nonTechnicalSkillsRating)
      };

      // Validate all three ratings
      const ratings = [
        { value: data.overallRating, name: 'overallRating' },
        { value: data.technicalSkillsRating, name: 'technicalSkillsRating' },
        { value: data.nonTechnicalSkillsRating, name: 'nonTechnicalSkillsRating' }
      ];

      for (const rating of ratings) {
        if (isNaN(rating.value) || rating.value < 1 || rating.value > 5) {
          return res.status(400).json({
            error: `${rating.name} must be an integer between 1 and 5`
          });
        }
      }

      const result = eprService.assistEPR(data);
      res.json(result);
    } catch (error) {
      console.error('Error generating suggested remarks:', error);
      res.status(500).json({ 
        error: 'Failed to generate suggested remarks',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new EPRController();