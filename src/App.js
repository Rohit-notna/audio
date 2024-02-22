import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Audio from '../src/components/Audio'
import FetchAudio from './components/FetchAudio';
export default function App() {
  return (
    <div>
     <BrowserRouter>
    <Routes>
<Route path="/" element={<Audio/>}/>
<Route path="/FetchAudio" element={<FetchAudio/>}/>



    </Routes>
    
    
    </BrowserRouter>
    </div>
  )
}
