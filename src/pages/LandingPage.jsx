import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
// Import your assets and components
import Asf from "../assets/asf.jpg";
import Open from "../assets/open.png";
import Git from "../assets/github.png";
import Arushi from "../assets/Pp.jpg";
import Minecraft from "./Minecraft";
import M from "../assets/mars.png";
import E from "../assets/earth.png";
import J from "../assets/jupiter.png";
import N from "../assets/neptune.png";
import S from "../assets/saturn.png";

// Import the Earth component
import Earth from "./Earth";

const FlipCard = ({ front, back, display }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip-card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img className="image" src={display} alt={front} />
          <p>{front}</p>
        </div>
        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
};

const LandingPage = ({ navigate }) => {
  navigate = useNavigate();
  const steps = [
    { text: "We bring you SAR data from all over the Globe...", img: E, label: "Earth", top: "10%", left: "15%" },
    { text: "Once you find the location that facinates you...", img: M, label: "Mars", top: "30%", left: "70%" },
    { text: "Our servers will fetch, and load the Latest SAR image...", img: J, label: "Jupiter", top: "50%", left: "20%" },
    { text: "Along with SAR image, you will get Meta SAR data...", img: N, label: "Neptune", top: "70%", left: "75%" },
    { text: "Read, Understand, Enjoy and when done...", img: S, label: "Earth Again", top: "85%", left: "40%" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    {
      question: "What is covering the forest?",
      options: ["Ice", "Sand", "Grass", "Water"],
      correct: 0,
    },
    {
      question: "What season is it likely?",
      options: ["Summer", "Winter", "Autumn", "Spring"],
      correct: 1,
    },
    {
      question: "What can you see the most in this scene?",
      options: ["Houses", "Grass", "Water", "Trees"],
      correct: 3,
    },
    {
      question: "What do you thing the majority colour of its sar image will contain? ",
      options: ["Green", "white", "Blue", "Red"],
      correct: 2,
    },
  ];
  const [answerState, setAnswerState] = useState(null);

  const handleAnswer = (index) => {
    setAnswerState(index === questions[currentQuestion].correct ? "correct" : "wrong");
    setTimeout(() => {
      setAnswerState(null);
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 800);
  };

  const [input, setInput] = useState("");
  const correctCode = "5678";

  const handleCalcClick = (num) => {
    const newInput = input + num;
    setInput(newInput);
    if (newInput === correctCode) {
      navigate("/globe");
    } else if (!correctCode.startsWith(newInput)) {
      setInput("");
    }
  };

  // State for the Earth model's transform style
  const [earthTransform, setEarthTransform] = useState('');
  // NEW: State for the Earth model's z-index
  const [earthZIndex, setEarthZIndex] = useState(10);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      let x, y, scale;

      // Animate from Section 1 to Section 2
      if (scrollY < vh) {
        const progress = scrollY / vh;
        // Pushes Earth from center (50vw) to far-left (5vw)
        x = 50 - progress * 45; 
        y = 100 - progress * 50;
        scale = 0.8 + progress * 0.2;
      }
      // Animate from Section 2 to Section 3
      else if (scrollY < vh * 2) {
        const progress = (scrollY - vh) / vh;
        // Pushes Earth from far-left (5vw) to far-right (95vw)
        x = 5 + progress * 90; 
        y = 50;
        // Makes Earth bigger as it moves to the right
        scale = 1.0 + progress * 0.2; 
      }
      // Position for sections after 3
      else {
        x = 95; // Stays at far-right
        y = 50;
        scale = 1.2; // Stays at the larger size
      }

      // NEW: Change z-index to move Earth behind content in Section 3
      // We start the transition slightly before it enters section 3 for a smoother effect
      setEarthZIndex(scrollY < vh * 1.8 ? 10 : 0);

      setEarthTransform(`translate(${x}vw, ${y}vh) translate(-50%, -50%) scale(${scale})`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


 return (
    <div className="landing-page">
      
      <Navbar/>
      <div 
        className="earth-canvas-container" 
        style={{ transform: earthTransform, zIndex: earthZIndex }}
      >
        <Earth />
      </div>

      {/* FIXED: Added id="section-1" */}
      <section id="section-1" className="section section1">
        <h1>SAR-A</h1>
      </section>

      {/* FIXED: Added id="section-2" */}
      <section id="section-2" className="section section2">
        <div className="holo-box">
          <p>
            This project is a next-generation Synthetic Aperture Radar (SAR) geospatial intelligence platform that transforms complex satellite data into clear, actionable insights.
            Through an interactive 3D globe interface, users can explore high-resolution SAR imagery capable of revealing details invisible to traditional optical satellites—penetrating clouds, operating day and night, and detecting subtle ground changes.
            Its uniqueness lies in democratizing access: SAR data, often locked behind technical barriers, is processed and visualized in real time using AI and cloud pipelines, making it intuitive for scientists, policymakers, NGOs, and the public alike.
            From disaster response to climate monitoring and urban planning, the platform enables faster, smarter, and more informed decisions.
            By blending cutting-edge radar sensing with an accessible, visually stunning interface, this project becomes more than a tool—it is a planetary awareness engine, helping humanity see the unseen and act responsibly on a global scale.
          </p>
        </div>
      </section>

      {/* FIXED: Added id="section-3" */}
      <section id="section-3" className="section section3">
        <FlipCard display={Arushi} front="Arushi Ojha" back="Arushi, a CS undergrad , always enthusiastic to learn something new" />
        <FlipCard display={Asf} front="ASF Earth Data API" back="Providing the SAR meta Data necessary to showcase us" />
        <FlipCard display={Open} front="OpenRouter API" back="Analysing the SAR meta data so it is easier to read and understand by everyone" />
        <FlipCard display={Git} front="Github" back="Hosting everything online for devOps all around the world to enjoy this application" />
      </section>

      {/* FIXED: Added id="section-4" */}
      <section id="section-4" className="section section4">
        <div className="steps-buttons">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className={activeStep === idx ? "active" : ""}
              onClick={() => setActiveStep(idx)}
            >
              Step {idx + 1}: {step.label}
            </button>
          ))}
        </div>
        <div className="holo-box step-detail">
          {steps[activeStep].text}
        </div>
        {steps.map((step, idx) => (
          <img
            key={idx}
            src={step.img}
            alt={step.label}
            className={`floating-planet planet-${idx}`}
            style={{ top: step.top, left: step.left }}
          />
        ))}
      </section>

      {/* FIXED: Added id="section-5" */}
      <section id="section-5" className="section section5">
        <div className="game-box">
          <Minecraft /><p>you can grab and rotate the model to examine better</p>
          <h3>{questions[currentQuestion].question}</h3>
          <div className="options">
            {questions[currentQuestion].options.map((opt, idx) => (
              <button
                key={idx}
                className={
                  answerState === "correct" && idx === questions[currentQuestion].correct
                    ? "correct"
                    : answerState === "wrong" && idx !== questions[currentQuestion].correct && idx === idx
                      ? "wrong"
                      : ""
                }
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FIXED: Added id="section-6" */}
      <section id="section-6" className="section section6">
        <h3>Type 5678...</h3>
        <div className="calculator">
          {Array.from({ length: 9 }, (_, i) => (
            <button key={i} onClick={() => handleCalcClick((i + 1).toString())}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => handleCalcClick("0")}>0</button>
        </div>
        <p className="calc-input">{input}</p>
      </section>
    </div>
  );
};

export default LandingPage;