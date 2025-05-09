import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
}

const ActivitySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    location: {
      type: String,
      required: [true, 'Please add a location']
    },
    date: {
      type: Date,
      required: [true, 'Please add a date']
    },
    time: {
      type: String,
      required: [true, 'Please add a time']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema); 