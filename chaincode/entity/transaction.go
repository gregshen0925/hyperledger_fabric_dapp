package entity

type Transaction struct {
	Hash         string  `json:"hash"`
	Amount       float32 `json:"amount"`
	CurrencyType string  `json:"currency_type"`
	CreatedAt    string  `json:"created_at"`
}
