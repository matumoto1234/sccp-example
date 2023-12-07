package main

import (
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		messages := findAllMessages(w, r)

		resp := convertToGETResponse(messages)

		json.NewEncoder(w).Encode(resp)

	case "POST":
		req := readPOSTRequest(r)

		saveMessage(req.Message)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
