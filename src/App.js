import React from 'react'
import '@atlaskit/css-reset'
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import initialData from './index.data'
import Column from './components/Column/index'
import { Button, Modal, Box, TextField } from '@mui/material'
const Container = styled.div`
  display: flex;
`
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}
class InnerList extends React.PureComponent {
  handlegood = (taskId, data) => {
    this.props.setData(taskId, data)
  }
  render() {
    const { column, taskMap, index } = this.props
    const tasks = column.taskIds.map((taskId) => taskMap[taskId])
    return (
      <Column
        column={column}
        tasks={tasks}
        index={index}
        setData={this.handlegood.bind(this)}
        addTask={this.props.addTask}
      />
    )
  }
}

class App extends React.Component {
  state = {
    initialData: initialData,
    open: false,
    title: '',
  }

  onDragStart = (start, provided) => {
    provided.announce(
      `You have lifted the task in position ${start.source.index + 1}`
    )
  }

  onDragUpdate = (update, provided) => {
    const message = update.destination
      ? `You have moved the task to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`

    provided.announce(message)
  }

  onDragEnd = (result, provided) => {
    const message = result.destination
      ? `You have moved the task from position
        ${result.source.index + 1} to ${result.destination.index + 1}`
      : `The task has been returned to its starting position of
        ${result.source.index + 1}`

    provided.announce(message)

    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    const value1 = this.state.initialData.columnOrder.findIndex(
      (e) => e === source.droppableId
    )
    const value2 = this.state.initialData.columnOrder.findIndex(
      (e) => e === destination.droppableId
    )

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.initialData.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...this.state.initialData,
        columnOrder: newColumnOrder,
      }
      this.setState({ initialData: newState })
      return
    }

    const home = this.state.initialData.columns[source.droppableId]
    const foreign = this.state.initialData.columns[destination.droppableId]

    if (home === foreign) {
      const newTaskIds = Array.from(home.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newHome = {
        ...home,
        taskIds: newTaskIds,
      }

      const newState = {
        ...this.state.initialData,
        columns: {
          ...this.state.initialData.columns,
          [newHome.id]: newHome,
        },
      }

      this.setState({ initialData: newState })

      return
    }
    const text = this.state.initialData.tasks[result.draggableId].content
    const position = () => {
      const firstWord = text.split(' ').shift().toLowerCase()
      if (firstWord === 'left') {
        return 'left'
      } else if (firstWord === 'right') {
        return 'right'
      } else {
        return false
      }
    }

    if (position() === 'right' && value1 < value2) {
      // moving from one list to another
      const homeTaskIds = Array.from(home.taskIds)
      homeTaskIds.splice(source.index, 1)
      const newHome = {
        ...home,
        taskIds: homeTaskIds,
      }

      const foreignTaskIds = Array.from(foreign.taskIds)
      foreignTaskIds.splice(destination.index, 0, draggableId)
      const newForeign = {
        ...foreign,
        taskIds: foreignTaskIds,
      }

      const newState = {
        ...this.state.initialData,
        columns: {
          ...this.state.initialData.columns,
          [newHome.id]: newHome,
          [newForeign.id]: newForeign,
        },
      }
      this.setState({ initialData: newState })
    }
    if (position() === 'left' && value1 > value2) {
      // moving from one list to another
      const homeTaskIds = Array.from(home.taskIds)
      homeTaskIds.splice(source.index, 1)
      const newHome = {
        ...home,
        taskIds: homeTaskIds,
      }

      const foreignTaskIds = Array.from(foreign.taskIds)
      foreignTaskIds.splice(destination.index, 0, draggableId)
      const newForeign = {
        ...foreign,
        taskIds: foreignTaskIds,
      }

      const newState = {
        ...this.state.initialData,
        columns: {
          ...this.state.initialData.columns,
          [newHome.id]: newHome,
          [newForeign.id]: newForeign,
        },
      }
      this.setState({ initialData: newState })
    }
  }
  handleOpen = () => this.setState({ open: true })

  handleClose = () => this.setState({ open: false })

  retnum(str, type) {
    const num = str.replace(/[^0-9]/g, '')
    const number = parseInt(num, 10) + 1
    if (type === 'column') {
      const colName = `column-${number}`

      return colName
    }
    if (type === 'task') {
      const task = `task-${number}`

      return task
    }
  }

  //To aad a new column
  addColumn = () => {
    let { columns } = this.state.initialData
    //Find the column object last object number
    const lastIndexNum = Object.keys(columns).length - 1
    //Get the last object key value
    const lastColName = Object.keys(columns)[lastIndexNum]
    //create the new column key name
    const newCol = this.retnum(lastColName, 'column')

    const newState = {
      ...this.state.initialData,
      columnOrder: [...this.state.initialData.columnOrder, newCol],
      columns: {
        ...this.state.initialData.columns,
        [newCol]: { id: newCol, title: this.state.title, taskIds: [] },
      },
    }

    this.setState({ initialData: newState, open: false, title: '' })
  }

  handleText = (e) => {
    this.setState({ title: e.target.value })
  }

  //To update the task
  updateTask = (taskID, text) => {
    let good = { ...this.state.initialData }
    good.tasks[taskID].content = text
    this.setState({
      ...this.state.initialData.tasks,
      good,
    })
  }

  //Add a new task
  addNewTask = (colId, text) => {
    let { tasks } = this.state.initialData
    //Find the column object last object number
    const lastIndexNum = Object.keys(tasks).length - 1
    //Get the last object key value
    const lastColName = Object.keys(tasks)[lastIndexNum]
    //create the new task key name
    const newTask = this.retnum(lastColName, 'task')
    const newIds = [...this.state.initialData.columns[colId].taskIds, newTask]
    let newColData = { ...this.state.initialData.columns }

    newColData[colId].taskIds = newIds
    const newData = {
      ...this.state.initialData,
      columns: newColData,
      tasks: {
        ...this.state.initialData.tasks,
        [newTask]: { id: newTask, content: text },
      },
    }
    this.setState({
      ...this.state.initialData,
      initialData: newData,
    })
  }

  render() {
    return (
      <>
        {console.log('12345', this.state.initialData)}
        <Button onClick={this.newTask} variant='contained'>
          Add New Column
        </Button>

        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <div>
              <TextField
                id='outlined-basic'
                label='Enter column title'
                variant='outlined'
                value={this.state.title}
                onChange={this.handleText}
              />
            </div>
            <div>
              <Button onClick={this.addColumn} variant='outlined'>
                save
              </Button>
            </div>
          </Box>
        </Modal>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
        >
          <Droppable
            droppableId='all-columns'
            direction='horizontal'
            type='column'
          >
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {this.state.initialData.columnOrder.map((columnId, index) => {
                  const column = this.state.initialData.columns[columnId]
                  return (
                    <InnerList
                      key={column.id}
                      column={column}
                      taskMap={this.state.initialData.tasks}
                      index={index}
                      setData={this.updateTask.bind(this)}
                      addTask={this.addNewTask.bind(this)}
                    />
                  )
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </>
    )
  }
}
export default App
