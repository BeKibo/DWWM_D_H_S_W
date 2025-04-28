import React from "react";

function PredictionHistory({ history }) {
  if (!history.length) return null;

  return (
    <div className="mt-5">
      <h3 className="text-2xl font-semibold mb-4 px-5 uppercase">Historique des prédictions</h3>
      <ul className="space-y-6 grid grid-cols-4
">
        {history.map((item, idx) => (
          <li key={idx} className="bg-[#c4c4c4]/15 backdrop-blur border border-white/30 rounded-lg  shadow-md item-center  flex flex-col p-4 gap-2 mx-5 w-70 h-80">
    
            <img
              src={item.image}
              alt="Snapshot"
              className="w-70  rounded "
                />
            <div className="text-m mb-2 ">
             <div> {item.date} | {item.time}</div>
             <div className="flex flex-wrap w-full font-bold uppercase">{item.name}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PredictionHistory;
