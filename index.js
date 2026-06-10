
// // const express = require("express");
// // const dotenv = require("dotenv");
// // const cors = require("cors");
// // const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // app.use(
// //   cors({
// //     origin: "http://localhost:3000",
// //     credentials: true,
// //   })
// // );

// // app.use(express.json());

// // const uri = process.env.MONGODB_URI;

// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // async function run() {
// //   try {
// //     await client.connect();

// //     console.log("✅ MongoDB Connected");

// //     // DATABASE
// //     const db = client.db("tutor-finder");

// //     // COLLECTIONS
// //     const tutorCollection = db.collection("tutors");
// //     const bookingCollection = db.collection("bookings");

// //     // ====================================================
// //     // HOME ROUTE
// //     // ====================================================

// //     app.get("/", (req, res) => {
// //       res.send("🚀 tutor-finder Server Running");
// //     });

// //     // ====================================================
// //     // GET ALL TUTORS
// //     // ====================================================

// //     app.get("/tutors", async (req, res) => {
// //       try {
// //         const search = req.query.search || "";

// //         const query = {
// //           tutorName: {
// //             $regex: search,
// //             $options: "i",
// //           },
// //         };

// //         const result = await tutorCollection
// //           .find(query)
// //           .sort({
// //             createdAt: -1,
// //           })
// //           .toArray();

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to fetch tutors",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // GET SINGLE TUTOR
// //     // ====================================================

// //     app.get("/tutors/:id", async (req, res) => {
// //       try {
// //         const id = req.params.id;

// //         if (!ObjectId.isValid(id)) {
// //           return res.status(400).json({
// //             error: "Invalid Tutor ID",
// //           });
// //         }

// //         const result = await tutorCollection.findOne({
// //           _id: new ObjectId(id),
// //         });

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to fetch tutor",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // ADD TUTOR
// //     // ====================================================

// //     app.post("/tutors", async (req, res) => {
// //       try {
// //         const tutorData = {
// //           ...req.body,
// //           createdAt: new Date(),
// //         };

// //         const result = await tutorCollection.insertOne(tutorData);

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to add tutor",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // MY TUTORS
// //     // ====================================================

// //     app.get("/my-tutors", async (req, res) => {
// //       try {
// //         const email = req.query.email;

// //         const query = {
// //           tutorEmail: email,
// //         };

// //         const result = await tutorCollection
// //           .find(query)
// //           .sort({
// //             createdAt: -1,
// //           })
// //           .toArray();

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to fetch my tutors",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // UPDATE TUTOR
// //     // ====================================================

// //     app.patch("/tutors/:id", async (req, res) => {
// //       try {
// //         const id = req.params.id;

// //         if (!ObjectId.isValid(id)) {
// //           return res.status(400).json({
// //             error: "Invalid Tutor ID",
// //           });
// //         }

// //         const updatedData = req.body;

// //         const result = await tutorCollection.updateOne(
// //           {
// //             _id: new ObjectId(id),
// //           },
// //           {
// //             $set: updatedData,
// //           }
// //         );

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to update tutor",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // DELETE TUTOR
// //     // ====================================================

// //     app.delete("/tutors/:id", async (req, res) => {
// //       try {
// //         const id = req.params.id;

// //         if (!ObjectId.isValid(id)) {
// //           return res.status(400).json({
// //             error: "Invalid Tutor ID",
// //           });
// //         }

// //         const result = await tutorCollection.deleteOne({
// //           _id: new ObjectId(id),
// //         });

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to delete tutor",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // CREATE BOOKING
// //     // ====================================================

// //     app.post("/bookings/:email", async (req, res) => {
// //       try {
// //         const booking = req.body;

// //         const { tutorId, studentEmail } = booking;

// //         // CHECK REQUIRED DATA
// //         if (!tutorId || !studentEmail) {     
// //           return res.status(400).json({
// //             error: "Missing booking data",
// //           });
// //         }

// //         // CHECK DUPLICATE BOOKING
// //         const existingBooking = await bookingCollection.findOne({
// //           tutorId,
// //           studentEmail,
// //         });

// //         if (existingBooking) {
// //           return res.status(400).json({
// //             error: "You already booked this tutor",
// //           });
// //         }

// //         // FIND TUTOR
// //         const tutor = await tutorCollection.findOne({
// //           _id: new ObjectId(tutorId),
// //         });

// //         // TUTOR NOT FOUND
// //         if (!tutor) {
// //           return res.status(404).json({
// //             error: "Tutor not found",
// //           });
// //         }

// //         // SLOT CHECK
// //         if (Number(tutor.totalSlot) <= 0) {
// //           return res.status(400).json({
// //             error: "No available slots left",
// //           });
// //         }

// //         // CREATE BOOKING
// //         const bookingData = {
// //           ...booking,
// //           status: "booked",
// //           createdAt: new Date(),
// //         };

// //         const result = await bookingCollection.insertOne(
// //           bookingData
// //         );

// //         // DECREASE SLOT
// //         await tutorCollection.updateOne(
// //           {
// //             _id: new ObjectId(tutorId),
// //           },
// //           {
// //             $inc: {
// //               totalSlot: -1,
// //             },
// //           }
// //         );

// //         res.json({
// //           success: true,
// //           message: "Booking Successful",
// //           result,
// //         });
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Booking Failed",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // GET USER BOOKINGS
// //     // ====================================================

// //     app.get("/:email", async (req, res) => {
// //       try {
// //         const email = req.params.email;

// //         const result = await bookingCollection
// //           .find({
// //             studentEmail: email,
// //           })
// //           .sort({
// //             createdAt: -1,
// //           })
// //           .toArray();

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to fetch bookings",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // UPDATE BOOKING STATUS
// //     // ====================================================

// //     app.patch("/bookings/:id", async (req, res) => {
// //       try {
// //         const id = req.params.id;

// //         const { status } = req.body;

// //         if (!ObjectId.isValid(id)) {
// //           return res.status(400).json({
// //             error: "Invalid Booking ID",
// //           });
// //         }

// //         const result = await bookingCollection.updateOne(
// //           {
// //             _id: new ObjectId(id),
// //           },
// //           {
// //             $set: {
// //               status,
// //             },
// //           }
// //         );

// //         res.json(result);
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to update booking",
// //         });
// //       }
// //     });

// //     // ====================================================
// //     // DELETE BOOKING + RESTORE SLOT
// //     // ====================================================

// //     app.delete("/bookings/:id", async (req, res) => {
// //       try {
// //         const id = req.params.id;

// //         if (!ObjectId.isValid(id)) {
// //           return res.status(400).json({
// //             error: "Invalid Booking ID",
// //           });
// //         }

// //         const booking = await bookingCollection.findOne({
// //           _id: new ObjectId(id),
// //         });

// //         if (!booking) {
// //           return res.status(404).json({
// //             error: "Booking not found",
// //           });
// //         }

// //         // DELETE BOOKING
// //         await bookingCollection.deleteOne({
// //           _id: new ObjectId(id),
// //         });

// //         // RESTORE SLOT
// //         await tutorCollection.updateOne(
// //           {
// //             _id: new ObjectId(booking.tutorId),
// //           },
// //           {
// //             $inc: {
// //               totalSlot: 1,
// //             },
// //           }
// //         );

// //         res.json({
// //           success: true,
// //           message: "Booking Cancelled",
// //         });
// //       } catch (err) {
// //         console.log(err);

// //         res.status(500).json({
// //           error: "Failed to cancel booking",
// //         });
// //       }
// //     });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // }

// // run();

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server Running On Port ${PORT}`);
// // });


// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const {
//   MongoClient,
//   ServerApiVersion,
//   ObjectId,
// } = require("mongodb");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // =======================================
// // MIDDLEWARE
// // =======================================

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(express.json());

// // =======================================
// // MONGODB
// // =======================================

// const uri = process.env.MONGODB_URI;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // =======================================
// // MAIN FUNCTION
// // =======================================

// async function run() {
//   try {
//     await client.connect();

//     console.log("✅ MongoDB Connected");

//     // DATABASE
//     const db = client.db("tutor-finder");

//     // COLLECTIONS
//     const tutorCollection = db.collection("tutors");
//     const bookingCollection = db.collection("bookings");

//     // =======================================
//     // HOME ROUTE
//     // =======================================

//     app.get("/", (req, res) => {
//       res.send("🚀 Tutor Finder Server Running");
//     });

//     // =======================================
//     // GET ALL TUTORS
//     // =======================================

//     app.get("/tutors", async (req, res) => {
//       try {
//         const search = req.query.search || "";

//         const query = {
//           tutorName: {
//             $regex: search,
//             $options: "i",
//           },
//         };

//         const result = await tutorCollection
//           .find(query)
//           .sort({
//             createdAt: -1,
//           })
//           .toArray();

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to fetch tutors",
//         });
//       }
//     });

//     // =======================================
//     // GET SINGLE TUTOR
//     // =======================================

//     app.get("/tutors/:id", async (req, res) => {
//       try {
//         const id = req.params.id;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             error: "Invalid Tutor ID",
//           });
//         }

//         const result = await tutorCollection.findOne({
//           _id: new ObjectId(id),
//         });

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to fetch tutor",
//         });
//       }
//     });

//     // =======================================
//     // ADD TUTOR
//     // =======================================

//     app.post("/tutors", async (req, res) => {
//       try {
//         const tutorData = {
//           ...req.body,
//           createdAt: new Date(),
//         };

//         const result = await tutorCollection.insertOne(
//           tutorData
//         );

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to add tutor",
//         });
//       }
//     });

//     // =======================================
//     // MY TUTORS
//     // =======================================

//     app.get("/my-tutors", async (req, res) => {
//       try {
//         const email = req.query.email;

//         const query = {
//           tutorEmail: email,
//         };

//         const result = await tutorCollection
//           .find(query)
//           .sort({
//             createdAt: -1,
//           })
//           .toArray();

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to fetch my tutors",
//         });
//       }
//     });

//     // =======================================
//     // UPDATE TUTOR
//     // =======================================

//     app.patch("/tutors/:id", async (req, res) => {
//       try {
//         const id = req.params.id;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             error: "Invalid Tutor ID",
//           });
//         }

//         const updatedData = req.body;

//         const result = await tutorCollection.updateOne(
//           {
//             _id: new ObjectId(id),
//           },
//           {
//             $set: updatedData,
//           }
//         );

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to update tutor",
//         });
//       }
//     });

//     // =======================================
//     // DELETE TUTOR
//     // =======================================

//     app.delete("/tutors/:id", async (req, res) => {
//       try {
//         const id = req.params.id;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             error: "Invalid Tutor ID",
//           });
//         }

//         const result = await tutorCollection.deleteOne({
//           _id: new ObjectId(id),
//         });

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to delete tutor",
//         });
//       }
//     });

//     // =======================================
//     // CREATE BOOKING
//     // =======================================

//     app.post("/bookings", async (req, res) => {
//       try {
//         const booking = req.body;

//         const {
//           tutorId,
//           studentEmail,
//           studentName,
//           date,
//           time,
//         } = booking;

//         // REQUIRED CHECK
//         if (
//           !tutorId ||
//           !studentEmail ||
//           !studentName ||
//           !date ||
//           !time
//         ) {
//           return res.status(400).send({
//             error: "Missing booking data",
//           });
//         }

//         // DUPLICATE CHECK
//         const existingBooking =
//           await bookingCollection.findOne({
//             tutorId,
//             studentEmail,
//           });

//         if (existingBooking) {
//           return res.status(400).send({
//             error: "You already booked this tutor",
//           });
//         }

//         // FIND TUTOR
//         const tutor = await tutorCollection.findOne({
//           _id: new ObjectId(tutorId),
//         });

//         // TUTOR NOT FOUND
//         if (!tutor) {
//           return res.status(404).send({
//             error: "Tutor not found",
//           });
//         }

//         // SLOT CHECK
//         if (Number(tutor.totalSlot) <= 0) {
//           return res.status(400).send({
//             error: "No slots available",
//           });
//         }

//         // BOOKING DATA
//         const bookingData = {
//           ...booking,
//           status: "booked",
//           createdAt: new Date(),
//         };

//         // INSERT BOOKING
//         const result =
//           await bookingCollection.insertOne(
//             bookingData
//           );

//         // DECREASE SLOTF
//         await tutorCollection.updateOne(
//           {
//             _id: new ObjectId(tutorId),
//           },
//           {
//             $inc: {
//               totalSlot: -1,
//             },
//           }
//         );

//         res.send({
//           success: true,
//           message: "Booking Successful",
//           result,
//         });
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Booking Failed",
//         });
//       }
//     });

//     // =======================================
//     // GET USER BOOKINGS
//     // =======================================

//     app.get("/bookings/:email", async (req, res) => {
//       try {
//         const email = req.params.email;

//         const result = await bookingCollection
//           .find({
//             studentEmail: email,
//           })
//           .sort({
//             createdAt: -1,
//           })
//           .toArray();

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to fetch bookings",
//         });
//       }
//     });

//     // =======================================
//     // UPDATE BOOKING STATUS
//     // =======================================

//     app.patch("/bookings/:id", async (req, res) => {
//       try {
//         const id = req.params.id;

//         const { status } = req.body;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             error: "Invalid Booking ID",
//           });
//         }

//         const result = await bookingCollection.updateOne(
//           {
//             _id: new ObjectId(id),
//           },
//           {
//             $set: {
//               status,
//             },
//           }
//         );

//         res.send(result);
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to update booking",
//         });
//       }
//     });

//     // =======================================
//     // DELETE BOOKING + RESTORE SLOT
//     // =======================================

//     app.delete("/bookings/:id", async (req, res) => {
//       try {
//         const id = req.params.id;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             error: "Invalid Booking ID",
//           });
//         }

//         const booking =
//           await bookingCollection.findOne({
//             _id: new ObjectId(id),
//           });

//         if (!booking) {
//           return res.status(404).send({
//             error: "Booking not found",
//           });
//         }

//         // DELETE BOOKING
//         await bookingCollection.deleteOne({
//           _id: new ObjectId(id),
//         });

//         // RESTORE SLOT
//         await tutorCollection.updateOne(
//           {
//             _id: new ObjectId(booking.tutorId),
//           },
//           {
//             $inc: {
//               totalSlot: 1,
//             },
//           }
//         );

//         res.send({
//           success: true,
//           message: "Booking Cancelled",
//         });
//       } catch (error) {
//         console.log(error);

//         res.status(500).send({
//           error: "Failed to cancel booking",
//         });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// run();

// // =======================================
// // SERVER
// // =======================================

// app.listen(PORT, () => {
//   console.log(`🚀 Server Running On Port ${PORT}`);
// });

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
origin: "http://localhost:3000",
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
await client.connect();
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

// =======================
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
