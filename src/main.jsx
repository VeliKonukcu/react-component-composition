import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css"
import App from './App.jsx'
import StarRating from './StarRating.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <StarRating maxRating={10}/>
    <StarRating /> */}
  </StrictMode>
)
