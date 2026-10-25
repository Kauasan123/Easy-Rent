import React, { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

const normalizarDataCalendario = (valor) => {
  if (!valor) return null;

  if (typeof valor === 'string') {
    const correspondencia = valor.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (correspondencia) {
      const [, ano, mes, dia] = correspondencia;

      return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia)
      );
    }
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate()
  );
};

export function Calendario({
  modoVisualizacao = false,
  modoDataUnica = false,
  reservas = [],
  startDate: propStartDate,
  endDate: propEndDate,
  setStartDate: propSetStartDate,
  setEndDate: propSetEndDate,
  minDate,
  maxDate
}) {

  const [internalStartDate, setInternalStartDate] = useState(null);
  const [internalEndDate, setInternalEndDate] = useState(null);

  const startDate = propStartDate !== undefined ? propStartDate : internalStartDate;
  const endDate = propEndDate !== undefined ? propEndDate : internalEndDate;
  const setStartDate = propSetStartDate || setInternalStartDate;
  const setEndDate = propSetEndDate || setInternalEndDate;

  const onChange = (dates) => {
    if (modoVisualizacao) return;

    if (modoDataUnica) {
      setStartDate(dates);
      return;
    }

    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
  };

  const reservasConfirmadas = reservas.filter(
    reserva => reserva.status === 'Confirmada' &&
      reserva.start &&
      reserva.end
  );

  const dataPodeSerSelecionada = (date) => {
    const dia = normalizarDataCalendario(date);

    if (!dia) return false;

    // Bloqueia datas fora do período selecionado.
    const inicioPeriodo = normalizarDataCalendario(minDate);
    const fimPeriodo = normalizarDataCalendario(maxDate);

    if (inicioPeriodo && dia < inicioPeriodo) return false;
    if (fimPeriodo && dia > fimPeriodo) return false;

    // Bloqueia dias ocupados por reservas confirmadas.
    return !reservasConfirmadas.some(reserva => {
      const diaInicio = normalizarDataCalendario(reserva.start);
      const diaCheckout = normalizarDataCalendario(reserva.end);

      if (!diaInicio || !diaCheckout || diaCheckout <= diaInicio) {
        return false;
      }

      return dia >= diaInicio && dia < diaCheckout;
    });
  };

  const obterClasseStatusDia = (date) => {
    if (!reservasConfirmadas.length) return '';

    const diaAtual = normalizarDataCalendario(date);

    if (!diaAtual) return '';

    const reservaEncontrada = reservasConfirmadas.find(reserva => {
      const diaInicio = normalizarDataCalendario(reserva.start);
      const diaCheckout = normalizarDataCalendario(reserva.end);

      if (!diaInicio || !diaCheckout || diaCheckout <= diaInicio) {
        return false;
      }

      return diaAtual >= diaInicio && diaAtual < diaCheckout;
    });

    if (!reservaEncontrada) return '';

    return modoVisualizacao
      ? 'reserva-confirmada'
      : 'reserva-ocupada';
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
        .react-datepicker__current-month {
          font-weight: 700 !important;
          text-transform: capitalize !important;
          font-size: 0.9rem !important;
          color: #111111 !important;
        }
        .react-datepicker__day-name {
          color: #111111 !important;
          font-weight: 600 !important;
        }
        .react-datepicker__navigation {
          top: 15px !important;
        }
        
        .react-datepicker__day {
          color: #111111 !important;
          border: 1px solid transparent !important;
        }
        
        .react-datepicker__day--disabled {
          background-color: transparent !important;
          color: #cccccc !important;
          text-decoration: none !important;
          cursor: not-allowed !important;
        }

        .react-datepicker__day--excluded {
            background-color: #fef2f2 !important;
            color: #b91c1c !important;
            border: 1px solid #fca5a5 !important;
            border-radius: 4px !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
        }

        .reserva-confirmada {
          background-color: #e6f4ea !important;
          color: #137333 !important;
          font-weight: 700 !important;
          border-radius: 4px !important;
          border: 1px solid #c2e7cd !important;
          cursor: not-allowed !important;
        }

        .reserva-pendente {
          background-color: #fffbeb !important;
          color: #b45309 !important;
          font-weight: 700 !important;
          border-radius: 4px !important;
          border: 1px solid #fde68a !important;
          cursor: not-allowed !important;
        }

        .reserva-cancelada {
          background-color: #fef2f2 !important;
          color: #b91c1c !important;
          font-weight: 700 !important;
          border-radius: 4px !important;
          border: 1px solid #fca5a5 !important;
          cursor: not-allowed !important;
        }

        .reserva-ocupada {
          background-color: #fef2f2 !important;
          color: #b91c1c !important;
          border: 1px solid #fca5a5 !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
          cursor: not-allowed !important;
        }

        ${modoVisualizacao ? `
          .react-datepicker__day--today {
            background-color: transparent !important;
            border-color: #A67C52 !important;
            color: #A67C52 !important;
            border-radius: 4px !important;
            font-weight: bold !important;
          }
          .react-datepicker__day:hover {
            background-color: transparent !important;
          }
          .reserva-confirmada:hover { background-color: #e6f4ea !important; }
          .reserva-pendente:hover { background-color: #fffbeb !important; }
          .reserva-cancelada:hover { background-color: #fef2f2 !important; }
        ` : `
          .react-datepicker__day--selected, 
          .react-datepicker__day--in-range {
            background-color: #A67C52 !important;
            color: #FAF7F4 !important;
            border-radius: 4px !important;
          }
          .react-datepicker__day:hover {
            background-color: #f5f5f5 !important;
            border-radius: 4px !important;
          }
        `}
      `}</style>

      <div className="w-full flex justify-center items-center py-2">
        <DatePicker
          selected={modoVisualizacao ? null : startDate}
          onChange={onChange}
          startDate={modoVisualizacao ? null : startDate}
          endDate={modoVisualizacao ? null : endDate}
          selectsRange={!modoVisualizacao && !modoDataUnica}
          inline
          monthsShown={1}
          minDate={minDate !== undefined ? minDate : new Date()}
          maxDate={maxDate !== undefined ? maxDate : undefined}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          filterDate={
            modoVisualizacao
              ? undefined
              : dataPodeSerSelecionada
          }
          dayClassName={obterClasseStatusDia}
        />
      </div>

      {!modoVisualizacao && startDate && endDate && (
        <div className="mt-3 p-2 w-full bg-beje-principal/10 rounded-lg text-[12px] text-zinc-700 font-medium text-center border border-beje-principal/20">
          {startDate.toLocaleDateString('pt-BR')} até {endDate.toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  );
}

export default Calendario;