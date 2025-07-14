const express = require('express');
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.js");
const adminRoutes = require('./routes/admin.js')
const medRoutes = require('./routes/meds_meal.js')
require('dotenv').config();
const mongourl =  process.env.MONGO_URI;
const PORT = process.env.PORT 
const cors = require('cors')
const app = express();

// console.log('hello')
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meds_meals" , medRoutes)

mongoose.connect(mongourl).then(()=>{
   app.listen(PORT , ()=>{
     console.log('listening on 3000 and connectied to mongo')
   })
   
}).catch((error)=>{
    console.log(error);
})
