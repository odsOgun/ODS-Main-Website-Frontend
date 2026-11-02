// import Footer from './components/local/footer';
import Nav from './components/local/nav';
import { Toaster } from './components/ui/sonner';

function App({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='container max-md:px-5'>
        <Toaster />
        <Nav />
      </div>
      <div>{children}</div>
      <div>{/* <Footer /> */}</div>
    </div>
  );
}

export default App;
