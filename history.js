function saveToHistory(entry) {
  let history = JSON.parse(sessionStorage.getItem("cropHistory")) || [];
  history.push(entry);
  sessionStorage.setItem("cropHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(sessionStorage.getItem("cropHistory")) || [];
  const historyBody = document.getElementById("historyBody");

  historyBody.innerHTML = "";

  history.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.temperature}</td>
      <td>${item.humidity}</td>
      <td>${item.nitrogen}</td>
      <td>${item.phosporous}</td>
      <td>${item.potassium}</td>
      <td>${item.pH Level}</td>
      <td>${item.Sunlight}</td>
      <td>${item.Prediction}</td>
    `;
    historyBody.appendChild(tr);
  });
}
