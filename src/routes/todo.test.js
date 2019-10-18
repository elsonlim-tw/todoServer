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
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${user.jwt}`);
  };

  const createTodolist = async title => {
    const route = `/users/${user.username}/todolists/new`;
    return await post(route, { title });
  };

  const getUserData = async () => {
    return await request(app)
      .get("/users/me")
      .set("authorization", `Bearer ${user.jwt}`);
  };

  describe("/todolists/new", () => {
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
});
