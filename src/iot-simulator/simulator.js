console.log("Simulateur IoT démarré");

let count = 0;
const interval = setInterval(() => {
    const data = {
        sensor_id: 1,
        traffic_level: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
    };
    console.log("Données simulées :", JSON.stringify(data));
    count++;
    if (count >= 10) {
        clearInterval(interval);
        console.log("Simulateur IoT terminé");
    }
}, 1000);