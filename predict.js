document.getElementById("predictBtn").addEventListener("click", () => {

  if (!window.cropData || window.cropData.length === 0) {
    alert("Dataset not loaded yet");
    return;
  }

  const temp = Number(document.getElementById("temp").value);
  const humidity = Number(document.getElementById("humidity").value);
  const nitrogen = Number(document.getElementById("nitrogen").value);
  const ph = Number(document.getElementById("ph").value);

  let bestMatch = null;
  let minScore = Infinity;

  window.cropData.forEach(row => {
    const score =
      Math.abs(temp - row.temperature) +
      Math.abs(humidity - row.humidity) +
      Math.abs(nitrogen - row.nitrogen) +
      Math.abs(ph - row["ph level"]);

    if (score < minScore) {
      minScore = score;
      bestMatch = row;
    }
  });

  document.getElementById("cropResult").innerText =
    bestMatch["recommended crop"];

  document.getElementById("resultBox").style.display = "block";
});

let dataset = [];

fetch("Dataset/Crop_recommendation_dataset.csv")
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n");
    const headers = rows[0].split(",");

    dataset = rows.slice(1).map(row => {
      const values = row.split(",");
      let obj = {};
      headers.forEach((h, i) => obj[h.trim()] = values[i]);
      return obj;
    });
  });

  function predictCrop(input) {
  let bestMatch = null;
  let minScore = Infinity;

  dataset.forEach(row => {
    let score =
      Math.abs(row.temperature - input.temperature) +
      Math.abs(row.humidity - input.humidity) +
      Math.abs(row.nitrogen - input.nitrogen) +
      Math.abs(row.ph - input.ph);

    if (score < minScore) {
      minScore = score;
      bestMatch = row;
    }
  });

  return bestMatch.recommended_crop;
}
document.getElementById("predictBtn").addEventListener("click", () => {

  const input = {
    temperature: Number(document.getElementById("temp").value),
    humidity: Number(document.getElementById("humidity").value),
    nitrogen: Number(document.getElementById("nitrogen").value),
    ph: Number(document.getElementById("ph").value)
  };

  const crop = predictCrop(input);

  document.querySelector(".crop").innerText = crop;
  document.getElementById("resultBox").style.display = "block";

  saveToHistory({
    ...input,
    crop,
    time: new Date().toLocaleString()
  });
});
