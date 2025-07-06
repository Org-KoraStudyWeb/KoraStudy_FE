import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { examService } from '../../api/ExamService';
import { useUser } from '@contexts/UserContext.jsx';

function getGradeColor(score) {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

const ExamResults = () => {
  const { id } = useParams(); // examId
  const { user } = useUser();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        if (user?.id && id) {
          // Lấy lịch sử làm bài của user hiện tại từ backend
          const history = await examService.getExamHistory(user.id);
          // Lọc ra các lần làm bài của đề thi này, lấy lần mới nhất
          const filtered = Array.isArray(history)
            ? history.filter(h => String(h.examId) === String(id))
            : [];
          const latest = filtered.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
          setResult(latest || null);
        } else {
          setResult(null);
        }
      } catch (err) {
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id, user]);

  if (loading) return <div className="p-10 text-center">Đang tải kết quả...</div>;
  if (!result) return <div className="p-10 text-center text-red-500">Không tìm thấy kết quả bài thi.</div>;

  // Lấy chi tiết từng câu hỏi từ backend (nếu có)
  const details = Array.isArray(result.details) ? result.details : [];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary-600">Kết quả bài thi</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><strong>Tổng số câu:</strong> {result.totalQuestions}</div>
        <div><strong>Số câu đúng:</strong> {result.noCorrect}</div>
        <div><strong>Số câu sai:</strong> {result.noIncorrect}</div>
        <div>
          <strong>Điểm số:</strong>{' '}
          <span className={getGradeColor(result.scores)}>{result.scores}</span>
        </div>
        <div><strong>Ngày thi:</strong> {result.testDate}</div>
      </div>

      {/* Hiển thị bảng đáp án nếu có chi tiết từng câu */}
      {details.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Chi tiết đáp án từng câu</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Câu hỏi</th>
                <th className="border px-2 py-1">Đáp án của bạn</th>
                <th className="border px-2 py-1">Đáp án đúng</th>
                <th className="border px-2 py-1">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1">{item.questionText}</td>
                  <td className="border px-2 py-1 text-center">{item.selectedAnswer}</td>
                  <td className="border px-2 py-1 text-center">{item.correctAnswer}</td>
                  <td className="border px-2 py-1 text-center">
                    {item.isCorrect
                      ? <span className="text-green-600 font-semibold">Đúng</span>
                      : <span className="text-red-600 font-semibold">Sai</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
