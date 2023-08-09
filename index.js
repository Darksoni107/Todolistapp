import express from "express";
import bodyParser from "body-parser";
import { formatedDate } from "./date.js"
import year from "./date.js"

const app = express();
const port = 3000;
let task_list =[];
let work_tasks_list =[];
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {

    res.render("index.ejs" ,{ 
      task_list: task_list ,
      taskType: "Personal",
      date: formatedDate(),
      year: year

    });
    
  })

app.get("/work_task" ,(req ,res)=>{

  res.render("index.ejs" ,{ 
    task_list: work_tasks_list ,
     taskType: "Work",
     date: formatedDate(),
     year: year
      });

})

app.post("/submit" ,(req ,res) =>{
     let task = req.body.task;
     let taskType = req.body.taskType;

     if(taskType === "Personal"){
      task_list.push( task );
      res.redirect('/');
    } else if(taskType === "Work"){
      work_tasks_list.push(task)
      res.redirect("/work_task");
    }
})
   
    

 


app.listen(port ,() => console.log( `server is running on port: ${port}` ))