import { Router } from 'express';
import peopleController from '../controllers/people.controller';
import eprController from '../controllers/epr.controller';

const router = Router();

// Base API route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Skynet EPR API',
    version: '1.0.0',
    endpoints: [
      'GET /api/people',
      'GET /api/people/:id',
      'GET /api/epr?personId=xxx',
      'GET /api/epr/:id',
      'POST /api/epr',
      'PATCH /api/epr/:id',
      'POST /api/epr/assist'
    ]
  });
});

// People routes
router.get('/people', peopleController.getPeople);
router.get('/people/:id', peopleController.getPersonById);

// EPR Assist route — must be BEFORE /epr/:id, otherwise Express treats "assist" as an :id
router.post('/epr/assist', eprController.assistEPR.bind(eprController));

// EPR routes
router.get('/epr', eprController.getEPRs.bind(eprController));
router.get('/epr/:id', eprController.getEPRById.bind(eprController));
router.post('/epr', eprController.createEPR.bind(eprController));
router.patch('/epr/:id', eprController.updateEPR.bind(eprController));

export default router;