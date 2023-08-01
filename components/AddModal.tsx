"use client";
import { useRef } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { IoCloseOutline, IoRemove } from "react-icons/io5";

export default function AddModal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const [addIsOpen, closeAddModal] = useModalStore((state) => [
    state.addIsOpen,
    state.closeAddModal,
  ]);
  const [newTaskInput, setNewTaskInput, newTaskType] = useBoardStore(
    (state) => [state.newTaskInput, state.setNewTaskInput, state.newTaskType]
  );

  const [addTask] = useBoardStore((state) => [state.addTask]);
  const [image, setImage] = useBoardStore((state) => [
    state.image,
    state.setImage,
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    addTask(newTaskInput, newTaskType, image);
    closeAddModal();
    setImage(null);
  };

  return (
    <Transition appear show={addIsOpen} as={Fragment}>
      <Dialog
        as='form'
        onClose={() => {
          closeAddModal();
          setImage(null);
        }}
        onSubmit={handleSubmit}
      >
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
          <div className='fixed overflow-auto inset-0 flex items-center justify-center p-4 backdrop-blur-sm'>
            <Dialog.Panel className='card bg-base-100 w-full md:w-96 '>
              <div className='card-body space-y-4'>
                <div className='card-title justify-between'>
                  <Dialog.Title className='text-lg font-bold'>
                    Add a Task
                  </Dialog.Title>
                  <button
                    onClick={() => {
                      closeAddModal();
                      setImage(null);
                    }}
                    className='btn btn-circle btn-sm btn-error'
                  >
                    <IoCloseOutline size={24} />
                  </button>
                </div>
                <div className='form-control space-y-4'>
                  <textarea
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className='textarea textarea-bordered rounded-box'
                    placeholder='Type here'
                  />
                  <TaskTypeRadioGroup />

                  {image && (
                    <div className='relative group rounded-box overflow-hidden shadow-md'>
                      <button
                        onClick={() => {
                          if (imagePickerRef.current) {
                            imagePickerRef.current.value = "";
                            setImage(null);
                          }
                        }}
                        className='btn btn-circle btn-sm btn-error absolute right-2 top-2 group-hover:opacity-100 group-focus:opacity-100 opacity-0 z-10'
                      >
                        <IoRemove size={24} />
                      </button>
                      <Image
                        src={URL.createObjectURL(image)}
                        alt='Upload image'
                        width={200}
                        height={200}
                        className='w-full h-44 object-cover filter group-hover:grayscale group-focus:grayscale transition-all duration-150'
                      />
                    </div>
                  )}
                  <input
                    ref={imagePickerRef}
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith("image/")) return;

                      setImage(e.target.files![0]);
                    }}
                    type='file'
                    className='file-input file-input-bordered file-input-primary w-full rounded-box'
                  />
                </div>
                <div className='card-actions justify-end'>
                  <button
                    className={`btn-primary btn  ${
                      !newTaskInput && "btn-disabled"
                    }`}
                  >
                    Add task
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
