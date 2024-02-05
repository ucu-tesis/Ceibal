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
  );
};

export default useChartJSInitializer;
