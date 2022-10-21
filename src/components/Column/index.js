import React from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from '../Task/index'

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
  handleupdate = (taskId, data) => {
    console.log('column', taskId, data)
    this.props.setData(taskId, data)
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
                      setData={this.handleupdate.bind(this)}
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
