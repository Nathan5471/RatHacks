import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react';

export default function ReactChangeTracker() {
    const location = useLocation();
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: document.title,
            href: location.pathname + location.search,
        });
    }, [location, trackPageView]);

    return null;
}