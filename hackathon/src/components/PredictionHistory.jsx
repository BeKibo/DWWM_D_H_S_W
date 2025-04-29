import React, { useState, useEffect } from "react";
import LiquidPagination from "./LiquidPagination";

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Dynamique selon l'écran

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
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setItemsPerPage(4); // Mobile
      } else if (width <= 1400) {
        setItemsPerPage(6); // Tablette
      } else {
        setItemsPerPage(12); // PC
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <h3 className="text-2xl font-semibold mb-4 px-5 uppercase">Gallery History</h3>
        <p className="text-gray-500 text-lg italic">No history yet.</p>
      </div>
    );
  }

  const startIndex = currentPage * itemsPerPage;
  const selectedHistory = history.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const removeSnapshot = async (snapshot) => {
    if (!snapshot) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this snapshot?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/snapshots/${snapshot.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedHistory = history.filter((snap) => snap.id !== snapshot.id);
        setHistory(updatedHistory);
        alert("Snapshot deleted successfully ✅");
      } else {
        console.error("Failed to delete snapshot on server");
      }
    } catch (error) {
      console.error("Error deleting snapshot:", error);
    }
  };

  return (
    <div className="mt-2 px-4">
      <h3 className="text-2xl font-semibold mb-6 uppercase text-center">
        Gallery History
      </h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {selectedHistory.map((item, idx) => (
          <li key={idx} className="relative bg-[#c4c4c4]/15 backdrop-blur border border-white/30 rounded-lg shadow-md flex flex-col p-4 gap-2 transition hover:scale-105 duration-300 ">
            <button
              className="absolute top-0 right-0 text-black hover:text-red-500"
              onClick={() => removeSnapshot(item)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {item.filepath && (
              <img
                src={`http://localhost:5000${item.filepath}`}
                alt="Snapshot"
                className="rounded w-full object-cover h-40 sm:h-48 md:h-56 lg:h-60"
              />
            )}

            <div className="text-sm text-center">
              <div>{item.date} | {item.time}</div>
              <div className="flex flex-wrap justify-center gap-1 font-semibold uppercase mt-1">
                {item.labels.map((label, idx2) => (
                  <span key={idx2} className="px-1">{label}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-8">
        <LiquidPagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default PredictionHistory;
