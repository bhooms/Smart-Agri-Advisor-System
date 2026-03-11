// Add your Gemini API Key here
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

document.getElementById("predictBtn").addEventListener("click", async () => {

    const temperature = document.getElementById("Temperature").value || "N/A";
    const humidity = document.getElementById("Humidity").value || "N/A";
    const nitrogen = document.getElementById("Nitrogen").value || "N/A";
    const phosphorous = document.getElementById("Phosphorous").value || "N/A";
    const potassium = document.getElementById("Potassium").value || "N/A";
    const ph = document.getElementById("pH").value || "N/A";
    const sunlight = document.getElementById("Sunlight").value || "N/A";
    const moisture = document.getElementById("Moisture").value || "N/A";

    const resultBox = document.getElementById("resultBox");
    const cropResult = document.getElementById("cropResult");

    resultBox.style.display = "block";
    cropResult.innerText = "Analyzing data...";

    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE" || !GEMINI_API_KEY) {
        cropResult.innerText = "Please set your Gemini API key in predict.js to get AI advice.";
        return;
    }

    const prompt = `Act as an agricultural expert. Given the following soil and environment parameters, provide a short and actionable advice about which crops to plant,what care they need, irrigation and fertilizer suggestions.:
    Temperature: ${temperature}°C
    Humidity: ${humidity}%
    Nitrogen: ${nitrogen}
    Phosphorous: ${phosphorous}
    Potassium: ${potassium}
    pH Level: ${ph}
    Sunlight: ${sunlight} hours
    Soil Moisture: ${moisture}
    Keep the advice concise and well formated with point wise suggestions, around 5-6 sentences.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            const advice = data.candidates[0].content.parts[0].text;
            cropResult.innerText = advice;

            if (typeof saveToHistory === 'function') {
                saveToHistory({
                    timestamp: new Date().toLocaleString(),
                    temperature,
                    humidity,
                    nitrogen,
                    phosphorous,
                    potassium,
                    ph,
                    sunlight,
                    moisture,
                    prediction: advice
                });
            }
        } else {
            cropResult.innerText = "AI did not return response.";
            console.error(data);
        }

    } catch (error) {
        console.error("Error generating advice:", error);
        cropResult.innerText = "Error generating advice.";
    }

});
