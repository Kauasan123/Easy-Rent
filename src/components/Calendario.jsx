import React, { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

export function Calendario() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
      .react-datepicker {
          border: none !important;
          font-family: inherit !important;
          background: #FAF7F4 !important;
          margin-top: -15px !important;
        }
        .react-datepicker__header {
          background-color: #FAF7F4 !important;
          border-bottom: 1px solid #f1f1f1 !important;
          padding-top: 0 !important;
        }
        .react-datepicker__day--selected, 
        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: #A67C52 !important;
          color: #FAF7F4 !important;
          border-radius: 4px !important;
        }
        .react-datepicker__day:hover {
          background-color: #f5f5f5 !important;
          border-radius: 4px !important;
        }
        .react-datepicker__current-month {
          font-weight: 700 !important;
          text-transform: capitalize !important;
          font-size: 0.9rem !important;
        }
        .react-datepicker__day-name {
          color: #111111 !important;
          font-weight: 600 !important;
        }
        .react-datepicker__navigation {
          top: 15px !important;
        }
      `}</style>

      <div className="w-full flex justify-center items-center py-2">
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          monthsShown={1}
          minDate={new Date()}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      {startDate && endDate && (
        <div className="mt-3 p-2 w-full bg-beje-principal/10 rounded-lg text-[12px] text-zinc-700 font-medium text-center border border-beje-principal/20">
          {startDate.toLocaleDateString('pt-BR')} até {endDate.toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  );
}

export default Calendario;