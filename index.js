
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
MongoClient,
ServerApiVersion,
ObjectId,
} = require("mongodb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// MIDDLEWARE
// =======================

app.use(
cors({
origin: "*",
credentials: true,
})
);

app.use(express.json());

// =======================
// MONGODB
// =======================

const client = new MongoClient(process.env.MONGODB_URI, {
serverApi: {
version: ServerApiVersion.v1,
strict: true,
deprecationErrors: true,
},
});

// =======================
// SERVER LOGIC
// =======================

async function run() {
try {
// await client.connect();
console.log("✅ MongoDB Connected");

const db = client.db("tutor-finder");

const tutorCollection = db.collection("tutors");
const bookingCollection = db.collection("bookings");

// =======================
// HOME
// =======================
app.get("/", (req, res) => {
  res.send("🚀 Tutor Finder Server Running");
});

// Search and filter

app.get("/tutors", async (req, res) => {
  const { search, startDate, endDate } = req.query;

  let query = {};

  if (search) {
    query.tutorName = {
      $regex: search,
      $options: "i",
    };
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const tutors = await tutorCollection.find(query).toArray();

  res.send(tutors);
});



  // JWT creation

// const jwt = require("jsonwebtoken");

// app.post("/jwt", (req, res) => {
//   const user = req.body;

//   const token = jwt.sign(
//     user,
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     }
//   );

//   res.send({ token });
// });

// =======================
// GET ALL TUTORS
// =======================
app.get("/tutors", async (req, res) => {
  try {
    const search = req.query.search || "";

    const result = await tutorCollection
      .find({
        tutorName: { $regex: search, $options: "i" },
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tutors" });
  }
});


// GET SINGLE TUTOR
// =======================
app.get("/tutors/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Tutor ID" });
    }

    const tutor = await tutorCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send(tutor);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tutor" });
  }
});

// =======================
// ADD TUTOR
// =======================
app.post("/tutors", async (req, res) => {
  try {
    const tutorData = {
      ...req.body,
      totalSlot: Number(req.body.totalSlot),
      createdAt: new Date(),
    };

    const result = await tutorCollection.insertOne(tutorData);

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add tutor" });
  }
});

// =======================
// MY TUTORS
// =======================
app.get("/my-tutors", async (req, res) => {
  try {
    const email = req.query.email;

    const result = await tutorCollection
      .find({ tutorEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch my tutors" });
  }
});

// =======================
// UPDATE TUTOR
// =======================
app.patch("/tutors/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Tutor ID" });
    }

    const result = await tutorCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to update tutor" });
  }
});

// =======================
// DELETE TUTOR
// =======================
app.delete("/tutors/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Tutor ID" });
    }

    const result = await tutorCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete tutor" });
  }
});

// =======================
// CREATE BOOKING (FIXED LOGIC)
// =======================
app.post("/bookings", async (req, res) => {
  try {
    const booking = req.body;

    const {
      tutorId,
      studentEmail,
      studentName,
      phone,
    } = booking;

    // VALIDATION
    if (!tutorId || !studentEmail || !studentName || !phone) {
      return res.status(400).send({
        error: "Missing booking data",
      });
    }

    // DUPLICATE CHECK
    const existing = await bookingCollection.findOne({
      tutorId,
      studentEmail,
    });

    if (existing) {
      return res.status(400).send({
        error: "You already booked this tutor",
      });
    }

    // FIND TUTOR
    const tutor = await tutorCollection.findOne({
      _id: new ObjectId(tutorId),
    });

    if (!tutor) {
      return res.status(404).send({
        error: "Tutor not found",
      });
    }

    // SLOT CHECK
    if (tutor.totalSlot <= 0) {
      return res.status(400).send({
        error: "No available slots left",
      });
    }

    // SESSION DATE CHECK (IMPORTANT FIX)
    const today = new Date();
    const sessionDate = new Date(tutor.sessionStartDate);

    if (today < sessionDate) {
      return res.status(400).send({
        error: "Booking is not available yet for this tutor",
      });
    }

    // BOOKING DATA
    const bookingData = {
      ...booking,
      status: "Booked",
      createdAt: new Date(),
    };

    const result = await bookingCollection.insertOne(bookingData);

    // DECREASE SLOT (ATOMIC SAFE)
    await tutorCollection.updateOne(
      { _id: new ObjectId(tutorId) },
      { $inc: { totalSlot: -1 } }
    );

    res.send({
      success: true,
      message: "Booking Successful",
      result,
    });
  } catch (error) {
    res.status(500).send({ error: "Booking Failed" });
  }
});

// =======================
// GET BOOKINGS
// =======================
app.get("/bookings/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const result = await bookingCollection
      .find({ studentEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});

// =======================
// UPDATE BOOKING STATUS
// =======================
app.patch("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Booking ID" });
    }

    const result = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to update booking" });
  }
});

// =======================
// DELETE BOOKING + RESTORE SLOT
// =======================
app.delete("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Booking ID" });
    }

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).send({ error: "Booking not found" });
    }

    await bookingCollection.deleteOne({
      _id: new ObjectId(id),
    });

    await tutorCollection.updateOne(
      { _id: new ObjectId(booking.tutorId) },
      { $inc: { totalSlot: 1 } }
    );

    res.send({
      success: true,
      message: "Booking Cancelled",
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to cancel booking" });
  }
});

} catch (error) {
console.log(error);
}
}

run();

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
