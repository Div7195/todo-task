const PendingTask = ({item, handleEditClick, handleDeleteClick, handleMoveToProgress, onDragStart}) => {

    return(
        <>
        <div className="taskItem" 
                  key={item.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, item, 'pendingList')}
                  >
                      <div className="dateIcon">
                        <div className="idEntry">
                            Task ID - {item.id}
                        </div>
                        <div className="iconEntry" >
                            <i className="fa-solid fa-pen-to-square" id="editButtonView" style={{color:'#4eb814', cursor:'pointer', fontSize:'20px', padding:'6px'}}onClick={() => {handleEditClick(item)}}></i>
                            <i className="fa-sharp fa-solid fa-trash" id="deleteButtonView" style={{color:'#f92424', cursor:'pointer', fontSize:'20px',marginLeft:'10px', padding:'6px'}}onClick={() => {handleDeleteClick(item)}}></i>
                            <i className="fa-solid fa-circle-play"  id="checkButtonView" style={{color:'#62c610', cursor:'pointer', fontSize:'20px',marginLeft:'10px', padding:'6px'}} onClick={() => {handleMoveToProgress(item)}}></i>
                        </div>
                      </div>

                      <div className="titleDesc">
                        <div className="titleEntry" id="taskTitleView">
                        {item.title}
                        </div>
                          <div className="descEntry" id="taskDescView">
                        {item.description}
                          </div>
                      </div>
        
                </div>
        </>
    )
}

export default PendingTask