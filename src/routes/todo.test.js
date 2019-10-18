const request = require("supertest");
const app = require("../app");

describe("Todo", () => {
  const createUser = async user => {
    return await request(app)
      .post("/users/create")
      .set("Content-Type", "application/json")
      .send(user);
  };

  let user;

  beforeEach(async () => {
    const response = await createUser({
      username: "john",
      password: "password",
    });
    user = response.body;
  });

  it("new user should have no todoList", async () => {
    expect(user.username).toBe("john");
    expect(user.todoLists).toEqual([]);
  });

  const post = async (route, body) => {
    return await request(app)
      .post(route)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${user.jwt}`)
      .send(body);
  };

  const deleteRoute = async route => {
    return await request(app)
      .delete(route)
      .set("authorization", `Bearer ${user.jwt}`);
  };

  const patchRoute = async (route, body) => {
    return await request(app)
      .patch(route)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${user.jwt}`)
      .send(body);
  };

  const createTodolist = async title => {
    const route = `/users/${user.username}/todolists/new`;
    return await post(route, { title });
  };

  const createTodo = async (listId, item) => {
    const route = `/users/${user.username}/todolists/${listId}/todos`;
    return await post(route, { item });
  };

  const getUserData = async () => {
    return await request(app)
      .get("/users/me")
      .set("authorization", `Bearer ${user.jwt}`);
  };

  describe("/todolists/new", () => {
    it("POST should return 403 if username does not match jwt", async () => {
      await createUser({
        username: "alice",
        password: "password",
      });
      const route = `/users/alice/todolists/new`;
      const response = await request(app)
        .post(route)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user.jwt}`)
        .send({ title: "new todolist" });
      expect(response.status).toBe(403);
    });

    it("POST should create a new todolist with title", async () => {
      const title = "my first todos";
      const response = await createTodolist(title);

      expect(response.status).toBe(200);
      expect(response.body.todoLists).toMatchObject([{ title, todos: [] }]);
    });
  });

  describe("/todolists/:id", () => {
    it("DELETE should delete the todolist", async () => {
      const listResponse = await createTodolist("my todo");
      const { todoLists } = listResponse.body;
      const route = `/users/${user.username}/todolists/${todoLists[0]._id}`;
      await deleteRoute(route);

      const response = await getUserData();
      expect(response.body.todoLists).toEqual([]);
    });
  });

  describe("/todolists/:listId/todos", () => {
    it("POST should create new todo item", async () => {
      const listResponse = await createTodolist("My List");
      const todolistId = listResponse.body.todoLists[0]._id;

      const createTodoResponse = await createTodo(todolistId, "Buy Milk");
      expect(createTodoResponse.status).toBe(201);

      const response = await getUserData();
      expect(response.body.todoLists).toMatchObject([
        { title: "My List", todos: [{ item: "Buy Milk", isDone: false }] },
      ]);
    });
  });

  describe("/todolists/:listId/todos/:todoId", () => {
    let route;

    beforeEach(async () => {
      const listResponse = await createTodolist("My List");
      const todolistId = listResponse.body.todoLists[0]._id;

      await createTodo(todolistId, "Buy Milk");
      const response = await getUserData();
      const todoList = response.body.todoLists[0];
      const todoItem = todoList.todos[0];
      route = `/users/${user.username}/todolists/${todoList._id}/todos/${todoItem._id}`;
    });

    it("DELETE should remove a todo item", async () => {
      await deleteRoute(route);

      const response = await getUserData();
      const todoList = response.body.todoLists[0];
      expect(todoList.todos).toEqual([]);
    });

    it("Patch should edit a todo item", async () => {
      await patchRoute(route, { item: "new name", isDone: true });

      const response = await getUserData();
      const todo = response.body.todoLists[0].todos[0];
      expect(todo).toMatchObject({
        item: "new name",
        isDone: true,
      });
    });
  });
});
