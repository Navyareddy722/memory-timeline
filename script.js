let memories = JSON.parse(localStorage.getItem("memories")) || [];
let mediaRecorder;
let audioChunks = [];
let recordedAudio = "";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const audioPreview = document.getElementById("audioPreview");

startBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            recordedAudio = reader.result;
            audioPreview.src = recordedAudio;
        };
    };
};

stopBtn.onclick = () => {
    mediaRecorder.stop();
};

function addMemory() {
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const mood = document.getElementById("mood").value;
    const imageInput = document.getElementById("image");

    if (!title || !date) {
        alert("Please fill required fields");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageInput.files[0]);

    reader.onloadend = function () {
        const memory = {
            title,
            date,
            description,
            mood,
            image: reader.result,
            audio: recordedAudio
        };

        memories.push(memory);
        localStorage.setItem("memories", JSON.stringify(memories));
        displayMemories();
    };
}

function displayMemories() {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    memories.forEach(memory => {
        const card = document.createElement("div");
        card.className = "memory-card " + memory.mood;

        card.innerHTML = `
            <h3>${memory.title}</h3>
            <p>${memory.date}</p>
            <p>${memory.description}</p>
            <img src="${memory.image}">
            ${memory.audio ? <audio controls src="${memory.audio}"></audio> : ""}
        `;

        timeline.appendChild(card);
    });
}

displayMemories();
