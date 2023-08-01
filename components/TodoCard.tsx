"use client";
import getUrl from "@/lib/getUrl";
import { useModalStore } from "@/store/ModalStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { IoCloseOutline } from "react-icons/io5";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export default function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const openDeleteModal = useModalStore((state) => state.openDeleteModal);
  const handleDeleteButtonClick = () => {
    openDeleteModal(todo, index, id);
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };

      fetchImage();
    }
    setLoading(false);
  }, [todo]);

  return (
    <>
      <div
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
        className='card rounded-lg bg-base-200 shadow-lg overflow-hidden'
      >
        <div className='card-body p-0 flex flex-col'>
          <div className='flex justify-between items-center p-3'>
            <p>{todo.title}</p>
            <button
              onClick={handleDeleteButtonClick}
              className='btn btn-circle btn-sm btn-error'
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          <>
            {loading ? (
              <div className='flex justify-center items-center w-full h-16'>
                <span className='loading loading-infinity loading-lg'></span>
              </div>
            ) : (
              <>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt='Task image'
                    width={400}
                    height={400}
                    className='w-full object-contain'
                  />
                )}
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
}
