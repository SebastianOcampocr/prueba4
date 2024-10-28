import './Chatbot.css';
import { useEffect } from 'react';

const Chatbot = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
        script.onload = () => {
            if (window.voiceflow && window.voiceflow.chat) {
                window.voiceflow.chat.load({
                    verify: { projectID: '671dc0af6e800cb63f25f821' },
                    url: 'https://general-runtime.voiceflow.com/',
                    versionID: 'production',
                });
            } else {
                console.error("Voiceflow chat no está disponible.");
            }
        };
        script.onerror = () => {
            console.error("Error al cargar el script de Voiceflow.");
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="chatbot">
            <div className="b16170a5347c77eee4653-welcome">
                <div className="b16170a5347c77eee4653-welcome1" />
            </div>
        </div>
    );
};

export default Chatbot;

