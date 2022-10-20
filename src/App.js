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
  render() {
    const { column, taskMap, index } = this.props
    const tasks = column.taskIds.map((taskId) => taskMap[taskId])
    return <Column column={column} tasks={tasks} index={index} />
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
          ...this.state.columns,
          [newHome.id]: newHome,
        },
      }

      this.setState({ initialData: newState })

      return
    }
    const left = this.state.initialData.tasks[result.draggableId].position.find(
      (e) => e === 'left'
    )
    const right = this.state.initialData.tasks[
      result.draggableId
    ].position.find((e) => e === 'right')
    console.log(value1, value2)
    if (right === 'right' && value1 < value2) {
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
    if (left === 'left' && value1 > value2) {
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

  retnum(str) {
    const num = str.replace(/[^0-9]/g, '')
    const number = parseInt(num, 10) + 1
    const colName = `column-${number}`
    return colName
  }
  addColumn = () => {
    console.log('okay', this.state.initialData.columns)
    let { columns } = this.state.initialData
    //Find the column object last object number
    const lastIndexNum = Object.keys(columns).length - 1
    console.log(lastIndexNum)
    //Get the last object key value
    const lastColName = Object.keys(columns)[lastIndexNum]
    console.log(lastColName)
    //create the new column key name
    const newCol = this.retnum(lastColName)
    console.log(newCol)
    //new column object
    const newColObject = Object.assign(columns, {
      [newCol]: { id: newCol, title: this.state.title, taskIds: [] },
    })
    console.log(newColObject)

    const newState = {
      ...this.state.initialData,
      columnOrder: [...this.state.initialData.columnOrder, newCol],
      columns: {
        ...this.state.initialData.columns,
        newColObject,
      },
    }

    this.setState({ initialData: newState, open: false, title: '' })
    console.log('okay12', this.state.initialData.columns)
  }

  handleText = (e) => {
    this.setState({ title: e.target.value })
  }

  render() {
    return (
      <>
        <Button onClick={this.handleOpen} variant='contained'>
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
