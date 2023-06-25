import "./style.css"
import Map from "./component/map/Map"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DetailsPage from "./pages/detailPage1"

export default function App () {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Map />} />
        <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
    </Router>
  )
}

