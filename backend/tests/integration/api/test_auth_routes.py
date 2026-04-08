def test_login_route(client):
    response = client.post("/api/auth/login", data={"username": "test", "password": "test"})
    assert response.status_code == 200
