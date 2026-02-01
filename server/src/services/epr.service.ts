import db from '../db/config';
import { EPRRecord, CreateEPRRequest, UpdateEPRRequest, AssistRequest, AssistResponse } from '../types';

export class EPRService {
  async getEPRsByPersonId(personId: string): Promise<any[]> {
    const eprs = await db('epr_records')
      .select(
        'epr_records.*',
        'person.name as person_name',
        'evaluator.name as evaluator_name'
      )
      .leftJoin('users as person', 'epr_records.person_id', 'person.id')
      .leftJoin('users as evaluator', 'epr_records.evaluator_id', 'evaluator.id')
      .where('epr_records.person_id', personId)
      .orderBy('epr_records.period_start', 'desc');

    return eprs;
  }

  async getEPRById(id: string): Promise<any> {
    const epr = await db('epr_records')
      .select(
        'epr_records.*',
        'person.name as person_name',
        'person.role as person_role',
        'evaluator.name as evaluator_name'
      )
      .leftJoin('users as person', 'epr_records.person_id', 'person.id')
      .leftJoin('users as evaluator', 'epr_records.evaluator_id', 'evaluator.id')
      .where('epr_records.id', id)
      .first();

    return epr;
  }

  async createEPR(data: CreateEPRRequest): Promise<EPRRecord> {
    this.validateRating(data.overallRating, 'Overall rating');
    this.validateRating(data.technicalSkillsRating, 'Technical skills rating');
    this.validateRating(data.nonTechnicalSkillsRating, 'Non-technical skills rating');

    const startDate = new Date(data.periodStart);
    const endDate = new Date(data.periodEnd);
    
    if (endDate < startDate) {
      throw new Error('Period end date must be after or equal to start date');
    }

    const person = await db('users').where({ id: data.personId }).first();
    if (!person) {
      throw new Error('Person not found');
    }

    const evaluator = await db('users').where({ id: data.evaluatorId }).first();
    if (!evaluator) {
      throw new Error('Evaluator not found');
    }

    const [epr] = await db('epr_records').insert({
      person_id: data.personId,
      evaluator_id: data.evaluatorId,
      role_type: data.roleType,
      period_start: data.periodStart,
      period_end: data.periodEnd,
      overall_rating: data.overallRating,
      technical_skills_rating: data.technicalSkillsRating,
      non_technical_skills_rating: data.nonTechnicalSkillsRating,
      remarks: data.remarks,
      status: data.status
    }).returning('*');

    return epr;
  }

  async updateEPR(id: string, data: UpdateEPRRequest): Promise<EPRRecord> {
    if (data.overallRating !== undefined) {
      this.validateRating(data.overallRating, 'Overall rating');
    }
    if (data.technicalSkillsRating !== undefined) {
      this.validateRating(data.technicalSkillsRating, 'Technical skills rating');
    }
    if (data.nonTechnicalSkillsRating !== undefined) {
      this.validateRating(data.nonTechnicalSkillsRating, 'Non-technical skills rating');
    }

    const updateData: any = {
      updated_at: db.fn.now()
    };

    if (data.overallRating !== undefined) updateData.overall_rating = data.overallRating;
    if (data.technicalSkillsRating !== undefined) updateData.technical_skills_rating = data.technicalSkillsRating;
    if (data.nonTechnicalSkillsRating !== undefined) updateData.non_technical_skills_rating = data.nonTechnicalSkillsRating;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;
    if (data.status !== undefined) updateData.status = data.status;

    const [updatedEPR] = await db('epr_records')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!updatedEPR) {
      throw new Error('EPR not found');
    }

    return updatedEPR;
  }

  assistEPR(data: AssistRequest): AssistResponse {
    const { overallRating, technicalSkillsRating, nonTechnicalSkillsRating } = data;
    const average = (overallRating + technicalSkillsRating + nonTechnicalSkillsRating) / 3;

    let technicalComment = '';
    if (technicalSkillsRating >= 4) {
      technicalComment = 'demonstrates strong technical fundamentals including aircraft systems knowledge and flight procedures';
    } else if (technicalSkillsRating === 3) {
      technicalComment = 'shows adequate technical knowledge but should dedicate more time to reviewing aircraft systems and standard operating procedures';
    } else {
      technicalComment = 'needs significant improvement in technical areas, particularly aircraft systems knowledge and flight procedures';
    }

    let nonTechnicalComment = '';
    if (nonTechnicalSkillsRating >= 4) {
      nonTechnicalComment = 'excels in crew resource management, communication, and checklist discipline';
    } else if (nonTechnicalSkillsRating === 3) {
      nonTechnicalComment = 'demonstrates satisfactory crew resource management and communication skills, but should focus on improving checklist discipline and situational awareness';
    } else {
      nonTechnicalComment = 'requires improvement in non-technical skills such as crew resource management, communication, and checklist discipline';
    }

    let closingComment = '';
    if (average >= 4) {
      closingComment = 'Overall, this is a commendable performance and continued dedication at this level is encouraged.';
    } else if (average >= 3) {
      closingComment = 'Overall, performance is satisfactory. Continued effort and focused practice in identified areas will support further progress.';
    } else {
      closingComment = 'Overall, performance is below expectations. A structured improvement plan and closer mentoring are recommended.';
    }

    const suggestedRemarks = `The individual ${technicalComment}. Additionally, ${nonTechnicalComment}. ${closingComment}`;

    return { suggestedRemarks };
  }

  private validateRating(rating: number, fieldName: string): void {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error(`${fieldName} must be an integer between 1 and 5`);
    }
  }
}

export default new EPRService();