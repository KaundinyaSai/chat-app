import express from "express";
import Message from "./message.model.js";

const Messagerouter = express();

Messagerouter.post("/messages", (req, res) => {
  const { content, senderId } = req.body;

  try {
    const newMessage = Message.create({ content, senderId });

    res
      .status(201)
      .json({ Message: "Message added successfully", content, senderId });
  } catch (error) {
    res.status(400).json({ Error: "Could not add message" });
    console.log(error);
  }
});

export default Messagerouter;
