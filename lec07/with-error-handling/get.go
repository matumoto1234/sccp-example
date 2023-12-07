package main

import (
	"database/sql"
	"net/http"
)

func findAllMessages(w http.ResponseWriter, r *http.Request) ([]string, error) {
	db, err := sql.Open("sqlite3", "./messages.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT message FROM messages")
	if err != nil {
		return nil, err
	}

	var messages []string

	for rows.Next() {
		var message string

		if err := rows.Scan(&message); err != nil {
			return nil, err
		}

		messages = append(messages, message)
	}

	return messages, nil
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
