import { Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SplashScreen } from './components/layout/SplashScreen';

export const App = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-black">

            <SplashScreen />
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
};

export default App;