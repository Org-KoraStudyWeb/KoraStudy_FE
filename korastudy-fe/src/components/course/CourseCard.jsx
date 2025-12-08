import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Star, ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";

const CourseCard = ({ course }) => {
  // Hàm format giá tiền
  const formatPrice = (price, isFree) => {
    if (isFree) return "Miễn phí";
    if (!price || price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Kiểm tra khóa học có miễn phí không
  const isCourseFree = () => {
    // Điều kiện 1: field isFree là true
    if (course.isFree === true || course.isFree === "true") return true;

    // Điều kiện 2: giá bằng 0
    if (course.coursePrice === 0 || course.coursePrice === "0") return true;

    // Điều kiện 3: giá là null/undefined
    if (course.coursePrice === null || course.coursePrice === undefined)
      return true;

    // Điều kiện 4: giá là string có thể parse về 0
    if (typeof course.coursePrice === "string") {
      const numPrice = parseFloat(course.coursePrice);
      return isNaN(numPrice) || numPrice === 0;
    }

    return false;
  };

  // Hàm chuyển đổi level từ database sang tiếng Việt
  const getDisplayLevel = (level) => {
    if (!level) return "";
    const upperLevel = String(level).toUpperCase();

    if (upperLevel.includes("BEGINNER") || upperLevel.includes("BEGIN"))
      return "Sơ cấp";
    if (upperLevel.includes("INTERMEDIATE") || upperLevel.includes("INTER"))
      return "Trung cấp";
    if (upperLevel.includes("ADVANCED") || upperLevel.includes("ADV"))
      return "Cao cấp";
    return level;
  };

  const freeStatus = isCourseFree();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative">
        <img
          src={course.courseImageUrl || "/placeholder-course.jpg"}
          alt={course.courseName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          {/* Chỉ hiển thị badge "Miễn phí" nếu khóa học miễn phí */}
          {freeStatus && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
              Miễn phí
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4">
          {/* Hiển thị level đã được chuyển đổi sang tiếng Việt */}
          <span className="bg-blue-500/90 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm ring-1 ring-white/30">
            {getDisplayLevel(course.courseLevel)}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.courseName}
        </h3>

        <p className="text-gray-600 mb-4 text-sm line-clamp-3 min-h-[3.75rem]">
          {(() => {
            try {
              const temp = document.createElement("div");
              temp.innerHTML = DOMPurify.sanitize(
                course.courseDescription || ""
              );
              let txt = temp.textContent || temp.innerText || "";
              txt = txt.replace(/\s+/g, " ").trim();
              if (txt.length > 180) return txt.slice(0, 180).trim() + "...";
              return txt;
            } catch (e) {
              return course.courseDescription || "";
            }
          })()}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 min-h-[1.25rem]">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{course.enrollmentCount || 0} học viên</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{course.viewCount || 0} lượt xem</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4 min-h-[1.5rem]">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="font-semibold">
              {course.averageRating
                ? Number(course.averageRating).toFixed(1)
                : "N/A"}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            ({course.reviewCount || 0} đánh giá)
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-end gap-4 mt-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-base md:text-lg font-semibold text-primary-600 whitespace-nowrap shrink-0 leading-6">
              {formatPrice(course.coursePrice, freeStatus)}
            </span>
          </div>

          <Link
            to={`/course/${course.id}`}
            className="bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
          >
            Xem chi tiết
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
