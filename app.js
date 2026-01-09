// 自(ㄗˋ)然(ㄖㄢˊ)小(ㄒㄧㄠˇ)任(ㄖㄣˋ)務(ㄨˋ)闖(ㄔㄨㄤˇ)關(ㄍㄨㄢ) — app.js
// 所(ㄙㄨㄛˇ)有(ㄧㄡˇ)畫(ㄏㄨㄚˋ)面(ㄇㄧㄢˋ)文(ㄨㄣˊ)字(ㄗˋ)都(ㄉㄡ)用(ㄩㄥˋ)注(ㄓㄨˋ)音(ㄧㄣ)版(ㄅㄢˇ)本(ㄅㄣˇ)。

const $ = (sel) => document.querySelector(sel);

const home = $("#home");
const game = $("#game");
const worldTitle = $("#worldTitle");
const missionTitle = $("#missionTitle");
const mantra = $("#mantra");
const activity = $("#activity");
const quiz = $("#quiz");
const nextBtn = $("#nextBtn");
const backBtn = $("#backBtn");

const starsBadge = $("#starsBadge");
const progressBadge = $("#progressBadge");

const state = {
  stars: 0,
  done: { plants:false, airwater:false, animals:false, force:false },
  currentWorld: null,
  step: 0, // 0 activity, 1 quiz, 2 done
  quizScore: 0
};

function setBadges(){
  starsBadge.textContent = `星(ㄒㄧㄥ)星(ㄒㄧㄥ)：${state.stars}`;
  const doneCount = Object.values(state.done).filter(Boolean).length;
  progressBadge.textContent = `闖(ㄔㄨㄤˇ)關(ㄍㄨㄢ)進(ㄐㄧㄣˋ)度(ㄉㄨˋ)：${doneCount}/4`;
}

setBadges();

const WORLDS = {
  plants: {
    title: "植(ㄓˊ)物(ㄨˋ)拼(ㄆㄧㄣ)圖(ㄊㄨˊ)隊(ㄉㄨㄟˋ)",
    mission: "任(ㄖㄣˋ)務(ㄨˋ)：把(ㄅㄚˇ)植(ㄓˊ)物(ㄨˋ)部(ㄅㄨˋ)位(ㄨㄟˋ)配(ㄆㄟˋ)對(ㄉㄨㄟˋ)功(ㄍㄨㄥ)能(ㄋㄥˊ)",
    mantra: "口(ㄎㄡˇ)訣(ㄐㄩㄝˊ)：根(ㄍㄣ)喝(ㄏㄜ)水(ㄕㄨㄟˇ)，莖(ㄐㄧㄥ)送(ㄙㄨㄥˋ)水(ㄕㄨㄟˇ)，葉(ㄧㄝˋ)做(ㄗㄨㄛˋ)食(ㄕˊ)物(ㄨˋ)，花(ㄏㄨㄚ)生(ㄕㄥ)寶(ㄅㄠˇ)寶(ㄅㄠˇ)。",
    activityType: "dragMatch",
    pairs: [
      { left:"根(ㄍㄣ)", right:"吸(ㄒㄧ)水(ㄕㄨㄟˇ)" },
      { left:"莖(ㄐㄧㄥ)", right:"支(ㄓ)撐(ㄔㄥ)+運(ㄩㄣˋ)送(ㄙㄨㄥˋ)" },
      { left:"葉(ㄧㄝˋ)", right:"做(ㄗㄨㄛˋ)食(ㄕˊ)物(ㄨˋ)" },
      { left:"花(ㄏㄨㄚ)", right:"繁(ㄈㄢˊ)衍(ㄧㄢˇ)" }
    ],
    quiz: [
      {
        q: "哪(ㄋㄚˇ)一(ㄧ)個(ㄍㄜˋ)部(ㄅㄨˋ)位(ㄨㄟˋ)主(ㄓㄨˇ)要(ㄧㄠˋ)吸(ㄒㄧ)水(ㄕㄨㄟˇ)？",
        choices: ["葉(ㄧㄝˋ)","根(ㄍㄣ)","花(ㄏㄨㄚ)"],
        ans: "根(ㄍㄣ)"
      },
      {
        q: "葉(ㄧㄝˋ)的(ㄉㄜ˙)重(ㄓㄨㄥˋ)要(ㄧㄠˋ)工(ㄍㄨㄥ)作(ㄗㄨㄛˋ)是(ㄕˋ)什(ㄕㄣˊ)麼(ㄇㄜ˙)？",
        choices: ["做(ㄗㄨㄛˋ)食(ㄕˊ)物(ㄨˋ)","睡(ㄕㄨㄟˋ)覺(ㄐㄧㄠˋ)","跑(ㄆㄠˇ)步(ㄅㄨˋ)"],
        ans: "做(ㄗㄨㄛˋ)食(ㄕˊ)物(ㄨˋ)"
      },
      {
        q: "莖(ㄐㄧㄥ)可(ㄎㄜˇ)以(ㄧˇ)幫(ㄅㄤ)忙(ㄇㄤˊ)做(ㄗㄨㄛˋ)哪(ㄋㄚˇ)兩(ㄌㄧㄤˇ)件(ㄐㄧㄢˋ)事(ㄕˋ)？",
        choices: ["支(ㄓ)撐(ㄔㄥ)+運(ㄩㄣˋ)送(ㄙㄨㄥˋ)","變(ㄅㄧㄢˋ)魔(ㄇㄛˊ)術(ㄕㄨˋ)","唱(ㄔㄤˋ)歌(ㄍㄜ)"],
        ans: "支(ㄓ)撐(ㄔㄥ)+運(ㄩㄣˋ)送(ㄙㄨㄥˋ)"
      }
    ]
  },

  airwater: {
    title: "空(ㄎㄨㄥ)氣(ㄑㄧˋ)與(ㄩˇ)水(ㄕㄨㄟˇ)超(ㄔㄠ)能(ㄋㄥˊ)力(ㄌㄧˋ)",
    mission: "任(ㄖㄣˋ)務(ㄨˋ)：用(ㄩㄥˋ)按(ㄢˋ)鈕(ㄋㄧㄡˇ)做(ㄗㄨㄛˋ)兩(ㄌㄧㄤˇ)個(ㄍㄜˋ)小(ㄒㄧㄠˇ)實(ㄕˊ)驗(ㄧㄢˋ)",
    mantra: "口(ㄎㄡˇ)訣(ㄐㄩㄝˊ)：空(ㄎㄨㄥ)氣(ㄑㄧˋ)佔(ㄓㄢˋ)空(ㄎㄨㄥ)間(ㄐㄧㄢ)，水(ㄕㄨㄟˇ)會(ㄏㄨㄟˋ)變(ㄅㄧㄢˋ)形(ㄒㄧㄥˊ)。",
    activityType: "buttonsLab",
    quiz: [
      {
        q: "空(ㄎㄨㄥ)氣(ㄑㄧˋ)看(ㄎㄢˋ)不(ㄅㄨˋ)見(ㄐㄧㄢˋ)，但(ㄉㄢˋ)它(ㄊㄚ)會(ㄏㄨㄟˋ)怎(ㄗㄣˇ)樣(ㄧㄤˋ)？",
        choices: ["佔(ㄓㄢˋ)空(ㄎㄨㄥ)間(ㄐㄧㄢ)","變(ㄅㄧㄢˋ)成(ㄔㄥˊ)石(ㄕˊ)頭(ㄊㄡˊ)","變(ㄅㄧㄢˋ)成(ㄔㄥˊ)糖(ㄊㄤˊ)果(ㄍㄨㄛˇ)"],
        ans: "佔(ㄓㄢˋ)空(ㄎㄨㄥ)間(ㄐㄧㄢ)"
      },
      {
        q: "水(ㄕㄨㄟˇ)倒(ㄉㄠˋ)進(ㄐㄧㄣˋ)杯(ㄅㄟ)子(ㄗ˙)，形(ㄒㄧㄥˊ)狀(ㄓㄨㄤˋ)會(ㄏㄨㄟˋ)怎(ㄗㄣˇ)樣(ㄧㄤˋ)？",
        choices: ["跟(ㄍㄣ)杯(ㄅㄟ)子(ㄗ˙)一(ㄧ)樣(ㄧㄤˋ)","永(ㄩㄥˇ)遠(ㄩㄢˇ)是(ㄕˋ)方(ㄈㄤ)形(ㄒㄧㄥˊ)","會(ㄏㄨㄟˋ)變(ㄅㄧㄢˋ)成(ㄔㄥˊ)貓(ㄇㄠ)"],
        ans: "跟(ㄍㄣ)杯(ㄅㄟ)子(ㄗ˙)一(ㄧ)樣(ㄧㄤˋ)"
      },
      {
        q: "下(ㄒㄧㄚˋ)面(ㄇㄧㄢˋ)哪(ㄋㄚˇ)一(ㄧ)個(ㄍㄜˋ)最(ㄗㄨㄟˋ)像(ㄒㄧㄤˋ)「水(ㄕㄨㄟˇ)會(ㄏㄨㄟˋ)流(ㄌㄧㄡˊ)動(ㄉㄨㄥˋ)」？",
        choices: ["水(ㄕㄨㄟˇ)流(ㄌㄧㄡˊ)到(ㄉㄠˋ)低(ㄉㄧ)處(ㄔㄨˋ)","書(ㄕㄨ)會(ㄏㄨㄟˋ)飛(ㄈㄟ)","石(ㄕˊ)頭(ㄊㄡˊ)會(ㄏㄨㄟˋ)唱(ㄔㄤˋ)歌(ㄍㄜ)"],
        ans: "水(ㄕㄨㄟˇ)流(ㄌㄧㄡˊ)到(ㄉㄠˋ)低(ㄉㄧ)處(ㄔㄨˋ)"
      }
    ]
  },

  animals: {
    title: "動(ㄉㄨㄥˋ)物(ㄨˋ)偵(ㄓㄣ)探(ㄊㄢˋ)社(ㄕㄜˋ)",
    mission: "任(ㄖㄣˋ)務(ㄨˋ)：快(ㄎㄨㄞˋ)速(ㄙㄨˋ)分(ㄈㄣ)類(ㄌㄟˋ)「動(ㄉㄨㄥˋ)物(ㄨˋ)」和(ㄏㄢˋ)「植(ㄓˊ)物(ㄨˋ)」",
    mantra: "口(ㄎㄡˇ)訣(ㄐㄩㄝˊ)：動(ㄉㄨㄥˋ)物(ㄨˋ)會(ㄏㄨㄟˋ)動(ㄉㄨㄥˋ)會(ㄏㄨㄟˋ)吃(ㄔ)會(ㄏㄨㄟˋ)感(ㄍㄢˇ)覺(ㄐㄩㄝˊ)。",
    activityType: "sortTap",
    quiz: [
      {
        q: "動(ㄉㄨㄥˋ)物(ㄨˋ)和(ㄏㄢˋ)植(ㄓˊ)物(ㄨˋ)最(ㄗㄨㄟˋ)不(ㄅㄨˋ)一(ㄧ)樣(ㄧㄤˋ)的(ㄉㄜ˙)是(ㄕˋ)什(ㄕㄣˊ)麼(ㄇㄜ˙)？",
        choices: ["動(ㄉㄨㄥˋ)物(ㄨˋ)會(ㄏㄨㄟˋ)移(ㄧˊ)動(ㄉㄨㄥˋ)","植(ㄓˊ)物(ㄨˋ)會(ㄏㄨㄟˋ)講(ㄐㄧㄤˇ)話(ㄏㄨㄚˋ)","石(ㄕˊ)頭(ㄊㄡˊ)會(ㄏㄨㄟˋ)跳(ㄊㄧㄠˋ)舞(ㄨˇ)"],
        ans: "動(ㄉㄨㄥˋ)物(ㄨˋ)會(ㄏㄨㄟˋ)移(ㄧˊ)動(ㄉㄨㄥˋ)"
      },
      {
        q: "下(ㄒㄧㄚˋ)面(ㄇㄧㄢˋ)哪(ㄋㄚˇ)個(ㄍㄜˋ)是(ㄕˋ)動(ㄉㄨㄥˋ)物(ㄨˋ)的(ㄉㄜ˙)需(ㄒㄩ)求(ㄑㄧㄡˊ)？",
        choices: ["吃(ㄔ)東(ㄉㄨㄥ)西(ㄒㄧ)","長(ㄓㄤˇ)出(ㄔㄨ)輪(ㄌㄨㄣˊ)子(ㄗ˙)","變(ㄅㄧㄢˋ)成(ㄔㄥˊ)雨(ㄩˇ)傘(ㄙㄢˇ)"],
        ans: "吃(ㄔ)東(ㄉㄨㄥ)西(ㄒㄧ)"
      },
      {
        q: "「感(ㄍㄢˇ)覺(ㄐㄩㄝˊ)周(ㄓㄡ)遭(ㄗㄠ)」是(ㄕˋ)什(ㄕㄣˊ)麼(ㄇㄜ˙)意(ㄧˋ)思(ㄙ)？",
        choices: ["聽(ㄊㄧㄥ)到(ㄉㄠˋ)聲(ㄕㄥ)音(ㄧㄣ)、看(ㄎㄢˋ)到(ㄉㄠˋ)東(ㄉㄨㄥ)西(ㄒㄧ)","把(ㄅㄚˇ)書(ㄕㄨ)吃(ㄔ)掉(ㄉㄧㄠˋ)","用(ㄩㄥˋ)鼻(ㄅㄧˊ)子(ㄗ˙)寫(ㄒㄧㄝˇ)字(ㄗˋ)"],
        ans: "聽(ㄊㄧㄥ)到(ㄉㄠˋ)聲(ㄕㄥ)音(ㄧㄣ)、看(ㄎㄢˋ)到(ㄉㄠˋ)東(ㄉㄨㄥ)西(ㄒㄧ)"
      }
    ]
  },

  force: {
    title: "力(ㄌㄧˋ)量(ㄌㄧㄤˋ)與(ㄩˇ)磁(ㄘˊ)鐵(ㄊㄧㄝˇ)訓(ㄒㄩㄣˋ)練(ㄌㄧㄢˋ)",
    mission: "任(ㄖㄣˋ)務(ㄨˋ)：分(ㄈㄣ)清(ㄑㄧㄥ)推(ㄊㄨㄟ)、拉(ㄌㄚ)，再(ㄗㄞˋ)找(ㄓㄠˇ)出(ㄔㄨ)磁(ㄘˊ)鐵(ㄊㄧㄝˇ)會(ㄏㄨㄟˋ)吸(ㄒㄧ)的(ㄉㄜ˙)東(ㄉㄨㄥ)西(ㄒㄧ)",
    mantra: "口(ㄎㄡˇ)訣(ㄐㄩㄝˊ)：推(ㄊㄨㄟ)拉(ㄌㄚ)是(ㄕˋ)力(ㄌㄧˋ)，磁(ㄘˊ)鐵(ㄊㄧㄝˇ)吸(ㄒㄧ)金(ㄐㄧㄣ)屬(ㄕㄨˇ)。",
    activityType: "forceMag",
    quiz: [
      {
        q: "把(ㄅㄚˇ)門(ㄇㄣˊ)往(ㄨㄤˇ)外(ㄨㄞˋ)推(ㄊㄨㄟ)開(ㄎㄞ)，這(ㄓㄜˋ)是(ㄕˋ)什(ㄕㄣˊ)麼(ㄇㄜ˙)？",
        choices: ["推(ㄊㄨㄟ)","拉(ㄌㄚ)","跳(ㄊㄧㄠˋ)"],
        ans: "推(ㄊㄨㄟ)"
      },
      {
        q: "哪(ㄋㄚˇ)一(ㄧ)個(ㄍㄜˋ)可(ㄎㄜˇ)能(ㄋㄥˊ)被(ㄅㄟˋ)磁(ㄘˊ)鐵(ㄊㄧㄝˇ)吸(ㄒㄧ)住(ㄓㄨˋ)？",
        choices: ["迴(ㄏㄨㄟˊ)紋(ㄨㄣˊ)針(ㄓㄣ)","木(ㄇㄨˋ)頭(ㄊㄡˊ)積(ㄐㄧ)木(ㄇㄨˋ)","橡(ㄒㄧㄤˋ)皮(ㄆㄧˊ)擦(ㄘㄚ)"],
        ans: "迴(ㄏㄨㄟˊ)紋(ㄨㄣˊ)針(ㄓㄣ)"
      },
      {
        q: "力(ㄌㄧˋ)可(ㄎㄜˇ)以(ㄧˇ)讓(ㄖㄤˋ)物(ㄨˋ)體(ㄊㄧˇ)怎(ㄗㄣˇ)樣(ㄧㄤˋ)？",
        choices: ["改(ㄍㄞˇ)變(ㄅㄧㄢˋ)動(ㄉㄨㄥˋ)作(ㄗㄨㄛˋ)或(ㄏㄨㄛˋ)形(ㄒㄧㄥˊ)狀(ㄓㄨㄤˋ)","變(ㄅㄧㄢˋ)成(ㄔㄥˊ)雲(ㄩㄣˊ)朵(ㄉㄨㄛˇ)","讓(ㄖㄤˋ)時(ㄕˊ)間(ㄐㄧㄢ)停(ㄊㄧㄥˊ)止(ㄓˇ)"],
        ans: "改(ㄍㄞˇ)變(ㄅㄧㄢˋ)動(ㄉㄨㄥˋ)作(ㄗㄨㄛˋ)或(ㄏㄨㄛˋ)形(ㄒㄧㄥˊ)狀(ㄓㄨㄤˋ)"
      }
    ]
  }
};

// ---------- UI flow ----------
document.querySelectorAll(".worldBtn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    startWorld(btn.dataset.world);
  });
});

backBtn.addEventListener("click", ()=>{
  goHome();
});

nextBtn.addEventListener("click", ()=>{
  if(!state.currentWorld) return;
  if(state.step === 0){
    // go quiz
    state.step = 1;
    render();
  }else if(state.step === 1){
    // finish world
    state.step = 2;
    finishWorld();
  }else{
    goHome();
  }
});

function goHome(){
  state.currentWorld = null;
  state.step = 0;
  home.classList.remove("hidden");
  game.classList.add("hidden");
  activity.innerHTML = "";
  quiz.innerHTML = "";
  nextBtn.textContent = "下(ㄒㄧㄚˋ)一(ㄧ)步(ㄅㄨˋ)";
  nextBtn.disabled = false;
}

function startWorld(key){
  state.currentWorld = key;
  state.step = 0;
  state.quizScore = 0;

  home.classList.add("hidden");
  game.classList.remove("hidden");
  render();
}

function render(){
  const w = WORLDS[state.currentWorld];
  worldTitle.textContent = w.title;
  missionTitle.textContent = w.mission;
  mantra.textContent = w.mantra;

  if(state.step === 0){
    nextBtn.textContent = "去(ㄑㄩˋ)小(ㄒㄧㄠˇ)測(ㄘㄜˋ)驗(ㄧㄢˋ)";
    renderActivity(w);
    quiz.innerHTML = `<div class="notice">小(ㄒㄧㄠˇ)測(ㄘㄜˋ)驗(ㄧㄢˋ)會(ㄏㄨㄟˋ)在(ㄗㄞˋ)你(ㄋㄧˇ)玩(ㄨㄢˊ)完(ㄨㄢˊ)後(ㄏㄡˋ)出(ㄔㄨ)現(ㄒㄧㄢˋ)。</div>`;
  }else if(state.step === 1){
    nextBtn.textContent = "完(ㄨㄢˊ)成(ㄔㄥˊ)這(ㄓㄜˋ)一(ㄧ)關(ㄍㄨㄢ)";
    activity.innerHTML = `<div class="notice">你(ㄋㄧˇ)已(ㄧˇ)經(ㄐㄧㄥ)玩(ㄨㄢˊ)完(ㄨㄢˊ)互(ㄏㄨˋ)動(ㄉㄨㄥˋ)了(ㄌㄜ˙)，現(ㄒㄧㄢˋ)在(ㄗㄞˋ)來(ㄌㄞˊ)答(ㄉㄚˊ)題(ㄊㄧˊ)。</div>`;
    renderQuiz(w);
  }else{
    nextBtn.textContent = "回(ㄏㄨㄟˊ)到(ㄉㄠˋ)選(ㄒㄩㄢˇ)單(ㄉㄢ)";
    activity.innerHTML = `<div class="notice">你(ㄋㄧˇ)完(ㄨㄢˊ)成(ㄔㄥˊ)了(ㄌㄜ˙)！太(ㄊㄞˋ)棒(ㄅㄤˋ)了(ㄌㄜ˙)！</div>`;
    quiz.innerHTML = "";
  }
}

// ---------- Activities ----------
function renderActivity(w){
  if(w.activityType === "dragMatch") renderDragMatch(w);
  if(w.activityType === "buttonsLab") renderButtonsLab();
  if(w.activityType === "sortTap") renderSortTap();
  if(w.activityType === "forceMag") renderForceMag();
}

function renderDragMatch(w){
  nextBtn.disabled = true;

  const chips = shuffle([...w.pairs].map(p => p.right));
  const lefts = w.pairs.map(p => p.left);

  activity.innerHTML = `
    <h3 class="h2">互(ㄏㄨˋ)動(ㄉㄨㄥˋ)：拖(ㄊㄨㄛ)拉(ㄌㄚ)配(ㄆㄟˋ)對(ㄉㄨㄟˋ)</h3>
    <p>把(ㄅㄚˇ)右(ㄧㄡˋ)邊(ㄅㄧㄢ)的(ㄉㄜ˙)功(ㄍㄨㄥ)能(ㄋㄥˊ)拖(ㄊㄨㄛ)到(ㄉㄠˋ)正(ㄓㄥˋ)確(ㄑㄩㄝˋ)的(ㄉㄜ˙)部(ㄅㄨˋ)位(ㄨㄟˋ)框(ㄎㄨㄤ)裡(ㄌㄧˇ)。</p>
    <div class="dragRow">
      <div class="bucket" id="buckets"></div>
      <div class="chips" id="chips"></div>
    </div>
    <div class="notice" id="dragNote">提(ㄊㄧˊ)示(ㄕˋ)：全(ㄑㄩㄢˊ)部(ㄅㄨˋ)配(ㄆㄟˋ)對(ㄉㄨㄟˋ)正(ㄓㄥˋ)確(ㄑㄩㄝˋ)就(ㄐㄧㄡˋ)可(ㄎㄜˇ)以(ㄧˇ)去(ㄑㄩˋ)小(ㄒㄧㄠˇ)測(ㄘㄜˋ)驗(ㄧㄢˋ)。</div>
  `;

  const bucketsEl = $("#buckets");
  bucketsEl.innerHTML = lefts.map(l=>`
    <div class="bucketBox" data-left="${l}">
      <div class="bucketTitle">${l}</div>
      <div class="dropZone" style="min-height:44px;"></div>
    </div>
  `).join("");

  const chipsEl = $("#chips");
  chipsEl.innerHTML = chips.map(text=>`
    <div class="chip" draggable="true" data-text="${text}">${text}</div>
  `).join("");

  // drag handlers
  let dragText = null;

  chipsEl.querySelectorAll(".chip").forEach(ch=>{
    ch.addEventListener("dragstart", (e)=>{
      dragText = ch.dataset.text;
      e.dataTransfer.setData("text/plain", dragText);
    });
  });

  bucketsEl.querySelectorAll(".bucketBox").forEach(box=>{
    const dz = box.querySelector(".dropZone");
    dz.addEventListener("dragover", (e)=>e.preventDefault());
    dz.addEventListener("drop", (e)=>{
      e.preventDefault();
      const t = e.dataTransfer.getData("text/plain");
      if(!t) return;
      // only one chip per box
      dz.innerHTML = `<span class="chip" style="cursor:default;">${t}</span>`;
      // remove chip from list
      const chipNode = chipsEl.querySelector(`.chip[data-text="${cssEscape(t)}"]`);
      if(chipNode) chipNode.remove();
      checkDragMatch(w);
    });
  });
}

function checkDragMatch(w){
  const ok = w.pairs.every(p=>{
    const box = document.querySelector(`.bucketBox[data-left="${cssEscape(p.left)}"]`);
    const dz = box.querySelector(".dropZone");
    return dz.textContent.trim() === p.right;
  });
  if(ok){
    $("#dragNote").textContent = "全(ㄑㄩㄢˊ)部(ㄅㄨˋ)正(ㄓㄥˋ)確(ㄑㄩㄝˋ)！你(ㄋㄧˇ)得(ㄉㄜˊ)到(ㄉㄠˋ)一(ㄧ)顆(ㄎㄜ)星(ㄒㄧㄥ)星(ㄒㄧㄥ)！";
    state.stars += 1;
    setBadges();
    nextBtn.disabled = false;
  }
}

function renderButtonsLab(){
  nextBtn.disabled = true;

  activity.innerHTML = `
    <h3 class="h2">互(ㄏㄨˋ)動(ㄉㄨㄥˋ)：按(ㄢˋ)鈕(ㄋㄧㄡˇ)小(ㄒㄧㄠˇ)實(ㄕˊ)驗(ㄧㄢˋ)</h3>
    <div class="q">
      <div>實(ㄕˊ)驗(ㄧㄢˋ)一(ㄧ)：空(ㄎㄨㄥ)氣(ㄑㄧˋ)佔(ㄓㄢˋ)空(ㄎㄨㄥ)間(ㄐㄧㄢ)</div>
      <div class="choices">
        <button class="choiceBtn" id="airBtn">按(ㄢˋ)我(ㄨㄛˇ)吹(ㄔㄨㄟ)氣(ㄑㄧˋ)</button>
      </div>
      <div class="notice" id="airOut">還(ㄏㄞˊ)沒(ㄇㄟˊ)做(ㄗㄨㄛˋ)喔(ㄛ)！</div>
    </div>

    <div class="q">
      <div>實(ㄕˊ)驗(ㄧㄢˋ)二(ㄦˋ)：水(ㄕㄨㄟˇ)會(ㄏㄨㄟˋ)改(ㄍㄞˇ)變(ㄅㄧㄢˋ)形(ㄒㄧㄥˊ)狀(ㄓㄨㄤˋ)</div>
      <div class="choices">
        <button class="choiceBtn" id="waterBtn">按(ㄢˋ)我(ㄨㄛˇ)倒(ㄉㄠˋ)水(ㄕㄨㄟˇ)</button>
      </div>
      <div class="notice" id="waterOut">還(ㄏㄞˊ)沒(ㄇㄟˊ)做(ㄗㄨㄛˋ)喔(ㄛ)！</div>
    </div>

    <div class="notice" id="labNote">
      提(ㄊㄧˊ)示(ㄕˋ)：兩(ㄌㄧㄤˇ)個(ㄍㄜˋ)實(ㄕˊ)驗(ㄧㄢˋ)都(ㄉㄡ)做(ㄗㄨㄛˋ)完(ㄨㄢˊ)，才(ㄘㄞˊ)能(ㄋㄥˊ)去(ㄑㄩˋ)小(ㄒㄧㄠˇ)測(ㄘㄜˋ)驗(ㄧㄢˋ)。
    </div>
  `;

  let didAir = false;
  let didWater = false;

  $("#airBtn").addEventListener("click", ()=>{
    didAir = true;
    $("#airOut").textContent = "你(ㄋㄧˇ)吹(ㄔㄨㄟ)氣(ㄑㄧˋ)了(ㄌㄜ˙)！空(ㄎㄨㄥ)氣(ㄑㄧˋ)把(ㄅㄚˇ)空(ㄎㄨㄥ)間(ㄐㄧㄢ)填(ㄊㄧㄢˊ)滿(ㄇㄢˇ)了(ㄌㄜ˙)。";
    checkLab();
  });

  $("#waterBtn").addEventListener("click", ()=>{
    didWater = true;
    $("#waterOut").textContent = "你(ㄋㄧˇ)倒(ㄉㄠˋ)水(ㄕㄨㄟˇ)了(ㄌㄜ˙)！水(ㄕㄨㄟˇ)會(ㄏㄨㄟˋ)變(ㄅㄧㄢˋ)成(ㄔㄥˊ)容(ㄖㄨㄥˊ)器(ㄑㄧˋ)的(ㄉㄜ˙)形(ㄒㄧㄥˊ)狀(ㄓㄨㄤˋ)。";
    checkLab();
  });

  function checkLab(){
    if(didAir && didWater){
      $("#labNote").textContent = "兩(ㄌㄧㄤˇ)個(ㄍㄜˋ)實(ㄕˊ)驗(ㄧㄢˋ)都(ㄉㄡ)完(ㄨㄢˊ)成(ㄔㄥˊ)！你(ㄋㄧˇ)得(ㄉㄜˊ)到(ㄉㄠˋ)一(ㄧ)顆(ㄎㄜ)星(ㄒㄧㄥ)星(ㄒㄧㄥ)！";
      state.stars += 1;
      setBadges();
      nextBtn.disabled = false;
    }
  }
}

function renderSortTap(){
  nextBtn.disabled = true;

  const items = shuffle([
    { text:"狗(ㄍㄡˇ)", type:"animal" },
    { text:"鳥(ㄋㄧㄠˇ)", type:"animal" },
    { text:"蝴(ㄏㄨˊ)蝶(ㄉㄧㄝˊ)", type:"animal" },
    { text:"樹(ㄕㄨˋ)", type:"plant" },
    { text:"草(ㄘㄠˇ)", type:"plant" },
    { text:"花(ㄏㄨㄚ)", type:"plant" }
  ]);

  activity.innerHTML = `
    <h3 class="h2">互(ㄏㄨˋ)動(ㄉㄨㄥˋ)：點(ㄉㄧㄢˇ)一(ㄧ)下(ㄒㄧㄚˋ)就(ㄐㄧㄡˋ)分(ㄈㄣ)類(ㄌㄟˋ)</h3>
    <p>看(ㄎㄢˋ)到(ㄉㄠˋ)卡(ㄎㄚˇ)片(ㄆㄧㄢˋ)，按(ㄢˋ)「動(ㄉㄨㄥˋ)物(ㄨˋ)」或(ㄏㄨㄛˋ)「植(ㄓˊ)物(ㄨˋ)」。</p>

    <div class="q">
      <div id="sortCard" style="font-size:22px; font-weight:700;"></div>
      <div class="choices">
        <button class="choiceBtn" id="btnAnimal">動(ㄉㄨㄥˋ)物(ㄨˋ)</button>
        <button class="choiceBtn" id="btnPlant">植(ㄓˊ)物(ㄨˋ)</button>
      </div>
      <div class="notice" id="sortOut">準(ㄓㄨㄣˇ)備(ㄅㄟˋ)好(ㄏㄠˇ)了(ㄌㄜ˙)嗎(ㄇㄚ)？</div>
    </div>

    <div class="notice" id="sortNote">
      提(ㄊㄧˊ)示(ㄕˋ)：連(ㄌㄧㄢˊ)續(ㄒㄩˋ)答(ㄉㄚˊ)對(ㄉㄨㄟˋ)六(ㄌㄧㄡˋ)張(ㄓㄤ)就(ㄐㄧㄡˋ)過(ㄍㄨㄛˋ)關(ㄍㄨㄢ)！
    </div>
  `;

  let idx = 0;
  let correct = 0;

  function show(){
    $("#sortCard").textContent = items[idx].text;
  }
  show();

  function answer(type){
    const ok = items[idx].type === type;
    if(ok){
      correct += 1;
      $("#sortOut").textContent = "答(ㄉㄚˊ)對(ㄉㄨㄟˋ)了(ㄌㄜ˙)！繼(ㄐㄧˋ)續(ㄒㄩˋ)！";
    }else{
      $("#sortOut").textContent = "再(ㄗㄞˋ)想(ㄒㄧㄤˇ)一(ㄧ)下(ㄒㄧㄚˋ)：動(ㄉㄨㄥˋ)物(ㄨˋ)會(ㄏㄨㄟˋ)動(ㄉㄨㄥˋ)會(ㄏㄨㄟˋ)吃(ㄔ)喔(ㄛ)！";
    }
    idx += 1;
    if(idx >= items.length){
      if(correct >= 5){
        $("#sortNote").textContent = "你(ㄋㄧˇ)很(ㄏㄣˇ)厲(ㄌㄧˋ)害(ㄏㄞˋ)！你(ㄋㄧˇ)得(ㄉㄜˊ)到(ㄉㄠˋ)一(ㄧ)顆(ㄎㄜ)星(ㄒㄧㄥ)星(ㄒㄧㄥ)！";
        state.stars += 1;
        setBadges();
        nextBtn.disabled = false;
      }else{
        $("#sortNote").textContent = "我(ㄨㄛˇ)們(ㄇㄣ˙)再(ㄗㄞˋ)練(ㄌㄧㄢˋ)一(ㄧ)次(ㄘˋ)！點(ㄉㄧㄢˇ)回(ㄏㄨㄟˊ)上(ㄕㄤˋ)面(ㄇㄧㄢˋ)再(ㄗㄞˋ)玩(ㄨㄢˊ)。";
        nextBtn.disabled = true;
      }
      return;
    }
    show();
  }

  $("#btnAnimal").addEventListener("click", ()=>answer("animal"));
  $("#btnPlant").addEventListener("click", ()=>answer("plant"));
}

function renderForceMag(){
  nextBtn.disabled = true;

  activity.innerHTML = `
    <h3 class="h2">互(ㄏㄨˋ)動(ㄉㄨㄥˋ)：推(ㄊㄨㄟ)拉(ㄌㄚ)與(ㄩˇ)磁(ㄘˊ)力(ㄌㄧˋ)</h3>

    <div class="q">
      <div>第(ㄉㄧˋ)一(ㄧ)步(ㄅㄨˋ)：選(ㄒㄩㄢˇ)出(ㄔㄨ)「推(ㄊㄨㄟ)」和(ㄏㄢˋ)「拉(ㄌㄚ)」</div>
      <div class="choices">
        <button class="choiceBtn" id="pickPush">推(ㄊㄨㄟ)</button>
        <button class="choiceBtn" id="pickPull">拉(ㄌㄚ)</button>
      </div>
      <div class="notice" id="forceOut">選(ㄒㄩㄢˇ)一(ㄧ)個(ㄍㄜˋ)試(ㄕˋ)試(ㄕˋ)！</div>
    </div>

    <div class="q">
      <div>第(ㄉㄧˋ)二(ㄦˋ)步(ㄅㄨˋ)：磁(ㄘˊ)鐵(ㄊㄧㄝˇ)會(ㄏㄨㄟˋ)吸(ㄒㄧ)哪(ㄋㄚˇ)一(ㄧ)個(ㄍㄜˋ)？</div>
      <div class="choices">
        <button class="choiceBtn" data-mag="no">木(ㄇㄨˋ)頭(ㄊㄡˊ)</button>
        <button class="choiceBtn" data-mag="yes">迴(ㄏㄨㄟˊ)紋(ㄨㄣˊ)針(ㄓㄣ)</button>
        <button class="choiceBtn" data-mag="no">橡(ㄒㄧㄤˋ)皮(ㄆㄧˊ)</button>
      </div>
      <div class="notice" id="magOut">選(ㄒㄩㄢˇ)一(ㄧ)個(ㄍㄜˋ)試(ㄕˋ)試(ㄕˋ)！</div>
    </div>

    <div class="notice" id="forceNote">
      提(ㄊㄧˊ)示(ㄕˋ)：兩(ㄌㄧㄤˇ)步(ㄅㄨˋ)都(ㄉㄡ)答(ㄉㄚˊ)對(ㄉㄨㄟˋ)就(ㄐㄧㄡˋ)過(ㄍㄨㄛˋ)關(ㄍㄨㄢ)。
    </div>
  `;

  let ok1 = false;
  let ok2 = false;

  $("#pickPush").addEventListener("click", ()=>{
    ok1 = true;
    $("#forceOut").textContent = "推(ㄊㄨㄟ)就(ㄐㄧㄡˋ)是(ㄕˋ)把(ㄅㄚˇ)東(ㄉㄨㄥ)西(ㄒㄧ)往(ㄨㄤˇ)前(ㄑㄧㄢˊ)送(ㄙㄨㄥˋ)。";
    check();
  });

  $("#pickPull").addEventListener("click", ()=>{
    ok1 = true;
    $("#forceOut").textContent = "拉(ㄌㄚ)就(ㄐㄧㄡˋ)是(ㄕˋ)把(ㄅㄚˇ)東(ㄉㄨㄥ)西(ㄒㄧ)往(ㄨㄤˇ)自(ㄗˋ)己(ㄐㄧˇ)帶(ㄉㄞˋ)。也(ㄧㄝˇ)是(ㄕˋ)力(ㄌㄧˋ)！";
    check();
  });

  activity.querySelectorAll("[data-mag]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const yes = btn.dataset.mag === "yes";
      if(yes){
        ok2 = true;
        $("#magOut").textContent = "答(ㄉㄚˊ)對(ㄉㄨㄟˋ)了(ㄌㄜ˙)！磁(ㄘˊ)鐵(ㄊㄧㄝˇ)會(ㄏㄨㄟˋ)吸(ㄒㄧ)一(ㄧ)些(ㄒㄧㄝ)金(ㄐㄧㄣ)屬(ㄕㄨˇ)東(ㄉㄨㄥ)西(ㄒㄧ)。";
      }else{
        $("#magOut").textContent = "再(ㄗㄞˋ)想(ㄒㄧㄤˇ)一(ㄧ)下(ㄒㄧㄚˋ)：磁(ㄘˊ)鐵(ㄊㄧㄝˇ)比(ㄅㄧˇ)較(ㄐㄧㄠˋ)喜(ㄒㄧˇ)歡(ㄏㄨㄢ)金(ㄐㄧㄣ)屬(ㄕㄨˇ)。";
      }
      check();
    });
  });

  function check(){
    if(ok1 && ok2){
      $("#forceNote").textContent = "過(ㄍㄨㄛˋ)關(ㄍㄨㄢ)！你(ㄋㄧˇ)得(ㄉㄜˊ)到(ㄉㄠˋ)一(ㄧ)顆(ㄎㄜ)星(ㄒㄧㄥ)星(ㄒㄧㄥ)！";
      state.stars += 1;
      setBadges();
      nextBtn.disabled = false;
    }
  }
}

// ---------- Quiz ----------
function renderQuiz(w){
  nextBtn.disabled = true;
  quiz.innerHTML = `
    <h3 class="h2">小(ㄒㄧㄠˇ)測(ㄘㄜˋ)驗(ㄧㄢˋ)：三(ㄙㄢ)題(ㄊㄧˊ)</h3>
    <div id="quizWrap"></div>
    <div class="notice" id="quizNote">提(ㄊㄧˊ)示(ㄕˋ)：答(ㄉㄚˊ)對(ㄉㄨㄟˋ)兩(ㄌㄧㄤˇ)題(ㄊㄧˊ)以(ㄧˇ)上(ㄕㄤˋ)就(ㄐㄧㄡˋ)算(ㄙㄨㄢˋ)通(ㄊㄨㄥ)過(ㄍㄨㄛˋ)。</div>
  `;

  const wrap = $("#quizWrap");
  let answered = 0;
  let score = 0;

  w.quiz.forEach((item, i)=>{
    const qEl = document.createElement("div");
    qEl.className = "q";
    qEl.innerHTML = `
      <div>${i+1}. ${item.q}</div>
      <div class="choices">
        ${item.choices.map(c=>`<button class="choiceBtn" data-q="${i}" data-c="${c}">${c}</button>`).join("")}
      </div>
      <div class="notice" id="out${i}">請(ㄑㄧㄥˇ)選(ㄒㄩㄢˇ)一(ㄧ)個(ㄍㄜˋ)答(ㄉㄚˊ)案(ㄢˋ)。</div>
    `;
    wrap.appendChild(qEl);
  });

  wrap.querySelectorAll(".choiceBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const qi = Number(btn.dataset.q);
      const choice = btn.dataset.c;
      const item = w.quiz[qi];
      const out = $(`#out${qi}`);

      // lock this question
      const buttons = wrap.querySelectorAll(`.choiceBtn[data-q="${qi}"]`);
      buttons.forEach(b=>b.disabled = true);

      answered += 1;

      if(choice === item.ans){
        score += 1;
        btn.classList.add("correct");
        out.textContent = "答(ㄉㄚˊ)對(ㄉㄨㄟˋ)了(ㄌㄜ˙)！很(ㄏㄣˇ)好(ㄏㄠˇ)！";
      }else{
        btn.classList.add("wrong");
        out.textContent = `可(ㄎㄜˇ)惜(ㄒㄧ)！正(ㄓㄥˋ)確(ㄑㄩㄝˋ)答(ㄉㄚˊ)案(ㄢˋ)是(ㄕˋ)：${item.ans}。`;
      }

      if(answered === w.quiz.length){
        if(score >= 2){
          $("#quizNote").textContent = `通(ㄊㄨㄥ)過(ㄍㄨㄛˋ)！你(ㄋㄧˇ)答(ㄉㄚˊ)對(ㄉㄨㄟˋ)了(ㄌㄜ˙) ${score} 題(ㄊㄧˊ)。`;
          nextBtn.disabled = false;
        }else{
          $("#quizNote").textContent = `再(ㄗㄞˋ)練(ㄌㄧㄢˋ)一(ㄧ)次(ㄘˋ)會(ㄏㄨㄟˋ)更(ㄍㄥˋ)強(ㄑㄧㄤˊ)！你(ㄋㄧˇ)答(ㄉㄚˊ)對(ㄉㄨㄟˋ)了(ㄌㄜ˙) ${score} 題(ㄊㄧˊ)。回(ㄏㄨㄟˊ)到(ㄉㄠˋ)互(ㄏㄨˋ)動(ㄉㄨㄥˋ)再(ㄗㄞˋ)玩(ㄨㄢˊ)一(ㄧ)次(ㄘˋ)也(ㄧㄝˇ)可(ㄎㄜˇ)以(ㄧˇ)。`;
          nextBtn.disabled = true;
        }
      }
    });
  });
}

function finishWorld(){
  const key = state.currentWorld;
  state.done[key] = true;
  setBadges();

  activity.innerHTML = `<div class="notice">你(ㄋㄧˇ)完(ㄨㄢˊ)成(ㄔㄥˊ)了(ㄌㄜ˙)「${WORLDS[key].title}」！</div>`;
  quiz.innerHTML = `<div class="notice">下(ㄒㄧㄚˋ)次(ㄘˋ)還(ㄏㄞˊ)可(ㄎㄜˇ)以(ㄧˇ)再(ㄗㄞˋ)玩(ㄨㄢˊ)一(ㄧ)次(ㄘˋ)加(ㄐㄧㄚ)強(ㄑㄧㄤˊ)記(ㄐㄧˋ)憶(ㄧˋ)。</div>`;
  nextBtn.textContent = "回(ㄏㄨㄟˊ)到(ㄉㄠˋ)選(ㄒㄩㄢˇ)單(ㄉㄢ)";
  nextBtn.disabled = false;
}

// ---------- helpers ----------
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cssEscape(s){
  return String(s).replace(/["\\]/g, "\\$&");
}
