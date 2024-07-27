import './App.css';
import Module1 from './components/module-1';
import bgImage from './assets/images/bg.svg';
function App() {
  return (
   <>
   <div className="font-[Poppins] text-white pl-[96px] pt-5" style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        height: '100vh'
      }}>
   <Module1 />
   </div>
   </>
  );
}

export default App;
