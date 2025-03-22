
## Features

- 📝 Quiz Question Management
- 🎯 Score Tracking System
- 🏆 Real-time Leaderboard
- 👤 User Profile Management
- 📊 Performance Analytics

## API Endpoints

### Users
- `GET /api/people` - Get all users (with filtering & sorting)
- `GET /api/people/:id` - Get user by ID
- `PUT /api/people/:id` - Update user profile
- `DELETE /api/people/:id` - Delete user account
- `POST /api/people/:id/increase-score` - Update user score

### Questions
- `GET /api/questions/random` - Get random question
- `POST /api/questions/check-answer` - Check answer and update score
- `POST /api/questions` - Add new question (admin only)
- `PUT /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

## Setup & Installation

1. Install dependencies:
```bash
npm install
```

2. Environment Configuration:
Create a `.env` file with:
```
Copy from env-test. MONGODB_URI i will attachment with email attachment
```

3. Database Setup:
```bash
# Import leader board
npm run seed
#import question
npm run questions

```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## Security Measures

1. **Score Protection:**
   - Server-side score validation
   - Rate limiting on score updates
   - Transaction-based score updates

1. **Data Validation:**
   - Input sanitization
   - Request payload validation
   - MongoDB injection prevention

## Data Models

### User Schema
```
interface User {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Question Schema
```
interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}
```

## Improvement Suggestions

1. **Performance Optimizations:**
   - Implement caching for leaderboard data
   - Add pagination for large datasets
   - Use database indexing for frequently queried fields

2. **Feature Enhancements:**
   - Add question categories and difficulty levels
   - Implement achievement system
   - Add multiplayer support
   - Include real-time notifications

3. **Security Enhancements:**
   - Add rate limiting for all endpoints
   - Implement IP-based blocking
   - Add CAPTCHA for sensitive operations
   - Enhanced logging and monitoring

4. **Technical Debt:**
   - Add comprehensive test coverage
   - Implement CI/CD pipeline
   - Add API documentation using Swagger/OpenAPI
   - Set up monitoring and error tracking

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```