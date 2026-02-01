import React, { useState } from 'react';
import type { EPR, UpdateEPRData } from '../types';
import { api } from '../services/api';

interface EPRModalProps {
  epr: EPR;
  onClose: () => void;
  onUpdate: () => void;
}

const EPRModal: React.FC<EPRModalProps> = ({ epr, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    overallRating: epr.overall_rating,
    technicalSkillsRating: epr.technical_skills_rating,
    nonTechnicalSkillsRating: epr.non_technical_skills_rating,
    remarks: epr.remarks,
    status: epr.status,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingRemarks, setGeneratingRemarks] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const updateData: UpdateEPRData = {
        overallRating: formData.overallRating,
        technicalSkillsRating: formData.technicalSkillsRating,
        nonTechnicalSkillsRating: formData.nonTechnicalSkillsRating,
        remarks: formData.remarks,
        status: formData.status,
      };

      await api.updateEPR(epr.id, updateData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save EPR');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit EPR' : 'EPR Details'}
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

          {!isEditing ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Person</label>
                  <p className="mt-1 text-base text-gray-900">{epr.person_name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Evaluator</label>
                  <p className="mt-1 text-base text-gray-900">{epr.evaluator_name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(epr.status)}`}>
                      {epr.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Period */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</label>
                    <p className="mt-1 text-base text-gray-900">{formatDate(epr.period_start)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</label>
                    <p className="mt-1 text-base text-gray-900">{formatDate(epr.period_end)}</p>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Rating</label>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-3xl font-bold text-blue-600">{epr.overall_rating}</span>
                      <span className="text-yellow-400 text-xl">{renderStars(epr.overall_rating)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Technical Skills</label>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-3xl font-bold text-blue-600">{epr.technical_skills_rating}</span>
                      <span className="text-yellow-400 text-xl">{renderStars(epr.technical_skills_rating)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Non-Technical Skills</label>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-3xl font-bold text-blue-600">{epr.non_technical_skills_rating}</span>
                      <span className="text-yellow-400 text-xl">{renderStars(epr.non_technical_skills_rating)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {epr.remarks || 'No remarks provided'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit EPR
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EPRModal;