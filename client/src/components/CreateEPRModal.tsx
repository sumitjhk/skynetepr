import React, { useState } from 'react';
import type { CreateEPRData } from '../types';
import { api } from '../services/api';

interface CreateEPRModalProps {
  personId: string;
  personName: string;
  roleType: 'student' | 'instructor';
  onClose: () => void;
  onCreate: () => void;
}

const CreateEPRModal: React.FC<CreateEPRModalProps> = ({
  personId,
  personName,
  roleType,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    evaluatorId: '',
    periodStart: '',
    periodEnd: '',
    overallRating: 3,
    technicalSkillsRating: 3,
    nonTechnicalSkillsRating: 3,
    remarks: '',
    status: 'draft' as const,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingRemarks, setGeneratingRemarks] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');

      if (!formData.evaluatorId) {
        setError('Please enter an evaluator ID');
        return;
      }

      if (!formData.periodStart || !formData.periodEnd) {
        setError('Please select both start and end dates');
        return;
      }

      const createData: CreateEPRData = {
        personId,
        evaluatorId: formData.evaluatorId,
        roleType,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        overallRating: formData.overallRating,
        technicalSkillsRating: formData.technicalSkillsRating,
        nonTechnicalSkillsRating: formData.nonTechnicalSkillsRating,
        remarks: formData.remarks,
        status: formData.status,
      };

      await api.createEPR(createData);
      onCreate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create EPR');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateRemarks = async () => {
    try {
      setGeneratingRemarks(true);
      setError('');

      const result = await api.assistEPR({
        overallRating: formData.overallRating,
        technicalSkillsRating: formData.technicalSkillsRating,
        nonTechnicalSkillsRating: formData.nonTechnicalSkillsRating,
      });

      setFormData({ ...formData, remarks: result.suggestedRemarks });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate remarks');
    } finally {
      setGeneratingRemarks(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create New EPR for {personName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Evaluator ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluator ID *
              </label>
              <input
                type="text"
                value={formData.evaluatorId}
                onChange={(e) => setFormData({ ...formData, evaluatorId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter evaluator UUID"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                In a real application, this would be a dropdown of available evaluators
              </p>
            </div>

            {/* Period Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period Start *
                </label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period End *
                </label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating (1-5)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.overallRating}
                  onChange={(e) => setFormData({ ...formData, overallRating: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-blue-600 min-w-[2rem]">
                  {formData.overallRating}
                </span>
              </div>
            </div>

            {/* Technical and Non-Technical Skills */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills (1-5)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.technicalSkillsRating}
                    onChange={(e) => setFormData({ ...formData, technicalSkillsRating: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-bold text-blue-600 min-w-[2rem]">
                    {formData.technicalSkillsRating}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Non-Technical Skills (1-5)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.nonTechnicalSkillsRating}
                    onChange={(e) => setFormData({ ...formData, nonTechnicalSkillsRating: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-bold text-blue-600 min-w-[2rem]">
                    {formData.nonTechnicalSkillsRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Remarks with AI Assist button */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <button
                  type="button"
                  onClick={handleGenerateRemarks}
                  disabled={generatingRemarks}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{generatingRemarks ? '⏳' : '✨'}</span>
                  {generatingRemarks ? 'Generating...' : 'Generate Suggested Remarks'}
                </button>
              </div>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y"
                placeholder="Enter performance remarks or use the AI assist button above..."
              />
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create EPR'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEPRModal;