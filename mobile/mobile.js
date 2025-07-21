let serifs = [];

const sheetId = "1SHe5y5EuI-51elPxIycLm1N2foQUCR-J02Wekqazumo";
const gid = "0";
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    serifs = results.data.filter(row => row["セリフ"] && row["ジャンル"]);
    populateGenres();
  }
});

function populateGenres() {
  const genreSelect = document.getElementById("genreSelect");
  const genres = [...new Set(serifs.map(s => s["ジャンル"]))];
  genres.sort();
  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
}

function displayRandomSerif() {
  if (serifs.length === 0) {
    document.getElementById("serifBox").textContent = "セリフを読み込み中です...";
    document.getElementById("metaBox").textContent = "[ジャンル: -] [文字数: 0文字]";
    return;
  }

  const selectedOptions = Array.from(document.getElementById("genreSelect").selectedOptions);
  const selectedGenres = selectedOptions.map(option => option.value).filter(val => val !== "");

  const filtered = selectedGenres.length > 0
    ? serifs.filter(s => selectedGenres.includes(s["ジャンル"]))
    : serifs;

  if (filtered.length === 0) {
    document.getElementById("serifBox").textContent = "そのジャンルにはセリフがありません。";
    document.getElementById("metaBox").textContent = "[ジャンル: -] [文字数: 0文字]";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  const text = random["セリフ"];
  const count = text.length;

  document.getElementById("serifBox").textContent = text;
  document.getElementById("metaBox").textContent = `[ジャンル: ${random["ジャンル"]}] [文字数: ${count}文字]`;

  const copyBtn = document.getElementById("copyButton");
  copyBtn.style.display = "inline-block";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "コピー完了！";
      setTimeout(() => { copyBtn.textContent = "コピー"; }, 1500);
    });
  };
}

function resetGenres() {
  const select = document.getElementById("genreSelect");
  Array.from(select.options).forEach(option => option.selected = false);
}

