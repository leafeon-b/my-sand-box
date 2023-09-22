import { ActiveElement, Chart, ChartEvent, LinearScale } from "chart.js";
import { ArcSlice, VennDiagramController } from "chartjs-chart-venn";
import { useEffect, useRef } from "react";

const ChartVenn = () => {
  const canvasRef = useRef(null);

  const config = {
    type: VennDiagramController.id,
    data: {
      labels: ["A", "B", "C", "A ∩ B", "A ∩ C", "B ∩ C", "A ∩ B ∩ C"],
      datasets: [
        {
          data: [
            { sets: ["A"], value: [] },
            { sets: ["B"], value: 2 },
            { sets: ["C"], value: ["foo", "bar"] },
            { sets: ["A", "B"], value: "a" },
            { sets: ["A", "C"], value: 0 },
            { sets: ["B", "C"], value: "a" },
            { sets: ["A", "B", "C"], value: "a" },
          ],
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Chart.js Venn Diagram Chart",
      },
      borderWidth: 3,
      backgroundColor: [
        "rgba(255, 26, 104, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "white",
      ],
      borderColor: [
        "rgba(255, 26, 104, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(75, 192, 192, 1)",
        "black",
      ],
      onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        if (elements.length === 0) {
          return;
        }
        const clickedIndex = elements[0].index;
        const data = chart.data.datasets[0].data[clickedIndex];
        console.log("data: ", data);
      },
    },
  };

  useEffect(() => {
    Chart.register(VennDiagramController, ArcSlice, LinearScale);
    const ctx = canvasRef.current;
    if (!ctx) return;

    // @ts-ignore configのbackgroundColorやborderColorなどの型が違うと言われるが問題なし
    const chart = new Chart(ctx, config);

    return () => {
      chart.destroy();
    };
  });

  return (
    <>
      <div className="ChartVenn">
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
    </>
  );
};

export default ChartVenn;
