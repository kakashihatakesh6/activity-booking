import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IActivity } from './Activity';

export interface IBooking extends Document {
  user: IUser['_id'];
  activity: IActivity['_id'];
  bookingDate: Date;
}

const BookingSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      required: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema); 