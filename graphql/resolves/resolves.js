const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      console.log(events);
      return events.map((e) => {
        return { ...e.toObject(), date: new Date(e.date).toISOString() };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((b) => {
        return {
          ...b,
          createdAt: new Date(b.createdAt).toISOString(),
          updatedAt: new Date(b.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
      const { title, description, price, date } = args.eventInput;

      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
        creator: "5ef9b473736ea31a40203e1b",
      });

      let createdEvent;

      const result = await event.save();

      createdEvent = result.toObject();

      const user = await User.findById("5ef9b473736ea31a40203e1b");

      if (!user) {
        throw new Error("User not found.");
      }

      user.createdEvents.push(event);
      await user.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const { email, password } = args.userInput;

      const user = await User.findOne({ email });
      if (user) {
        throw new Error("User exists already.");
      }
      const hash = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hash,
      });
      const newCreatedUser = await newUser.save();
      return { ...newCreatedUser.toObject(), password: null };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findById(args.eventId);

    const booking = new Booking({
      user: "5ef9b473736ea31a40203e1b",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result,
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString(),
    };
  },
};
