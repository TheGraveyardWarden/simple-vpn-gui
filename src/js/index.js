window.onload = () => {
  let connect_btn = document.querySelector("#connect-btn");
  let is_connected = false;

  connect_btn.addEventListener("click", connect);

  function set_connected(v) {
    is_connected = v;

    if (v) {
      connect_btn.classList.add("btn-disconnect");
      connect_btn.innerText = "disconnect";
    } else {
      connect_btn.classList.remove("btn-disconnect");
      connect_btn.innerText = "connect";
    }
  }
 
  function connect() {
    if (!is_connected) {
      window.bridge.connect()
    } else {
      window.bridge.disconnect();
    }

    set_connected(!is_connected);
  }

  window.bridge.onConnect((_, data) => {
    console.log(data);
  });

  window.bridge.onFinish((_) => {
    set_connected(false);
  })
}
