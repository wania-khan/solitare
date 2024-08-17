import './App.css';
import Module1 from './components/module-1';
import bgImage from './assets/images/bg.svg';

function App() {
  return (
    <>
      <div 
        className="font-[Poppins] text-white min-h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Module1 />
      </div>
    </>
  );
}

export default App;