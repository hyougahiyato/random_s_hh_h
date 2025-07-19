let serifs = [];

const sheetId = "1SHe5y5EuI-51elPxIycLm1N2foQUCR-J02Wekqazumo";
const gid = "0";
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

// スプレッドシートからデータを読み込む
Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    serifs = results.data.filter(row => row["セリフ"] && row["ジャンル"]);
    populateGenres();
  }
});

// ジャンル一覧を左サイドバーに表示（件数付き）
function populateGenres() {
  const genreCounts = {};
  serifs.forEach(row => {
    const genre = row["ジャンル"];
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });

  const genreListDiv = document.getElementById("genreList");

  Object.entries(genreCounts).forEach(([genre, count]) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = genre;
    checkbox.name = "genre";
    label.appendChild(checkbox);
    label.append(` ${genre}（${count}）`);
    genreListDiv.appendChild(label);
  });
}

// 選択されたジャンルを取得
function getSelectedGenres() {
  const checkboxes = document.querySelectorAll("#genreList input[type='checkbox']:checked");
  return Array.from(checkboxes).map(cb => cb.value);
}

// ランダム表示
function displayRandomSerif() {
  if (serifs.length === 0) {
    document.getElementById("serifBox").textContent = "セリフを読み込み中です...";
    document.getElementById("metaBox").textContent = "[ジャンル: -] [文字数: 0文字]";
    return;
  }

  const selectedGenres = getSelectedGenres();
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

  const serifBox = document.getElementById("serifBox");
  serifBox.textContent = text;

  document.getElementById("metaBox").textContent = `[ジャンル: ${random["ジャンル"]}] [文字数: ${count}文字]`;

  showCopyButton(text);
}

// コピー機能
function showCopyButton(text) {
  let copyBtn = document.getElementById("copyButton");
  if (!copyBtn) {
    copyBtn = document.createElement("button");
    copyBtn.id = "copyButton";
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "コピー";
    document.getElementById("serifBox").after(copyBtn);
  }

  copyBtn.onclick = function () {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "コピー完了！";
      setTimeout(() => {
        copyBtn.textContent = "コピー";
      }, 1500);
    });
  };
}
