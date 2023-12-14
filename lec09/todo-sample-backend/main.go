package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

type TodoStatus string

const (
	TodoStatusPending    TodoStatus = "pending"
	TodoStatusInProgress TodoStatus = "in-progress"
	TodoStatusDone       TodoStatus = "done"
)

type Todo struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TodoStatus `json:"status"`
}

func todoListHandler(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./todo.db")
	if err != nil {
		log.Print(err)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, title, description, status FROM todos")
	if err != nil {
		log.Print(err)
		return
	}

	todoList := []Todo{}

	for rows.Next() {
		var id int
		var title, description, status string
		rows.Scan(&id, &title, &description, &status)

		todoList = append(todoList, Todo{
			ID:          id,
			Title:       title,
			Description: description,
			Status:      TodoStatus(status),
		})
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,UPDATE,OPTIONS")

	err = json.NewEncoder(w).Encode(todoList)
	if err != nil {
		log.Print(err)
		return
	}
}

type postRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func todoHandler(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Print(err)
		return
	}

	var req *postRequest
	if err := json.Unmarshal(body, &req); err != nil {
		log.Print(err)
		return
	}

	db, err := sql.Open("sqlite3", "./todo.db")
	if err != nil {
		log.Print(err)
		return
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		log.Print(err)
		return
	}

	_, err = tx.Exec("INSERT INTO todos (title, description, status) VALUES (?, ?, ?)", req.Title, req.Description, req.Status)
	if err != nil {
		log.Print(err)
		tx.Rollback()
		return
	}

	if err := tx.Commit(); err != nil {
		log.Print(err)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,UPDATE,OPTIONS")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func main() {
	log.Println("server started.")
	http.HandleFunc("/todo-list", todoListHandler)
	http.HandleFunc("/todo", todoHandler)
	http.ListenAndServe(":8080", nil)
}
