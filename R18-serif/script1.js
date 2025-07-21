
 let data = [];



fetch("serifR.json")
  .then(response => response.json())
  .then(json => {
    data = json;
   
  })
  .catch(error => {
    console.error("読み込みエラー:", error);
  });

function showRandom() {
  const rand = data[Math.floor(Math.random() * data.length)];
  document.getElementById("outputText").innerHTML = rand.text.replace(/\n/g, "<br>");
  document.getElementById("genreTag").textContent = `[ジャンル：${rand.genre}]`;
  document.getElementById("counter").textContent = `[文字数：${rand.text.length}文字]`;
}

function copyText() {
  const text = document.getElementById("outputText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const msg = document.getElementById("copyMsg");
    msg.style.opacity = 1;
    setTimeout(() => { msg.style.opacity = 0 }, 1500);
  });
}