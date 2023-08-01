import { ID, databases, storage } from '@/appwrite';
import { getTodosGrouped } from '@/lib/getTodosGrouped';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
    newTaskType: TypedColumn;
    setNewTaskType: (newTaskType: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
    image: File | null;
    setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    newTaskInput: '',
    newTaskType: "todo",
    image: null,
    searchString: '',
    setSearchString: (searchString) => set({ searchString }),

    getBoard: async () => {
        const board = await getTodosGrouped()
        set({ board })
    },

    setImage: (image: File | null) => set({ image }),

    setNewTaskInput: ((input: string) => set({ newTaskInput: input })),

    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

    setBoardState: (board) => set({ board }),

    addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
        // Declare a variable to hold the uploaded image data
        let file: Image | undefined;

        // Check if an image is provided
        if (image) {
            // Upload the image using the 'uploadImage' function 
            const fileUploaded = await uploadImage(image);

            // If the image upload is successful, create an object with the necessary image data
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                };
            }
        }

        // Create a new document in the database with the provided todo, columnId, and optional image
        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file) }) // Include image if available
            }
        );

        // Clear the 'newTaskInput' field to prepare for adding a new task
        set({ newTaskInput: "" });
        // Update the state using the 'set' function
        set((state) => {
            // Make a copy of the existing columns map to avoid direct state mutation
            const newColumns = new Map(state.board.columns);

            // Create a new Todo object representing the new task
            const newTodo: Todo = {
                $id,
                $createAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && { image: file }) // Include image if available
            };

            // Get the column associated with the provided columnId from the columns map
            const column = newColumns.get(columnId);

            // Check if the column exists or not
            if (!column) {
                // If the column doesn't exist, create a new column in the map with the new task
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo]
                });
            } else {
                // If the column already exists, add the new task to its todos list
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            // Return the updated state with the modified columns map
            return { board: { columns: newColumns } };
        });
    },


    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {

        const newColumns = new Map(get().board.columns)

        newColumns.get(id)?.todos.splice(taskIndex, 1)

        set({ board: { columns: newColumns } })

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )

    },

    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    }
}))

