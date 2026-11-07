const situations = {
  restaurant: {
    title: "🍽️ Restaurant",
    roles: ["Waiter", "Customer"],
    lines: [
      { who: 0, text: "Good evening! Table for how many?" },
      { who: 1, text: "Table for two, please." },
      { who: 0, text: "Please follow me. Here is the menu." },
      { who: 1, text: "Thank you. I would like a vegetable biryani and a glass of water." },
      { who: 0, text: "Would you like anything else?" },
      { who: 1, text: "No, that's all. Could I have the bill, please?" }
    ]
  },
  bus: {
    title: "🚌 Bus Stop",
    roles: ["Passenger", "Conductor"],
    lines: [
      { who: 0, text: "Excuse me, does this bus go to the railway station?" },
      { who: 1, text: "Yes, it does. Please get in." },
      { who: 0, text: "How much is the ticket?" },
      { who: 1, text: "It is twenty rupees." }
    ]
  },
  interview: {
    title: "💼 Job Interview",
    roles: ["Interviewer", "Candidate"],
    lines: [
      { who: 0, text: "Good morning. Please tell me about yourself." },
      { who: 1, text: "Good morning. I am a Computer Science student and I enjoy coding." },
      { who: 0, text: "What are your strengths?" },
      { who: 1, text: "I learn quickly and I work well in a team." }
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const situation = situations[params.get("s")] || situations.restaurant;

document.getElementById("title").textContent = situation.title;

const scriptBox = document.getElementById("script");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const doneMsg = document.getElementById("done");
let current = -1;

situation.lines.forEach((line) => {
  const div = document.createElement("div");
  div.className = "line " + (line.who === 0 ? "left" : "right");
  div.innerHTML = `<span class="name">${situation.roles[line.who]}</span><p>${line.text}</p>`;
  scriptBox.appendChild(div);
});

const lineEls = document.querySelectorAll(".line");

function clearHighlight() {
  lineEls.forEach((el) => el.classList.remove("active"));
}

function highlight() {
  clearHighlight();
  lineEls[current].classList.add("active");
  lineEls[current].scrollIntoView({ behavior: "smooth", block: "center" });
}

startBtn.addEventListener("click", () => {
  current = 0;
  doneMsg.textContent = "";
  nextBtn.disabled = false;
  startBtn.textContent = "Restart";
  highlight();
});

nextBtn.addEventListener("click", () => {
  current++;
  if (current >= lineEls.length) {
    clearHighlight();
    nextBtn.disabled = true;
    doneMsg.textContent = "🎉 Well done! Conversation finished.";
  } else {
    highlight();
  }
});
const stopBtn = document.getElementById("stopBtn");
let mediaRecorder = null;
let chunks = [];

recordBtn.addEventListener("click", () => {
  chunks = [];
  mediaRecorder = new MediaRecorder(micStream);

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
    console.log("Recorded:", blob.size, "bytes");

    const player = document.getElementById("player");
    player.src = URL.createObjectURL(blob);
    player.hidden = false;
  };
  mediaRecorder.start();
  recordBtn.disabled = true;
  stopBtn.disabled = false;
  doneMsg.textContent = "🔴 Recording...";
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  recordBtn.disabled = false;
  stopBtn.disabled = true;
  doneMsg.textContent = "✅ Recording saved";
});