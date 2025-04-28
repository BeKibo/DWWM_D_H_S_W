import React, { useState } from "react";

function PredictionHistory({ history }) {
  const [currentPage, setCurrentPage] = useState(0); // Nouvelle page
  const itemsPerPage = 12; // 12 cartes par page

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
        Historique des prédictions
      </h3>

      <ul className="space-y-6 grid grid-cols-4">
        {selectedHistory.map((item, idx) => (
          <li key={idx} className="bg-[#c4c4c4]/15 backdrop-blur border border-white/30 rounded-lg shadow-md flex flex-col p-4 gap-2 mx-5 w-50 h-60">
            
            {item.image && (
              <img
                src={item.image}
                alt="Snapshot"
                className="w-50 rounded"
              />
            )}

            <div className="text-m mb-2">
              <div>{item.date} | {item.time}</div>
              <div className="flex flex-wrap w-full font-bold uppercase">{item.name}</div>
            </div>

          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center  gap-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-xl font-semibold">{currentPage + 1} / {totalPages}</span>
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
