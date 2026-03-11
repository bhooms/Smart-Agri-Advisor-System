function saveToHistory(entry) {
  let history = JSON.parse(sessionStorage.getItem("cropHistory")) || [];
  history.push(entry);
  sessionStorage.setItem("cropHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(sessionStorage.getItem("cropHistory")) || [];
  const historyBody = document.getElementById("historyBody");

  // reset select all checkbox
  const selectAllCb = document.getElementById('selectAllHistory');
  if (selectAllCb) selectAllCb.checked = false;
  toggleDeleteBtnVisibility();

  historyBody.innerHTML = "";

  history.forEach((item, index) => {
    const isEditing = document.getElementById("toggleDeleteModeBtn").innerText === "Cancel";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="delete-col" style="${isEditing ? '' : 'display:none;'}"><input type="checkbox" class="history-checkbox" data-index="${index}" onchange="toggleDeleteBtnVisibility()"></td>
      <td>${index + 1}</td>
      <td>${item.temperature}</td>
      <td>${item.humidity}</td>
      <td>${item.nitrogen}</td>
      <td>${item.phosphorous}</td>
      <td>${item.potassium}</td>
      <td>${item.ph}</td>
      <td>${item.sunlight}</td>
      <td>${item.moisture || "N/A"}</td>
      <td class="time-col">${item.timestamp || "N/A"}</td>
      <td class="prediction-col">${item.prediction}</td>
    `;
    historyBody.appendChild(tr);
  });
}

function toggleDeleteMode() {
  const isEditing = document.getElementById("toggleDeleteModeBtn").innerText === "Cancel";

  // Toggle columns
  const deleteCols = document.querySelectorAll('.delete-col');
  deleteCols.forEach(col => {
    col.style.display = isEditing ? "none" : "table-cell";
  });

  // Update buttons
  const toggleBtn = document.getElementById("toggleDeleteModeBtn");
  const clearAllBtn = document.getElementById("clearHistoryBtn");
  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
  const selectAllCb = document.getElementById('selectAllHistory');

  if (isEditing) {
    toggleBtn.innerText = "Select to Delete";
    toggleBtn.classList.remove("active-mode");
    clearAllBtn.style.display = "inline-block";
    deleteSelectedBtn.style.display = "none";
    if (selectAllCb) selectAllCb.checked = false;
    document.querySelectorAll('.history-checkbox').forEach(cb => cb.checked = false);
  } else {
    toggleBtn.innerText = "Cancel";
    toggleBtn.classList.add("active-mode");
    clearAllBtn.style.display = "none";
    deleteSelectedBtn.style.display = "none"; // only show if items checked
  }
}

function clearHistory() {
  if (confirm("Are you sure you want to delete all prediction history?")) {
    sessionStorage.removeItem("cropHistory");
    loadHistory(); // Refresh the table to show emptiness
  }
}

function toggleAllHistory() {
  const selectAll = document.getElementById('selectAllHistory').checked;
  const checkboxes = document.querySelectorAll('.history-checkbox');
  checkboxes.forEach(cb => cb.checked = selectAll);
  toggleDeleteBtnVisibility();
}

function toggleDeleteBtnVisibility() {
  const checkedBoxes = document.querySelectorAll('.history-checkbox:checked');
  const deleteBtn = document.getElementById('deleteSelectedBtn');
  if (deleteBtn) {
    deleteBtn.style.display = checkedBoxes.length > 0 ? "inline-block" : "none";
  }
}

function deleteSelectedHistory() {
  const checkedBoxes = document.querySelectorAll('.history-checkbox:checked');
  if (checkedBoxes.length === 0) return;

  if (confirm(`Are you sure you want to delete ${checkedBoxes.length} selected record(s)?`)) {
    let history = JSON.parse(sessionStorage.getItem("cropHistory")) || [];

    // Get indexes to remove, sort in descending order to avoid shift issues during removal
    const indexesToRemove = Array.from(checkedBoxes)
      .map(cb => parseInt(cb.getAttribute('data-index')))
      .sort((a, b) => b - a);

    indexesToRemove.forEach(index => {
      history.splice(index, 1);
    });

    sessionStorage.setItem("cropHistory", JSON.stringify(history));
    loadHistory();
  }
}
