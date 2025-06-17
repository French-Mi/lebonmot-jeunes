<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Notwendige Chart.js-Komponenten registrieren
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Props definieren, die von der HomeView übergeben werden
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  timeFrame: {
    type: String,
    default: 'week'
  }
});

// Diese computed property bereitet die Daten für das Diagramm auf
const processedChartData = computed(() => {
  const data = props.chartData || {};
  const labels = [];
  const values = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getLocalDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (props.timeFrame === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayKey = getLocalDateKey(d);
      labels.push(d.toLocaleDateString('de-DE', { weekday: 'short' }));
      values.push(data[dayKey] || 0);
    }
  } else if (props.timeFrame === 'month') {
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayKey = getLocalDateKey(d);
        labels.push(d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }));
        values.push(data[dayKey] || 0);
    }
  } else if (props.timeFrame === 'year') {
    const yearData = {};
    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = d.toLocaleString('de-DE', { month: 'short', year: '2-digit' });
        yearData[monthKey] = 0;
    }
    for(const dateKey in data) {
        const d = new Date(dateKey);
        if (!isNaN(d.getTime())) {
            const monthKey = d.toLocaleString('de-DE', { month: 'short', year: '2-digit' });
            // Sichere Prüfung, ob die Eigenschaft existiert
            if(Object.prototype.hasOwnProperty.call(yearData, monthKey)) {
                 yearData[monthKey] += data[dateKey];
            }
        }
    }
    labels.push(...Object.keys(yearData));
    values.push(...Object.values(yearData));
  }

  return {
    labels,
    datasets: [{
      label: 'Gelernte Vokabeln',
      data: values,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };
});

// Optionen für das Aussehen des Diagramms
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                color: '#6b7280',
            }
        },
        x: {
            ticks: {
                color: '#6b7280',
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};
</script>

<template>
  <div class="chart-container">
    <Bar :data="processedChartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>
