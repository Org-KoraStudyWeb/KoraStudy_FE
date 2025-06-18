import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, Award } from 'lucide-react';

const ExamCard = ({ exam }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ':
        return 'bg-green-100 text-green-800';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-800';
      case 'Khó':
        return 'bg-orange-100 text-orange-800';
      case 'Rất khó':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Sơ cấp':
        return 'bg-blue-100 text-blue-800';
      case 'Trung cấp':
        return 'bg-purple-100 text-purple-800';
      case 'Cao cấp':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <BookOpen className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            exam.price === 'Miễn phí' 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-gray-800 shadow-sm'
          }`}>
            {exam.price}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(exam.level)}`}>
            {exam.level}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Title and Subtitle */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-primary-500 transition-colors duration-300">
            {exam.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {exam.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-primary-500" />
            <span>{exam.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen size={16} className="text-primary-500" />
            <span>{exam.questions} câu</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-primary-500" />
            <span>{exam.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span>{exam.rating}</span>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exam.difficulty)}`}>
            <Award size={12} />
            {exam.difficulty}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-">
          <Link
            to={`/de-thi/${exam.id}/`}
            className="px-10 py-2.5 center border-2 border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:border-primary-500 hover:text-primary-500 transition-colors duration-300"
          >
            Xem trước
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
