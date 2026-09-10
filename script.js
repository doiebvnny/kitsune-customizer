const controls = {
  tailNumber: document.getElementById("tailNumber"),
  tailType: document.getElementById("tailType"),
  pattern: document.getElementById("pattern"),
  ruff: document.getElementById("ruff"),
  ears: document.getElementById("ears"),
  mask: document.getElementById("mask"),
  primaryColor: document.getElementById("primaryColor"),
  secondaryColor: document.getElementById("secondaryColor"),
  tertiaryColor: document.getElementById("tertiaryColor"),
  eyeColor: document.getElementById("eyeColor")
};

const summaryText = document.getElementById("summaryText");
const tailLayer = document.getElementById("tailLayer");
const placeholder = document.getElementById("placeholderKitsune");

const defaults = {
  tailNumber: "three",
  tailType: "mystic",
  primaryColor: "#f4f0c4",
  secondaryColor: "#6c35c8",
  tertiaryColor: "#238f5b",
  eyeColor: "#7a2417"
};

function pretty(value) {
  if (!value) return "Coming soon";
  return value
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function updateSummary() {
  summaryText.textContent =
    `${pretty(controls.tailType.value)} • ${pretty(controls.tailNumber.value)} tails`;
}

function updateTailImage() {
  // When an asset exists, name it like:
  // assets/tails/fateful-five.png
  const fileName = `${controls.tailType.value}-${controls.tailNumber.value}.png`;
  const path = `assets/tails/${fileName}`;

  const testImage = new Image();
  testImage.onload = () => {
    tailLayer.src = path;
    tailLayer.style.display = "block";
    placeholder.style.display = "none";
  };
  testImage.onerror = () => {
    tailLayer.removeAttribute("src");
    tailLayer.style.display = "none";
    placeholder.style.display = "grid";
  };
  testImage.src = path;
}

function updateCustomizer() {
  updateSummary();
  updateTailImage();
}

Object.values(controls).forEach(control => {
  control.addEventListener("change", updateCustomizer);
  control.addEventListener("input", updateCustomizer);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  controls.tailNumber.value = defaults.tailNumber;
  controls.tailType.value = defaults.tailType;
  controls.primaryColor.value = defaults.primaryColor;
  controls.secondaryColor.value = defaults.secondaryColor;
  controls.tertiaryColor.value = defaults.tertiaryColor;
  controls.eyeColor.value = defaults.eyeColor;
  updateCustomizer();
});

document.getElementById("randomizeBtn").addEventListener("click", () => {
  const tailNumbers = ["three", "five", "seven", "one", "nine"];
  const tailTypes = ["mystic", "fateful", "splendorous", "valiant", "hazy", "endless"];

  controls.tailNumber.value = tailNumbers[Math.floor(Math.random() * tailNumbers.length)];
  controls.tailType.value = tailTypes[Math.floor(Math.random() * tailTypes.length)];

  updateCustomizer();
});

updateCustomizer();
