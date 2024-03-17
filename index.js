const canvasC = document.getElementById("canvasC").getContext("2d");
const canvasO = document.getElementById("canvasO").getContext("2d");

let plotC = undefined;
let plotO = undefined;

const setup = () => {
  plotC = new Chart(canvasC, {
    type: "line",
    data: { datasets: [] },
  });
  plotO = new Chart(canvasO, {
    type: "line",
    data: { datasets: [] },
  });

  const [l, r, e] = [1, 1, 1];

  document.getElementById("l").value = l;
  document.getElementById("r").value = r;
  document.getElementById("e").value = e;
  make_plot(make_data(l, r, e));
}

const make_plot_closing = (data) => {
  plotC.destroy();
  plotC = new Chart(canvasC, {
    type: "line",
    data: {
      datasets: [
        {
          label: "I (t)",
          borderColor: "rgba(66, 200, 222, .8)",
          data: data,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "t, c" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "I, A" }
        }
      },
      layout: {
        padding: 50,
      },
      plugins: {
        title: { display: true, text: "При замыкании цепи" }
      }
    }
  });
}

const make_plot_opening = (data) => {
  plotO.destroy();
  plotO = new Chart(canvasO, {
    type: "line",
    data: {
      datasets: [
        {
          label: "I (t)",
          borderColor: "rgba(200, 77, 123, .8)",
          data: data,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "t, c" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "I, A" }
        }
      },
      layout: {
        padding: 50,
      },
      plugins: {
        title: { display: true, text: "При размыкании цепи" }
      }
    }
  });
}

const make_plot = (data) => {
  make_plot_closing(data.closing);
  make_plot_opening(data.opening);
}

const make_data = (l, r, e) => {
  const result = { closing: [], opening: [] };
  const right_border = -l * Math.log(0.01) / r;
  const step = right_border / 1000;

  const i0 = e / r;
  const coeff = -r / l;

  for (let t = 0; t < right_border; t += step) {
    const exp = Math.exp(coeff * t);

    result.closing.push({
      x: t,
      y: i0 * (1 - exp)
    });
    result.opening.push({
      x: t,
      y: i0 * exp
    });
  }

  return result;
}

const parse_input = () => {
  return [
    parseFloat(document.getElementById("l").value),
    parseFloat(document.getElementById("r").value),
    parseFloat(document.getElementById("e").value),
  ]
}

const run = () => {
  const [l, r, e] = parse_input();
  if (isNaN(l) || isNaN(r) || isNaN(e)) {
    alert("Некорретный ввод!");
    return;
  }
  if (l <= 0 || r <= 0 || e <= 0) {
    alert("Некорретный ввод!");
    return;
  }
  make_plot(make_data(l, r, e));
}
