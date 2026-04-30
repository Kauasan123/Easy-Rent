import { useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import * as Icons from '../icons/icons.js'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <Header />
      </header>
      
      <section>

      </section>

      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default App
