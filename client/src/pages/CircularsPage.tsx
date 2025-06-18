import React, { useState, useEffect } from 'react';
import { useCirculars } from '../hooks/useCirculars';
import CircularCard from '../components/circulars/CircularCard';
import CircularDetail from '../components/circulars/CircularDetail';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/shared/LoadingSpinner';
// Assuming a modal component for New Circular exists or will be created
// import NewCircularModal from '../components/circulars/NewCircularModal'; 

const CircularsPage = () => {
  const { circulars, selectedCircular, selectCircular, isLoading, error } = useCirculars();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  // const [showNewCircularModal, setShowNewCircularModal] = useState(false); // State for modal // Removed

  useEffect(() => {
    console.log('CircularsPage - isLoading:', isLoading, 'error:', error, 'circulars:', circulars);
  }, [isLoading, error, circulars]);

  const filteredCirculars = searchTerm 
    ? circulars.filter(circular => 
        circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circular.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : circulars;

  // const handleNewCircularClick = () => { // Removed
  //   setShowNewCircularModal(true); // Removed
  // }; // Removed

  // const handleCloseNewCircularModal = () => { // Removed
  //   setShowNewCircularModal(false); // Removed
  // }; // Removed

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        <p>Error loading circulars: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Circulars</h1>
          <p className="text-gray-600">
            View important announcements and circulars
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            className="btn-primary flex items-center"
            // onClick={handleNewCircularClick} // Add click handler // Removed
          >
            <Plus size={18} className="mr-2" />
            New Circular
          </button>
        )}
      </div>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search circulars..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`w-full ${selectedCircular ? 'md:w-1/2' : ''} space-y-4`}>
          {filteredCirculars.length > 0 ? (
            filteredCirculars.map(circular => (
              <CircularCard 
                key={circular.id} 
                circular={circular} 
                onClick={selectCircular}
                isSelected={selectedCircular?.id === circular.id}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No circulars found{searchTerm && ` for '${searchTerm}'`}.</p>
            </div>
          )}
        </div>
        
        {selectedCircular && (
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm h-[calc(100vh-12rem)] overflow-hidden">
            <CircularDetail 
              circular={selectedCircular} 
              onClose={() => selectCircular(null)} 
            />
          </div>
        )}
      </div>

      {/* Placeholder for New Circular Modal */}
      {/* {showNewCircularModal && (
        <NewCircularModal onClose={handleCloseNewCircularModal} />
      )} */}
    </div>
  );
};

export default CircularsPage;
