import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AsteroidBelt from "./AsteroidBelt";
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
// Importing your local videos
import v1 from '../assets/Change.mp4';
import v2 from '../assets/Map.mp4';
import v3 from '../assets/Planet.mp4';
import v4 from '../assets/Satellite.mp4';
import v5 from '../assets/Space.mp4';
import v6 from '../assets/SS.mp4';
// Importing the SAR images you provided
import SarImage1 from "../assets/Sar1.jpg";
import SarImage2 from "../assets/Sar2.avif";
import SarImage3 from "../assets/Sar3.jpeg";

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
    { text: "We bring you SAR data from any location on the Globe.", img: E, label: "Click Me", top: "10%", left: "15%" },
    { text: "Once you find a location that fascinates you, simply click to pin it.", img: M, label: "Click me", top: "30%", left: "70%" },
    { text: "Our servers will fetch and load the latest SAR image for that exact spot.", img: J, label: "Click me", top: "50%", left: "20%" },
    { text: "Along with the SAR image, you will get its metadata, explained by AI.", img: N, label: "Click me", top: "70%", left: "75%" },
    { text: "Read, understand, and enjoy the insights. When you're done, select another location!", img: S, label: "Click me", top: "85%", left: "40%" },
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

  const [earthTransform, setEarthTransform] = useState('');
  const [earthZIndex, setEarthZIndex] = useState(10);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      let x, y, scale;
      if (scrollY < vh) {
        const progress = scrollY / vh;
        x = 50 - progress * 45;
        y = 100 - progress * 50;
        scale = 0.8 + progress * 0.2;
      }
      else if (scrollY < vh * 2) {
        const progress = (scrollY - vh) / vh;
        x = 5 + progress * 90;
        y = 50;
        scale = 1.0 + progress * 0.2;
      }
      else {
        x = 95;
        y = 50;
        scale = 1.2;
      }
      setEarthZIndex(scrollY < vh * 1.8 ? 10 : 0);

      setEarthTransform(`translate(${x}vw, ${y}vh) translate(-50%, -50%) scale(${scale})`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ### MODIFICATION 1: Updated data array to use video imports ###
  const descriptionData = [
    {
      title: "👁️ Seeing in a New Light: What is SAR?",
      videoSrc: v5,
      flexDirection: 'row',
      content: "Synthetic Aperture Radar (SAR) isn't a normal camera. It's a powerful remote sensing technology that can see through clouds, smoke, and even darkness. SAR-A is built to harness this power, revealing details on the Earth's surface that are invisible to traditional satellites."
    },
    {
      title: "🛰️ Our Source: The ASF Earth Data API",
      videoSrc: v4,
      flexDirection: 'row-reverse',
      content: "Our platform connects directly to the Alaska Satellite Facility (ASF) Distributed Active Archive Center, a premier source for SAR data provided by NASA. This gives us access to a vast, constantly updated library of high-resolution imagery from across the globe."
    },
    {
      title: "🧩 The Challenge: Decoding Complex Data",
      videoSrc: v1,
      flexDirection: 'row',
      content: "Raw SAR images are not photographs. They are complex visualizations of radar backscatter. Different colors and textures represent surface roughness, moisture, and structure. Interpreting this data correctly requires specialized knowledge, creating a barrier for most people."
    },
    {
      title: "🌍 The Interface: An Interactive 3D Globe",
      videoSrc: v2,
      flexDirection: 'row-reverse',
      content: "The journey begins with a simple, intuitive action. Users explore a detailed 3D model of our planet and select any point of interest with a single click. This is the starting point for our entire data retrieval and analysis pipeline, making global-scale investigation effortless."
    },
    {
      title: "🧠 The Solution: AI-Powered Interpretation",
      videoSrc: v6,
      flexDirection: 'row',
      content: "This is where SAR-A's intelligence shines. The fetched SAR image is fed to a suite of AI models. Using advanced computer vision (via OpenRouter and Imagga APIs), the AI identifies features, analyzes color compositions, and translates the complex scientific data into a clear, human-readable narrative."
    },
    {
      title: "📊 The Result: Democratized Geospatial Insights",
      videoSrc: v3,
      flexDirection: 'row-reverse',
      content: "The final output is a comprehensive, easy-to-understand report. You get the annotated image, key metadata, and a detailed summary of what the landscape consists of. SAR-A's mission is to break down barriers, making critical Earth observation data accessible to researchers, students, and the curious public alike."
    }
  ];

 return (
    <div className="landing-page">
      
      <Navbar/>
      <div 
        className="earth-canvas-container" 
        style={{ transform: earthTransform, zIndex: earthZIndex }}
      >
        <Earth />
      </div>
      <section id="section-1" className="section section1">
        <h1>SAR-A</h1>
      </section>

      <div className="section2">
        <div className="description-grid">
          {descriptionData.map((item, index) => (
            <div key={index} className="description-row" style={{ flexDirection: item.flexDirection }}>
              <div className="video-container">
                {/* ### MODIFICATION 2: Replaced iframe with the video tag ### */}
                <video
                  key={item.videoSrc}
                  src={item.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="background-video"
                />
              </div>
              <div className="holo-box">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AsteroidBelt/>
      <section id="sar-examples" className="section sar-examples-section">
        <div className="sar-example">
            <img src={SarImage1} alt="SAR Example 1" className="sar-image"/>
            <div className="sar-description">
                <h3>Urban & Coastal Areas</h3>
                <p><strong>Majority Colors:</strong> Orange, Blue, and Green.</p>
                <ul>
                    <li><strong>Orange/Red:</strong> Indicates urban environments and built-up structures. The bright signals are caused by "double-bounce" scattering off buildings.</li>
                    <li><strong>Blue/Black:</strong> Represents smooth surfaces like water bodies (sea, rivers).</li>
                    <li><strong>Green:</strong> Typically shows vegetated areas such as fields or parks.</li>
                </ul>
            </div>
        </div>
        <div className="sar-example">
            <img src={SarImage2} alt="SAR Example 2" className="sar-image"/>
            <div className="sar-description">
                <h3>Agricultural Landscapes</h3>
                <p><strong>Majority Colors:</strong> Yellow-Green, Purple, and Cyan.</p>
                <ul>
                    <li><strong>Yellow-Green:</strong> Represents agricultural fields. The grid-like patterns are characteristic of farmland.</li>
                    <li><strong>Purple/Pink:</strong> Can indicate areas with different soil moisture, fallow fields, or rougher surfaces.</li>
                    <li><strong>Cyan/Light Blue:</strong> Pinpoints water bodies like lakes or flooded areas.</li>
                </ul>
            </div>
        </div>
        <div className="sar-example">
            <img src={SarImage3} alt="SAR Example 3" className="sar-image"/>
            <div className="sar-description">
                <h3>River Systems (Fluvial)</h3>
                <p><strong>Majority Colors:</strong> Dark Blue and Yellow-Green.</p>
                <ul>
                    <li><strong>Dark Blue/Black:</strong> Clearly outlines the river channels. Water absorbs the radar signal, making it appear dark.</li>
                    <li><strong>Yellow-Green:</strong> Shows the surrounding land, which is likely covered in vegetation like forests or grasslands.</li>
                </ul>
            </div>
        </div>
      </section>
      <section id="section-3" className="section section3">
        <FlipCard display={Arushi} front="Arushi Ojha (Click me)" back="Arushi, a CS undergrad , always enthusiastic to learn something new" />
        <FlipCard display={Asf} front="ASF Earth Data API (Click me)" back="Providing the SAR meta Data necessary to showcase us" />
        <FlipCard display={Open} front="OpenRouter API (Click me)" back="Analysing the SAR meta data so it is easier to read and understand by everyone" />
        <FlipCard display={Git} front="Github (Click me)" back="Hosting everything online for devOps all around the world to enjoy this application" />
      </section>
      <AsteroidBelt/>
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
      <AsteroidBelt/>
      <section id="section-5" className="section section5">
        <div className="game-box">
          
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
        <Minecraft />
      </section>
      <AsteroidBelt/>
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