let ITERATIONS = 200;
const ZN = { x: 0, y: 0 };

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth * 1.5;
ctx.canvas.height = window.innerHeight * 1.5;

console.log((ctx.canvas.width * ctx.canvas.height) / 1000000);

const WIDTH = ctx.canvas.width;
const HEIGHT = ctx.canvas.height;

const colors = ["#000", "#4287f5"];

const bounds = {
  x: [2 - (2.5 * window.innerWidth) / window.innerHeight, 2],
  y: [-1.25, 1.25],
};

const mandelbrot = ({ x, y }) => {
  let n = 0;
  let z = { x: ZN.x, y: ZN.y };
  let d = 0;
  do {
    const ztemp = {
      x: z.x * z.x - z.y * z.y + x,
      y: 2 * z.x * z.y + y,
    };
    z.x = ztemp.x;
    z.y = ztemp.y;
    d = z.x * z.x + z.y * z.y;
    n++;
  } while (n < ITERATIONS && d <= 4);
  return { n, d: d <= 4 };
};

const pt = (px, wh) => {
  return {
    x: bounds.x[0] + ((bounds.x[1] - bounds.x[0]) * px.x) / wh[0],
    y: bounds.y[0] + ((bounds.y[1] - bounds.y[0]) * px.y) / wh[1],
  };
};

const draw = () => {
  for (i = 0; i < WIDTH; i++) {
    for (j = 0; j < HEIGHT; j++) {
      const p = {
        x: pt(i, WIDTH),
        y: pt,
      };

      const m = mandelbrot(p);

      const frac = (ITERATIONS - m.n) / ITERATIONS;
      const base =
        //   frac < 0.25
        //     ? [0, 0, 0].map((i) => i)
        //     : frac >= 0.25 && frac < 0.5
        //     ? [0, 0, 0].map((i) => i)
        //     : frac >= 0.5 && frac < 0.75
        //     ? [0, 0, 0].map((i) => i * frac ** 3)
        //     : [255, 255, 255].map((i) => 255 - i * frac ** 7);
        [255, 255, 255].map((i) => 255 - i * frac ** 4);

      ctx.fillStyle = m.d
        ? colors[0]
        : `rgb(${base[0]}, ${base[1]}, ${base[2]})`;
      ctx.fillRect(i, j, 1, 1);
    }
  }
};

draw();

canvas.addEventListener("click", (e) => {
  const x =
    bounds.x[0] + (e.clientX / window.innerWidth) * (bounds.x[1] - bounds.x[0]);
  const y =
    bounds.y[0] +
    (e.clientY / window.innerHeight) * (bounds.y[1] - bounds.y[0]);

  bounds.x = [
    x - (bounds.x[1] - bounds.x[0]) / 10,
    x + (bounds.x[1] - bounds.x[0]) / 10,
  ];
  bounds.y = [
    y - (bounds.y[1] - bounds.y[0]) / 10,
    y + (bounds.y[1] - bounds.y[0]) / 10,
  ];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
});
