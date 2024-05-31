

import './App.css';
import { useState, useEffect } from 'react';
import PendingTask from './PendingTask';
import InProgressTask from './InProgressTask';
import CompletedTask from './CompletedTask';
function App() {
  const initialForm = {
    type:'new',
    id:'',
    title:'',
    description:'',
    date:''
  }

  //declaring states
  const [formField, setForm] = useState(initialForm)
  const [pendingList, setPendingList] = useState([])
  const [inProgressList, setInProgressList] = useState([])
  const [completedList, setCompletedList] = useState([])
  

  //Randome ID generator function
  const generateId = (length)=>{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

//edit icon onclick listener
const handleEditClick = (task) => {
  setForm({...task, type:'existing'})
}

//save edited task method
const handleEditSave = () => {
  
  for(let i = 0;i<pendingList.length;i++){
    if(formField.id === pendingList[i].id){
      pendingList[i] = formField
      setPendingList([...pendingList])
      break;
    }
  }
}


//delete icon onclick listener
const handleDeleteClick = (task) => {
  setPendingList(pendingList.filter(object => object.id !== task.id))
  setInProgressList(inProgressList.filter(object => object.id !== task.id))
  setCompletedList(completedList.filter(object => object.id !== task.id))
}


//move task to in progress list method
const handleMoveToProgress = (task) => {
  setPendingList(pendingList.filter(object => object.id !== task.id))
  setInProgressList([...inProgressList, task ])
}


//move task to completed list method
const handleMoveToCompleted = (task) => {
  
  setInProgressList(inProgressList.filter(object => object.id !== task.id))
  task.date = getFormattedTimestamp()
  setCompletedList([...completedList, task ])
}


//add new task to pending list method
  const handleAddTask = () => {
      if(formField.type === 'existing'){
        handleEditSave()
      }else{
      
      
      formField.id = generateId(10);
      setForm(initialForm);
      setPendingList([...pendingList, formField])
    }

  }

  //method to get formatted data and timestamp
  const getFormattedTimestamp = () => {
    const now = new Date();
    
    const padZero = (number) => number.toString().padStart(2, '0');
    
    const day = padZero(now.getDate());
    const month = padZero(now.getMonth() + 1); 
    const year = now.getFullYear().toString().slice(-2); 
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  

  //dragstart method to capture drag data
  const onDragStart = (event, task, sourceColumn) => {
    event.dataTransfer.setData('task', JSON.stringify({ task, sourceColumn  }));
    console.log(task, sourceColumn )
  };

  //capture the drop data using ondrop method
  const onDrop = (event, targetColumn) => {
    const { task, sourceColumn } = JSON.parse(event.dataTransfer.getData('task'));
    console.log(sourceColumn)
    if ((sourceColumn === 'pendingList' && targetColumn !== 'inProgressList') ||
        (sourceColumn === 'inProgressList' && targetColumn !== 'completedList')) {
      return;
    }

    // Remove task from the source column
    const newSourceList = {
      pendingList: pendingList.filter(t => t.id !== task.id),
      inProgressList: inProgressList.filter(t => t.id !== task.id),
      completedList: completedList.filter(t => t.id !== task.id),
    };

    // Add task to the target column
    const newTargetList = {
      pendingList,
      inProgressList,
      completedList,
    };
    console.log(sourceColumn, targetColumn)
    if (sourceColumn === 'pendingList' && targetColumn === 'inProgressList' ) {
      newTargetList.inProgressList = [...inProgressList, task];
      setPendingList(newSourceList.pendingList);
      setInProgressList(newTargetList.inProgressList);
    } else if (sourceColumn === 'inProgressList' && targetColumn === 'completedList') {
      task.date = getFormattedTimestamp()
      newTargetList.completedList = [...completedList, task];
      setInProgressList(newSourceList.inProgressList);
      setCompletedList(newTargetList.completedList);
    }

    
    
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };
  
  return (
    <>
      <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
            }}>
            <div className='header'>
                <div className='title'>
                GreenStitch's Assignment - ToDo App
                </div>
            </div>
            

            <div className="content">
                <div className="blogBox" >
                  <form>
                      <div className="titleHeadingA">
                        Title:
                      </div>

                      <input className="inputTitle" type="text"  name="titleView"  placeholder="Enter title" value={formField.title} onChange={(e) => {
                        setForm({...formField, title:e.target.value})
                        console.log(formField)
                      }}/><br/>

                      <div className="titleHeadingB">
                      Description:
                      </div>

                    <textarea className="inputDesc" name="descView" rows="8" cols="35" placeholder="Enter description" value={formField.description} onChange={(e) => {
                      setForm({...formField, description:e.target.value})
                      console.log(formField)
                    }}></textarea>
                    </form>

                    <div className="submitButton" onClick={() => {handleAddTask()}}>
                      Save
                    </div>

                    {
                      formField.type !== 'new'?
                      <div className="submitButton" onClick={() => {setForm(initialForm)}}>
                        Add new task
                      </div>
                      :
                      <></>
                    }

              </div>

       
                
              
        
        
    <div style={{width:'25%'}}>
        <div className="headingList">
            Pending 
        </div>
        <div className="pendingTaskList"
        onDrop={(event) => onDrop(event, 'pendingList')}
        onDragOver={onDragOver}
        >
            {
              pendingList && pendingList.length > 0 ?
              pendingList.map(item => (
                <>
                  <PendingTask 
                  item={item}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                  handleMoveToProgress={handleMoveToProgress}
                  onDragStart={onDragStart}
                  />
                </>
              ))
              :
              <></>
              
            }
            
        </div>
        
    </div>
    <div style={{width:'25%'}}>
        <div className="headingList">
            In Progress
        </div>
        <div className="pendingTaskList"
        onDrop={(event) => onDrop(event, 'inProgressList')}
        onDragOver={onDragOver}
        >
            {
              inProgressList && inProgressList.length > 0 ?
              inProgressList.map(item => (
                <>
                  <InProgressTask
                  item={item}
                  handleDeleteClick={handleDeleteClick}
                  handleMoveToCompleted={handleMoveToCompleted}
                  onDragStart={onDragStart}
                  />
                </>
              ))
              :
              <></>
              
            }

        {inProgressList.length === 0 && (
          <div
            className="pendingTaskList"
            onDrop={(event) => onDrop(event, 'inProgressList')}
            onDragOver={onDragOver}
          >
            
          </div>
        )}
            
        </div>
        
    </div>
    <div style={{width:'25%'}}>
        <div className="headingList">
            Completed 
        </div>
        <div className="pendingTaskList"
        onDrop={(event) => onDrop(event, 'completedList')}
        onDragOver={onDragOver}
        >
        {
              completedList && completedList.length > 0 ?
              completedList.map(item => (
                <>
                  <CompletedTask
                  item={item}
                  handleDeleteClick={handleDeleteClick}
                  onDragStart={onDragStart}
                  />
                </>
              ))
              :
              <></>
              
            }

            {completedList.length === 0 && (
                <div
                  className="pendingTaskList"
                  onDrop={(event) => onDrop(event, 'completedList')}
                  onDragOver={onDragOver}
                >
                  
                </div>
              )}
        </div>
        
    </div> 
    </div>


        </div>
    </>
  );
}

export default App;
