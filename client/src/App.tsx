import React, { useState, useEffect } from 'react';
import type { Person, EPR } from './types';
import { api } from './services/api';
import EPRModal from './components/EPRModal';
import CreateEPRModal from './components/CreateEPRModal';

function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'instructor'>('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [eprs, setEprs] = useState<EPR[]>([]);
  const [selectedEPR, setSelectedEPR] = useState<EPR | null>(null);
  const [showCreateEPRModal, setShowCreateEPRModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch people based on filters
  useEffect(() => {
    fetchPeople();
  }, [activeTab, searchTerm]);

  // Fetch EPRs when person is selected
  useEffect(() => {
    if (selectedPerson) {
      fetchEPRs(selectedPerson.id);
    }
  }, [selectedPerson]);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getPeople(activeTab, searchTerm);
      setPeople(data);
    } catch (err) {
      setError('Failed to load people');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEPRs = async (personId: string) => {
    try {
      const data = await api.getEPRs(personId);
      setEprs(data);
    } catch (err) {
      console.error('Failed to fetch EPRs:', err);
    }
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleEPRClick = (epr: EPR) => {
    setSelectedEPR(epr);
  };

  const handleCloseEPRModal = () => {
    setSelectedEPR(null);
  };

  const handleEPRUpdate = () => {
    if (selectedPerson) {
      fetchEPRs(selectedPerson.id);
    }
  };

  const handleCreateEPR = () => {
    if (selectedPerson) {
      fetchEPRs(selectedPerson.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'instructor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-indigo-100 text-indigo-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Skynet EPR</h1>
          <p className="text-blue-100 text-sm mt-1">Electronic Progress & Performance Records</p>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex gap-6">
        {/* Left Pane - People Directory */}
        <div className="w-96 flex flex-col gap-4">
          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'instructor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Instructors
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* People List */}
          <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden">
            <h3 className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-900">
              {activeTab === 'student' ? 'Students' : 'Instructors'}
            </h3>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 px-4 py-3 m-4 rounded-lg">{error}</div>
              ) : people.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {activeTab}s found</p>
                </div>
              ) : (
                people.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => handlePersonClick(person)}
                    className={`px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedPerson?.id === person.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{person.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(person.role)}`}>
                        {person.role}
                      </span>
                      {person.course_name && (
                        <>
                          <span>•</span>
                          <span>{person.course_name}</span>
                        </>
                      )}
                      {person.enrollment_status && (
                        <>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(person.enrollment_status)}`}>
                            {person.enrollment_status}
                          </span>
                        </>
                      )}
                      {person.total_eprs_written !== undefined && (
                        <>
                          <span>•</span>
                          <span>{person.total_eprs_written} EPRs written</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Pane - Person Details & EPRs */}
        <div className="flex-1 flex flex-col gap-6">
          {!selectedPerson ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a person to view details</h3>
              <p className="text-gray-600">Choose a student or instructor from the list to see their performance records</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              {/* Person Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPerson.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="mt-1 text-base text-gray-900">{selectedPerson.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                    <div className="mt-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedPerson.role)}`}>
                        {selectedPerson.role}
                      </span>
                    </div>
                  </div>
                  {selectedPerson.course_name && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</label>
                      <p className="mt-1 text-base text-gray-900">{selectedPerson.course_name}</p>
                    </div>
                  )}
                  {selectedPerson.enrollment_status && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                      <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedPerson.enrollment_status)}`}>
                          {selectedPerson.enrollment_status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* EPR Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Records</h3>
                  <button
                    onClick={() => setShowCreateEPRModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    + New EPR
                  </button>
                </div>

                {eprs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No performance records yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {eprs.map((epr) => (
                      <div
                        key={epr.id}
                        onClick={() => handleEPRClick(epr)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900">
                            {formatDate(epr.period_start)} – {formatDate(epr.period_end)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(epr.status)}`}>
                            {epr.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">{renderStars(epr.overall_rating)}</span>
                            <span className="font-medium">{epr.overall_rating}/5</span>
                          </div>
                          <span>•</span>
                          <span>Evaluator: {epr.evaluator_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedEPR && (
        <EPRModal
          epr={selectedEPR}
          onClose={handleCloseEPRModal}
          onUpdate={handleEPRUpdate}
        />
      )}

      {showCreateEPRModal && selectedPerson && (
        <CreateEPRModal
          personId={selectedPerson.id}
          personName={selectedPerson.name}
          roleType={selectedPerson.role as 'student' | 'instructor'}
          onClose={() => setShowCreateEPRModal(false)}
          onCreate={handleCreateEPR}
        />
      )}
    </div>
  );
}

export default App;
