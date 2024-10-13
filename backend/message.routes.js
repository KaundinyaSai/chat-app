import express from "express";
import Message from "./message.model.js";

import User from "./user.model.js";

const Messagerouter = express();

Messagerouter.post("/messages", (req, res) => {
  const { content, senderId } = req.body;

  try {
    const newMessage = Message.create({ content, senderId });

    res.status(201).json({ Message: "Message added successfully", newMessage });
  } catch (error) {
    res.status(500).json({ Error: "Could not add message" });
    console.log(error);
  }
});

Messagerouter.get("/messages", async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ Error: "Could not get message" });
    console.log(error);
  }
});

export default Messagerouter;
