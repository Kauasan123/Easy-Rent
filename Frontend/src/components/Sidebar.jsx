import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState(localStorage.getItem('usuarioNome') || 'Usuário');
  const [email, setEmail] = useState('');
  
  const [fotoUrl, setFotoUrl] = useState('');

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    
    if (!usuarioId) {
      navigate('/login');
      return;
    }

    const buscarDadosDono = async () => {
      try {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioId}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setNome(dados.nome);
          setEmail(dados.email);
          localStorage.setItem('usuarioNome', dados.nome);
          
          if (dados.avatarPath) {
            setFotoUrl(`${import.meta.env.VITE_API_URL}${dados.avatarPath}`);
          } else {
            setFotoUrl('');
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário na Sidebar:", error);
      }
    };

    buscarDadosDono();

    window.addEventListener('focus', buscarDadosDono);
    return () => window.removeEventListener('focus', buscarDadosDono);
  }, [navigate]);

  const menuItems = [
    { name: 'Perfil', path: '/perfil', icon: <Icons.FaUser size={20} /> },
    { name: 'Meus Alugueis', path: '/aluguel', icon: <Icons.FaHouseChimney size={20} /> },
    { name: 'Controle Geral', path: '/controle', icon: <Icons.FaEye size={20} /> },
    { name: 'Cadastrar Aluguel', path: '/cadastro', icon: <Icons.MdOutlineMailOutline size={20} /> },
    { name: 'Página Principal', path: '/principal', icon: <Icons.FaSignOutAlt size={20} /> },
  ];

  return (
    <aside className="w-80 h-screen bg-fundo-cards p-8 flex flex-col gap-10 border-r border-borda-cards">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="relative flex items-center justify-center w-32 h-32">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="#A67C52"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="80 205"
              strokeDashoffset="70"
            />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="#A67C52"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="80 205"
              strokeDashoffset="210"
            />
          </svg>
          
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-beje-principal shadow-sm z-10 bg-gray-100 flex items-center justify-center">
            {fotoUrl ? (
              <img 
                src={fotoUrl} 
                className="w-full h-full object-cover" 
                alt="Foto de Perfil"
              />
            ) : (
              <Icons.FaUser size={40} className="text-cinza-texto-secundario opacity-40" />
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl text-preto-texto-principal tracking-tight">{nome}</h3>
          <p className="text-xs text-cinza-texto-secundario font-medium">{email || 'Carregando email...'}</p>
        </div>

        <button onClick={() => navigate('/perfil')} className="mt-2 bg-beje-principal hover:bg-botao-beje-apertado text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm">
          <Icons.FaPencilAlt size={12} /> Editar Perfil
        </button>
      </div>

      <hr className="border-borda-cards" />

      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${isActive
                ? 'bg-beje-principal text-white shadow-lg shadow-beje-principal/20 scale-[1.02]'
                : 'text-preto-texto-principal text-opacity-60 hover:bg-beje-principal/5 hover:text-opacity-100'}`}>
            <span className="flex items-center justify-center">
              {item.icon}
            </span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;