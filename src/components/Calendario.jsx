import React, { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale/pt-BR';
import "../Calendario.css";

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