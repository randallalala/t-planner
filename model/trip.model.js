const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    country: String,
    start_date: String,
    end_date: String,
    // duration: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    editedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // activities: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Activity",
    //   },
    // ],
    // packingLists: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PackingList",
    // },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
