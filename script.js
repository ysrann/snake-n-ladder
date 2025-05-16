const board = document.getElementById('board');
const rollBtn = document.getElementById('rollBtn');
const diceResult = document.getElementById('diceResult');
const positionText = document.getElementById('position');
const message = document.getElementById('message');

const questionModal = document.getElementById('questionModal');
const questionText = document.getElementById('questionText');
const answersDiv = document.getElementById('answers');

// Buat 100 kotak papan
const cells = [];
let playerPos = 1;

// 10 titik pertanyaan acak (unik)
const questionSpots = generateQuestionSpots(10, 2, 99); // kotak dari 2 sampai 99 (karena 1 start dan 100 finish)

const questions = [
  {
    question: "Apa ibu kota Indonesia?",
    choices: ["Jakarta", "Bandung", "Surabaya", "Medan"],
    answer: 0,
  },
  {
    question: "Pulau terbesar di Indonesia?",
    choices: ["Sumatra", "Jawa", "Kalimantan", "Sulawesi"],
    answer: 2,
  },
  {
    question: "Lambang negara Indonesia adalah?",
    choices: ["Garuda Pancasila", "Merpati", "Rajawali", "Macan"],
    answer: 0,
  },
  {
    question: "Bahasa resmi Indonesia?",
    choices: ["Jawa", "Sunda", "Indonesia", "Melayu"],
    answer: 2,
  },
  {
    question: "Tahun kemerdekaan Indonesia?",
    choices: ["1945", "1950", "1947", "1935"],
    answer: 0,
  },
  {
    question: "Presiden pertama Indonesia?",
    choices: ["Sukarno", "Soeharto", "Jokowi", "Habibie"],
    answer: 0,
  },
  {
    question: "Lagu kebangsaan Indonesia?",
    choices: ["Indonesia Raya", "Tanah Airku", "Rayuan Pulau Kelapa", "Satu Nusa"],
    answer: 0,
  },
  {
    question: "Pulau tempat candi Borobudur?",
    choices: ["Jawa", "Sumatra", "Bali", "Sulawesi"],
    answer: 0,
  },
  {
    question: "Mata uang Indonesia?",
    choices: ["Rupiah", "Dolar", "Euro", "Yen"],
    answer: 0,
  },
  {
    question: "Pahlawan nasional yang dikenal sebagai 'Bapak Pendidikan Indonesia'?",
    choices: ["Ki Hajar Dewantara", "Diponegoro", "Sudirman", "Kartini"],
    answer: 0,
  },
];

// Acak urutan pertanyaan tiap game start
let questionPool = [];

function generateQuestionSpots(count, min, max) {
  let spots = new Set();
  while (spots.size < count) {
    let r = Math.floor(Math.random() * (max - min + 1)) + min;
    spots.add(r);
  }
  return Array.from(spots);
}

function drawBoard() {
  board.innerHTML = '';
  let reverseRow = false;
  for (let row = 9; row >= 0; row--) {
    for (let col = 0; col < 10; col++) {
      let index = row * 10 + col + 1;
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = index;

      // Ular tangga zig-zag numbering
      if (reverseRow) {
        cell.dataset.index = row * 10 + (9 - col) + 1;
      } else {
        cell.dataset.index = index;
      }

      cell.textContent = cell.dataset.index;

      if (questionSpots.includes(Number(cell.dataset.index))) {
        cell.classList.add('question');
      }
      if (Number(cell.dataset.index) === playerPos) {
        cell.classList.add('player');
      }
      cells.push(cell);
      board.appendChild(cell);
    }
    reverseRow = !reverseRow;
  }
}

function updateBoard() {
  cells.forEach(cell => cell.classList.remove('player'));
  let playerCell = cells.find(c => Number(c.dataset.index) === playerPos);
  if (playerCell) playerCell.classList.add('player');
  positionText.textContent = `Posisi Pemain: ${playerPos}`;
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function shuffleArray(arr) {
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function askQuestion() {
  // Ambil pertanyaan acak dari questionPool
  if (questionPool.length === 0) {
    questionPool = shuffleArray([...questions]);
  }
  const q = questionPool.pop();

  questionText.textContent = q.question;
  answersDiv.innerHTML = '';

  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.classList.add('answer-btn');
    btn.onclick = () => {
      if (i === q.answer) {
        message.textContent = 'Jawaban benar! Lanjut.';
        closeModal();
        updateBoard();
        checkWin();
      } else {
        message.textContent = 'Jawaban salah, mundur 3 langkah!';
        closeModal();
        playerPos -= 3;
        if (playerPos < 1) playerPos = 1;
        updateBoard();
      }
      rollBtn.disabled = false;
    };
    answersDiv.appendChild(btn);
  });

  questionModal.classList.remove('hidden');
}

function closeModal() {
  questionModal.classList.add('hidden');
}

function checkWin() {
  if (playerPos >= 100) {
    message.textContent = 'Selamat! Kamu mencapai garis finish dan menang!';
    rollBtn.disabled = true;
  }
}

rollBtn.onclick = () => {
  rollBtn.disabled = true;
  message.textContent = '';
  let dice = rollDice();
  diceResult.textContent = `Dadu: ${dice}`;
  playerPos += dice;
  if (playerPos > 100) playerPos = 100;

  updateBoard();

  if (questionSpots.includes(playerPos)) {
    askQuestion();
  } else {
    rollBtn.disabled = false;
    checkWin();
  }
};

window.onload = () => {
  questionPool = shuffleArray([...questions]);
  drawBoard();
  updateBoard();
};
