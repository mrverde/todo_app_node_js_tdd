const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");
const idTodo = require("../mock-data/id-todo.json");

let req, res, next;
todoId = "6078199935741d51e20fb9d4";

jest.mock("../../model/todo.model");
//equivale a:
// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("TodoModel.deleteTodo", () => {
  it("should have a deleteTodo function", () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });

  it("should call findByIdAndDelete", async () => {
    req.params.todoId = todoId;

    await TodoController.deleteTodo(req, res, next);

    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
  });

  it("should return 200 OK an deleted todomodel", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);

    await TodoController.deleteTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await TodoController.deleteTodo(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should handle 404", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);

    await TodoController.deleteTodo(req, res, next);

    expect(res.statusCode).toBe(404);
  });
});

describe("TodoController.updateTodo", () => {
  it("should have a updateTodo function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });

  it("should call TodoModel.findByIdAndUpdate with route parameters", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;

    await TodoController.updateTodo(req, res, next);
    TodoModel.findByIdAndUpdate(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });

    expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });

  it("should return 200 response code and json data", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;

    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);

    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when item doesn't exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.getTodoById", () => {
  it("should have a getTodo function", () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });

  it("should call TodoModel.findById with route parameters", async () => {
    req.params.todoId = todoId;

    await TodoController.getTodoById(req, res, next);

    expect(TodoModel.findById).toBeCalledWith(todoId);
  });

  it("should return 200 response code", async () => {
    TodoModel.findById.mockReturnValue(idTodo);
    await TodoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json todo data", async () => {
    TodoModel.findById.mockReturnValue(idTodo);
    await TodoController.getTodoById(req, res, next);

    expect(res._getJSONData()).toStrictEqual(idTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "The todo data couldn't be retrieved" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getTodoById(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when item doesn't exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.getTodos", () => {
  it("should have a getTodos function", () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });

  it("should call TodoModel.find", async () => {
    await TodoController.getTodos(req, res, next);

    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it("should return 200 response code", async () => {
    await TodoController.getTodos(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    await TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);

    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "The todos data couldn't be retrieved" };
    const rejectedPromise = Promise.reject(errorMessage);

    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  it("should call TodoModel.create", () => {
    req.body = newTodo;

    TodoController.createTodo(req, res, next);

    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    await TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
