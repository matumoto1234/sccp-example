package main

import (
	"database/sql"
	"net/http"
)

func findAllMessages(w http.ResponseWriter, r *http.Request) []string {
	db, _ := sql.Open("sqlite3", "./messages.db")
	defer db.Close()

	rows, _ := db.Query("SELECT message FROM messages")

	var messages []string

	for rows.Next() {
		var message string
		rows.Scan(&message)

		messages = append(messages, message)
	}

	return messages
}

type message struct {
	Message string `json:"message"`
}

type getResponse []message

func convertToGETResponse(messages []string) getResponse {
	var resp getResponse

	for _, m := range messages {
		resp = append(resp, message{Message: m})
	}

	return resp
}
