import { useState, useEffect } from "react";
import { deleteTodoById } from "../../api/deleteTodoById";
import { ErrorWrapper, isErrorWrapper } from "../../api/errors";
import { getTodoList } from "../../api/getTodoList";
import style from "./index.module.css";
import { postNewTodo } from "../../api/postNewTodo";

export type Todo = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
};

const toStatus = (status: string): "pending" | "in-progress" | "done" => {
  switch (status) {
    case "pending":
      return "pending";
    case "in-progress":
      return "in-progress";
    case "done":
      return "done";
    default:
      return "pending";
  }
};

export const useTodoCardList = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const createTodo = (title: string, description: string, status: string) => {
    postNewTodo({
      title,
      description,
      status: toStatus(status),
    }).then((res: null | ErrorWrapper) => {
      if (isErrorWrapper(res)) {
        alert(`Todoを作成できませんでした: ` + res.error.message);
      } else {
        getTodoList().then((res: ErrorWrapper | Todo[]) => {
          if (isErrorWrapper(res)) {
            alert(`Todoリストを取得できませんでした: ` + res.error.message);
          } else {
            setTodoList(res);
          }
        });
      }
    });
  };

  return {
    todoList,
    setTodoList,
    createTodo,
  };
};

type TodoCardListProps = {
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoCardList: React.FC<TodoCardListProps> = ({
  todoList,
  setTodoList,
}) => {
  useEffect(() => {
    getTodoList().then((res: ErrorWrapper | Todo[]) => {
      if (isErrorWrapper(res)) {
        alert(`Todoリストを取得できませんでした: ` + res.error.message);
      } else {
        setTodoList(res);
      }
    });
  }, [setTodoList]);

  const onClickDeleteButton = (id: string) => {
    deleteTodoById(id).then((res: ErrorWrapper | null) => {
      if (isErrorWrapper(res)) {
        alert(`id:${id}のTodoを削除できませんでした` + res.error.message);
      } else {
        setTodoList(
          todoList.filter((todoCard) => {
            return todoCard.id !== id;
          })
        );
      }
    });
  };

  return (
    <div className={style.todoCardList}>
      {todoList.map((todoCard) => {
        return (
          <TodoCard
            todoCard={todoCard}
            key={todoCard.id}
            onClickDeleteButton={onClickDeleteButton}
          />
        );
      })}
    </div>
  );
};

type TodoCardProps = {
  todoCard: Todo;
  onClickDeleteButton: (id: string) => void;
};

const TodoCard: React.FC<TodoCardProps> = ({
  todoCard,
  onClickDeleteButton,
}) => {
  return (
    <div className={style.todoCard}>
      <div className={style.todoCardTitle}>{todoCard.title}</div>
      <div className={style.todoCardDescription}>{todoCard.description}</div>
      <div className={style.todoCardStatus}>{todoCard.status}</div>
      <button
        className={style.todoCardDeleteButton}
        onClick={() => onClickDeleteButton(todoCard.id)}
      >
        Delete
      </button>
    </div>
  );
};
