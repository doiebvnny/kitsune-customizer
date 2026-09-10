const state = {
  tailNumber: "three",
  tailType: "mystic",
  colors: {
    primary: "#f4f0c4",
    secondary: "#6c35c8",
    tertiary: "#238f5b",
    eye: "#7a2417"
  },
  activeColorTarget: null
};

const defaults = JSON.parse(JSON.stringify(state));

const labels = {
  one: "One",
  three: "Three",
  five: "Five",
  seven: "Seven",
  nine: "Nine",
  mystic: "Mystic",
  fateful: "Fateful",
  splendorous: "Splendorous",
  valiant: "Valiant",
  hazy: "Hazy",
  endless: "Endless",
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
  eye: "Eye"
};

const palette = [
  "#b10f08","#ee3f44","#e55ad0","#efa2e8","#9641dd",
  "#9558ed","#1b1b1b","#fdf5e7","#2b54f5","#4bd0db",
  "#6e62ed","#fff400","#0b8e16","#2db74e","#80ef2d",
  "#d6ff85","#b55e00","#c9903f","#f77d00","#ffd21a",
  "#63efbf","#00e0be","#14d8ef","#4370d9","#b72e59",
  "#61c8ee","#5d6271","#6c4931","#bb3c3a","#f06a16",
  "#2f2c2a","#7f4132","#bf1d22","#c7bbcf","#d4c7b6",
  "#5b524e","#2c1212","#9f6e59","#d22756","#a56a91",
  "#46323e","#2e0750","#a44d12","#bf7a2e","#c78d00",
  "#3f1b65","#54119b","#101184","#12174f","#3823ff",
  "#ffa12b","#ffd03f","#766a58","#9b8f86","#c7b7d2",
  "#e79b60","#9d897f","#d5766b","#988c7e","#d7c98d",
  "#ff648f","#f40079","#ff0014","#ff7e00","#fff500",
  "#f0e5c8","#f4d9b4","#c9b2a7","#f79a7e","#22b645",
  "#87b97b","#814a97","#995cce","#a47be0","#13b8df",
  "#6acfb7","#8bcb83","#7fe76e","#607bd7","#85b8e2",
  "#4f0d12","#606600","#4a8a26","#0da646","#23965c"
];

const summaryText = document.getElementById("summaryText");
const tailLayer = document.getElementById("tailLayer");
const placeholder = document.getElementById("placeholder");

const modal = document.getElementById("colorModal");
const modalTitle = document.getElementById("colorModalTitle");
const colorWheel = document.getElementById("colorWheel");
const selectedPreview = document.getElementById("selectedPreview");
const selectedHex = document.getElementById("selectedHex");

function tailAssetPath() {
  return `assets/tails/${state.tailType}-${state.tailNumber}.png`;
}

function updateTailImage() {
  const path = tailAssetPath();
  const test = new Image();

  test.onload = () => {
    tailLayer.src = path;
    tailLayer.style.display = "block";
    placeholder.style.display = "none";
  };

  test.onerror = () => {
    tailLayer.removeAttribute("src");
    tailLayer.style.display = "none";
    placeholder.style.display = "grid";
  };

  test.src = path;
}

function updateUI() {
  document.querySelectorAll("#tailNumberChoices .choice-tile").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.value === state.tailNumber);
  });

  document.querySelectorAll("#tailTypeChoices .choice-tile").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.value === state.tailType);
  });

  document.getElementById("primarySwatch").style.background = state.colors.primary;
  document.getElementById("secondarySwatch").style.background = state.colors.secondary;
  document.getElementById("tertiarySwatch").style.background = state.colors.tertiary;
  document.getElementById("eyeSwatch").style.background = state.colors.eye;

  summaryText.textContent = `${labels[state.tailType]} • ${labels[state.tailNumber]} tails`;
  updateTailImage();
}

document.getElementById("tailNumberChoices").addEventListener("click", event => {
  const btn = event.target.closest(".choice-tile");
  if (!btn || btn.disabled) return;
  state.tailNumber = btn.dataset.value;
  updateUI();
});

document.getElementById("tailTypeChoices").addEventListener("click", event => {
  const btn = event.target.closest(".choice-tile");
  if (!btn || btn.disabled) return;
  state.tailType = btn.dataset.value;
  updateUI();
});

function createColorWheel() {
  colorWheel.innerHTML = "";
  const centerX = 50;
  const centerY = 50;
  const rings = [
    { radius: 43, count: 28 },
    { radius: 32, count: 22 },
    { radius: 21, count: 16 },
    { radius: 10, count: 10 }
  ];

  let index = 0;

  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count && index < palette.length; i++, index++) {
      const angle = (-Math.PI / 2) + (i / ring.count) * Math.PI * 2 + ringIndex * 0.07;
      const x = centerX + Math.cos(angle) * ring.radius;
      const y = centerY + Math.sin(angle) * ring.radius;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "color-dot";
      button.dataset.color = palette[index];
      button.style.background = palette[index];
      button.style.left = `${x}%`;
      button.style.top = `${y}%`;
      button.setAttribute("aria-label", `Choose color ${palette[index]}`);

      button.addEventListener("click", () => {
        chooseColor(button.dataset.color);
      });

      colorWheel.appendChild(button);
    }
  });

  while (index < palette.length) {
    const i = index - rings.reduce((sum, r) => sum + r.count, 0);
    const angle = (i / Math.max(1, palette.length - index)) * Math.PI * 2;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-dot";
    button.dataset.color = palette[index];
    button.style.background = palette[index];
    button.style.left = `${50 + Math.cos(angle) * 4}%`;
    button.style.top = `${50 + Math.sin(angle) * 4}%`;
    button.addEventListener("click", () => chooseColor(button.dataset.color));
    colorWheel.appendChild(button);
    index++;
  }
}

function refreshWheelSelection() {
  if (!state.activeColorTarget) return;
  const current = state.colors[state.activeColorTarget].toLowerCase();

  colorWheel.querySelectorAll(".color-dot").forEach(dot => {
    dot.classList.toggle("selected", dot.dataset.color.toLowerCase() === current);
  });

  selectedPreview.style.background = current;
  selectedHex.textContent = current.toUpperCase();
}

function openColorModal(target) {
  state.activeColorTarget = target;
  modalTitle.textContent = `Choose ${labels[target]} Color`;
  refreshWheelSelection();
  modal.hidden = false;
}

function closeColorModal() {
  modal.hidden = true;
  state.activeColorTarget = null;
}

function chooseColor(hex) {
  if (!state.activeColorTarget) return;
  state.colors[state.activeColorTarget] = hex;
  updateUI();
  refreshWheelSelection();
  closeColorModal();
}

document.querySelectorAll(".color-box").forEach(button => {
  button.addEventListener("click", () => openColorModal(button.dataset.colorTarget));
});

document.getElementById("closeColorModal").addEventListener("click", closeColorModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeColorModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeColorModal();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  state.tailNumber = defaults.tailNumber;
  state.tailType = defaults.tailType;
  state.colors = {...defaults.colors};
  updateUI();
});

document.getElementById("randomizeBtn").addEventListener("click", () => {
  const numbers = ["three", "five", "seven", "one", "nine"];
  const types = ["mystic", "fateful", "splendorous", "valiant", "hazy", "endless"];
  const randomColor = () => palette[Math.floor(Math.random() * palette.length)];

  state.tailNumber = numbers[Math.floor(Math.random() * numbers.length)];
  state.tailType = types[Math.floor(Math.random() * types.length)];
  state.colors.primary = randomColor();
  state.colors.secondary = randomColor();
  state.colors.tertiary = randomColor();
  state.colors.eye = randomColor();
  updateUI();
});

createColorWheel();
updateUI();
