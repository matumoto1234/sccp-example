import { FormEventHandler } from "react";
import { TodoCardList, useTodoCardList } from "./components/TodoCard";

const useApp = () => {
  const { todoList, setTodoList, createTodo } = useTodoCardList();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const status = form.get("status") || "";
    if (title === "" || description === "" || status === "") {
      alert("全ての項目を入力してください");
      return;
    }
    createTodo(title.toString(), description.toString(), status.toString());
  };

  return {
    todoList,
    setTodoList,
    handleSubmit,
  };
};

const App: React.FC = () => {
  const { todoList, setTodoList, handleSubmit } = useApp();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" defaultValue="" />
        </label>
        <label>
          Description:
          <input type="text" name="description" defaultValue="" />
        </label>
        <label>
          Status:
          <select name="status">
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="done">done</option>
          </select>
        </label>
        <input type="submit" value="Create TODO" />
      </form>
      <TodoCardList todoList={todoList} setTodoList={setTodoList} />
    </>
  );
};

export default App;
