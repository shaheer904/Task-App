import React from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from '../Task/index'
import { Button, Modal, Box, TextField } from '@mui/material'

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

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.tasks === this.props.tasks) {
      return false
    }
    return true
  }
  render() {
    return this.props.tasks.map((task, index) => (
      <Task
        key={task.id}
        task={task}
        index={index}
        setData={this.props.setData}
      />
    ))
  }
}
export default class Column extends React.Component {
  state = { open: false, content: '' }

  handleClose = () => {
    this.setState({ open: false })
  }
  handleNewTaskChange = (e) => {
    this.setState({ content: e.target.value })
  }

  saveData = () => {
    this.props.addTask(this.props.column.id, this.state.content)
    this.setState({ open: false })
  }
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => {
          return (
            <Container {...provided.draggableProps} ref={provided.innerRef}>
              <Title {...provided.dragHandleProps}>
                {this.props.column.title}
              </Title>
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant='outlined'
                  onClick={() => this.setState({ open: true })}
                >
                  Add Task
                </Button>
              </div>
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
                      label='Enter task content'
                      variant='outlined'
                      value={this.state.content}
                      onChange={this.handleNewTaskChange}
                    />
                  </div>
                  <div>
                    <Button onClick={() => this.saveData()} variant='outlined'>
                      save
                    </Button>
                  </div>
                </Box>
              </Modal>
              <Droppable droppableId={this.props.column.id} type='task'>
                {(provided, snapshot) => (
                  <TaskList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                  >
                    {/* {this.props.tasks.map((task, index) => (
                      <Task key={task.id} task={task} index={index} />
                    ))} */}
                    <InnerList
                      tasks={this.props.tasks}
                      setData={this.props.setData}
                    />
                    {provided.placeholder}
                  </TaskList>
                )}
              </Droppable>
            </Container>
          )
        }}
      </Draggable>
    )
  }
}
