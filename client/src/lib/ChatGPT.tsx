export interface RequestMessage {
  role: string;
  content: string;
}

export const sendChatGPTAPI = async (requestMessage: RequestMessage[]) => {
  let res = "";
  const request = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(requestMessage),
  };

  await fetch("http://localhost:8080/response_chatgpt", request)
    .then((r) => {
      return r.text();
    })
    .then((rd) => (res = rd));

  console.log(res);
  return res;
};
