import { useMemo, useState } from "react";

type Question = {
  title: string;
  image: string;
  lambda: number;
  u: number;
  correctMm: number;
};

function makeQuestion(): Question {
  const lambdas = [0.031, 0.033, 0.035, 0.038, 0.04];
  const us = [0.09, 0.11, 0.13, 0.15, 0.17];

  const lambda = lambdas[Math.floor(Math.random() * lambdas.length)];
  const u = us[Math.floor(Math.random() * us.length)];
  const correctMm = Math.round((lambda / u) * 1000);

  const images = ["🏠", "🧱", "🔥", "📐", "👷‍♂️", "🏗️", "🌡️"];

  return {
    title: "Laske tarvittava eristepaksuus",
    image: images[Math.floor(Math.random() * images.length)],
    lambda,
    u,
    correctMm
  };
}

function makeQuestions(amount: number): Question[] {
  return Array.from({ length: amount }, () => makeQuestion());
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(() => makeQuestions(10));
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const progress = useMemo(() => {
    return Math.round(((current + 1) / questions.length) * 100);
  }, [current, questions.length]);

  function checkAnswer() {
    const userAnswer = Number(answer.replace(",", "."));

    if (Number.isNaN(userAnswer) || answer.trim() === "") {
      setFeedback("Kirjoita vastaus millimetreinä, esim. 180");
      return;
    }

    const difference = Math.abs(userAnswer - q.correctMm);

    if (difference <= 5) {
      setScore(score + 10);
      setFeedback(`✅ Oikein! Vastaus on noin ${q.correctMm} mm`);
    } else if (difference <= 20) {
      setScore(score + 5);
      setFeedback(`🟡 Melkein! Oikea vastaus on noin ${q.correctMm} mm`);
    } else {
      setScore(score - 3);
      setFeedback(`❌ Ei ihan. Oikea vastaus on noin ${q.correctMm} mm`);
    }
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setAnswer("");
      setFeedback("");
    }
  }

  function restart() {
    setQuestions(makeQuestions(10));
    setCurrent(0);
    setAnswer("");
    setScore(0);
    setFeedback("");
    setFinished(false);
  }

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.bigImage}>🏆</div>
          <h1>Rakennusmestari-laskupeli valmis!</h1>
          <h2>Pisteet: {score}</h2>

          <p style={styles.result}>
            {score >= 70
              ? "🔥 Kova suoritus! Tenttikunto alkaa olla hyvä."
              : score >= 40
              ? "👍 Hyvä alku! Vielä vähän treeniä."
              : "💪 Ei hätää. Tätä kannattaa jauhaa muutama kierros."}
          </p>

          <button style={styles.mainButton} onClick={restart}>
            Pelaa uudestaan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.progressOuter}>
          <div style={{ ...styles.progressInner, width: `${progress}%` }} />
        </div>

        <p style={styles.smallText}>
          Kysymys {current + 1} / {questions.length}
        </p>

        <div style={styles.bigImage}>{q.image}</div>

        <h1>{q.title}</h1>

        <div style={styles.infoBox}>
          <p>
            λ = <b>{q.lambda}</b> W/mK
          </p>
          <p>
            U = <b>{q.u}</b> W/m²K
          </p>
        </div>

        <p style={styles.hint}>Kaava: d = λ / U</p>
        <p style={styles.hint}>Muista: metri → millimetri × 1000</p>

        <input
          style={styles.input}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Vastaus mm, esim. 180"
        />

        {!feedback ? (
          <button style={styles.mainButton} onClick={checkAnswer}>
            Tarkista
          </button>
        ) : (
          <button style={styles.mainButton} onClick={nextQuestion}>
            Seuraava
          </button>
        )}

        {feedback && <div style={styles.feedback}>{feedback}</div>}

        <p style={styles.score}>Pisteet: {score}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dbeafe, #fef3c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Arial, sans-serif"
  },
  card: {
    background: "white",
    width: "100%",
    maxWidth: 520,
    borderRadius: 28,
    padding: 28,
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
  },
  bigImage: {
    fontSize: 82,
    margin: "10px 0"
  },
  infoBox: {
    background: "#f1f5f9",
    borderRadius: 18,
    padding: 16,
    margin: "20px 0",
    fontSize: 20
  },
  hint: {
    color: "#475569",
    margin: 4
  },
  input: {
    width: "100%",
    padding: 16,
    fontSize: 20,
    borderRadius: 14,
    border: "2px solid #cbd5e1",
    marginTop: 20,
    boxSizing: "border-box",
    textAlign: "center"
  },
  mainButton: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    border: "none",
    borderRadius: 16,
    background: "#2563eb",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    cursor: "pointer"
  },
  feedback: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "#ecfeff",
    fontSize: 18
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20
  },
  progressOuter: {
    width: "100%",
    height: 14,
    background: "#e2e8f0",
    borderRadius: 20,
    overflow: "hidden"
  },
  progressInner: {
    height: "100%",
    background: "#22c55e",
    transition: "width 0.3s"
  },
  smallText: {
    color: "#64748b"
  },
  result: {
    fontSize: 20
  }
};
