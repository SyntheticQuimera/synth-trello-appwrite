"use client";
import { useState } from "react";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  const [loading, setLoading] = useState<boolean>(false);
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    setLoading(true);
    getBoard();
    setLoading(false);
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // If there is no destination, the item was dropped outside a valid drop target.
    if (!destination) return;

    // If the dragged item is a "column," reordering of columns is performed.
    if (type === "column") {
      // Create a shallow copy of the columns array to manipulate its order.
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);

      // Update the board state with the reordered columns.
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // Convert the columns Map to an array for easier access and indexing.
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    // If the start or finish columns are not found, return without making any changes.
    if (!startColIndex || !finishColIndex) return;

    // Extract the necessary data of the start and finish columns for manipulation.
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    // If the start and finish columns are the same, and the item is dropped at the same index, return.
    if (source.index === destination.index && startCol === finishCol) return;

    // Create a new array to manipulate the todos of the start column.
    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // If the item is moved within the same column, insert the todo at the new index.
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      // Create a new Map with the updated start column and set it as the new board state.
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      // If the item is moved to a different column, insert it at the new index of the finish column.
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      // Create a new Map with updated start and finish columns and set it as the new board state.
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      updateTodoInDB(todoMoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <>
      <div className=' w-full fixed top-0 h-full bg-gradient-to-br from-secondary to-primary rounded-md filter blur-[300px] opacity-50 -z-50' />

      {loading ? (
        <div className='flex justify-center items-center w-full h-96'>
          <span className='loading loading-infinity loading-lg'></span>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {/* <Droppable droppableId='board' direction='horizontal' type='column'>
            {(provided) => (
              <div
                className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto p-4'
                {...provided.droppableProps}
                ref={provided.innerRef}
              > */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto p-4'>
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
          {/* </div>
            )}
          </Droppable> */}
        </DragDropContext>
      )}
    </>
  );
}
