// components/MyCourseCard.jsx hoặc components/cards/MyCourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BarChart, ChevronRight, Calendar, Users, Star } from "lucide-react";
import DOMPurify from "dompurify";
import { formatDate } from "../../utils/formatDate";

const MyCourseCard = ({ enrollment, courseInfo }) => {
  // Hàm format level
  const levelToLabel = (level) => {
    if (!level) return "";
    const value = String(level).toLowerCase();
    if (
      value.includes("begin") ||
      value.includes("cơ bản") ||
      value.includes("sơ cấp")
    )
      return "Sơ cấp";
    if (value.includes("inter") || value.includes("trung cấp"))
      return "Trung cấp";
    if (
      value.includes("adv") ||
      value.includes("nâng cao") ||
      value.includes("cao cấp")
    )
      return "Nâng cao";
    return level;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={courseInfo.thumbnail}
          alt={courseInfo.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "/api/placeholder/400/200";
          }}
        />
        <div className="absolute top-4 right-4">
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
            <BarChart className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        {/* Level badge */}
        {courseInfo.level && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {levelToLabel(courseInfo.level)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {courseInfo.title}
        </h3>

        {/* Course stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{courseInfo.averageRating.toFixed(1)}</span>
            <span>({courseInfo.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{courseInfo.enrollmentCount}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {(() => {
            try {
              const temp = document.createElement("div");
              temp.innerHTML = DOMPurify.sanitize(courseInfo.description || "");
              let txt = temp.textContent || temp.innerText || "";
              txt = txt.replace(/\s+/g, " ").trim();
              if (txt.length > 180) return txt.slice(0, 180).trim() + "...";
              return txt;
            } catch (e) {
              return courseInfo.description || "";
            }
          })()}
        </p>

        {/* Course stats */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Đăng ký: {formatDate(enrollment.enrollDate)}</span>
        </div>

        <div className="flex justify-end">
          <Link
            to={`/my-courses/${courseInfo.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Vào học
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCourseCard;
