export const chartOptions = (title: string) => {
  return {
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: '500',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };
};
