self.onmessage = (e) => {
  const input = e.data;
  // TODO: 계산 로직 연결
  self.postMessage({ result: 'ok', input });
};
