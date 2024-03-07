import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  PieController,
  RadarController,
  RadialLinearScale,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  BarElement,
  ArcElement,
  Tooltip,
} from 'chart.js';

const useChartJSInitializer = () => {
  ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Legend,
    BarElement,
    RadarController,
    RadialLinearScale,
    PieController,
    ArcElement,
    Tooltip,
  );
};

export default useChartJSInitializer;
