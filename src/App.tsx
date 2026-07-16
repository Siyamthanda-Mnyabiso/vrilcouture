import { Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SplashScreen } from './components/layout/SplashScreen';
import { ScrollToTop } from './components/layout/ScrollToTop';
import {TopAnnouncementBar} from "./components/layout/TopAnnouncementBar.tsx";


export const App = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-black">
            <ScrollToTop />
            <SplashScreen />
            <TopAnnouncementBar />
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
            <Analytics />
        </div>
    );
};

export default App;