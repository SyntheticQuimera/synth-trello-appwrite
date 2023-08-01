import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { IoAddOutline } from "react-icons/io5";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export default function Column({ id, todos, index }: Props) {
  const [searchString] = useBoardStore((state) => [state.searchString]);
  const [setNewTaskType] = useBoardStore((state) => [state.setNewTaskType]);
  const [openAddModal] = useModalStore((state) => [state.openAddModal]);

  const handleAddTodo = () => {
    openAddModal();
    setNewTaskType(id);
  };

  return (
    // <Draggable draggableId={id} index={index}>
    //   {(provided) => (
    //     <div
    //       {...provided.draggableProps}
    //       {...provided.dragHandleProps}
    //       ref={provided.innerRef}
    //     >
    <div>
      <Droppable droppableId={index.toString()} type='card'>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`card card-body p-4 shadow-lg ${
              snapshot.isDraggingOver ? "bg-secondary" : "bg-base-100"
            }`}
          >
            <div className='card-title flex items-baseline justify-between'>
              <h2>{idToColumnText[id]}</h2>
              <span className='badge badge-lg badge-ghost text-base-content'>
                {!searchString
                  ? todos?.length
                  : todos.filter((todo) =>
                      todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    ).length}
              </span>
            </div>
            <div className='space-y-2 card card-body p-3'>
              {todos.map((todo, index) => {
                if (
                  searchString &&
                  !todo.title.toLowerCase().includes(searchString.toLowerCase())
                )
                  return null;

                return (
                  <Draggable
                    key={todo.$id}
                    draggableId={todo.$id}
                    index={index}
                  >
                    {(provided) => (
                      <TodoCard
                        todo={todo}
                        index={index}
                        id={id}
                        innerRef={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              <button
                onClick={handleAddTodo}
                className='btn btn-circle btn-success ms-auto'
              >
                <IoAddOutline size={24} />
              </button>
            </div>
          </div>
        )}
      </Droppable>
    </div>

    //     </div>
    //   )}
    // </Draggable>
  );
}
