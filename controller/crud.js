const url = "http://localhost:3000";

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${url}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error("Request failed");
    }

    return await res.json();
  } catch (error) {
    console.log("Error:", error);
  }
}

export function getData(endpoint) {
  return request(endpoint);
}

export function getSingleData(endpoint, id) {
  return request(`${endpoint}/${id}`);
}

export function postData(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteData(endpoint, id) {
  return request(`${endpoint}/${id}`, {
    method: "DELETE",
  });
}

export function putData(endpoint, id, data) {
  return request(`${endpoint}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
