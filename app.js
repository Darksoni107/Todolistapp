import express from "express";
import bodyParser from "body-parser";
import { formatedDate } from "./date.js";
import year from "./date.js";
import mongoose, { Schema } from "mongoose";
import { capitalize } from "lodash-es";
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://divyanshSoni:8290485588@cluster.jnp4jpz.mongodb.net/todolistDBv2");

const taskSchema = new Schema({
  task: String,
});

const ListScheme = new Schema({
  listName: String,
  tasks : [taskSchema]
})

const PersonalTask = new mongoose.model("PersonalTask", taskSchema);
const List = new mongoose.model("List",ListScheme);


app.get("/", async (req, res) => {
  const tasks_list = await PersonalTask.find();
  res.render("index.ejs", {
    tasks_list: tasks_list,
    listName: "My",
    date: formatedDate(),
    year: year,
  });
});

app.get("/:customListName", async (req, res) => {
  const customListName =  capitalize(req.params.customListName)
  let fetchList = await List.findOne({ listName: customListName });
  console.log(fetchList);
  console.log(customListName);

  if(fetchList){ 
    console.log("if running");
    res.render("index.ejs", {
      tasks_list: fetchList.tasks, // sending custome list tasks []
      listName: customListName,  // sending custom list name
      date: formatedDate(),
      year: year,
    });
  }else{
    console.log("else running");
    const list = new List({
      listName: customListName,
      tasks: [{task: "Hello"}],
    });
    await list.save();
    res.redirect("/" + customListName)
  }
});

app.post("/submit", async (req, res) => {
  const task = {
    task: req.body.task,
  };
  const listName = req.body.listName;
  if (listName === "My") {
    await PersonalTask.insertMany([task]);
    res.redirect("/");
  } else{
    await List.findOneAndUpdate(
      { listName: listName },
      { $push: { tasks: task } }
    );
    res.redirect("/" + listName);
  }
});

app.post("/delete", async (req,res)=>{
  const task_to_deleteId = req.body.taskId;
  const listTitle = req.body.listName;
  if (listTitle === "My") {
    await PersonalTask.findByIdAndDelete(task_to_deleteId);
    res.redirect("/");
  }else{
    await List.findOneAndUpdate(
      { listName: listTitle },
      { $pull: { tasks: { _id: task_to_deleteId } } }
    );
    res.redirect("/" + listTitle);
  }
})

app.listen(process.env.PORT || port,()=> console.log("Listnening on port " ,port))