import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "jnYc2snzzFZes5yr1TnS2l0ny7nB1Fyvlj8bq9wZ",
  "X-Parse-JavaScript-Key": "iDYRd5O3Z2SnyfafWPneaqHiztKFSxFISMGqoBIY",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, {
    headers: headers,
  });
  return response.data.results;
}

export async function getTarefa(id) {
  const response = await axios.get(`${urlBase}/${id}`, {
    headers: headers,
  });
  return response.data;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa, {
    headers: headersJson,
  });
  return response.data;
}

export async function atualizarTarefa(tarefaAtualizada) {
  const response = await axios.put(
    `${urlBase}/${tarefaAtualizada.id}`,
    tarefaAtualizada,
    {
      headers: headersJson,
    },
  );
  return response.data;
}

export async function removerTarefa(id) {
  const response = await axios.delete(`${urlBase}/${id}`, {
    headers: headers,
  });
  return response.data;
}
