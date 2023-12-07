package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
)

type postRequest struct {
	Message string `json:"message"`
}

func readPOSTRequest(r *http.Request) *postRequest {
	body, _ := io.ReadAll(r.Body)

	var req *postRequest
	json.Unmarshal(body, &req)

	return req
}

func saveMessage(message string) {
	db, _ := sql.Open("sqlite3", "./messages.db")
	defer db.Close()

	tx, _ := db.Begin()

	tx.Exec("INSERT INTO messages (message) VALUES (?)", message)

	tx.Commit()
}
