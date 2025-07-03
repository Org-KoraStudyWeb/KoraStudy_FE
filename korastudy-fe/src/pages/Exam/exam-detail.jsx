import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, BookOpen, Award, Play, FileText, CheckCircle, AlertCircle, User } from 'lucide-react';

import ExamQuestion from '@components/ExamComponent/ExamQuestion.jsx';

const ExamDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample exam data - in real app, this would come from API
  const examData = {
    1: {
      id: 1,
      title: "Đề thi TOPIK I Mock Test",
      subtitle: "Bài thi thử TOPIK I cơ bản - Phần thi đọc hiểu và nghe hiểu",
      description: "Đề thi thử TOPIK I được thiết kế theo đúng format của kỳ thi chính thức, giúp bạn làm quen với cấu trúc đề thi và rèn luyện kỹ năng làm bài. Đề thi bao gồm 2 phần chính: Nghe hiểu (30 câu) và Đọc hiểu (40 câu).",
      level: "Sơ cấp",
      duration: "100 phút",
      totalQuestions: 70,
      listeningQuestions: 30,
      readingQuestions: 40,
      participants: 1234,
      rating: 4.8,
      totalRatings: 456,
      type: "TOPIK I",
      difficulty: "Trung bình",
      price: "Miễn phí",
      image: "topik.png",
      instructor: {
        name: "Cô Minh Anh",
        title: "Chuyên gia TOPIK",
        avatar: "/api/placeholder/60/60",
        experience: "5+ năm kinh nghiệm"
      },
      features: [
        "Đề thi theo format chính thức TOPIK I",
        "Có file audio cho phần nghe hiểu",
        "Giải thích chi tiết đáp án",
        "Chấm điểm tự động",
        "Phân tích kết quả chi tiết",
        "Lưu lại lịch sử làm bài"
      ],
      requirements: [
        "Đã học xong bảng chữ cái Hangeul",
        "Có từ vựng cơ bản khoảng 800-1500 từ",
        "Hiểu ngữ pháp cơ bản tiếng Hàn",
        "Máy tính có loa hoặc tai nghe"
      ],
      instructions: [
        "Đọc kỹ hướng dẫn trước khi bắt đầu",
        "Làm bài theo thứ tự từ phần nghe đến phần đọc",
        "Không được quay lại phần đã làm",
        "Thời gian làm bài là 100 phút",
        "Nộp bài trước khi hết thời gian"
      ],
      sampleQuestions: [
        {
          id: 1,
          type: "listening",
          question: "다음을 듣고 알맞은 것을 고르십시오.",
          options: [
            "가: 어디에 가세요? 나: 학교에 가요.",
            "가: 뭘 드세요? 나: 커피를 마셔요.",
            "가: 언제 만나요? 나: 내일 만나요.",
            "가: 누구와 가세요? 나: 친구와 가요."
          ],
          correctAnswer: 0,
          explanation: "대화를 듣고 상황에 맞는 응답을 선택하는 문제입니다."
        },
        {
          id: 2,
          type: "reading",
          question: "다음 글을 읽고 내용과 같은 것을 고르십시오.",
          passage: "저는 매일 아침 7시에 일어납니다. 그리고 8시에 학교에 갑니다. 학교에서 한국어를 공부합니다. 오후 3시에 집에 돌아와서 숙제를 합니다.",
          options: [
            "저는 오전 7시에 잠을 잡니다.",
            "저는 오전 8시에 학교에 갑니다.",
            "저는 학교에서 영어를 공부합니다.",
            "저는 오후 4시에 집에 돌아옵니다."
          ],
          correctAnswer: 1,
          explanation: "글의 내용에 따르면 '8시에 학교에 갑니다'가 정답입니다."
        }
      ]
    }
  };

  const exam = examData[id] || examData[1];

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: BookOpen },
    { id: 'questions', name: 'Câu hỏi mẫu', icon: FileText },
    { id: 'instructor', name: 'Giảng viên', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
    
      
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/de-thi"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Quay lại danh sách</span>
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h1 className="font-inter font-bold text-3xl text-gray-800 mb-2">
                    {exam.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {exam.subtitle}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary-500" />
                      <span>{exam.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-primary-500" />
                      <span>{exam.totalQuestions} câu hỏi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary-500" />
                      <span>{exam.participants.toLocaleString()} người đã thi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span>{exam.rating} ({exam.totalRatings} đánh giá)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {exam.level}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {exam.type}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {exam.difficulty}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {exam.price}
                </span>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Sẵn sàng làm bài?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Thời gian: {exam.duration} | {exam.totalQuestions} câu hỏi
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <Link
                    to={`/exam/${exam.id}/take`}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Bắt đầu làm bài
                  </Link>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-300">
                    Lưu vào danh sách
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-500">{exam.listeningQuestions}</div>
                      <div className="text-xs text-gray-600">Câu nghe</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-500">{exam.readingQuestions}</div>
                      <div className="text-xs text-gray-600">Câu đọc</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Mô tả đề thi</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {exam.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Tính năng nổi bật
                        </h3>
                        <ul className="space-y-2">
                          {exam.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          Yêu cầu trước khi thi
                        </h3>
                        <ul className="space-y-2">
                          {exam.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Hướng dẫn làm bài</h2>
                    <div className="space-y-3">
                      {exam.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Câu hỏi mẫu</h2>
                    <p className="text-gray-600 mb-6">
                      Dưới đây là một số câu hỏi mẫu để bạn làm quen với format đề thi
                    </p>
                    
                    <div className="space-y-8">
                      {exam.sampleQuestions.map((question, index) => (
                        <ExamQuestion 
                          key={question.id} 
                          question={question} 
                          questionNumber={index + 1}
                          showAnswer={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor Tab */}
              {activeTab === 'instructor' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">Thông tin giảng viên</h2>
                  <div className="flex items-start gap-6">
                    <img 
                      src={exam.instructor.avatar} 
                      alt={exam.instructor.name}
                      className="w-24 h-24 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{exam.instructor.name}</h3>
                      <p className="text-gray-600 mb-2">{exam.instructor.title}</p>
                      <p className="text-gray-600 mb-4">{exam.instructor.experience}</p>
                      <p className="text-gray-700 leading-relaxed">
                        Chuyên gia hàng đầu về kỳ thi TOPIK với nhiều năm kinh nghiệm giảng dạy và biên soạn đề thi. 
                        Đã giúp hàng nghìn học viên đạt được kết quả cao trong kỳ thi TOPIK.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Đề thi liên quan</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Link key={i} to={`/exam/${i + 1}`} className="block p-4 border rounded-lg hover:border-primary-500 transition-colors duration-300">
                      <h4 className="font-medium text-gray-800 mb-1">TOPIK I - Test {i + 1}</h4>
                      <p className="text-sm text-gray-600 mb-2">Bài thi thử TOPIK I</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>100 phút</span>
                        <span>70 câu</span>
                        <span className="text-green-600 font-medium">Miễn phí</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default ExamDetail;
