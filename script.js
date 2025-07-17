let chart;

function updateData() {
  const water = parseInt(document.getElementById("water").value) || 0;
  const meals = parseInt(document.getElementById("meals").value) || 0;
  const sleep = parseInt(document.getElementById("sleep").value) || 0;

  const today = new Date().toLocaleDateString();
  const data = { water, meals, sleep, date: today };
  localStorage.setItem("healthData", JSON.stringify(data));

  updateChart(water, meals, sleep);
  showTips(water, meals, sleep);
}

function updateChart(water, meals, sleep) {
  const ctx = document.getElementById("healthChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Water", "Meals", "Sleep"],
      datasets: [{
        label: "Today's Health Stats",
        data: [water, meals, sleep],
        backgroundColor: ["#00b4d8", "#90be6d", "#6a4c93"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 10 }
      }
    }
  });
}

function showTips(w, m, s) {
  const tips = [];

  // Hydration
  if (w < 6) {
    tips.push("💧 Hydration appears insufficient. Adults generally require 6–8 glasses of water daily, more if you're active. Consider keeping a bottle nearby and sipping consistently throughout the day.");
  } else if (w >= 6 && w <= 10) {
    tips.push("💧 You're well-hydrated. Maintaining consistent water intake supports digestion, energy levels, and overall cellular health.");
  } else {
    tips.push("💧 Your water intake is high. While staying hydrated is essential, excessive water in a short span can dilute electrolytes. Ensure you're spreading intake across the day.");
  }

  // Meals
  if (m < 2) {
    tips.push("🍱 Low meal frequency may affect energy stability and metabolism. Aim for at least 3 nourishing meals per day, ideally balanced with proteins, complex carbs, and healthy fats.");
  } else if (m === 3) {
    tips.push("🍱 Great job maintaining consistent meals. A regular eating pattern helps regulate blood sugar and supports sustained energy levels.");
  } else if (m > 3 && m <= 5) {
    tips.push("🍱 You're having multiple meals, which can be healthy if portion-controlled. Consider focusing on nutrient-dense, whole foods to prevent unnecessary snacking.");
  } else {
    tips.push("🍱 Frequent eating may suggest emotional or habitual snacking. Reflect on hunger cues and try to maintain intentional meal timing.");
  }

  // Sleep
  if (s < 6) {
    tips.push("😴 Your sleep duration is below recommended levels. Adults typically require 7–9 hours of restful sleep for optimal cognitive and physical performance. Prioritize a wind-down routine to improve sleep quality.");
  } else if (s >= 6 && s <= 9) {
    tips.push("😴 You're within the healthy sleep range. Quality sleep is foundational to emotional regulation, immunity, and focus. Maintain a consistent bedtime if possible.");
  } else {
    tips.push("😴 Extended sleep can be a sign of fatigue, poor sleep quality, or recovery needs. If oversleeping is frequent, consider evaluating your bedtime routine and overall lifestyle balance.");
  }

  document.getElementById("tipsBox").innerHTML = tips.map(t => `<p>${t}</p>`).join('');
}



function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const data = JSON.parse(localStorage.getItem("healthData") || "{}");

  doc.text("🧠 Health Report", 10, 10);
  doc.text(`Date: ${data.date || "N/A"}`, 10, 20);
  doc.text(`Water Intake: ${data.water || 0} glasses`, 10, 30);
  doc.text(`Meals: ${data.meals || 0}`, 10, 40);
  doc.text(`Sleep: ${data.sleep || 0} hours`, 10, 50);

  doc.save("health_report.pdf");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Load previous data
window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("healthData") || "{}");
  if (saved.water) document.getElementById("water").value = saved.water;
  if (saved.meals) document.getElementById("meals").value = saved.meals;
  if (saved.sleep) document.getElementById("sleep").value = saved.sleep;

  if (saved.water || saved.meals || saved.sleep) {
    updateChart(saved.water, saved.meals, saved.sleep);
    showTips(saved.water, saved.meals, saved.sleep);
  }
};
