import { Toaster } from 'react-hot-toast';

function ToasterConfig() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#111111',
                    fontWeight: 600,
                    fontSize: '14px',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                success: {
                    iconTheme: { primary: '#A67C52', secondary: '#fff' },
                },
                error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
            }}
        />
    );
}

export default ToasterConfig;