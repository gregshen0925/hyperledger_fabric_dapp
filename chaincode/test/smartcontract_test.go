package test

import (
	"chaincode/dto"
	"chaincode/entity"
	"chaincode/smartcontract"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"testing"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-chaincode-go/shimtest"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/stretchr/testify/assert"
)

var Stub *shimtest.MockStub
var Scc *contractapi.ContractChaincode
var user1 dto.CreateUserDto = dto.CreateUserDto{
	Id:    "1",
	IdKey: "A123456789",
	Name:  "John Lee",
	Email: "john.lee@g.com",
}
var user2 dto.CreateUserDto = dto.CreateUserDto{
	Id:    "2",
	IdKey: "B123454321",
	Name:  "Amy Lin",
	Email: "amy.lin@g.com",
}
var updateUser1 dto.UpdateUserDto = dto.UpdateUserDto{
	Id:    "1",
	IdKey: "A123456789",
	Name:  "Johnn Leee",
	Email: "johnn.leee@g.com",
}
var transaction1 dto.CreateTransactionDto = dto.CreateTransactionDto{
	Id:           "1",
	IdKey:        "A123456789",
	Hash:         "gjqi3gjrvfauv904u2fjnklwqf",
	Amount:       100.11,
	CurrencyType: "USD",
	CreatedAt:    "20211028",
}
var transaction2 dto.CreateTransactionDto = dto.CreateTransactionDto{
	Id:           "1",
	IdKey:        "A123456789",
	Hash:         "90ur9wjfilq4k3mnfgqwiauo",
	Amount:       100.22,
	CurrencyType: "TWD",
	CreatedAt:    "20211028",
}

func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	os.Exit(code)
}
func setup() {
	log.SetOutput(ioutil.Discard)
}
func NewStub() {
	Scc, err := contractapi.NewChaincode(new(smartcontract.SmartContract))
	if err != nil {
		log.Println("NewChaincode failed", err)
		os.Exit(0)
	}
	Stub = shimtest.NewMockStub("main", Scc)
}
func Test_CreateUser(t *testing.T) {
	fmt.Println("Test_CreateUser-----------------")
	NewStub()

	err := MockCreateUser(user1)
	if err != nil {
		t.FailNow()
	}
	fmt.Println("success")
	fmt.Println()
}
func Test_UserExists(t *testing.T) {
	fmt.Println("Test_UserExists-----------------")
	NewStub()

	err := MockCreateUser(user1)
	if err != nil {
		t.FailNow()
	}

	result, err := MockUserExists(user1.Id)
	if err != nil {
		t.FailNow()
	}
	fmt.Println("User Exist:", result)
	fmt.Println()

	assert.Equal(t, result, true)
}
func Test_UpdateUser(t *testing.T) {
	fmt.Println("Test_UpdateUser-----------------")
	NewStub()

	err := MockCreateUser(user1)
	if err != nil {
		t.FailNow()
	}

	MockUpdateUser(updateUser1)

	userJson, err := MockGetUserById(user1.Id)
	if err != nil {
		fmt.Println("get User", err)
	}
	fmt.Println("UpdateUser1: ", *userJson)
	fmt.Println()
	assert.Equal(t, userJson.IdKey, updateUser1.IdKey)
	assert.Equal(t, userJson.Name, updateUser1.Name)
	assert.Equal(t, userJson.Email, updateUser1.Email)

}
func Test_GetUserById(t *testing.T) {
	fmt.Println("Test_GetUserById-----------------")
	NewStub()

	err := MockCreateUser(user1)
	if err != nil {
		t.FailNow()
	}

	userJson, err := MockGetUserById(user1.Id)
	if err != nil {
		fmt.Println("get User error", err)
	}
	fmt.Println("GetUser1: ", *userJson)
	fmt.Println()
	assert.Equal(t, userJson.IdKey, user1.IdKey)
	assert.Equal(t, userJson.Name, user1.Name)
	assert.Equal(t, userJson.Email, user1.Email)
}
func Test_GetUserList(t *testing.T) {
	fmt.Println("Test_GetUserList-----------------")
	NewStub()

	MockCreateUser(user1)
	MockCreateUser(user2)

	users, err := MockGetUserList()
	if err != nil {
		fmt.Println("GetUserList error", err)
	}
	fmt.Println("GetUserList: ", users)
	fmt.Println()
	assert.Equal(t, len(users), 2)
}

func Test_CreateTransaction(t *testing.T) {
	fmt.Println("Test_CreateTransaction-----------------")
	NewStub()

	err := MockCreateUser(user1)
	if err != nil {
		t.FailNow()
	}

	MockCreateTransaction(transaction1)
	MockCreateTransaction(transaction2)

	userJson, err := MockGetUserAndTxById(user1.Id)
	if err != nil {
		fmt.Println("get User", err)
	}
	fmt.Println("userJson: ", *userJson)
	fmt.Println()
	assert.Equal(t, userJson.IdKey, user1.IdKey)
	assert.Equal(t, userJson.Transaction[0].Amount, transaction1.Amount)
	assert.Equal(t, userJson.Transaction[0].CurrencyType, transaction1.CurrencyType)
	assert.Equal(t, userJson.Transaction[0].CreatedAt, transaction1.CreatedAt)
}

func Test_TxHashExists(t *testing.T) {
	fmt.Println("Test_TxHashExists-----------------")
	NewStub()

	err := MockCreateUser(user1)
	if err != nil {
		t.FailNow()
	}

	MockCreateTransaction(transaction1)
	userJson, err := MockGetUserAndTxById(user1.Id)
	if err != nil {
		fmt.Println("get User", err)
	}
	fmt.Println("userJson: ", *userJson)
	hashToTest := userJson.Transaction[0].Hash
	result, err := MockTxHashExists(hashToTest)
	if err != nil {
		t.FailNow()
	}
	fmt.Println("TxHash Exist:", result)
	fmt.Println()

	assert.Equal(t, result, true)
}

//Mock Function
func MockUserExists(id string) (bool, error) {
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("UserExists"),
			[]byte(id),
		})
	if res.Status != shim.OK {
		return false, errors.New("UserExists error")
	}
	var result bool = false
	json.Unmarshal(res.Payload, &result)
	return result, nil
}
func MockCreateUser(user dto.CreateUserDto) error {
	userJson, err := json.Marshal(user)
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("CreateUser"),
			[]byte(userJson),
		})
	if err != nil {
		fmt.Println(err)
		return err
	}
	if res.Status != shim.OK {
		fmt.Println("CreateUser failed", string(res.Message))
		return errors.New("CreateUser error")
	}

	return nil
}
func MockGetUserById(id string) (*entity.GetUserById, error) {
	var result entity.GetUserById
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("GetUserById"),
			[]byte(id),
		})
	if res.Status != shim.OK {
		fmt.Println("GetUserById failed", string(res.Message))
		return nil, errors.New("GetUserById error")
	}
	json.Unmarshal(res.Payload, &result)
	return &result, nil
}
func MockGetUserAndTxById(id string) (*entity.User, error) {
	var result entity.User
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("GetUserAndTxById"),
			[]byte(id),
		})
	if res.Status != shim.OK {
		fmt.Println("GetUserAndTxById failed", string(res.Message))
		return nil, errors.New("GetUserAndTxById error")
	}
	json.Unmarshal(res.Payload, &result)
	return &result, nil
}
func MockGetUserList() ([]entity.GetUserList, error) {
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("GetUserList"),
		})
	if res.Status != shim.OK {
		fmt.Println("GetUserList failed", string(res.Message))
		return nil, errors.New("GetUserList error")
	}
	var users []*entity.GetUserList
	json.Unmarshal(res.Payload, &users)
	var userList []entity.GetUserList
	for i := 0; i < len(users); i++ {
		var address = users[i]
		userList = append(userList, *address)
	}
	return userList, nil
}
func MockUpdateUser(user dto.UpdateUserDto) error {
	userJson, err := json.Marshal(user)

	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("UpdateUser"),
			[]byte(userJson),
		})
	if err != nil {
		fmt.Println(err)
		return err
	}
	if res.Status != shim.OK {
		fmt.Println("UpdateUser failed", string(res.Message))
		return errors.New("UpdateUser error")
	}
	return nil
}
func MockCreateTransaction(transaction dto.CreateTransactionDto) error {
	txJson, err := json.Marshal(transaction)
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("CreateTransaction"),
			[]byte(txJson),
		})
	if err != nil {
		fmt.Println(err)
		return err
	}
	if res.Status != shim.OK {
		fmt.Println("CreateTransaction failed", string(res.Message))
		return errors.New("CreateTransaction error")
	}
	return nil
}
func MockTxHashExists(hash string) (bool, error) {
	res := Stub.MockInvoke("uuid",
		[][]byte{
			[]byte("TxHashExists"),
			[]byte(hash),
		})
	if res.Status != shim.OK {
		return false, errors.New("txHashExists error")
	}
	var result bool = false
	json.Unmarshal(res.Payload, &result)
	return result, nil
}
