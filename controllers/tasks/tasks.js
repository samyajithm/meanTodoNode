const mongoose = require('mongoose');
const Tasks = require('../../models/tasks/tasks');

/* function to format the response from db*/
const response = (result) => {
    return result.map(item => {
        return {
            _id: item.id,
            name: item.name,
            description: item.description,
            index: item.index,
            important: item.important,
            completed: item.completed,
            createdOn: item.createdOn,
            dueBy: item.dueBy,
            completedOn: item.completedOn
        }
    })
}

const errorResponse = (message) => {
  return {
    error: {
      errorMsg:message
    }
  }
}

/* Controller to add Task*/
exports.TASKS_CREATE = (req, res, next) => {
    if(req.body && req.body.name && req.userData && req.userData.userId) {
        const task = new Tasks({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            description: req.body.description ? req.body.description : '' ,
            important: req.body.important ? req.body.important : false,
            dueBy: req.body.dueBy ? req.body.dueBy : null,
            userId: req.userData.userId
        })
        task
        .save()
        .then(result => {
            console.log("**Add Task***Success**");
            console.log(result);
            res.status(201).json({
                message: "Task added successfully",
                tasks: result
            });
        })
        .catch(err => {
            console.log("**Add Task***Failure**");
            console.log(err)
            res.status(500).json(errorResponse(JSON.stringify(err)));
        })
    } else {
        if(!req.body) {
            console.log("**Add Task***Body not provided***Failure**");
            res.status(500).json(errorResponse("Body not provided"));
        } else if(!req.body.name) {
            console.log("**Add Task***Name not provided***Failure**");
            res.status(500).json(errorResponse("Name not provided"));
        } else if(!req.userData || req.userData && !req.userData.userId) {
            console.log("**Add Task***Authentication issue***Failure**");
            res.status(500).json(errorResponse("Authentication issue"));
        } else {
            console.log("**Add Task***Failure**");
            res.status(500).json(errorResponse("Failure"));
        }
    }
}

/* Controller to fetch all the Tasks
*  fetch only those task of authenticated user
*  build query to fetch task according to state from query param
*/
exports.TASKS_GET_ALL = (req, res, next) => {
    if(req && req.query && req.query.state) {
        let findObj = {
            userId : { $eq: req.userData.userId }
        };
        let getFlag = true;
        let fetchedTasks;

        switch(req.query.state.toLowerCase()) {
          case 'pending':
                findObj['completed'] = false;
                break;
          case 'important':
                findObj['completed'] = false;
                findObj['important'] = true;
                break;
          case 'scheduled':
                findObj['completed'] = false;
                findObj['dueBy'] = { $ne : null };
                break;
          case 'completed' :
                findObj['completed'] = true;
                break;
          default:
                getFlag = false;
                console.log("**Fetch all Tasks***Invalid value passed to param 'state'. Supported values: pending, important, completed, scheduled***Failure**");
                res.status(404).json(errorResponse("Invalid value passed to param 'state'. Supported values: pending, important, completed, scheduled"))
                break;
        }

        if(getFlag) {
            const tasksQuery = Tasks.find(findObj);
            const pageSize = +req.query.pageSize;
            const currentPage = +req.query.page;
            if(pageSize && currentPage) {
                tasksQuery
                    .skip(pageSize * (currentPage - 1))
                    .limit(pageSize);
            }

            tasksQuery
                .sort('index')
                .exec()
                .then(result => {
                    fetchedTasks = result;
                    return Tasks.find(findObj).count();
                })
                .then(count => {
                    console.log("**Fetch all Tasks***Success**");
                    console.log(fetchedTasks);
                    res.status(200).json({
                        totalCount: count,
                        tasks: response(fetchedTasks)
                    });
                })
                .catch(err => {
                    console.log("**Fetch all Tasks***Failure**");
                    console.log(err)
                    res.status(500).json(errorResponse(JSON.stringify(err)));
                })
        }
    } else {
      console.log("**Fetch all Tasks***Required param 'state' is missing***Failure**");
      res.status(404).json(errorResponse("Required param 'state' is missing"))
    }
}

/* Controller to fetch specific Task*/
exports.TASKS_GET_ONE = (req, res, next) => {
    const id = req.params.taskId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Tasks.findOne({_id: id, userId: req.userData.userId})
        .exec()
        .then(result => {
            console.log("**Fetch Task***Success**");
            console.log(result);
            if(result){
                res.status(200).json({
                    tasks: result
                });
            } else {
                console.log("**Fetch Task***Task not found***Failure**");
                res.status(404).json(errorResponse("Task not found"))
            }
        })
        .catch(err => {
            console.log("**Fetch Task***Failure**");
            console.log(err)
            res.status(500).json(errorResponse(JSON.stringify(err)));
        })
    } else {
        console.log("**Fetch Task***Task not found***Failure**");
        res.status(404).json(errorResponse("Task not found"))
    }
}

/* Controller to update specific Task
    Check if Id is valid
    Execute update only if Task exists and is not complete
*/
exports.TASKS_UPDATE =  (req, res, next) => {
    const id = req.params.taskId;
    let reqBody = req.body;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Tasks.findOne({_id: id, userId: req.userData.userId})
        .then(result => {
            console.log(result);
            if(!result) {
                console.log("**Update Task***Task not found***Failure**");
                return res.status(404).json(errorResponse("Task not found"));
            } else {
                if (result.completed && !Object.keys(reqBody).includes('completed')) {
                    console.log("**Update Task***Cannot update completed task***Failure**");
                    return res.status(404).json(errorResponse("Cannot update completed task"));
                } else {
                    const updateObj = {};
                    for(const key of Object.keys(req.body)) {
                        if(key == 'createdOn' || key == 'completedOn') {
                            console.log(`Cannot update ${key}`)
                        } else {
                            if(key == 'completed') {
                                if(req.body[key]) {
                                    updateObj['completedOn'] = new Date();
                                } else {
                                    updateObj['completedOn'] = null;
                                }
                            }
                            updateObj[key] = req.body[key];
                        }
                    }
                    return Tasks.updateOne({ _id: id }, { $set: updateObj })
                    .exec()
                }
            }
        })
        .then(result => {
            if(result.n){
                console.log("**Update Task***Success**");
                res.status(200).json({message: "Task updated successfully"})
            } else {
                console.log("**Update Task***Failure**");
                res.status(500).json(errorResponse("Task update failed"))
            }
            console.log(result);
        })
        .catch(err => {
            console.log("**Update Task***Failure**");
            console.log(err)
            res.status(500).json(errorResponse(JSON.stringify(err)));
        })
    } else {
        console.log("**Update Task***Task not found***Failure**");
        res.status(404).json(errorResponse("Task not found"));
    }
}

/* Controller to delete specific Task
    Check if the Id is valid
    Execute Delete only if Task exist
*/
exports.TASKS_DELETE = (req, res, next) => {
    const id = req.params.taskId;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if(valid) {
        Tasks.findOne({_id: id, userId: req.userData.userId})
        .then(result => {
            console.log(result);
            if(!result) {
                console.log("**Delete Task***Task not found***Failure**");
                return res.status(404).json(errorResponse("Task not found"));
            } else{
                return Tasks.deleteOne({_id: id})
                .exec()
            }
        })
        .then(result => {
            if(result.n) {
                console.log("**Delete Task***Success**");
                res.status(200).json({message: "Task deleted successfully", deletedCount: result.deletedCount});
            } else {
                console.log("**Delete Task***Failure**");
                res.status(200).json({message: "Task delete failed", result: result});
            }
            console.log(result);
        })
        .catch(err => {
            console.log("**Delete Task***Failure**");
            console.log(err)
            res.status(500).json(errorResponse(JSON.stringify(err)));
        })
    } else {
        console.log("**Delete Task***Task not found***Failure**");
        res.status(404).json(errorResponse("Task not found"))
    }
}
