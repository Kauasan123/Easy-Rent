import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import imagemHero from '../assets/Lading-page/hero-imagem.png'
import imagemComoFunciona from '../assets/Lading-page/como-funciona-imagem.png'
import imagemComoFunciona2 from '../assets/Lading-page/como-funciona-imagem2.png'
import HeaderLogado from '../components/HeaderLogado.jsx'
import { fotosPerfis } from '../assets/Lading-page/Foto-perfis/perfis.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import * as Icons from '../icons/icons.js'

import 'swiper/css';
import 'swiper/css/autoplay';

const depoimentos = [
  { nome: "Carlos Mendes", texto: "“Consegui encontrar um lugar perfeito em poucos minutos. Muito prático!”", foto: fotosPerfis[0] },
  { nome: "Fernanda Alves", texto: "“A plataforma é super fácil de usar, não tive nenhuma dificuldade.”", foto: fotosPerfis[1] },
  { nome: "Juliana Rocha", texto: "“Tudo muito simples e intuitivo. Amei a experiência!”", foto: fotosPerfis[2] },
  { nome: "Eduarda Zevedo", texto: "“Finalmente um site sem burocracia. Resolveu meu problema rápido.”", foto: fotosPerfis[3] },
  { nome: "Ricardo Silva", texto: "“Os preços são claros e não tive surpresas na hora de reservar.”", foto: fotosPerfis[4] },
  { nome: "Ana Paula", texto: "“Encontrei várias opções boas e consegui escolher com tranquilidade.”", foto: fotosPerfis[5] },
  { nome: "Marcos Viana", texto: "“Experiência muito boa, rápida e segura. Recomendo!”", foto: fotosPerfis[6] },
];

function App() {
  const [count, setCount] = useState(0)

  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      
      setTimeout(() => {
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return (
    <>
      <header>
        <Header />
      </header>
      
      {/* Hero */}
      <section id="Sobre" className='grid grid-cols-[520px_560px] justify-center items-center mx-auto pt-20 pb-15 px-10 gap-10 lg:gap-20 xl:gap-32 2xl:gap-58'>
        <div className='flex flex-col items-start gap-6 max-w-130'>
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
            <Link to="/registro" className='hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border rounded-[0.313rem] text-[1.150rem] py-3 pl-rem-2 pr-rem-2 cursor-pointer active:scale-95 transition-all whitespace-nowrap'>
              Registrar-se
            </Link>
            <p className='text-center text-preto-texto-principal max-w-230'>
              <span className='text-beje-principal'>+5,000 pessoas</span> como tu já usaram este produto.
            </p>
          </div>
        </div>
        <div className='flex justify-end'>
          <img src={imagemHero} alt="Interior moderno" className='w-560 h-640 object-cover rounded-[2.5rem] shadow-sm' />
        </div>
      </section>

      {/* Seção de Beneficios - Benefits Section */}
      <section className='bg-fundo-principal w-full flex flex-col items-center justify-center pt-15 pb-15 px-10'>
        <div className='max-w-640 text-center mb-16'>
          <h1 className='text-[2.25rem] font-semibold text-preto-texto-principal leading-tight'>
            Tudo que você precisa para <span className='text-beje-principal'> alugar e reservar</span> em um só lugar.
          </h1>
        </div>

        <div className='grid grid-cols-4 gap-10 justify-items-center max-w-1440 mx-auto w-full'>
          {/* Card 1 */}
          <div className='flex flex-col items-center text-center w-65'>
            <Icons.LuTimer className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50} />
            <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Rápido</h2>
            <p className='text-gray-600 leading-relaxed'>Encontre, reserve ou anuncie imóveis em poucos minutos, sem perder tempo.</p>
          </div>

          {/* Card 2 */}
          <div className='flex flex-col items-center text-center w-65'>
            <Icons.FaMousePointer className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50} />
            <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Fácil de Usar</h2>
            <p className='text-gray-600 leading-relaxed'>Navegue por uma plataforma simples e intuitiva para buscar ou cadastrar seu imóvel.</p>
          </div>

          {/* Card 3 */}
          <div className='flex flex-col items-center text-center w-65'>
            <Icons.IoIosUnlock className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50} />
            <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Segurança</h2>
            <p className='text-gray-600 leading-relaxed'>Suas informações protegidas e transações confiáveis para quem aluga ou anuncia.</p>
          </div>

          {/* Card 4 */}
          <div className='flex flex-col items-center text-center w-65'>
            <Icons.FiEye className='text-beje-principal drop-shadow-[1px_2px_0px_rgba(0,0,0,1)] mb-4' size={50} />
            <h2 className='text-2xl mb-2 font-semibold text-preto-principal'>Transparência</h2>
            <p className='text-gray-600 leading-relaxed'>Sem taxas escondidas, com valores claros para quem reserva ou disponibiliza imóveis.</p>
          </div>
        </div>
      </section>

      {/* Seção como Funciona Alugar - How it Works */}
      <section id="Alugar" className='grid grid-cols-[520px_560px] justify-center items-center mx-auto pt-20 pb-15 px-10 gap-10 lg:gap-20 xl:gap-32 2xl:gap-58'>

        <div className='flex flex-col items-start gap-6 max-w-130'>
          <div className='text-preto-texto-principal text-5xl font-bold leading-[1.1]'>
            <h1>Alugue em Poucos Passos</h1>
          </div>

          <div>
            <p className='text-preto-texto-principal text-lg leading-relaxed mb-6'>
              Em poucos cliques, você encontra e reserva o imóvel ideal sem complicação.
            </p>

            <div></div>
            {/* Passo 1 */}
            <div className='flex flex-col gap-6'>
              <div className='flex items-start gap-4'>
                <p className='text-beje-principal text-5xl leading-none'>1</p>
                <div className='flex flex-col'>
                  <p>Busque Imóveis</p>
                  <p>Encontre opções filtrando por localização, preço e preferências.</p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className='flex items-start gap-4'>
                <p className='text-beje-principal text-5xl leading-none'>2</p>
                <div className='flex flex-col'>
                  <p>Escolha o Ideal</p>
                  <p>Veja fotos, detalhes e selecione as datas que deseja.</p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className='flex items-start gap-4'>
                <p className='text-beje-principal text-5xl leading-none'>3</p>
                <div className='flex flex-col'>
                  <p>Reserve com Facilidade</p>
                  <p>Finalize sua reserva de forma rápida e segura.</p>
                </div>
              </div>
            </div>
          </div>
          <Link to="/login" className='hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border rounded-[0.313rem] text-[1.150rem] py-3 pl-rem-2 pr-rem-2 cursor-pointer active:scale-95 transition-all whitespace-nowrap'>
            Começar Agora
          </Link>
        </div>

        <div className='flex justify-end'>
          <img src={imagemComoFunciona} alt="Interior moderno" className='w-560 h-640 object-cover rounded-[2.5rem] shadow-sm' />
        </div>
      </section>

      {/* Seção como Funciona Anuncio - How it Works */}
      <section id="Anunciar" className='grid grid-cols-[520px_560px] justify-center items-center mx-auto pt-20 pb-15 px-10 gap-10 lg:gap-20 xl:gap-32 2xl:gap-58'>
        <div className='flex justify-end'>
          <img src={imagemComoFunciona2} alt="Interior moderno" className='w-560 h-640 object-cover rounded-[2.5rem] shadow-sm' />
        </div>

        <div className='flex flex-col items-start gap-6 max-w-130'>
          <div className='text-preto-texto-principal text-5xl font-bold leading-[1.1]'>
            <h1>Anuncie seu imóvel em poucos passos</h1>
          </div>

          <div>
            <p className='text-preto-texto-principal text-lg leading-relaxed mb-6'>
              Cadastre seu espaço e comece a receber reservas rapidamente de forma fácil e rápida.
            </p>

            <div></div>
            {/* Passo 1 */}
            <div className='flex flex-col gap-6'>
              <div className='flex items-start gap-4'>
                <p className='text-beje-principal text-5xl leading-none'>1</p>
                <div className='flex flex-col'>
                  <p>Cadastre seu Imóvel</p>
                  <p>Adicione fotos, descrição e informações importantes.</p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className='flex items-start gap-4'>
                <p className='text-beje-principal text-5xl leading-none'>2</p>
                <div className='flex flex-col'>
                  <p>Defina suas Condiçãos</p>
                  <p>Escolha preço, datas disponíveis e regras.</p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className='flex items-start gap-4'>
                <p className='text-beje-principal text-5xl leading-none'>3</p>
                <div className='flex flex-col'>
                  <p>Receba Reservas</p>
                  <p>Gerencie solicitações de forma simples e segura.</p>
                </div>
              </div>
            </div>
          </div>
          <Link to="/login" className='hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border rounded-[0.313rem] text-[1.150rem] py-3 pl-rem-2 pr-rem-2 cursor-pointer active:scale-95 transition-all whitespace-nowrap'>
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Opnião Social - Social Proof */}
      <section className='bg-fundo-principal pt-20 pb-15 px-10 gap-10 lg:gap-20 xl:gap-32 2xl:gap-58'>
        <h1 className='text-[2.25rem] font-semibold text-preto-texto-principal leading-tight text-center mb-14'>
          Histórias de quem já encontrou o lugar ideal!
        </h1>
        <div className='relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]'>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={40}
            slidesPerView={'auto'}
            loop={true}
            centeredSlides={true}
            loopedSlides={7}
            initialSlide={7}
            loopAddBlankSlides={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={8000}
            className='pb-20 pt-24'
          >

            {/* Cards Perfil*/}
            {[...depoimentos, ...depoimentos].map((item, index) => (
              <SwiperSlide key={index} className='w-auto!'>
                <div className='cursos-default select-none relative mt-24 flex flex-col justify-between min-h-90 items-center text-center w-65 bg-white border rounded-2xl p-6 shadow-sm'>
                  <div className=' absolute -top-24 w-44 h-44 rounded-full overflow-hidden border-8 border-white shadow-lg'>
                    <img src={item.foto} alt={item.nome} className='w-full h-full object-cover' />
                  </div>
                  <p className='pt-18 text-lg font-medium leading-relaxed text-preto-texto-principal'>
                    “{item.texto}”
                  </p>
                  <div className='flex flex-col gap-2 items-center pt-6 pb-4'>
                    <div className='w-28 h-px bg-preto-principal'></div>
                    <div className='w-14 h-px bg-preto-principal'></div>
                  </div>
                  <span className='font-bold text-preto-principal mb-2'>{item.nome}</span>
                  <div className='flex items-center gap-0.5 pb-2'>
                    <Icons.FaStar className='text-icone-estrela' size={28} />
                    <Icons.FaStar className='text-icone-estrela' size={28} />
                    <Icons.FaStar className='text-icone-estrela' size={28} />
                    <Icons.FaStar className='text-icone-estrela' size={28} />
                    <Icons.FaStar className='text-icone-estrela' size={28} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section >

      {/* Seção de Atenção - Call to Action */}
      <section className='w-full py-20 flex justify-center pt-20 pb-15 px-10 gap-10 lg:gap-20 xl:gap-32 2xl:gap-58'>
        <div className='flex flex-col items-center text-center max-w-800'>
          <h1 className='text-5xl font-bold text-preto-texto-principal leading-[1.1] mb-6'>
            Encontre ou anuncie seu imóvel
            <span className='text-beje-principal'> agora mesmo</span>
          </h1>
          <p className='text-lg text-preto-texto-principal mb-5 max-w-500'>
            Leva menos de alguns minutos para começar. Simples, rápido e sem complicação.
          </p>
          <div className='flex justify-center'>
            <Link to="/registro" className='inline-block hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border rounded-[0.313rem] text-[1.150rem] py-3 px-8 cursor-pointer active:scale-95 transition-all whitespace-nowrap shadow-sm'>
              Registrar-se
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default App
