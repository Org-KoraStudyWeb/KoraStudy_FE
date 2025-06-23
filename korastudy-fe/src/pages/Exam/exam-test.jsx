import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Volume2, VolumeX, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Flag, X } from 'lucide-react';
// import ExamNavigation from '../../components/ExamNavigation';
// import ExamQuestion from '../../components/ExamQuestion';
import ExamNavigation from '@components/ExamNavigation.jsx';
import ExamQuestion from '@components/ExamQuestion.jsx';

const ExamTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  // Exam state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(6000); // 100 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Korean language test data
  const examData = {
    title: "TOPIK I Mock Test",
    totalTime: 6000, // 100 minutes
    parts: [
      {
        id: 1,
        title: "PART 1 - 듣기 (Listening)",
        description: "다음을 듣고 알맞은 것을 고르십시오.",
        questions: 30,
        timeLimit: 2400, // 40 minutes
        hasAudio: true,
        audioFile: "/audio/topik1-listening.mp3"
      },
      {
        id: 2,
        title: "PART 2 - 읽기 (Reading)",
        description: "다음을 읽고 알맞은 것을 고르십시오.",
        questions: 40,
        timeLimit: 3600, // 60 minutes
        hasAudio: false
      }
    ],
    questions: [
      // Listening Questions (Part 1)
      {
        id: 1,
        part: 1,
        type: "listening",
        audioStart: 0,
        audioEnd: 15,
        question: "다음을 듣고 알맞은 것을 고르십시오.",
        instruction: "Listen and choose the correct answer.",
        options: [
          "① 가: 어디에 가세요? 나: 학교에 가요.",
          "② 가: 뭐 하세요? 나: 공부해요.",
          "③ 가: 언제 가세요? 나: 내일 가요.",
          "④ 가: 누구와 가세요? 나: 친구와 가요."
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        part: 1,
        type: "listening",
        audioStart: 16,
        audioEnd: 30,
        question: "다음을 듣고 알맞은 것을 고르십시오.",
        instruction: "Listen and choose the correct answer.",
        options: [
          "① 병원",
          "② 학교",
          "③ 은행",
          "④ 시장"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        part: 1,
        type: "listening",
        audioStart: 31,
        audioEnd: 45,
        question: "다음을 듣고 여자가 하는 말의 의미로 알맞은 것을 고르십시오.",
        instruction: "Listen and choose what the woman means.",
        options: [
          "① 시간이 없어서 못 가겠어요.",
          "② 돈이 없어서 못 사겠어요.",
          "③ 배가 불러서 못 먹겠어요.",
          "④ 피곤해서 못 하겠어요."
        ],
        correctAnswer: 0
      },
      // Reading Questions (Part 2)
      {
        id: 31,
        part: 2,
        type: "reading",
        question: "다음 글을 읽고 내용과 같은 것을 고르십시오.",
        passage: "저는 매일 아침 7시에 일어납니다. 그리고 8시에 학교에 갑니다. 학교에서 한국어를 공부합니다. 수업은 12시에 끝납니다. 점심을 먹고 도서관에서 숙제를 합니다.",
        options: [
          "① 저는 아침 6시에 일어납니다.",
          "② 저는 학교에서 한국어를 공부합니다.",
          "③ 수업은 1시에 끝납니다.",
          "④ 저는 집에서 숙제를 합니다."
        ],
        correctAnswer: 1
      },
      {
        id: 32,
        part: 2,
        type: "reading",
        question: "다음 중 어법에 맞는 것을 고르십시오.",
        options: [
          "① 저는 학생이에요.",
          "② 저는 학생이어요.",
          "③ 저는 학생예요.",
          "④ 저는 학생이요."
        ],
        correctAnswer: 0
      },
      {
        id: 33,
        part: 2,
        type: "reading",
        question: "다음 글의 빈 곳에 들어갈 가장 알맞은 것을 고르십시오.",
        passage: "오늘은 날씨가 정말 좋습니다. 하늘이 맑고 바람도 시원합니다. 이런 날에는 _______ 좋겠습니다.",
        options: [
          "① 집에서 잠을 자면",
          "② 공원에서 산책하면",
          "③ 방에서 공부하면",
          "④ 병원에 가면"
        ],
        correctAnswer: 1
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setAudioCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return examData.questions.find(q => q.id === currentQuestion + 1);
  };

  const getQuestionsForPart = (partId) => {
    return examData.questions.filter(q => q.part === partId);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    const currentPartQuestions = getQuestionsForPart(currentPart);
    const currentIndex = currentPartQuestions.findIndex(q => q.id === currentQuestion + 1);
    
    if (currentIndex < currentPartQuestions.length - 1) {
      const nextQuestion = currentPartQuestions[currentIndex + 1];
      setCurrentQuestion(nextQuestion.id - 1);
    } else if (currentPart < examData.parts.length) {
      // Move to next part
      setCurrentPart(currentPart + 1);
      const nextPartQuestions = getQuestionsForPart(currentPart + 1);
      if (nextPartQuestions.length > 0) {
        setCurrentQuestion(nextPartQuestions[0].id - 1);
      }
    }
  };

  const handlePrevQuestion = () => {
    const currentPartQuestions = getQuestionsForPart(currentPart);
    const currentIndex = currentPartQuestions.findIndex(q => q.id === currentQuestion + 1);
    
    if (currentIndex > 0) {
      const prevQuestion = currentPartQuestions[currentIndex - 1];
      setCurrentQuestion(prevQuestion.id - 1);
    } else if (currentPart > 1) {
      // Move to previous part
      setCurrentPart(currentPart - 1);
      const prevPartQuestions = getQuestionsForPart(currentPart - 1);
      if (prevPartQuestions.length > 0) {
        setCurrentQuestion(prevPartQuestions[prevPartQuestions.length - 1].id - 1);
      }
    }
  };

  const handleQuestionJump = (questionId) => {
    const question = examData.questions.find(q => q.id === questionId);
    if (question) {
      setCurrentPart(question.part);
      setCurrentQuestion(questionId - 1);
    }
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Audio controls
  const playAudio = () => {
    const audio = audioRef.current;
    const question = getCurrentQuestion();
    
    if (audio && question && question.type === 'listening') {
      audio.currentTime = question.audioStart || 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const replayAudio = () => {
    const audio = audioRef.current;
    const question = getCurrentQuestion();
    
    if (audio && question && question.type === 'listening') {
      audio.currentTime = question.audioStart || 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSubmitExam = () => {
    // Calculate results and navigate to results page
    const totalQuestions = examData.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    
    navigate(`/exam/${id}/results`, {
      state: {
        answers,
        totalQuestions,
        answeredQuestions,
        examData
      }
    });
  };

  const currentQuestionData = getCurrentQuestion();
  const currentPartData = examData.parts.find(p => p.id === currentPart);
  const progress = ((currentQuestion + 1) / examData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Audio element */}
      <audio ref={audioRef} preload="metadata">
        <source src="/audio/topik1-listening.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/exam/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <X size={20} />
              </button>
              <h1 className="font-semibold text-lg">{examData.title}</h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className="flex items-center gap-2 text-red-600">
                <Clock size={20} />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
              >
                Nộp bài
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ExamNavigation
              parts={examData.parts}
              questions={examData.questions}
              currentQuestion={currentQuestion + 1}
              currentPart={currentPart}
              answers={answers}
              flaggedQuestions={flaggedQuestions}
              onQuestionSelect={handleQuestionJump}
              onPartSelect={setCurrentPart}
            />
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm">
              
              {/* Part Header */}
              <div className="border-b p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {currentPartData?.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{currentPartData?.description}</p>
                  </div>
                  
                  {/* Audio Controls for Listening Part */}
                  {currentQuestionData?.type === 'listening' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={replayAudio}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                        title="Replay"
                      >
                        <RotateCcw size={20} />
                      </button>
                      
                      <button
                        onClick={isPlaying ? pauseAudio : playAudio}
                        className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      
                      <button
                        onClick={() => setIsPlaying(false)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                        title="Stop"
                      >
                        <VolumeX size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Audio Progress Bar for Listening Questions */}
                {currentQuestionData?.type === 'listening' && audioDuration > 0 && (
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Audio Progress</span>
                      <span>{formatTime(Math.floor(audioCurrentTime))} / {formatTime(Math.floor(audioDuration))}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(audioCurrentTime / audioDuration) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Content */}
              <div className="p-6">
                {currentQuestionData && (
                  <ExamQuestion
                    question={currentQuestionData}
                    questionNumber={currentQuestion + 1}
                    selectedAnswer={answers[currentQuestionData.id]}
                    onAnswerSelect={(answerIndex) => handleAnswerSelect(currentQuestionData.id, answerIndex)}
                    isFlagged={flaggedQuestions.has(currentQuestionData.id)}
                    onToggleFlag={() => toggleFlag(currentQuestionData.id)}
                    isTest={true}
                  />
                )}
              </div>

              {/* Navigation Footer */}
              <div className="border-t p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <div className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {examData.questions.length}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion === examData.questions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Xác nhận nộp bài</h3>
            <p className="text-gray-600 mb-6">
              Bạn đã trả lời {Object.keys(answers).length}/{examData.questions.length} câu hỏi.
              Bạn có chắc chắn muốn nộp bài không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTest;
