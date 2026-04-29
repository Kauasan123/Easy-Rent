import { useState } from 'react'
import Header from './components/Header'
import imagemHero from './assets/hero-imagem.png'
import * as Icons from './icons/icons'

function App() {
  const [count, setCount] = useState(0)

  return (
<>
  <Header />
  {/* Hero */}
  <section className='grid grid-cols-[520px_560px] justify-center items-center mx-auto pt-20 pb-15 px-10 gap-10 lg:gap-20 xl:gap-32 2xl:gap-58'>
    <div className='flex flex-col items-start gap-6 max-w-[520px]'>
      <div className='text-5xl font-bold text-preto-texto-principal leading-[1.1]'>
        <h1>
          Seu próximo aluguel não deveria levar dias 
          <span className='text-beje-principal'> — e sim minutos.</span>
        </h1>
      </div>
      <p className='text-preto-texto-principal text-lg leading-relaxed'>
        O Easy Rent transforma a forma de lidar com imóveis: uma plataforma rápida, intuitiva e centralizada para quem quer reservar um lugar ideal ou anunciar seu próprio espaço sem complicação. Aqui, tudo é simples, direto e sem burocracia.
      </p>
      <div className='flex gap-6 pt-1.5'>
          <a href="#" className='hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border rounded-[0.313rem] text-[1.150rem] py-3 pl-[2rem] pr-[2rem] cursor-pointer active:scale-95 transition-all whitespace-nowrap'>
            Registrar-se
          </a>
          <p className='text-center text-preto-texto-principal max-w-[230px]'>
            <span className='text-beje-principal'>+5,000 pessoas</span> como tu já usaram este produto.
          </p>
      </div>
    </div>
    <div className='flex justify-end'>
      <img src={imagemHero} alt="Interior moderno" className='w-[560px] h-[640px] object-cover rounded-[2.5rem] shadow-sm'/>
    </div>
  </section>

  {/* Seção de Beneficios */}
  <section className='bg-fundo-principal w-full flex flex-col items-center justify-center pt-15 pb-15 px-10'>
    <div className='max-w-[640px] text-center mb-16'>
      <h1 className='text-[2.25rem] font-semibold text-preto-texto-principal leading-tight'>
        Tudo que você precisa para <span className='text-beje-principal'> alugar e reservar</span> em um só lugar.
      </h1>
    </div>

    <div className='grid grid-cols-4 gap-10 justify-items-center max-w-[1440px] mx-auto w-full'>
        {/* Card 1 */}
      <div className='flex flex-col items-center text-center w-[260px]'>
        <Icons.LuTimer className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50}/>
        <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Rápido</h2>
        <p className='text-gray-600 leading-relaxed'>Encontre, reserve ou anuncie imóveis em poucos minutos, sem perder tempo.</p>
      </div>

        {/* Card 2 */}
      <div className='flex flex-col items-center text-center w-[260px]'>
        <Icons.FaMousePointer className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50}/>
        <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Fácil de Usar</h2>
        <p className='text-gray-600 leading-relaxed'>Navegue por uma plataforma simples e intuitiva para buscar ou cadastrar seu imóvel.</p>
      </div>

        {/* Card 3 */}
      <div className='flex flex-col items-center text-center w-[260px]'>
        <Icons.IoIosUnlock className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50}/>
        <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Segurança</h2>
        <p className='text-gray-600 leading-relaxed'>Suas informações protegidas e transações confiáveis para quem aluga ou anuncia.</p>
      </div>

        {/* Card 4 */}
      <div className='flex flex-col items-center text-center w-[260px]'>
        <Icons.FiEye className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50}/>
        <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Transparência</h2>
        <p className='text-gray-600 leading-relaxed'>Sem taxas escondidas, com valores claros para quem reserva ou disponibiliza imóveis.</p>
      </div>
    </div>
  </section>
</>
  )
}

export default App
