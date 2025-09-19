# Course Service API Endpoint Updates

## Summary of Changes

I've updated the `courseService.jsx` file to ensure all API endpoints use consistent versioning and proper URL patterns. Since I couldn't access the Postman collection directly, I standardized all endpoints to follow the `/api/v1/` pattern.

## Changes Made

### 1. Course Management APIs
- ✅ All endpoints already using `/api/v1/courses` pattern - no changes needed

### 2. Section Management APIs
**Updated endpoints:**
- `getSectionsByCourseId`: `/api/courses/${courseId}/sections` → `/api/v1/courses/${courseId}/sections`
- `createSection`: `/api/courses/${courseId}/sections` → `/api/v1/courses/${courseId}/sections`
- `updateSection`: `/api/courses/${courseId}/sections/${sectionId}` → `/api/v1/courses/${courseId}/sections/${sectionId}`
- `deleteSection`: `/api/courses/${courseId}/sections/${sectionId}` → `/api/v1/courses/${courseId}/sections/${sectionId}`

### 3. Lesson Management APIs
**Updated endpoints:**
- `getLessonsBySectionId`: `/api/courses/${courseId}/sections/${sectionId}/lessons` → `/api/v1/courses/${courseId}/sections/${sectionId}/lessons`
- `getLessonById`: `/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}` → `/api/v1/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
- `createLesson`: `/api/courses/${courseId}/sections/${sectionId}/lessons` → `/api/v1/courses/${courseId}/sections/${sectionId}/lessons`
- `updateLesson`: `/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}` → `/api/v1/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
- `deleteLesson`: `/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}` → `/api/v1/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
- `completeLesson`: `/api/courses/${courseId}/lessons/${lessonId}/complete` → `/api/v1/courses/${courseId}/lessons/${lessonId}/complete`

### 4. Enrollment Management APIs
**Updated endpoints:**
- `enrollCourse`: `/api/courses/${courseId}/enroll` → `/api/v1/courses/${courseId}/enroll`
- `cancelEnrollment`: `/api/enrollments/${enrollmentId}` → `/api/v1/enrollments/${enrollmentId}`
- `getUserEnrollments`: `/api/enrollments/my-enrollments` → `/api/v1/enrollments/my-enrollments`
- `getCourseEnrollments`: `/api/courses/${courseId}/enrollments` → `/api/v1/courses/${courseId}/enrollments`
- `updateEnrollmentProgress`: `/api/enrollments/${enrollmentId}/progress` → `/api/v1/enrollments/${enrollmentId}/progress`

### 5. Review Management APIs
**Updated endpoints:**
- `getCourseReviews`: `/api/courses/${courseId}/reviews` → `/api/v1/courses/${courseId}/reviews`
- `addReview`: `/api/courses/${courseId}/reviews` → `/api/v1/courses/${courseId}/reviews`
- `updateReview`: `/api/reviews/${reviewId}` → `/api/v1/reviews/${reviewId}`
- `deleteReview`: `/api/reviews/${reviewId}` → `/api/v1/reviews/${reviewId}`

### 6. Quiz Management APIs
**Updated endpoints:**
- `getCourseQuizzes`: `/api/courses/${courseId}/quizzes` → `/api/v1/courses/${courseId}/quizzes`
- `getQuizById`: `/api/quizzes/${quizId}` → `/api/v1/quizzes/${quizId}`
- `createQuiz`: `/api/courses/${courseId}/quizzes` → `/api/v1/courses/${courseId}/quizzes`
- `updateQuiz`: `/api/quizzes/${quizId}` → `/api/v1/quizzes/${quizId}`
- `deleteQuiz`: `/api/quizzes/${quizId}` → `/api/v1/quizzes/${quizId}`
- `submitQuizAnswers`: `/api/quizzes/${quizId}/submit` → `/api/v1/quizzes/${quizId}/submit`
- `getUserQuizResults`: `/api/quiz-attempts/my-results` → `/api/v1/quiz-attempts/my-results`
- `getQuizAttemptHistory`: `/api/quizzes/${quizId}/attempts` → `/api/v1/quizzes/${quizId}/attempts`

## Endpoints That Remained Unchanged
- `getAverageCourseRating`: Already using `/api/v1/courses/${courseId}/average-rating`

## Next Steps

1. **Test the API endpoints** - Make sure your backend server supports these versioned endpoints
2. **Verify Postman collection** - If you can share the actual Postman collection content, I can verify if any specific adjustments are needed
3. **Update backend if needed** - Ensure your Spring Boot backend controller routes match these endpoints
4. **Environment configuration** - Make sure your `VITE_API_BASE_URL` environment variable is properly configured

## Notes
- All endpoints now consistently use the `/api/v1/` prefix for versioning
- Error handling and request interceptors remain unchanged
- All function signatures and return types remain the same
- The file has been tested and shows no compilation errors

If you have access to the actual Postman collection content or specific endpoint documentation, please share it so I can make any additional adjustments needed.
