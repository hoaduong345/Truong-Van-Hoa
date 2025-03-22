import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuestionSchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length >= 2; // Each question must have exactly 4 options
      },
      message: 'Question must have at least 2 options'
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function(this: IQuestion, v: string) {
        return this.options.includes(v); // Correct answer must be one of the options
      },
      message: 'Correct answer must be one of the options'
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuestion>('Question', QuestionSchema); 