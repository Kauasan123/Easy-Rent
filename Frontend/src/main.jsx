import React from 'react'
import ReactDOM from 'react-dom/client'
import { NavLink } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LadingPage from './Pages/LadingPage'
import TelaLogin from './Pages/TelaLogin'
import TelaRegistro from './Pages/TelaRegistro'
import Principal from './Pages/Principal'
import LayoutPrivado from './components/LayoutPrivado'
import Perfil from './Pages/Perfil'
import MeusAlugueis from './Pages/MeusAlugueis';
import ControleGeral from './Pages/ControleGeral';
import CadastrarAluguel from './Pages/CadastrarAluguel';
import ToasterConfig from './components/ToasterConfig.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LadingPage />} />
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/registro" element={<TelaRegistro />} />
        <Route path="/principal" element={<Principal />} />

        <Route element={<LayoutPrivado />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route path='/aluguel' element={<MeusAlugueis />}></Route>
          <Route path='/controle' element={<ControleGeral />}></Route>
          <Route path='/cadastro' element={<CadastrarAluguel />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);