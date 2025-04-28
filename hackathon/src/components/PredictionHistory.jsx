import React, { useState, useEffect } from "react";

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/snapshots');
        const data = await response.json();
        setHistory(data.reverse());
      } catch (error) {
        console.error('Failed to fetch snapshots', error);
      }
    };

    fetchHistory();
  }, []); // Le composant sera recréé quand reloadId change grâce à la key dynamique

  if (!history.length) return null;

  const startIndex = currentPage * itemsPerPage;
  const selectedHistory = history.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="mt-5">
      <h3 className="text-2xl font-semibold mb-4 px-5 uppercase">
        Gallery History
      </h3>

      <ul className="space-y-6 grid grid-cols-4">
        {selectedHistory.map((item, idx) => (
          <li key={idx} className="bg-[#c4c4c4]/15 backdrop-blur border border-white/30 rounded-lg shadow-md flex flex-col p-4 gap-2 mx-5 w-55 h-60">
            {item.filepath && (
              <img
                src={`http://localhost:5000${item.filepath}`}
                alt="Snapshot"
                className="w-55 rounded"
              />
            )}

            <div className="text-s">
              <div>{item.date} | {item.time}</div>
              <div className="flex flex-wrap w-full">
                {item.labels.map((label, idx2) => (
                  <span key={idx2} className="px-1">{label}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-xl font-semibold">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default PredictionHistory;
