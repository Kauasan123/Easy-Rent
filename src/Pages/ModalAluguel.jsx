import React from 'react';
import * as Icons from '../icons/icons.js';

export function ModalDetalhes({ imovel, onClose }) {
  if (!imovel) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl relative overflow-y-auto p-8">

      </div>
    </div>
  );
}

export default ModalDetalhes;