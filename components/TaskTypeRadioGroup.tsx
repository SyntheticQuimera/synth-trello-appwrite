import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import React from "react";
import { IoCheckbox, IoCheckmarkCircle } from "react-icons/io5";

const types = [
  {
    id: "todo",
    name: "Todo",
    description: "A new task to be completed",
    color: "textarea-error",
    background: "bg-error text-error-content",
  },
  {
    id: "inProgress",
    name: "In Progress",
    description: "A task that is currently being worked on",
    color: "textarea-warning",
    background: "bg-warning text-warning-content",
  },
  {
    id: "done",
    name: "Done",
    description: "A task that has been completed",
    color: "textarea-success",
    background: "bg-success text-success-content",
  },
];

export default function TaskTypeRadioGroup() {
  const [setNewTaskType, newTaskType] = useBoardStore((state) => [
    state.setNewTaskType,
    state.newTaskType,
  ]);
  return (
    <div className='w-full'>
      <RadioGroup value={newTaskType} onChange={(e) => setNewTaskType(e)}>
        <div className='space-y-2'>
          {types.map((type) => (
            <RadioGroup.Option
              key={type.id}
              value={type.id}
              className={({ active, checked }) =>
                `        ${active ? `${type.color}` : ""}  
                  ${checked ? `${type.background}` : "bg-base-100"}
                  textarea textarea-bordered md:h-16 rounded-box cursor-pointer`
              }
            >
              {({ checked }) => (
                <>
                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col'>
                      <RadioGroup.Label
                        as='span'
                        className='block text-sm font-medium'
                      >
                        {type.name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as='span'
                        className='block text-sm'
                      >
                        {type.description}
                      </RadioGroup.Description>
                    </div>
                    {checked && (
                      <div className='shrink-0 text-2xl'>
                        <IoCheckmarkCircle />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
