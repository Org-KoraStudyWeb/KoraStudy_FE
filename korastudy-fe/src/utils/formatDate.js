export function formatDate(dateString) {
  if (!dateString || dateString === 'N/A') {
    const today = new Date();
    return today.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  }
  
  if (typeof dateString !== 'string') {
    dateString = String(dateString);
  }
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      const today = new Date();
      return today.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}