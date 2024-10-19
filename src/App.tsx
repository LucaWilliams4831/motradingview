import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Header from './layout/Header'
import ChartBody from './layout/ChartBody';

function App() {
  const [hide, setHide] = useState(false);
  const location = useLocation();

  return (
    <div className='relative w-full'>
      <Header />
      <ChartBody setHide={setHide} hide={hide} location={location} />
    </div>
  )
}

export default App
