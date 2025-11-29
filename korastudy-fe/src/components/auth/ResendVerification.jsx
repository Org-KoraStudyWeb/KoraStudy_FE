// ResendVerification.jsx
import { useState } from "react";
import authService from "../../api/authService";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.resendVerificationEmail(email);
      setMessage(
        "Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Gửi lại email xác thực</h2>
      <form onSubmit={handleResend}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi lại email xác thực"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
export default ResendVerification;
