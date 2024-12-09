// import BlockchainService from './BlockchainService';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import Home from './Home';
import Manufacturer from './Manufacturer';
import Retailer from './Retailer';
import Distributor from './Distributor';
import Consumer from './Consumer';
import Preload from './Preload';


function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Preload />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/manufacturer" element={<Manufacturer />} />
                    <Route path="/retailer" element={<Retailer />} />
                    <Route path="/distributor" element={<Distributor />} />
                    <Route path="/consumer" element={<Consumer />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
