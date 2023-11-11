import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  BarElement,
} from "chart.js";

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
    RadialLinearScale
  );
};

export default useChartJSInitializer;
