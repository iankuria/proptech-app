import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'
import AddProperty from './pages/AddProperty'
import About from './pages/About'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/add" element={<AddProperty />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  )
}