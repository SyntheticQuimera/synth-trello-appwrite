"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";

export default function DeleteModal() {
  const [
    deleteIsOpen,
    closeDeleteModal,
    selectedTodo,
    selectedTodoIndex,
    selectedTodoId,
  ] = useModalStore((state) => [
    state.deleteIsOpen,
    state.closeDeleteModal,
    state.selectedTodo,
    state.selectedTodoIndex,
    state.selectedTodoId,
  ]);

  const deleteTask = useBoardStore((state) => state.deleteTask);

  const handleDelete = () => {
    deleteTask(selectedTodoIndex!, selectedTodo!, selectedTodoId!);
    closeDeleteModal();
  };

  return (
    <Transition appear show={deleteIsOpen} as={Fragment}>
      <Dialog onClose={closeDeleteModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30' />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div className='fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm'>
            <Dialog.Panel className='card bg-base-100 w-full md:w-96 '>
              <form method='dialog' className='card-body'>
                <div className='card-title'>
                  <Dialog.Title className='text-lg font-bold'>
                    Delete&nbsp;{selectedTodo?.title}
                  </Dialog.Title>
                </div>
                <p className='py-4'>Do you want to delete this task?</p>
                <div className='card-actions justify-end'>
                  <button
                    onClick={handleDelete}
                    className='btn-error btn btn-circle'
                  >
                    Yes
                  </button>
                  <button onClick={closeDeleteModal} className='btn btn-circle'>
                    No
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
