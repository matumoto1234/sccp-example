import style from "./index.module.css";

export type Todo = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
};

type TodoCardListProps = {
  todoCardList: Todo[];
};

export const TodoCardList: React.FC<TodoCardListProps> = ({ todoCardList }) => {
  return (
    <div className={style.todoCardList}>
      {todoCardList.map((todoCard) => {
        return <TodoCard todoCard={todoCard} />;
      })}
    </div>
  );
};

type TodoCardProps = {
  todoCard: Todo;
};

const TodoCard: React.FC<TodoCardProps> = ({ todoCard }) => {
  return (
    <div className={style.todoCard}>
      <div className={style.todoCardTitle}>{todoCard.title}</div>
      <div className={style.todoCardDescription}>{todoCard.description}</div>
      <div className={style.todoCardStatus}>{todoCard.status}</div>
    </div>
  );
};
