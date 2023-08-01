import { create } from 'zustand'

interface ModalState {
    addIsOpen: boolean;
    openAddModal: () => void;
    closeAddModal: () => void;

    selectedTodo: Todo | null;
    selectedTodoIndex: number | null;
    selectedTodoId: TypedColumn | null;
    deleteIsOpen: boolean;
    openDeleteModal: (todo: Todo, index: number, id: TypedColumn) => void
    closeDeleteModal: () => void;
}

export const useModalStore = create<ModalState>()(set => ({
    addIsOpen: false,
    openAddModal: () => set({
        addIsOpen: true
    }),
    closeAddModal: () => set({ addIsOpen: false }),

    selectedTodo: null,
    selectedTodoIndex: -1,
    selectedTodoId: null,
    deleteIsOpen: false,
    openDeleteModal: (todo, index, id) => set({ deleteIsOpen: true, selectedTodo: todo, selectedTodoIndex: index, selectedTodoId: id }), // Actualización de la acción para abrir el modal de borrado y almacenar la información del TodoCard seleccionado
    closeDeleteModal: () => set({ deleteIsOpen: false, selectedTodo: null, selectedTodoIndex: null, selectedTodoId: null })
}))