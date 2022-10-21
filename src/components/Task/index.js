import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
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
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};
`

export default class Task extends React.Component {
  state = { open: false, text: '' }

  handleOpen = () => {
    this.setState({ open: true, text: this.props.task.content })
  }
  handleText = (e) => {
    this.setState({ text: e.target.value })
  }
  handleClose = () => {
    this.setState({ open: false })
  }

  editTask = () => {
    this.setState({ open: false })
    const taskID = this.props.task.id
    this.props.setData(taskID, this.state.text)
  }

  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {this.props.task.content}
            <Button onClick={this.handleOpen} variant='contained'>
              Edit
            </Button>

            <Modal
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <div>
                  <div>
                    <TextField
                      fullWidth
                      id='outlined-basic'
                      label='Enter column title'
                      variant='outlined'
                      value={this.state.text}
                      onChange={this.handleText}
                    />
                  </div>
                  <div>
                    <Button onClick={this.editTask} variant='outlined'>
                      save
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </Container>
        )}
      </Draggable>
    )
  }
}
