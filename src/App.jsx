import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Archive from './components/Archive'
import Subscribe from './components/Subscribe'

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/archive" element={<Archive />} />
                        <Route path="/subscribe" element={<Subscribe />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default App
