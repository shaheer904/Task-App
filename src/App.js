import React from 'react'
import ReactDOM from 'react-dom'
import '@atlaskit/css-reset'
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import initialData from './index.data'
import Column from './components/Column/index'

const Container = styled.div`
  display: flex;
`
class InnerList extends React.PureComponent {
  render() {
    const { column, taskMap, index } = this.props
    const tasks = column.taskIds.map((taskId) => taskMap[taskId])
    return <Column column={column} tasks={tasks} index={index} />
  }
}

class App extends React.Component {
  state = initialData

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

    const good = this.state.columnOrder.findIndex(
      (e) => e === source.droppableId
    )
    console.log(good)
    const good123 = this.state.columnOrder.findIndex(
      (e) => e === destination.droppableId
    )
    console.log(good123)

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      }
      this.setState(newState)
      return
    }

    const home = this.state.columns[source.droppableId]
    const foreign = this.state.columns[destination.droppableId]
    console.log('>>>>>', result.draggableId)

    if (home === foreign) {
      const newTaskIds = Array.from(home.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newHome = {
        ...home,
        taskIds: newTaskIds,
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newHome.id]: newHome,
        },
      }

      this.setState(newState)

      return
    }
    console.log(result)

    const left = this.state.tasks[result.draggableId].position.find(
      (e) => e === 'left'
    )
    const right = this.state.tasks[result.draggableId].position.find(
      (e) => e === 'right'
    )

    console.log(left)
    if (right === 'right' && good < good123) {
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
        ...this.state,
        columns: {
          ...this.state.columns,
          [newHome.id]: newHome,
          [newForeign.id]: newForeign,
        },
      }
      this.setState(newState)
    }
    if (left === 'left' && good > good123) {
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
        ...this.state,
        columns: {
          ...this.state.columns,
          [newHome.id]: newHome,
          [newForeign.id]: newForeign,
        },
      }
      this.setState(newState)
    }
  }
  render() {
    return (
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
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId]
                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}
                  />
                )
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
export default App
