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

func readPOSTRequest(r *http.Request) (*postRequest, error) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}

	var req *postRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, err
	}

	return req, nil
}

func saveMessage(message string) error {
	db, err := sql.Open("sqlite3", "./messages.db")
	if err != nil {
		return err
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	_, err = tx.Exec("INSERT INTO messages (message) VALUES (?)", message)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
