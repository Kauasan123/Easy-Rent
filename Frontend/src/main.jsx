import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import LadingPage from './Pages/LadingPage';
import TelaLogin from './Pages/TelaLogin';
import TelaRegistro from './Pages/TelaRegistro';
import Principal from './Pages/Principal';
import LayoutPrivado from './components/LayoutPrivado';
import Perfil from './Pages/Perfil';
import MeusAlugueis from './Pages/MeusAlugueis';
import ControleGeral from './Pages/ControleGeral';
import CadastrarAluguel from './Pages/CadastrarAluguel';
import ControleUnico from './Pages/ControleUnico.jsx';
import ControlePagamento from './Pages/ControlePagamento.jsx';
import VerReservas from './Pages/VerReservas.jsx';
import RevisaoReserva from './Pages/RevisaoReserva.jsx';
import Pagamento from './Pages/Pagamento.jsx';
import ConclusaoPagamento from './Pages/ConclusaoPagamento.jsx';
import VerDetalhesReserva from './Pages/VerDetalhesReserva.jsx';
import BotaoChat from './components/Chat';

import './index.css';

function ChatCondicional() {
    const { pathname } = useLocation();

    const paginasSemChat = ['/', '/login', '/registro'];

    if (paginasSemChat.includes(pathname)) {
        return null;
    }

    return <BotaoChat />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ChatCondicional />

            <Routes>
                <Route path="/" element={<LadingPage />} />
                <Route path="/login" element={<TelaLogin />} />
                <Route path="/registro" element={<TelaRegistro />} />
                <Route path="/principal" element={<Principal />} />
                <Route path="/verReservas" element={<VerReservas />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/conclusaoPagamento" element={<ConclusaoPagamento />} />
                <Route path="/revisaoReserva" element={<RevisaoReserva />} />
                <Route path="/detalhesReserva/:id" element={<VerDetalhesReserva />} />

                <Route element={<LayoutPrivado />}>
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/aluguel" element={<MeusAlugueis />} />
                    <Route path="/controle" element={<ControleGeral />} />
                    <Route path="/cadastro" element={<CadastrarAluguel />} />
                    <Route path="/controleunico" element={<ControleUnico />} />
                    <Route path="/controlepagamento" element={<ControlePagamento />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);