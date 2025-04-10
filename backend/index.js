import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhhh70659@@gmail.com",
    pass: "gnew vpyi ftka cvef",
  },
});

app.post('/sendEmail', (req, res) => {
  const { msg, emailList } = req.body;
  
  // Validate inputs
  if (!msg || !emailList) {
    return res.status(400).json({ error: 'Missing message or email list' });
  }

  new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < emailList.length; i++) {
        await transporter.sendMail({
          from: "dhhh70659@gmail.com", // Fixed double @
          to: emailList[i],
          subject: "A message from BulkMail done by Guru",
          text: msg,
        });
        console.log("Email sent to " + emailList[i]);
      }
      resolve("success");
    } catch (error) {
      console.error("Email error:", error);
      reject("failed");
    }
  })
  .then(() => res.json(true))
  .catch(() => res.json(false));
});
app.get('/', (req, res) => {
  res.send('Hello from index.js in get method');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});